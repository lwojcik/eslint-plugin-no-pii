import { createHash } from "node:crypto";
import { createPiiRule } from "../internal/create-pii-rule.ts";

// --- Bitcoin legacy (P2PKH `1...`, P2SH `3...`): Base58Check ----------------

const BASE58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const BASE58_ADDRESS =
  /(?<![A-Za-z\d])[13][1-9A-HJ-NP-Za-km-z]{25,34}(?![A-Za-z\d])/g;

const sha256 = (data: Uint8Array) => createHash("sha256").update(data).digest();

function isBase58CheckAddress(address: string): boolean {
  let n = 0n;
  for (const char of address) n = n * 58n + BigInt(BASE58.indexOf(char));
  const hex = n.toString(16);
  const leadingZeros = address.length - address.replace(/^1+/, "").length;
  const bytes = Buffer.concat([
    Buffer.alloc(leadingZeros),
    Buffer.from(hex.length % 2 ? `0${hex}` : hex, "hex"),
  ]);
  if (bytes.length !== 25 || (bytes[0] !== 0x00 && bytes[0] !== 0x05)) {
    return false;
  }
  const checksum = sha256(sha256(bytes.subarray(0, 21))).subarray(0, 4);
  return checksum.equals(bytes.subarray(21));
}

// --- Bitcoin SegWit/Taproot (`bc1...`): Bech32 / Bech32m --------------------

const BECH32_CHARSET = "qpzry9x8gf2tvdw0s3jn54khce6mua7l";
const BECH32_ADDRESS = /(?<![a-z\d])bc1[ac-hj-np-z02-9]{11,87}(?![a-z\d])/gi;
const BECH32_GENERATOR = [
  0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3,
];
const BECH32_CONST = 1;
const BECH32M_CONST = 0x2bc830a3;

function bech32Polymod(values: number[]): number {
  let checksum = 1;
  for (const value of values) {
    const top = checksum >> 25;
    checksum = ((checksum & 0x1ffffff) << 5) ^ value;
    BECH32_GENERATOR.forEach((generator, i) => {
      if ((top >> i) & 1) checksum ^= generator;
    });
  }
  return checksum;
}

function isBech32Address(address: string): boolean {
  // Mixed case is invalid.
  if (address !== address.toLowerCase() && address !== address.toUpperCase()) {
    return false;
  }
  const lower = address.toLowerCase();
  const data = Array.from(lower.slice(3), (char) =>
    BECH32_CHARSET.indexOf(char),
  );
  // HRP "bc" expanded: high bits, 0, low bits.
  const checksum = bech32Polymod([3, 3, 0, 2, 3, ...data]);
  return checksum === BECH32_CONST || checksum === BECH32M_CONST;
}

// --- Ethereum and EVM chains: 0x + 40 hex -----------------------------------
// No checksum is verified (EIP-55 needs Keccak-256, which node:crypto lacks).

const ETHEREUM_ADDRESS = /(?<![\w])0x[\da-f]{40}(?![\w])/gi;

function isEthereumAddress(address: string): boolean {
  // Drop placeholders such as 0x000...000 and 0xfff...fff.
  return !/^0x(.)\1*$/i.test(address);
}

const matches = (value: string, pattern: RegExp) =>
  Array.from(value.matchAll(pattern), (m) => m[0]);

export default createPiiRule({
  description:
    "enforces no crypto wallet addresses in comments or string literals",
  subject: "crypto wallet address",
  detect: (value) =>
    matches(value, BASE58_ADDRESS).some(isBase58CheckAddress) ||
    matches(value, BECH32_ADDRESS).some(isBech32Address) ||
    matches(value, ETHEREUM_ADDRESS).some(isEthereumAddress),
});
