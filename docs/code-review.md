# Cloud Reporter — Code Review

**Date:** 2025-11-06

**Summary**
- **Scope**: quick but focused review of the frontend TypeScript app and backend Python services in `services/` (ingestion, orchestrator), Dockerfiles, and repository metadata (`package.json`, `pyproject.toml`).
- **Goal**: surface correctness, security, reliability, and maintainability issues and provide concrete, minimal fixes and recommendations.

**Files Reviewed**
- `package.json`
- `tsconfig.*` and core `src/` files (`src/App.tsx`, `src/contexts/AuthContext.tsx`, `src/lib/firebase.ts`)
- `services/ingestion/app/main.py`, `services/ingestion/app/pubsub.py`
- `services/ingestion/Dockerfile`, `services/orchestrator/Dockerfile` and `pyproject.toml` files
- `README.md`, `docs/*` (to check expected runtime ports and env vars)

**High-Level Findings**
- **Port / runtime mismatch**: README and docs mention ingestion default port `8082`, but the service Dockerfiles run `uvicorn` on `8080`. Cloud Run expects containers to listen on `$PORT`; the Dockerfiles do not account for this.
- **Environment variable guarding**: `src/lib/firebase.ts` calls `initializeApp` with `import.meta.env` values without validating presence; missing env values will cause runtime errors while initializing Firebase in the browser.
- **In-memory file handling**: `services/ingestion/app/main.py` reads entire upload into memory via `await file.read()` and `io.BytesIO(contents)`. Large uploads may OOM; consider streaming or file-size limits prior to reading.
- **Fire-and-forget Pub/Sub publish**: `publish_job` calls `publisher.publish(...)` but does not check the returned future nor handle publish errors.
- **Missing/weak Docker security & runtime best-practices**: both Python Dockerfiles install poetry and dependencies as root and do not set a non-root user, do not honor `$PORT`, and do not declare a healthcheck or explicit `EXPOSE`.
- **Poetry + slim image caveats**: `poetry install` on `python:3.11-slim` may fail for packages that need build tools; consider installing build deps or using pre-built wheels or a builder stage.
- **Dependency / devDependency mismatch**: `package.json` lists `typescript-eslint` (nonstandard package name) rather than the common `@typescript-eslint/*` plugins; linting setup may be broken or incomplete.
- **Missing runtime env docs for services**: there is no `services/ingestion/.env.example` describing `PROJECT_ID`, `PUBSUB_TOPIC`, `STORAGE_BUCKET`, `FIRESTORE_COLLECTION` — add for local development.
- **Minor style/consistency**: some TODOs remain in `services/orchestrator/app/main.py` and service READMEs; consider tracking via project board.

**Security & Privacy**
- **Secrets in env**: the repo correctly uses Vite `VITE_FIREBASE_*` env vars (not committed). Ensure `.env` is in `.gitignore` and never commit secrets.
- **Least privilege in containers**: run app as a non-root user in Docker images to reduce risk.
- **Audit dependencies**: run `npm audit` / `pip-audit` (or dependabot) and pin production-critical packages; cloud SDK libraries are large surface area.

**Detailed, Actionable Recommendations**

1) Fix container runtime port and non-root user
- **What**: ensure container listens on `$PORT` and runs as non-root. Use `uvicorn` with the port set from env (in the entrypoint shell) or set `CMD` to read `$PORT`. Create a low-privilege user in the Dockerfile.
- **Suggested Dockerfile snippet**:

```dockerfile
FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY pyproject.toml /app/

RUN apt-get update \
  && apt-get install -y --no-install-recommends build-essential curl ca-certificates \
  && pip install "poetry>=1.7" \
  && poetry config virtualenvs.create false \
  && poetry install --no-dev \
  && apt-get remove -y build-essential \
  && apt-get autoremove -y \
  && rm -rf /var/lib/apt/lists/*

COPY app /app/app

# Create non-root user
RUN useradd --create-home --shell /bin/bash appuser && chown -R appuser /app
USER appuser

EXPOSE 8080

# Use shell form so $PORT expands (Cloud Run will set PORT)
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}
```

Notes: Cloud Run sets `PORT`; `${PORT:-8080}` falls back to 8080 locally. The shell form is required so the variable expands.

2) Guard Firebase initialization in `src/lib/firebase.ts`
- **What**: verify required Vite env vars exist before calling `initializeApp`. Present a clear error message or fallback (local emulator) to avoid cryptic runtime errors.
- **Suggested pattern** (TS snippet):

```ts
const required = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
];

for (const k of required) {
  if (!import.meta.env[k]) {
    console.warn(`Missing ${k} — Firebase will not initialize.`);
  }
}

// Optionally: only call initializeApp if essential keys are present
```

3) Avoid reading entire uploaded files into memory
- **What**: for the ingestion service, avoid `await file.read()` for unbounded uploads. Use streaming writes to Cloud Storage or enforce strict maximum file sizes before reading.
- **Quick fix**: check `file.spool_max_size` (if using Starlette UploadFile internals) or set a maximum allowed content length in the API gateway / reverse proxy and/or check `await file.read(1)` first to confirm not empty, then stream.

4) Handle Pub/Sub publish results and errors
- **What**: call `future = publisher.publish()` and attach callbacks or call `future.result(timeout=...)` in contexts where you need delivery guarantees. Catch exceptions and log them.
- **Python snippet**:

```py
future = publisher.publish(topic_path, message)
try:
    future.result(timeout=10)
except Exception as exc:
    # log or retry
    print('Pub/Sub publish failed', exc)
```

5) Improve logging and observability
- **What**: add structured logging (json/logging module) in Python services and include correlation/job IDs in logs. Surface SDK diagnostic strings where helpful.

6) Linting / devDependency fixes
- **What**: in `package.json` replace `typescript-eslint` with the canonical packages and ensure ESLint config uses `@typescript-eslint/parser` and plugin. Example devDeps:

```json
"devDependencies": {
  "@typescript-eslint/parser": "^7.0.0",
  "@typescript-eslint/eslint-plugin": "^7.0.0",
  ...
}
```

7) Add per-service `.env.example` and run instructions
- **What**: add `services/ingestion/.env.example` documenting `PROJECT_ID`, `PUBSUB_TOPIC`, `STORAGE_BUCKET`, `FIRESTORE_COLLECTION`, and local run steps (how to set GOOGLE_APPLICATION_CREDENTIALS or use emulator).

8) Tests + CI
- **What**: add simple FastAPI tests for `healthz` and upload validation (httpx + pytest). Add a CI job that runs `npm run lint` and `pytest`.

**File-specific Notes**
- `src/lib/firebase.ts`: initialize without guard — risk of runtime failure; add validation and helpful message.
- `src/contexts/AuthContext.tsx`: implementation looks solid; consider adding retry/backoff for popup sign-in in unreliable networks.
- `src/App.tsx`: ProtectedRoute returns a spinner while loading — good UX; ensure `loading` cannot be stuck true if `onAuthStateChanged` fails (add error handling).
- `services/ingestion/app/main.py`:
  - `validate_csv` reads the whole file; memory risk for large files.
  - `submit_upload` uploads to storage if bucket is set — good conditional behavior.
  - `list_jobs` constructs Firestore client per request — acceptable for Cloud Run short-lived containers but consider reusing client or caching for performance.
- `services/ingestion/app/pubsub.py`:
  - `publish_job` should wait for the publish future or handle errors.
  - Settings default values are fine but consider making `storage_bucket` required when storage is expected.

**Docs & Onboarding**
- Add `services/*/.env.example` files and short `README` instructions for local emulation (Firestore emulator or `GOOGLE_APPLICATION_CREDENTIALS`), how to start services using `make run` or `docker compose` for local dev.
- Align README ports and the Dockerfiles (choose either `8080` or `8082`) and document the runtime `$PORT` usage for Cloud Run.

**Low-risk / cosmetic suggestions**
- Replace prints with structured `logging` in Python.
- Add type annotations and return types for functions in `pubsub.py`.
- Add `EXPOSE` lines in Dockerfiles for developer clarity (does not affect Cloud Run but is helpful).

**Conclusion**
This repository is well-structured and shows a clear separation between frontend, design system, and small Python microservices. The issues found are mostly operational and easy to remediate: port/runtime mismatches, a few hardened runtime checks (Firebase env guard), streaming uploads, and improving Dockerfile security. Addressing these will make local development, CI, and Cloud Run deployment more robust and secure.

If you want, I can create concrete patches for any of the above items (Dockerfile, `src/lib/firebase.ts` guards, improved `publish_job` handling, `.env.example` for services). Which one should I implement first?
