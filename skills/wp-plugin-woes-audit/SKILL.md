---
name: wp-plugin-woes-audit
description: Audit WordPress plugins for intrusive or unnecessary admin behavior, onboarding wizards, advertisements and promotions, remote tracking, feedback prompts, menu clutter, missing changelog access, admin notice root causes, license-validation failure modes, and core/add-on version conflicts. Use when reviewing plugin source code or observed wp-admin behavior, tracing a notice or outbound request to its source, assessing a plugin before installation, or investigating operational and business risks caused by a WordPress plugin.
---

# WordPress Plugin Woes Audit

Audit plugin behavior that creates administrator friction, privacy risk, support burden, upgrade risk, or avoidable dependency on vendor services. Distinguish confirmed defects from subjective inconvenience and normal WordPress behavior.

## Establish Scope and Safety

1. Identify the plugin slug, version, source path, related add-ons, WordPress version, PHP version, and whether the environment is production.
2. Read the applicable `AGENTS.md` and repository instructions before running commands.
3. Inspect read-only first. Do not activate, deactivate, update, install, configure, or modify a plugin during an audit unless the user explicitly requests it.
4. Do not trigger real telemetry, feedback, license, or marketing requests merely to prove that code exists. Inspect request construction or use an authorized isolated environment.
5. Never bypass, forge, disable, or crack license validation. Assess implementation and failure behavior only.
6. Preserve unrelated user changes and sensitive values. Redact license keys, tokens, personal data, and request payload secrets from the report.

If only source code is available, report runtime-dependent conclusions as unverified. If only observed behavior is available, do not claim a source-code root cause until it is traced.

## Gather Evidence

Start with plugin metadata and entry points. Inspect the main plugin file, `readme.txt`, changelog files, dependency declarations, admin classes, settings, REST routes, AJAX handlers, scheduled events, HTTP calls, option and transient usage, and bundled SDKs.

Search narrowly, adapting patterns to the codebase rather than treating keyword matches as findings. Useful targets include:

- hooks such as `admin_init`, `admin_menu`, `admin_notices`, `network_admin_notices`, `all_admin_notices`, and `plugin_action_links_*`;
- menu functions, dashboard widgets, redirects, activation hooks, user meta, options, transients, and dismissal handlers;
- `wp_remote_*`, REST clients, telemetry SDKs, analytics identifiers, feedback endpoints, and scheduled transmissions;
- license endpoints, update checkers, cached license state, grace periods, version constraints, and add-on bootstrap guards.

For runtime inspection, use WP-CLI, browser developer tools, logs, or request interception only when available and authorized. Record the exact action that caused the behavior and whether it reproduces by user role, multisite context, admin screen, or plugin state.

Use this evidence hierarchy:

1. **Observed and traced:** reproduced at runtime and connected to exact code.
2. **Confirmed in source:** execution path and condition are clear, but not reproduced.
3. **Suspected:** a signal exists, but execution or impact depends on missing context.
4. **Not found:** the inspected scope contains no evidence; do not phrase this as proof of absence outside that scope.

## Audit Categories

### Onboarding and Setup Wizards

Check activation redirects, forced multi-step flows, recurring setup banners, account creation, required marketing consent, and wizard assets loaded outside their screens. Determine whether onboarding is optional, capability-gated, dismissible, and suppressed after completion or bulk/network activation.

Do not flag a concise, optional setup path merely because it exists. Flag coercive, repeated, globally loaded, or operationally unnecessary behavior.

### Advertising and Promotions

Inspect cross-promotions, upgrade banners, seasonal campaigns, affiliate links, dashboard widgets, plugin-list row metadata, and notices unrelated to the administrator's current task. Record frequency, placement, target roles, dismissal persistence, remote content, and whether paid users still see promotions.

Separate essential service, security, compatibility, and billing notices from advertising.

### Remote Tracking

Identify every plausible outbound analytics or telemetry path. For each, determine:

- destination and trigger;
- opt-in, opt-out, or automatic behavior;
- payload fields and identifiers;
- user capability and consent checks;
- transmission schedule and retry behavior;
- retention or cleanup of queued data;
- documentation and UI disclosure.

Treat the mere presence of an HTTP client or vendor SDK as a lead, not proof that tracking occurs. Give privacy or compliance conclusions only to the extent supported by evidence; recommend specialist review where law or policy interpretation is required.

### Feedback and Surveys

Inspect deactivation surveys, review requests, NPS prompts, support prompts, and error-reporting dialogs. Determine whether submission is voluntary, whether dismiss/skip works, what data is transmitted, and whether prompts recur or obstruct the requested action.

### Admin Menu and Interface Clutter

Inventory top-level menus, submenus, toolbar nodes, dashboard widgets, settings links, and screens. Evaluate whether each item exposes a distinct recurring workflow, respects capabilities, and appears in an appropriate WordPress location. Treat preference as subjective unless there is measurable duplication, misleading placement, access-control leakage, or avoidable operational friction.

### Changelog Discoverability

Check for a maintained changelog in `readme.txt`, a bundled changelog file, plugin metadata, the Plugins screen, update details, or an official stable link. Verify that the visible changelog corresponds to the audited release when possible. Distinguish a missing changelog from a missing convenient link to an existing changelog.

### Admin Notice Root Cause

Trace a notice to the registering hook and callback, then document:

1. the exact condition that makes it appear;
2. affected screens, roles, sites, and network contexts;
3. capability and nonce checks;
4. dismissal storage and persistence;
5. whether markup is escaped and accessible;
6. whether the notice reappears because state is stale, a remote check fails, or another component registers it.

Account for WordPress core, must-use plugins, themes, drop-ins, and add-ons before assigning ownership. A CSS selector or matching message alone is insufficient attribution.

### License Validation

Map activation, refresh, caching, expiry, grace periods, update entitlement, feature gating, multisite handling, and remote failure behavior. Check whether an unreachable vendor service causes slow admin requests, repeated calls, misleading notices, lost configuration, disabled local functionality, or fatal errors. Check authorization, nonce handling, secret storage, logging, and redaction without exposing keys.

Distinguish license enforcement from implementation defects. Do not recommend defeating contractual controls; recommend resilient caching, clear status, bounded retries, safe degradation, and documented recovery.

### Core and Add-on Version Conflicts

Inventory the base plugin and all related free, Pro, extension, integration, and compatibility-layer versions. Inspect declared requirements and runtime guards for WordPress, PHP, WooCommerce, the base plugin, and add-on APIs. Look for duplicate classes or functions, changed hooks or signatures, load-order assumptions, mismatched database schemas, bundled-library collisions, and unsafe partial updates.

Report the compatible range only when it is declared or demonstrated. Otherwise state the exact tested combination and uncertainty. Do not update components on production merely to test a hypothesis.

## Assess Findings

Assign one impact level:

- **Critical:** likely site outage, unrecoverable corruption, credential exposure, or broad unauthorized data disclosure.
- **High:** substantial privacy, security, revenue, update, or availability risk.
- **Medium:** recurring admin obstruction, misleading state, significant support burden, or fragile compatibility.
- **Low:** limited clutter, inconvenience, or discoverability issue with a practical workaround.
- **Informational:** relevant behavior without a demonstrated defect.

Keep impact separate from confidence. A suspected high-impact path remains suspected until the missing execution evidence is obtained.

Recommend the least invasive remedy. Prefer vendor configuration, documented filters, capability and screen scoping, persistent dismissal, bounded caching, dependency guards, or an upstream report before maintaining a source patch. If the user requests implementation, preserve update compatibility and add focused regression coverage where practical.

## Report Results

Lead with the highest-impact confirmed findings. Use one row per distinct behavior:

| Impact | Confidence | Category | Finding | Evidence | Trigger and scope | Recommendation |
|---|---|---|---|---|---|---|

For evidence, cite file paths and line numbers, hook or callback names, log timestamps, request destinations, or reproducible UI steps. Never report raw secrets.

Then include:

- **Scope and limitations:** inspected versions, paths, environment, related components, and anything not tested.
- **Root-cause chain:** for notices, tracking, licensing, and conflicts, show trigger → callback/component → state or request → visible consequence.
- **Not found:** list important categories checked without evidence, qualified by the inspected scope.
- **Next checks:** include only checks that could materially change a conclusion.

Do not inflate the report with every keyword match. Consolidate multiple code references implementing the same behavior into one finding, and separate vendor design choices from reproducible defects.
