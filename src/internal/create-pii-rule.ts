/**
 * Shared factory for rules that flag PII patterns in comments and string literals.
 */

import type { Rule } from "eslint";
import type { SourceLocation } from "estree";

/**
 * Report location that ignores `eslint-disable` comments (column -1 forces the
 * report to be treated as covering the whole start line).
 */
const toForceLocation = (loc: SourceLocation) => ({
  start: { line: loc.start.line, column: -1 },
  end: loc.end,
});

interface PiiRuleOptions {
  description: string;
  /** Human readable name used in messages, e.g. "IP address". */
  subject: string;
  /** Non-global patterns (stateless `.test`). */
  patterns?: RegExp[];
  /** Custom detector for checks a regex can't express (e.g. checksums). */
  detect?: (value: string) => boolean;
  /** Also test `<identifier> <literal>` pairs. */
  checkDeclarators?: boolean;
}

export function createPiiRule({
  description,
  subject,
  patterns = [],
  detect,
  checkDeclarators = false,
}: PiiRuleOptions): Rule.RuleModule {
  const matches = (value: string) =>
    patterns.some((pattern) => pattern.test(value)) ||
    (detect?.(value) ?? false);

  return {
    meta: {
      type: "problem",
      docs: { description },
      schema: [],
      messages: {
        comment: `PII Violation: cannot use ${subject} in a comment`,
        literal: `PII Violation: cannot use ${subject} in a literal`,
      },
    },

    create(context) {
      const { sourceCode } = context;
      const report = (
        loc: SourceLocation | null | undefined,
        messageId: "comment" | "literal",
      ) => {
        if (loc) context.report({ loc: toForceLocation(loc), messageId });
      };

      return {
        Program() {
          for (const comment of sourceCode.getAllComments()) {
            if (matches(comment.value)) {
              report(comment.loc, "comment");
            }
          }
        },
        Literal(node) {
          if (typeof node.value === "string" && matches(node.value)) {
            report(node.loc, "literal");
          }
        },
        ...(checkDeclarators && {
          VariableDeclarator(node) {
            if (node.id.type !== "Identifier") return;
            if (node.init?.type !== "Literal") return;
            if (matches(`${node.id.name} ${node.init.value}`)) {
              report(node.loc, "literal");
            }
          },
        }),
      };
    },
  };
}
