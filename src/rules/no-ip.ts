import { isIPv6 } from "node:net";
import { createPiiRule } from "../internal/create-pii-rule.ts";

// Maximal runs of hex digits, colons and dots (with an optional `%zone`) that
// are not glued to other word characters. This keeps `Foo::bar` and
// `00:1A:2B:3C:4D:5E` from being cut into IPv6-looking pieces.
const IPV6_CANDIDATE =
  /(?<![\w:.])[\da-f:.]*:[\da-f:.]*(?:%[\w.-]+)?(?![\w:.])/gi;

function isIPv6Address(candidate: string): boolean {
  // Needs at least one hex digit, so a bare "::" separator is not an address.
  if (!/[\da-f]/i.test(candidate)) return false;
  // Also try without punctuation that follows an address in prose:
  // "reach 2001:db8::1." or "2001:db8::1: refused".
  const withoutDots = candidate.replace(/\.+$/, "");
  return [
    candidate,
    withoutDots,
    withoutDots.endsWith("::") ? withoutDots : withoutDots.replace(/:$/, ""),
  ].some((value) => isIPv6(value));
}

export default createPiiRule({
  description: "enforces no ip address in comments or string literals",
  subject: "IP address",
  patterns: [/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/],
  detect: (value) =>
    Array.from(value.matchAll(IPV6_CANDIDATE), (m) => m[0]).some(isIPv6Address),
});
