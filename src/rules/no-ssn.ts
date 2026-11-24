import { createPiiRule } from "../internal/create-pii-rule.ts";

export default createPiiRule({
  description:
    "enforces no US Social Security numbers in comments or string literals",
  subject: "social security number",
  patterns: [
    // AAA-GG-SSSS (or space separated); area can't be 000, 666 or 9xx,
    // group can't be 00, serial can't be 0000.
    /(?<![\d-])(?!000|666|9\d\d)\d{3}([- ])(?!00)\d{2}\1(?!0000)\d{4}(?![\d-])/,
  ],
});
