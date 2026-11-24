import { createPiiRule } from "../internal/create-pii-rule.ts";

const digitsOf = (value: string) => Array.from(value, Number);

const weightedSum = (digits: number[], weights: number[]) =>
  weights.reduce((sum, weight, i) => sum + weight * (digits[i] ?? 0), 0);

// --- Poland: PESEL (11 digits, weighted checksum, encoded birth date) -------

const PESEL = /(?<![\d-])\d{11}(?![\d-])/g;

function isPesel(value: string): boolean {
  const digits = digitsOf(value);
  const month = (digits[2]! * 10 + digits[3]!) % 20;
  const day = digits[4]! * 10 + digits[5]!;
  if (month < 1 || month > 12 || day < 1 || day > 31) return false;
  const check =
    (10 - (weightedSum(digits, [1, 3, 7, 9, 1, 3, 7, 9, 1, 3]) % 10)) % 10;
  return check === digits[10];
}

// --- Poland: NIP (10 digits, mod 11) ----------------------------------------
// Bare 10-digit numbers are too common (e.g. epoch seconds), so require
// dash-separated groups or an explicit NIP / PL prefix.

const NIP_FORMATTED =
  /(?<![\d-])\d{3}(?:-\d{3}-\d{2}-\d{2}|-\d{2}-\d{2}-\d{3})(?![\d-])/g;
const NIP_PREFIXED = /\b(?:NIP|PL)[\s:.-]{0,3}(\d{10})(?!\d)/gi;

function isNip(value: string): boolean {
  const digits = digitsOf(value);
  const check = weightedSum(digits, [6, 5, 7, 2, 3, 4, 5, 6, 7]) % 11;
  return check !== 10 && check === digits[9];
}

// --- UK: National Insurance number (format rules only, no checksum) ---------

const NINO =
  /(?<![A-Z0-9])(?!BG|GB|KN|NK|NT|TN|ZZ)[A-CEGHJ-PR-TW-Z][A-CEGHJ-NPR-TW-Z] ?\d{2} ?\d{2} ?\d{2} ?[A-D](?![A-Z0-9])/;

// --- Spain: DNI (8 digits + letter) and NIE (X/Y/Z + 7 digits + letter) -----

const DNI_NIE = /(?<![A-Z\d])([XYZ]\d{7}|\d{8})[ -]?([A-Z])(?![A-Z\d])/gi;
const DNI_LETTERS = "TRWAGMYFPDXBNJZSQVHLCKE";

function isDniNie(body: string, letter: string): boolean {
  const number = Number(
    body.replace(/^[XYZ]/i, (c) => "XYZ".indexOf(c.toUpperCase()).toString()),
  );
  return DNI_LETTERS[number % 23] === letter.toUpperCase();
}

function detect(value: string): boolean {
  return (
    Array.from(value.matchAll(PESEL), (m) => m[0]).some(isPesel) ||
    Array.from(value.matchAll(NIP_FORMATTED), (m) =>
      m[0].replace(/-/g, ""),
    ).some(isNip) ||
    Array.from(value.matchAll(NIP_PREFIXED), (m) => m[1]!).some(isNip) ||
    NINO.test(value) ||
    Array.from(value.matchAll(DNI_NIE)).some((m) => isDniNie(m[1]!, m[2]!))
  );
}

export default createPiiRule({
  description: "enforces no national ID numbers in comments or string literals",
  subject: "national ID number",
  detect,
});
