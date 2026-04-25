---
name: business-owner-review
description: Use when reviewing a web app, SaaS, ecommerce site, client portal, admin panel, internal tool, or business application from the business owner/client perspective. Focus on business risks, revenue leakage, unclear customer-facing text, pricing, conversion, trust, operational friction, support burden, compliance exposure, and harmful product decisions. Do not produce a programmer-focused code review unless explicitly asked.
---

# Business Owner Review

Review the application as a business advisor, not as a programmer.

The goal is to identify business problems that could reduce revenue, confuse customers, increase support work, damage trust, create legal or compliance risk, or make daily operations inefficient.

## Review Mindset

Focus on what a business owner, product owner, manager, or client should care about:

- Can customers understand what they are buying or doing?
- Can the business reliably charge the right amount?
- Are prices, taxes, discounts, deadlines, renewals, and consequences clear?
- Does the application guide users toward profitable and sensible choices?
- Are there places where customers may abandon, complain, misunderstand, or need support?
- Does the admin or operator side support daily business work?
- Are visible screens, texts, statuses, or workflows creating business risk?

Avoid programmer language unless the user explicitly asks for implementation detail. Do not lead with classes, files, database fields, framework names, or technical root causes.

## What To Inspect

Prioritize visible and business-facing surfaces:

- Public pages, landing pages, pricing pages, product pages
- Signup, checkout, payment, renewal, cancellation, refund flows
- Customer dashboards, account pages, status screens, and self-service flows
- Emails, notifications, invoices, receipts, alerts, and reminders
- Admin panels used by staff or operators
- Error messages, empty states, confirmation messages, and warnings
- Terms shown during purchase or account management
- Product names, plan names, descriptions, labels, button text, and status names
- Business rules implied by the UI or workflow

If source code is available, use it only to understand business behavior. Translate findings into business language.

## Review Categories

### Revenue And Pricing

Look for:

- unclear, missing, hidden, or inconsistent pricing
- wrong or unclear tax/VAT handling
- discounts that are too broad, stack unexpectedly, or create unprofitable orders
- free trials without clear conversion, expiration, or billing rules
- renewal prices not shown clearly before commitment
- missing upsells, cross-sells, bundles, or plan upgrade paths
- product ordering or copy that pushes users toward low-margin choices
- cancellation or refund rules that may lose revenue unnecessarily

### Customer Understanding

Look for:

- unclear product or service descriptions
- technical terms non-technical customers may not understand
- vague statuses such as pending, processing, active, suspended, failed, or expired
- missing explanation of what happens next
- missing dates, deadlines, limits, quantities, or consequences
- calls to action that do not match the user intent
- screens where users may not know whether action is required

### Trust And Risk

Look for:

- missing company identity, support contact, legal links, privacy policy, or terms
- payment or account screens that do not build confidence
- unclear refund, cancellation, renewal, delivery, or service availability terms
- sensitive actions without confirmation or a clear consequence
- scary, vague, blameful, or unhelpful error messages
- claims the business may not be able to honor consistently
- wording that creates legal, compliance, or chargeback exposure

### Operations And Support

Look for:

- admin screens that do not show what staff need to act confidently
- missing filters, statuses, ownership, due dates, payment state, or history
- workflows that require manual interpretation or institutional knowledge
- places where staff may make costly mistakes
- missing audit trail or visible history for business-critical actions
- customer-facing ambiguity that will create support tickets

### Retention And Growth

Look for:

- weak onboarding or missing next steps after signup/purchase
- no next-best action after payment or activation
- missing renewal, expiry, payment failure, or reactivation reminders
- missing upgrade paths or usage-based expansion prompts
- missing explanation of value after the customer has paid
- cancellation flows that do not learn from or try to recover the customer

### Language And Tone

Review the actual visible wording. Flag text that is:

- too technical for the target customer
- legally or commercially vague
- mistranslated or inconsistent across screens
- too generic to build trust
- unclear about money, deadlines, responsibilities, or consequences
- likely to increase customer anxiety or support requests

If the application is in Hungarian, prefer plain business Hungarian over literal English translations. Explain wording risks in Hungarian when responding to a Hungarian user.

## Severity

Use business severity, not technical severity:

- **High:** likely direct revenue loss, payment or renewal risk, legal/compliance exposure, serious customer confusion, trust damage, or high support burden.
- **Medium:** harms conversion, weakens customer confidence, creates avoidable support work, or makes operations slower.
- **Low:** polish issue, wording improvement, minor friction, or missed optimization.

## Output Format

Lead with findings. Keep the language suitable for a client or business owner.

For each finding, include:

- **Issue:** short business-readable title
- **Where:** screen, flow, text, email, or business process
- **Why It Matters:** business impact
- **Recommendation:** decision or product change
- **Severity:** High / Medium / Low

Do not include implementation instructions unless the user asks for them.

## Good Finding Example

**Issue:** Renewal price is not shown before payment  
**Where:** Customer portal -> Domain renewal flow  
**Why It Matters:** Customers may feel surprised by the charge, which can increase refunds, disputes, and support tickets.  
**Recommendation:** Show the renewal price, tax, renewal period, expiration date, and final charge before the customer confirms payment.  
**Severity:** High

## Bad Finding Example

Avoid this style:

> The `DomainRenewalController` should validate the amount before creating a transaction.

Translate it into business language:

> The renewal flow may present or charge the wrong amount unless the final payable amount is clearly confirmed before payment.

## Final Summary

End with a concise business summary:

- top business risks
- fastest improvements
- decisions the business owner should make
- optional opportunities for revenue, retention, trust, or operational efficiency
