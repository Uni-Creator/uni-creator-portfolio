# Deployment

```
Browser -> HTTPS (Nginx :443) -> uvicorn 127.0.0.1:8000 -> /ws/terminal -> TerminalCore
SSH     -> TCP :2222 ------------------------------------> AsyncSSH     -> TerminalCore
```

SSH is never proxied through HTTP and never touches the server's normal sshd on :22.

## Topology

Your site already uses `@vercel/analytics`, so it is probably hosted on Vercel. Vercel cannot run Python or open
port 2222, so run the terminal backend on a small VPS under a sub-domain:

* `https://yourdomain.com`          -> existing site (Vercel)
* `https://terminal.yourdomain.com` -> Nginx -> FastAPI (this repo's `deploy/nginx/terminal.conf`)
* `ssh -p 2222 portfolio@terminal.yourdomain.com` -> AsyncSSH on the VPS (DNS-only, not proxied by a CDN)

Frontend env (Vercel project settings):
`VITE_TERMINAL_WS_URL=wss://terminal.yourdomain.com/ws/terminal`, `VITE_SSH_HOST=terminal.yourdomain.com`, `VITE_SSH_PORT=2222`.
Backend env: `ALLOWED_ORIGINS=https://yourdomain.com`, `TRUST_PROXY=true`.

For `curl https://yourdomain.com/terminal/about` on the main domain, add the rewrites in `INTEGRATION.md`.
To host everything on one VPS instead, see the comment at the bottom of `nginx/terminal.conf`.

## 1. System account (no login shell)

```bash
sudo useradd --system --home-dir /opt/portfolio-terminal --shell /usr/sbin/nologin portfolio
sudo mkdir -p /opt/portfolio-terminal && sudo chown portfolio:portfolio /opt/portfolio-terminal
```

## 2. Install the app

```bash
sudo rsync -a terminal-server/ /opt/portfolio-terminal/terminal-server/
sudo -u portfolio python3 -m venv /opt/portfolio-terminal/venv
sudo -u portfolio /opt/portfolio-terminal/venv/bin/pip install -r /opt/portfolio-terminal/terminal-server/requirements.txt
sudo install -o portfolio -g portfolio -m 600 terminal-server/.env.example /opt/portfolio-terminal/.env
sudo -u portfolio nano /opt/portfolio-terminal/.env        # set ALLOWED_ORIGINS, TRUST_PROXY, SMTP_* or CONTACT_WEBHOOK_URL
```

## 3. systemd

```bash
sudo cp deploy/systemd/portfolio-*.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now portfolio-terminal portfolio-ssh
journalctl -u portfolio-terminal -u portfolio-ssh -f        # JSON audit logs
```

The SSH host key is generated on first start at `SSH_HOST_KEY` (mode 600). Back it up: if it changes, clients see a
host-key warning.

## 4. Nginx + TLS

```bash
sudo cp deploy/nginx/terminal.conf /etc/nginx/conf.d/terminal.conf    # edit server_name first
sudo certbot --nginx -d terminal.yourdomain.com
sudo nginx -t && sudo systemctl reload nginx
```

## 5. Firewall

```bash
sudo ufw allow 2222/tcp        # portfolio SSH
sudo ufw allow 80,443/tcp
# keep your normal admin sshd on 22 (ideally key-only), untouched by this project
```

## Docker alternative

```bash
cp terminal-server/.env.example terminal-server/.env
docker compose -f docker/docker-compose.yml up -d --build
```

`web` binds to 127.0.0.1:8000 (put Nginx in front); `ssh` publishes 2222 and keeps its host key in a volume.

## Smoke test after deploy

```bash
curl https://terminal.yourdomain.com/terminal/about
ssh -p 2222 portfolio@terminal.yourdomain.com projects
ssh -p 2222 portfolio@terminal.yourdomain.com "id"       # -> Unknown portfolio command.
ssh -p 2222 -L 9999:localhost:22 portfolio@terminal.yourdomain.com   # forwarding refused
```
