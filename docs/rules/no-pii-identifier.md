# pii/no-pii-identifier

Disallows assigning a hardcoded value to an identifier whose **name** suggests PII (`ssn`, `password`, `dateOfBirth`, `iban`, …). It catches PII that the value-based rules can't recognise, such as free-form passwords or unformatted IDs.

- **Type:** problem
- **Recommended severity:** error
- **Options:** `identifiers`, `ignore`

## What it detects

A non-empty string, number or expression-free template literal assigned to a variable, object property, class field, default parameter or member (`obj.password = "…"`) whose name _ends with_ a known term. Names are split into words, so `userPassword` and `billing_iban` match, while `passwordMinLength` and `passportOffice` do not.

Built-in terms: `ssn`, `social security (number)`, `password`, `passwd`, `passphrase`, `dob`, `birthdate`, `birth date`, `date of birth`, `passport (number)`, `national id (number)`, `tax id`, `pesel`, `nino`, `credit card (number)`, `debit card`, `card number`, `cvv`, `cvc`, `iban`, and driver's licence variants.

## Incorrect

```js
const password = "hunter2";
const user = { ssn: 123456789, dateOfBirth: "1990-01-01" };
config.billing_iban = "DE89370400440532013000";
```

## Correct

```js
const password = process.env.DB_PASSWORD;
const user = { ssn: input.ssn, dateOfBirth: input.dob };
const password = ""; // empty values are fine
const passwordMinLength = 12; // name does not end with a PII term
```

## Options

```js
{
  rules: {
    "pii/no-pii-identifier": ["error", {
      identifiers: ["employee id", "employeeId"], // extra names to flag
      ignore: ["cardNumberLabel"],                // exact names to never flag
    }],
  },
}
```

- `identifiers` (`string[]`): additional names or phrases to flag, on top of the built-in terms.
- `ignore` (`string[]`): exact identifier names that are never flagged.

## How to fix a report

1. Load the value from an environment variable, secret store or test fixture instead of hardcoding it.
2. If the name is a false positive (e.g. a form field label), add the exact name to `ignore` in your ESLint config. Unlike the value-based rules, this rule is reported normally, so `eslint-disable` comments work too, but prefer `ignore` so the exception stays reviewable.
