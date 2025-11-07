import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from 'firebase/auth';
import { getAuthSafe } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    try {
      const authInstance = getAuthSafe();
      const unsubscribe = onAuthStateChanged(authInstance, (user) => {
        if (!mounted) return;
        setUser(user);
        setLoading(false);
      });
      return () => {
        mounted = false;
        unsubscribe();
      };
    } catch (err) {
      console.warn('Auth not initialized', err);
      setLoading(false);
    }
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const authInstance = getAuthSafe();
      await signInWithPopup(authInstance, provider);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      
      // For development: Show helpful error message
      if (error instanceof Error) {
        const msg = error.message || '';
        if (msg.includes('api-key-not-valid')) {
          alert('Firebase API key is invalid. Please check your .env file configuration.\n\nFor now, you can continue without authentication to test the app.');
        } else if (msg.includes('auth/operation-not-supported-in-this-environment')) {
          alert('Google popup sign-in not supported in current environment. If you are using emulators, set VITE_USE_FIREBASE_EMULATORS=false for Google OAuth or enable proper hosting with authorized domains.');
        } else if (msg.includes('auth/popup-blocked')) {
          alert('Popup was blocked. Please allow popups for this site and retry Google sign-in.');
        } else if (msg.includes('auth/popup-closed-by-user')) {
          // Silent failure; user closed popup intentionally.
        }
      }
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const authInstance = getAuthSafe();
      // Lazy import to avoid bundling if auth not configured
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      await signInWithEmailAndPassword(authInstance, email, password);
    } catch (error) {
      console.error('Error signing in with email:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const authInstance = getAuthSafe();
      const { sendPasswordResetEmail } = await import('firebase/auth');
      await sendPasswordResetEmail(authInstance, email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const authInstance = getAuthSafe();
      await firebaseSignOut(authInstance);
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithEmail,
    resetPassword,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper: map common Firebase auth errors to user-friendly messages
export function mapFirebaseError(err: any): string {
  if (!err) return 'An unknown error occurred';
  // Firebase v9 errors often have code like 'auth/wrong-password'
  const code = err.code || (err && err.message) || '';
  if (typeof code === 'string') {
    if (code.includes('auth/user-not-found')) return 'No account found for this email.';
    if (code.includes('auth/wrong-password')) return 'Incorrect password. Please try again.';
    if (code.includes('auth/invalid-email')) return 'The email address is not valid.';
    if (code.includes('auth/user-disabled')) return 'This account has been disabled. Contact support.';
    if (code.includes('auth/too-many-requests')) return 'Too many attempts. Please wait and try again later.';
    if (code.includes('auth/popup-closed-by-user')) return 'Sign-in popup was closed. Please try again.';
    if (code.includes('auth/requires-recent-login')) return 'Please sign in again to perform this action.';
    if (code.includes('api-key-not-valid') || code.includes('auth/network-request-failed')) return 'Network or configuration issue. Check your connection and API keys.';
  }
  // Fallback to message or stringified error
  return (err && err.message) ? err.message : String(err);
}
