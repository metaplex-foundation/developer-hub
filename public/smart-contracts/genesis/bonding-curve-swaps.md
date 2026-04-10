# Metaplex Genesis: Bonding Curve Swaps

Use this agent page when the user wants to quote, buy, sell, or inspect a Genesis Bonding Curve.

Human page: https://metaplex.com/docs/smart-contracts/genesis/bonding-curve-swaps

## Agent Routing

- Default to SDK or API instructions when the user is building an app, backend, script, or integration.
- Use CLI commands when the user asks for terminal commands, manual setup, debugging, one-off execution, or verification.
- If both apply, use SDK or API first and include the CLI quick reference as an operational fallback.

## Environment Prerequisites

- For SDK or API operations, Umi must be installed, configured with an RPC endpoint, and configured with a signer wallet before sending transactions.
- For CLI operations, the Metaplex CLI must be installed and configured with an RPC endpoint and wallet/keypair before running state-changing commands.
- If the user only needs code examples or conceptual guidance, do not assume live wallet access is available.

## SDK Functions

- `findBondingCurveBucketV2Pda()` derives the bucket PDA.
- `isSwappable()` checks whether the curve is active.
- `getSwapResult()` computes a quote including fees.
- `applySlippage()` derives `minAmountOutScaled`.
- `swapBondingCurveV2()` executes the buy or sell instruction.

## CLI Quick Reference

```bash
# Inspect curve state.
mplx genesis swap <GENESIS> --info

# Quote without swapping.
mplx genesis swap <GENESIS> --info --buyAmount <QUOTE_AMOUNT>
mplx genesis swap <GENESIS> --info --sellAmount <BASE_AMOUNT>

# Execute swaps.
mplx genesis swap <GENESIS> --buyAmount <QUOTE_AMOUNT> --slippage <BPS>
mplx genesis swap <GENESIS> --sellAmount <BASE_AMOUNT> --slippage <BPS>

# Inspect the bonding curve bucket.
mplx genesis bucket fetch <GENESIS> --type bonding-curve
```

Full CLI docs: /docs/dev-tools/cli/genesis/bonding-curve

## Notes

- CLI buy amounts are quote-token base units; for SOL, `100000000` is 0.1 SOL.
- CLI `--slippage` is basis points; `200` is 2%.
- SDK swaps require explicit wSOL handling; CLI buys can auto-wrap SOL.

## Related Pages

- Bonding Curve overview: /docs/smart-contracts/genesis/bonding-curve.md
- Launch Bonding Curve: /docs/smart-contracts/genesis/bonding-curve-launch.md
- Full CLI bonding curve docs: /docs/dev-tools/cli/genesis/bonding-curve
