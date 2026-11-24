import rule from "../../../src/rules/no-national-id.ts";
import { RuleTester } from "eslint";
import { describe, it } from "node:test";

RuleTester.describe = describe;
RuleTester.it = it;

const literal = {
  message: "PII Violation: cannot use national ID number in a literal",
};
const comment = {
  message: "PII Violation: cannot use national ID number in a comment",
};

const ruleTester = new RuleTester();
ruleTester.run("no-national-id", rule, {
  valid: [
    { code: 'var s = "no id here";' },
    // PESEL: bad checksum, impossible month
    { code: 'var s = "44051401358";' },
    { code: 'var s = "44131401359";' },
    // NIP: bad checksum, bare digits without prefix, epoch seconds
    { code: 'var s = "123-456-32-19";' },
    { code: 'var s = "1234563218";' },
    { code: 'var s = "1700000000";' },
    // NINO: disallowed prefix, bad suffix letter
    { code: 'var s = "BG123456C";' },
    { code: 'var s = "AB123456E";' },
    // DNI/NIE: wrong control letter
    { code: 'var s = "12345678A";' },
    { code: 'var s = "X1234567A";' },
    // Plain words
    { code: 'var s = "ABCDEFGH";' },
  ],

  invalid: [
    {
      code: '// 44051401359\nvar s = "44051401359";',
      errors: [comment, literal],
    },
    { code: 'var s = "NIP 1234563218";', errors: [literal] },
    { code: 'var s = "123-456-32-18";', errors: [literal] },
    { code: 'var s = "123-45-63-218";', errors: [literal] },
    { code: 'var s = "PL1234563218";', errors: [literal] },
    { code: 'var s = "AB 12 34 56 C";', errors: [literal] },
    { code: 'var s = "AB123456C";', errors: [literal] },
    { code: 'var s = "12345678Z";', errors: [literal] },
    { code: 'var s = "12345678-z";', errors: [literal] },
    { code: 'var s = "X1234567L";', errors: [literal] },
  ],
});
