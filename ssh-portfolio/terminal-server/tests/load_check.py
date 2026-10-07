"""Manual load check (not part of pytest):  python tests/load_check.py
Starts the app in-process and opens 50 WebSocket + 20 SSH sessions concurrently."""
import asyncio, json, os, sys, tempfile, time
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
import asyncssh, uvicorn, websockets
from app.api.contact import ContactService
from app.config import Settings
from app.main import build_core, create_app
from app.transports.ssh import start_ssh_server

async def ws_client(i):
    async with websockets.connect("ws://127.0.0.1:8765/ws/terminal") as ws:
        await ws.send(json.dumps({"type": "ready"}))
        for _ in range(3): await ws.recv()
        t = time.perf_counter()
        for cmd in ("projects", "about", "skills"):
            await ws.send(json.dumps({"type": "input", "data": cmd}))
            await ws.recv(); await ws.recv()
        await asyncio.sleep(1)
        return time.perf_counter() - t

async def ssh_client(port):
    async with asyncssh.connect("127.0.0.1", port, username="portfolio", known_hosts=None, client_keys=None) as c:
        p = await c.create_process(term_type="xterm")
        await asyncio.sleep(1)
        p.stdin.write("projects\r"); await asyncio.sleep(0.5)
        p.stdin.write("exit\r"); await p.wait_closed()

async def main():
    s = Settings(portfolio_data_path=os.path.join(os.path.dirname(__file__), "..", "app", "data", "portfolio.json"),
                 ssh_host="127.0.0.1", ssh_host_key=os.path.join(tempfile.mkdtemp(), "hk"), contact_dry_run=True,
                 max_ws_sessions=50, max_ssh_sessions=20, max_ssh_sessions_per_ip=20)
    app = create_app(s)
    server = uvicorn.Server(uvicorn.Config(app, host="127.0.0.1", port=8765, log_level="error"))
    task = asyncio.create_task(server.serve())
    while not server.started: await asyncio.sleep(0.05)
    ssh = await start_ssh_server(build_core(s, ContactService(s)), s, port=0)
    port = ssh.sockets[0].getsockname()[1]
    t = time.perf_counter()
    res = await asyncio.gather(*[ws_client(i) for i in range(50)], *[ssh_client(port) for _ in range(20)])
    print(f"50 WS + 20 SSH concurrent sessions OK in {time.perf_counter()-t:.2f}s; "
          f"worst WS 3-command latency (excl. 1s idle) {max(r for r in res[:50])-1:.3f}s")
    ssh.close(); server.should_exit = True; await task

asyncio.run(main())
