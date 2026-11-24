import { createPiiRule } from "../internal/create-pii-rule.ts";

export default createPiiRule({
  description: "enforces no MAC address in comments or string literals",
  subject: "MAC address",
  patterns: [
    // AA:BB:CC:DD:EE:FF or AA-BB-CC-DD-EE-FF (one consistent separator).
    // Lookarounds keep it from matching inside longer hex/colon runs (IPv6, EUI-64).
    /(?<![\da-f:-])[\da-f]{2}([:-])(?:[\da-f]{2}\1){4}[\da-f]{2}(?![\da-f:-])/i,
    // Cisco notation: AABB.CCDD.EEFF
    /(?<![\da-f.])[\da-f]{4}\.[\da-f]{4}\.[\da-f]{4}(?![\da-f.])/i,
  ],
});
