import rule from "../../../src/rules/no-jwt.ts";
import { RuleTester } from "eslint";
import { describe, it } from "node:test";

RuleTester.describe = describe;
RuleTester.it = it;

const literal = { messageId: "literal" };
const comment = { messageId: "comment" };

const b64 = (value: unknown) =>
  Buffer.from(JSON.stringify(value)).toString("base64url");
const header = b64({ alg: "HS256", typ: "JWT" });
const payload = b64({ sub: "1234567890", name: "Jane Doe" });
const token = `${header}.${payload}.c2lnbmF0dXJl`;

const ruleTester = new RuleTester();
ruleTester.run("no-jwt", rule, {
  valid: [
    { code: 'var s = "no token here";' },
    // Two segments only
    { code: `var s = "${header}";` },
    { code: `var s = "${header}.";` },
    // Looks like a token but the header is not JSON
    { code: 'var s = "eyJhbGciOiJIUzI1NiJ9xx.eyJzdWIiOiIxIn0.sig";' },
    // Header without `alg`
    { code: `var s = "${b64({ typ: "JWT" })}.${payload}.sig";` },
    // Payload is not a JSON object
    { code: `var s = "${header}.${b64([1, 2])}.sig";` },
    // Dotted identifiers that merely start with eyJ
    { code: 'var s = "eyJ.eyJ.sig";' },
    // Embedded in a longer base64url run
    { code: `var s = "x${token}";` },
  ],

  invalid: [
    { code: `var s = "${token}";`, errors: [literal] },
    { code: `// ${token}\nvar x = 1;`, errors: [comment] },
    {
      code: `var s = "Authorization: Bearer ${token}";`,
      errors: [literal],
    },
    // Unsecured token with an empty signature
    {
      code: `var s = "${b64({ alg: "none" })}.${payload}.";`,
      errors: [literal],
    },
    // Signature omitted entirely
    { code: `var s = "${header}.${payload}";`, errors: [literal] },
    { code: `var s = "?token=${token}&x=1";`, errors: [literal] },
  ],
});
