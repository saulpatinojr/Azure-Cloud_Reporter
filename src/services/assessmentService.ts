import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Assessment, CreateAssessmentInput, UpdateAssessmentInput } from '../types';

const COLLECTION_NAME = 'assessments';

/**
 * Get all assessments for the current user
 */
export async function getAssessments(userId: string): Promise<Assessment[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('createdBy', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Assessment));
}

/**
 * Get assessments by client ID
 */
export async function getAssessmentsByClient(
  clientId: string,
  userId: string
): Promise<Assessment[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('clientId', '==', clientId),
    where('createdBy', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Assessment));
}

/**
 * Get a single assessment by ID
 */
export async function getAssessmentById(assessmentId: string): Promise<Assessment | null> {
  const docRef = doc(db, COLLECTION_NAME, assessmentId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return null;
  }
  
  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Assessment;
}

/**
 * Create a new assessment
 */
export async function createAssessment(
  input: CreateAssessmentInput,
  userId: string
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...input,
    status: 'draft',
    readinessPercentage: 0,
    createdBy: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  return docRef.id;
}

/**
 * Update an existing assessment
 */
export async function updateAssessment(
  assessmentId: string,
  input: UpdateAssessmentInput | { status?: Assessment['status']; readinessPercentage?: number }
): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, assessmentId);
  await updateDoc(docRef, {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete an assessment
 */
export async function deleteAssessment(assessmentId: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, assessmentId);
  await deleteDoc(docRef);
}

/**
 * Get assessments by status
 */
export async function getAssessmentsByStatus(
  userId: string,
  status: Assessment['status']
): Promise<Assessment[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('createdBy', '==', userId),
    where('status', '==', status),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Assessment));
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(userId: string) {
  const assessments = await getAssessments(userId);
  
  return {
    totalAssessments: assessments.length,
    inProgress: assessments.filter(a => a.status === 'in_progress' || a.status === 'generating').length,
    completed: assessments.filter(a => a.status === 'completed').length,
    ready: assessments.filter(a => a.status === 'ready').length,
  };
}
