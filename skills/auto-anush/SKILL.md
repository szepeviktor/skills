---
name: auto-anush
description: Universal ecommerce checkout checker for discovering state-dependent checkout defects with Chrome MCP and JavaScript. Use when Codex needs to audit a store's cart or checkout flow, add a few products, inspect critical browser console errors, toggle checkout form fields back and forth, and verify whether product prices, subtotals, shipping cost, VAT, total, payment methods, or shipping methods change incorrectly based on billing address, shipping address, customer type, company or VAT data, shipping method, or payment type.
---

# Auto Anush

Audit checkout behavior through the browser, not by reading server code first.

Use Chrome MCP for navigation, interaction, network timing, and browser-console inspection. Use the bundled JavaScript helpers to snapshot visible checkout state and diff it after each field change.

## Workflow

1. Open the storefront in Chrome MCP and confirm the session starts clean enough to observe checkout behavior.
2. Add a few products to the cart. Prefer at least two distinct products and a quantity change on one line item so recalculation paths execute.
3. Capture a baseline cart or checkout snapshot with `scripts/checkout_snapshot.js`.
4. Open the checkout page and list the variables the store exposes:
- billing country, state, postcode, city, address
- shipping same as billing toggle
- shipping country, state, postcode, city, address
- private versus business customer
- company name, VAT ID, tax number
- shipping method
- payment method
5. Change one variable at a time, then change it back. After each change, wait for recalculation to settle and capture another snapshot.
6. Diff snapshots with `scripts/checkout_diff.js` or compare them manually when the DOM is unusual.
7. Review critical browser-console messages after baseline load and after each recalculation-heavy interaction.
8. Report only reproducible problems with exact triggers, before and after values, and whether reverting the field restores the original state.

## What To Compare

Always compare the same set of outputs after every mutation:

- product line prices
- line-item quantities when the UI silently rewrites them
- subtotal
- shipping cost
- VAT or tax
- grand total
- available shipping methods
- available payment methods
- selected shipping method
- selected payment method
- order submit or place-order control visibility
- order submit or place-order control disabled state

Treat any unexpected addition, removal, relabeling, disablement, or price drift as suspicious until disproven.

## Recalculation Discipline

Avoid false positives caused by racing the UI.

- Wait for loading indicators, disabled submit buttons, and spinner overlays to clear.
- Wait for totals to stop changing before taking the next snapshot.
- If the store performs AJAX updates on blur, trigger blur explicitly after typing.
- If a change opens new required fields, fill them with plausible values before concluding the flow is broken.
- If the store debounces postcode or VAT validation, pause and confirm the final visible state.

## Console Review

Prioritize console messages that can block or corrupt checkout behavior:

- uncaught exceptions
- failed network requests tied to cart, totals, payment, shipping, tax, or validation
- payment SDK initialization failures
- CSP, CORS, mixed-content, or cookie errors that break embedded checkout logic
- repeated warnings emitted exactly when totals or methods refresh

Ignore unrelated noise only when it clearly does not affect checkout.

## JavaScript Helpers

Read `scripts/checkout_snapshot.js` before using it. Inject or evaluate it in the page context, then call `captureCheckoutState()`.

- The helper gathers visible line items, summary rows, detected totals, shipping methods, payment methods, and relevant form fields.
- The helper is heuristic by design. If the store uses unusual markup, adapt selector arrays instead of rewriting the whole workflow.
- The helper preserves raw labels and raw text so you can verify classification mistakes quickly.

Use `scripts/checkout_diff.js` when you save snapshots locally as JSON and want a quick change summary.

## Reporting

For each issue, include:

- exact page URL and checkout step
- products placed in cart
- field mutation that triggers the problem
- before and after values for price-related fields or available methods
- order submit or place-order control state before and after the mutation
- critical console messages that appear at the same time
- whether toggling the field back restores the original state

Read `references/checkout-matrix.md` when you need a ready-made mutation matrix and reporting checklist.
