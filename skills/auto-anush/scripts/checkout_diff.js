#!/usr/bin/env node

const fs = require("fs");

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, "utf8"));
}

function mapByLabel(items) {
  return new Map((items || []).map((item) => [item.label || item.name || item.value, item]));
}

function diffList(beforeItems, afterItems, label) {
  const beforeMap = mapByLabel(beforeItems);
  const afterMap = mapByLabel(afterItems);
  const changes = [];

  for (const [key, before] of beforeMap.entries()) {
    const after = afterMap.get(key);
    if (!after) {
      changes.push(`${label} removed: ${key}`);
      continue;
    }

    if (JSON.stringify(before) !== JSON.stringify(after)) {
      changes.push(`${label} changed: ${key}`);
    }
  }

  for (const [key] of afterMap.entries()) {
    if (!beforeMap.has(key)) {
      changes.push(`${label} added: ${key}`);
    }
  }

  return changes;
}

function diffTotals(before, after) {
  const keys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})]);
  const changes = [];

  for (const key of keys) {
    if ((before || {})[key] !== (after || {})[key]) {
      changes.push(`total ${key}: ${String((before || {})[key] || "")} -> ${String((after || {})[key] || "")}`);
    }
  }

  return changes;
}

function main() {
  const [beforePath, afterPath] = process.argv.slice(2);
  if (!beforePath || !afterPath) {
    console.error("Usage: checkout_diff.js before.json after.json");
    process.exit(1);
  }

  const before = readJson(beforePath);
  const after = readJson(afterPath);

  const changes = [
    ...diffTotals(before.totals, after.totals),
    ...diffList(before.lineItems, after.lineItems, "line item"),
    ...diffList(before.shippingMethods, after.shippingMethods, "shipping method"),
    ...diffList(before.paymentMethods, after.paymentMethods, "payment method")
  ];

  if (!changes.length) {
    console.log("No material changes detected.");
    return;
  }

  changes.forEach((change) => console.log(change));
}

main();
