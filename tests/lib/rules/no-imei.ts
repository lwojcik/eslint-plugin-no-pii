import rule from "../../../src/rules/no-imei.ts";
import { RuleTester } from "eslint";
import { describe, it } from "node:test";

RuleTester.describe = describe;
RuleTester.it = it;

const literal = { message: "PII Violation: cannot use IMEI in a literal" };
const comment = { message: "PII Violation: cannot use IMEI in a comment" };

const ruleTester = new RuleTester();
ruleTester.run("no-imei", rule, {
  valid: [
    { code: 'var s = "no imei here";' },
    // Bad Luhn checksum
    { code: 'var s = "490154203237519";' },
    // Valid Luhn but unknown reporting body, no label
    { code: 'var s = "123456789012347";' },
    // A credit card number is not an IMEI
    { code: 'var s = "378282246310005";' },
    // Wrong length
    { code: 'var s = "49015420323751";' },
    { code: 'var s = "4901542032375180";' },
    // Labelled, but bad checksum
    { code: 'var s = "IMEI: 123456789012346";' },
    // Part of a longer number
    { code: 'var s = "1490154203237518";' },
  ],

  invalid: [
    {
      code: '// 490154203237518\nvar s = "356938035643809";',
      errors: [comment, literal],
    },
    { code: 'var s = "49-015420-323751-8";', errors: [literal] },
    { code: 'var s = "490154 20 323751 8";', errors: [literal] },
    { code: 'var s = "device 490154203237518 registered";', errors: [literal] },
    // Labelled, so the reporting body prefix is not required
    { code: 'var s = "IMEI: 123456789012347";', errors: [literal] },
    { code: 'var s = "imei=123456789012347";', errors: [literal] },
  ],
});
