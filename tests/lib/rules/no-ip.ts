import rule from "../../../src/rules/no-ip.ts";
import { RuleTester } from "eslint";
import { describe, it } from "node:test";

RuleTester.describe = describe;
RuleTester.it = it;

const literal = {
  message: "PII Violation: cannot use IP address in a literal",
};
const comment = {
  message: "PII Violation: cannot use IP address in a comment",
};

const ruleTester = new RuleTester();
ruleTester.run("no-ip", rule, {
  valid: [
    {
      code: '// this is a plain string\nvar ip = "no ip here";',
    },
    // Namespaces and separators, not addresses
    { code: 'var s = "Foo::bar";' },
    { code: 'var s = "std::string";' },
    { code: 'var s = parts.join("::");' },
    { code: 'var s = "a:b:c";' },
    // Times, MAC addresses and other colon-separated values
    { code: 'var s = "12:34:56";' },
    { code: 'var s = "10:30:45.123";' },
    { code: 'var s = "00:1A:2B:3C:4D:5E";' },
    // Wrong group counts and sizes
    { code: 'var s = "2001:db8:85a3:0:0:8a2e:370";' },
    { code: 'var s = "2001:db8:85a3:0:0:8a2e:370:7334:1";' },
    { code: 'var s = "12345::1";' },
    { code: 'var s = "2001::db8::1";' },
    // Not hex
    { code: 'var s = "gggg:hhhh:iiii:jjjj:kkkk:llll:mmmm:nnnn";' },
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
    // IPv6: full form
    {
      code: 'var s = "2001:0db8:85a3:0000:0000:8a2e:0370:7334";',
      errors: [literal],
    },
    { code: 'var s = "0:0:0:0:0:0:0:1";', errors: [literal] },
    // IPv6: compressed
    { code: 'var s = "2001:db8::1";', errors: [literal] },
    { code: 'var s = "fe80::1";', errors: [literal] },
    { code: 'var s = "::1";', errors: [literal] },
    { code: 'var s = "2001:db8::";', errors: [literal] },
    { code: 'var s = "2001:DB8:0:0:8:800:200C:417A";', errors: [literal] },
    // IPv6: mapped IPv4, zone id, brackets and ports
    { code: 'var s = "::ffff:192.168.1.1";', errors: [literal] },
    { code: 'var s = "fe80::1%eth0";', errors: [literal] },
    { code: 'var s = "http://[2001:db8::1]:8080/";', errors: [literal] },
    // IPv6 in prose
    { code: 'var s = "client 2001:db8::1 connected";', errors: [literal] },
    { code: "// reach us at 2001:db8::1.", errors: [comment] },
    { code: 'var s = "peer 2001:db8::1: refused";', errors: [literal] },
  ],
});
