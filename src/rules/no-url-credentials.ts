import { createPiiRule } from "../internal/create-pii-rule.ts";

// scheme://user:password@ -- the host is optional so the static part of a
// template literal like `postgres://admin:secret@${host}/db` still matches.
const URL_CREDENTIALS = /\b[a-z][a-z\d+.-]*:\/\/([^\s:@/?#]+):([^\s@/?#]+)@/gi;

// Obvious placeholders in docs and templates, not real credentials.
const PLACEHOLDER =
  /^(?:[$<{[%*:]|\.{3}|x+$|(?:your[-_]?)?pass(?:word)?$|pwd$|secret$|changeme$)/i;

export default createPiiRule({
  description: "enforces no credentials embedded in URLs or connection strings",
  subject: "URL credentials",
  checkTemplateLiterals: true,
  detect: (value) =>
    Array.from(value.matchAll(URL_CREDENTIALS)).some(
      (match) => !PLACEHOLDER.test(match[2]!),
    ),
});
