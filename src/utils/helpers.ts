import { Timestamp } from 'firebase/firestore';

/**
 * Format Firestore Timestamp to readable date string
 */
export function formatDate(timestamp: Timestamp | null | undefined): string {
  if (!timestamp) return 'N/A';
  
  const date = timestamp.toDate();
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

/**
 * Format Firestore Timestamp to readable date and time string
 */
export function formatDateTime(timestamp: Timestamp | null | undefined): string {
  if (!timestamp) return 'N/A';
  
  const date = timestamp.toDate();
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

/**
 * Format file size in bytes to human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Get status badge color
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    draft: 'bg-gray-100 text-gray-800',
    in_progress: 'bg-blue-100 text-blue-800',
    ready: 'bg-green-100 text-green-800',
    generating: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-purple-100 text-purple-800',
    pending: 'bg-gray-100 text-gray-800',
    processing: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    uploaded: 'bg-blue-100 text-blue-800',
    validated: 'bg-green-100 text-green-800',
  };
  
  return colors[status] || 'bg-gray-100 text-gray-800';
}

/**
 * Get file status icon color
 */
export function getFileStatusColor(status: 'uploaded' | 'validated' | 'error' | 'missing'): string {
  const colors: Record<string, string> = {
    validated: 'text-blue-500', // Blue circle
    uploaded: 'text-blue-500', // Blue circle
    error: 'text-yellow-500', // Yellow circle
    missing: 'text-red-500', // Red circle
  };
  
  return colors[status] || 'text-gray-400';
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Convert Date to Firestore Timestamp
 */
export function dateToTimestamp(date: Date): Timestamp {
  return Timestamp.fromDate(date);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Class name utility (similar to clsx)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
