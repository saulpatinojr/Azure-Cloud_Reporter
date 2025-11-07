import React, { useState, useEffect } from 'react';
import { Card } from '../design-system/components/Card';
import { Button } from '../design-system/components/Button';
import { Badge } from '../design-system/components/Badge';
import { Progress } from '../design-system/components/Progress';
import {
  firebaseNativeIntegration,
  validateFirebaseIntegration,
  getFirebaseServiceHealth,
  generateFirebaseIntegrationReport,
  type ValidationResult,
  type ServiceValidation,
  type PerformanceMetrics
} from '../services/firebaseIntegrationService';
import { getFirebaseConnectionStatus } from '../lib/firebase-native';
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  RotateCcw,
  BarChart3,
  Cog,
  Flame,
  Cloud,
  ShieldCheck,
  Clock
} from 'lucide-react';

interface FirebaseValidationDashboardProps {
  className?: string;
}

export const FirebaseValidationDashboard: React.FC<FirebaseValidationDashboardProps> = ({ className = '' }) => {
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const [serviceHealth, setServiceHealth] = useState<ServiceValidation[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<PerformanceMetrics[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [lastValidation, setLastValidation] = useState<Date | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<any>(null);
  const [integrationReport, setIntegrationReport] = useState<any>(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      // Load connection status
      const status = getFirebaseConnectionStatus();
      setConnectionStatus(status);

      // Load existing validation results
      const existingValidation = firebaseNativeIntegration.getValidationResults();
      if (existingValidation) {
        setValidationResult(existingValidation);
      }

      // Load last validation time
      const lastValidationTime = firebaseNativeIntegration.getLastValidationTime();
      setLastValidation(lastValidationTime);

      // Load performance metrics
      const metrics = firebaseNativeIntegration.getPerformanceMetrics();
      setPerformanceMetrics(metrics);

      // Load service health
      const health = await getFirebaseServiceHealth();
      setServiceHealth(health);

      // Generate integration report
      const report = await generateFirebaseIntegrationReport();
      setIntegrationReport(report);
    } catch (error) {
      console.error('Failed to load Firebase validation data:', error);
    }
  };

  const runValidation = async () => {
    setIsValidating(true);
    try {
      const result = await validateFirebaseIntegration();
      setValidationResult(result);
      setLastValidation(new Date());

      // Refresh other data
      await loadInitialData();
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const getStatusIcon = (status: 'connected' | 'disconnected' | 'error') => {
    switch (status) {
      case 'connected':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: 'connected' | 'disconnected' | 'error') => {
    switch (status) {
      case 'connected':
        return <Badge variant="success">Connected</Badge>;
      case 'error':
        return <Badge variant="danger">Error</Badge>;
      default:
        return <Badge variant="warning">Disconnected</Badge>;
    }
  };

  const formatDuration = (ms: number): string => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Flame className="w-8 h-8 text-orange-500" />
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Firebase Integration Validation</h2>
            <p className="text-gray-600">Monitor and validate Firebase native tool integration</p>
          </div>
        </div>
        <Button 
          onClick={runValidation} 
          disabled={isValidating}
          className="flex items-center space-x-2"
        >
          <RotateCcw className={`w-4 h-4 ${isValidating ? 'animate-spin' : ''}`} />
          <span>{isValidating ? 'Validating...' : 'Run Validation'}</span>
        </Button>
      </div>

      {/* Connection Status Overview */}
      {connectionStatus && (
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Cloud className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-medium">Connection Status</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{connectionStatus.environment}</div>
              <div className="text-sm text-gray-500">Environment</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {connectionStatus.emulators ? 'Local' : 'Cloud'}
              </div>
              <div className="text-sm text-gray-500">Mode</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Object.values(connectionStatus).filter(Boolean).length}
              </div>
              <div className="text-sm text-gray-500">Services Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {lastValidation ? formatDuration(Date.now() - lastValidation.getTime()) : 'Never'}
              </div>
              <div className="text-sm text-gray-500">Last Validation</div>
            </div>
          </div>
        </Card>
      )}

      {/* Validation Results */}
      {validationResult && (
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <ShieldCheck className="w-6 h-6 text-green-500" />
            <h3 className="text-lg font-medium">Validation Results</h3>
            {validationResult.isValid ? (
              <Badge variant="success">Passed</Badge>
            ) : (
              <Badge variant="danger">Failed</Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Errors */}
            <div>
              <h4 className="font-medium text-red-600 mb-2">
                Errors ({validationResult.errors.length})
              </h4>
              {validationResult.errors.length > 0 ? (
                <ul className="space-y-1">
                  {validationResult.errors.map((error, index) => (
                    <li key={index} className="text-sm text-red-600 flex items-start space-x-2">
                      <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No errors found</p>
              )}
            </div>

            {/* Warnings */}
            <div>
              <h4 className="font-medium text-yellow-600 mb-2">
                Warnings ({validationResult.warnings.length})
              </h4>
              {validationResult.warnings.length > 0 ? (
                <ul className="space-y-1">
                  {validationResult.warnings.map((warning, index) => (
                    <li key={index} className="text-sm text-yellow-600 flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No warnings</p>
              )}
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="font-medium text-blue-600 mb-2">
                Recommendations ({validationResult.recommendations.length})
              </h4>
              {validationResult.recommendations.length > 0 ? (
                <ul className="space-y-1">
                  {validationResult.recommendations.map((recommendation, index) => (
                    <li key={index} className="text-sm text-blue-600 flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>{recommendation}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No recommendations</p>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Service Health */}
      {serviceHealth.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Cog className="w-6 h-6 text-gray-500" />
            <h3 className="text-lg font-medium">Service Health</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {serviceHealth.map((service, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{service.service}</span>
                  {getStatusIcon(service.status)}
                </div>
                <div className="space-y-2">
                  {getStatusBadge(service.status)}
                  <div className="text-xs text-gray-500">
                    Last checked: {service.lastChecked.toLocaleTimeString()}
                  </div>
                  {service.details?.error && (
                    <div className="text-xs text-red-500 truncate" title={service.details.error}>
                      {service.details.error}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Performance Metrics */}
      {integrationReport?.performance && (
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <BarChart3 className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-medium">Performance Metrics</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {integrationReport.performance.totalOperations}
              </div>
              <div className="text-sm text-gray-500">Total Operations</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {formatDuration(integrationReport.performance.averageDuration)}
              </div>
              <div className="text-sm text-gray-500">Avg Duration</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">
                {formatPercentage(integrationReport.performance.successRate)}
              </div>
              <div className="text-sm text-gray-500">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">
                {integrationReport.performance.slowOperations}
              </div>
              <div className="text-sm text-gray-500">Slow Operations</div>
            </div>
          </div>

          {/* Performance Progress Bars */}
          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Success Rate</span>
                <span>{formatPercentage(integrationReport.performance.successRate)}</span>
              </div>
              <Progress 
                value={integrationReport.performance.successRate} 
                className="h-2"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Recent Performance Metrics */}
      {performanceMetrics.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="w-6 h-6 text-gray-500" />
            <h3 className="text-lg font-medium">Recent Operations</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Operation
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {performanceMetrics.slice(-10).reverse().map((metric, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {metric.operationName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDuration(metric.duration)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {metric.success ? (
                        <Badge variant="success">Success</Badge>
                      ) : (
                        <Badge variant="destructive">Failed</Badge>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {metric.timestamp.toLocaleTimeString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Integration Report Summary */}
      {integrationReport && (
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-4">Integration Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">System Overview</h4>
              <dl className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <dt>Environment:</dt>
                  <dd>{integrationReport.overview.environment}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Emulators:</dt>
                  <dd>{integrationReport.overview.emulators ? 'Enabled' : 'Disabled'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Analytics:</dt>
                  <dd>{integrationReport.overview.analytics ? 'Active' : 'Inactive'}</dd>
                </div>
                <div className="flex justify-between">
                  <dt>Performance:</dt>
                  <dd>{integrationReport.overview.performance ? 'Active' : 'Inactive'}</dd>
                </div>
              </dl>
            </div>
            <div>
              <h4 className="font-medium mb-2">Health Status</h4>
              <div className="space-y-2">
                {serviceHealth.map((service, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span>{service.service}:</span>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(service.status)}
                      <span className="capitalize">{service.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default FirebaseValidationDashboard;