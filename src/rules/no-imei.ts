import { createPiiRule } from "../internal/create-pii-rule.ts";
import { luhn } from "../internal/luhn.ts";

// 15 digits, bare or grouped as AA-BBBBBB-CCCCCC-D / BBBBBB-AA-CCCCCC-D.
const CANDIDATE =
  /(?<![\d-])(?:\d{15}|\d{2}[- ]\d{6}[- ]\d{6}[- ]\d|\d{6}[- ]\d{2}[- ]\d{6}[- ]\d)(?![\d-])/g;
// Explicitly labelled: `IMEI: 490154203237518`.
const LABELLED = /\bIMEI\b[\s:#=-]{0,3}(\d{15})(?!\d)/gi;

// GSMA Reporting Body Identifiers: the first two digits of the TAC.
const REPORTING_BODY =
  /^(?:00|01|10|30|33|35|44|45|49|50|51|52|53|54|86|91|98|99)/;

export default createPiiRule({
  description: "enforces no IMEI in comments or string literals",
  subject: "IMEI",
  detect: (value) =>
    // Unlabelled 15-digit numbers are common, so also require a known TAC prefix.
    Array.from(value.matchAll(CANDIDATE), (m) =>
      m[0].replace(/[- ]/g, ""),
    ).some((digits) => REPORTING_BODY.test(digits) && luhn(digits)) ||
    Array.from(value.matchAll(LABELLED), (m) => m[1]!).some(luhn),
});
