import rule from "../../../src/rules/no-credit-card.ts";
import { RuleTester } from "eslint";
import { describe, it } from "node:test";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester();
ruleTester.run("no-credit-card", rule, {
  valid: [
    { code: 'var s = "no card here";' },
    // Fails Luhn
    { code: 'var s = "4111 1111 1111 1112";' },
    // Epoch milliseconds
    { code: 'var s = "1700000000000";' },
    // Too short
    { code: 'var s = "4111 1111";' },
  ],

  invalid: [
    {
      code: '// 4111 1111 1111 1111\nvar s = "5500-0000-0000-0004";',
      errors: [
        {
          message: "PII Violation: cannot use credit card number in a comment",
        },
        {
          message: "PII Violation: cannot use credit card number in a literal",
        },
      ],
    },
    {
      code: 'var s = "amex 378282246310005 on file";',
      errors: [
        {
          message: "PII Violation: cannot use credit card number in a literal",
        },
      ],
    },
  ],
});
