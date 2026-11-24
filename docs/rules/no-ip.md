# pii/no-ip

Disallows IP addresses in comments and string literals.

- **Type:** problem
- **Recommended severity:** error
- **Options:** none

## What it detects

IPv4 dotted quads and valid IPv6 addresses (full, compressed, IPv4-mapped, zone ids, bracketed).

## Incorrect

```js
var host = "192.168.1.1";
// peer 2001:db8::1
```

## Correct

```js
var host = process.env.HOST;
var host = "[REDACTED IP address]";
```

## How to fix a report

1. Do not hardcode the real value. Load it from an environment variable, secret store or test fixture, or replace it with a redaction token such as `"[REDACTED IP address]"`.
2. Do **not** try to silence the rule with `// eslint-disable-line` or `// eslint-disable-next-line`: this rule ignores them on purpose. Block `/* eslint-disable */` still applies, but using it defeats the purpose of the rule.
3. If a file legitimately needs these values (for example a validator's own tests), allow-list it in your ESLint config so the exception is visible in review:

```js
{
  files: ["tests/fixtures/**"],
  rules: { "pii/no-ip": "off" },
}
```

## Notes and known limits

Every IPv4 quad is flagged, including documentation ranges such as `192.0.2.1` and `127.0.0.1`. Namespaces (`std::string`), times and MAC addresses are not flagged.
