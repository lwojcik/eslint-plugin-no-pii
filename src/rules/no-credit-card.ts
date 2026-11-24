import { createPiiRule } from "../internal/create-pii-rule.ts";
import { luhn } from "../internal/luhn.ts";

// 13-19 digits, optionally separated by single spaces or dashes.
const CANDIDATE = /(?<![\d-])\d(?:[ -]?\d){12,18}(?![\d-])/g;

// Major issuer prefixes: Visa, Mastercard, Amex, Discover, Diners, JCB, UnionPay.
const ISSUER =
  /^(?:4|5[1-5]|2(?:2[2-9]|[3-6]\d|7[01]|720)|3[47]|6011|65|64[4-9]|30[0-5]|36|38|35(?:2[89]|[3-8]\d)|62)/;

export default createPiiRule({
  description: "enforces no credit card numbers in comments or string literals",
  subject: "credit card number",
  detect: (value) =>
    Array.from(value.matchAll(CANDIDATE), (m) =>
      m[0].replace(/[ -]/g, ""),
    ).some((digits) => ISSUER.test(digits) && luhn(digits)),
});
