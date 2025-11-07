import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy, 
  limit,
  Timestamp,
  writeBatch
} from 'firebase/firestore';
import { storage, db } from '../lib/firebase-native';

// Enterprise file management types
export interface FileRecord {
  id: string;
  name: string;
  originalName: string;
  type: 'pdf' | 'png' | 'jpg' | 'jpeg' | 'csv' | 'txt' | 'docx' | 'xlsx';
  size: number;
  url: string;
  storagePath: string;
  uploadedBy: string;
  uploadedAt: Date;
  lastModified: Date;
  assessmentId?: string;
  clientId?: string;
  category: 'assessment' | 'report' | 'diagram' | 'data' | 'documentation' | 'template';
  tags: string[];
  isProcessed: boolean;
  processingStatus?: 'pending' | 'processing' | 'completed' | 'failed';
  processingResults?: {
    textExtracted?: string;
    imageAnalysis?: any;
    structuredData?: any;
    aiInsights?: string;
  };
  metadata: {
    dimensions?: { width: number; height: number };
    pages?: number;
    encoding?: string;
    checksum: string;
  };
  accessLevel: 'public' | 'team' | 'private' | 'client';
  downloadCount: number;
  version: number;
  parentFileId?: string; // For file versions
}

export interface FileUploadProgress {
  fileId: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
}

export interface FileSearchFilters {
  type?: string[];
  category?: string[];
  assessmentId?: string;
  clientId?: string;
  uploadedBy?: string;
  dateRange?: { start: Date; end: Date };
  tags?: string[];
  textSearch?: string;
}

export class FileManagementService {
  private static instance: FileManagementService;
  private uploadProgressCallbacks = new Map<string, (progress: FileUploadProgress) => void>();

  static getInstance(): FileManagementService {
    if (!FileManagementService.instance) {
      FileManagementService.instance = new FileManagementService();
    }
    return FileManagementService.instance;
  }

  // Upload file with progress tracking and metadata extraction
  async uploadFile(
    file: File,
    category: FileRecord['category'],
    metadata: Partial<FileRecord> = {},
    onProgress?: (progress: FileUploadProgress) => void
  ): Promise<FileRecord> {
    const fileId = `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const fileExtension = file.name.split('.').pop()?.toLowerCase() as FileRecord['type'];
    
    if (!this.isValidFileType(fileExtension)) {
      throw new Error(`Unsupported file type: ${fileExtension}`);
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      throw new Error('File size exceeds 50MB limit');
    }

    const storagePath = `files/${category}/${fileId}.${fileExtension}`;
    const storageRef = ref(storage, storagePath);

    try {
      // Setup progress tracking
      if (onProgress) {
        this.uploadProgressCallbacks.set(fileId, onProgress);
      }

      // Upload with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file, {
        contentType: file.type,
        customMetadata: {
          category,
          uploadedBy: metadata.uploadedBy || 'unknown',
          originalName: file.name
        }
      });

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            const progressUpdate: FileUploadProgress = {
              fileId,
              progress,
              status: 'uploading'
            };
            
            if (onProgress) {
              onProgress(progressUpdate);
            }
          },
          (error) => {
            this.uploadProgressCallbacks.delete(fileId);
            const progressUpdate: FileUploadProgress = {
              fileId,
              progress: 0,
              status: 'error',
              error: error.message
            };
            
            if (onProgress) {
              onProgress(progressUpdate);
            }
            reject(error);
          },
          async () => {
            try {
              // Get download URL
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              
              // Calculate checksum (simplified)
              const checksum = await this.calculateFileChecksum(file);
              
              // Extract file metadata
              const fileMetadata = await this.extractFileMetadata(file);
              
              // Create file record
              const fileRecord: FileRecord = {
                id: fileId,
                name: `${fileId}.${fileExtension}`,
                originalName: file.name,
                type: fileExtension,
                size: file.size,
                url: downloadURL,
                storagePath,
                uploadedBy: metadata.uploadedBy || 'anonymous',
                uploadedAt: new Date(),
                lastModified: new Date(),
                assessmentId: metadata.assessmentId,
                clientId: metadata.clientId,
                category,
                tags: metadata.tags || [],
                isProcessed: false,
                processingStatus: 'pending',
                metadata: {
                  checksum,
                  ...fileMetadata
                },
                accessLevel: metadata.accessLevel || 'team',
                downloadCount: 0,
                version: 1
              };

              // Save to Firestore
              await setDoc(doc(db, 'files', fileId), {
                ...fileRecord,
                uploadedAt: Timestamp.fromDate(fileRecord.uploadedAt),
                lastModified: Timestamp.fromDate(fileRecord.lastModified)
              });

              // Start background processing
              this.processFileInBackground(fileRecord);

              this.uploadProgressCallbacks.delete(fileId);
              
              const progressUpdate: FileUploadProgress = {
                fileId,
                progress: 100,
                status: 'completed'
              };
              
              if (onProgress) {
                onProgress(progressUpdate);
              }

              resolve(fileRecord);
            } catch (error) {
              this.uploadProgressCallbacks.delete(fileId);
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      this.uploadProgressCallbacks.delete(fileId);
      throw error;
    }
  }

  // Search and filter files
  async searchFiles(filters: FileSearchFilters = {}): Promise<FileRecord[]> {
    let q = collection(db, 'files');
    let constraints: any[] = [];

    // Apply filters
    if (filters.type && filters.type.length > 0) {
      constraints.push(where('type', 'in', filters.type));
    }

    if (filters.category && filters.category.length > 0) {
      constraints.push(where('category', 'in', filters.category));
    }

    if (filters.assessmentId) {
      constraints.push(where('assessmentId', '==', filters.assessmentId));
    }

    if (filters.clientId) {
      constraints.push(where('clientId', '==', filters.clientId));
    }

    if (filters.uploadedBy) {
      constraints.push(where('uploadedBy', '==', filters.uploadedBy));
    }

    if (filters.dateRange) {
      constraints.push(
        where('uploadedAt', '>=', Timestamp.fromDate(filters.dateRange.start)),
        where('uploadedAt', '<=', Timestamp.fromDate(filters.dateRange.end))
      );
    }

    // Add ordering
    constraints.push(orderBy('uploadedAt', 'desc'));
    constraints.push(limit(100));

    const filesQuery = query(q, ...constraints);
    const querySnapshot = await getDocs(filesQuery);

    let files = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        ...data,
        id: doc.id,
        uploadedAt: data.uploadedAt.toDate(),
        lastModified: data.lastModified.toDate()
      } as FileRecord;
    });

    // Apply client-side filters for complex queries
    if (filters.tags && filters.tags.length > 0) {
      files = files.filter(file => 
        filters.tags!.some(tag => file.tags.includes(tag))
      );
    }

    if (filters.textSearch) {
      const searchTerm = filters.textSearch.toLowerCase();
      files = files.filter(file => 
        file.originalName.toLowerCase().includes(searchTerm) ||
        file.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
        (file.processingResults?.textExtracted && 
         file.processingResults.textExtracted.toLowerCase().includes(searchTerm))
      );
    }

    return files;
  }

  // Get file by ID
  async getFile(fileId: string): Promise<FileRecord | null> {
    const docRef = doc(db, 'files', fileId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      ...data,
      id: docSnap.id,
      uploadedAt: data.uploadedAt.toDate(),
      lastModified: data.lastModified.toDate()
    } as FileRecord;
  }

  // Update file metadata
  async updateFile(fileId: string, updates: Partial<FileRecord>): Promise<void> {
    const docRef = doc(db, 'files', fileId);
    
    const updateData: any = {
      ...updates,
      lastModified: Timestamp.fromDate(new Date())
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => 
      updateData[key] === undefined && delete updateData[key]
    );

    await updateDoc(docRef, updateData);
  }

  // Delete file
  async deleteFile(fileId: string): Promise<void> {
    const fileRecord = await this.getFile(fileId);
    if (!fileRecord) {
      throw new Error('File not found');
    }

    // Delete from storage
    const storageRef = ref(storage, fileRecord.storagePath);
    await deleteObject(storageRef);

    // Delete from Firestore
    await deleteDoc(doc(db, 'files', fileId));
  }

  // Bulk operations
  async bulkDeleteFiles(fileIds: string[]): Promise<{ success: string[], failed: string[] }> {
    const batch = writeBatch(db);
    const success: string[] = [];
    const failed: string[] = [];

    for (const fileId of fileIds) {
      try {
        const fileRecord = await this.getFile(fileId);
        if (fileRecord) {
          // Delete from storage
          const storageRef = ref(storage, fileRecord.storagePath);
          await deleteObject(storageRef);

          // Add to batch delete
          batch.delete(doc(db, 'files', fileId));
          success.push(fileId);
        } else {
          failed.push(fileId);
        }
      } catch (error) {
        failed.push(fileId);
      }
    }

    if (success.length > 0) {
      await batch.commit();
    }

    return { success, failed };
  }

  // Download file with tracking
  async downloadFile(fileId: string, trackDownload: boolean = true): Promise<string> {
    const fileRecord = await this.getFile(fileId);
    if (!fileRecord) {
      throw new Error('File not found');
    }

    if (trackDownload) {
      // Update download count
      await this.updateFile(fileId, {
        downloadCount: fileRecord.downloadCount + 1
      });
    }

    return fileRecord.url;
  }

  // File processing methods
  private async processFileInBackground(fileRecord: FileRecord): Promise<void> {
    try {
      await this.updateFile(fileRecord.id, {
        processingStatus: 'processing'
      });

      let processingResults: FileRecord['processingResults'] = {};

      switch (fileRecord.type) {
        case 'pdf':
          processingResults = await this.processPDF(fileRecord);
          break;
        case 'png':
        case 'jpg':
        case 'jpeg':
          processingResults = await this.processImage(fileRecord);
          break;
        case 'csv':
          processingResults = await this.processCSV(fileRecord);
          break;
        case 'txt':
          processingResults = await this.processText(fileRecord);
          break;
        default:
          processingResults = { textExtracted: 'Processing not supported for this file type' };
      }

      await this.updateFile(fileRecord.id, {
        processingStatus: 'completed',
        processingResults,
        isProcessed: true
      });
    } catch (error) {
      console.error('File processing error:', error);
      await this.updateFile(fileRecord.id, {
        processingStatus: 'failed',
        processingResults: {
          textExtracted: `Processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        }
      });
    }
  }

  private async processPDF(fileRecord: FileRecord): Promise<FileRecord['processingResults']> {
    // In a real implementation, this would use PDF.js or similar library
    return {
      textExtracted: `[PDF Processing] ${fileRecord.originalName} - Text extraction would happen here`,
      aiInsights: 'PDF analysis and insights would be generated here'
    };
  }

  private async processImage(_fileRecord: FileRecord): Promise<FileRecord['processingResults']> {
    // In a real implementation, this would use image analysis APIs
    return {
      imageAnalysis: {
        detectedObjects: ['diagram', 'chart', 'text'],
        confidence: 0.85
      },
      textExtracted: 'OCR text extraction would happen here',
      aiInsights: 'Image content analysis and insights would be generated here'
    };
  }

  private async processCSV(_fileRecord: FileRecord): Promise<FileRecord['processingResults']> {
    // In a real implementation, this would parse CSV and extract insights
    return {
      structuredData: {
        rows: 0,
        columns: 0,
        schema: []
      },
      aiInsights: 'Data structure analysis and insights would be generated here'
    };
  }

  private async processText(_fileRecord: FileRecord): Promise<FileRecord['processingResults']> {
    // In a real implementation, this would analyze text content
    return {
      textExtracted: 'Text file content would be analyzed here',
      aiInsights: 'Text analysis and insights would be generated here'
    };
  }

  // Utility methods
  private isValidFileType(type: string): type is FileRecord['type'] {
    const validTypes: FileRecord['type'][] = ['pdf', 'png', 'jpg', 'jpeg', 'csv', 'txt', 'docx', 'xlsx'];
    return validTypes.includes(type as FileRecord['type']);
  }

  private async calculateFileChecksum(file: File): Promise<string> {
    // Simplified checksum calculation
    return `${file.size}_${file.lastModified}_${file.name}`;
  }

  private async extractFileMetadata(file: File): Promise<Partial<FileRecord['metadata']>> {
    const metadata: Partial<FileRecord['metadata']> = {};

    if (file.type.startsWith('image/')) {
      // For images, we could extract dimensions
      const img = new Image();
      // Canvas not used in this basic implementation
      // const canvas = document.createElement('canvas');
      // const ctx = canvas.getContext('2d'); // Not used in this basic implementation
      
      return new Promise((resolve) => {
        img.onload = () => {
          metadata.dimensions = {
            width: img.width,
            height: img.height
          };
          resolve(metadata);
        };
        img.onerror = () => resolve(metadata);
        img.src = URL.createObjectURL(file);
      });
    }

    return metadata;
  }

  // Get storage analytics
  async getStorageAnalytics(): Promise<{
    totalFiles: number;
    totalSize: number;
    filesByType: Record<string, number>;
    filesByCategory: Record<string, number>;
    recentUploads: number;
  }> {
    const filesQuery = query(collection(db, 'files'));
    const querySnapshot = await getDocs(filesQuery);

    const files = querySnapshot.docs.map(doc => doc.data() as FileRecord);
    
    const analytics = {
      totalFiles: files.length,
      totalSize: files.reduce((sum, file) => sum + file.size, 0),
      filesByType: {} as Record<string, number>,
      filesByCategory: {} as Record<string, number>,
      recentUploads: 0
    };

    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    files.forEach(file => {
      // Count by type
      analytics.filesByType[file.type] = (analytics.filesByType[file.type] || 0) + 1;
      
      // Count by category
      analytics.filesByCategory[file.category] = (analytics.filesByCategory[file.category] || 0) + 1;
      
      // Count recent uploads
      if (file.uploadedAt.getTime() > weekAgo.getTime()) {
        analytics.recentUploads++;
      }
    });

    return analytics;
  }
}

export const fileManagementService = FileManagementService.getInstance();