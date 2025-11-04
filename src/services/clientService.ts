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
import type { Client, CreateClientInput, UpdateClientInput } from '../types';

const COLLECTION_NAME = 'clients';

/**
 * Get all clients for the current user
 */
export async function getClients(userId: string): Promise<Client[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('createdBy', '==', userId),
    orderBy('createdAt', 'desc')
  );
  
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Client));
}

/**
 * Get a single client by ID
 */
export async function getClientById(clientId: string): Promise<Client | null> {
  const docRef = doc(db, COLLECTION_NAME, clientId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    return null;
  }
  
  return {
    id: docSnap.id,
    ...docSnap.data(),
  } as Client;
}

/**
 * Create a new client
 */
export async function createClient(
  input: CreateClientInput,
  userId: string
): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...input,
    createdBy: userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  
  return docRef.id;
}

/**
 * Update an existing client
 */
export async function updateClient(
  clientId: string,
  input: UpdateClientInput
): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, clientId);
  await updateDoc(docRef, {
    ...input,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a client
 */
export async function deleteClient(clientId: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, clientId);
  await deleteDoc(docRef);
}

/**
 * Search clients by name
 */
export async function searchClients(
  userId: string,
  searchTerm: string
): Promise<Client[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where('createdBy', '==', userId),
    orderBy('name')
  );
  
  const snapshot = await getDocs(q);
  const clients = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Client));
  
  // Filter by search term (Firestore doesn't support full-text search)
  const lowerSearchTerm = searchTerm.toLowerCase();
  return clients.filter(client =>
    client.name.toLowerCase().includes(lowerSearchTerm) ||
    client.industry.toLowerCase().includes(lowerSearchTerm)
  );
}
