/**
 * Flags identifiers whose *name* suggests PII (`ssn`, `password`, `dateOfBirth`,
 * ...) when they are assigned a hardcoded value. Catches PII that the value-based
 * rules can't recognise, such as free-form passwords or unformatted IDs.
 */

import type { Rule } from "eslint";
import type { Expression, Node, Pattern } from "estree";

// Names are split into lowercase words and matched against the *end* of the
// name, so `userPassword` and `billing_iban` match but `passwordMinLength`
// and `passportOffice` don't.
const DEFAULT_TERMS = [
  "ssn",
  "social security",
  "social security number",
  "password",
  "passwd",
  "passphrase",
  "dob",
  "birthdate",
  "birth date",
  "date of birth",
  "passport",
  "passport number",
  "national id",
  "national id number",
  "tax id",
  "pesel",
  "nino",
  "credit card",
  "credit card number",
  "debit card",
  "card number",
  "cvv",
  "cvc",
  "iban",
  "driver license",
  "drivers license",
  "driver licence",
  "drivers licence",
  "driving license",
  "driving licence",
];

const toWords = (name: string): string[] =>
  name
    .replace(/([a-z\d])([A-Z])/g, "$1 $2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
    .split(/[^A-Za-z\d]+/)
    .filter(Boolean)
    .map((word) => word.toLowerCase());

interface Options {
  /** Extra identifier names to flag, e.g. "employee id" or "employeeId". */
  identifiers?: string[];
  /** Exact identifier names to never flag. */
  ignore?: string[];
}

/** A hardcoded, non-empty string/number (or template without expressions). */
function isHardcodedValue(node: Expression | Pattern | null | undefined) {
  if (!node) return false;
  if (node.type === "Literal") {
    if (typeof node.value === "string") return node.value.trim() !== "";
    return typeof node.value === "number";
  }
  if (node.type === "TemplateLiteral") {
    return (
      node.expressions.length === 0 &&
      node.quasis.some((quasi) => quasi.value.cooked?.trim())
    );
  }
  return false;
}

const ESLINT_SEVERITIES = new Set(["off", "warn", "error"]);

/** An ESLint rule severity such as `"error"`, as in `{ "pii/no-ssn": "error" }`. */
const isSeverity = (node: Expression | Pattern | null | undefined) =>
  node?.type === "Literal" &&
  typeof node.value === "string" &&
  ESLINT_SEVERITIES.has(node.value);

/** The static name a node is declared/assigned under, if there is one. */
function nameOf(node: Node | null | undefined, computed = false) {
  if (!node) return null;
  if (node.type === "Identifier") return computed ? null : node.name;
  if (node.type === "PrivateIdentifier") return node.name;
  if (node.type === "Literal" && typeof node.value === "string") {
    return node.value;
  }
  return null;
}

const rule: Rule.RuleModule = {
  meta: {
    type: "problem",
    docs: {
      description:
        "enforces no hardcoded values for identifiers whose names suggest PII",
    },
    schema: [
      {
        type: "object",
        properties: {
          identifiers: { type: "array", items: { type: "string" } },
          ignore: { type: "array", items: { type: "string" } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      identifier:
        'PII Violation: "{{name}}" looks like PII ({{term}}) and cannot be assigned a hardcoded value. Load it from an environment variable, secret store or test fixture instead. If this is a false positive, add "{{name}}" to the rule\'s `ignore` option in your ESLint config.',
    },
  },

  create(context) {
    const options: Options = context.options[0] ?? {};
    const ignore = new Set(options.ignore ?? []);
    const terms = [...DEFAULT_TERMS, ...(options.identifiers ?? [])].map(
      (term) => toWords(term),
    );

    const findTerm = (name: string): string | undefined => {
      if (ignore.has(name)) return undefined;
      const words = toWords(name);
      return terms
        .find(
          (term) =>
            term.length > 0 &&
            term.length <= words.length &&
            term.every(
              (word, i) => words[words.length - term.length + i] === word,
            ),
        )
        ?.join(" ");
    };

    const check = (
      node: Node,
      name: string | null,
      value: Expression | Pattern | null | undefined,
    ) => {
      if (name === null || !isHardcodedValue(value)) return;
      const term = findTerm(name);
      if (term) {
        context.report({ node, messageId: "identifier", data: { name, term } });
      }
    };

    return {
      VariableDeclarator(node) {
        if (node.id.type === "Identifier") check(node, node.id.name, node.init);
      },
      Property(node) {
        // Rule-severity maps (`{ "pii/no-ssn": "error" }`) configure ESLint;
        // they don't assign PII.
        if (node.kind === "init" && !node.method && !isSeverity(node.value)) {
          check(node, nameOf(node.key, node.computed), node.value);
        }
      },
      PropertyDefinition(node) {
        check(node, nameOf(node.key, node.computed), node.value);
      },
      AssignmentPattern(node) {
        if (node.left.type === "Identifier") {
          check(node, node.left.name, node.right);
        }
      },
      AssignmentExpression(node) {
        if (node.operator !== "=") return;
        const { left } = node;
        if (left.type === "Identifier") {
          check(node, left.name, node.right);
        } else if (left.type === "MemberExpression") {
          check(node, nameOf(left.property, left.computed), node.right);
        }
      },
    };
  },
};

export default rule;
