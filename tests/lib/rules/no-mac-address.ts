import rule from "../../../src/rules/no-mac-address.ts";
import { RuleTester } from "eslint";
import { describe, it } from "node:test";

RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester();
ruleTester.run("no-mac-address", rule, {
  valid: [
    { code: 'var s = "no mac here";' },
    // Time of day
    { code: 'var s = "12:34:56";' },
    // IPv6
    { code: 'var s = "2001:0db8:85a3:0000:0000:8a2e:0370:7334";' },
    // Mixed separators
    { code: 'var s = "00:1A-2B:3C-4D:5E";' },
    // Too short / too long
    { code: 'var s = "00:1A:2B:3C:4D";' },
    { code: 'var s = "00:1A:2B:3C:4D:5E:6F:70";' },
    // Not hex
    { code: 'var s = "GG:HH:II:JJ:KK:LL";' },
  ],

  invalid: [
    {
      code: '// 00:1A:2B:3C:4D:5E\nvar s = "00-1a-2b-3c-4d-5e";',
      errors: [{ messageId: "comment" }, { messageId: "literal" }],
    },
    {
      code: 'var s = "device 001a.2b3c.4d5e online";',
      errors: [{ messageId: "literal" }],
    },
  ],
});
