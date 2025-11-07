import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, type Firestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, type FirebaseStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics, type Analytics } from 'firebase/analytics';
import { getFunctions, type Functions, connectFunctionsEmulator } from 'firebase/functions';
import { getPerformance, type FirebasePerformance } from 'firebase/performance';
import { getRemoteConfig, type RemoteConfig } from 'firebase/remote-config';

// Firebase configuration interface
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId?: string;
}

// Environment detection & emulator toggle
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;
const isTest = import.meta.env.MODE === 'test';
const useEmulators = import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true';

// Firebase configuration
const firebaseConfig: FirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Validate Firebase configuration
const validateFirebaseConfig = (config: FirebaseConfig): void => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  
  for (const field of requiredFields) {
    if (!config[field as keyof FirebaseConfig]) {
      throw new Error(`Missing required Firebase configuration: ${field}`);
    }
  }
};

// Validate configuration
validateFirebaseConfig(firebaseConfig);

// Initialize Firebase app (singleton pattern)
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firebase services
export const auth: Auth = getAuth(app);
export const db: Firestore = getFirestore(app);
export const storage: FirebaseStorage = getStorage(app);
export const functions: Functions = getFunctions(app);

// Initialize Analytics only in production and browser environment
export let analytics: Analytics | null = null;
if (isProduction && typeof window !== 'undefined') {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn('Analytics initialization failed:', error);
  }
}

// Initialize Performance monitoring in production
export let performance: FirebasePerformance | null = null;
if (isProduction && typeof window !== 'undefined') {
  try {
    performance = getPerformance(app);
  } catch (error) {
    console.warn('Performance monitoring initialization failed:', error);
  }
}

// Initialize Remote Config
export const remoteConfig: RemoteConfig = getRemoteConfig(app);

// Configure Remote Config
if (remoteConfig) {
  remoteConfig.settings = {
    minimumFetchIntervalMillis: isDevelopment ? 0 : 3600000, // 1 hour in production, 0 in development
    fetchTimeoutMillis: 60000, // 1 minute
  };
  
  // Set default values
  remoteConfig.defaultConfig = {
    // Feature flags
    enable_ai_features: false,
    enable_advanced_analytics: false,
    enable_mobile_app: false,
    
    // Configuration values
    max_file_size_mb: 10,
    max_files_per_assessment: 50,
    assessment_auto_save_interval: 30000, // 30 seconds
    
    // Theme configuration
    default_theme: 'professional',
    allow_custom_themes: true,
    
    // Integration settings
    enable_microsoft_integration: false,
    enable_aws_integration: false,
    enable_azure_integration: false,
  };
}

// Firebase Emulator configuration (guarded by explicit flag)
if (isDevelopment && !isTest && useEmulators) {
  const EMULATOR_HOST = 'localhost';
  
  try {
    // Auth emulator
    if (!auth.emulatorConfig) {
      connectAuthEmulator(auth, `http://${EMULATOR_HOST}:9099`, {
        disableWarnings: true
      });
    }
    
    // Firestore emulator
    try {
      connectFirestoreEmulator(db, EMULATOR_HOST, 8080);
    } catch (error) {
      // Already connected or connection failed
    }
    
    // Storage emulator
    try {
      connectStorageEmulator(storage, EMULATOR_HOST, 9199);
    } catch (error) {
      // Already connected or connection failed
    }
    
    // Functions emulator
    try {
      connectFunctionsEmulator(functions, EMULATOR_HOST, 5001);
    } catch (error) {
      // Already connected or connection failed
    }
    
    console.log('🔥 Firebase emulators connected (auth, firestore, storage, functions)');
  } catch (error) {
    console.warn('Firebase emulator connection failed:', error);
  }
}

// Firebase service validation
export const validateFirebaseServices = (): boolean => {
  try {
    if (!app) throw new Error('Firebase app not initialized');
    if (!auth) throw new Error('Firebase Auth not initialized');
    if (!db) throw new Error('Firestore not initialized');
    if (!storage) throw new Error('Firebase Storage not initialized');
    if (!functions) throw new Error('Firebase Functions not initialized');
    
    return true;
  } catch (error) {
    console.error('Firebase service validation failed:', error);
    return false;
  }
};

// Firebase connection status
export const getFirebaseConnectionStatus = () => {
  return {
    app: !!app,
    auth: !!auth,
    firestore: !!db,
    storage: !!storage,
    functions: !!functions,
    analytics: !!analytics,
    performance: !!performance,
    remoteConfig: !!remoteConfig,
    emulators: isDevelopment,
    environment: import.meta.env.MODE,
  };
};

// Error handling utilities
export class FirebaseError extends Error {
  public code: string;
  public service: string;
  
  constructor(
    message: string,
    code: string,
    service: string
  ) {
    super(message);
    this.name = 'FirebaseError';
    this.code = code;
    this.service = service;
  }
}

export const handleFirebaseError = (error: any): FirebaseError => {
  const errorCode = error.code || 'unknown';
  const errorMessage = error.message || 'An unknown Firebase error occurred';
  const service = error.code?.split('/')[0] || 'firebase';
  
  return new FirebaseError(errorMessage, errorCode, service);
};

// Firebase utilities for testing
export const setupFirebaseTestEnvironment = () => {
  if (isTest) {
    // Mock Firebase services for testing
    console.log('Setting up Firebase test environment');
    
    // You can add test-specific configurations here
    return {
      auth: auth,
      db: db,
      storage: storage,
      functions: functions,
    };
  }
  
  throw new Error('Test environment setup called outside of test mode');
};

// Firebase feature flags utility
export const getFirebaseFeatureFlag = async (flagName: string): Promise<boolean> => {
  if (!remoteConfig) return false;
  
  try {
    const { fetchAndActivate, getBoolean } = await import('firebase/remote-config');
    await fetchAndActivate(remoteConfig);
    return getBoolean(remoteConfig, flagName);
  } catch (error) {
    console.warn(`Failed to fetch feature flag ${flagName}:`, error);
    try {
      const { getBoolean } = await import('firebase/remote-config');
      return getBoolean(remoteConfig, flagName); // Return cached value
    } catch {
      return false;
    }
  }
};

// Firebase configuration value utility
export const getFirebaseConfigValue = async (configName: string): Promise<string | number> => {
  if (!remoteConfig) return '';
  
  try {
    const { fetchAndActivate, getValue } = await import('firebase/remote-config');
    await fetchAndActivate(remoteConfig);
    const value = getValue(remoteConfig, configName);
    return value.getSource() === 'static' ? value.asString() : value.asNumber();
  } catch (error) {
    console.warn(`Failed to fetch config value ${configName}:`, error);
    try {
      const { getValue } = await import('firebase/remote-config');
      const value = getValue(remoteConfig, configName);
      return value.asString();
    } catch {
      return '';
    }
  }
};

// Performance monitoring utilities
export const trackPerformance = async (name: string, fn: () => Promise<any>) => {
  if (!performance) return fn();
  
  try {
    const { trace } = await import('firebase/performance');
    const traceInstance = trace(performance, name);
    traceInstance.start();
    
    return fn().finally(() => {
      traceInstance.stop();
    });
  } catch (error) {
    console.warn('Performance tracking failed:', error);
    return fn();
  }
};

// Analytics utilities
export const logAnalyticsEvent = async (eventName: string, parameters?: Record<string, any>) => {
  if (!analytics) return;
  
  try {
    const { logEvent } = await import('firebase/analytics');
    logEvent(analytics, eventName, parameters);
  } catch (error) {
    console.warn('Analytics logging failed:', error);
  }
};

// Export Firebase app instance
export { app };
export default app;

// Type exports for better TypeScript support
export type {
  FirebaseApp,
  Auth,
  Firestore,
  FirebaseStorage,
  Functions,
  Analytics,
  FirebasePerformance,
  RemoteConfig,
};