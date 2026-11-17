# eslint-plugin-no-pii

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
      "pii/no-email": "error",
      "pii/no-dob": "warn",
      "pii/no-ip": "error",
      "pii/no-phone-number": "error",
    },
  },
];
```

## Supported Rules

- `pii/no-email` - enforces no email in comments or string literals
- `pii/no-dob` - enforces no birth date in comments or string literals
- `pii/no-ip` - enforces no IP address in comments or string literals
- `pii/no-phone-number` - enforces no phone numbers in comments or string literals
