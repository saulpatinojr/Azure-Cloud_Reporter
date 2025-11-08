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
import { getDb } from '../lib/firebase';
import { uploadAssessmentFile } from './storageService';
import type { UploadedFile } from '../types';

const COLLECTION_NAME = 'uploadedFiles';

export async function uploadFile(
  assessmentId: string,
  requiredFileId: string,
  file: File,
  userId: string,
): Promise<string> {
  const { url } = await uploadAssessmentFile(assessmentId, file, requiredFileId);

  const docRef = await addDoc(collection(getDb(), COLLECTION_NAME), {
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

export async function getUploadedFiles(assessmentId: string): Promise<UploadedFile[]> {
  const q = query(collection(getDb(), COLLECTION_NAME), where('assessmentId', '==', assessmentId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Record<string, unknown>) } as UploadedFile));
}

export async function getUploadedFileByRequiredFile(
  assessmentId: string,
  requiredFileId: string,
): Promise<UploadedFile | null> {
  const q = query(
    collection(getDb(), COLLECTION_NAME),
    where('assessmentId', '==', assessmentId),
    where('requiredFileId', '==', requiredFileId),
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const d = snapshot.docs[0];
  return { id: d.id, ...(d.data() as Record<string, unknown>) } as UploadedFile;
}

export async function deleteUploadedFile(fileId: string): Promise<void> {
  const docRef = doc(getDb(), COLLECTION_NAME, fileId);
  await deleteDoc(docRef);
}

interface RequiredFileDescriptor { isRequired: boolean }
export async function calculateReadiness(assessmentId: string, requiredFiles: RequiredFileDescriptor[]): Promise<number> {
  const uploadedFiles = await getUploadedFiles(assessmentId);
  const requiredCount = requiredFiles.filter((f) => f.isRequired).length;
  if (requiredCount === 0) return 100;
  const validatedCount = uploadedFiles.filter((f) => f.status === 'validated' || f.status === 'uploaded').length;
  return Math.round((validatedCount / requiredCount) * 100);
}

