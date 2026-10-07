import pytest

SPEC_COMMANDS = ["help", "about", "projects", "skills", "experience", "education", "resume", "github",
                 "linkedin", "whoami", "date", "neofetch", "history"]


@pytest.mark.parametrize("cmd", SPEC_COMMANDS)
async def test_every_command_produces_output(run, cmd):
    out, result = await run(cmd)
    assert out.strip() and result.ok


async def test_help_lists_commands(run):
    out, _ = await run("help")
    for name in ("about", "projects", "project <name>", "contact", "neofetch", "exit"):
        assert name in out


async def test_projects_list_and_title(run):
    out, _ = await run("projects")
    assert "PROJECTS" in out and "[1] signBridge" in out and "NeuralDrive" in out


@pytest.mark.parametrize("query", ["signBridge", "signbridge", "SIGNBRIDGE", "1"])
async def test_project_lookup_variants(run, query):
    out, result = await run(f"project {query}")
    assert result.ok and "SIGNBRIDGE" in out and "github.com/Uni-Creator/signBridge" in out


async def test_project_neuraldrive_and_multiword(run):
    assert "NEURALDRIVE" in (await run("project NeuralDrive"))[0]
    assert "RAG MULTI-FILE QA" in (await run("project RAG-MultiFile-QA"))[0]


async def test_project_missing_and_usage(run):
    out, result = await run("project nope")
    assert not result.ok and "not found" in out
    out, result = await run("project")
    assert "Usage" in out


async def test_unknown_command_message(run):
    out, result = await run("ls")
    assert "Command not found: ls" in out
    assert "This is a portfolio terminal, not a Linux shell." in out
    assert "Type `help` to see available commands." in out and not result.ok


async def test_clear_and_exit(run):
    assert (await run("clear"))[1].clear
    assert (await run("exit"))[1].exit


async def test_history_records_commands(run):
    await run("about")
    await run("skills")
    out, _ = await run("history")
    assert "about" in out and "skills" in out


async def test_whoami(run):
    assert (await run("whoami"))[0].strip() == "portfolio"


async def test_empty_line_is_noop(run):
    out, result = await run("   ")
    assert out == "" and result.ok


async def test_fake_path_never_changes(core, state):
    for line in ("cd /etc", "cd ..", "pwd"):
        await core.handle_line(state, line)
    assert state.prompt == "portfolio@abhay:~$ "


def test_tab_completion(core, state):
    assert core.complete(state, "hel").buffer == "help "
    comp = core.complete(state, "p")
    assert set(comp.matches) == {"projects", "project"} and comp.matches[0] == "projects"
    assert core.complete(state, "project Neu").buffer == "project NeuralDrive"
    assert core.complete(state, "zzz").matches == []


def test_banner_compact_on_small_screens(core, state):
    state.terminal_size = (40, 20)
    assert not any("╔" in "".join(s.text for s in l) for l in core.banner(state))
    state.terminal_size = (100, 30)
    assert any("╔" in "".join(s.text for s in l) for l in core.banner(state))
