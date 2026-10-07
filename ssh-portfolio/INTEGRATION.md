# Wiring it into uni-creator-portfolio

All new code lives in new folders. Only these existing files change:

## 1. `src/main.tsx`  (replace; the site bundle is unchanged, Terminal is a lazy chunk)
Use the provided `src/main.tsx`. `/terminal` (and `/terminal/`) renders the terminal; every other path renders `<App />` exactly as before.

## 2. `vite.config.ts`  (dev proxy; keep your existing plugins)
```ts
server: {
  proxy: {
    '/ws':           { target: 'ws://127.0.0.1:8000', ws: true },
    '/terminal/':    'http://127.0.0.1:8000',     // curl endpoints (the React page is /terminal, no slash)
    '/api/contact':  'http://127.0.0.1:8000',
  },
},
```

## 3. Buttons on the site (e.g. in `src/components/Footer.tsx` or `Home.tsx`)
```tsx
import { OpenTerminalButton, SshCommand } from '../terminal/TerminalLinks'
// ...
<OpenTerminalButton />
<SshCommand />
```

## 4. `package.json`
```json
"scripts": { "terminal:data": "tsx terminal-server/scripts/export_portfolio_data.ts" },
"devDependencies": { "tsx": "^4.19.0" }
```
Run `npm run terminal:data` whenever `src/constants/*` changes (it also fills the `skills` command).

## 5. Vercel (only if the site is on Vercel): `vercel.json`
Order matters: the specific rule first.
```json
{
  "rewrites": [
    { "source": "/terminal/:path+", "destination": "https://terminal.yourdomain.com/terminal/:path+" },
    { "source": "/terminal",        "destination": "/index.html" }
  ]
}
```
Add any existing rewrites you already have.

## 6. `.gitignore`
```
.env
terminal-server/.env
terminal-server/host_key*
```

## 7. Frontend env (`.env.local` / Vercel)
```
VITE_TERMINAL_WS_URL=wss://terminal.yourdomain.com/ws/terminal
VITE_SSH_HOST=terminal.yourdomain.com
VITE_SSH_PORT=2222
```
Without `VITE_TERMINAL_WS_URL` the page connects to the same host at `/ws/terminal` (works with the dev proxy or single-domain Nginx).

## About the existing `ssh_terminal` entry
Your tree shows an `ssh_terminal` entry at the repo root. Nothing here reads or modifies it; if it is an earlier
attempt, delete it once this works.
