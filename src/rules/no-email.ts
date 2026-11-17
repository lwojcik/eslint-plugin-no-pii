import { createPiiRule } from "../internal/create-pii-rule.ts";

export default createPiiRule({
  description: "enforces no email in comments or string literals",
  subject: "email address",
  patterns: [/\b[a-z0-9._%+\-—|]+@[a-z0-9.\-—|]+\.[a-z|]{2,6}\b/],
});
