# Cloud Reporter API Documentation

## 🌐 API Overview

Cloud Reporter provides a comprehensive REST API and Firebase integration for managing cloud assessments, clients, templates, and file uploads. This documentation covers all available endpoints and integration patterns.

## 🔑 Authentication

### Firebase Authentication

All API requests require Firebase Authentication. The application uses Firebase Auth tokens for authorization.

```typescript
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();
const userCredential = await signInWithEmailAndPassword(auth, email, password);
const token = await userCredential.user.getIdToken();

// Include token in API requests
const headers = {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
};
```

### Role-Based Access Control

Users have different permission levels:

- **Admin**: Full system access, user management
- **Manager**: Team management, advanced features
- **User**: Standard assessment and client management

## 📊 Core Services

### Assessment Service

#### Create Assessment

```typescript
POST /api/assessments
Content-Type: application/json
Authorization: Bearer <token>

{
  "clientId": "string",
  "templateId": "string",
  "name": "string",
  "description": "string",
  "dueDate": "2024-12-31T23:59:59Z",
  "priority": "high" | "medium" | "low",
  "status": "draft" | "in-progress" | "completed" | "archived"
}
```

#### Get Assessments

```typescript
GET /api/assessments?clientId={clientId}&status={status}&limit={limit}&offset={offset}
Authorization: Bearer <token>

Response: {
  "assessments": [
    {
      "id": "string",
      "clientId": "string",
      "templateId": "string",
      "name": "string",
      "description": "string",
      "status": "string",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "dueDate": "2024-12-31T23:59:59Z",
      "priority": "high",
      "progress": {
        "completedSections": 5,
        "totalSections": 10,
        "percentage": 50
      },
      "responses": {...},
      "metadata": {...}
    }
  ],
  "total": 25,
  "hasMore": true
}
```

#### Update Assessment

```typescript
PUT /api/assessments/{assessmentId}
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "string",
  "description": "string",
  "status": "in-progress",
  "responses": {
    "section1": {
      "question1": "answer1",
      "question2": "answer2"
    }
  },
  "metadata": {
    "lastSection": "section2",
    "estimatedCompletion": "2024-12-15T00:00:00Z"
  }
}
```

#### Delete Assessment

```typescript
DELETE /api/assessments/{assessmentId}
Authorization: Bearer <token>

Response: 204 No Content
```

### Client Service

#### Create Client

```typescript
POST /api/clients
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "string",
  "email": "string",
  "phone": "string",
  "company": "string",
  "industry": "string",
  "address": {
    "street": "string",
    "city": "string",
    "state": "string",
    "zipCode": "string",
    "country": "string"
  },
  "contactPerson": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "role": "string"
  },
  "tags": ["string"],
  "notes": "string"
}
```

#### Get Clients

```typescript
GET /api/clients?search={search}&industry={industry}&limit={limit}&offset={offset}
Authorization: Bearer <token>

Response: {
  "clients": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "company": "string",
      "industry": "string",
      "status": "active" | "inactive" | "prospect",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z",
      "lastContact": "2024-01-01T00:00:00Z",
      "assessmentCount": 5,
      "address": {...},
      "contactPerson": {...},
      "tags": [...],
      "notes": "string"
    }
  ],
  "total": 50,
  "hasMore": true
}
```

### Template Service

#### Create Template

```typescript
POST /api/templates
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "string",
  "description": "string",
  "category": "security" | "compliance" | "performance" | "cost" | "custom",
  "version": "1.0.0",
  "isPublic": false,
  "sections": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "order": 1,
      "questions": [
        {
          "id": "string",
          "type": "text" | "select" | "multiselect" | "boolean" | "number" | "date" | "file",
          "question": "string",
          "description": "string",
          "required": true,
          "order": 1,
          "options": ["option1", "option2"], // for select types
          "validation": {
            "min": 0,
            "max": 100,
            "pattern": "string"
          }
        }
      ]
    }
  ],
  "scoring": {
    "method": "weighted" | "percentage" | "custom",
    "weights": {...},
    "thresholds": {
      "excellent": 90,
      "good": 70,
      "fair": 50,
      "poor": 0
    }
  }
}
```

### File Management Service

#### Upload File

```typescript
POST /api/files/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>

FormData:
- file: File
- assessmentId: string (optional)
- clientId: string (optional)
- category: string (optional)
- tags: string[] (optional)

Response: {
  "fileId": "string",
  "filename": "string",
  "originalName": "string",
  "mimeType": "string",
  "size": 1024,
  "url": "string",
  "downloadUrl": "string",
  "uploadedAt": "2024-01-01T00:00:00Z",
  "metadata": {
    "processedAt": "2024-01-01T00:00:00Z",
    "analysis": {...},
    "thumbnailUrl": "string"
  }
}
```

#### Get Files

```typescript
GET /api/files?assessmentId={id}&clientId={id}&category={category}&limit={limit}&offset={offset}
Authorization: Bearer <token>

Response: {
  "files": [
    {
      "id": "string",
      "filename": "string",
      "originalName": "string",
      "mimeType": "string",
      "size": 1024,
      "url": "string",
      "downloadUrl": "string",
      "uploadedAt": "2024-01-01T00:00:00Z",
      "assessmentId": "string",
      "clientId": "string",
      "category": "string",
      "tags": ["string"],
      "metadata": {...}
    }
  ],
  "total": 25,
  "hasMore": true
}
```

#### Delete File

```typescript
DELETE /api/files/{fileId}
Authorization: Bearer <token>

Response: 204 No Content
```

#### Bulk File Operations

```typescript
POST /api/files/bulk
Content-Type: application/json
Authorization: Bearer <token>

{
  "operation": "delete" | "move" | "tag" | "analyze",
  "fileIds": ["string"],
  "parameters": {
    "destinationFolder": "string", // for move
    "tags": ["string"], // for tag
    "analysisType": "content" | "metadata" // for analyze
  }
}

Response: {
  "processed": 10,
  "failed": 0,
  "results": [
    {
      "fileId": "string",
      "success": true,
      "message": "string"
    }
  ]
}
```

## 🔍 Search & Analytics

### Advanced Search

```typescript
POST /api/search
Content-Type: application/json
Authorization: Bearer <token>

{
  "query": "string",
  "filters": {
    "type": ["assessment", "client", "template", "file"],
    "dateRange": {
      "start": "2024-01-01T00:00:00Z",
      "end": "2024-12-31T23:59:59Z"
    },
    "status": ["active", "completed"],
    "tags": ["string"]
  },
  "sort": {
    "field": "createdAt" | "updatedAt" | "name" | "relevance",
    "direction": "asc" | "desc"
  },
  "limit": 20,
  "offset": 0
}

Response: {
  "results": [
    {
      "type": "assessment",
      "id": "string",
      "title": "string",
      "description": "string",
      "relevance": 0.95,
      "highlights": ["string"],
      "url": "string"
    }
  ],
  "total": 100,
  "facets": {
    "type": {
      "assessment": 45,
      "client": 30,
      "template": 15,
      "file": 10
    },
    "status": {...}
  }
}
```

### Analytics & Reporting

#### Dashboard Metrics

```typescript
GET /api/analytics/dashboard?period={period}&clientId={clientId}
Authorization: Bearer <token>

Response: {
  "summary": {
    "totalAssessments": 150,
    "completedAssessments": 120,
    "activeClients": 45,
    "averageScore": 75.5,
    "trendsLastMonth": {
      "assessments": 15,
      "clients": 3,
      "avgScore": 2.5
    }
  },
  "charts": {
    "assessmentsByStatus": [
      { "status": "completed", "count": 120 },
      { "status": "in-progress", "count": 25 },
      { "status": "draft", "count": 5 }
    ],
    "scoreDistribution": [
      { "range": "90-100", "count": 30 },
      { "range": "80-89", "count": 45 },
      { "range": "70-79", "count": 35 },
      { "range": "60-69", "count": 10 }
    ],
    "monthlyTrends": [
      { "month": "2024-01", "assessments": 20, "avgScore": 73 },
      { "month": "2024-02", "assessments": 25, "avgScore": 76 }
    ]
  }
}
```

#### Assessment Reports

```typescript
GET /api/analytics/assessments/{assessmentId}/report
Authorization: Bearer <token>

Response: {
  "assessment": {
    "id": "string",
    "name": "string",
    "client": {...},
    "template": {...},
    "completedAt": "2024-01-01T00:00:00Z"
  },
  "scores": {
    "overall": 78,
    "sections": [
      { "name": "Security", "score": 85, "maxScore": 100 },
      { "name": "Compliance", "score": 70, "maxScore": 100 }
    ]
  },
  "recommendations": [
    {
      "priority": "high",
      "category": "security",
      "title": "Enable MFA",
      "description": "string",
      "impact": "high",
      "effort": "low"
    }
  ],
  "findings": [
    {
      "severity": "medium",
      "category": "compliance",
      "title": "Missing backup policy",
      "description": "string",
      "evidence": ["fileId1", "fileId2"]
    }
  ],
  "exportUrls": {
    "pdf": "string",
    "excel": "string",
    "json": "string"
  }
}
```

## 🔄 Real-time Updates

### WebSocket Events

The application uses Firebase Realtime Database for live updates:

```typescript
import { getDatabase, ref, onValue } from 'firebase/database';

const db = getDatabase();

// Listen to assessment updates
const assessmentRef = ref(db, `assessments/${assessmentId}`);
onValue(assessmentRef, (snapshot) => {
  const data = snapshot.val();
  // Handle real-time updates
});

// Listen to user notifications
const notificationRef = ref(db, `notifications/${userId}`);
onValue(notificationRef, (snapshot) => {
  const notifications = snapshot.val();
  // Handle new notifications
});
```

### Event Types

```typescript
// Assessment events
{
  "type": "assessment.updated",
  "assessmentId": "string",
  "changes": {
    "status": "completed",
    "progress": 100
  },
  "timestamp": "2024-01-01T00:00:00Z",
  "userId": "string"
}

// File events
{
  "type": "file.uploaded",
  "fileId": "string",
  "assessmentId": "string",
  "filename": "string",
  "timestamp": "2024-01-01T00:00:00Z",
  "userId": "string"
}

// Collaboration events
{
  "type": "user.joined",
  "assessmentId": "string",
  "userId": "string",
  "userName": "string",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 🔒 Security & Rate Limiting

### Rate Limits

```
GET requests: 100 per minute per user
POST/PUT requests: 20 per minute per user
File uploads: 10 per minute per user
Search requests: 30 per minute per user
```

### Security Headers

All API responses include security headers:

```
Content-Security-Policy: default-src 'self'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000
```

### Data Validation

All inputs are validated using JSON schemas:

```typescript
// Assessment creation schema
{
  "type": "object",
  "required": ["clientId", "templateId", "name"],
  "properties": {
    "clientId": {
      "type": "string",
      "pattern": "^[a-zA-Z0-9_-]+$"
    },
    "name": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100
    },
    "dueDate": {
      "type": "string",
      "format": "date-time"
    }
  }
}
```

## 📝 Error Handling

### Error Response Format

```typescript
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ],
    "requestId": "req_12345",
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

### Common Error Codes

```typescript
// Authentication errors
UNAUTHORIZED: 401,
FORBIDDEN: 403,
TOKEN_EXPIRED: 401,

// Validation errors
VALIDATION_ERROR: 400,
MISSING_REQUIRED_FIELD: 400,
INVALID_FORMAT: 400,

// Business logic errors
ASSESSMENT_NOT_FOUND: 404,
CLIENT_ALREADY_EXISTS: 409,
TEMPLATE_IN_USE: 409,

// File errors
FILE_TOO_LARGE: 413,
UNSUPPORTED_FILE_TYPE: 415,
UPLOAD_FAILED: 500,

// Rate limiting
RATE_LIMIT_EXCEEDED: 429,

// Server errors
INTERNAL_ERROR: 500,
SERVICE_UNAVAILABLE: 503
```

## 🧪 Testing

### API Testing

```typescript
// Jest test example
import { render, screen } from '@testing-library/react';
import { AssessmentService } from '../services/assessmentService';

describe('AssessmentService', () => {
  test('creates assessment successfully', async () => {
    const mockAssessment = {
      clientId: 'client123',
      templateId: 'template123',
      name: 'Test Assessment'
    };

    const result = await AssessmentService.create(mockAssessment);
    
    expect(result.id).toBeDefined();
    expect(result.name).toBe('Test Assessment');
    expect(result.status).toBe('draft');
  });

  test('handles validation errors', async () => {
    const invalidAssessment = {
      clientId: '',
      templateId: 'template123',
      name: ''
    };

    await expect(AssessmentService.create(invalidAssessment))
      .rejects
      .toThrow('Validation error');
  });
});
```

### Integration Tests

```typescript
// Cypress integration test
describe('Assessment Management', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password');
    cy.visit('/assessments');
  });

  it('creates new assessment', () => {
    cy.get('[data-cy=new-assessment-btn]').click();
    cy.get('[data-cy=client-select]').select('Test Client');
    cy.get('[data-cy=template-select]').select('Security Assessment');
    cy.get('[data-cy=assessment-name]').type('Q1 Security Review');
    cy.get('[data-cy=save-btn]').click();

    cy.get('[data-cy=success-message]')
      .should('contain', 'Assessment created successfully');
  });
});
```

## 📚 SDK Examples

### JavaScript/TypeScript SDK

```typescript
import { CloudReporterSDK } from '@cloud-reporter/sdk';

const sdk = new CloudReporterSDK({
  apiKey: 'your-api-key',
  projectId: 'your-project-id',
  baseUrl: 'https://api.cloudreporter.com'
});

// Create assessment
const assessment = await sdk.assessments.create({
  clientId: 'client123',
  templateId: 'template123',
  name: 'Q1 Security Assessment'
});

// Upload file
const file = await sdk.files.upload(fileBlob, {
  assessmentId: assessment.id,
  category: 'evidence'
});

// Get analytics
const analytics = await sdk.analytics.getDashboard({
  period: 'last-30-days'
});
```

### Python SDK

```python
from cloud_reporter import CloudReporterClient

client = CloudReporterClient(
    api_key='your-api-key',
    project_id='your-project-id'
)

# Create client
client_data = client.clients.create({
    'name': 'Acme Corp',
    'email': 'contact@acme.com',
    'industry': 'technology'
})

# Get assessments
assessments = client.assessments.list(
    client_id=client_data['id'],
    status='completed'
)

# Generate report
report = client.reports.generate(
    assessment_id='assessment123',
    format='pdf'
)
```

---

This API documentation provides comprehensive coverage of all Cloud Reporter endpoints and integration patterns. For additional examples and advanced use cases, refer to the SDK documentation and example repositories.