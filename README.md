# eslint-plugin-no-pii

[![npm version](https://img.shields.io/npm/v/eslint-plugin-no-pii)](https://www.npmjs.com/package/eslint-plugin-no-pii)
[![Build status](https://ci.appveyor.com/api/projects/status/github/lwojcik/eslint-plugin-no-pii?branch=main&svg=true)](https://ci.appveyor.com/project/lwojcik/eslint-plugin-no-pii/branch/main)

PII linting rules for ESLint 10.

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
      "pii/no-email": "error",
      "pii/no-dob": "warn",
      "pii/no-iban": "error",
      "pii/no-ip": "error",
      "pii/no-mac-address": "error",
      "pii/no-national-id": "error",
      "pii/no-phone-number": "error",
      "pii/no-ssn": "error",
    },
  },
];
```

## Supported Rules

- `pii/no-credit-card` - enforces no credit/debit card numbers (Luhn-validated) in comments or string literals
- `pii/no-email` - enforces no email in comments or string literals
- `pii/no-dob` - enforces no birth date in comments or string literals
- `pii/no-iban` - enforces no IBAN (length and mod-97 validated) in comments or string literals
- `pii/no-ip` - enforces no IP address in comments or string literals
- `pii/no-mac-address` - enforces no MAC address in comments or string literals
- `pii/no-national-id` - enforces no national ID numbers (Polish PESEL/NIP, UK NINO, Spanish DNI/NIE) in comments or string literals
- `pii/no-phone-number` - enforces no phone numbers in comments or string literals
- `pii/no-ssn` - enforces no US Social Security numbers in comments or string literals
