import rule from "../../../src/rules/no-dob.ts";
import { RuleTester } from "eslint";
import { describe, it } from "node:test";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester();
ruleTester.run("no-dob", rule, {
  valid: [
    // Destructuring declarators have no single name to check
    { code: 'const [dob] = "1990-01-01";' },
    {
      code: '// this is a plain string\nvar dob = "no dob here";',
    },
    { code: "var dob;" },
  ],

  invalid: [
    {
      code: '// my birthdate is 12-10-1992\nvar dob = "12-10-1992"',
      errors: [
        {
          messageId: "comment",
        },
        {
          messageId: "literal",
        },
      ],
    },
  ],
});
