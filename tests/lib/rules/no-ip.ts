import rule from "../../../src/rules/no-ip.ts";
import { RuleTester } from "eslint";
import { describe, it } from "node:test";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester();
ruleTester.run("no-ip", rule, {
  valid: [
    {
      code: '// this is a plain string\nvar ip = "no ip here";',
    },
  ],

  invalid: [
    {
      code: '// 192.168.1.1\nvar ip = "127.0.0.1"',
      errors: [
        {
          message: "PII Violation: cannot use IP address in a comment",
        },
        {
          message: "PII Violation: cannot use IP address in a literal",
        },
      ],
    },
  ],
});
