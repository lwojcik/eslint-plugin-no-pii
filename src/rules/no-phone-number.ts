import { createPiiRule } from "../internal/create-pii-rule.ts";

export default createPiiRule({
  description: "enforces no phone numbers in comments or string literals",
  subject: "phone number",
  patterns: [
    // France
    /\b([0O]?[1lI][1lI])?[3E][3E][0O]?[\dOIlZEASB]{9}\b/,
    // Germany
    /\b[\d\w]\d{2}[\d\w]{6}\d[\d\w]\b/,
    // UK
    /(((\+44)? ?(\(0\))? ?)|(0))( ?[0-9]{3,4}){3}/,
    // US
    /\b((\+|\b)[1l][-. ])?\(?\b[\dOlZSB]{3,5}([-. ]|\) ?)[\dOlZSB]{3}[-. ][\dOlZSB]{4}\b/,
  ],
});
