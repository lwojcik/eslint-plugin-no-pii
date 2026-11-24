# pii/no-email

Disallows email addresses in comments and string literals.

- **Type:** problem
- **Recommended severity:** error
- **Options:** none

## What it detects

Anything shaped like `local@domain.tld`.

## Incorrect

```js
var to = "jane.doe@company.com";
// ask jane.doe@company.com
```

## Correct

```js
var to = process.env.MAIL_TO;
var to = "[REDACTED email address]";
```

## How to fix a report

1. Do not hardcode the real value. Load it from an environment variable, secret store or test fixture, or replace it with a redaction token such as `"[REDACTED email address]"`.
2. Do **not** try to silence the rule with `// eslint-disable-line` or `// eslint-disable-next-line`: this rule ignores them on purpose. Block `/* eslint-disable */` still applies, but using it defeats the purpose of the rule.
3. If a file legitimately needs these values (for example a validator's own tests), allow-list it in your ESLint config so the exception is visible in review:

```js
{
  files: ["tests/fixtures/**"],
  rules: { "pii/no-email": "off" },
}
```

## Notes and known limits

Every email address is flagged, including `@example.com` ones. For tests, build addresses at runtime or load them from fixtures.
