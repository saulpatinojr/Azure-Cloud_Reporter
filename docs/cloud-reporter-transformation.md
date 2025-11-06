# Cloud Reporter Transformation Blueprint

Prepared for the MSP enterprise rollout of **Cloud Reporter**.

---

## 1. Pulse Check — Where We Are Today

### Product & UX Snapshot
- **Home**: static marketing hero and Google sign-in; lacks enterprise credibility, social proof, or tailored onboarding.
- **Dashboard**: basic Firestore lists and stat cards; no context, trend analysis, or task automation for assessment teams.
- **Workflow gaps**: upload, data validation, AI generation, and report delivery flows are largely unimplemented or hidden behind manual steps.
- **Visual baseline**: inconsistent design language; reads as a starter template rather than a $2M enterprise app.

### Technical Snapshot
- **Frontend**: React + Vite + Firebase Auth; service layer is thin wrappers around Firestore collections.
- **Data**: no structured ingestion pipeline; CSV/XLSX parsing and PDF/PPT handling unimplemented.
- **AI**: no unified prompt orchestration, grounding, or template system even though types hint at the future architecture.
- **Backends**: BackOffice (R) is now its own Cloud Run service. The main app lacks a dedicated API for heavy processing.

**Conclusion**: we have a minimal CRUD shell. To justify MSP-level spend we need a cohesive platform: guided workflows, robust data ingestion, template automation, AI-driven insights, and polished enterprise UX.

---

## 2. End-State Vision

### Value Proposition
> *Cloud Reporter is the operating system for MSP cloud assessments: ingest client telemetry, unify evidence, generate templated deliverables, and surface action-ready insights — all underpinned by auditable AI workflows.*

### Core Pillars
1. **Guided Assessment Workspaces** – structured, multi-stage journeys (Plan → Collect → Analyze → Deliver) with collaborative checkpoints.
2. **Smart Ingestion & Grounding** – automated processing of CSV/XLSX/PDF exports, metadata tagging, validation, and semantic grounding store.
3. **Template & Content Engine** – visual template builder, AI-assisted narrative drafts, cross-client reuse, versioning.
4. **Insight & Benchmarking** – dashboards with trends, risk heatmaps, cost optimization, Azure/VMware best-practice alignment.
5. **Enterprise Experience** – branded, responsive UI with accessibility, role-based access, audit trails, and compliance-ready exports.

---

## 3. Personas & Journeys

| Persona | Goals | Pain Today | Desired Experience |
| --- | --- | --- | --- |
| **Assessment Lead (MSP)** | Coordinate assessments, deliver reports, maintain quality | Manual evidence wrangling, inconsistent templates | Guided workspaces, live status, automated narratives & visuals |
| **Cloud Engineer** | Upload telemetry, validate findings | Juggling CSVs/PDFs, unclear next steps | Drag-drop ingestion, instant validation, AI-powered anomaly detection |
| **MSP Executive** | Track portfolio health, trust AI outputs | No visibility, compliance concerns | Portfolio dashboards, audit logs, governance controls |
| **Client Stakeholder** | Consume deliverables | Static PDFs lacking interactivity | Secure client portal with interactive report & action items |

---

## 4. Product Strategy & Roadmap

### Phase 0 – Foundation (Weeks 1–2)
- Establish **design system** (tokens, typography, components).
- Implement **global shell** (sidebar navigation, top bar, notification center).
- Set up **storybook** & component QA.

### Phase 1 – Guided Workspaces (Weeks 3–6)
- Replace current dashboard with **workspace hub** (cards for each assessment showing stage, blockers, owners).
- Build **Assessment Overview** page with staging (Plan/Collect/Analyze/Deliver) and timeline.
- Implement **Task Engine** (FireStore or Firestore + Cloud Functions) to track required files, review steps, approvals.

### Phase 2 – Ingestion Pipeline (Weeks 5–9)
- **Upload Center**: drag-drop with progress, validations, history.
- **File Processing Service** (Cloud Run): convert CSV/XLSX/PDF/PPT → normalized JSON + metadata (use Python + pandas + pdfplumber/pyMuPDF + mammoth for PPT when possible).
- **Grounded Store**: store structured outputs in Firestore/BigQuery; index paragraphs/sheets in Vertex AI Search / Pinecone for AI grounding.

### Phase 3 – Template & AI Engine (Weeks 7–12)
- **Template Builder**: visual editor for sections, charts, narrative placeholders (React-based, JSON schema stored in Firestore).
- **Prompt Orchestrator** (Cloud Functions or Run): compose prompts using template, grounded data, and prompt bank; orchestrate Vertex AI/GPT calls; manage retries, logging, and human-in-the-loop approvals.
- **AI Output Viewer**: diff view (AI draft vs previous version), inline feedback, regenerate with context.

### Phase 4 – Insight Layer & Client Portal (Weeks 10–14)
- **Portfolio dashboards**: cost/risk/compliance charts, trend insights.
- **Client share features**: read-only secure portal; schedule PDF/PowerPoint export (use Cloud Run Jobs + pptxgenJS/docx).
- **Audit & Governance**: approval logs, evidence linking, locking final reports.

### Phase 5 – Polish & Enterprise Readiness (Weeks 12–16)
- Accessibility, localization, SLA dashboards, billing hooks.
- Integrations (Azure Cost Management API, VMware vCenter, ServiceNow ticketing).

---

## 5. Target Architecture

```
┌────────────────────────────────────────────────────────────┐
│                       Client (React)                        │
│  - Design system + layout shell                             │
│  - Workspace views, upload center, template builder         │
│  - Auth via Firebase / MS Entra                             │
└──────────────┬──────────────┬────────────────────────────────┘
               │              │
      ┌────────▼───────┐      │
      │ Firebase Auth  │      │
      └────────┬───────┘      │
               │              │
┌──────────────▼──────────────────────────────────────────────────────┐
│ Firebase Firestore / Storage                                        │
│  - Assessments, tasks, templates, prompts, audit logs                │
│  - File blobs (raw uploads, generated outputs)                       │
└──────────────┬──────────────────────┬──────────────────────────────┘
               │                      │
     ┌─────────▼─────────┐   ┌────────▼──────────┐
     │ Cloud Run: Ingest │   │ Cloud Run: BackOffice│
     │  - Python FastAPI │   │  - R plumber (metrics)│
     │  - CSV/XLSX/PDF→JSON │ │  - Graph analytics     │
     │  - Calls Vertex AI Search│└────────┬──────────┘
     └─────────┬─────────┘             │
               │                       │
      ┌────────▼────────┐      ┌───────▼────────┐
      │ Cloud Run: AI   │      │ Vertex AI / GPT│
      │ Orchestrator    │      │  - Text, tabular│
      │  - Prompt merge │      │  - Embeddings   │
      │  - Task queue   │      └────────────────┘
      └────────┬────────┘
               │
      ┌────────▼────────┐
      │ Pub/Sub / Cloud │
      │ Tasks           │
      │  - Long running │
      │    processing   │
      └─────────────────┘
```

### AI/Data Flow (CSV Example)
1. User uploads RVTools `.xlsx` via Upload Center.
2. File stored in Cloud Storage → triggers Ingest service (Cloud Run) via Pub/Sub.
3. Ingest parses workbook → standardized JSON → stores in Firestore & BigQuery (for analytics) + indexes key tables in Vertex AI Search.
4. Template Engine pulls required data slices + prompt bank → AI Orchestrator calls Vertex AI with context.
5. Draft sections returned → stored with trace (prompt, model version, grounded references) → user reviews and approves.
6. Final report generated (DOCX/PPT/interactive portal) using templating engine with locked data.

---

## 6. UI/UX Revamp Blueprint

### Design System
- **Brand**: “Trustworthy enterprise” – indigo/navy base, electric cyan accents, warm neutral backgrounds.
- **Typography**: Inter (UI), Spectral (headings/report narratives).
- **Components**: boxed cards, glassmorphism for highlight panels, consistent spacing (8px grid).
- **Iconography**: Lucide for system icons; custom line illustrations for empty states.

### Key Screens (High-Level Layout)
1. **New Landing (Pre-auth)**
   - Hero with MSP-focused messaging, value stats, logos, CTA to tailored onboarding.
   - Process infographic (Assess → Analyze → Deliver).
   - Testimonials/case studies.
2. **Workspace Hub (Dashboard)**
   - Left nav (Workspaces, Library, Insights, Admin).
   - Main area: Kanban and timeline toggle for assessments; quick filters, SLA badges.
   - Right rail: Notifications, upcoming deadlines.
3. **Assessment Workspace**
   - Header: Client info, stage progress, team, quick actions.
   - Tabs: Overview, Files, Analysis, Deliverables, Activity.
   - Files tab: upload slots, status (uploaded/validated/failed), validation messages, automate re-runs.
   - Analysis tab: AI stories, chart previews, regenerate with context.
4. **Template Library & Builder**
   - Gallery of templates (tiles with categories, tags, usage stats).
   - Builder: left panel outline, center canvas with drag-drop components, right attributes panel.
   - Live data preview using mock data or previous assessments.
5. **Insight Portal (Exec View)**
   - KPI tiles (Pipeline value, average readiness, risk distribution).
   - Trend charts (line/area), quadrant risk matrix, cost optimization opportunities.

### Interaction Highlights
- **“Assessment Playbook” wizard**: guided setup with required files, due dates, team assignment.
- **“Grounding Inspector”**: click any AI-generated paragraph to see the supporting evidence (table rows, document snippet, screenshot), ensuring trust.
- **Notifications & Audit Trail**: timeline of actions with filters (uploads, approvals, AI runs), exportable.
- **Client Portal**: share trimmed view with interactive charts, tasks, comment threads.

---

## 7. Implementation Roadmap (People & Process)

| Week | Focus | Key Deliverables | Team Involved |
| --- | --- | --- | --- |
| 1 | Design system & shell | Token palette, global layout, Storybook setup | Product designer, FE lead |
| 2 | Auth & onboarding revamp | Landing page, onboarding wizard | FE, UX |
| 3-4 | Workspace hub + tasks | Dashboard redesign, task engine (Firestore rules) | FE, Firebase dev |
| 4-5 | Upload center & ingestion MVP | Drag-drop UI, Cloud Run ingest service (CSV/XLSX), Vertex AI Search indexing | FE, Python BE, GCP |
| 5-6 | Template builder foundation | Template schema, builder UI, versioning model | FE architect, Product |
| 6-8 | AI orchestrator | Prompt assembly service, Vertex AI integration, grounding inspector | BE/ML engineer |
| 8-10 | Insights dashboards | BigQuery pipeline, Chart library integration | Data engineer, FE |
| 10-12 | Client portal + exports | Secure client views, docx/ppt generation | FE, BE |
| 12+ | Governance & polish | Audit log UI, accessibility, localization, performance | Full team |

**Team Roles Needed**
- Product Designer, UX Researcher
- FE Lead, FE engineers (React/TypeScript)
- Backend/GCP engineer (Cloud Run, Firestore)
- Data/ML engineer (Vertex AI, embeddings)
- DevOps (CI/CD, IaC)
- QA automation

---

## 8. Immediate Action Items

1. **Kick-off design system**: create `/src/design-system` folder, set up Tailwind theme tokens, start Storybook.
2. **Information architecture**: map all pages/routes with sitemap, update router to new structure.
3. **Service scaffolding**: establish `services/api` abstraction for future Cloud Run endpoints, keeping Firestore direct calls temporary.
4. **Ingestion service repo** ✅ `services/ingestion` now hosts a FastAPI service with validation, file storage, Pub/Sub, and Firestore hooks. Cloud Run deployment instructions captured in `services/ingestion/README.md`.
5. **Upload center** ✅ React Upload Center connects to the ingestion API via `VITE_API_BASE_URL`.
6. **Template schema & builder** ✅ Template types defined (`Template`, `TemplateSection`, `TemplateVariable`), library UI at `/templates`, and section editor with prompt/variable editing plus AI preview.
7. **AI orchestrator spike** ✅ `services/orchestrator` FastAPI service exposes `/generate` with mock Vertex AI output, ready for Cloud Run. Frontend uses `VITE_AI_API_URL` and falls back to mock content if unset.

Document each sprint outcome, and keep `docs/cloud-reporter-transformation.md` updated as the master plan.

---

## 9. Success Metrics

- **Adoption**: number of assessments completed per month, client portals shared.
- **Operational efficiency**: time from data upload to draft report (target < 2 hours with AI assist).
- **Quality**: user satisfaction (NPS > 60), AI output acceptance rate > 80%.
- **Enterprise readiness**: SOC2 audit evidence generated, uptime SLA > 99.5%.

---

## 10. Next Steps for This Repo

- Implement design system scaffolding and new layout shell. ✅
- Build the workspace hub UI (even with mocked data) to demonstrate the new direction. ✅
- Spin up `/services/api` abstraction and begin separating Firestore from UI components. ✅
- Add `docs/` updates per sprint to maintain alignment with MSP stakeholders. ✅
- Configure environment variables for new services:
  - `VITE_API_BASE_URL` → ingestion Cloud Run URL (`services/ingestion`)
  - `VITE_TEMPLATE_API_URL` → template service Cloud Run URL (optional; falls back to mocks)
  - `VITE_AI_API_URL` → AI orchestrator Cloud Run URL (optional; falls back to mocks)
  - `PROJECT_ID`, `STORAGE_BUCKET`, `PUBSUB_TOPIC`, `FIRESTORE_COLLECTION` for ingestion service
  - `VERTEX_PROJECT_ID`, `VERTEX_MODEL_NAME`, `VERTEX_LOCATION` for AI orchestrator

Let’s treat this blueprint as the north star — iterate quickly, show tangible UI/UX changes each sprint, and back them with the ingestion + AI engine so Cloud Reporter commands enterprise confidence.
