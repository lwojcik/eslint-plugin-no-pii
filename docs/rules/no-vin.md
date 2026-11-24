# pii/no-vin

Disallows vehicle identification numbers in comments and string literals.

- **Type:** problem
- **Recommended severity:** error
- **Options:** none

## What it detects

17-character VINs (no I, O, Q) that mix letters and digits and have a valid check digit, or any well-formed 17-character VIN labelled `VIN`.

## Incorrect

```js
var vin = "1HGCM82633A004352";
// VIN: WVWZZZ1JZXW000001
```

## Correct

```js
var vin = vehicle.vin;
var vin = "[REDACTED VIN]";
```

## How to fix a report

1. Do not hardcode the real value. Load it from an environment variable, secret store or test fixture, or replace it with a redaction token such as `"[REDACTED VIN]"`.
2. Do **not** try to silence the rule with `// eslint-disable-line` or `// eslint-disable-next-line`: this rule ignores them on purpose. Block `/* eslint-disable */` still applies, but using it defeats the purpose of the rule.
3. If a file legitimately needs these values (for example a validator's own tests), allow-list it in your ESLint config so the exception is visible in review:

```js
{
  files: ["tests/fixtures/**"],
  rules: { "pii/no-vin": "off" },
}
```

## Notes and known limits

European VINs are not required to have a valid check digit, so unlabelled ones with a bad check digit are not flagged.
