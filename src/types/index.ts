import { Timestamp } from 'firebase/firestore';

export interface Client {
  id: string;
  name: string;
  contactEmail: string;
  industry: string;
  description: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}

export interface Assessment {
  id: string;
  name: string;
  clientId: string;
  assessmentTypeId: string;
  deadline: Timestamp | null;
  teamMembers: string;
  status: 'draft' | 'in_progress' | 'ready' | 'generating' | 'completed' | 'planning' | 'discovery' | 'analysis' | 'review' | 'archived';
  readinessPercentage: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
}

export interface AssessmentType {
  id: string;
  name: string;
  description: string;
  category: string;
  templateUrl: string | null;
  checklistUrl: string | null;
  groundedFilesUrls: string[];
  mcpServers: string[];
  createdAt: Timestamp;
}

export interface RequiredFile {
  id: string;
  assessmentTypeId: string;
  fileName: string;
  description: string;
  fileOrder: number;
  isRequired: boolean;
  templateUrl: string | null;
  expectedFormat: string;
}

export interface UploadedFile {
  id: string;
  assessmentId: string;
  requiredFileId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  status: 'uploaded' | 'validated' | 'error';
  validationMessage: string | null;
  uploadedAt: Timestamp;
  uploadedBy: string;
}

export interface PromptBank {
  id: string;
  assessmentTypeId: string;
  sectionName: string;
  sectionOrder: number;
  promptType: 'file_review' | 'visualization' | 'cross_section' | 'analysis';
  promptTemplate: string;
  expectedOutputLength: number;
  requiredFileIds: string[];
}

export interface AssessmentSection {
  id: string;
  assessmentId: string;
  promptBankId: string;
  sectionOrder: number;
  status: 'pending' | 'processing' | 'completed' | 'error';
  generatedContent: string | null;
  visualizationData: string | null;
  generatedAt: Timestamp | null;
  errorMessage: string | null;
}

export interface MCPServer {
  id: string;
  name: string;
  description: string;
  serverType: 'microsoft_learn' | 'azure_docs' | 'security_docs' | 'custom';
  endpoint: string;
  configuration: Record<string, any>;
  isActive: boolean;
  createdAt: Timestamp;
}

export interface TemplateVariable {
  key: string;
  label: string;
  description?: string;
  sampleValue?: string;
  required?: boolean;
  source?: 'ingestion' | 'manual' | 'ai';
}

export interface TemplateSection {
  id: string;
  title: string;
  description?: string;
  prompt: string;
  variables: TemplateVariable[];
  visualization?: 'table' | 'chart' | 'text';
  order: number;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  version: string;
  status: 'draft' | 'published';
  updatedAt: Timestamp;
  tags: string[];
  sections: TemplateSection[];
}

export interface TemplateSummary {
  id: string;
  name: string;
  category: string;
  version: string;
  status: 'draft' | 'published';
  updatedAt: Timestamp;
  tags: string[];
  sectionsCount: number;
}

// Form types for creating/updating
export type CreateClientInput = Omit<Client, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>;
export type UpdateClientInput = Partial<CreateClientInput>;

export type CreateAssessmentInput = Omit<Assessment, 'id' | 'createdAt' | 'updatedAt' | 'createdBy' | 'status' | 'readinessPercentage'>;
export type UpdateAssessmentInput = Partial<CreateAssessmentInput>;
