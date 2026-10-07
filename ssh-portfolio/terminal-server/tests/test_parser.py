from app.terminal.parser import MAX_COMMAND_LENGTH, parse_command


def test_help():
    p = parse_command("help")
    assert (p.name, p.args) == ("help", ())


def test_projects():
    assert parse_command("projects").name == "projects"


def test_project_with_arg():
    p = parse_command("project signBridge")
    assert p.name == "project" and p.args == ("signBridge",)


def test_quoted_and_multiword_args():
    assert parse_command('project "RAG Multi-File QA"').args == ("RAG Multi-File QA",)
    assert parse_command("project RAG Multi-File QA").arg_text == "RAG Multi-File QA"


def test_unbalanced_quote_does_not_crash():
    assert parse_command('project "oops').name == "project"


def test_unknown_command_is_just_a_name():
    assert parse_command("unknown-command --flag").name == "unknown-command"


def test_empty_and_whitespace():
    assert parse_command("").empty and parse_command("   ").empty


def test_case_insensitive_command():
    assert parse_command("HELP").name == "help"


def test_too_long_rejected():
    assert parse_command("a" * (MAX_COMMAND_LENGTH + 1)).error


def test_control_characters_rejected():
    assert parse_command("help\x1b[2J").error
