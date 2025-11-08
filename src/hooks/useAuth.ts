import { useContext } from 'react';
import type { AuthContextType } from '../contexts/authTypes';
import { AuthContext } from '../contexts/authContextBase';

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}