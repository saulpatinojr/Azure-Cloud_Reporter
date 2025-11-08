import { collection, query, where, orderBy, onSnapshot, type Unsubscribe } from 'firebase/firestore';
import { getDb } from '../lib/firebase';
import type { Assessment, Client } from '../types';
import { setCache } from '../lib/cache';

export function subscribeAssessments(userId: string, cb: (assessments: Assessment[]) => void): Unsubscribe {
  const q = query(
    collection(getDb(), 'assessments'),
    where('createdBy', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, snap => {
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }) as Assessment);
    setCache(`assessments:${userId}`, data, 30_000);
    cb(data);
  });
}

export function subscribeClients(userId: string, cb: (clients: Client[]) => void): Unsubscribe {
  const q = query(
    collection(getDb(), 'clients'),
    where('createdBy', '==', userId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, snap => {
    const data = snap.docs.map(d => ({ id: d.id, ...d.data() }) as Client);
    setCache(`clients:${userId}`, data, 60_000);
    cb(data);
  });
}
