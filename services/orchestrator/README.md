# Cloud Reporter AI Orchestrator

FastAPI service that assembles prompts, invokes Vertex AI (or equivalent LLM), and returns AI-generated narratives with grounding metadata.

## Endpoints

- `GET /healthz` – health check
- `POST /generate` – accept template ID, section ID, prompt, and variables. Returns job ID, content, token usage, and reference keys.

## Local Development

```bash
cd services/orchestrator
poetry install
poetry run uvicorn app.main:app --reload --port 8083
```

Visit http://localhost:8083/docs for interactive docs.

## Cloud Run Deployment

```bash
gcloud builds submit --tag gcr.io/$PROJECT_ID/cloud-reporter-orchestrator services/orchestrator
gcloud run deploy cloud-reporter-orchestrator \
  --image gcr.io/$PROJECT_ID/cloud-reporter-orchestrator \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated
```

### Environment Variables
- `VERTEX_PROJECT_ID`
- `VERTEX_MODEL_NAME`
- `VERTEX_LOCATION`
- `VERTEX_AUTH_TYPE` (optional; e.g., application-default)
- `VERTEX_SAFETY_SETTINGS` (optional JSON string)

## TODO
- Integrate with Vertex AI (use `google-cloud-aiplatform`)
- Persist job logs in Firestore
- Stream responses and handle retries
- Authentication / service-to-service security
