import { createPiiRule } from "../internal/create-pii-rule.ts";

export default createPiiRule({
  description: "enforces no date of birth in comments or string literals",
  subject: "date of birth",
  checkDeclarators: true,
  patterns: [
    /\b(birth|birthdate|birthday|dob|born)\W+(?:\w+\W+){0,5}?(?<REDACT>(\d{4}|\d{1,2})[/-]\d{1,2}[/-](\d{4}|\d{1,2}))\b/,
  ],
});
