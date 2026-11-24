# pii/no-mac-address

Disallows MAC addresses in comments and string literals.

- **Type:** problem
- **Recommended severity:** error
- **Options:** none

## What it detects

`AA:BB:CC:DD:EE:FF`, `AA-BB-CC-DD-EE-FF` and Cisco `AABB.CCDD.EEFF` notations, not embedded in longer hex runs (IPv6, EUI-64).

## Incorrect

```js
var mac = "00:1A:2B:3C:4D:5E";
```

## Correct

```js
var mac = device.mac;
var mac = "[REDACTED MAC address]";
```

## How to fix a report

1. Do not hardcode the real value. Load it from an environment variable, secret store or test fixture, or replace it with a redaction token such as `"[REDACTED MAC address]"`.
2. Do **not** try to silence the rule with `// eslint-disable-line` or `// eslint-disable-next-line`: this rule ignores them on purpose. Block `/* eslint-disable */` still applies, but using it defeats the purpose of the rule.
3. If a file legitimately needs these values (for example a validator's own tests), allow-list it in your ESLint config so the exception is visible in review:

```js
{
  files: ["tests/fixtures/**"],
  rules: { "pii/no-mac-address": "off" },
}
```

## Notes and known limits

Mixed separators are not flagged.
