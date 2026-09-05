---
name: typos-triage
description: Use when introducing or maintaining typos spellchecking, creating or refining .typos.toml, running typos, and fixing spelling findings with context-aware triage instead of blind replacements.
---

# Typos Triage

Use this skill to add or maintain `typos` spellchecking in a repository, run the check, and fix real spelling mistakes while protecting intentional text, public interfaces, external names, generated files, and compatibility-sensitive code.

The goal is not to make `typos` quiet at any cost. The goal is to produce a useful configuration and a clean result where each fix or ignore rule is justified by repository context.

## File Scope

Run `typos` on hidden dotfiles too. Prefer `ignore-hidden = false` so configuration, CI, editor, shell, and tool files are checked instead of silently skipped.

Before running or fixing results, identify files that should not be spellchecked because they are not maintained source:

- vendored dependencies
- downloaded or copied third-party code
- generated build artifacts
- compiled or minified assets
- lockfiles and package-manager metadata when their contents are machine-managed
- generated snapshots or fixtures when they intentionally preserve external, historical, or tool-produced output

Exclude non-source files in `.typos.toml` instead of editing spelling inside them. Do not exclude all dotfiles just to avoid noisy hidden paths.

Use `default.typos.toml` as a starting point when a repository has no suitable configuration, then adapt exclusions to the repository's actual technology and generated/vendor paths. When checking explicit paths, consider `--force-exclude` so configured excludes are still respected.

## Existing Configuration

Inspect existing `typos` configuration before creating or changing one. Check the repository root and relevant subdirectories for `.typos.toml`, `_typos.toml`, `typos.toml`, `Cargo.toml` package/workspace metadata, `pyproject.toml` under `[tool.typos]`, or tool-specific configuration already used by the project.

Preserve existing project intent where possible. Extend the current config instead of replacing it unless it is clearly broken or the user asks for a rewrite.

## Workflow

1. Inspect the repository structure and existing typo configuration.
2. Create or refine the existing `typos` configuration, keeping hidden files included and non-source files excluded.
3. Run `typos`, using the repository's normal tool environment. If the binary is not directly available, check mise-managed shims before concluding it is missing.
4. Group findings by risk:
   - obvious typo in prose, comments, docs, UI text, or test names
   - code identifier, public API, database field, config key, array key, enum case, or serialized name
   - test fixture, snapshot, generated output, vendored/copied source, or external tool name
   - proper name, product name, place name, non-English text, quote, title, or human-language phrase
   - hash-like, encoded, token-like, or opaque string
5. Read nearby context before changing each non-obvious finding. Around 20 lines is a useful default when the file is line-oriented.
6. Fix only findings that are both technically safe and semantically clear.
7. Add narrow false-positive rules for intentional findings.
8. Re-run `typos` and report any remaining findings, intentional ignores, or risks that were not changed.

When a finding appears many times, sample enough occurrences to understand whether it is one repeated typo, an intentional project term, or several different cases that need different treatment.

## False Positive Placement

Place intentional false positives in the narrowest suitable `typos` setting.

Use this fallback order:

1. Use `extend-ignore-re` for proper names, human-language text, non-English text, phrases, titles, product names, place names, quoted text, UI copy, assertions, and anything that is not meaningfully a program identifier.

   If the word or phrase is distinctive, match the exact intended text with boundaries where appropriate. If the word is generic or could hide real typos elsewhere, include a small amount of surrounding context. The regexp must match only the intended word or phrase, not broad substrings.

2. Use `extend-identifiers` for variable names, function names, class names, constants, methods, array keys, enum cases, database columns, config keys, serialized fields, and other code-facing identifiers.

   Prefer file-type-specific configuration when the identifier only occurs in that language or file kind. Use `default.extend-identifiers` only when the identifier is genuinely cross-language or appears broadly.

3. Use `extend-words` only for words that appear in many places and are intentionally accepted as ordinary words.

   Entries in `extend-words` must be lowercase. Do not put proper names, identifiers, casing corrections, or context-sensitive terms here merely because it is convenient.

For regex-based identifier or word classes, use `extend-ignore-identifiers-re` or `extend-ignore-words-re` only when a pattern is genuinely safer than enumerating exact values. Keep these patterns narrow and documented.

`extend-words` and `extend-identifiers` can also define custom typo corrections by mapping the misspelling to the intended correction. Do not confuse custom corrections with false-positive allowlists. When a correction entry causes the config file itself to be flagged, use a narrow line-level ignore directive if the project supports one, or otherwise keep the config self-consistent without broad ignores.

## Fixing Code

Be careful with anything that may be part of a contract:

- public APIs
- backward-compatible field names
- database columns and migrations
- serialized JSON/XML keys
- config keys
- command names and flags
- event names
- translation keys
- fixtures, snapshots, seed data, and test data
- upstream package names, tool names, and protocol terms

Do not rename compatibility-sensitive identifiers just because they look misspelled. First determine whether the spelling is part of an external or historical interface. If it is intentional, protect the precise context with an ignore rule.

When fixing identifiers that are safe to change, update all local references and run the relevant tests or static checks when practical.

## File Names

Rename files only when every local reference can be found and updated together.

Treat these as higher risk:

- changelog fragments
- migration names
- snapshot names
- fixture paths
- route or asset paths
- PR, issue, release, or upstream-derived filenames
- filenames documented for external users

If a filename is tied to external context, decide whether the spelling is truly maintained by this repository before renaming it.

## Hash-Like And Opaque Strings

Do not handle hash-like, encoded, token-like, key-material, or opaque strings with broad word ignores.

When an intentional false positive occurs inside such a string, prefer a narrow `extend-ignore-re` rule that includes format and length constraints, or exclude the generated/source-of-truth file if appropriate. Avoid ignoring a short substring that might hide real typos elsewhere.

## Reporting

When finishing, summarize:

- config changes made
- real typos fixed
- false positives intentionally ignored and why
- files or findings left unchanged because they were risky, external, generated, or ambiguous
- verification command run and its result

If `typos` is unavailable, say that explicitly and leave the config and intended verification command clear.

## Typos Documentation

If unsure about `typos` configuration syntax, file-type-specific tables, available commands, or regexp behavior, check the local or official `typos` documentation before editing configuration. Do not invent config keys.
