import { createPiiRule } from "../internal/create-pii-rule.ts";

// header.payload[.signature]; both JSON segments start with `eyJ` (`{"`).
// The signature may be empty for unsecured tokens (`alg: none`).
const CANDIDATE =
  /(?<![\w-])(eyJ[\w-]{4,})\.(eyJ[\w-]{4,})(?:\.[\w-]*)?(?![\w-])/g;

const decodeObject = (segment: string): Record<string, unknown> | undefined => {
  try {
    const json: unknown = JSON.parse(
      Buffer.from(segment, "base64url").toString("utf8"),
    );
    return typeof json === "object" && json !== null && !Array.isArray(json)
      ? (json as Record<string, unknown>)
      : undefined;
  } catch {
    return undefined;
  }
};

export default createPiiRule({
  description: "enforces no JSON Web Tokens in comments or string literals",
  subject: "JWT",
  detect: (value) =>
    Array.from(value.matchAll(CANDIDATE)).some(
      ([, header, payload]) =>
        typeof decodeObject(header!)?.["alg"] === "string" &&
        decodeObject(payload!) !== undefined,
    ),
});
