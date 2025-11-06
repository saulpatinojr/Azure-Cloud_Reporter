from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import os

app = FastAPI(title="Cloud Reporter AI Orchestrator", version="0.1.0")


class VariablePayload(BaseModel):
    key: str
    value: str


class GenerateRequest(BaseModel):
    template_id: str
    section_id: str
    prompt: str
    variables: List[VariablePayload]


class GenerateResponse(BaseModel):
    job_id: str
    content: str
    tokens_used: int
    grounded_references: List[str]


@app.get('/healthz')
def healthcheck():
    return {'status': 'ok'}


@app.post('/generate', response_model=GenerateResponse)
def generate(request: GenerateRequest):
    # TODO: integrate with Vertex AI
    if not request.prompt:
        raise HTTPException(status_code=400, detail='Prompt required')

    # Mock response for now
    content = request.prompt
    for variable in request.variables:
        content = content.replace(f"{{{{{variable.key}}}}}", variable.value)

    return GenerateResponse(
        job_id='mock-job-123',
        content=f"[AI Draft]\n\n{content}\n\n--\nThis is a mock response.",
        tokens_used=len(content.split()),
        grounded_references=[var.key for var in request.variables],
    )
