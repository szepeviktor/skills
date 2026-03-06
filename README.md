# Skills

My agent skills for Claude Code, OpenAI Codex and other compatible AI agents.

## Available skills

### `wp-plugin-structure-guardrails`

WordPress plugin structure and bootstrap discipline.

It does **not** design product features.

The skill prioritizes these structural guardrails:

- no global constants for routine runtime state
- no global helper functions
- no namespace-less classes
- no manual require/include sprawl
- no side effects in included files
- no immediate execution outside explicit bootstrap orchestration
- no conditional class/function declarations

## Installation

Point Codex at the skill directory:

```text
$skill-installer isntall https://github.com/szepeviktor/skills/tree/master/skills/wp-plugin-structure-guardrails
```

For Claude Code:

```text
/plugin marketplace add szepeviktor/skills
/plugin install wp-plugin-structure-guardrails@szepeviktor-skills
```

## Refactoring

Use this prompt.

```
Use the wp-plugin-structure-guardrails skill and refactor this plugin to conform to it.
Change the code directly, preserve behavior, and summarize the structural violations you fixed.
```
