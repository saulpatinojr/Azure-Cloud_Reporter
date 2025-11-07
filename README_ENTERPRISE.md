# Cloud Reporter - Enterprise MSP Assessment Platform

## 🚀 Overview

Cloud Reporter is a comprehensive, enterprise-grade assessment platform designed specifically for Managed Service Providers (MSPs). Built with modern web technologies, it enables MSPs to conduct thorough security, compliance, and performance assessments for their clients with advanced file management, white-label branding, and robust analytics.

## ✨ Key Features

### 🔍 **Advanced Assessment Management**
- **Multi-Template Support**: Security, compliance, performance, and cost optimization assessments
- **Dynamic Forms**: Flexible question types with conditional logic
- **Progress Tracking**: Real-time completion status and section-based navigation
- **Collaboration Tools**: Team assignments and review workflows
- **Automated Scoring**: Intelligent scoring algorithms with customizable weights

### 👥 **Comprehensive Client Management**
- **Client Profiles**: Detailed client information with contact management
- **Industry Categorization**: Organize clients by industry and service types
- **Activity Tracking**: Timeline of all client interactions and assessments
- **Contact Management**: Multiple contacts per client with role definitions
- **Client Analytics**: Performance metrics and engagement tracking

### 📁 **Enterprise File Management**
- **Multi-Format Support**: PDF, PNG, JPG, CSV, TXT, DOCX, XLSX, and more
- **Drag & Drop Interface**: Modern file upload with progress tracking
- **Advanced Search**: Full-text search across uploaded documents
- **File Analytics**: Upload statistics, storage usage, and access tracking
- **Bulk Operations**: Mass file management with batch processing
- **OCR Integration**: Text extraction from scanned documents

### 🎨 **White-Label Theme System**
- **Complete Brand Customization**: Colors, typography, logos, and styling
- **Theme Presets**: Professional, Modern, and Enterprise themes
- **Real-Time Preview**: Live theme customization with instant preview
- **Custom CSS Support**: Advanced styling with custom CSS injection
- **Multi-Logo Support**: Different logos for light/dark modes
- **Company Branding**: Custom company names and favicon support

### 📊 **Advanced Analytics & Reporting**
- **Executive Dashboards**: High-level metrics and KPI tracking
- **Detailed Reports**: Comprehensive assessment findings and recommendations
- **Trend Analysis**: Performance tracking over time
- **Export Options**: PDF, Excel, and JSON export formats
- **Custom Report Builder**: Tailored reports for different stakeholders

### 🔐 **Enterprise Security**
- **Firebase Authentication**: Secure user authentication with role-based access
- **Data Encryption**: End-to-end encryption for all data transmission
- **Role-Based Permissions**: Admin, Manager, and User roles with granular permissions
- **Audit Logging**: Complete audit trail of all system activities
- **Compliance Ready**: GDPR, SOC 2, and industry compliance features

## 🛠 Technology Stack

### Frontend
- **React 19** with TypeScript for type-safe development
- **Vite** for fast development and optimized production builds
- **Tailwind CSS** for responsive, utility-first styling
- **Lucide React** for consistent iconography
- **Modern Browser APIs** for file handling and offline capability

### Backend & Services
- **Firebase Authentication** for secure user management
- **Firestore** for scalable NoSQL data storage
- **Firebase Storage** for secure file storage and CDN delivery
- **Firebase Hosting** for global, fast content delivery
- **Cloud Run Services** for microservice architecture
- **Real-time Sync** for collaborative features

### Cloud Services & Microservices
- **BackOffice Service**: R-based analytics via Cloud Run (`docs/backoffice-cloud-run.md`)
- **Ingestion API**: File processing and Pub/Sub integration (`services/ingestion/`)
- **AI Orchestrator**: Vertex AI integration for content generation (`services/orchestrator/`)

### Development & Quality
- **TypeScript** for enhanced developer experience and code quality
- **ESLint & Prettier** for code consistency and formatting
- **Jest** for comprehensive unit testing
- **Cypress** for end-to-end testing
- **Storybook** for component documentation and testing

## 📦 Quick Start

### Prerequisites

- Node.js 18+ and npm 8+
- Firebase project with enabled services
- Google Cloud Platform account (for Cloud Run services)
- Modern web browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/azure-cloud-reporter.git
cd azure-cloud-reporter

# Install dependencies
npm install --legacy-peer-deps

# Configure environment variables
cp .env.example .env.local
# Edit .env.local with your configuration
```

### Environment Configuration

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id

# Cloud Run Services
VITE_BACKOFFICE_API_URL=https://backoffice-service-url
VITE_API_BASE_URL=https://ingestion-api-url
VITE_AI_API_URL=https://ai-orchestrator-url
```

### Development Server

```bash
# Start development server
npm run dev

# Open browser to http://localhost:5173
```

## 🏗 Project Structure

```
├── docs/                     # Comprehensive documentation
│   ├── DEPLOYMENT_GUIDE.md   # Enterprise deployment instructions
│   ├── API_DOCUMENTATION.md  # Complete API reference
│   ├── USER_GUIDE.md         # End-user documentation
│   ├── TECHNICAL_ARCHITECTURE.md # Technical implementation guide
│   ├── backoffice-cloud-run.md # BackOffice deployment guide
│   └── cloud-reporter-transformation.md # Architecture blueprint
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── design-system/    # Design system components
│   │   ├── layout/           # Layout components (AppShell, Sidebar, Topbar)
│   │   └── theme/            # Theme customization components
│   ├── pages/                # Page-level components
│   ├── services/             # Business logic and API services
│   │   └── api/              # Cloud Run API abstraction layer
│   ├── contexts/             # React Context providers (Auth, Theme)
│   ├── hooks/                # Custom React hooks
│   ├── utils/                # Utility functions
│   ├── types/                # TypeScript definitions
│   └── lib/                  # Third-party configurations
├── services/                 # Cloud Run microservices
│   ├── ingestion/            # File processing and Pub/Sub
│   └── orchestrator/         # AI content generation
├── public/                   # Static assets
└── firebase/                 # Firebase configuration and rules
```

## 📚 Documentation

### For Developers
- **[Technical Architecture Guide](docs/TECHNICAL_ARCHITECTURE.md)**: Comprehensive technical overview
- **[API Documentation](docs/API_DOCUMENTATION.md)**: Complete API reference with examples
- **[Deployment Guide](docs/DEPLOYMENT_GUIDE.md)**: Enterprise deployment instructions
- **[BackOffice Cloud Run Setup](docs/backoffice-cloud-run.md)**: R-based analytics deployment

### For Users & Administrators
- **[User Guide](docs/USER_GUIDE.md)**: Complete user documentation
- **[Setup Instructions](docs/DEPLOYMENT_GUIDE.md)**: White-label configuration guide

### Architecture & Planning
- **[Cloud Reporter Transformation](docs/cloud-reporter-transformation.md)**: Product and architecture blueprint

## 🚀 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite development server with HMR |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint code quality checks |
| `npm run test` | Execute Jest unit tests |
| `npm run type-check` | TypeScript type checking |
| `npm run storybook` | Launch Storybook for design system |
| `npm run build-storybook` | Build static Storybook bundle |

## ☁️ Cloud Services Deployment

### Firebase Services Setup
1. Create Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication, Firestore, and Storage services
3. Configure security rules for Firestore and Storage
4. Deploy frontend to Firebase Hosting

### Cloud Run Microservices

| Service | Path | Port | Purpose |
|---------|------|------|---------|
| **Ingestion API** | `services/ingestion/` | 8082 | File processing and Pub/Sub integration |
| **AI Orchestrator** | `services/orchestrator/` | 8085 | Vertex AI content generation |
| **BackOffice** | External repo | 8000 | R-based analytics and reporting |

Each service includes:
- FastAPI application with comprehensive endpoints
- Dockerfile for containerized deployment
- README with local development and Cloud Run deployment instructions
- Environment configuration and dependency management

### Deployment Process

```bash
# Build and deploy to Firebase Hosting
npm run build
firebase deploy

# Deploy Cloud Run services (from service directories)
cd services/ingestion
gcloud run deploy --source .

cd ../orchestrator  
gcloud run deploy --source .
```

## 🧪 Testing & Quality Assurance

### Automated Testing
- **Unit Tests**: Jest with React Testing Library
- **Integration Tests**: Component interaction testing
- **E2E Tests**: Cypress for user workflow testing
- **Visual Testing**: Storybook for component visual testing

### Code Quality
- **TypeScript**: Static type checking with strict configuration
- **ESLint**: Comprehensive linting with React and TypeScript rules
- **Prettier**: Automatic code formatting
- **Husky**: Git hooks for pre-commit quality gates

### Testing Commands
```bash
npm run test           # Run unit tests
npm run test:coverage  # Generate coverage report
npm run e2e            # Run Cypress E2E tests
npm run lint           # Code quality checks
npm run type-check     # TypeScript validation
```

## 🎯 Enterprise Features Roadmap

### Stage 2 Features (Q1-Q2 2025)
- **AI-Powered Analysis**: Machine learning for assessment insights
- **Advanced Integrations**: Microsoft 365, AWS, Azure native integrations
- **Workflow Automation**: Custom automation workflows and triggers
- **Advanced Analytics**: Predictive analytics and benchmarking
- **Multi-Tenant Architecture**: Enhanced white-label and reseller support

### Stage 3 Features (Q3-Q4 2025)
- **Mobile Applications**: Native iOS and Android applications
- **API Marketplace**: Third-party integrations and extensions
- **Advanced Collaboration**: Real-time collaborative assessments
- **Enterprise SSO**: Advanced identity provider integrations
- **Compliance Frameworks**: Industry-specific compliance templates

## 🤝 Contributing

### Development Guidelines
1. **Fork the repository** and create a feature branch
2. **Follow TypeScript best practices** and maintain type safety
3. **Write comprehensive tests** for new features
4. **Update documentation** for API or feature changes
5. **Follow commit conventions** for clear project history

### Code Standards
- Use TypeScript for all new code
- Follow the existing component architecture patterns
- Maintain design system consistency
- Include unit tests for business logic
- Update Storybook stories for new components

### Pull Request Process
1. Create feature branch: `git checkout -b feature/feature-name`
2. Implement changes with tests and documentation
3. Run quality checks: `npm run lint && npm run test`
4. Submit PR with detailed description and link to relevant documentation

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🆘 Support & Community

### Getting Help
- **Documentation**: Comprehensive guides in the `/docs` directory
- **Issues**: GitHub Issues for bug reports and feature requests
- **Discussions**: GitHub Discussions for community questions

### Enterprise Support
For enterprise deployments and custom development:
- **Email**: support@cloudreporter.com
- **Website**: https://cloudreporter.com
- **Documentation**: https://docs.cloudreporter.com

### Community
- **GitHub Discussions**: Community support and feature discussions
- **Contributing Guidelines**: See CONTRIBUTING.md for development setup
- **Code of Conduct**: Professional and inclusive community standards

---

Built with ❤️ for the MSP community. Let's continue evolving the workspace hub, ingestion pipeline, and AI automation to deliver the full enterprise MSP experience.