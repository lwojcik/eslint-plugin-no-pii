import { createPiiRule } from "../internal/create-pii-rule.ts";

// 17 chars, letters I, O and Q are never used in a VIN.
const VIN_CHARS = "[A-HJ-NPR-Z\\d]{17}";
const CANDIDATE = new RegExp(`(?<![A-Z\\d])${VIN_CHARS}(?![A-Z\\d])`, "g");
// European VINs are not required to have a valid check digit, so also accept
// any well-formed VIN that is explicitly labelled as one.
const LABELLED = new RegExp(
  `\\bVIN\\b[\\s:#=-]{0,3}(?<![A-Z\\d])(${VIN_CHARS})(?![A-Z\\d])`,
  "gi",
);

const WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2];

const TRANSLITERATION: Record<string, number> = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
  F: 6,
  G: 7,
  H: 8,
  J: 1,
  K: 2,
  L: 3,
  M: 4,
  N: 5,
  P: 7,
  R: 9,
  S: 2,
  T: 3,
  U: 4,
  V: 5,
  W: 6,
  X: 7,
  Y: 8,
  Z: 9,
};

/** ISO 3779 / 49 CFR 565 check digit (position 9). */
function hasValidCheckDigit(vin: string): boolean {
  let sum = 0;
  for (let i = 0; i < 17; i++) {
    const char = vin[i]!;
    sum += (TRANSLITERATION[char] ?? Number(char)) * WEIGHTS[i]!;
  }
  const remainder = sum % 11;
  return vin[8] === (remainder === 10 ? "X" : String(remainder));
}

export default createPiiRule({
  description: "enforces no VIN in comments or string literals",
  subject: "VIN",
  detect: (value) =>
    Array.from(value.matchAll(LABELLED)).length > 0 ||
    Array.from(value.matchAll(CANDIDATE), (m) => m[0]).some(
      // Real VINs mix letters and digits; this drops long numeric IDs.
      (vin) => /[A-Z]/.test(vin) && /\d/.test(vin) && hasValidCheckDigit(vin),
    ),
});
