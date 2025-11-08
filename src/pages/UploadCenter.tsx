import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AppShell } from '../components/layout/AppShell';
import { Button, Card, CardHeader } from '../design-system';
import { 
  Upload, Search, Download, Eye, Trash2, Edit3, 
  File, FileText, Image, BarChart3,
  Calendar, User, Tag,
  CheckCircle2, XCircle, Clock,
  Grid3X3, List, MoreVertical,
  FolderOpen, RefreshCw
} from 'lucide-react';
import { fileManagementService } from '../services/fileManagementService';
import type { FileRecord, FileSearchFilters, FileUploadProgress } from '../services/fileManagementService';

// File management components
interface FileUploadZoneProps {
  onFileUpload: (files: FileList) => void;
  isUploading: boolean;
  acceptedTypes: string[];
}

function FileUploadZone({ onFileUpload, isUploading, acceptedTypes }: FileUploadZoneProps) {
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onFileUpload(files);
    }
  }, [onFileUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileUpload(files);
    }
  }, [onFileUpload]);

  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
        dragOver 
          ? 'border-primary bg-primary/5' 
          : isUploading 
            ? 'border-warning bg-warning/5'
            : 'border-border hover:border-primary/50'
      }`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <input
        type="file"
        multiple
        accept={acceptedTypes.join(',')}
        onChange={handleFileInput}
        disabled={isUploading}
        aria-label="Upload files"
        title="Upload files"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
      />
      
      <div className="space-y-4">
        {isUploading ? (
          <>
            <RefreshCw className="mx-auto h-12 w-12 text-warning animate-spin" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-text">Uploading files...</p>
              <p className="text-sm text-text-secondary">Please wait while we process your files</p>
            </div>
          </>
        ) : (
          <>
            <Upload className="mx-auto h-12 w-12 text-text-secondary" />
            <div className="space-y-2">
              <p className="text-lg font-medium text-text">
                {dragOver ? 'Drop files here' : 'Upload assessment files'}
              </p>
              <p className="text-sm text-text-secondary">
                Drag & drop files or click to browse
              </p>
              <p className="text-xs text-text-secondary">
                Supports: {acceptedTypes.join(', ')} • Max 50MB per file
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

interface FileCardProps {
  file: FileRecord;
  viewMode: 'grid' | 'list';
  onView: (file: FileRecord) => void;
  onDownload: (file: FileRecord) => void;
  onEdit: (file: FileRecord) => void;
  onDelete: (file: FileRecord) => void;
  isSelected: boolean;
  onSelect: (file: FileRecord, selected: boolean) => void;
}

function FileCard({ file, viewMode, onView, onDownload, onEdit, onDelete, isSelected, onSelect }: FileCardProps) {
  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <File className="h-8 w-8 text-red-500" />;
      case 'png':
      case 'jpg':
      case 'jpeg': return <Image className="h-8 w-8 text-blue-500" />;
      case 'csv': return <BarChart3 className="h-8 w-8 text-green-500" />;
      case 'txt': return <FileText className="h-8 w-8 text-gray-500" />;
      default: return <File className="h-8 w-8 text-text-secondary" />;
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4 text-warning" />;
      case 'processing': return <RefreshCw className="h-4 w-4 text-warning animate-spin" />;
      case 'completed': return <CheckCircle2 className="h-4 w-4 text-success" />;
      case 'failed': return <XCircle className="h-4 w-4 text-alert" />;
      default: return null;
    }
  };

  const formatFileSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  if (viewMode === 'list') {
    return (
      <div className={`flex items-center gap-4 p-4 rounded-lg border transition-colors ${
        isSelected ? 'border-primary bg-primary/5' : 'border-border hover:bg-surface'
      }`}>
        <input
          type="checkbox"
          aria-label={`Select file ${file.originalName}`}
          title={`Select file ${file.originalName}`}
          checked={isSelected}
          onChange={(e) => onSelect(file, e.target.checked)}
          className="rounded border-border"
        />
        
        <div className="flex items-center gap-3 flex-1">
          {getFileIcon(file.type)}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-text truncate">{file.originalName}</h4>
              {getStatusIcon(file.processingStatus)}
            </div>
            <div className="flex items-center gap-4 text-sm text-text-secondary">
              <span>{formatFileSize(file.size)}</span>
              <span>{file.uploadedAt.toLocaleDateString()}</span>
              <span>{file.uploadedBy}</span>
              <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
                {file.category}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onView(file)} aria-label={`View file ${file.originalName}`} title="View file">
            <Eye className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDownload(file)} aria-label={`Download file ${file.originalName}`} title="Download file">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onEdit(file)} aria-label={`Edit file ${file.originalName}`} title="Edit file">
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDelete(file)} aria-label={`Delete file ${file.originalName}`} title="Delete file">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Card className={`p-4 transition-all cursor-pointer ${
      isSelected ? 'border-primary bg-primary/5' : 'hover:shadow-md'
    }`}>
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <input
            type="checkbox"
            aria-label={`Select file ${file.originalName}`}
            title={`Select file ${file.originalName}`}
            checked={isSelected}
            onChange={(e) => onSelect(file, e.target.checked)}
            className="rounded border-border"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="relative">
            <Button variant="outline" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="text-center">
          <div className="mb-3 flex justify-center">
            {getFileIcon(file.type)}
          </div>
          <h4 className="font-medium text-text mb-1 truncate" title={file.originalName}>
            {file.originalName}
          </h4>
          <div className="flex items-center justify-center gap-2 text-sm text-text-secondary">
            <span>{formatFileSize(file.size)}</span>
            {getStatusIcon(file.processingStatus)}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3 text-text-secondary" />
            <span className="text-xs text-text-secondary">
              {file.uploadedAt.toLocaleDateString()}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <User className="h-3 w-3 text-text-secondary" />
            <span className="text-xs text-text-secondary">{file.uploadedBy}</span>
          </div>
          {file.tags.length > 0 && (
            <div className="flex items-center gap-2">
              <Tag className="h-3 w-3 text-text-secondary" />
              <div className="flex flex-wrap gap-1">
                {file.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag}
                    className="px-1 py-0.5 rounded text-xs bg-primary/10 text-primary"
                  >
                    {tag}
                  </span>
                ))}
                {file.tags.length > 2 && (
                  <span className="text-xs text-text-secondary">+{file.tags.length - 2}</span>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2 border-t border-border">
          <Button variant="outline" size="sm" className="flex-1" onClick={() => onView(file)} aria-label={`View file ${file.originalName}`} title="View file">
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          <Button variant="outline" size="sm" onClick={() => onDownload(file)} aria-label={`Download file ${file.originalName}`} title="Download file">
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function UploadCenter() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<FileRecord[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [uploadProgress, setUploadProgress] = useState<Map<string, FileUploadProgress>>(new Map());

  const acceptedTypes = ['.pdf', '.png', '.jpg', '.jpeg', '.csv', '.txt', '.docx', '.xlsx'];

  const loadFiles = useCallback(async () => {
    try {
      setLoading(true);
      const filters: FileSearchFilters = {};
      
      if (selectedCategory !== 'all') {
        filters.category = [selectedCategory as FileRecord['category']];
      }
      
      if (searchQuery) {
        filters.textSearch = searchQuery;
      }

      const loadedFiles = await fileManagementService.searchFiles(filters);
      
      // Sort files
      const sortedFiles = [...loadedFiles].sort((a, b) => {
        let comparison = 0;
        
        switch (sortBy) {
          case 'name':
            comparison = a.originalName.localeCompare(b.originalName);
            break;
          case 'date':
            comparison = a.uploadedAt.getTime() - b.uploadedAt.getTime();
            break;
          case 'size':
            comparison = a.size - b.size;
            break;
        }
        
        return sortOrder === 'asc' ? comparison : -comparison;
      });

      setFiles(sortedFiles);
    } catch (error) {
      console.error('Error loading files:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, sortBy, sortOrder]);

  useEffect(() => {
    if (user) {
      loadFiles();
    }
  }, [user, loadFiles]);

  const handleFileUpload = async (fileList: FileList) => {
    setUploading(true);
    
    const uploadPromises = Array.from(fileList).map(async (file) => {
      try {
        const fileRecord = await fileManagementService.uploadFile(
          file,
          'assessment', // Default category
          {
            uploadedBy: user?.email || 'anonymous',
            accessLevel: 'team'
          },
          (progress) => {
            setUploadProgress(prev => new Map(prev.set(progress.fileId, progress)));
          }
        );
        
        return fileRecord;
      } catch (error) {
        console.error(`Upload failed for ${file.name}:`, error);
        return null;
      }
    });

    try {
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter((r): r is FileRecord => r !== null);
      
      if (successfulUploads.length > 0) {
        await loadFiles(); // Reload files list
      }
    } finally {
      setUploading(false);
      setUploadProgress(new Map());
    }
  };

  const handleFileView = (file: FileRecord) => {
    // Open file in new tab
    window.open(file.url, '_blank');
  };

  const handleFileDownload = async (file: FileRecord) => {
    try {
      const downloadUrl = await fileManagementService.downloadFile(file.id);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = file.originalName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleFileEdit = (file: FileRecord) => {
    // Open edit dialog (to be implemented)
    console.log('Edit file:', file);
  };

  const handleFileDelete = async (file: FileRecord) => {
    if (confirm(`Are you sure you want to delete "${file.originalName}"?`)) {
      try {
        await fileManagementService.deleteFile(file.id);
        await loadFiles(); // Reload files list
        setSelectedFiles(prev => {
          const newSet = new Set(prev);
          newSet.delete(file.id);
          return newSet;
        });
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }
  };

  const handleSelectFile = (file: FileRecord, selected: boolean) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(file.id);
      } else {
        newSet.delete(file.id);
      }
      return newSet;
    });
  };

  const handleBulkDelete = async () => {
    if (selectedFiles.size === 0) return;
    
    if (confirm(`Are you sure you want to delete ${selectedFiles.size} file(s)?`)) {
      try {
        const fileIds = Array.from(selectedFiles);
        await fileManagementService.bulkDeleteFiles(fileIds);
        await loadFiles(); // Reload files list
        setSelectedFiles(new Set());
      } catch (error) {
        console.error('Bulk delete failed:', error);
      }
    }
  };

  const filteredFiles = files.filter(file => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        file.originalName.toLowerCase().includes(query) ||
        file.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    return true;
  });

  const quickActions = (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          placeholder="Search files..."
          aria-label="Search files"
          title="Search files"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-9 w-64 rounded-lg border border-border bg-surface pl-9 pr-3 text-sm text-text placeholder:text-text-secondary"
        />
      </div>
      
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        aria-label="Filter by category"
        title="Filter by category"
        className="h-9 rounded-lg border border-border bg-surface px-3 text-sm text-text"
      >
        <option value="all">All Categories</option>
        <option value="assessment">Assessments</option>
        <option value="report">Reports</option>
        <option value="diagram">Diagrams</option>
        <option value="data">Data</option>
        <option value="documentation">Documentation</option>
        <option value="template">Templates</option>
      </select>

      <div className="flex items-center gap-1 border border-border rounded-lg p-1">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'outline'}
          size="sm"
          aria-label="Grid view"
          title="Grid view"
          onClick={() => setViewMode('grid')}
        >
          <Grid3X3 className="h-4 w-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'outline'}
          size="sm"
          aria-label="List view"
          title="List view"
          onClick={() => setViewMode('list')}
        >
          <List className="h-4 w-4" />
        </Button>
      </div>

      {selectedFiles.size > 0 && (
        <Button variant="outline" onClick={handleBulkDelete}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete ({selectedFiles.size})
        </Button>
      )}

      <Button onClick={loadFiles} disabled={loading} aria-label="Refresh file list" title="Refresh file list">
        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
        Refresh
      </Button>
    </div>
  );

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
          <p className="mt-4 text-sm text-text-secondary">Loading files...</p>
        </div>
      </div>
    );
  }

  return (
    <AppShell
      title="Upload Center"
      subtitle="Advanced file management for assessments and documentation"
      actions={quickActions}
      userEmail={user?.email ?? null}
    >
      <div className="space-y-6">
        {/* File Upload Zone */}
        <Card className="p-6">
          <FileUploadZone
            onFileUpload={handleFileUpload}
            isUploading={uploading}
            acceptedTypes={acceptedTypes}
          />
          
          {/* Upload Progress */}
          {uploadProgress.size > 0 && (
            <div className="mt-6 space-y-3">
              <h4 className="font-medium text-text">Upload Progress</h4>
              {Array.from(uploadProgress.values()).map((progress) => (
                <div key={progress.fileId} className="flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-text">File {progress.fileId}</span>
                      <span className="text-sm text-text-secondary">{progress.progress.toFixed(0)}%</span>
                    </div>
                    <div className="progress-track" aria-label={`Upload progress for file ${progress.fileId}`} title={`Upload progress for file ${progress.fileId}`}>
                      <div className={`progress-fill w-pct-${Math.min(100, Math.max(0, Math.round(progress.progress)))}`}></div>
                    </div>
                  </div>
                  {progress.status === 'completed' && <CheckCircle2 className="h-5 w-5 text-success" />}
                  {progress.status === 'error' && <XCircle className="h-5 w-5 text-alert" />}
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Files Grid/List */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <CardHeader 
              title="Files"
              subtitle={`${filteredFiles.length} file${filteredFiles.length !== 1 ? 's' : ''} found`}
            />
            
            <div className="flex items-center gap-2">
              <select
                value={`${sortBy}_${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('_');
                  setSortBy(newSortBy as 'name' | 'date' | 'size');
                  setSortOrder(newSortOrder as 'asc' | 'desc');
                }}
                aria-label="Sort files"
                title="Sort files"
                className="text-sm rounded-lg border border-border bg-surface px-3 py-1"
              >
                <option value="date_desc">Newest first</option>
                <option value="date_asc">Oldest first</option>
                <option value="name_asc">Name A-Z</option>
                <option value="name_desc">Name Z-A</option>
                <option value="size_desc">Largest first</option>
                <option value="size_asc">Smallest first</option>
              </select>
            </div>
          </div>

          {viewMode === 'grid' ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredFiles.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  viewMode={viewMode}
                  onView={handleFileView}
                  onDownload={handleFileDownload}
                  onEdit={handleFileEdit}
                  onDelete={handleFileDelete}
                  isSelected={selectedFiles.has(file.id)}
                  onSelect={handleSelectFile}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFiles.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  viewMode={viewMode}
                  onView={handleFileView}
                  onDownload={handleFileDownload}
                  onEdit={handleFileEdit}
                  onDelete={handleFileDelete}
                  isSelected={selectedFiles.has(file.id)}
                  onSelect={handleSelectFile}
                />
              ))}
            </div>
          )}

          {filteredFiles.length === 0 && (
            <div className="text-center py-12">
              <FolderOpen className="mx-auto h-12 w-12 text-text-secondary mb-4" />
              <h3 className="text-lg font-medium text-text mb-2">No files found</h3>
              <p className="text-text-secondary">
                {searchQuery || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Upload your first files to get started'
                }
              </p>
            </div>
          )}
        </Card>
      </div>
    </AppShell>
  );
}
