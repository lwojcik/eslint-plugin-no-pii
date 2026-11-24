import rule from "../../../src/rules/no-email.ts";
import { RuleTester } from "eslint";
import { describe, it } from "node:test";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester();
ruleTester.run("no-email", rule, {
  valid: [
    {
      code: '// this is a plain string\nvar numb = "no email here";',
    },
  ],

  invalid: [
    {
      code: '// email@test.com\nvar test = "email@test.com";',
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
