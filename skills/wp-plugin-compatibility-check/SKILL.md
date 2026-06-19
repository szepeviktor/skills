---
name: wp-plugin-compatibility-check
description: >
  Use when auditing, reviewing, or fixing WordPress plugin compatibility across
  core, PHP, themes, WooCommerce, multilingual plugins, caching plugins,
  builders, payment/shipping extensions, and other active dependencies. Focus
  on version requirements, changelogs, integration breakpoints, template
  overrides, and real interoperability risks.
metadata:
  short-description: Audit WordPress plugin compatibility
---

# WP Plugin Compatibility Check

Use this skill when the task is about whether WordPress plugins, themes, or
WooCommerce-related extensions work safely together across current versions.
Treat WordPress plugin compatibility as an evidence-based audit built from headers, changelogs, docs, and runtime behavior, not as a clean metadata-driven truth.

This skill is for compatibility review and compatibility-driven fixes. It is
not a general plugin architecture skill.

## Purpose

Treat compatibility work as a dependency audit plus a behavior audit.

Check:

- declared minimum versions
- PHP runtime version against each plugin's minimum PHP requirement
- WordPress core version against each plugin's minimum and tested range signals
- tested/current versions in active use
- changelog evidence for recent compatibility fixes
- WooCommerce template overrides in custom themes and child themes
- custom theme and child theme overrides
- known integration breakpoints between active plugins

## How to use this skill

1. Inventory the active stack and the versions that matter.
2. Read vendor changelogs before assuming support.
3. Compare theme overrides and custom integrations against current upstream behavior.
4. Prefer documented compatibility evidence over guesswork.

## PHP version

Always compare the site's actual PHP version with each critical plugin's minimum
PHP requirement.

To determine the web runtime PHP version, create a temporary `pi.php` file in
the document root with:

```php
<?php phpinfo();
```

Request that file over HTTP and read the PHP version from the web response.
Do this because the CLI PHP version may differ from the PHP version used by the
web server.
Delete `pi.php` immediately after collecting the result.

For WordPress plugins, treat the main plugin file header as the primary source
for `Requires PHP`. Do not rely on the readme alone for current requirement
parsing.

If the installed PHP version is below a plugin's minimum, classify that as a
hard compatibility failure before testing higher-level behavior.

## Core version

Always compare the installed WordPress core version with both:

- `Requires at least`
- `Tested up to`

Read the installed WordPress core version from `wp-includes/version.php`.

For WordPress plugins, treat the main plugin file header as the primary source
for `Requires at least`.

Treat the plugin readme as the source for `Tested up to`.

Interpret these fields differently:

- if WordPress core is below `Requires at least`, classify that as a hard compatibility failure
- if WordPress core is above `Tested up to`, classify that as a compatibility risk or unverified state, not an automatic failure

Do not treat `Tested up to` as a maximum supported version. Use changelog
evidence and real behavior checks to decide whether the plugin is likely still
compatible.

## Special add-on headers

Do not stop at the standard WordPress plugin headers. Some plugin ecosystems
also use vendor-specific compatibility headers in the main plugin file.

Check the main plugin file for special add-on headers, especially for:

- Elementor ecosystem plugins
- WooCommerce ecosystem plugins
- Yoast SEO plugins with WooCommerce integrations
- Easy Digital Downloads ecosystem plugins
- WPML ecosystem plugins

Known concrete examples:

- `WC requires at least`
- `WC tested up to`

Treat these ecosystem-specific headers as additional compatibility signals, not
as replacements for the standard WordPress headers.

If a plugin belongs to one of these ecosystems, inspect its main plugin file
directly before assuming compatibility coverage.

Notes:

- WooCommerce and some Yoast SEO integrations expose concrete WooCommerce compatibility headers in the main plugin file.
- Easy Digital Downloads free core does not, by itself, prove a parallel custom compatibility header pattern; inspect the specific add-on before assuming one exists.
- WPML compatibility often has to be verified through WPML's official compatibility documentation and ecosystem guidance, not only through public plugin headers.

## Polylang version chain

Treat Polylang as a chained compatibility check:

- Polylang Pro
- Polylang for WooCommerce
- WooCommerce

For this family, use the `Polylang for WooCommerce` changelog as the primary
compatibility source for the version relationship between Polylang and
WooCommerce.

Check:

- the installed `Polylang for WooCommerce` version
- its minimum required `Polylang` or `Polylang Pro` version
- its minimum required `WooCommerce` version
- any feature-specific notes that require a newer `Polylang Pro` or
  `WooCommerce` release

Do not assume that matching major or minor version numbers across these plugins
means compatibility. Use the add-on changelog entries and requirements instead.

If the site uses Pro-only features, verify `Polylang Pro` separately after the
`Polylang for WooCommerce` check.

## Woo templates in custom themes

Treat WooCommerce template overrides in custom themes and child themes as a
required compatibility audit surface, not as a cosmetic theme detail.

Check:

- overridden templates under the theme or child theme `woocommerce/` directory
- whether any override is marked outdated in WooCommerce Status
- the current upstream template file in the installed WooCommerce version
- whether the theme relies on `woocommerce.php`, which takes priority over
  some more specific template overrides

Prefer hooks over template copies when possible. If templates are overridden,
compare the custom copy against the current WooCommerce template and carry
forward only the intentional customizations.

Do not treat an outdated template warning as noise. Treat it as real
compatibility work that can break product, cart, checkout, account, email, or
archive behavior after WooCommerce updates.

## Changelog source of truth

Keep the changelog URL inventory in
`references/changelog-urls.md`.

Do not inline long plugin-by-plugin URL lists in this `SKILL.md`. The list is
reference data that changes over time and should be easy to extend without
bloated core instructions.

When a compatibility audit involves active plugins:

- read `references/changelog-urls.md`
- use it as the starting list for upstream release notes
- if a plugin is missing from the list, report that gap instead of inventing a local source of truth

If a site adds admin-side helper links with `plugin_row_meta`, treat those as a
useful convenience inside WordPress admin, not as the canonical inventory for
the skill.

## References

- For plugin changelog locations and audit lookups, read `references/changelog-urls.md`.
