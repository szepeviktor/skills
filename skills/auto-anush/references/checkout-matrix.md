# Checkout Mutation Matrix

Use this matrix to avoid skipping state-dependent recalculation paths.

## Baseline Cart

- Add at least two different products.
- Increase quantity on one line item.
- If product options exist, choose at least one non-default option before checkout.
- Save an initial snapshot before changing checkout fields.

## Mutation Order

Change one thing at a time and change it back before moving on unless the test depends on combined state.

### Address And Tax Drivers

- billing country
- billing state or region
- billing postcode
- billing city
- shipping same as billing toggle
- shipping country
- shipping state or region
- shipping postcode
- shipping city

### Customer Type Drivers

- private versus business toggle
- company name empty versus filled
- VAT or tax number empty versus filled

### Fulfillment And Payment Drivers

- shipping method
- payment method

## After Every Mutation

Verify:

- visible product prices
- subtotal
- shipping cost
- VAT or tax
- total
- available shipping methods
- available payment methods
- selected shipping method
- selected payment method
- order submit or place-order control visibility
- order submit or place-order control disabled state

## Wait Rules

- Wait until spinners and overlays disappear.
- Wait until summary rows stop changing.
- Trigger blur after typing in fields that recalculate on blur.
- If totals refresh through XHR or fetch, wait for the refresh to complete before snapshotting.

## Console Triage

Record messages that coincide with recalculation:

- uncaught exceptions
- rejected promises
- failed requests for cart, totals, shipping, payment, or tax endpoints
- third-party payment widget errors
- cookie, storage, CSP, CORS, or mixed-content errors affecting checkout scripts

## Minimal Repro Format

- Cart setup
- Page URL
- Field changed
- Old value
- New value
- Observed summary changes
- Observed method changes
- Console evidence
- Result after changing back
