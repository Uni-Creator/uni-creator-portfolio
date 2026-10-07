# Build from the repo root:  docker build -f docker/Dockerfile -t portfolio-terminal .
FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 PIP_NO_CACHE_DIR=1

# Dedicated unprivileged account with no login shell
RUN useradd --system --create-home --home-dir /opt/portfolio-terminal \
            --shell /usr/sbin/nologin portfolio

WORKDIR /opt/portfolio-terminal/terminal-server
COPY terminal-server/requirements.txt .
RUN pip install -r requirements.txt

COPY terminal-server/app ./app
RUN mkdir -p /opt/portfolio-terminal/keys && chown -R portfolio:portfolio /opt/portfolio-terminal

USER portfolio
ENV SSH_HOST_KEY=/opt/portfolio-terminal/keys/host_key \
    TERMINAL_HOST=0.0.0.0

EXPOSE 8000 2222
VOLUME ["/opt/portfolio-terminal/keys"]

# Default: web + WebSocket. Override for SSH:  docker run ... python -m app.transports.ssh
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers", "--no-server-header"]
