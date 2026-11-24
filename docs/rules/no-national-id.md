# pii/no-national-id

Disallows national ID numbers in comments and string literals.

- **Type:** problem
- **Recommended severity:** error
- **Options:** none

## What it detects

Polish PESEL (checksum + date) and NIP (checksum; dashed or `NIP`/`PL`-prefixed), UK National Insurance numbers (format rules) and Spanish DNI/NIE (check letter).

## Incorrect

```js
var pesel = "44051401359";
// NIP 526-104-08-28
```

## Correct

```js
var pesel = fixtures.pesel;
var pesel = "[REDACTED national ID number]";
```

## How to fix a report

1. Do not hardcode the real value. Load it from an environment variable, secret store or test fixture, or replace it with a redaction token such as `"[REDACTED national ID number]"`.
2. Do **not** try to silence the rule with `// eslint-disable-line` or `// eslint-disable-next-line`: this rule ignores them on purpose. Block `/* eslint-disable */` still applies, but using it defeats the purpose of the rule.
3. If a file legitimately needs these values (for example a validator's own tests), allow-list it in your ESLint config so the exception is visible in review:

```js
{
  files: ["tests/fixtures/**"],
  rules: { "pii/no-national-id": "off" },
}
```

## Notes and known limits

Bare 10-digit numbers are not treated as NIP because they are too common (e.g. epoch seconds).
