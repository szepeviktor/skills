# Skills

My agent skills for Claude Code, OpenAI Codex and other compatible AI agents.

## Available skills

### `laravel-principal-engineer`

Front-door Laravel guidance for broad, ambiguous, or cross-cutting work.

Use it for:

- general Laravel development
- vague requests where the Laravel subsystem is not obvious yet
- code review and refactoring
- architecture decisions
- feature planning
- situations where the user does not know Laravel terminology

The skill prioritizes these guardrails:

- prefer official Laravel conventions over generic PHP patterns
- map the request to the correct Laravel subsystem
- choose the simplest Laravel-native solution first
- avoid invented Laravel APIs and assumptions
- use narrower Laravel skills when a specific subsystem becomes clear

### `larastan-preflight-reviewer`

Review Laravel Eloquent model `casts()` methods, `Attribute` accessor/mutator methods,
and relationship methods before Larastan/PHPStan runs.

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
$skill-installer install https://github.com/szepeviktor/skills/tree/master/skills/laravel-principal-engineer
$skill-installer install https://github.com/szepeviktor/skills/tree/master/skills/wp-plugin-structure-guardrails
```

For Claude Code:

```text
/plugin marketplace add szepeviktor/skills
/plugin install laravel-principal-engineer@szepeviktor-skills
/plugin install wp-plugin-structure-guardrails@szepeviktor-skills
```

## Refactoring

Use this prompt.

```
Use the wp-plugin-structure-guardrails skill and refactor this plugin to conform to it.
Change the code directly, preserve behavior, and summarize the structural violations you fixed.
```
