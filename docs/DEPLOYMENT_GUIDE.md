# Cloud Reporter Enterprise Deployment Guide

## 🚀 Overview

Cloud Reporter is an enterprise-grade MSP (Managed Service Provider) assessment platform designed for white-label deployment. This guide provides comprehensive setup instructions for enterprise deployment, configuration, and customization.

## 📋 Prerequisites

### System Requirements

- **Node.js**: Version 18.x or higher
- **npm**: Version 8.x or higher
- **Firebase Project**: Google Firebase account with billing enabled
- **Domain**: Custom domain for white-label deployment (optional)
- **SSL Certificate**: For production HTTPS deployment

### Development Environment

```bash
# Verify Node.js version
node --version  # Should be 18.x+

# Verify npm version
npm --version   # Should be 8.x+

# Install global dependencies
npm install -g firebase-tools
```

## 🛠 Installation & Setup

### 1. Project Setup

```bash
# Clone the repository
git clone https://github.com/your-org/azure-cloud-reporter.git
cd azure-cloud-reporter

# Install dependencies
npm install --legacy-peer-deps

# Install development dependencies
npm install -D @types/node typescript
```

### 2. Firebase Configuration

#### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing project
3. Enable the following services:
   - **Authentication** (Email/Password, Google)
   - **Firestore Database**
   - **Storage**
   - **Hosting** (for deployment)

#### Firebase Configuration File

Create `src/lib/firebase.ts` with your Firebase config:

```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
```

#### Environment Variables

Create `.env.local` file:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id

# Application Configuration
VITE_APP_NAME="Your Company Name"
VITE_APP_URL=https://your-domain.com
VITE_SUPPORT_EMAIL=support@yourcompany.com

# Optional: Analytics
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### 3. Database Setup

#### Firestore Security Rules

Deploy the following security rules to Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Clients - user-specific
    match /clients/{clientId} {
      allow read, write: if request.auth != null 
        && resource.data.userId == request.auth.uid;
    }
    
    // Assessments - user-specific
    match /assessments/{assessmentId} {
      allow read, write: if request.auth != null 
        && resource.data.userId == request.auth.uid;
    }
    
    // Assessment Types - global read, admin write
    match /assessmentTypes/{typeId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null 
        && request.auth.token.admin == true;
    }
    
    // Templates - user-specific
    match /templates/{templateId} {
      allow read, write: if request.auth != null 
        && resource.data.userId == request.auth.uid;
    }
    
    // Uploaded Files - user-specific
    match /uploadedFiles/{fileId} {
      allow read, write: if request.auth != null 
        && resource.data.userId == request.auth.uid;
    }
  }
}
```

#### Storage Security Rules

Deploy the following security rules to Firebase Storage:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User-specific file uploads
    match /uploads/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
    
    // Assessment files
    match /assessments/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
    
    // Template files
    match /templates/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null 
        && request.auth.uid == userId;
    }
    
    // Public assets (logos, etc.)
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null 
        && request.auth.token.admin == true;
    }
  }
}
```

## 🎨 White-Label Configuration

### 1. Brand Customization

#### Theme Configuration

Create or update `src/config/brand.ts`:

```typescript
import { ThemeConfig } from '../contexts/ThemeContext';

export const brandConfig: Partial<ThemeConfig> = {
  companyName: "Your MSP Company",
  colors: {
    primary: "#1e40af",      // Your primary brand color
    secondary: "#64748b",    // Secondary color
    accent: "#f59e0b",       // Accent color
    success: "#059669",      // Success state
    warning: "#d97706",      // Warning state
    error: "#dc2626",        // Error state
    background: "#ffffff",   // Background
    surface: "#f8fafc",      // Surface color
  },
  logo: {
    primary: "/assets/logo-primary.svg",
    dark: "/assets/logo-dark.svg",
    favicon: "/assets/favicon.ico"
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace'],
      display: ['Inter', 'system-ui', 'sans-serif']
    }
  }
};
```

#### Logo Assets

Place your brand assets in the `public/assets/` directory:

```
public/
├── assets/
│   ├── logo-primary.svg      # Main logo (light backgrounds)
│   ├── logo-dark.svg         # Dark mode logo
│   ├── favicon.ico           # Browser favicon
│   ├── logo-192x192.png      # PWA icon (192x192)
│   └── logo-512x512.png      # PWA icon (512x512)
```

### 2. Application Metadata

Update `index.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/assets/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Application Metadata -->
    <title>Cloud Reporter - Your MSP Company</title>
    <meta name="description" content="Enterprise cloud assessment platform for MSPs" />
    <meta name="author" content="Your MSP Company" />
    
    <!-- Open Graph -->
    <meta property="og:title" content="Cloud Reporter - Your MSP Company" />
    <meta property="og:description" content="Enterprise cloud assessment platform" />
    <meta property="og:image" content="/assets/logo-512x512.png" />
    <meta property="og:url" content="https://your-domain.com" />
    
    <!-- PWA Manifest -->
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#1e40af" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

### 3. PWA Configuration

Create `public/manifest.json`:

```json
{
  "name": "Cloud Reporter - Your MSP Company",
  "short_name": "Cloud Reporter",
  "description": "Enterprise cloud assessment platform for MSPs",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#1e40af",
  "icons": [
    {
      "src": "/assets/logo-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/assets/logo-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🔧 Development & Testing

### Local Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Run linting
npm run lint

# Type checking
npm run type-check
```

### Environment-Specific Configuration

#### Development (`env.development`)

```env
VITE_ENVIRONMENT=development
VITE_API_URL=http://localhost:3000
VITE_FIREBASE_AUTH_DOMAIN=your-dev-project.firebaseapp.com
VITE_DEBUG_MODE=true
```

#### Staging (`env.staging`)

```env
VITE_ENVIRONMENT=staging
VITE_API_URL=https://api-staging.yourcompany.com
VITE_FIREBASE_AUTH_DOMAIN=your-staging-project.firebaseapp.com
VITE_DEBUG_MODE=false
```

#### Production (`env.production`)

```env
VITE_ENVIRONMENT=production
VITE_API_URL=https://api.yourcompany.com
VITE_FIREBASE_AUTH_DOMAIN=your-prod-project.firebaseapp.com
VITE_DEBUG_MODE=false
VITE_SENTRY_DSN=your-sentry-dsn
```

## 🚀 Deployment

### Firebase Hosting Deployment

#### 1. Initialize Firebase Hosting

```bash
# Login to Firebase
firebase login

# Initialize hosting
firebase init hosting

# Select your Firebase project
# Choose build as public directory
# Configure as SPA (Single Page Application)
```

#### 2. Configure `firebase.json`

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
        "source": "**/*.@(eot|otf|ttf|ttc|woff|font.css)",
        "headers": [
          {
            "key": "Access-Control-Allow-Origin",
            "value": "*"
          }
        ]
      },
      {
        "source": "**/*.@(js|css)",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "max-age=604800"
          }
        ]
      }
    ]
  }
}
```

#### 3. Deploy to Firebase

```bash
# Build the application
npm run build

# Deploy to Firebase
firebase deploy --only hosting

# Deploy to specific project
firebase use your-project-id
firebase deploy --only hosting
```

### Custom Domain Setup

#### 1. Configure Custom Domain

```bash
# Add custom domain in Firebase Console
# Go to Hosting > Add custom domain
# Follow DNS verification steps
```

#### 2. SSL Certificate

Firebase automatically provisions SSL certificates for custom domains. Ensure your domain DNS is properly configured.

### CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci --legacy-peer-deps
    
    - name: Run tests
      run: npm run test
    
    - name: Build application
      run: npm run build
      env:
        VITE_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
        VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
        VITE_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
        VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
        VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
        VITE_FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
    
    - name: Deploy to Firebase
      uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
        projectId: your-project-id
```

## 🔐 Security Configuration

### Authentication Setup

#### 1. Configure Firebase Authentication

```typescript
// src/lib/auth.ts
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from './firebase';

export const signIn = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signUp = async (email: string, password: string) => {
  return await createUserWithEmailAndPassword(auth, email, password);
};

export const logout = async () => {
  return await signOut(auth);
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
```

#### 2. Role-Based Access Control

```typescript
// src/lib/rbac.ts
import { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface UserRole {
  role: 'admin' | 'manager' | 'user';
  permissions: string[];
  companyId?: string;
}

export const getUserRole = async (user: User): Promise<UserRole> => {
  const userDoc = await getDoc(doc(db, 'users', user.uid));
  const userData = userDoc.data();
  
  return {
    role: userData?.role || 'user',
    permissions: userData?.permissions || [],
    companyId: userData?.companyId
  };
};

export const hasPermission = (userRole: UserRole, permission: string): boolean => {
  return userRole.permissions.includes(permission) || userRole.role === 'admin';
};
```

### Data Privacy & Compliance

#### GDPR Compliance

1. **Data Minimization**: Only collect necessary user data
2. **Right to Access**: Provide user data export functionality
3. **Right to Deletion**: Implement account deletion features
4. **Data Portability**: Export user data in standard formats
5. **Privacy Policy**: Include comprehensive privacy policy

#### Data Encryption

All data is encrypted in transit and at rest through Firebase's built-in security features.

## 📊 Monitoring & Analytics

### Error Tracking (Sentry)

```bash
# Install Sentry
npm install @sentry/react @sentry/tracing
```

```typescript
// src/lib/sentry.ts
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    new Integrations.BrowserTracing(),
  ],
  tracesSampleRate: 1.0,
  environment: import.meta.env.VITE_ENVIRONMENT,
});
```

### Performance Monitoring

```typescript
// src/lib/analytics.ts
import { getAnalytics, logEvent } from 'firebase/analytics';
import { app } from './firebase';

const analytics = getAnalytics(app);

export const trackEvent = (eventName: string, parameters?: any) => {
  if (import.meta.env.PROD) {
    logEvent(analytics, eventName, parameters);
  }
};

export const trackPageView = (pageName: string) => {
  trackEvent('page_view', { page_title: pageName });
};
```

## 🔧 Maintenance & Updates

### Backup Strategy

1. **Firestore Backup**: Use Firebase's automatic backup feature
2. **Storage Backup**: Regular export of uploaded files
3. **Configuration Backup**: Version control for theme and configuration

### Update Process

1. **Staging Deployment**: Test all changes in staging environment
2. **User Communication**: Notify users of upcoming updates
3. **Rolling Deployment**: Deploy updates with zero downtime
4. **Rollback Plan**: Maintain ability to quickly rollback changes

### Performance Optimization

1. **Code Splitting**: Implement route-based code splitting
2. **Asset Optimization**: Compress images and minimize bundle size
3. **Caching Strategy**: Implement proper caching headers
4. **CDN Usage**: Use Firebase's CDN for asset delivery

## 📞 Support & Documentation

### User Training Materials

1. **User Guide**: Comprehensive user documentation
2. **Video Tutorials**: Step-by-step video guides
3. **FAQ**: Common questions and answers
4. **Best Practices**: MSP workflow recommendations

### Technical Support

1. **Issue Tracking**: Use GitHub Issues for bug tracking
2. **Support Portal**: Dedicated support email/portal
3. **Documentation**: Keep technical documentation updated
4. **Community**: Consider developer community forums

## 🎯 Success Metrics

### Key Performance Indicators

1. **User Adoption**: Monthly active users
2. **Feature Usage**: Assessment completion rates
3. **Performance**: Page load times, error rates
4. **Business Value**: Client assessments completed, revenue generated

### Monitoring Dashboard

Set up monitoring for:
- Application uptime
- User engagement metrics
- Error rates and types
- Performance metrics
- Security events

---

This deployment guide provides the foundation for successfully deploying Cloud Reporter as an enterprise MSP solution. For additional support, refer to the technical documentation or contact the development team.