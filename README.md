# eslint-plugin-no-pii

[![npm version](https://img.shields.io/npm/v/eslint-plugin-no-pii)](https://www.npmjs.com/package/eslint-plugin-no-pii)
[![Build status](https://ci.appveyor.com/api/projects/status/github/lwojcik/eslint-plugin-no-pii?branch=main&svg=true)](https://ci.appveyor.com/project/lwojcik/eslint-plugin-no-pii/branch/main)
[![codecov](https://codecov.io/github/lwojcik/eslint-plugin-no-pii/graph/badge.svg?token=NYSFu7WkF1)](https://codecov.io/github/lwojcik/eslint-plugin-no-pii)

PII (Personally Identifiable Information) linting rules for ESLint 10.

Fork of [shiva-hack/eslint-plugin-pii](https://github.com/shiva-hack/eslint-plugin-pii), modernized and updated for ESLint 10+.

## Installation

```
$ npm install eslint eslint-plugin-no-pii --save-dev
```

## Recommended Usage

```js
// eslint.config.js (ESM, or use dynamic import() from CommonJS)
import pii from "eslint-plugin-no-pii";

export default [pii.configs.recommended];
```

## Custom Usage

```js
// eslint.config.js (ESM, or use dynamic import() from CommonJS)
import pii from "eslint-plugin-no-pii";

export default [
  {
    plugins: { pii },
    rules: {
      "pii/no-credit-card": "error",
      "pii/no-crypto-wallet": "error",
      "pii/no-dob": "warn",
      "pii/no-email": "error",
      "pii/no-iban": "error",
      "pii/no-imei": "error",
      "pii/no-ip": "error",
      "pii/no-jwt": "error",
      "pii/no-mac-address": "error",
      "pii/no-national-id": "error",
      "pii/no-phone-number": "error",
      "pii/no-pii-identifier": "error",
      "pii/no-ssn": "error",
      "pii/no-url-credentials": "error",
      "pii/no-vin": "error",
    },
  },
];
```

## Supported Rules

Each rule has its own page with examples, fix guidance and known limits.

- [`pii/no-credit-card`](docs/rules/no-credit-card.md) - credit/debit card numbers (Luhn-validated)
- [`pii/no-crypto-wallet`](docs/rules/no-crypto-wallet.md) - Bitcoin and Ethereum wallet addresses
- [`pii/no-dob`](docs/rules/no-dob.md) - birth dates
- [`pii/no-email`](docs/rules/no-email.md) - email addresses
- [`pii/no-iban`](docs/rules/no-iban.md) - IBANs (length and mod-97 validated)
- [`pii/no-imei`](docs/rules/no-imei.md) - IMEI numbers (Luhn-validated)
- [`pii/no-ip`](docs/rules/no-ip.md) - IPv4 and IPv6 addresses
- [`pii/no-jwt`](docs/rules/no-jwt.md) - JSON Web Tokens
- [`pii/no-mac-address`](docs/rules/no-mac-address.md) - MAC addresses
- [`pii/no-national-id`](docs/rules/no-national-id.md) - national ID numbers (Polish PESEL/NIP, UK NINO, Spanish DNI/NIE)
- [`pii/no-phone-number`](docs/rules/no-phone-number.md) - phone numbers
- [`pii/no-pii-identifier`](docs/rules/no-pii-identifier.md) - hardcoded values assigned to PII-named identifiers (`ssn`, `password`, …)
- [`pii/no-ssn`](docs/rules/no-ssn.md) - US Social Security numbers
- [`pii/no-url-credentials`](docs/rules/no-url-credentials.md) - credentials embedded in URLs and connection strings
- [`pii/no-vin`](docs/rules/no-vin.md) - vehicle identification numbers

## Fixing reports (for humans and AI agents)

Every message says what was found and how to fix it. In short:

- Don't hardcode the value: load it from env/config/test fixtures, or replace it with a redaction token such as `"[REDACTED email address]"`.
- `// eslint-disable-line` and `// eslint-disable-next-line` do **not** silence the value-based rules. Don't try to suppress them.
- If a file legitimately needs such values, allow-list it in `eslint.config.js` (`{ files: [...], rules: { "pii/no-email": "off" } }`) so the exception shows up in review. For `pii/no-pii-identifier`, use its `ignore` option.
