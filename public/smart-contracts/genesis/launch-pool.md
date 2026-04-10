# Metaplex Genesis: Launch Pool

Use this agent page when the user wants a Genesis Launch Pool, fair launch, proportional token distribution, deposit, withdraw, transition, or claim flow.

Human page: https://metaplex.com/docs/smart-contracts/genesis/launch-pool

## Agent Routing

- Default to SDK or API instructions when the user is building an app, backend, script, or integration.
- Use CLI commands when the user asks for terminal commands, manual setup, debugging, one-off execution, or verification.
- If both apply, use SDK or API first and include the CLI quick reference as an operational fallback.

## Environment Prerequisites

- For SDK or API operations, Umi must be installed, configured with an RPC endpoint, and configured with a signer wallet before sending transactions.
- For CLI operations, the Metaplex CLI must be installed and configured with an RPC endpoint and wallet/keypair before running state-changing commands.
- If the user only needs code examples or conceptual guidance, do not assume live wallet access is available.

## When To Use

- The user wants proportional distribution based on deposits.
- The user asks how to add a Launch Pool bucket.
- The user asks how users deposit, withdraw, transition, or claim in a launch pool.

## SDK Functions

- `addLaunchPoolBucketV2()` adds the Launch Pool bucket.
- `addUnlockedBucketV2()` commonly adds the treasury/end-behavior destination.
- `finalizeV2()` locks the configuration.
- `depositLaunchPoolV2()`, `withdrawLaunchPoolV2()`, `triggerBehaviors()`, and `claimLaunchPoolV2()` handle user lifecycle operations.

## CLI Quick Reference

```bash
mplx genesis bucket add-launch-pool <GENESIS> \
  --allocation <AMOUNT> \
  --depositStart <UNIX_TS> \
  --depositEnd <UNIX_TS> \
  --claimStart <UNIX_TS> \
  --claimEnd <UNIX_TS>

mplx genesis deposit <GENESIS> --amount <AMOUNT> --bucketIndex <N>
mplx genesis withdraw <GENESIS> --amount <AMOUNT> --bucketIndex <N>
mplx genesis transition <GENESIS> --bucketIndex <N>
mplx genesis claim <GENESIS> --bucketIndex <N>
```

Full CLI docs: /docs/dev-tools/cli/genesis/launch-pool

## Notes

- Launch Pool distribution is proportional: user share of deposits determines user share of tokens.
- Add end behaviors and an unlocked bucket when collected funds should route to treasury/team.
- `--endBehavior` format is `<destinationBucketAddress>:<percentageBps>`, where `10000` means 100%.
- Wrap SOL before manual deposits when the quote token is SOL.

## Related Pages

- Getting Started: /docs/smart-contracts/genesis/getting-started.md
- Presale: /docs/smart-contracts/genesis/presale.md
- Full CLI launch pool docs: /docs/dev-tools/cli/genesis/launch-pool
