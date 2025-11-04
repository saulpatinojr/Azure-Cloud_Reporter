# Cloud Reporter - Implementation Guide

This guide provides detailed instructions for completing the remaining features of the Cloud Reporter application.

## Architecture Overview

**Stack:**
- Frontend: React 18 + TypeScript + Vite
- Styling: Tailwind CSS
- Database: Firebase Firestore
- Storage: Firebase Storage
- Authentication: Firebase Auth (Google Sign-in)
- AI: Google Vertex AI (Gemini)
- Package Manager: npm

**Project Structure:**
```
src/
├── components/       # Reusable UI components
├── contexts/         # React contexts (AuthContext)
├── hooks/            # Custom React hooks
├── lib/              # Firebase configuration
├── pages/            # Page components
├── services/         # Firestore and Storage services
├── types/            # TypeScript type definitions
└── utils/            # Utility functions
```

## Completed Features

✅ Firebase configuration (Auth, Firestore, Storage)
✅ TypeScript types for all data models
✅ Firestore services (clients, assessments)
✅ Storage service for file uploads
✅ Authentication context with Google Sign-in
✅ Home/Landing page
✅ Dashboard with statistics
✅ Utility functions (formatters, helpers)

## Remaining Features to Implement

### 1. Client Management Pages

**Files to create:**
- `src/pages/Clients.tsx` - List all clients
- `src/pages/ClientForm.tsx` - Create/edit client form

**Implementation:**
```typescript
// src/pages/Clients.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getClients, deleteClient } from '../services/clientService';
import type { Client } from '../types';

export default function Clients() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    if (!user) return;
    const data = await getClients(user.uid);
    setClients(data);
    setLoading(false);
  };

  const handleDelete = async (clientId: string) => {
    if (confirm('Delete this client?')) {
      await deleteClient(clientId);
      loadClients();
    }
  };

  // Render client list with edit/delete actions
  // Add "New Client" button that navigates to /clients/new
}
```

```typescript
// src/pages/ClientForm.tsx
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createClient, updateClient, getClientById } from '../services/clientService';

export default function ClientForm() {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    contactEmail: '',
    industry: '',
    description: '',
  });

  // Load existing client if editing
  // Handle form submission
  // Call createClient or updateClient
  // Navigate back to /clients on success
}
```

**Add routes to App.tsx:**
```typescript
<Route path="/clients" element={<ProtectedRoute><Clients /></ProtectedRoute>} />
<Route path="/clients/new" element={<ProtectedRoute><ClientForm /></ProtectedRoute>} />
<Route path="/clients/:id/edit" element={<ProtectedRoute><ClientForm /></ProtectedRoute>} />
```

### 2. Assessment Type Service

**Create:** `src/services/assessmentTypeService.ts`

```typescript
import { collection, getDocs, doc, getDoc, query, where } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { AssessmentType, RequiredFile, PromptBank } from '../types';

export async function getAssessmentTypes(): Promise<AssessmentType[]> {
  const snapshot = await getDocs(collection(db, 'assessmentTypes'));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as AssessmentType));
}

export async function getRequiredFiles(assessmentTypeId: string): Promise<RequiredFile[]> {
  const q = query(
    collection(db, 'requiredFiles'),
    where('assessmentTypeId', '==', assessmentTypeId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RequiredFile));
}

export async function getPromptBank(assessmentTypeId: string): Promise<PromptBank[]> {
  const q = query(
    collection(db, 'promptBank'),
    where('assessmentTypeId', '==', assessmentTypeId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PromptBank));
}
```

### 3. Assessment Creation Page

**Create:** `src/pages/AssessmentForm.tsx`

```typescript
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { createAssessment } from '../services/assessmentService';
import { getClients } from '../services/clientService';
import { getAssessmentTypes } from '../services/assessmentTypeService';
import { Timestamp } from 'firebase/firestore';

export default function AssessmentForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [assessmentTypes, setAssessmentTypes] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    clientId: '',
    assessmentTypeId: '',
    deadline: '',
    teamMembers: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    if (!user) return;
    const [clientsData, typesData] = await Promise.all([
      getClients(user.uid),
      getAssessmentTypes(),
    ]);
    setClients(clientsData);
    setAssessmentTypes(typesData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const assessmentId = await createAssessment({
      ...formData,
      deadline: formData.deadline ? Timestamp.fromDate(new Date(formData.deadline)) : null,
    }, user.uid);

    navigate(`/assessments/${assessmentId}`);
  };

  // Render form with dropdowns for client and assessment type
}
```

### 4. Assessment Detail with File Upload

**Create:** `src/pages/AssessmentDetail.tsx`

This is the most complex page. It needs to:
1. Display assessment info
2. Show required files list with status indicators
3. Allow file uploads
4. Calculate readiness percentage
5. Show "Ready to Assess" button at 90%+

**Key features:**
```typescript
// File upload component
const FileUploadRow = ({ requiredFile, uploadedFile, onUpload }) => {
  const getStatusColor = () => {
    if (!uploadedFile) return 'text-red-500'; // Red - missing
    if (uploadedFile.status === 'error') return 'text-yellow-500'; // Yellow - error
    return 'text-blue-500'; // Blue - uploaded/validated
  };

  return (
    <div className="flex items-center gap-4 p-4 border rounded">
      <div className={`w-4 h-4 rounded-full ${getStatusColor()}`} />
      <div className="flex-1">
        <h4>{requiredFile.fileName}</h4>
        <p className="text-sm text-gray-600">{requiredFile.description}</p>
      </div>
      {requiredFile.templateUrl && (
        <a href={requiredFile.templateUrl} className="text-sm text-blue-600">
          Download Template
        </a>
      )}
      <input type="file" onChange={(e) => onUpload(e.target.files[0])} />
    </div>
  );
};

// Readiness calculation
const calculateReadiness = (requiredFiles, uploadedFiles) => {
  const totalRequired = requiredFiles.filter(f => f.isRequired).length;
  const uploaded = uploadedFiles.filter(f => f.status === 'validated').length;
  return Math.round((uploaded / totalRequired) * 100);
};
```

**File Upload Service:**
```typescript
// src/services/uploadedFileService.ts
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { uploadAssessmentFile } from './storageService';

export async function uploadFile(
  assessmentId: string,
  requiredFileId: string,
  file: File,
  userId: string
) {
  // Upload to Firebase Storage
  const { url, path } = await uploadAssessmentFile(assessmentId, file, requiredFileId);

  // Save metadata to Firestore
  await addDoc(collection(db, 'uploadedFiles'), {
    assessmentId,
    requiredFileId,
    fileName: file.name,
    fileUrl: url,
    fileSize: file.size,
    mimeType: file.type,
    status: 'uploaded',
    validationMessage: null,
    uploadedAt: serverTimestamp(),
    uploadedBy: userId,
  });
}

export async function getUploadedFiles(assessmentId: string) {
  const q = query(
    collection(db, 'uploadedFiles'),
    where('assessmentId', '==', assessmentId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
```

### 5. Vertex AI Integration

**Create:** `src/services/vertexAIService.ts`

```typescript
// Note: Vertex AI calls should be made from a backend/Cloud Function
// For security, don't expose service account credentials in frontend

export async function generateAssessmentSection(
  prompt: string,
  context: any,
  files: string[]
): Promise<string> {
  // Call your backend endpoint that uses Vertex AI
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, context, files }),
  });
  
  const data = await response.json();
  return data.generatedContent;
}
```

**Backend (Cloud Function):**
```typescript
// functions/src/index.ts
import { VertexAI } from '@google-cloud/aiplatform';

export const generateAssessment = onCall(async (request) => {
  const { prompt, context, files } = request.data;
  
  const vertexAI = new VertexAI({
    project: process.env.GOOGLE_CLOUD_PROJECT_ID,
    location: 'us-central1',
  });
  
  const model = vertexAI.preview.getGenerativeModel({
    model: 'gemini-pro',
  });
  
  const result = await model.generateContent(prompt);
  return { generatedContent: result.response.text() };
});
```

### 6. Assessment Generation Workflow

**Create:** `src/pages/AssessmentGeneration.tsx`

```typescript
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPromptBank } from '../services/assessmentTypeService';
import { generateAssessmentSection } from '../services/vertexAIService';

export default function AssessmentGeneration() {
  const { id } = useParams();
  const [sections, setSections] = useState([]);
  const [currentSection, setCurrentSection] = useState(0);
  const [generating, setGenerating] = useState(false);

  const generateNextSection = async () => {
    setGenerating(true);
    const section = sections[currentSection];
    
    // Generate content using Vertex AI
    const content = await generateAssessmentSection(
      section.promptTemplate,
      {}, // context
      [] // files
    );
    
    // Save to Firestore
    // Move to next section
    setCurrentSection(prev => prev + 1);
    setGenerating(false);
  };

  // Render progress bar and current section status
}
```

### 7. Document Generation

**Create:** `src/services/documentService.ts`

```typescript
import { Document, Packer, Paragraph, TextRun } from 'docx';
import jsPDF from 'jspdf';

export async function generateDOCX(sections: any[]): Promise<Blob> {
  const doc = new Document({
    sections: [{
      children: sections.flatMap(section => [
        new Paragraph({
          children: [new TextRun({ text: section.sectionName, bold: true, size: 32 })],
        }),
        new Paragraph({
          children: [new TextRun({ text: section.generatedContent })],
        }),
      ]),
    }],
  });
  
  return await Packer.toBlob(doc);
}

export async function generatePDF(sections: any[]): Promise<Blob> {
  const pdf = new jsPDF();
  let yPosition = 20;
  
  sections.forEach(section => {
    pdf.setFontSize(16);
    pdf.text(section.sectionName, 20, yPosition);
    yPosition += 10;
    
    pdf.setFontSize(12);
    const lines = pdf.splitTextToSize(section.generatedContent, 170);
    pdf.text(lines, 20, yPosition);
    yPosition += lines.length * 7;
  });
  
  return pdf.output('blob');
}
```

**Install dependencies:**
```bash
npm install docx jspdf
```

### 8. Seed Data Script

**Create:** `scripts/seedData.ts`

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// Initialize Firebase with your config
const app = initializeApp({ /* your config */ });
const db = getFirestore(app);

async function seedAssessmentTypes() {
  // Azure Cloud Infrastructure Assessment
  const azureTypeRef = await addDoc(collection(db, 'assessmentTypes'), {
    name: 'Azure Cloud Infrastructure Assessment',
    description: 'Comprehensive assessment of Azure cloud infrastructure',
    category: 'Cloud Infrastructure',
    templateUrl: null,
    checklistUrl: null,
    groundedFilesUrls: [],
    mcpServers: ['microsoft_learn', 'azure_docs'],
    createdAt: serverTimestamp(),
  });

  // Add required files
  await addDoc(collection(db, 'requiredFiles'), {
    assessmentTypeId: azureTypeRef.id,
    fileName: 'Network Architecture Diagram',
    description: 'Current Azure network topology',
    fileOrder: 1,
    isRequired: true,
    templateUrl: null,
    expectedFormat: 'pdf',
  });

  // Add prompt bank
  await addDoc(collection(db, 'promptBank'), {
    assessmentTypeId: azureTypeRef.id,
    sectionName: 'Executive Summary',
    sectionOrder: 1,
    promptType: 'analysis',
    promptTemplate: 'Based on the uploaded files, create a 500-word executive summary...',
    expectedOutputLength: 500,
    requiredFileIds: [],
  });
}

seedAssessmentTypes().then(() => console.log('Seeded!'));
```

**Run:**
```bash
npx tsx scripts/seedData.ts
```

## Environment Variables

Create `.env` file:
```
VITE_FIREBASE_API_KEY=your-key
VITE_FIREBASE_AUTH_DOMAIN=your-domain
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
VITE_GOOGLE_CLOUD_PROJECT_ID=your-gcp-project
VITE_VERTEX_AI_LOCATION=us-central1
```

## Firebase Security Rules

Deploy the security rules from `FIRESTORE_SCHEMA.md` to your Firebase project:

```bash
firebase deploy --only firestore:rules
firebase deploy --only storage:rules
```

## Deployment

1. Build the app: `npm run build`
2. Deploy to Firebase Hosting:
```bash
firebase init hosting
firebase deploy --only hosting
```

## Testing Checklist

- [ ] User can sign in with Google
- [ ] Dashboard shows correct statistics
- [ ] Can create and edit clients
- [ ] Can create assessments
- [ ] Can upload files with status indicators
- [ ] Readiness percentage updates correctly
- [ ] "Ready to Assess" button appears at 90%
- [ ] Assessment generation works
- [ ] Can export DOCX and PDF
- [ ] Presentation view works

## Next Steps

1. Complete remaining pages (Clients, Assessments, File Upload)
2. Implement Vertex AI backend (Cloud Functions)
3. Add MCP server integration
4. Create seed data
5. Test complete workflow
6. Deploy to Firebase

## Support

For questions or issues, refer to:
- Firebase Documentation: https://firebase.google.com/docs
- Vertex AI Documentation: https://cloud.google.com/vertex-ai/docs
- React Documentation: https://react.dev
