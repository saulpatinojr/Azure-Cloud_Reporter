import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { AssessmentType, RequiredFile, PromptBank } from '../types';

const ASSESSMENT_TYPES_COLLECTION = 'assessmentTypes';
const REQUIRED_FILES_COLLECTION = 'requiredFiles';
const PROMPT_BANK_COLLECTION = 'promptBank';

/**
 * Get all assessment types
 */
export async function getAssessmentTypes(): Promise<AssessmentType[]> {
  const snapshot = await getDocs(collection(db, ASSESSMENT_TYPES_COLLECTION));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as AssessmentType));
}

/**
 * Get a single assessment type by ID
 */
export async function getAssessmentTypeById(typeId: string): Promise<AssessmentType | null> {
  const docRef = doc(db, ASSESSMENT_TYPES_COLLECTION, typeId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return null;
  }
  
  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as AssessmentType;
}

/**
 * Get required files for an assessment type
 */
export async function getRequiredFiles(assessmentTypeId: string): Promise<RequiredFile[]> {
  const q = query(
    collection(db, REQUIRED_FILES_COLLECTION),
    where('assessmentTypeId', '==', assessmentTypeId),
    orderBy('fileOrder', 'asc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as RequiredFile));
}

/**
 * Get prompt bank for an assessment type
 */
export async function getPromptBank(assessmentTypeId: string): Promise<PromptBank[]> {
  const q = query(
    collection(db, PROMPT_BANK_COLLECTION),
    where('assessmentTypeId', '==', assessmentTypeId),
    orderBy('sectionOrder', 'asc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as PromptBank));
}
