# Firestore Database Schema

## Collections Structure

### clients
```typescript
{
  id: string; // Auto-generated document ID
  name: string;
  contactEmail: string;
  industry: string;
  description: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string; // User UID
}
```

### assessments
```typescript
{
  id: string; // Auto-generated document ID
  name: string;
  clientId: string; // Reference to clients collection
  assessmentTypeId: string; // Reference to assessmentTypes collection
  deadline: Timestamp | null;
  teamMembers: string; // Comma-separated names
  status: 'draft' | 'in_progress' | 'ready' | 'generating' | 'completed';
  readinessPercentage: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string; // User UID
}
```

### assessmentTypes
```typescript
{
  id: string; // Auto-generated document ID
  name: string;
  description: string;
  category: string;
  templateUrl: string | null;
  checklistUrl: string | null;
  groundedFilesUrls: string[]; // Array of PDF URLs
  mcpServers: string[]; // Array of MCP server names
  createdAt: Timestamp;
}
```

### requiredFiles
```typescript
{
  id: string; // Auto-generated document ID
  assessmentTypeId: string; // Reference to assessmentTypes
  fileName: string;
  description: string;
  fileOrder: number;
  isRequired: boolean;
  templateUrl: string | null;
  expectedFormat: string; // e.g., "xlsx", "pdf"
}
```

### uploadedFiles
```typescript
{
  id: string; // Auto-generated document ID
  assessmentId: string; // Reference to assessments
  requiredFileId: string; // Reference to requiredFiles
  fileName: string;
  fileUrl: string; // Firebase Storage URL
  fileSize: number;
  mimeType: string;
  status: 'uploaded' | 'validated' | 'error';
  validationMessage: string | null;
  uploadedAt: Timestamp;
  uploadedBy: string; // User UID
}
```

### promptBank
```typescript
{
  id: string; // Auto-generated document ID
  assessmentTypeId: string; // Reference to assessmentTypes
  sectionName: string;
  sectionOrder: number;
  promptType: 'file_review' | 'visualization' | 'cross_section' | 'analysis';
  promptTemplate: string;
  expectedOutputLength: number; // Word count
  requiredFileIds: string[]; // Array of requiredFile IDs needed for this section
}
```

### assessmentSections
```typescript
{
  id: string; // Auto-generated document ID
  assessmentId: string; // Reference to assessments
  promptBankId: string; // Reference to promptBank
  sectionOrder: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  generatedContent: string | null;
  visualizationData: string | null; // JSON string
  generatedAt: Timestamp | null;
  errorMessage: string | null;
}
```

### mcpServers
```typescript
{
  id: string; // Auto-generated document ID
  name: string;
  description: string;
  serverType: 'microsoft_learn' | 'azure_docs' | 'security_docs' | 'custom';
  endpoint: string;
  configuration: Record<string, any>; // Server-specific config
  isActive: boolean;
  createdAt: Timestamp;
}
```

## Indexes

### assessments
- clientId (ascending)
- createdBy (ascending)
- status (ascending)
- createdAt (descending)

### uploadedFiles
- assessmentId (ascending)
- requiredFileId (ascending)
- uploadedAt (descending)

### assessmentSections
- assessmentId (ascending)
- sectionOrder (ascending)

### requiredFiles
- assessmentTypeId (ascending)
- fileOrder (ascending)

### promptBank
- assessmentTypeId (ascending)
- sectionOrder (ascending)

## Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    // Clients collection
    match /clients/{clientId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated() && isOwner(resource.data.createdBy);
    }
    
    // Assessments collection
    match /assessments/{assessmentId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated() && isOwner(resource.data.createdBy);
    }
    
    // Assessment types (read-only for users)
    match /assessmentTypes/{typeId} {
      allow read: if isAuthenticated();
      allow write: if false; // Only admins via backend
    }
    
    // Required files (read-only for users)
    match /requiredFiles/{fileId} {
      allow read: if isAuthenticated();
      allow write: if false; // Only admins via backend
    }
    
    // Uploaded files
    match /uploadedFiles/{uploadId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update, delete: if isAuthenticated() && isOwner(resource.data.uploadedBy);
    }
    
    // Prompt bank (read-only for users)
    match /promptBank/{promptId} {
      allow read: if isAuthenticated();
      allow write: if false; // Only admins via backend
    }
    
    // Assessment sections
    match /assessmentSections/{sectionId} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated(); // Allow updates during generation
    }
    
    // MCP servers (read-only for users)
    match /mcpServers/{serverId} {
      allow read: if isAuthenticated();
      allow write: if false; // Only admins via backend
    }
  }
}
```

## Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Assessment files
    match /assessments/{assessmentId}/files/{fileName} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }
    
    // Assessment exports
    match /assessments/{assessmentId}/exports/{fileName} {
      allow read: if isAuthenticated();
      allow write: if isAuthenticated();
    }
    
    // Templates (read-only)
    match /templates/{fileName} {
      allow read: if true; // Public read
      allow write: if false; // Only admins
    }
    
    // Grounded files (read-only)
    match /grounded/{fileName} {
      allow read: if isAuthenticated();
      allow write: if false; // Only admins
    }
  }
}
```
