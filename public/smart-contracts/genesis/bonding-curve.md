# Metaplex Genesis: Bonding Curve

Use this agent page when the user asks about Genesis Bonding Curve concepts or a CLI bonding curve lifecycle.

Human page: https://metaplex.com/docs/smart-contracts/genesis/bonding-curve

## Agent Routing

- Default to SDK or API instructions when the user is building an app, backend, script, or integration.
- Use CLI commands when the user asks for terminal commands, manual setup, debugging, one-off execution, or verification.
- If both apply, use SDK or API first and include the CLI quick reference as an operational fallback.

## Environment Prerequisites

- For SDK or API operations, Umi must be installed, configured with an RPC endpoint, and configured with a signer wallet before sending transactions.
- For CLI operations, the Metaplex CLI must be installed and configured with an RPC endpoint and wallet/keypair before running state-changing commands.
- If the user only needs code examples or conceptual guidance, do not assume live wallet access is available.

## When To Use

- The user wants continuous trading instead of a deposit window.
- The user asks how to launch a bonding curve token.
- The user asks how bonding curve trading and graduation work.

## Concepts

- Bonding Curve launches use a constant product AMM.
- Users can buy and sell while the curve is active.
- Graduation to Raydium CPMM happens automatically when all curve tokens are sold.
- Bonding Curve launches are created through the Genesis API flow, not the manual bucket flow.

## CLI Quick Reference

```bash
mplx genesis launch create --launchType bonding-curve \
  --name <NAME> \
  --symbol <SYMBOL> \
  --image <IRYS_URL>

mplx genesis swap <GENESIS> --info
mplx genesis swap <GENESIS> --buyAmount <QUOTE_AMOUNT>
mplx genesis swap <GENESIS> --sellAmount <BASE_AMOUNT>
mplx genesis bucket fetch <GENESIS> --type bonding-curve
```

Full CLI docs: /docs/dev-tools/cli/genesis/bonding-curve

## Related Pages

- Launch via API: /docs/smart-contracts/genesis/bonding-curve-launch.md
- Swap integration: /docs/smart-contracts/genesis/bonding-curve-swaps.md
- Full CLI bonding curve docs: /docs/dev-tools/cli/genesis/bonding-curve
