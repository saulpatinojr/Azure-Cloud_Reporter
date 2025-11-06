FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY pyproject.toml /app/

# Install minimal build deps for wheels, install poetry and dependencies, then clean up
RUN apt-get update \
	&& apt-get install -y --no-install-recommends build-essential curl ca-certificates \
	&& pip install "poetry>=1.7" \
	&& poetry config virtualenvs.create false \
	&& poetry install --no-dev \
	&& apt-get remove -y build-essential \
	&& apt-get autoremove -y \
	&& rm -rf /var/lib/apt/lists/*

COPY app /app/app

# Create a non-root user to run the app
RUN useradd --create-home --shell /bin/bash appuser && chown -R appuser /app
USER appuser

EXPOSE 8080

# Use shell form so $PORT expands (Cloud Run sets PORT). Fallback to 8080 for local runs.
CMD uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8080}
