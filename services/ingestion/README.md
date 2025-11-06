# Cloud Reporter Ingestion Service

FastAPI service that validates telemetry exports, stores files, and triggers processing pipelines for Cloud Reporter.

## Endpoints

- `GET /healthz` – health check
- `POST /ingest/validate/csv` – validate uploaded CSV/XLSX (structure & size checks)
- `POST /ingest/upload` – store file and enqueue ingestion job (Cloud Storage + Pub/Sub)
- `GET /ingest/jobs` – list recent upload jobs (Firestore history)

## Local development

```bash
cd services/ingestion
poetry install
poetry run uvicorn app.main:app --reload --port 8082
```

Visit http://localhost:8082/docs for Swagger UI.

## Cloud Run deployment

```bash
gcloud builds submit --tag gcr.io/$PROJECT_ID/cloud-reporter-ingestion services/ingestion
gcloud run deploy cloud-reporter-ingestion \
  --image gcr.io/$PROJECT_ID/cloud-reporter-ingestion \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated
```

Set environment variables:
- `PROJECT_ID`
- `FIRESTORE_COLLECTION`
- `STORAGE_BUCKET`
- `PUBSUB_TOPIC`

## TODO / Next steps

- Wire Cloud Storage upload & signed URLs
- Publish Pub/Sub message to trigger data processing
- Ingest job history from Firestore
- Authentication (Service-to-service or Firebase auth)
