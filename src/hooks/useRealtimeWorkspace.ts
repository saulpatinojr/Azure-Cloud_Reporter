import { useEffect, useState } from 'react';
import type { Assessment, Client } from '../types';
import { subscribeAssessments, subscribeClients } from '../services/realtime';
import { getCache } from '../lib/cache';

export function useRealtimeWorkspace(userId: string | undefined) {
  const [assessments, setAssessments] = useState<Assessment[]>(() => userId ? (getCache<Assessment[]>(`assessments:${userId}`) || []) : []);
  const [clients, setClients] = useState<Client[]>(() => userId ? (getCache<Client[]>(`clients:${userId}`) || []) : []);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const unsubA = subscribeAssessments(userId, a => {
      setAssessments(a);
      setReady(true);
    });
    const unsubC = subscribeClients(userId, c => setClients(c));
    return () => { unsubA(); unsubC(); };
  }, [userId]);

  const stats = computeStats(assessments);

  return { assessments, clients, stats, ready };
}

function computeStats(assessments: Assessment[]) {
  let inProgress = 0, completed = 0, ready = 0;
  for (const a of assessments) {
    if (a.status === 'completed') completed++; else if (a.status === 'ready') ready++; else if (a.status === 'in_progress' || a.status === 'generating') inProgress++;
  }
  return {
    totalAssessments: assessments.length,
    inProgress,
    completed,
    ready,
  };
}
