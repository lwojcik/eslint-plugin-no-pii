import rule from "../../../src/rules/no-phone-number.ts";
import { RuleTester } from "eslint";
import { describe, it } from "node:test";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester();
ruleTester.run("no-phone-number", rule, {
  valid: [
    {
      code: '// this is a plain string\nvar numb = "no number here";',
    },
  ],

  invalid: [
    {
      code: '// +1-541-754-3010\nvar numb = "+1-541-754-3010";',
      errors: [
        {
          message: "PII Violation: cannot use phone number in a comment",
        },
        {
          message: "PII Violation: cannot use phone number in a literal",
        },
      ],
    },
    {
      code: '// (541) 754-3010\nvar numb = "(541) 754-3010";',
      errors: [
        {
          message: "PII Violation: cannot use phone number in a comment",
        },
        {
          message: "PII Violation: cannot use phone number in a literal",
        },
      ],
    },
    {
      code: '// 001-541-754-3010\nvar numb = "001-541-754-3010";',
      errors: [
        {
          message: "PII Violation: cannot use phone number in a comment",
        },
        {
          message: "PII Violation: cannot use phone number in a literal",
        },
      ],
    },
    {
      code: '// 1-541-754-3010\nvar numb = "1-541-754-3010";',
      errors: [
        {
          message: "PII Violation: cannot use phone number in a comment",
        },
        {
          message: "PII Violation: cannot use phone number in a literal",
        },
      ],
    },
    {
      code: '// +44 7911 123456\nvar numb = "+44 7911 123456";',
      errors: [
        {
          message: "PII Violation: cannot use phone number in a comment",
        },
        {
          message: "PII Violation: cannot use phone number in a literal",
        },
      ],
    },
  ],
});
