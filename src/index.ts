import type { ESLint } from "eslint";
import { readFileSync } from "node:fs";
import noCreditCard from "./rules/no-credit-card.ts";
import noDob from "./rules/no-dob.ts";
import noEmail from "./rules/no-email.ts";
import noIban from "./rules/no-iban.ts";
import noIp from "./rules/no-ip.ts";
import noUrlCredentials from "./rules/no-url-credentials.ts";
import noVin from "./rules/no-vin.ts";
import noSsn from "./rules/no-ssn.ts";
import noMacAddress from "./rules/no-mac-address.ts";
import noNationalId from "./rules/no-national-id.ts";
import noPiiIdentifier from "./rules/no-pii-identifier.ts";
import noPhoneNumber from "./rules/no-phone-number.ts";

const pkg = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);

const plugin: ESLint.Plugin = {
  meta: { name: pkg.name, version: pkg.version },
  rules: {
    "no-credit-card": noCreditCard,
    "no-dob": noDob,
    "no-email": noEmail,
    "no-iban": noIban,
    "no-ip": noIp,
    "no-mac-address": noMacAddress,
    "no-national-id": noNationalId,
    "no-phone-number": noPhoneNumber,
    "no-pii-identifier": noPiiIdentifier,
    "no-ssn": noSsn,
    "no-url-credentials": noUrlCredentials,
    "no-vin": noVin,
  },
};

plugin.configs = {
  recommended: {
    name: "pii/recommended",
    plugins: { pii: plugin },
    rules: {
      "pii/no-credit-card": "error",
      "pii/no-email": "error",
      "pii/no-dob": "warn",
      "pii/no-iban": "error",
      "pii/no-ip": "error",
      "pii/no-mac-address": "error",
      "pii/no-national-id": "error",
      "pii/no-phone-number": "error",
      "pii/no-pii-identifier": "error",
      "pii/no-ssn": "error",
      "pii/no-url-credentials": "error",
      "pii/no-vin": "error",
    },
  },
};

export default plugin;
