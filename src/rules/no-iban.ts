import { createPiiRule } from "../internal/create-pii-rule.ts";

// Total IBAN length per country (ISO 13616 registry).
const IBAN_LENGTHS: Record<string, number> = {
  AD: 24,
  AE: 23,
  AL: 28,
  AT: 20,
  AZ: 28,
  BA: 20,
  BE: 16,
  BG: 22,
  BH: 22,
  BR: 29,
  BY: 28,
  CH: 21,
  CR: 22,
  CY: 28,
  CZ: 24,
  DE: 22,
  DK: 18,
  DO: 28,
  EE: 20,
  EG: 29,
  ES: 24,
  FI: 18,
  FO: 18,
  FR: 27,
  GB: 22,
  GE: 22,
  GI: 23,
  GL: 18,
  GR: 27,
  GT: 28,
  HR: 21,
  HU: 28,
  IE: 22,
  IL: 23,
  IQ: 23,
  IS: 26,
  IT: 27,
  JO: 30,
  KW: 30,
  KZ: 20,
  LB: 28,
  LC: 32,
  LI: 21,
  LT: 20,
  LU: 20,
  LV: 21,
  MC: 27,
  MD: 24,
  ME: 22,
  MK: 19,
  MR: 27,
  MT: 31,
  MU: 30,
  NL: 18,
  NO: 15,
  PK: 24,
  PL: 28,
  PS: 29,
  PT: 25,
  QA: 29,
  RO: 24,
  RS: 22,
  SA: 24,
  SC: 31,
  SE: 24,
  SI: 19,
  SK: 24,
  SM: 27,
  ST: 25,
  SV: 28,
  TL: 23,
  TN: 24,
  TR: 26,
  UA: 29,
  VA: 22,
  VG: 24,
  XK: 20,
};

// Country code + check digits, then up to 30 alphanumerics, optionally
// space-separated (usually in groups of four).
const CANDIDATE = /(?<![A-Z0-9])[A-Z]{2}\d{2}(?: ?[A-Z0-9]){11,30}/g;

/** ISO 7064 mod 97-10: move the first four chars to the end, letters -> 10..35. */
function mod97(iban: string): number {
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  let remainder = 0;
  for (const char of rearranged) {
    const code = char.charCodeAt(0);
    const digits = code >= 65 ? String(code - 55) : char;
    for (const digit of digits) remainder = (remainder * 10 + +digit) % 97;
  }
  return remainder;
}

function isIban(compact: string): boolean {
  const length = IBAN_LENGTHS[compact.slice(0, 2)];
  if (!length || compact.length < length) return false;
  // A greedy candidate may run into trailing uppercase words; trim to length.
  const iban = compact.slice(0, length);
  return mod97(iban) === 1;
}

export default createPiiRule({
  description: "enforces no IBAN in comments or string literals",
  subject: "IBAN",
  detect: (value) =>
    Array.from(value.matchAll(CANDIDATE), (m) => m[0].replace(/ /g, "")).some(
      isIban,
    ),
});
