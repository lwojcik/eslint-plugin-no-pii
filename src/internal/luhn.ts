/** Luhn checksum over a string of ASCII digits. */
export function luhn(digits: string): boolean {
  let sum = 0;
  let double = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = digits.charCodeAt(i) - 48;
    if (double) n *= 2;
    sum += n > 9 ? n - 9 : n;
    double = !double;
  }
  return sum % 10 === 0;
}
