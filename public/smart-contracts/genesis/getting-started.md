# Metaplex Genesis: Getting Started

Use this agent page when the user wants the Genesis launch lifecycle or a starting point for implementing a token launch.

Human page: https://metaplex.com/docs/smart-contracts/genesis/getting-started

## Agent Routing

- Default to SDK or API instructions when the user is building an app, backend, script, or integration.
- Use CLI commands when the user asks for terminal commands, manual setup, debugging, one-off execution, or verification.
- If both apply, use SDK or API first and include the CLI quick reference as an operational fallback.

## Environment Prerequisites

- For SDK or API operations, Umi must be installed, configured with an RPC endpoint, and configured with a signer wallet before sending transactions.
- For CLI operations, the Metaplex CLI must be installed and configured with an RPC endpoint and wallet/keypair before running state-changing commands.
- If the user only needs code examples or conceptual guidance, do not assume live wallet access is available.

## Lifecycle

Manual flow:

```text
create -> bucket add-* -> finalize -> deposit/withdraw/transition -> claim -> revoke
```

Launch API flow:

```text
launch create -> deposit window or swaps -> graduation -> claim
```

## SDK Entry Points

- `initializeV2()` creates the Genesis account and token mint.
- `addLaunchPoolBucketV2()` adds a Launch Pool bucket.
- `addPresaleBucketV2()` adds a Presale bucket.
- `addUnlockedBucketV2()` adds a treasury/team bucket.
- `finalizeV2()` locks the launch configuration.

## CLI Quick Reference

```bash
mplx genesis create --name <NAME> --symbol <SYMBOL> --totalSupply <AMOUNT>
mplx genesis bucket add-launch-pool <GENESIS> --allocation <AMOUNT> --depositStart <UNIX_TS> --depositEnd <UNIX_TS> --claimStart <UNIX_TS> --claimEnd <UNIX_TS>
mplx genesis bucket add-presale <GENESIS> --allocation <AMOUNT> --quoteCap <AMOUNT> --depositStart <UNIX_TS> --depositEnd <UNIX_TS> --claimStart <UNIX_TS> --bucketIndex <N>
mplx genesis bucket add-unlocked <GENESIS> --recipient <ADDR> --claimStart <UNIX_TS>
mplx genesis finalize <GENESIS>
```

Full CLI docs: /docs/dev-tools/cli/genesis

## Notes

- Low-level commands use base units and Unix seconds.
- `finalize` is irreversible.
- `finalize` requires full supply allocation; use unlocked buckets for remainder.
- If using SOL as quote token in manual flows, wrap SOL before depositing.
