# pii/no-url-credentials

Disallows credentials embedded in URLs or connection strings in comments and string literals (and template literal text).

- **Type:** problem
- **Recommended severity:** error
- **Options:** none

## What it detects

`scheme://user:password@…` in comments, string literals and the static parts of template literals. Obvious placeholders (`${…}`, `<password>`, `xxxx`, `changeme`, `secret`, …) are allowed.

## Incorrect

```js
var db = "postgres://admin:hunter2@db.internal/app";
```

## Correct

```js
var db = `postgres://${user}:${password}@db.internal/app`;
var db = process.env.DATABASE_URL;
```

## How to fix a report

1. Do not hardcode the real value. Load it from an environment variable, secret store or test fixture, or interpolate it, e.g. `postgres://${user}:${password}@host/db`.
2. Do **not** try to silence the rule with `// eslint-disable-line` or `// eslint-disable-next-line`: this rule ignores them on purpose. Block `/* eslint-disable */` still applies, but using it defeats the purpose of the rule.
3. If a file legitimately needs these values (for example a validator's own tests), allow-list it in your ESLint config so the exception is visible in review:

```js
{
  files: ["tests/fixtures/**"],
  rules: { "pii/no-url-credentials": "off" },
}
```

## Notes and known limits

URLs without a password (`https://user@host`) are not flagged.
