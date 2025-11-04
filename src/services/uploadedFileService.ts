import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { uploadAssessmentFile } from './storageService';
import type { UploadedFile } from '../types';

const COLLECTION_NAME = 'uploadedFiles';

/**
 * Upload a file and save metadata to Firestore
 */
export async function uploadFile(
  assessmentId: string,
  requiredFileId: string,
  file: File,
  userId: string
): Promise<string> {
  // Upload to Firebase Storage
  const { url } = await uploadAssessmentFile(assessmentId, file, requiredFileId);

  // Save metadata to Firestore
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    assessmentId,
    requiredFileId,
    fileName: file.name,
    fileUrl: url,
    fileSize: file.size,
    mimeType: file.type,
    status: 'uploaded',
    validationMessage: null,
    uploadedAt: serverTimestamp(),
    uploadedBy: userId,
  });

  return docRef.id;
}

/**
 * Get all uploaded files for an assessment
 */
export async function getUploadedFiles(assessmentId: string): Promise<UploadedFile[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('assessmentId', '==', assessmentId)
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as UploadedFile));
}

/**
 * Get uploaded file for a specific required file
 */
export async function getUploadedFileByRequiredFile(
  assessmentId: string,
  requiredFileId: string
): Promise<UploadedFile | null> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('assessmentId', '==', assessmentId),
    where('requiredFileId', '==', requiredFileId)
  );
  
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  
  const doc = snapshot.docs[0];
  return {
    id: doc.id,
    ...doc.data(),
  } as UploadedFile;
}

/**
 * Delete an uploaded file
 */
export async function deleteUploadedFile(fileId: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, fileId);
  await deleteDoc(docRef);
}

/**
 * Calculate readiness percentage for an assessment
 */
export async function calculateReadiness(
  assessmentId: string,
  requiredFiles: any[]
): Promise<number> {
  const uploadedFiles = await getUploadedFiles(assessmentId);
  
  const requiredCount = requiredFiles.filter(f => f.isRequired).length;
  if (requiredCount === 0) return 100;
  
  const validatedCount = uploadedFiles.filter(f => 
    f.status === 'validated' || f.status === 'uploaded'
  ).length;
  
  return Math.round((validatedCount / requiredCount) * 100);
}
