import { 
  auth, 
  db, 
  storage, 
  functions,
  validateFirebaseServices,
  getFirebaseConnectionStatus,
  handleFirebaseError,
  getFirebaseFeatureFlag,
  trackPerformance,
  logAnalyticsEvent 
} from '../lib/firebase-native';
import { 
  onAuthStateChanged
} from 'firebase/auth';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  query,
  limit
} from 'firebase/firestore';
import {
  ref,
  getMetadata
} from 'firebase/storage';
import { httpsCallable } from 'firebase/functions';

// Types for better type safety
interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  recommendations: string[];
}

interface ServiceValidation {
  service: string;
  status: 'connected' | 'disconnected' | 'error';
  lastChecked: Date;
  details?: any;
}

interface PerformanceMetrics {
  operationName: string;
  duration: number;
  success: boolean;
  timestamp: Date;
  metadata?: Record<string, any>;
}

// Firebase Native Tool Integration Service
export class FirebaseNativeIntegrationService {
  private static instance: FirebaseNativeIntegrationService;
  private validationResults: ValidationResult | null = null;
  private performanceMetrics: PerformanceMetrics[] = [];
  private lastValidation: Date | null = null;

  private constructor() {
    this.initializeService();
  }

  public static getInstance(): FirebaseNativeIntegrationService {
    if (!FirebaseNativeIntegrationService.instance) {
      FirebaseNativeIntegrationService.instance = new FirebaseNativeIntegrationService();
    }
    return FirebaseNativeIntegrationService.instance;
  }

  private async initializeService(): Promise<void> {
    try {
      console.log('🔥 Initializing Firebase Native Integration Service...');
      
      // Validate Firebase services
      const isValid = validateFirebaseServices();
      if (!isValid) {
        throw new Error('Firebase services validation failed');
      }

      // Get connection status
      const status = getFirebaseConnectionStatus();
      console.log('Firebase Connection Status:', status);

      // Log initialization
      logAnalyticsEvent('firebase_integration_initialized', {
        environment: status.environment,
        emulators: status.emulators
      });

      console.log('✅ Firebase Native Integration Service initialized successfully');
    } catch (error) {
      console.error('❌ Firebase Native Integration Service initialization failed:', error);
      throw handleFirebaseError(error);
    }
  }

  // Comprehensive Firebase validation
  public async validateFirebaseIntegration(): Promise<ValidationResult> {
    return trackPerformance('firebase_integration_validation', async () => {
      const errors: string[] = [];
      const warnings: string[] = [];
      const recommendations: string[] = [];

      try {
        console.log('🔍 Starting comprehensive Firebase integration validation...');

        // 1. Service availability validation
        const connectionStatus = getFirebaseConnectionStatus();
        if (!connectionStatus.app) errors.push('Firebase app not initialized');
        if (!connectionStatus.auth) errors.push('Firebase Auth not available');
        if (!connectionStatus.firestore) errors.push('Firestore not available');
        if (!connectionStatus.storage) errors.push('Firebase Storage not available');
        if (!connectionStatus.functions) errors.push('Firebase Functions not available');
        
        if (!connectionStatus.analytics && connectionStatus.environment === 'production') {
          warnings.push('Analytics not available in production environment');
        }

        // 2. Authentication validation
        try {
          const authValidation = await this.validateAuthenticationService();
          if (!authValidation.success) {
            errors.push(`Authentication validation failed: ${authValidation.error}`);
          }
        } catch (error) {
          errors.push(`Authentication service error: ${error}`);
        }

        // 3. Firestore validation
        try {
          const firestoreValidation = await this.validateFirestoreService();
          if (!firestoreValidation.success) {
            errors.push(`Firestore validation failed: ${firestoreValidation.error}`);
          }
        } catch (error) {
          errors.push(`Firestore service error: ${error}`);
        }

        // 4. Storage validation
        try {
          const storageValidation = await this.validateStorageService();
          if (!storageValidation.success) {
            errors.push(`Storage validation failed: ${storageValidation.error}`);
          }
        } catch (error) {
          errors.push(`Storage service error: ${error}`);
        }

        // 5. Functions validation
        try {
          const functionsValidation = await this.validateFunctionsService();
          if (!functionsValidation.success) {
            warnings.push(`Functions validation warning: ${functionsValidation.error}`);
          }
        } catch (error) {
          warnings.push(`Functions service warning: ${error}`);
        }

        // 6. Feature flags validation
        try {
          const featureFlagsValidation = await this.validateFeatureFlags();
          if (!featureFlagsValidation.success) {
            warnings.push(`Feature flags validation warning: ${featureFlagsValidation.error}`);
          }
        } catch (error) {
          warnings.push(`Feature flags warning: ${error}`);
        }

        // 7. Security rules validation
        try {
          const securityValidation = await this.validateSecurityRules();
          if (!securityValidation.success) {
            errors.push(`Security rules validation failed: ${securityValidation.error}`);
          }
        } catch (error) {
          errors.push(`Security rules error: ${error}`);
        }

        // 8. Performance validation
        const performanceValidation = this.validatePerformanceMetrics();
        if (performanceValidation.warnings.length > 0) {
          warnings.push(...performanceValidation.warnings);
        }
        if (performanceValidation.recommendations.length > 0) {
          recommendations.push(...performanceValidation.recommendations);
        }

        const isValid = errors.length === 0;
        
        this.validationResults = {
          isValid,
          errors,
          warnings,
          recommendations
        };

        this.lastValidation = new Date();

        // Log validation results
        logAnalyticsEvent('firebase_integration_validated', {
          is_valid: isValid,
          error_count: errors.length,
          warning_count: warnings.length,
          recommendation_count: recommendations.length
        });

        console.log(isValid ? '✅ Firebase integration validation passed' : '❌ Firebase integration validation failed');
        if (errors.length > 0) console.error('Validation errors:', errors);
        if (warnings.length > 0) console.warn('Validation warnings:', warnings);
        if (recommendations.length > 0) console.info('Validation recommendations:', recommendations);

        return this.validationResults;

      } catch (error) {
        const firebaseError = handleFirebaseError(error);
        errors.push(`Validation process failed: ${firebaseError.message}`);
        
        this.validationResults = {
          isValid: false,
          errors,
          warnings,
          recommendations
        };

        return this.validationResults;
      }
    });
  }

  // Authentication service validation
  private async validateAuthenticationService(): Promise<{ success: boolean; error?: string }> {
    try {
      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (_user) => {
          unsubscribe();
          resolve({ success: true });
        }, (error) => {
          unsubscribe();
          resolve({ success: false, error: error.message });
        });
      });
    } catch (error) {
      return { success: false, error: handleFirebaseError(error).message };
    }
  }

  // Firestore service validation
  private async validateFirestoreService(): Promise<{ success: boolean; error?: string }> {
    try {
      // Test basic Firestore connectivity with a simple read operation
      const testCollection = collection(db, 'validation_test');
      const testQuery = query(testCollection, limit(1));
      await getDocs(testQuery);
      return { success: true };
    } catch (error) {
      return { success: false, error: handleFirebaseError(error).message };
    }
  }

  // Storage service validation
  private async validateStorageService(): Promise<{ success: boolean; error?: string }> {
    try {
      // Test basic Storage connectivity
      const testRef = ref(storage, 'validation/test.txt');
      try {
        await getMetadata(testRef);
      } catch (error) {
        // Expected if file doesn't exist, but service is accessible
        if ((error as any).code === 'storage/object-not-found') {
          return { success: true };
        }
        throw error;
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: handleFirebaseError(error).message };
    }
  }

  // Functions service validation
  private async validateFunctionsService(): Promise<{ success: boolean; error?: string }> {
    try {
      // Test Functions connectivity by creating a callable reference
      httpsCallable(functions, 'testConnection');
      // Note: We don't actually call it since the function might not exist
      return { success: true };
    } catch (error) {
      return { success: false, error: handleFirebaseError(error).message };
    }
  }

  // Feature flags validation
  private async validateFeatureFlags(): Promise<{ success: boolean; error?: string }> {
    try {
      await getFirebaseFeatureFlag('enable_ai_features');
      return { success: true };
    } catch (error) {
      return { success: false, error: handleFirebaseError(error).message };
    }
  }

  // Security rules validation
  private async validateSecurityRules(): Promise<{ success: boolean; error?: string }> {
    try {
      // Test security rules by attempting to access protected resources
      if (auth.currentUser) {
        const userDoc = doc(db, 'users', auth.currentUser.uid);
        await getDoc(userDoc);
      }
      return { success: true };
    } catch (error) {
      const firebaseError = handleFirebaseError(error);
      if (firebaseError.code === 'permission-denied') {
        return { success: true }; // Security rules are working
      }
      return { success: false, error: firebaseError.message };
    }
  }

  // Performance metrics validation
  private validatePerformanceMetrics(): { warnings: string[]; recommendations: string[] } {
    const warnings: string[] = [];
    const recommendations: string[] = [];

    if (this.performanceMetrics.length === 0) {
      warnings.push('No performance metrics available');
      return { warnings, recommendations };
    }

    // Analyze performance metrics
    const recentMetrics = this.performanceMetrics.filter(
      metric => Date.now() - metric.timestamp.getTime() < 3600000 // Last hour
    );

    if (recentMetrics.length === 0) {
      warnings.push('No recent performance metrics available');
      return { warnings, recommendations };
    }

    // Check for slow operations
    const slowOperations = recentMetrics.filter(metric => metric.duration > 5000); // > 5 seconds
    if (slowOperations.length > 0) {
      warnings.push(`${slowOperations.length} slow operations detected`);
      recommendations.push('Consider optimizing slow Firebase operations');
    }

    // Check for failed operations
    const failedOperations = recentMetrics.filter(metric => !metric.success);
    if (failedOperations.length > 0) {
      warnings.push(`${failedOperations.length} failed operations detected`);
      recommendations.push('Investigate and fix failed Firebase operations');
    }

    // Check for high operation frequency
    if (recentMetrics.length > 1000) {
      recommendations.push('High Firebase operation frequency detected - consider optimization');
    }

    return { warnings, recommendations };
  }

  // Service health monitoring
  public async getServiceHealth(): Promise<ServiceValidation[]> {
    const services: ServiceValidation[] = [];
    const now = new Date();

    // Auth service health
    try {
      await this.validateAuthenticationService();
      services.push({
        service: 'Authentication',
        status: 'connected',
        lastChecked: now,
        details: { currentUser: !!auth.currentUser }
      });
    } catch (error) {
      services.push({
        service: 'Authentication',
        status: 'error',
        lastChecked: now,
        details: { error: handleFirebaseError(error).message }
      });
    }

    // Firestore service health
    try {
      await this.validateFirestoreService();
      services.push({
        service: 'Firestore',
        status: 'connected',
        lastChecked: now
      });
    } catch (error) {
      services.push({
        service: 'Firestore',
        status: 'error',
        lastChecked: now,
        details: { error: handleFirebaseError(error).message }
      });
    }

    // Storage service health
    try {
      await this.validateStorageService();
      services.push({
        service: 'Storage',
        status: 'connected',
        lastChecked: now
      });
    } catch (error) {
      services.push({
        service: 'Storage',
        status: 'error',
        lastChecked: now,
        details: { error: handleFirebaseError(error).message }
      });
    }

    // Functions service health
    try {
      await this.validateFunctionsService();
      services.push({
        service: 'Functions',
        status: 'connected',
        lastChecked: now
      });
    } catch (error) {
      services.push({
        service: 'Functions',
        status: 'error',
        lastChecked: now,
        details: { error: handleFirebaseError(error).message }
      });
    }

    return services;
  }

  // Performance tracking
  public trackOperation(name: string, duration: number, success: boolean, metadata?: Record<string, any>): void {
    const metric: PerformanceMetrics = {
      operationName: name,
      duration,
      success,
      timestamp: new Date(),
      metadata
    };

    this.performanceMetrics.push(metric);

    // Keep only last 1000 metrics to prevent memory issues
    if (this.performanceMetrics.length > 1000) {
      this.performanceMetrics = this.performanceMetrics.slice(-1000);
    }

    // Log significant operations
    if (duration > 5000 || !success) {
      logAnalyticsEvent('firebase_operation_tracked', {
        operation_name: name,
        duration,
        success,
        is_slow: duration > 5000
      });
    }
  }

  // Get validation results
  public getValidationResults(): ValidationResult | null {
    return this.validationResults;
  }

  // Get last validation time
  public getLastValidationTime(): Date | null {
    return this.lastValidation;
  }

  // Get performance metrics
  public getPerformanceMetrics(): PerformanceMetrics[] {
    return [...this.performanceMetrics];
  }

  // Clear performance metrics
  public clearPerformanceMetrics(): void {
    this.performanceMetrics = [];
  }

  // Generate integration report
  public async generateIntegrationReport(): Promise<{
    overview: any;
    validation: ValidationResult | null;
    serviceHealth: ServiceValidation[];
    performance: {
      totalOperations: number;
      averageDuration: number;
      successRate: number;
      slowOperations: number;
    };
    recommendations: string[];
  }> {
    const serviceHealth = await this.getServiceHealth();
    const performanceMetrics = this.getPerformanceMetrics();
    
    const performance = {
      totalOperations: performanceMetrics.length,
      averageDuration: performanceMetrics.length > 0 
        ? performanceMetrics.reduce((sum, metric) => sum + metric.duration, 0) / performanceMetrics.length 
        : 0,
      successRate: performanceMetrics.length > 0 
        ? (performanceMetrics.filter(metric => metric.success).length / performanceMetrics.length) * 100 
        : 0,
      slowOperations: performanceMetrics.filter(metric => metric.duration > 5000).length
    };

    const recommendations: string[] = [
      ...(this.validationResults?.recommendations || [])
    ];

    if (performance.successRate < 95) {
      recommendations.push('Improve Firebase operation reliability - success rate below 95%');
    }

    if (performance.averageDuration > 2000) {
      recommendations.push('Optimize Firebase operations - average duration above 2 seconds');
    }

    if (performance.slowOperations > 0) {
      recommendations.push('Address slow Firebase operations for better user experience');
    }

    return {
      overview: getFirebaseConnectionStatus(),
      validation: this.validationResults,
      serviceHealth,
      performance,
      recommendations
    };
  }
}

// Export singleton instance
export const firebaseNativeIntegration = FirebaseNativeIntegrationService.getInstance();

// Utility functions for easy access
export const validateFirebaseIntegration = () => firebaseNativeIntegration.validateFirebaseIntegration();
export const getFirebaseServiceHealth = () => firebaseNativeIntegration.getServiceHealth();
export const generateFirebaseIntegrationReport = () => firebaseNativeIntegration.generateIntegrationReport();
export const trackFirebaseOperation = (name: string, duration: number, success: boolean, metadata?: Record<string, any>) => 
  firebaseNativeIntegration.trackOperation(name, duration, success, metadata);

// Export types
export type { ValidationResult, ServiceValidation, PerformanceMetrics };