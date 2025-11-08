import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { User } from 'firebase/auth';
import type { AuthContextType } from './authTypes';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { getAuthSafe } from '../lib/firebase';
import { ensureAuthInitialized, googleProviderFactory, emailSignIn, passwordReset, performSignOut } from '../auth/authLogic';

// Types moved to authTypes.ts to satisfy react-refresh rule.

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return ensureAuthInitialized(setUser, setLoading);
  }, []);

  const signInWithGoogle = useCallback(async () => {
    const provider = googleProviderFactory(GoogleAuthProvider);
    try {
      const authInstance = getAuthSafe();
      await signInWithPopup(authInstance, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      if (error instanceof Error) {
        const msg = error.message || '';
        if (msg.includes('api-key-not-valid')) {
          alert('Firebase API key is invalid. Please check your .env file configuration.');
        } else if (msg.includes('auth/operation-not-supported-in-this-environment')) {
          alert('Google popup sign-in not supported in this environment. Disable emulators or authorize domain.');
        } else if (msg.includes('auth/popup-blocked')) {
          alert('Popup was blocked. Allow popups and retry Google sign-in.');
        }
      }
      throw error;
    }
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => emailSignIn(email, password), []);

  const resetPassword = useCallback(async (email: string) => passwordReset(email), []);

  const signOut = useCallback(async () => performSignOut(), []);

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signInWithEmail, resetPassword, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// NOTE: This file now only exports React components/hooks; helper logic lives in ../auth/authLogic.ts
