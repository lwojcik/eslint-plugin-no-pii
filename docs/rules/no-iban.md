# pii/no-iban

Disallows IBANs in comments and string literals.

- **Type:** problem
- **Recommended severity:** error
- **Options:** none

## What it detects

A country-specific IBAN (spaces allowed) with the registry length for its country that passes the ISO 7064 mod-97 checksum.

## Incorrect

```js
var iban = "DE89 3704 0044 0532 0130 00";
```

## Correct

```js
var iban = process.env.TEST_IBAN;
var iban = "[REDACTED IBAN]";
```

## How to fix a report

1. Do not hardcode the real value. Load it from an environment variable, secret store or test fixture, or replace it with a redaction token such as `"[REDACTED IBAN]"`.
2. Do **not** try to silence the rule with `// eslint-disable-line` or `// eslint-disable-next-line`: this rule ignores them on purpose. Block `/* eslint-disable */` still applies, but using it defeats the purpose of the rule.
3. If a file legitimately needs these values (for example a validator's own tests), allow-list it in your ESLint config so the exception is visible in review:

```js
{
  files: ["tests/fixtures/**"],
  rules: { "pii/no-iban": "off" },
}
```

## Notes and known limits

Strings with an unknown country code, wrong length or failing checksum are not flagged.
