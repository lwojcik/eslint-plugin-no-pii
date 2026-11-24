# pii/no-ssn

Disallows US Social Security numbers in comments and string literals.

- **Type:** problem
- **Recommended severity:** error
- **Options:** none

## What it detects

`AAA-GG-SSSS` (dash or space separated) with valid area (not 000, 666, 9xx), group (not 00) and serial (not 0000).

## Incorrect

```js
var ssn = "123-45-6789";
```

## Correct

```js
var ssn = fixtures.ssn;
var ssn = "[REDACTED social security number]";
```

## How to fix a report

1. Do not hardcode the real value. Load it from an environment variable, secret store or test fixture, or replace it with a redaction token such as `"[REDACTED social security number]"`.
2. Do **not** try to silence the rule with `// eslint-disable-line` or `// eslint-disable-next-line`: this rule ignores them on purpose. Block `/* eslint-disable */` still applies, but using it defeats the purpose of the rule.
3. If a file legitimately needs these values (for example a validator's own tests), allow-list it in your ESLint config so the exception is visible in review:

```js
{
  files: ["tests/fixtures/**"],
  rules: { "pii/no-ssn": "off" },
}
```

## Notes and known limits

Unseparated nine-digit numbers are not flagged; use `no-pii-identifier` to catch those by variable name.
