# Skills

My agent skills for Claude Code, OpenAI Codex and other compatible AI agents.

## Available skills

### `business-owner-review`

Review web apps, SaaS products, ecommerce sites, client portals, admin panels,
internal tools, and business applications from a business owner perspective.

It focuses on:

- revenue and pricing risk
- customer understanding
- trust and compliance exposure
- operational friction
- retention and growth opportunities
- business-facing language and tone

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

### `laravel-http-interface`

Laravel HTTP-layer guidance for routes, controllers, requests, responses,
middleware, session, CSRF, URLs, and Blade-facing boundaries.

### `laravel-validation-and-security`

Laravel validation and security guidance for Form Requests, authorization,
authentication, password flows, email verification, hashing, encryption, and
token or session security.

### `laravel-database-and-eloquent`

Laravel database guidance for query builder, migrations, seeding, Eloquent
models, relationships, pagination, serialization, factories, resources, casts,
and N+1 issues.

### `laravel-application-architecture`

Laravel architecture guidance for the service container, service providers,
facades, contracts, configuration, logging, error handling, helpers, lifecycle,
and deciding where code belongs across Laravel layers.

### `laravel-async-and-integrations`

Laravel async and integration guidance for jobs, queues, events, listeners,
broadcasting, mail, notifications, file storage, HTTP client, scheduling,
processes, rate limiting, cache, search, and side-effect-heavy workflows.

### `laravel-testing-and-quality`

Laravel testing guidance for feature tests, unit tests, HTTP tests, database
testing, factories, mocking, fakes, assertions, regression coverage, and test
design.

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
$skill-installer install https://github.com/szepeviktor/skills/tree/master/skills/business-owner-review
$skill-installer install https://github.com/szepeviktor/skills/tree/master/skills/laravel-principal-engineer
$skill-installer install https://github.com/szepeviktor/skills/tree/master/skills/larastan-preflight-reviewer
$skill-installer install https://github.com/szepeviktor/skills/tree/master/skills/laravel-http-interface
$skill-installer install https://github.com/szepeviktor/skills/tree/master/skills/laravel-validation-and-security
$skill-installer install https://github.com/szepeviktor/skills/tree/master/skills/laravel-database-and-eloquent
$skill-installer install https://github.com/szepeviktor/skills/tree/master/skills/laravel-application-architecture
$skill-installer install https://github.com/szepeviktor/skills/tree/master/skills/laravel-async-and-integrations
$skill-installer install https://github.com/szepeviktor/skills/tree/master/skills/laravel-testing-and-quality
$skill-installer install https://github.com/szepeviktor/skills/tree/master/skills/wp-plugin-structure-guardrails
```

For Claude Code:

```text
/plugin marketplace add szepeviktor/skills
/plugin install business-owner-review@szepeviktor-skills
/plugin install laravel-principal-engineer@szepeviktor-skills
/plugin install larastan-preflight-reviewer@szepeviktor-skills
/plugin install laravel-http-interface@szepeviktor-skills
/plugin install laravel-validation-and-security@szepeviktor-skills
/plugin install laravel-database-and-eloquent@szepeviktor-skills
/plugin install laravel-application-architecture@szepeviktor-skills
/plugin install laravel-async-and-integrations@szepeviktor-skills
/plugin install laravel-testing-and-quality@szepeviktor-skills
/plugin install wp-plugin-structure-guardrails@szepeviktor-skills
```

## Refactoring

Use this prompt.

```
Use the wp-plugin-structure-guardrails skill and refactor this plugin to conform to it.
Change the code directly, preserve behavior, and summarize the structural violations you fixed.
```
