# Metaplex Core: Fetch Collection

Use this agent page when the user wants to read or inspect a Core Collection account.

Human page: https://metaplex.com/docs/smart-contracts/core/collections/fetch

## Agent Routing

- Default to SDK or API instructions when the user is building an app, backend, script, or integration.
- Use CLI commands when the user asks for terminal commands, manual setup, debugging, one-off execution, or verification.
- If both apply, use SDK or API first and include the CLI quick reference as an operational fallback.

## Environment Prerequisites

- For SDK or API operations, Umi must be installed, configured with an RPC endpoint, and configured with a signer wallet before sending transactions.
- For CLI operations, the Metaplex CLI must be installed and configured with an RPC endpoint and wallet/keypair before running state-changing commands.
- If the user only needs code examples or conceptual guidance, do not assume live wallet access is available.

## When To Use

- The user asks how to fetch a Core Collection by address.
- The user wants to inspect Collection metadata or plugin data.
- The user wants the CLI command to fetch a Collection.

## SDK Function

Use `fetchCollection(umi, collectionAddress)`.

## CLI Command

```bash
mplx core collection fetch <ADDR>
```

If the installed CLI differs from the reference, check:

```bash
mplx core collection --help
```

## Related Pages

- Create a Core Collection: /docs/smart-contracts/core/collections/create.md
- Fetch Core Assets: /docs/smart-contracts/core/fetch.md
- Core Collections overview: /docs/smart-contracts/core/collections
