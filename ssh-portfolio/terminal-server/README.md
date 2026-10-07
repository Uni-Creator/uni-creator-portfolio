# Portfolio terminal server

One transport-independent terminal core, three thin adapters:

```
 portfolio.json  ->  TerminalCore (parser, registry, state, contact flow, renderer)
                         |-- WebSocket adapter  (FastAPI  /ws/terminal)   -> React /terminal page
                         |-- SSH adapter        (AsyncSSH :2222)          -> ssh -p 2222 portfolio@host
                         `-- HTTP adapter       (GET /terminal/<cmd>)     -> curl
```

There is **no OS shell** anywhere: no `subprocess`, `os.system`, `shell=True`, no filesystem access from commands.
`tests/test_security.py` fails the build if any of those strings appear in `app/`.

## Layout

| Path | Purpose |
|---|---|
| `app/terminal/` | core, parser, state, renderer, commands, contact flow (no transport code) |
| `app/transports/websocket.py`, `ssh.py` | adapters; `ssh.py` also contains the SSH line editor |
| `app/api/` | `POST /api/contact` + delivery (webhook / SMTP), `GET /api/portfolio`, curl routes |
| `app/security/` | rate limiter, validation + spam heuristics, JSON audit log |
| `app/data/portfolio.json` | generated from `src/constants/*.ts` (see below) |
| `scripts/export_portfolio_data.ts` | exports the site's TypeScript constants to that JSON |

## Run locally

```bash
cd terminal-server
python3 -m venv venv && . venv/bin/activate
pip install -r requirements-dev.txt
cp .env.example .env            # for local use set CONTACT_DRY_RUN=true, ALLOWED_ORIGINS= (empty), TRUST_PROXY=false

# web + websocket + contact API + curl endpoints
uvicorn app.main:app --reload --port 8000

# SSH (second terminal). Default host key path needs a writable dir for local use:
SSH_HOST_KEY=./host_key SSH_HOST=127.0.0.1 python -m app.transports.ssh
```

Refresh the data from the website's constants (run from the **repo root**; also needed for the `skills` command):

```bash
npm i -D tsx
npx tsx terminal-server/scripts/export_portfolio_data.ts
```

## Try each transport

```bash
ssh -p 2222 -o StrictHostKeyChecking=no portfolio@localhost        # interactive
ssh -p 2222 portfolio@localhost projects                           # one-shot, read-only
ssh -p 2222 portfolio@localhost "rm -rf /"                         # -> Unknown portfolio command.
curl localhost:8000/terminal/projects
curl localhost:8000/terminal/project/NeuralDrive
curl -X POST localhost:8000/api/contact -H 'content-type: application/json' \
     -d '{"name":"Ada","email":"ada@example.com","message":"Hello"}'
```

Browser: start Vite (`npm run dev`, with the proxy from `INTEGRATION.md`) and open <http://localhost:5173/terminal>.
Contact flow: type `contact`, answer the prompts, confirm with `y` (`cancel` aborts at any step).

## Tests

```bash
pytest -q                     # 150+ tests: parser, commands, security, contact, WebSocket, SSH
python tests/load_check.py    # 50 WebSocket + 20 SSH sessions at once
```

## WebSocket protocol

| client -> server | server -> client |
|---|---|
| `{"type":"ready"}` | `{"type":"ready","session_id"}` then banner `output` + `prompt` |
| `{"type":"input","data":"projects"}` | `{"type":"output","data":"<plain text>","lines":[[{"t":"..","s":"heading"}]]}` then `prompt` |
| `{"type":"complete","data":"pro"}` | `{"type":"complete","completion":"project","matches":["projects","project"]}` |
| `{"type":"interrupt"}` (Ctrl+C) | `prompt` (cancels an active contact flow) |
| `{"type":"resize","cols":120,"rows":30}` | - (server picks a banner that fits) |
| | `{"type":"clear"}`, `{"type":"exit"}`, `{"type":"error","data":".."}` |

`lines` carries style *names* (`heading`, `accent`, `muted`, `link`, ...), never ANSI or HTML.

## Configuration

Everything is an environment variable; see `.env.example`. Notable ones: `ALLOWED_ORIGINS` (WebSocket origin
allow-list), `TRUST_PROXY` (only behind your own Nginx), `CONTACT_RATE_LIMIT` (`3/hour`), `MAX_WS_SESSIONS` (50),
`MAX_SSH_SESSIONS` (20), `CONTACT_WEBHOOK_URL` *or* `SMTP_*`.

## Known limits

* Rate limits and session caps are in memory, per process. The web and SSH services are separate processes,
  so an attacker gets 3/hour on each. Use Redis if that ever matters.
* Tab completion on `pro` lists `projects` and `project` and completes to the common prefix `project`
  (standard readline behaviour) rather than picking `projects`.
