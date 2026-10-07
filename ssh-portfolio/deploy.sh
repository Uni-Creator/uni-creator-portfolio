#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/portfolio-ssh"

sudo useradd \
  --system \
  --home "$APP_DIR" \
  --shell /usr/sbin/nologin \
  portfolio 2>/dev/null || true

sudo mkdir -p "$APP_DIR"
sudo cp -r ssh_terminal requirements.txt README.md "$APP_DIR/"

sudo python3 -m venv "$APP_DIR/.venv"
sudo "$APP_DIR/.venv/bin/pip" install --upgrade pip
sudo "$APP_DIR/.venv/bin/pip" install -r "$APP_DIR/requirements.txt"

sudo chown -R portfolio:portfolio "$APP_DIR"

echo "Create /etc/portfolio-ssh.env with:"
echo "SSH_HOST=0.0.0.0"
echo "SSH_PORT=2222"
echo "SSH_HOST_KEY=$APP_DIR/host_key"
echo "CONTACT_WEBHOOK_URL=https://unicreator.dpdns.org/api/contact"

sudo cp systemd/portfolio-ssh.service /etc/systemd/system/portfolio-ssh.service
sudo systemctl daemon-reload
sudo systemctl enable --now portfolio-ssh.service

sudo systemctl status portfolio-ssh.service --no-pager
