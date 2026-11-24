# pii/no-imei

Disallows IMEI numbers in comments and string literals.

- **Type:** problem
- **Recommended severity:** error
- **Options:** none

## What it detects

15 digits (bare or grouped) that pass the Luhn checksum and start with a known GSMA reporting-body prefix, or any Luhn-valid 15 digits labelled `IMEI`.

## Incorrect

```js
var imei = "490154203237518";
// IMEI: 490154203237518
```

## Correct

```js
var imei = device.imei;
var imei = "[REDACTED IMEI]";
```

## How to fix a report

1. Do not hardcode the real value. Load it from an environment variable, secret store or test fixture, or replace it with a redaction token such as `"[REDACTED IMEI]"`.
2. Do **not** try to silence the rule with `// eslint-disable-line` or `// eslint-disable-next-line`: this rule ignores them on purpose. Block `/* eslint-disable */` still applies, but using it defeats the purpose of the rule.
3. If a file legitimately needs these values (for example a validator's own tests), allow-list it in your ESLint config so the exception is visible in review:

```js
{
  files: ["tests/fixtures/**"],
  rules: { "pii/no-imei": "off" },
}
```

## Notes and known limits

Unlabelled 15-digit numbers need a valid TAC prefix, so most random IDs are not flagged.
