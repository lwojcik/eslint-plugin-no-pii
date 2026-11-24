import plugin from "../../src/index.ts";
import { Linter } from "eslint";
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";

const rules = Object.entries(plugin.rules ?? {});

describe("plugin", () => {
  it("documents every rule with a docs page and url", () => {
    for (const [name, rule] of rules) {
      assert.match(rule.meta?.docs?.url ?? "", new RegExp(`/${name}\\.md$`));
      assert.ok(existsSync(`docs/rules/${name}.md`), `docs/rules/${name}.md`);
    }
  });

  it("registers every rule in the recommended config", () => {
    const configured = Object.keys(
      (plugin.configs?.recommended as { rules?: object } | undefined)?.rules ??
        {},
    );
    assert.deepEqual(
      configured.sort(),
      rules.map(([name]) => `pii/${name}`).sort(),
    );
  });

  it("cannot be silenced with line-level eslint-disable directives", () => {
    const linter = new Linter();
    for (const code of [
      'var s = "user@example.com"; // eslint-disable-line pii/no-email',
      '// eslint-disable-next-line pii/no-email\nvar s = "user@example.com";',
    ]) {
      const messages = linter
        .verify(code, [
          { plugins: { pii: plugin }, rules: { "pii/no-email": "error" } },
        ])
        .filter((m) => m.ruleId === "pii/no-email");
      assert.equal(messages.length, 1, code);
      assert.match(messages[0]!.message, /do not try to suppress it/);
    }
  });

  it("redaction tokens suggested in messages are not themselves flagged", () => {
    const linter = new Linter();
    for (const [name, rule] of rules) {
      if (name === "no-pii-identifier") continue;
      const message = Object.values(rule.meta?.messages ?? {})[0]!;
      const token = /"(\[REDACTED [^\]]+\])"/.exec(message)?.[1];
      assert.ok(token, `${name} suggests a redaction token`);
      const result = linter.verify(`var s = "${token}"; // ${token}`, [
        { plugins: { pii: plugin }, rules: { [`pii/${name}`]: "error" } },
      ]);
      assert.deepEqual(result, [], name);
    }
  });
});
