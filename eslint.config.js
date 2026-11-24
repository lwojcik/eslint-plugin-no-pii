import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pii from "./src/index.ts";

export default tseslint.config(
  { ignores: ["node_modules/", "dist/"] },
  js.configs.recommended,
  tseslint.configs.recommended,
  { languageOptions: { globals: globals.node } },
  pii.configs.recommended,
  {
    // Rule sources and tests deliberately contain fake PII as examples/fixtures.
    files: ["src/rules/**", "tests/**"],
    rules: Object.fromEntries(
      Object.keys(pii.rules).map((name) => [`pii/${name}`, "off"]),
    ),
  },
);
