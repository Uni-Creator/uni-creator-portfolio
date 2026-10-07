import pytest
from fastapi.testclient import TestClient

from app.api.contact import ContactRateLimited, ContactService, ContactUnavailable, SpamRejected
from app.config import Settings
from app.security.validation import ContactValidationError
from tests.conftest import DATA, Sink


async def fill(run, name="Ada Lovelace", email="ada@example.com", message="I would like to discuss your project."):
    await run("contact")
    await run(name)
    await run(email)
    await run(message)


async def test_valid_submission(run, sink, state):
    await fill(run)
    out, _ = await run("y")
    assert "Message sent successfully" in out
    assert sink.sent == [("Ada Lovelace", "ada@example.com", "I would like to discuss your project.", "test")]
    assert state.contact_state is None and state.contact_submissions == 1


async def test_prompts_progress(run, state):
    await run("contact")
    assert state.prompt == "Name: "
    await run("Ada")
    assert state.prompt == "Email: "
    await run("ada@example.com")
    assert state.prompt == "Message: "
    out, _ = await run("hello")
    assert state.prompt.startswith("Send message?") and "Ada" in out


async def test_invalid_email_reasks(run, state):
    await run("contact")
    await run("Ada")
    out, result = await run("not-an-email")
    assert "valid email" in out and not result.ok and state.contact_state.step == "email"


async def test_empty_name(run, state):
    await run("contact")
    out, _ = await run("   ")
    assert "Name is required" in out and state.contact_state.step == "name"


async def test_empty_message(run, state):
    await run("contact")
    await run("Ada")
    await run("ada@example.com")
    out, _ = await run("")
    assert "Message is required" in out and state.contact_state.step == "message"


async def test_oversized_message(run, state, settings):
    await run("contact")
    await run("Ada")
    await run("ada@example.com")
    out, _ = await run("x" * (settings.contact_max_message_length + 1))
    assert "at most" in out and state.contact_state.step == "message"


@pytest.mark.parametrize("steps", [0, 1, 2, 3])
async def test_cancel_at_any_step(run, state, sink, steps):
    await run("contact")
    for answer in ("Ada", "ada@example.com", "hello")[:steps]:
        await run(answer)
    out, _ = await run("cancel")
    assert "Cancelled" in out and state.contact_state is None and not sink.sent


async def test_decline_confirmation(run, sink, state):
    await fill(run)
    out, _ = await run("n")
    assert "Nothing was sent" in out and not sink.sent


async def test_interrupt_cancels_flow(core, run, state):
    await run("contact")
    core.interrupt(state)
    assert state.contact_state is None


async def test_session_limit(core, run, state, settings):
    state.contact_submissions = settings.contact_session_limit
    out, _ = await run("contact")
    assert "limit" in out and state.contact_state is None


async def test_backend_failure_hides_internals(settings):
    from app.main import build_core
    svc = ContactService(settings, Sink(fail=True))
    core = build_core(settings, svc)
    st = core.new_state("test", "198.51.100.1")
    for line in ("contact", "Ada", "ada@example.com", "hello there", "y"):
        result = await core.handle_line(st, line)
    text = "".join(s.text for l in result.lines for s in l)
    assert "Unable to send your message right now." in text and "GitHub:" in text
    assert "secret-password" not in text and "Traceback" not in text and "RuntimeError" not in text


async def test_service_rate_limit(settings, sink):
    svc = ContactService(Settings(portfolio_data_path=DATA, contact_rate_limit="3/hour"), sink)
    for i in range(3):
        await svc.submit("Ada", "ada@example.com", f"unique message number {i}", remote_ip="1.2.3.4")
    with pytest.raises(ContactRateLimited) as exc:
        await svc.submit("Ada", "ada@example.com", "one more unique message", remote_ip="1.2.3.4")
    assert exc.value.retry_after > 0
    await svc.submit("Ada", "ada@example.com", "different ip is fine", remote_ip="5.6.7.8")


async def test_failed_delivery_does_not_burn_quota(settings):
    svc = ContactService(Settings(portfolio_data_path=DATA, contact_rate_limit="1/hour"), Sink(fail=True))
    for _ in range(3):
        with pytest.raises(ContactUnavailable):
            await svc.submit("Ada", "ada@example.com", "hello world", remote_ip="9.9.9.9")


async def test_spam_and_duplicates(service):
    with pytest.raises(SpamRejected):
        await service.submit("Bob", "bob@example.com", "buy followers http://a.co http://b.co http://c.co", remote_ip="7.7.7.7")
    await service.submit("Ada", "ada@example.com", "hello there friend", remote_ip="7.7.7.8")
    with pytest.raises(SpamRejected):
        await service.submit("Ada", "ada@example.com", "hello there friend", remote_ip="7.7.7.8")


async def test_not_configured_is_unavailable():
    svc = ContactService(Settings(portfolio_data_path=DATA))
    with pytest.raises(ContactUnavailable):
        await svc.submit("Ada", "ada@example.com", "hi there", remote_ip="1.1.1.1")


# ---------------------------------------------------------------- HTTP API
def test_api_success(app, sink):
    c = TestClient(app)
    r = c.post("/api/contact", json={"name": "Ada", "email": "ada@example.com", "message": "Hello"})
    assert r.status_code == 200 and r.json() == {"success": True, "message": "Message sent successfully"}
    assert len(sink.sent) == 1


@pytest.mark.parametrize("body,field", [
    ({"name": "", "email": "a@b.co", "message": "hi"}, "name"),
    ({"name": "A", "email": "nope", "message": "hi"}, "email"),
    ({"name": "A", "email": "a@b.co", "message": " "}, "message"),
    ({"name": "A", "email": "a@b.co", "message": "x" * 2001}, "message"),
    ({"name": "A" * 101, "email": "a@b.co", "message": "hi"}, "name"),
    ({"name": "A", "email": "a" * 250 + "@b.co", "message": "hi"}, "email"),
])
def test_api_validation(app, sink, body, field):
    r = TestClient(app).post("/api/contact", json=body)
    assert r.status_code == 422 and field in r.json()["errors"] and not sink.sent


def test_api_rate_limit_and_retry_after(app):
    c = TestClient(app)
    for i in range(3):
        assert c.post("/api/contact", json={"name": "A", "email": "a@b.co", "message": f"msg number {i}"}).status_code == 200
    r = c.post("/api/contact", json={"name": "A", "email": "a@b.co", "message": "msg number 99"})
    assert r.status_code == 429 and "Retry-After" in r.headers


def test_api_rejects_extra_fields_and_big_bodies(app):
    c = TestClient(app)
    assert c.post("/api/contact", json={"name": "A", "email": "a@b.co", "message": "hi", "x": 1}).status_code == 422
    assert c.post("/api/contact", content=b"x" * 20000, headers={"content-type": "application/json"}).status_code == 413


def test_api_backend_failure_is_503_without_details(settings):
    from app.main import create_app
    c = TestClient(create_app(settings, deliver=Sink(fail=True)))
    r = c.post("/api/contact", json={"name": "A", "email": "a@b.co", "message": "hello"})
    assert r.status_code == 503 and "secret" not in r.text and "RuntimeError" not in r.text
