# pii/no-phone-number

Disallows phone numbers in comments and string literals.

- **Type:** problem
- **Recommended severity:** error
- **Options:** none

## What it detects

Patterns for French, German, UK and US phone number formats.

## Incorrect

```js
var phone = "(555) 123-4567";
// call 0207 946 0958
```

## Correct

```js
var phone = process.env.SUPPORT_PHONE;
var phone = "[REDACTED phone number]";
```

## How to fix a report

1. Do not hardcode the real value. Load it from an environment variable, secret store or test fixture, or replace it with a redaction token such as `"[REDACTED phone number]"`.
2. Do **not** try to silence the rule with `// eslint-disable-line` or `// eslint-disable-next-line`: this rule ignores them on purpose. Block `/* eslint-disable */` still applies, but using it defeats the purpose of the rule.
3. If a file legitimately needs these values (for example a validator's own tests), allow-list it in your ESLint config so the exception is visible in review:

```js
{
  files: ["tests/fixtures/**"],
  rules: { "pii/no-phone-number": "off" },
}
```

## Notes and known limits

The patterns are broad (they also tolerate OCR-style letter/digit swaps), so long numeric or alphanumeric IDs can occasionally match. Prefer restructuring or an allow-listed override for those files.
