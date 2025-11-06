# Cloud Reporter

Cloud Reporter is the MSP assessment workspace for orchestrating telemetry ingestion, AI-driven analysis, and enterprise-grade deliverables. The frontend is built with React, TypeScript, Tailwind, and Firebase Auth; backends run on Firebase / Cloud Run services (BackOffice, ingestion, AI orchestration).

## Highlights

- **Workspace Hub** – new navigation shell, stage-aware overview, and AI-driven focus cards.
- **Design System** – Inter/Spectral typography, reusable cards/buttons/badges, and AppShell layout.
- **Clients module refresh** – portfolio tiles, search, and contextual actions.
- **API scaffolding** – `/services/api` abstraction for forthcoming Cloud Run endpoints.
- **BackOffice service** – R-based analytics moved to dedicated repo (`saulpatinojr/Azure-Cloud_Reporter_BackOffice`), with Cloud Run deployment guide.

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS with CSS variable theme tokens
- Firebase Auth & Firestore
- Cloud Run (BackOffice, ingestion, AI services – in progress)
- Storybook (coming soon) for design system component development

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment** – duplicate `.env.example` → `.env` and populate:
   ```env
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_STORAGE_BUCKET=
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=

   VITE_BACKOFFICE_API_URL=http://localhost:8000
   VITE_API_BASE_URL=http://localhost:8082
   VITE_TEMPLATE_API_URL=http://localhost:8084
   VITE_AI_API_URL=http://localhost:8085
   ```

   | Variable | Where to find it |
   | --- | --- |
   | `VITE_FIREBASE_*` | Firebase Console → Project settings → SDK configuration |
   | `VITE_BACKOFFICE_API_URL` | Cloud Run URL for the BackOffice service (`docs/backoffice-cloud-run.md`) |
   | `VITE_API_BASE_URL` | Cloud Run URL for the ingestion API (`services/ingestion`) |
   | `VITE_TEMPLATE_API_URL` | Cloud Run URL for the template service (falls back to in-app mocks if unset) |
   | `VITE_AI_API_URL` | Cloud Run URL for the AI orchestrator (falls back to mock content if unset) |

3. **Run locally**
   ```bash
   npm run dev
   ```

## Available Scripts

| Command              | Description                                         |
| ------------------- | --------------------------------------------------- |
| `npm run dev`       | Start Vite dev server (with HMR)                     |
| `npm run build`     | Build production bundle                              |
| `npm run preview`   | Preview built app                                    |
| `npm run lint`      | ESLint checks                                        |
| `npm run test`      | Jest + Testing Library component tests              |
| `npm run storybook` | Launch Storybook for design-system components       |
| `npm run build-storybook` | Build static Storybook bundle                 |

### Cloud Run microservices

All supporting services live in `services/`. Each contains a FastAPI app, Dockerfile, and README with local + Cloud Run deployment instructions.

| Service | Path | Default port | Purpose |
| --- | --- | --- | --- |
| Ingestion API | `services/ingestion` | 8082 | Validates uploads, stores files, publishes Pub/Sub jobs |
| Template API (future) | `services/templates` | 8084 | CRUD for template definitions (frontend currently mocks) |
| AI Orchestrator | `services/orchestrator` | 8085 | Calls Vertex AI / GPT for narrative generation |

## Project Structure (key folders)

```
src/
├─ components/layout/      # AppShell, Sidebar, Topbar
├─ contexts/               # Firebase Auth provider
├─ design-system/          # Tokens & reusable UI primitives
├─ pages/                  # App screens (Dashboard, Clients, forms, etc.)
├─ services/
│  ├─ api/                 # Fetch abstraction for Cloud Run endpoints
│  ├─ assessmentService.ts # Firestore access layer (legacy)
│  ├─ clientService.ts     # Firestore access layer
│  ├─ ingestion/           # Ingestion API (FastAPI + Cloud Run)
│  └─ orchestrator/        # AI orchestrator (FastAPI + Cloud Run)
├─ types/                  # Shared Firestore/DTO types
└─ utils/                  # Helper utilities (formatting, cn, etc.)
```

## Cloud Services & Deployment

- **Firebase** – authentication, Firestore, storage (existing CRUD services).
- **BackOffice** – R/Plumber analytics, now deployed via Cloud Run. Refer to `docs/backoffice-cloud-run.md`.
- **Ingestion & AI** – Python/Cloud Run + Vertex AI orchestrator (scaffolding in progress; see `docs/cloud-reporter-transformation.md`).

## Documentation

- `docs/backoffice-cloud-run.md` – BackOffice deployment & GitHub Actions workflow
- `docs/cloud-reporter-transformation.md` – product/UX/architecture blueprint

## Contributing

1. Create feature branch (`git checkout -b feature/<name>`)
2. Run `npm run lint` and ensure tests pass
3. Update docs as needed
4. Submit PR (link to relevant docs/blueprint items)

---

Let’s continue evolving the workspace hub, ingestion pipeline, and AI automation to deliver the full MSP experience.
