# Metaplex Genesis: Presale

Use this agent page when the user wants a fixed-price Genesis token sale or presale.

Human page: https://metaplex.com/docs/smart-contracts/genesis/presale

## Agent Routing

- Default to SDK or API instructions when the user is building an app, backend, script, or integration.
- Use CLI commands when the user asks for terminal commands, manual setup, debugging, one-off execution, or verification.
- If both apply, use SDK or API first and include the CLI quick reference as an operational fallback.

## Environment Prerequisites

- For SDK or API operations, Umi must be installed, configured with an RPC endpoint, and configured with a signer wallet before sending transactions.
- For CLI operations, the Metaplex CLI must be installed and configured with an RPC endpoint and wallet/keypair before running state-changing commands.
- If the user only needs code examples or conceptual guidance, do not assume live wallet access is available.

## When To Use

- The user wants fixed-price token distribution.
- The user asks how to add a Presale bucket.
- The user asks how users deposit into or claim from a presale.

## SDK Functions

- `addPresaleBucketV2()` adds the Presale bucket.
- `addUnlockedBucketV2()` commonly adds the treasury/remainder bucket.
- `finalizeV2()` locks the configuration.
- `depositPresaleV2()` and `claimPresaleV2()` handle user operations.

## CLI Quick Reference

```bash
mplx genesis bucket add-presale <GENESIS> \
  --allocation <AMOUNT> \
  --quoteCap <AMOUNT> \
  --depositStart <UNIX_TS> \
  --depositEnd <UNIX_TS> \
  --claimStart <UNIX_TS> \
  --bucketIndex <N>

mplx genesis presale deposit <GENESIS> --amount <AMOUNT> --bucketIndex <N>
mplx genesis presale claim <GENESIS> --bucketIndex <N>
```

Full CLI docs: /docs/dev-tools/cli/genesis/presale

## Notes

- Fixed price is `quoteCap / allocation`.
- `quoteCap` and `allocation` are in base units.
- Use `--minimumDeposit` and `--depositLimit` for deposit constraints.
- Wrap SOL before manual deposits when the quote token is SOL.

## Related Pages

- Launch Pool: /docs/smart-contracts/genesis/launch-pool.md
- Getting Started: /docs/smart-contracts/genesis/getting-started.md
- Full CLI presale docs: /docs/dev-tools/cli/genesis/presale
