import rule from "../../../src/rules/no-url-credentials.ts";
import { RuleTester } from "eslint";
import { describe, it } from "node:test";

RuleTester.describe = describe;
RuleTester.it = it;

const literal = {
  message: "PII Violation: cannot use URL credentials in a literal",
};
const comment = {
  message: "PII Violation: cannot use URL credentials in a comment",
};

const ruleTester = new RuleTester();
ruleTester.run("no-url-credentials", rule, {
  valid: [
    { code: 'var s = "no url here";' },
    { code: 'var s = "https://example.com/path?a=1";' },
    // Username only, port, @ later in the path
    { code: 'var s = "ssh://git@github.com/org/repo.git";' },
    { code: 'var s = "http://localhost:3000/users/me@example";' },
    { code: 'var s = "https://example.com:8443/";' },
    // Placeholders
    { code: 'var s = "https://user:password@localhost";' },
    { code: 'var s = "https://user:<password>@example.com";' },
    { code: 'var s = "postgres://user:${PASSWORD}@host/db";' },
    { code: 'var s = "postgres://user:%s@host/db";' },
    { code: 'var s = "https://user:****@example.com";' },
    { code: 'var s = "https://user:xxxx@example.com";' },
    // Dynamic password in a template literal
    { code: "var s = `postgres://admin:${password}@${host}/db`;" },
  ],

  invalid: [
    {
      code: '// postgres://admin:s3cret-pw@db.example.com:5432/app\nvar s = "https://bob:hunter2@example.com";',
      errors: [comment, literal],
    },
    {
      code: 'var s = "mongodb+srv://app:p4ssw0rd@cluster0.mongodb.net/db";',
      errors: [literal],
    },
    {
      code: 'var s = "ftp://anonymous:guest123@ftp.example.com";',
      errors: [literal],
    },
    // Static part of a template literal
    {
      code: "var s = `postgres://admin:hunter2@${host}/db`;",
      errors: [literal],
    },
  ],
});
