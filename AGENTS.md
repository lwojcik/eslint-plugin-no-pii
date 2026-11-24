# AGENTS.md

ESLint plugin (`eslint-plugin-no-pii`) that flags PII in comments, string literals and PII-named identifiers. TypeScript, ESM, Node >= 20.19, flat config only. Source is run directly by Node (type stripping), so use `.ts` extensions in relative imports.

## Commands

```
npm test              # node --test "tests/**/*.ts"
npm run typecheck     # tsc --noEmit
npm run lint          # the repo lints itself with this plugin
npm run format        # prettier --write .
npm run build         # tsc -p tsconfig.build.json -> dist/
```

The pre-commit hook runs format:check, lint, typecheck and test. Fix failures; do not bypass the hook with `--no-verify`.

## Layout

- `src/rules/<name>.ts`: one rule per file.
- `src/internal/create-pii-rule.ts`: factory for value-based rules (comments + string literals). Options: `description`, `subject`, `patterns` (stateless, non-global regexes), `detect` (custom check, e.g. checksums), `checkDeclarators`, `checkTemplateLiterals`, `literalFix`.
- `src/rules/no-pii-identifier.ts`: the one hand-written rule (name-based, has options).
- `src/index.ts`: registers rules, adds `meta.docs.url`, defines `configs.recommended`.
- `docs/rules/<name>.md`: one page per rule. `llms.txt`: rule index for LLMs.
- `tests/lib/rules/<name>.ts`: RuleTester tests. `tests/lib/plugin.ts`: cross-cutting checks.

## Adding a rule

1. Create `src/rules/no-<thing>.ts` with `createPiiRule({ description, subject, patterns | detect })`. Prefer validating (checksum, prefix, format) over broad regexes to keep false positives low. Reuse `src/internal/luhn.ts` where it fits.
2. Register it in `src/index.ts` (`rules` and `configs.recommended`).
3. Add `tests/lib/rules/no-<thing>.ts` with valid and invalid cases. Assert on `messageId` (`"comment"` / `"literal"`), not message text.
4. Add `docs/rules/no-<thing>.md`, following an existing page (what it detects, incorrect, correct, how to fix, limits). Check the examples really pass/fail.
5. Add it to the README (config example and rule list) and to `llms.txt`.
6. Run `npm test && npm run lint && npm run typecheck`. `tests/lib/plugin.ts` fails if a rule lacks a docs page, is missing from `recommended`, or is missing from `llms.txt`.

## Conventions and gotchas

- Messages must say how to fix the problem and must never include the matched value, so PII does not leak into logs.
- Value-based rules report with `column: -1` so line-level `eslint-disable-line` / `-next-line` directives are ignored. Block `/* eslint-disable */` still applies.
- Fake PII in `src/rules/**` and `tests/**` is intentional; the repo's own config turns the `pii/*` rules off there. Do not put real personal data anywhere, including docs, tests and commit messages.
- Redaction tokens suggested in messages (`[REDACTED <subject>]`) must not trigger their own rule; `tests/lib/plugin.ts` checks this.
- Commits follow Conventional Commits (commitlint); PR titles are checked in CI. Releases are handled by release-it, so do not bump the version by hand.
