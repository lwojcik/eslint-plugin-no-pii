import type { ESLint } from "eslint";
import { readFileSync } from "node:fs";
import noDob from "./rules/no-dob.ts";
import noEmail from "./rules/no-email.ts";
import noIp from "./rules/no-ip.ts";
import noPhoneNumber from "./rules/no-phone-number.ts";

const pkg = JSON.parse(
  readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);

const plugin: ESLint.Plugin = {
  meta: { name: pkg.name, version: pkg.version },
  rules: {
    "no-dob": noDob,
    "no-email": noEmail,
    "no-ip": noIp,
    "no-phone-number": noPhoneNumber,
  },
};

plugin.configs = {
  recommended: {
    name: "pii/recommended",
    plugins: { pii: plugin },
    rules: {
      "pii/no-email": "error",
      "pii/no-dob": "warn",
      "pii/no-ip": "error",
      "pii/no-phone-number": "error",
    },
  },
};

export default plugin;
