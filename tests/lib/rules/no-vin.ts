import rule from "../../../src/rules/no-vin.ts";
import { RuleTester } from "eslint";
import { describe, it } from "node:test";

RuleTester.describe = describe;
RuleTester.it = it;

const literal = { messageId: "literal" };
const comment = { messageId: "comment" };

const ruleTester = new RuleTester();
ruleTester.run("no-vin", rule, {
  valid: [
    { code: 'var s = "no vin here";' },
    // Bad check digit
    { code: 'var s = "1HGCM82633A004353";' },
    // Contains I, O or Q
    { code: 'var s = "1HGCM82633A0043I2";' },
    // Wrong length
    { code: 'var s = "1HGCM82633A00435";' },
    { code: 'var s = "1HGCM82633A0043522";' },
    // All digits (passes the checksum but is not a VIN)
    { code: 'var s = "11111111111111111";' },
    // Only letters
    { code: 'var s = "ABCDEFGHJKLMNPRST";' },
    // Unlabelled well-formed 17-char id without a valid check digit
    { code: 'var s = "WVWZZZ1JZ3W386752";' },
    // Label with a malformed value
    { code: 'var s = "VIN: not-a-vin";' },
  ],

  invalid: [
    {
      code: '// 1HGCM82633A004352\nvar s = "1M8GDM9AXKP042788";',
      errors: [comment, literal],
    },
    { code: 'var s = "vehicle 1HGCM82633A004352 sold";', errors: [literal] },
    // Labelled, without a valid check digit (European style)
    { code: 'var s = "VIN: WVWZZZ1JZ3W386752";', errors: [literal] },
    { code: 'var s = "vin#WVWZZZ1JZ3W386752";', errors: [literal] },
  ],
});
