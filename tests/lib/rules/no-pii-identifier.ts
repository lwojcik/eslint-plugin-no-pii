import rule from "../../../src/rules/no-pii-identifier.ts";
import { RuleTester } from "eslint";
import { describe, it } from "node:test";

RuleTester.describe = describe;
RuleTester.it = it;

const error = (name: string, term: string) => ({
  message: `PII Violation: "${name}" looks like PII (${term}) and cannot be assigned a hardcoded value`,
});

const ruleTester = new RuleTester();
ruleTester.run("no-pii-identifier", rule, {
  valid: [
    { code: 'var name = "John";' },
    // Empty values
    { code: 'var password = "";' },
    { code: "var ssn = `   `;" },
    // Not a hardcoded string/number
    { code: "var password = getPassword();" },
    { code: "var password = process.env.PASSWORD;" },
    { code: "var ssn = `${a}-${b}`;" },
    { code: "var password = null;" },
    { code: "var hasPassword = true;" },
    { code: "var dob;" },
    // Term is not the end of the name
    { code: "var config = { passwordMinLength: 8 };" },
    { code: 'var passportOffice = "Warsaw";' },
    { code: 'var ssnLabel = "Social security number";' },
    // Destructuring, methods and getters are not assignments of a literal
    { code: "var { password } = user;" },
    { code: "var o = { password() { return 'x'; } };" },
    // ESLint rule-severity maps
    { code: 'var rules = { "pii/no-ssn": "error", "no-dob": "warn" };' },
    { code: 'var rules = { "pii/no-iban": "off" };' },
    // Options
    {
      code: 'var password = "x";',
      options: [{ ignore: ["password"] }],
    },
  ],

  invalid: [
    { code: 'var ssn = "123";', errors: [error("ssn", "ssn")] },
    { code: "var ssn = 123456789;", errors: [error("ssn", "ssn")] },
    { code: "var ssn = `123`;", errors: [error("ssn", "ssn")] },
    {
      code: 'const userPassword = "hunter2";',
      errors: [error("userPassword", "password")],
    },
    {
      code: 'const billing_iban = "x";',
      errors: [error("billing_iban", "iban")],
    },
    {
      code: 'const dateOfBirth = "1990";',
      errors: [error("dateOfBirth", "date of birth")],
    },
    {
      code: 'const creditCardNumber = "x";',
      errors: [error("creditCardNumber", "credit card number")],
    },
    {
      code: 'const o = { password: "x", "ssn": "y" };',
      errors: [error("password", "password"), error("ssn", "ssn")],
    },
    {
      code: 'class A { passport = "x"; #cvv = 123; }',
      errors: [error("passport", "passport"), error("cvv", "cvv")],
    },
    {
      code: 'function f(password = "x") {}',
      errors: [error("password", "password")],
    },
    {
      code: 'user.password = "x"; user["pesel"] = "y"; pin = 1; dob = "z";',
      errors: [
        error("password", "password"),
        error("pesel", "pesel"),
        error("dob", "dob"),
      ],
    },
    // Options
    {
      code: 'var employeeId = "E-1";',
      options: [{ identifiers: ["employee id"] }],
      errors: [error("employeeId", "employee id")],
    },
  ],
});
