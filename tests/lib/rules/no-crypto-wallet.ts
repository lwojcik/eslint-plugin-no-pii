import rule from "../../../src/rules/no-crypto-wallet.ts";
import { RuleTester } from "eslint";
import { describe, it } from "node:test";

RuleTester.describe = describe;
RuleTester.it = it;

const literal = {
  messageId: "literal",
};
const comment = {
  messageId: "comment",
};

const ruleTester = new RuleTester();
ruleTester.run("no-crypto-wallet", rule, {
  valid: [
    { code: 'var s = "no wallet here";' },
    // Bitcoin: bad Base58Check checksum, wrong length
    { code: 'var s = "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNb";' },
    { code: 'var s = "1A1zP1eP5QGefi2DMPTfTL5SLmv7Div";' },
    // Bitcoin: bad bech32 checksum, mixed case
    { code: 'var s = "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdp";' },
    { code: 'var s = "bc1QAR0SRRR7XFKVY5L643LYDNW9RE59GTZZWF5MDq";' },
    // Ethereum: wrong length, placeholders, longer hex (tx hash / private key)
    { code: 'var s = "0x742d35Cc6634C0532925a3b844Bc454e4438f44";' },
    { code: 'var s = "0x0000000000000000000000000000000000000000";' },
    { code: 'var s = "0xffffffffffffffffffffffffffffffffffffffff";' },
    {
      code: 'var s = "0x88df016429689c079f3b2f6ad39fa052532c56795b733da78a91ebe6a713944b";',
    },
    // Not hex
    { code: 'var s = "0xZZZd35Cc6634C0532925a3b844Bc454e4438f44e";' },
  ],

  invalid: [
    {
      code: '// 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa\nvar s = "3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy";',
      errors: [comment, literal],
    },
    {
      code: 'var s = "bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq";',
      errors: [literal],
    },
    {
      code: 'var s = "BC1QAR0SRRR7XFKVY5L643LYDNW9RE59GTZZWF5MDQ";',
      errors: [literal],
    },
    // Taproot (Bech32m)
    {
      code: 'var s = "bc1p0xlxvlhemja6c4dqv22uapctqupfhlxm9h8z3k2e72q4k9hcz7vqzk5jj0";',
      errors: [literal],
    },
    {
      code: 'var s = "0x742d35Cc6634C0532925a3b844Bc454e4438f44e";',
      errors: [literal],
    },
    {
      code: 'var s = "send to 0x742d35cc6634c0532925a3b844bc454e4438f44e now";',
      errors: [literal],
    },
  ],
});
