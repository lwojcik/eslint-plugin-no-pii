import rule from "../../../src/rules/no-ssn.ts";
import { RuleTester } from "eslint";
import { describe, it } from "node:test";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester();
ruleTester.run("no-ssn", rule, {
  valid: [
    { code: 'var s = "no ssn here";' },
    { code: 'var s = "000-12-3456";' },
    { code: 'var s = "666-12-3456";' },
    { code: 'var s = "900-12-3456";' },
    { code: 'var s = "123-00-6789";' },
    { code: 'var s = "123-45-0000";' },
    { code: 'var s = "2024-01-15";' },
    { code: 'var s = "123-45-67890";' },
  ],

  invalid: [
    {
      code: '// 123-45-6789\nvar s = "123 45 6789";',
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
