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
  getCountFromServer,
} from 'firebase/firestore';
import { getDb } from '../lib/firebase';
import type { Assessment, CreateAssessmentInput, UpdateAssessmentInput } from '../types';

const COLLECTION_NAME = 'assessments';

/**
 * Get all assessments for the current user
 */
export async function getAssessments(userId: string): Promise<Assessment[]> {
  const q = query(
    collection(getDb(), COLLECTION_NAME),
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
    collection(getDb(), COLLECTION_NAME),
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
  const docRef = doc(getDb(), COLLECTION_NAME, assessmentId);
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
  const docRef = await addDoc(collection(getDb(), COLLECTION_NAME), {
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
  const docRef = doc(getDb(), COLLECTION_NAME, assessmentId);
  await updateDoc(docRef, {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete an assessment
 */
export async function deleteAssessment(assessmentId: string): Promise<void> {
  const docRef = doc(getDb(), COLLECTION_NAME, assessmentId);
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
    collection(getDb(), COLLECTION_NAME),
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
  // Use aggregation counts to avoid fetching all assessment documents when only counts are needed.
  const baseCollection = collection(getDb(), COLLECTION_NAME);

  const totalPromise = getCountFromServer(query(baseCollection, where('createdBy', '==', userId)));
  const inProgressPromise = getCountFromServer(query(baseCollection, where('createdBy', '==', userId), where('status', 'in', ['in_progress', 'generating'])));
  const completedPromise = getCountFromServer(query(baseCollection, where('createdBy', '==', userId), where('status', '==', 'completed')));
  const readyPromise = getCountFromServer(query(baseCollection, where('createdBy', '==', userId), where('status', '==', 'ready')));

  const [total, inProgress, completed, ready] = await Promise.all([
    totalPromise,
    inProgressPromise,
    completedPromise,
    readyPromise,
  ]);

  return {
    totalAssessments: total.data().count,
    inProgress: inProgress.data().count,
    completed: completed.data().count,
    ready: ready.data().count,
  };
}

// Progressive highlight fetch: limit to first N assessments rather than all.
export async function getRecentAssessments(userId: string, limitCount = 12): Promise<Assessment[]> {
  const q = query(
    collection(getDb(), COLLECTION_NAME),
    where('createdBy', '==', userId),
    orderBy('createdAt', 'desc'),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.slice(0, limitCount).map(d => ({ id: d.id, ...d.data() } as Assessment));
}
