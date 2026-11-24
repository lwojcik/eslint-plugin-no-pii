import rule from "../../../src/rules/no-iban.ts";
import { RuleTester } from "eslint";
import { describe, it } from "node:test";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester();
ruleTester.run("no-iban", rule, {
  valid: [
    { code: 'var s = "no iban here";' },
    // Bad checksum
    { code: 'var s = "DE89 3704 0044 0532 0130 01";' },
    // Wrong length for country
    { code: 'var s = "DE8937040044053201300";' },
    // Unknown country
    { code: 'var s = "ZZ89370400440532013000";' },
    // Constant-like identifier
    { code: 'var s = "MAX_RETRY_COUNT_FOR_REQUEST";' },
  ],

  invalid: [
    {
      code: '// DE89 3704 0044 0532 0130 00\nvar s = "GB82WEST12345698765432";',
      errors: [
        { message: "PII Violation: cannot use IBAN in a comment" },
        { message: "PII Violation: cannot use IBAN in a literal" },
      ],
    },
    {
      code: 'var s = "PL61 1090 1014 0000 0712 1981 2874 OWNER";',
      errors: [{ message: "PII Violation: cannot use IBAN in a literal" }],
    },
  ],
});
