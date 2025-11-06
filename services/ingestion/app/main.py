from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi import Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import uuid
from .pubsub import publish_job, record_job, upload_to_storage, get_settings, Settings
from google.cloud import firestore
from datetime import datetime
import io

app = FastAPI(title="Cloud Reporter Ingestion API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ValidationResponse(BaseModel):
    status: str
    message: str | None = None
    suggested_template: str | None = None


class UploadResponse(BaseModel):
    job_id: str
    status: str


class UploadJob(BaseModel):
    job_id: str
    filename: str
    status: str
    submitted_at: str


@app.get("/healthz", tags=["health"])
async def healthcheck():
    return {"status": "ok"}


@app.post("/ingest/validate/csv", response_model=ValidationResponse)
async def validate_csv(file: UploadFile = File(...)):
    filename = file.filename or ""
    if not filename.lower().endswith((".csv", ".xlsx")):
        raise HTTPException(status_code=400, detail="Unsupported file type. Upload CSV or XLSX.")

    contents = await file.read()
    if len(contents) == 0:
        raise HTTPException(status_code=400, detail="File is empty.")

    message = "Ready for ingestion"
    if len(contents) > 15 * 1024 * 1024:
        message = "Large file detected. Processing may take longer."

    return ValidationResponse(
        status="valid",
        message=message,
        suggested_template="RVTools" if filename.lower().endswith(".xlsx") else "Generic CSV",
    )


@app.post("/ingest/upload", response_model=UploadResponse)
async def submit_upload(file: UploadFile = File(...), settings: Settings = Depends(get_settings)):
    job_id = str(uuid.uuid4())
    contents = await file.read()
    file_buffer = io.BytesIO(contents)
    filename = file.filename or f"upload-{job_id}.csv"

    if settings.storage_bucket:
        upload_to_storage(file_buffer, filename, settings)

    record_job(job_id, filename, settings)
    publish_job(job_id, filename, settings)

    return UploadResponse(job_id=job_id, status="queued")


@app.get("/ingest/jobs", response_model=List[UploadJob])
async def list_jobs(settings: Settings = Depends(get_settings)):
    if not settings.firestore_collection:
      return []

    db = firestore.Client(project=settings.project_id)
    docs = (
        db.collection(settings.firestore_collection)
        .order_by('submitted_at', direction=firestore.Query.DESCENDING)
        .limit(50)
        .stream()
    )

    jobs: List[UploadJob] = []
    for doc in docs:
        data = doc.to_dict()
        submitted_at = data.get('submitted_at')
        iso_submitted = submitted_at.isoformat() + 'Z' if hasattr(submitted_at, 'isoformat') else datetime.utcnow().isoformat() + 'Z'
        jobs.append(
            UploadJob(
                job_id=doc.id,
                filename=data.get('filename', 'unknown'),
                status=data.get('status', 'queued'),
                submitted_at=iso_submitted,
            )
        )
    return jobs
