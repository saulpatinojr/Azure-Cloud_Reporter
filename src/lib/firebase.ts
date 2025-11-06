import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage as firebaseGetStorage } from 'firebase/storage';

function hasFirebaseConfig() {
  return Boolean(
    import.meta.env.VITE_FIREBASE_API_KEY &&
      import.meta.env.VITE_FIREBASE_AUTH_DOMAIN &&
      import.meta.env.VITE_FIREBASE_PROJECT_ID,
  );
}

let _app: ReturnType<typeof initializeApp> | null = null;
let _auth: ReturnType<typeof getAuth> | null = null;
let _db: ReturnType<typeof getFirestore> | null = null;
let _storage: ReturnType<typeof firebaseGetStorage> | null = null;

if (hasFirebaseConfig()) {
  const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  _app = initializeApp(firebaseConfig);
  _auth = getAuth(_app);
  _db = getFirestore(_app);
  _storage = firebaseGetStorage(_app);
} else {
  console.warn(
    'Firebase environment variables are not fully set. Firebase services will not be initialized.',
  );
}

export function getApp() {
  if (!_app) throw new Error('Firebase app not initialized. Set VITE_FIREBASE_* env vars.');
  return _app;
}

export function getAuthSafe() {
  if (!_auth) throw new Error('Firebase auth not initialized.');
  return _auth;
}

export function getDb() {
  if (!_db) throw new Error('Firestore not initialized.');
  return _db;
}

export function getStorage() {
  if (!_storage) throw new Error('Storage not initialized.');
  return _storage;
}

export default _app;
