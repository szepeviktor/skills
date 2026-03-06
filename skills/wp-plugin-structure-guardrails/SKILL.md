---
name: wp-plugin-structure-guardrails
description: >
  Use when creating, reviewing, refactoring, or scaffolding a WordPress plugin
  that should follow a strict modern starter structure. Focus on what to avoid:
  globals, unnamespaced classes, require-sprawl, side effects outside the main
  plugin file, immediate execution, and conditional definitions.
metadata:
  short-description: Guardrails for WordPress plugin structure
---

# WP Plugin Structure Guardrails

Use this skill when the task is about **plugin structure**, **bootstrap design**, **main plugin file hygiene**, or **turning a messy plugin into a modern starter-style layout**.

This skill is **not** for implementing business features. It is for enforcing structural discipline.

## Purpose

Treat the plugin as a small, well-bounded application with:

- one thin main plugin file
- autoloaded namespaced code
- explicit hooks
- requirement checks
- no scattered bootstrap logic

If the user asks for a new plugin skeleton, a cleanup, a review, or a migration from legacy WordPress patterns, optimize for **clarity, isolation, and predictable loading**.

## Use when

- creating a new WordPress plugin scaffold
- reviewing a plugin bootstrap or main file
- refactoring legacy WordPress plugin structure
- checking Composer autoloading and file layout
- enforcing starter-style project rules in code review

## What to avoid

These are the primary guardrails. Prefer refactoring toward their opposite.

- **No global constants** for ordinary runtime state or configuration.
- **No global functions** unless WordPress absolutely requires one and there is no practical alternative.
- **No classes without namespaces.**
- **No manual `require` / `include` sprawl** across the codebase. Prefer Composer autoloading.
- **No side-effectful code outside the main plugin file.** Non-entry files should define classes, interfaces, traits, or pure helpers.
- **No immediate execution in included files.**
- **No immediate execution in the main plugin file without explicit bootstrap orchestration.**
- **No conditional function or class definitions.**

## Positive replacements

| Avoid | Prefer |
|---|---|
| Global constant bags | Well-scoped class constants or immutable config objects |
| Global helper functions | Small services, static methods, or carefully justified namespaced functions |
| Flat legacy classes | PSR-4 autoloaded namespaced classes |
| `require` chains | Composer autoload + one entrypoint |
| Executing code on file include | Registering hooks at the right lifecycle event |
| Conditionally declared APIs | Deterministic class loading and explicit compatibility checks |

## Default architecture

Unless the user gives a better house style, prefer this shape:

```text
plugin-root/
├── plugin-name.php
├── composer.json
├── src/
│   ├── Plugin.php
│   ├── Infrastructure/
│   ├── Admin/
│   ├── Frontend/
│   ├── Cli/
│   └── Compatibility/
├── languages/
├── tests/
├── phpcs.xml
├── phpstan.neon
└── readme.txt
```

## Main plugin file rules

The main plugin file may contain only the minimum bootstrap responsibilities, such as:

1. plugin header
2. strict types
3. direct-access guard
4. Composer autoloader include
5. duplicate-load prevention
6. immutable plugin metadata or config creation
7. translation loading registration
8. requirement checks
9. activation hook registration
10. optional WP-CLI registration
11. admin notice + self-deactivation fallback when requirements fail

Everything else belongs elsewhere.

## How to work

When this skill is active, follow this sequence:

1. **Identify the structural role** of each file.
2. **Find violations of the avoid-list.**
3. **Collapse bootstrap into one entrypoint.**
4. **Move implementation into autoloaded classes.**
5. **Replace immediate execution with hook registration.**
6. **Preserve behavior while improving structure.**

## Review checklist

- Is there exactly one obvious plugin entrypoint?
- Is feature logic absent from the main plugin file?
- Are classes namespaced and autoloadable?
- Does any included file perform work immediately on load?
- Are there global helper functions that should become methods or services?
- Are there `require` / `include` chains that Composer should replace?
- Are hooks registered in a deliberate bootstrap path?
- Are compatibility checks explicit and early?
- Does failure mode surface as an admin notice instead of fatal chaos?

## Output expectations

### For code review

Return:

- the structural problems
- why each one violates the guardrails
- the target structure
- a minimally disruptive refactor plan

### For scaffolding

Return:

- folder layout
- responsibilities per file
- the thin main plugin bootstrap
- placeholder classes only where they clarify structure

### For refactoring

Return:

- before/after mapping
- files to create, move, or delete
- exact bootstrap responsibilities kept in the main file
- any compatibility risk

## Non-goals

Do not turn this into a feature-design skill.

Avoid spending effort on:

- UI ideas
- product requirements
- settings pages
- business logic
- REST endpoint design
- WooCommerce-specific features
- block/editor features
- CSS/JS bundling details

unless the user explicitly asks for them.

## Decision standard

When there is a tradeoff, prefer the option that:

1. reduces hidden execution
2. reduces global state
3. improves autoloadability
4. makes WordPress lifecycle timing explicit
5. keeps the main plugin file boring

## Operating principle

**The main plugin file should bootstrap the plugin safely and predictably, while all real behavior lives in namespaced, autoloaded code with no surprise execution on include.**
