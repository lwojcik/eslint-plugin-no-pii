# pii/no-credit-card

Disallows credit card numbers in comments and string literals.

- **Type:** problem
- **Recommended severity:** error
- **Options:** none

## What it detects

13–19 digits (spaces or dashes allowed) with a major issuer prefix (Visa, Mastercard, Amex, Discover, Diners, JCB, UnionPay) that pass the Luhn checksum.

## Incorrect

```js
var card = "4111 1111 1111 1111";
// card 5500-0000-0000-0004
```

## Correct

```js
var card = process.env.TEST_CARD;
var card = "[REDACTED credit card number]";
```

## How to fix a report

1. Do not hardcode the real value. Load it from an environment variable, secret store or test fixture, or replace it with a redaction token such as `"[REDACTED credit card number]"`.
2. Do **not** try to silence the rule with `// eslint-disable-line` or `// eslint-disable-next-line`: this rule ignores them on purpose. Block `/* eslint-disable */` still applies, but using it defeats the purpose of the rule.
3. If a file legitimately needs these values (for example a validator's own tests), allow-list it in your ESLint config so the exception is visible in review:

```js
{
  files: ["tests/fixtures/**"],
  rules: { "pii/no-credit-card": "off" },
}
```

## Notes and known limits

Numbers that fail the Luhn check or lack an issuer prefix are not flagged. Payment-provider test cards (e.g. `4242 4242 4242 4242`) are valid card numbers and **are** flagged; load them from fixtures or env.
