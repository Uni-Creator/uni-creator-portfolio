import os
import sys

import pytest

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from app.api.contact import ContactService  # noqa: E402
from app.config import Settings  # noqa: E402
from app.main import build_core, create_app  # noqa: E402
from app.terminal.renderer import PlainRenderer  # noqa: E402

DATA = os.path.join(os.path.dirname(os.path.dirname(__file__)), "app", "data", "portfolio.json")


class Sink:
    """Fake delivery backend that records what would have been sent."""

    def __init__(self, fail: bool = False):
        self.sent, self.fail = [], fail

    async def __call__(self, settings, name, email, message, source):
        if self.fail:
            raise RuntimeError("smtp exploded: secret-password-123")
        self.sent.append((name, email, message, source))


@pytest.fixture
def settings():
    return Settings(portfolio_data_path=DATA, contact_dry_run=True, ssh_host="127.0.0.1")


@pytest.fixture
def sink():
    return Sink()


@pytest.fixture
def service(settings, sink):
    return ContactService(settings, sink)


@pytest.fixture
def core(settings, service):
    return build_core(settings, service)


@pytest.fixture
def state(core):
    return core.new_state("test", "203.0.113.9")


@pytest.fixture
def run(core, state):
    async def _run(line):
        result = await core.handle_line(state, line)
        return PlainRenderer().render(result.lines), result
    return _run


@pytest.fixture
def app(settings, sink):
    return create_app(settings, deliver=sink)
