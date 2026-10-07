# Restricted SSH Portfolio

A portfolio exposed through SSH. Users get a portfolio application, **not a Linux shell**.

The server uses AsyncSSH's `process_factory` API. It never invokes `bash`, `sh`,
`subprocess`, or any OS command based on user input. TCP forwarding, remote
forwarding, agent forwarding, X11 forwarding, SFTP, and SCP are disabled.

## Local test

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

export SSH_PORT=2222
export CONTACT_WEBHOOK_URL=https://your-api.example.com/contact

python -m ssh_terminal.server
```

From another terminal:

```bash
ssh -p 2222 portfolio@127.0.0.1
```

The portfolio SSH endpoint intentionally requires no password/key. This is
appropriate only because the endpoint exposes no shell and no forwarding.
Keep the SSH service isolated from the machine's normal administrative SSH.

## Commands

```text
help
about
projects
skills
experience
resume
contact
github
linkedin
clear
exit
```

Direct command mode is also supported:

```bash
ssh -p 2222 portfolio@127.0.0.1 projects
```

Only known portfolio commands are accepted. Arbitrary commands are rejected.

## Contact flow

`contact` collects:

1. Name
2. Email
3. Message
4. Confirmation

The server POSTs JSON to `CONTACT_WEBHOOK_URL`:

```json
{
  "source": "ssh-portfolio",
  "name": "Abhay",
  "email": "person@example.com",
  "message": "Hello",
  "submitted_at": "2026-10-07T00:00:00+00:00"
}
```

The webhook must use HTTPS. The request has an 8-second timeout.

## Production

Use a dedicated Linux service account:

```text
portfolio -> /usr/sbin/nologin
```

and run the AsyncSSH application under systemd.

Do not replace the application with:

```text
ForceCommand bash
```

or give the portfolio user an interactive Linux shell.

Run the portfolio SSH endpoint on a separate port such as `2222`, leaving your
normal administrative SSH service on its existing port.

Put a firewall/rate limiter in front of the public endpoint if the service is
internet-facing.
