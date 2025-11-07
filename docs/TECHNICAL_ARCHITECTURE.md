# Cloud Reporter Technical Architecture Guide

## 🏗 System Architecture Overview

Cloud Reporter is built as a modern, scalable web application using React, TypeScript, and Firebase. The architecture follows enterprise-grade patterns for security, performance, and maintainability.

## 🔧 Technology Stack

### Frontend Stack
- **React 18**: Modern React with concurrent features and hooks
- **TypeScript**: Type-safe development with enhanced IDE support
- **Vite**: Fast build tool with HMR and optimized bundling
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Lucide React**: Modern icon library with consistent styling

### Backend & Services
- **Firebase Authentication**: Secure user authentication and authorization
- **Firestore**: NoSQL document database for scalable data storage
- **Firebase Storage**: Cloud storage for file uploads and assets
- **Firebase Hosting**: Fast, secure static website hosting
- **Firebase Functions**: Serverless functions for backend logic (future)

### Development & Quality Tools
- **ESLint**: Code linting with TypeScript and React rules
- **Prettier**: Code formatting for consistent style
- **Jest**: Unit testing framework with coverage reporting
- **Cypress**: End-to-end testing for user workflows
- **Storybook**: Component documentation and testing
- **GitHub Actions**: CI/CD pipeline automation

## 🏛 Application Architecture

### Component Architecture

```
src/
├── components/           # Reusable UI components
│   ├── design-system/   # Design system components
│   ├── layout/          # Layout components (Header, Sidebar, etc.)
│   ├── theme/           # Theme customization components
│   └── forms/           # Form-specific components
├── pages/               # Page-level components
├── contexts/            # React Context providers
├── services/            # Business logic and API services
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
└── lib/                 # Third-party library configurations
```

### Design System Architecture

The design system provides a consistent, reusable component library:

#### Core Components
- **Button**: Primary, secondary, ghost, and danger variants
- **Card**: Content containers with various layouts
- **Badge**: Status indicators and labels
- **Progress**: Progress bars and indicators
- **Form Controls**: Inputs, selects, checkboxes, and radios

#### Design Tokens
```typescript
// src/design-system/tokens.ts
export const designTokens = {
  colors: {
    primary: {
      50: '#eff6ff',
      500: '#3b82f6',
      900: '#1e3a8a'
    },
    // ... more color scales
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    // ... more spacing values
  },
  typography: {
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      // ... more font sizes
    }
  }
};
```

### State Management Architecture

#### Context-Based State Management
The application uses React Context for global state management:

```typescript
// Authentication Context
const AuthContext = createContext<AuthContextType | null>(null);

// Theme Context
const ThemeContext = createContext<ThemeContextType | null>(null);

// Application Context (global app state)
const AppContext = createContext<AppContextType | null>(null);
```

#### Local State Patterns
- **Component State**: useState for simple local state
- **Form State**: Custom hooks for form management
- **Async State**: useEffect with loading/error states
- **Derived State**: useMemo for computed values

### Service Layer Architecture

#### Service Pattern
Business logic is encapsulated in service classes:

```typescript
export class AssessmentService {
  static async create(data: CreateAssessmentData): Promise<Assessment> {
    // Validation
    this.validateAssessmentData(data);
    
    // Business logic
    const assessment = {
      ...data,
      id: generateId(),
      status: 'draft',
      createdAt: new Date(),
      userId: getCurrentUser().uid
    };
    
    // Database interaction
    await db.collection('assessments').doc(assessment.id).set(assessment);
    
    return assessment;
  }
}
```

#### Service Categories
- **Assessment Service**: Assessment CRUD operations
- **Client Service**: Client management
- **Template Service**: Template operations
- **File Management Service**: File upload/management
- **Analytics Service**: Reporting and analytics
- **Storage Service**: File storage operations

## 🔐 Security Architecture

### Authentication & Authorization

#### Firebase Authentication Flow
1. **User Registration**: Email/password or OAuth providers
2. **Token Management**: JWT tokens with automatic refresh
3. **Role-Based Access**: Custom claims for user roles
4. **Session Management**: Secure session handling

```typescript
// Authentication service
export const AuthService = {
  async signIn(email: string, password: string) {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    const token = await credential.user.getIdToken();
    
    // Set user role claims
    const userDoc = await getDoc(doc(db, 'users', credential.user.uid));
    const userData = userDoc.data();
    
    return { user: credential.user, role: userData?.role };
  }
};
```

#### Role-Based Access Control (RBAC)
```typescript
interface UserRole {
  role: 'admin' | 'manager' | 'user';
  permissions: Permission[];
  companyId?: string;
}

enum Permission {
  READ_ASSESSMENTS = 'assessments:read',
  WRITE_ASSESSMENTS = 'assessments:write',
  MANAGE_USERS = 'users:manage',
  ADMIN_SETTINGS = 'settings:admin'
}
```

### Data Security

#### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User-specific data access
    match /assessments/{assessmentId} {
      allow read, write: if request.auth != null 
        && resource.data.userId == request.auth.uid;
    }
    
    // Admin-only access
    match /systemSettings/{settingId} {
      allow read, write: if request.auth != null 
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

#### Data Encryption
- **In Transit**: HTTPS for all communications
- **At Rest**: Firebase's built-in encryption
- **Application Level**: Sensitive data hashing where needed

### File Security

#### Upload Security
```typescript
export class FileManagementService {
  private static readonly ALLOWED_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/vnd.ms-excel',
    'text/csv'
  ];
  
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  
  static validateFile(file: File): void {
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      throw new Error('File type not allowed');
    }
    
    if (file.size > this.MAX_FILE_SIZE) {
      throw new Error('File size exceeds limit');
    }
  }
}
```

## 📊 Data Architecture

### Database Design

#### Firestore Collections Structure
```
/assessments/{assessmentId}
  - id: string
  - clientId: string
  - templateId: string
  - userId: string
  - name: string
  - status: string
  - responses: object
  - createdAt: timestamp
  - updatedAt: timestamp

/clients/{clientId}
  - id: string
  - userId: string
  - name: string
  - email: string
  - company: string
  - industry: string
  - createdAt: timestamp

/templates/{templateId}
  - id: string
  - userId: string (null for global templates)
  - name: string
  - sections: array
  - isPublic: boolean
  - version: string

/uploadedFiles/{fileId}
  - id: string
  - userId: string
  - assessmentId: string (optional)
  - filename: string
  - originalName: string
  - mimeType: string
  - size: number
  - storageUrl: string
  - uploadedAt: timestamp
```

#### Data Relationships
- **User → Assessments**: One-to-many
- **User → Clients**: One-to-many
- **Client → Assessments**: One-to-many
- **Template → Assessments**: One-to-many
- **Assessment → Files**: One-to-many

### Data Access Patterns

#### Query Optimization
```typescript
// Efficient queries with proper indexing
export class AssessmentService {
  static async getByClient(clientId: string, limit = 20) {
    const q = query(
      collection(db, 'assessments'),
      where('clientId', '==', clientId),
      where('userId', '==', getCurrentUser().uid),
      orderBy('createdAt', 'desc'),
      limitToLast(limit)
    );
    
    return await getDocs(q);
  }
}
```

#### Caching Strategy
- **Browser Cache**: Static assets with long cache headers
- **Application Cache**: React Query for API response caching
- **Firebase Cache**: Firestore offline persistence
- **Service Worker**: PWA caching for offline functionality

## 🎨 UI/UX Architecture

### Component Design Patterns

#### Compound Components
```typescript
// Card component with compound pattern
export const Card = ({ children, ...props }) => (
  <div className="card" {...props}>
    {children}
  </div>
);

Card.Header = ({ children }) => (
  <div className="card-header">{children}</div>
);

Card.Body = ({ children }) => (
  <div className="card-body">{children}</div>
);

Card.Footer = ({ children }) => (
  <div className="card-footer">{children}</div>
);
```

#### Render Props Pattern
```typescript
// File upload with render props
export const FileUploader = ({ children, onUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  
  return children({
    isDragging,
    handleDrop: (files) => {
      setIsDragging(false);
      onUpload(files);
    }
  });
};
```

### Responsive Design

#### Mobile-First Approach
```css
/* Base mobile styles */
.container {
  padding: 1rem;
}

/* Tablet and larger */
@media (min-width: 768px) {
  .container {
    padding: 2rem;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    padding: 3rem;
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

#### Breakpoint System
```typescript
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};
```

## ⚡ Performance Architecture

### Code Splitting

#### Route-Based Splitting
```typescript
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Assessments = lazy(() => import('./pages/Assessments'));

export const AppRoutes = () => (
  <Routes>
    <Route 
      path="/dashboard" 
      element={
        <Suspense fallback={<LoadingSpinner />}>
          <Dashboard />
        </Suspense>
      } 
    />
  </Routes>
);
```

#### Component-Based Splitting
```typescript
const HeavyComponent = lazy(() => 
  import('./HeavyComponent').then(module => ({
    default: module.HeavyComponent
  }))
);
```

### Bundle Optimization

#### Vite Configuration
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          ui: ['lucide-react', '@radix-ui/react-dialog']
        }
      }
    }
  }
});
```

### Image Optimization

#### Responsive Images
```typescript
const OptimizedImage = ({ src, alt, sizes }) => (
  <picture>
    <source 
      media="(max-width: 640px)" 
      srcSet={`${src}?w=640&f=webp`} 
    />
    <source 
      media="(max-width: 1024px)" 
      srcSet={`${src}?w=1024&f=webp`} 
    />
    <img 
      src={`${src}?w=1920&f=webp`}
      alt={alt}
      loading="lazy"
      sizes={sizes}
    />
  </picture>
);
```

## 🧪 Testing Architecture

### Testing Strategy

#### Testing Pyramid
1. **Unit Tests** (70%): Component logic and utility functions
2. **Integration Tests** (20%): Component interactions and API calls
3. **E2E Tests** (10%): Critical user workflows

#### Test Organization
```
src/
├── __tests__/           # Global test utilities
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   └── Button.stories.tsx
└── services/
    ├── assessmentService.ts
    └── assessmentService.test.ts
```

### Unit Testing

#### Component Testing
```typescript
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  test('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### Service Testing
```typescript
// assessmentService.test.ts
import { AssessmentService } from './assessmentService';
import { mockFirestore } from '../__tests__/mocks/firebase';

jest.mock('../lib/firebase', () => mockFirestore);

describe('AssessmentService', () => {
  test('creates assessment with correct data', async () => {
    const assessmentData = {
      clientId: 'client123',
      templateId: 'template123',
      name: 'Test Assessment'
    };

    const result = await AssessmentService.create(assessmentData);

    expect(result).toMatchObject({
      ...assessmentData,
      status: 'draft',
      userId: expect.any(String)
    });
  });
});
```

### Integration Testing

#### API Integration Tests
```typescript
// assessment-flow.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssessmentPage } from './AssessmentPage';

test('creates and completes assessment', async () => {
  const user = userEvent.setup();
  render(<AssessmentPage />);

  // Create assessment
  await user.click(screen.getByRole('button', { name: /create/i }));
  await user.type(screen.getByLabelText(/name/i), 'Test Assessment');
  await user.click(screen.getByRole('button', { name: /save/i }));

  // Complete assessment
  await waitFor(() => {
    expect(screen.getByText('Test Assessment')).toBeInTheDocument();
  });
});
```

### End-to-End Testing

#### Cypress Configuration
```typescript
// cypress.config.ts
export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
});
```

#### E2E Test Example
```typescript
// cypress/e2e/assessment-workflow.cy.ts
describe('Assessment Workflow', () => {
  beforeEach(() => {
    cy.login('test@example.com', 'password');
  });

  it('completes full assessment workflow', () => {
    cy.visit('/assessments');
    cy.get('[data-cy=create-assessment]').click();
    
    cy.get('[data-cy=client-select]').select('Test Client');
    cy.get('[data-cy=template-select]').select('Security Assessment');
    cy.get('[data-cy=assessment-name]').type('Q1 Security Review');
    cy.get('[data-cy=save-btn]').click();

    cy.url().should('include', '/assessments/');
    cy.get('[data-cy=success-message]')
      .should('contain', 'Assessment created successfully');
  });
});
```

## 🚀 Deployment Architecture

### Build Process

#### Production Build
```bash
# Install dependencies
npm ci --production

# Type checking
npm run type-check

# Linting
npm run lint

# Testing
npm run test

# Build application
npm run build

# Deploy to Firebase
firebase deploy
```

#### Build Optimization
```typescript
// vite.config.ts production settings
export default defineConfig({
  build: {
    minify: 'terser',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: splitVendorChunk(),
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
});
```

### Infrastructure

#### Firebase Hosting Configuration
```json
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=31536000"
          }
        ]
      },
      {
        "source": "index.html",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache"
          }
        ]
      }
    ]
  }
}
```

### Monitoring & Observability

#### Performance Monitoring
```typescript
// Performance tracking
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

getCLS(console.log);
getFID(console.log);
getFCP(console.log);
getLCP(console.log);
getTTFB(console.log);
```

#### Error Tracking
```typescript
// Error boundary for React errors
export class ErrorBoundary extends Component {
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to monitoring service
    console.error('Application Error:', error, errorInfo);
    
    // Report to error tracking service
    if (process.env.NODE_ENV === 'production') {
      // Sentry.captureException(error);
    }
  }
}
```

---

This technical architecture guide provides a comprehensive overview of Cloud Reporter's technical implementation. For specific implementation details, refer to the codebase and individual component documentation.