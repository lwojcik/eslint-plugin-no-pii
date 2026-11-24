# pii/no-dob

Disallows dates of birth in comments and string literals.

- **Type:** problem
- **Recommended severity:** warn
- **Options:** none

## What it detects

A date (`YYYY-MM-DD`, `DD/MM/YYYY`, …) within a few words of `birth`, `birthdate`, `birthday`, `dob` or `born`. Also checks `var dob = "1990-01-01"` style declarations.

## Incorrect

```js
// born on 1990-01-31
var dob = "1990-01-31";
```

## Correct

```js
// born on [REDACTED date of birth]
var dob = loadFixture().dob;
```

## How to fix a report

1. Do not hardcode the real value. Load it from an environment variable, secret store or test fixture, or replace it with a redaction token such as `"[REDACTED date of birth]"`.
2. Do **not** try to silence the rule with `// eslint-disable-line` or `// eslint-disable-next-line`: this rule ignores them on purpose. Block `/* eslint-disable */` still applies, but using it defeats the purpose of the rule.
3. If a file legitimately needs these values (for example a validator's own tests), allow-list it in your ESLint config so the exception is visible in review:

```js
{
  files: ["tests/fixtures/**"],
  rules: { "pii/no-dob": "off" },
}
```

## Notes and known limits

Dates without a birth-related keyword nearby are not flagged. Enabled as `warn` in the `recommended` config.
