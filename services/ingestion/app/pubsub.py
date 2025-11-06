from google.cloud import pubsub_v1
from google.cloud import firestore
from google.cloud import storage
from fastapi import Depends
from functools import lru_cache
import os
import json
import datetime as dt


class Settings:
    project_id: str
    pubsub_topic: str
    storage_bucket: str
    firestore_collection: str

    def __init__(self):
        self.project_id = os.environ.get("PROJECT_ID", "local-project")
        self.pubsub_topic = os.environ.get("PUBSUB_TOPIC", "ingestion-jobs")
        self.storage_bucket = os.environ.get("STORAGE_BUCKET", "")
        self.firestore_collection = os.environ.get("FIRESTORE_COLLECTION", "ingestion_jobs")


@lru_cache()
def get_settings() -> Settings:
    return Settings()


def publish_job(job_id: str, filename: str, settings: Settings = Depends(get_settings)) -> None:
    publisher = pubsub_v1.PublisherClient()
    topic_path = publisher.topic_path(settings.project_id, settings.pubsub_topic)
    message = json.dumps({
        "job_id": job_id,
        "filename": filename,
        "submitted_at": dt.datetime.utcnow().isoformat() + "Z",
    }).encode("utf-8")
    publisher.publish(topic_path, message)


def record_job(job_id: str, filename: str, settings: Settings = Depends(get_settings)) -> None:
    db = firestore.Client(project=settings.project_id)
    doc_ref = db.collection(settings.firestore_collection).document(job_id)
    doc_ref.set({
        "filename": filename,
        "status": "queued",
        "submitted_at": dt.datetime.utcnow(),
    })


def upload_to_storage(file_obj, filename: str, settings: Settings = Depends(get_settings)) -> str:
    client = storage.Client(project=settings.project_id)
    bucket = client.bucket(settings.storage_bucket)
    blob = bucket.blob(filename)
    file_obj.seek(0)
    blob.upload_from_file(file_obj)
    return blob.public_url
