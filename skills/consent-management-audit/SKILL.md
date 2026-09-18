---
name: consent-management-audit
description: Use when auditing web consent management software, cookie banners, CMP integrations, and tracking consent behavior. Focus on before-consent blocking, accept and revoke flows, service-by-service network/storage evidence, multilingual consent text, modal integrity, and consent-related console or implementation defects.
---

# Consent Management Audit

Audit consent management as observable browser behavior. The goal is to prove whether the consent UI, stored preferences, and third-party services behave consistently before consent, after consent, after revocation, and after page reloads.

Prefer evidence from the browser over assumptions from source code. Inspect the UI, storage, network traffic, and console together so each finding can be reproduced and tied to a specific consent state.

## Minimum Audit Path

Follow this path before expanding into deeper vendor or protocol checks:

- start from a clean profile or explicitly clear the tested origin's cookies, localStorage, sessionStorage, and relevant cacheable consent records
- load the page before any consent choice, then capture visible consent UI, browser storage, network requests, and console messages
- choose reject all or necessary-only when available, then capture storage and network behavior
- reload after reject or necessary-only and confirm whether blocked services remain blocked and non-essential cookies stay absent
- choose accept all or agree from a clean state or after resetting consent, then capture storage and network behavior
- reload after accept and confirm whether the accepted state persists correctly
- reopen preferences or revoke consent when a path is available, then verify storage cleanup and whether new tracking stops
- do a short mobile and in-scope secondary-language check for banner usability, translated consent text, policy links, and obvious behavior differences

For ordinary small or mid-sized ecommerce sites, prioritize observable third-party tracking, consent persistence, reject/accept behavior, language quality, and modal integrity before deep checks such as TCF internals, IndexedDB inventories, or server-side tracking inference.

## Consent State Matrix

Exercise the relevant consent states:

- first visit before any consent choice
- accept all or agree
- reject all, when available
- granular category or service opt-in, when available
- revoke or withdraw consent
- page reload after each important state
- reopening the consent preferences panel after a choice

For each state, record what changed in the UI, cookies or storage, network requests, and third-party script execution.

## Service-By-Service Behavior

Identify the consent-managed services and check them individually. Include analytics, advertising pixels, tag managers, heatmaps, chat widgets, personalization tools, email marketing trackers, embedded media, and any site-specific tracking endpoints.

For each service, verify:

- whether it is blocked before consent
- whether it loads only after the required consent category is granted
- whether revocation stops new tracking activity or prevents further calls
- whether a reload preserves the correct allowed or blocked behavior
- whether the service is mapped to the correct category, such as analytics, marketing, preferences, or necessary

Do not treat the banner as working merely because the visible preference toggle changes. Confirm the underlying scripts, requests, cookies, and storage entries match the selected consent state.

Classify each service cautiously:

- confirmed defect: the service's request, cookie, storage entry, or execution is tied to a consent state where it should be blocked or cleaned up
- suspicious or needs follow-up: a vendor asset loads but its purpose or tracking behavior is not yet proven
- likely necessary or not an issue: the behavior supports essential site functions such as cart, checkout, security, or language routing and no non-essential tracking purpose is evident

## Storage And Browser Artifacts

Inspect browser storage before consent, after consent, after revocation, and after reload:

- cookies
- localStorage
- sessionStorage
- IndexedDB, when the site or vendors use it
- consent records, vendor lists, category settings, and timestamp/version data

Check that non-essential vendor cookies or storage entries are absent before consent where required, created only after the appropriate opt-in, and removed or no longer refreshed after revocation. Note cookie domain, path, expiry, Secure, SameSite, and third-party context issues when they affect consent behavior.

## Network And Console Audit

Use the network panel and console to verify consent enforcement:

- script, iframe, image pixel, XHR/fetch, sendBeacon, and document requests
- request hosts, paths, query parameters, payloads, and response status
- tracking calls that fire before a choice is made
- new calls that continue after revocation
- failed CMP, tag manager, or vendor scripts
- CSP, CORS, mixed-content, cookie, or JavaScript errors related to consent or tracking

Capture enough request detail to identify the vendor and the consent state that triggered the behavior. Avoid claiming a privacy defect from a request alone when the request is clearly necessary or non-tracking; explain the basis for classification.

For every high or medium severity tracking finding, collect request-level evidence:

- host and path
- request type and status
- consent state when it fired
- relevant identifiers or parameters, such as measurement IDs, pixel IDs, client IDs, event names, or page URLs
- related cookies or storage entries created, refreshed, retained, or removed
- why the service appears non-essential or belongs to analytics, marketing, preferences, or another consent-managed category

## UI And Modal Integrity

Review the visible consent experience on desktop and mobile:

- the banner or modal is not visually broken
- buttons, links, toggles, and service details are visible and clickable
- accept, reject, save, and revoke paths are all reachable where required
- the preference panel can be reopened after a choice
- overlays, z-index, scroll locking, and focus behavior do not trap or hide content incorrectly
- text does not overflow, overlap, or become unreadable
- choices are not presented with misleading visual hierarchy or dark-pattern friction

Treat a broken modal as both a UX issue and a consent-risk issue when users cannot make or change a valid choice.

If no clear path to reopen or withdraw consent is visible in the banner, footer, header, privacy or cookie policy area, or a persistent consent control after a reasonable check, record that as a finding instead of spending excessive time searching for hidden JavaScript hooks.

## Language And Consent Content

For multilingual sites, do a focused pass for each supported language that is in scope. A full consent-state matrix is not required for every language unless behavior appears different, but at minimum check:

- banner, modal, buttons, categories, service descriptions, and policy links are translated
- language does not unexpectedly switch inside the consent flow
- privacy policy and cookie policy links resolve and match the selected language when possible
- category names and vendor descriptions are understandable to ordinary users
- legal entity, purpose, duration, and service information are not missing from one language while present in another
- the same accept and reject choices appear to persist and block or allow the same major services

Flag untranslated strings, mixed languages, broken links, and content that prevents users from understanding what they are consenting to.

## Integrations And Consent Signals

When present, verify integration-level consent signals rather than only visible UI:

- Google Consent Mode states
- Google Tag Manager consent checks and triggers
- IAB TCF strings and vendor consent, if the site uses TCF
- Meta, TikTok, Hotjar, Klaviyo, chat, video, map, and other vendor-specific consent hooks
- server-side tracking endpoints receiving or respecting consent state, when observable

Mention when a signal is inferred from browser behavior rather than directly observable.

## Reporting

Lead with reproducible findings. For each issue, include:

- consent state, such as before consent, after accept, after revoke, or after reload
- affected service, vendor, category, or UI component
- evidence from network, cookies/storage, console, or visible UI
- exact reproduction steps
- expected behavior
- actual behavior
- severity based on privacy/compliance risk, user impact, and implementation breakage

Separate confirmed defects from uncertainties and explicitly note suspicious items that need service classification. If a service cannot be confidently classified, say what evidence is missing and what should be checked next. Keep the report focused on defects and material risks rather than exhaustive inventories of every benign first-party asset.
