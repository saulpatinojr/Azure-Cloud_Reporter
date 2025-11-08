import { getAuthSafe } from '../lib/firebase';
import type { User } from 'firebase/auth';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';

export function ensureAuthInitialized(setUser: (u: User | null) => void, setLoading: (l: boolean) => void) {
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
    return () => {};
  }
}

// Factory kept separate from component export file to satisfy react-refresh rule.
export function googleProviderFactory<T extends new () => object>(GoogleAuthProviderCtor: T) {
  return new GoogleAuthProviderCtor();
}

export async function emailSignIn(email: string, password: string) {
  try {
    const authInstance = getAuthSafe();
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    await signInWithEmailAndPassword(authInstance, email, password);
  } catch (error) {
    console.error('Error signing in with email:', error);
    throw error;
  }
}

export async function passwordReset(email: string) {
  try {
    const authInstance = getAuthSafe();
    const { sendPasswordResetEmail } = await import('firebase/auth');
    await sendPasswordResetEmail(authInstance, email);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
}

export async function performSignOut() {
  try {
    const authInstance = getAuthSafe();
    await firebaseSignOut(authInstance);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}
