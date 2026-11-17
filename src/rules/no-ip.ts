import { createPiiRule } from "../internal/create-pii-rule.ts";

export default createPiiRule({
  description: "enforces no ip address in comments or string literals",
  subject: "IP address",
  patterns: [
    /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/,
    /\b([\d\w]{4}|0)(:([\d\w]{4}|0)){7}\b/,
  ],
});
