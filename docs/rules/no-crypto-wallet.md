# pii/no-crypto-wallet

Disallows crypto wallet addresses in comments and string literals.

- **Type:** problem
- **Recommended severity:** error
- **Options:** none

## What it detects

Bitcoin legacy (`1…`/`3…`, Base58Check validated), Bitcoin SegWit/Taproot (`bc1…`, Bech32/Bech32m validated) and Ethereum/EVM (`0x` + 40 hex) addresses.

## Incorrect

```js
var wallet = "0x52908400098527886E0F7030069857D2E4169EE7";
// send to bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq
```

## Correct

```js
var wallet = process.env.WALLET_ADDRESS;
var wallet = "[REDACTED crypto wallet address]";
```

## How to fix a report

1. Do not hardcode the real value. Load it from an environment variable, secret store or test fixture, or replace it with a redaction token such as `"[REDACTED crypto wallet address]"`.
2. Do **not** try to silence the rule with `// eslint-disable-line` or `// eslint-disable-next-line`: this rule ignores them on purpose. Block `/* eslint-disable */` still applies, but using it defeats the purpose of the rule.
3. If a file legitimately needs these values (for example a validator's own tests), allow-list it in your ESLint config so the exception is visible in review:

```js
{
  files: ["tests/fixtures/**"],
  rules: { "pii/no-crypto-wallet": "off" },
}
```

## Notes and known limits

Ethereum addresses are not checksum-verified, but all-same-digit placeholders (`0x000…0`) are ignored.
