# BackOffice Backend (Cloud Run Deployment)

The BackOffice R/plumber backend now lives in its own repository so you can deploy and recover it quickly when needed.

## Repository
- **GitHub**: https://github.com/saulpatinojr/Azure-Cloud_Reporter_BackOffice
- Clone: `git clone https://github.com/saulpatinojr/Azure-Cloud_Reporter_BackOffice.git`

## Local Testing
```bash
cd Azure-Cloud_Reporter_BackOffice
# Optional: adjust env vars in docker-compose.yml if necessary
docker compose up --build backoffice
curl http://localhost:8000/healthz
```

## Build & Deploy to Cloud Run
Replace `$PROJECT_ID` and `$REGION` as appropriate.
```bash
# Authenticate once
gcloud auth login

# Build the container
gcloud builds submit --tag gcr.io/$PROJECT_ID/backoffice .

# Deploy to Cloud Run (public)
gcloud run deploy backoffice \
  --image gcr.io/$PROJECT_ID/backoffice \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated

# Verify
curl https://<CLOUD_RUN_URL>/healthz
```

### Environment Variables
- `PORT`: set automatically by Cloud Run (defaults to 8080 in dev)
- `PKG_ROOT`: path to the bundled VMware reporting code; defaults to `/opt/pkg`
- Add any additional secrets via `gcloud run services update backoffice --set-env-vars KEY=value`

### Health & Endpoints
- `GET /healthz`
- `GET /functions`
- `POST /stats_file` (multipart CSV/XLS/XLSX)
- `POST /overview_file`
- `POST /plot_file` (supports PNG/SVG output)

## Recovery Checklist
1. Clone the repo (or pull latest).
2. Run local smoke test with Docker Compose.
3. `gcloud builds submit` to rebuild the image.
4. `gcloud run deploy` to update production.

## Optional: GitHub Actions Deployment
Automate deploys from the BackOffice repo by adding `.github/workflows/deploy-backoffice.yml` with the following content:

```yaml
name: Deploy BackOffice

on:
  push:
    branches: [main]

jobs:
  build-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: 'read'
      id-token: 'write'

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up gcloud auth
        uses: google-github-actions/auth@v2
        with:
          workload_identity_provider: ${{ secrets.GCP_WORKLOAD_IDENTITY_PROVIDER }}
          service_account: ${{ secrets.GCP_SERVICE_ACCOUNT }}

      - name: Configure gcloud
        run: gcloud config set project ${{ secrets.GCP_PROJECT_ID }}

      - name: Build and push image
        run: |
          gcloud builds submit \
            --tag gcr.io/${{ secrets.GCP_PROJECT_ID }}/backoffice .

      - name: Deploy to Cloud Run
        run: |
          gcloud run deploy backoffice \
            --image gcr.io/${{ secrets.GCP_PROJECT_ID }}/backoffice \
            --platform managed \
            --region ${{ secrets.GCP_REGION }} \
            --allow-unauthenticated
```

Set the required secrets in the GitHub repository settings:
- `GCP_PROJECT_ID`
- `GCP_REGION`
- `GCP_SERVICE_ACCOUNT` (email of a service account with Cloud Run + Cloud Build roles)
- `GCP_WORKLOAD_IDENTITY_PROVIDER` (if using Workload Identity Federation). Otherwise store a service-account JSON key and use `google-github-actions/auth` with `credentials_json`.
