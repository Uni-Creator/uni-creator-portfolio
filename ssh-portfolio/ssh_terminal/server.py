import asyncio
import os
import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

import asyncssh
import httpx

HOST = os.getenv("SSH_HOST", "127.0.0.1")
PORT = int(os.getenv("SSH_PORT", "2222"))
HOST_KEY = os.getenv("SSH_HOST_KEY", "./host_key")
CONTACT_WEBHOOK_URL = os.getenv("CONTACT_WEBHOOK_URL", "").strip()

IDLE_TIMEOUT = int(os.getenv("IDLE_TIMEOUT", "900"))
MAX_NAME = 80
MAX_EMAIL = 254
MAX_MESSAGE = 2000

COMMANDS = {
    "help", "about", "projects", "skills", "experience",
    "resume", "contact", "github", "linkedin", "clear", "exit", "quit"
}

PROJECTS = [
    ("signBridge", "Real-time Indian Sign Language recognition system."),
    ("NeuralDrive", "NEAT-based autonomous driving simulation."),
    ("RAG-MultiFile-QA", "Multi-stage retrieval-augmented generation system."),
    ("SmartPath", "AI-powered personalized learning path generator."),
]

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


def esc(text: str) -> str:
    """Strip terminal control characters from user-controlled text."""
    return "".join(ch for ch in text if ch in "\n\r\t" or 32 <= ord(ch) <= 126)


def clear_screen() -> str:
    return "\x1b[2J\x1b[H"


def banner() -> str:
    return clear_screen() + r"""
\x1b[1;36m
╔════════════════════════════════════════════════════════════════════╗
║                                                                    ║
║                         ABHAY SINGH                               ║
║                  AI/ML ENGINEER • DEVELOPER                       ║
║                                                                    ║
╠════════════════════════════════════════════════════════════════════╣
║                                                                    ║
║   Type \x1b[1;33mhelp\x1b[1;36m to see available commands.                         ║
║                                                                    ║
╚════════════════════════════════════════════════════════════════════╝
\x1b[0m
"""


def render_projects() -> str:
    out = ["\x1b[1;36mPROJECTS\x1b[0m", "─" * 64]
    for i, (name, description) in enumerate(PROJECTS, 1):
        out += [f"\x1b[1;33m{i}. {name}\x1b[0m", f"   {description}", ""]
    return "\n".join(out)


def render_help() -> str:
    return """\x1b[1;36mCOMMANDS\x1b[0m
────────────────────────────────────────────────────────────────
  about       About me
  projects    Browse projects
  skills      Technical skills
  experience  Experience
  resume      Resume information
  contact     Send me a message
  github      GitHub
  linkedin    LinkedIn
  clear       Clear terminal
  help        Show this help
  exit        Close session
────────────────────────────────────────────────────────────────
"""


def render_about() -> str:
    return """\x1b[1;36mABOUT\x1b[0m
────────────────────────────────────────────────────────────────
B.Tech student and AI/ML-focused developer working on computer
vision, NLP/RAG, sign-language systems, backend APIs, and ML
inference systems.

This terminal is intentionally restricted: it exposes portfolio
functionality only and never provides a system shell.
"""


def render_skills() -> str:
    return """\x1b[1;36mSKILLS\x1b[0m
────────────────────────────────────────────────────────────────
Languages       Python, Dart, JavaScript/TypeScript
ML/AI           PyTorch, scikit-learn, Hugging Face, RAG
Backend         FastAPI, Flask, WebSockets
Frontend        React, Vite, Flutter
Infrastructure  Docker, Linux, GitHub Actions
Data            PostgreSQL, Redis, FAISS
"""


def render_experience() -> str:
    return """\x1b[1;36mEXPERIENCE\x1b[0m
────────────────────────────────────────────────────────────────
AI/ML projects and research-oriented engineering work involving
sign-language recognition/translation, 3D pose pipelines,
personalized learning systems, RAG, and production-style APIs.

Use `projects` to inspect selected work.
"""


def render_resume() -> str:
    return """\x1b[1;36mRESUME\x1b[0m
────────────────────────────────────────────────────────────────
A full PDF resume can be exposed here later.

For now:
  github     → code and project history
  contact    → get in touch
"""


def render_contact_intro() -> str:
    return """\x1b[1;36mCONTACT\x1b[0m
────────────────────────────────────────────────────────────────
Send a message. Type `cancel` at any prompt to abort.

"""


def clean_input(value: str, limit: int) -> str:
    return esc(value.strip())[:limit]


async def read_line(process, prompt: str, limit: int) -> str:
    process.stdout.write(prompt)
    await process.stdout.drain()

    try:
        value = await asyncio.wait_for(
            process.stdin.readline(),
            timeout=IDLE_TIMEOUT,
        )
    except asyncio.TimeoutError:
        raise TimeoutError

    return clean_input(value, limit)


async def submit_contact(
    name: str,
    email: str,
    message: str,
) -> tuple[bool, str]:

    payload = {
        "name": name,
        "email": email,
        "message": message,
    }

    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            response = await client.post(
                "http://127.0.0.1:8000/api/contact",
                json=payload,
            )

        if response.status_code == 201:
            return True, "Message sent successfully."

        return False, (
            f"Message delivery failed "
            f"(HTTP {response.status_code})."
        )

    except (httpx.HTTPError, OSError):
        return False, (
            "Message delivery failed. "
            "Please try again later."
        )


async def contact_flow(process) -> None:
    process.stdout.write(render_contact_intro())

    try:
        name = await read_line(process, "Name: ", MAX_NAME)
        if name.lower() == "cancel":
            process.stdout.write("Cancelled.\n")
            return
        if not name:
            process.stdout.write("Name cannot be empty.\n")
            return

        email = await read_line(process, "Email: ", MAX_EMAIL)
        if email.lower() == "cancel":
            process.stdout.write("Cancelled.\n")
            return
        if not EMAIL_RE.fullmatch(email):
            process.stdout.write("Invalid email address.\n")
            return

        message = await read_line(process, "Message: ", MAX_MESSAGE)
        if message.lower() == "cancel":
            process.stdout.write("Cancelled.\n")
            return
        if not message:
            process.stdout.write("Message cannot be empty.\n")
            return

        process.stdout.write(
            f"\n\x1b[1;33mReview\x1b[0m\n"
            f"  Name:    {name}\n"
            f"  Email:   {email}\n"
            f"  Message: {message}\n\n"
        )

        confirm = await read_line(process, "Send message? [y/N]: ", 3)
        if confirm.lower() != "y":
            process.stdout.write("Cancelled.\n")
            return

        ok, result = await submit_contact(name, email, message)
        prefix = "\x1b[1;32m" if ok else "\x1b[1;31m"
        process.stdout.write(prefix + result + "\x1b[0m\n")

    except TimeoutError:
        process.stdout.write("\nContact session timed out.\n")


class PortfolioSSHServer(asyncssh.SSHServer):
    def connection_made(self, conn):
        peer = conn.get_extra_info("peername")
        print(f"[ssh] connection from {peer}")

    def connection_lost(self, exc):
        if exc:
            print(f"[ssh] connection closed with error: {exc}")

    def begin_auth(self, username: str) -> bool:
        # Public portfolio: no SSH password/key is required.
        # The application still accepts only the portfolio username.
        return False

    def connection_requested(self, dest_host, dest_port, orig_host, orig_port):
        # No TCP port forwarding.
        return False

    def server_requested(self, listen_host, listen_port):
        # No remote port forwarding.
        return False


async def handle_client(process: asyncssh.SSHServerProcess):
    username = process.get_extra_info("username")

    # The public endpoint is intentionally limited to this username.
    if username != "portfolio":
        process.stderr.write("Use: ssh portfolio@HOST -p PORT\n")
        process.exit(1)
        return

    try:
        # No SFTP/SCP/subsystems.
        if process.subsystem:
            process.stderr.write("Subsystems are disabled.\n")
            process.exit(1)
            return

        # Support `ssh portfolio@host -p 2222 projects` without ever
        # executing an OS command.
        if process.command:
            command = process.command.strip().lower()
            if command not in COMMANDS:
                process.stderr.write("Unknown portfolio command. Use `help`.\n")
                process.exit(1)
                return

            await execute_command(process, command)
            process.exit(0)
            return

        process.stdout.write(banner())
        await process.stdout.drain()

        while True:
            process.stdout.write(
                "\x1b[1;32mportfolio@abhay\x1b[0m:"
                "\x1b[1;34m~\x1b[0m$ "
            )
            await process.stdout.drain()

            try:
                raw = await asyncio.wait_for(
                    process.stdin.readline(),
                    timeout=IDLE_TIMEOUT,
                )
            except asyncio.TimeoutError:
                process.stdout.write("\nSession timed out.\n")
                break

            if not raw:
                break

            command = raw.strip().lower()

            if command in {"exit", "quit"}:
                process.stdout.write("Goodbye.\n")
                break

            if not command:
                continue

            await execute_command(process, command)
            await process.stdout.drain()

    except (asyncio.CancelledError, ConnectionError, BrokenPipeError):
        pass
    finally:
        process.exit(0)


async def execute_command(process, command: str):
    if command == "help":
        process.stdout.write(render_help())
    elif command == "about":
        process.stdout.write(render_about())
    elif command == "projects":
        process.stdout.write(render_projects() + "\n")
    elif command == "skills":
        process.stdout.write(render_skills())
    elif command == "experience":
        process.stdout.write(render_experience())
    elif command == "resume":
        process.stdout.write(render_resume())
    elif command == "contact":
        await contact_flow(process)
    elif command == "github":
        process.stdout.write("https://github.com/Uni-Creator\n")
    elif command == "linkedin":
        process.stdout.write("Add your LinkedIn URL in server.py.\n")
    elif command == "clear":
        process.stdout.write(clear_screen())
    elif command in {"exit", "quit"}:
        process.stdout.write("Goodbye.\n")
    else:
        process.stdout.write(
            f"Unknown command: {esc(command)}. Type `help`.\n"
        )


def ensure_host_key():
    path = Path(HOST_KEY)

    if not path.exists():
        path.parent.mkdir(parents=True, exist_ok=True)
        key = asyncssh.generate_private_key("ssh-ed25519")
        key.write_private_key(path)
        os.chmod(path, 0o600)


async def start():
    ensure_host_key()

    print(f"Starting restricted portfolio SSH on {HOST}:{PORT}")
    print(
        "Contact webhook configured:",
        "yes" if CONTACT_WEBHOOK_URL else "no",
    )

    await asyncssh.listen(
        HOST,
        PORT,
        server_host_keys=[HOST_KEY],
        server_factory=PortfolioSSHServer,
        process_factory=handle_client,
        allow_pty=True,
        agent_forwarding=False,
        x11_forwarding=False,
        allow_scp=False,
        encoding="utf-8",
        line_editor=True,
        line_echo=True,
        max_line_length=2048,
)

    await asyncio.Future()


def main():
    asyncio.run(start())


if __name__ == "__main__":
    main()
