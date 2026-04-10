# Metaplex Genesis

Use this agent page when the user asks about Genesis token launches, launch mechanisms, or the overall Genesis CLI/SDK flow.

Human page: https://metaplex.com/docs/smart-contracts/genesis

## Agent Routing

- Default to SDK or API instructions when the user is building an app, backend, script, or integration.
- Use CLI commands when the user asks for terminal commands, manual setup, debugging, one-off execution, or verification.
- If both apply, use SDK or API first and include the CLI quick reference as an operational fallback.

## Environment Prerequisites

- For SDK or API operations, Umi must be installed, configured with an RPC endpoint, and configured with a signer wallet before sending transactions.
- For CLI operations, the Metaplex CLI must be installed and configured with an RPC endpoint and wallet/keypair before running state-changing commands.
- If the user only needs code examples or conceptual guidance, do not assume live wallet access is available.

## When To Use

- The user asks what Genesis is or which launch type to use.
- The user asks for the high-level Genesis lifecycle.
- The user asks for a CLI overview before choosing a specific flow.

## Concepts

- Genesis creates and manages token launches on Solana.
- Launch types include Launch Pool, Presale, and Bonding Curve.
- Low-level flow: create Genesis account, add buckets, finalize, deposit or swap, claim, optionally revoke authorities.
- API flow: `genesis launch create` handles creation and platform registration in one command.

## CLI Quick Reference

```bash
# Recommended all-in-one launch API flow.
mplx genesis launch create --name <NAME> --symbol <SYMBOL> --image <IRYS_URL> ...

# Manual setup flow.
mplx genesis create --name <NAME> --symbol <SYMBOL> --totalSupply <AMOUNT>
mplx genesis bucket add-launch-pool <GENESIS> ...
mplx genesis bucket add-presale <GENESIS> ...
mplx genesis bucket add-unlocked <GENESIS> ...
mplx genesis finalize <GENESIS>
mplx genesis fetch <GENESIS>
mplx genesis bucket fetch <GENESIS> --bucketIndex <N> --type <TYPE>
```

Full CLI docs: /docs/dev-tools/cli/genesis

## Route To Task Pages

- Launch Pool: /docs/smart-contracts/genesis/launch-pool.md
- Presale: /docs/smart-contracts/genesis/presale.md
- Bonding Curve overview: /docs/smart-contracts/genesis/bonding-curve.md
- Bonding Curve launch via API: /docs/smart-contracts/genesis/bonding-curve-launch.md
- Bonding Curve swaps: /docs/smart-contracts/genesis/bonding-curve-swaps.md
- API Client SDK: /docs/smart-contracts/genesis/sdk/api-client.md
