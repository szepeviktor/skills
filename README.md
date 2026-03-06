# Skills

My agent skills for Claude Code, OpenAI Codex and other compatible AI agents.

## Available skills

###  `wp-plugin-structure-guardrails`

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
https://github.com/szepeviktor/skills/tree/master/skills/wp-plugin-structure-guardrails
```
