# pii/no-jwt

Disallows JSON Web Tokens in comments and string literals.

- **Type:** problem
- **Recommended severity:** error
- **Options:** none

## What it detects

Strings of the form `header.payload[.signature]` where the header and payload are base64url-encoded JSON objects and the header has an `alg` field. Tokens with an empty or missing signature are detected too. Matching is structural: random dotted strings that merely start with `eyJ` are not flagged.

## Incorrect

```js
var token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIn0.c2lnbmF0dXJl";
// Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkphbmUgRG9lIn0.c2lnbmF0dXJl
```

## Correct

```js
var token = process.env.API_TOKEN;
var token = "[REDACTED JWT]";
```

## How to fix a report

1. Do not hardcode the real value. Load it from an environment variable, secret store or test fixture, or replace it with a redaction token such as `"[REDACTED JWT]"`. Tokens usually carry claims such as an email address or user ID, so a pasted token leaks personal data even after it expires.
2. Do **not** try to silence the rule with `// eslint-disable-line` or `// eslint-disable-next-line`: this rule ignores them on purpose. Block `/* eslint-disable */` still applies, but using it defeats the purpose of the rule.
3. If a file legitimately needs these values (for example a JWT library's own tests), allow-list it in your ESLint config so the exception is visible in review:

```js
{
  files: ["tests/fixtures/**"],
  rules: { "pii/no-jwt": "off" },
}
```

## Notes and known limits

- The signature is not verified, so expired, forged and example tokens are all flagged.
- Encrypted tokens (JWE, five segments) are not detected.
- Tokens built at runtime from separate pieces are not detected.
