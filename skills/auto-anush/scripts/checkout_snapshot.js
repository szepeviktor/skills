function captureCheckoutState() {
  const moneyPattern = /(?:[-+])?(?:[$€£¥₹]|USD|EUR|GBP|AUD|CAD|CHF|SEK|NOK|DKK|PLN|CZK|HUF|RON)?\s*\d[\d\s.,]*/i;
  const hiddenTypes = new Set(["hidden", "password", "submit", "button", "image", "file"]);
  const summarySelectors = [
    ".shop_table",
    ".order-review",
    ".woocommerce-checkout-review-order-table",
    ".cart_totals",
    ".totals",
    ".order-summary",
    "[data-order-summary]",
    "[class*='summary']",
    "[class*='totals']"
  ];
  const lineItemSelectors = [
    ".cart_item",
    ".order_item",
    "[data-cart-item]",
    "[data-product-id]",
    "tbody tr",
    "li"
  ];
  const methodGroupHints = {
    shipping: ["shipping", "delivery", "carrier", "pickup"],
    payment: ["payment", "pay", "card", "bank", "cash", "invoice"]
  };

  function text(node) {
    return (node && node.textContent ? node.textContent : "").replace(/\s+/g, " ").trim();
  }

  function visible(node) {
    if (!node || !(node instanceof Element)) {
      return false;
    }
    const style = window.getComputedStyle(node);
    if (style.display === "none" || style.visibility === "hidden") {
      return false;
    }
    const rect = node.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0;
  }

  function uniqueBy(items, keyFn) {
    const seen = new Set();
    return items.filter((item) => {
      const key = keyFn(item);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }

  function cleanLabel(value) {
    return String(value || "").replace(/\s+/g, " ").replace(/[:*]+$/g, "").trim();
  }

  function extractAmounts(value) {
    return String(value || "").match(new RegExp(moneyPattern, "g")) || [];
  }

  function nearestLabel(control) {
    const byFor = control.id
      ? document.querySelector(`label[for="${CSS.escape(control.id)}"]`)
      : null;
    if (byFor && visible(byFor)) {
      return cleanLabel(text(byFor));
    }

    const wrappingLabel = control.closest("label");
    if (wrappingLabel && visible(wrappingLabel)) {
      return cleanLabel(text(wrappingLabel));
    }

    const row = control.closest("p, div, td, th, li, fieldset");
    if (row) {
      const explicit = row.querySelector("label, legend, .label, .form-label");
      if (explicit && visible(explicit)) {
        return cleanLabel(text(explicit));
      }
      return cleanLabel(text(row).slice(0, 160));
    }

    return cleanLabel(control.name || control.id || control.placeholder || control.type);
  }

  function classifyTotal(label) {
    const normalized = label.toLowerCase();
    if (/(subtotal|sub total)/.test(normalized)) {
      return "subtotal";
    }
    if (/(shipping|delivery)/.test(normalized)) {
      return "shipping";
    }
    if (/(vat|tax|sales tax|iva|mwst)/.test(normalized)) {
      return "vat";
    }
    if (/(grand total|order total|\btotal\b)/.test(normalized)) {
      return "total";
    }
    return null;
  }

  function summaryRows() {
    const containers = uniqueBy(
      summarySelectors
        .flatMap((selector) => Array.from(document.querySelectorAll(selector)))
        .filter(visible),
      (node) => node
    );

    const rows = [];

    containers.forEach((container) => {
      const candidates = Array.from(container.querySelectorAll("tr, li, p, div"))
        .filter(visible)
        .filter((node) => text(node).length > 0)
        .slice(0, 250);

      candidates.forEach((node) => {
        const raw = text(node);
        const amounts = extractAmounts(raw);
        if (!amounts.length) {
          return;
        }

        const labelNode = node.querySelector("th, dt, strong, .label, .name, .title");
        const amountNode = node.querySelector("td, dd, .amount, .price, .value, strong");
        const label = cleanLabel(text(labelNode) || raw.replace(amounts.join(" "), " "));
        const amount = cleanLabel(text(amountNode) || amounts[amounts.length - 1]);

        rows.push({
          label,
          amount,
          amounts,
          kind: classifyTotal(label),
          rawText: raw
        });
      });
    });

    return uniqueBy(rows, (row) => `${row.label}|${row.amount}|${row.rawText}`);
  }

  function lineItems() {
    const rows = [];

    lineItemSelectors.forEach((selector) => {
      Array.from(document.querySelectorAll(selector))
        .filter(visible)
        .slice(0, 250)
        .forEach((node) => {
          const raw = text(node);
          const amounts = extractAmounts(raw);
          if (!amounts.length) {
            return;
          }

          const nameNode = node.querySelector(
            ".product-name, .name, .product-title, a, strong, h3, h4"
          );
          const qtyNode = node.querySelector("input.qty, .qty, [class*='quantity']");
          const priceNode = node.querySelector(
            ".product-price, .price, .amount, .product-total, [class*='total']"
          );

          rows.push({
            name: cleanLabel(text(nameNode) || raw.slice(0, 120)),
            quantity: cleanLabel(text(qtyNode) || (qtyNode && qtyNode.value) || ""),
            amount: cleanLabel(text(priceNode) || amounts[amounts.length - 1]),
            amounts,
            rawText: raw
          });
        });
    });

    return uniqueBy(rows, (row) => `${row.name}|${row.quantity}|${row.amount}`);
  }

  function methodOptions(kind) {
    const hints = methodGroupHints[kind];

    const controls = Array.from(
      document.querySelectorAll("input[type='radio'], input[type='checkbox'], select")
    )
      .filter((control) => visible(control) || visible(control.closest("label")) || visible(control.parentElement))
      .filter((control) => {
        const scope = text(control.closest("fieldset, section, form, ul, div") || control);
        const label = nearestLabel(control);
        return hints.some((hint) => scope.toLowerCase().includes(hint) || label.toLowerCase().includes(hint));
      });

    const options = [];

    controls.forEach((control) => {
      if (control.tagName === "SELECT") {
        Array.from(control.options).forEach((option) => {
          if (!option.value) {
            return;
          }
          options.push({
            label: cleanLabel(text(option)),
            value: option.value,
            enabled: !option.disabled && !control.disabled,
            selected: option.selected,
            source: control.name || control.id || kind
          });
        });
        return;
      }

      options.push({
        label: nearestLabel(control),
        value: control.value || control.id || control.name || "",
        enabled: !control.disabled,
        selected: Boolean(control.checked),
        source: control.name || control.id || kind
      });
    });

    return uniqueBy(options, (option) => `${option.source}|${option.value}|${option.label}`);
  }

  function formFields() {
    const fields = Array.from(
      document.querySelectorAll("input, select, textarea")
    )
      .filter((control) => !hiddenTypes.has((control.type || "").toLowerCase()))
      .filter((control) => visible(control) || visible(control.closest("label")) || visible(control.parentElement))
      .slice(0, 300)
      .map((control) => ({
        label: nearestLabel(control),
        name: control.name || "",
        id: control.id || "",
        type: (control.type || control.tagName || "").toLowerCase(),
        value: control.type === "checkbox" || control.type === "radio"
          ? String(Boolean(control.checked))
          : String(control.value || ""),
        enabled: !control.disabled,
        required: Boolean(control.required),
        placeholder: control.placeholder || ""
      }));

    return uniqueBy(fields, (field) => `${field.name}|${field.id}|${field.label}|${field.type}`);
  }

  function submitState() {
    const candidates = Array.from(
      document.querySelectorAll(
        "button, input[type='submit'], a[role='button'], .button, [data-testid*='place-order']"
      )
    )
      .filter((node) => node instanceof Element)
      .map((node) => {
        const label = cleanLabel(text(node) || node.value || node.getAttribute("aria-label") || "");
        return {
          node,
          label
        };
      })
      .filter(({ node, label }) => {
        const normalized = label.toLowerCase();
        return /(place order|submit order|complete order|proceed|next step|continue to payment|continue)/.test(normalized)
          || /(checkout|place-order|submit-order)/.test(
            [node.id, node.name, node.className].filter(Boolean).join(" ").toLowerCase()
          );
      });

    const preferred = candidates.find(({ node, label }) => {
      const normalized = label.toLowerCase();
      return /place order|submit order|complete order/.test(normalized)
        || /place-order|submit-order/.test(
          [node.id, node.name, node.className].filter(Boolean).join(" ").toLowerCase()
        );
    }) || candidates[0];

    if (!preferred) {
      return null;
    }

    const { node, label } = preferred;

    return {
      label,
      visible: visible(node),
      disabled: Boolean(node.disabled || node.getAttribute("aria-disabled") === "true"),
      text: cleanLabel(text(node) || node.value || ""),
      selectorHint: cleanLabel(
        [node.tagName, node.id ? `#${node.id}` : "", node.name ? `[name="${node.name}"]` : ""]
          .filter(Boolean)
          .join("")
      )
    };
  }

  const rows = summaryRows();
  const totals = {};
  rows.forEach((row) => {
    if (row.kind && !totals[row.kind]) {
      totals[row.kind] = row.amount;
    }
  });

  return {
    capturedAt: new Date().toISOString(),
    url: window.location.href,
    title: document.title,
    totals,
    summaryRows: rows,
    lineItems: lineItems(),
    shippingMethods: methodOptions("shipping"),
    paymentMethods: methodOptions("payment"),
    fields: formFields(),
    submit: submitState()
  };
}

if (typeof window !== "undefined") {
  window.captureCheckoutState = captureCheckoutState;
}

if (typeof module !== "undefined") {
  module.exports = { captureCheckoutState };
}
