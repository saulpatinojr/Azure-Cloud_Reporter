import type { UploadMetadata } from 'firebase/storage';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { storage } from '../lib/firebase';

/**
 * Upload a file to Firebase Storage
 */
export async function uploadFile(
  file: File,
  path: string,
  metadata?: UploadMetadata
): Promise<{ url: string; path: string }> {
  const storageRef = ref(storage, path);
  
  const uploadMetadata: UploadMetadata = {
    contentType: file.type,
    ...metadata,
  };
  
  await uploadBytes(storageRef, file, uploadMetadata);
  const url = await getDownloadURL(storageRef);
  
  return { url, path };
}

/**
 * Upload assessment file
 */
export async function uploadAssessmentFile(
  assessmentId: string,
  file: File,
  requiredFileId: string
): Promise<{ url: string; path: string }> {
  const timestamp = Date.now();
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `assessments/${assessmentId}/files/${requiredFileId}_${timestamp}_${sanitizedFileName}`;
  
  return uploadFile(file, path);
}

/**
 * Upload assessment export (DOCX/PDF)
 */
export async function uploadAssessmentExport(
  assessmentId: string,
  file: Blob,
  fileName: string,
  contentType: string
): Promise<{ url: string; path: string }> {
  const timestamp = Date.now();
  const path = `assessments/${assessmentId}/exports/${timestamp}_${fileName}`;
  
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file, { contentType });
  const url = await getDownloadURL(storageRef);
  
  return { url, path };
}

/**
 * Delete a file from Firebase Storage
 */
export async function deleteFile(path: string): Promise<void> {
  const storageRef = ref(storage, path);
  await deleteObject(storageRef);
}

/**
 * Get download URL for a file
 */
export async function getFileUrl(path: string): Promise<string> {
  const storageRef = ref(storage, path);
  return getDownloadURL(storageRef);
}

/**
 * Validate file size
 */
export function validateFileSize(file: File, maxSizeMB: number = 16): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * Validate file type
 */
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      const prefix = type.slice(0, -2);
      return file.type.startsWith(prefix);
    }
    return file.type === type;
  });
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}
