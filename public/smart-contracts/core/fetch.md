# Metaplex Core: Fetch Asset Or Collection

Use this agent page when the user wants to fetch, read, inspect, or download a Metaplex Core Asset or Collection.

Human page: https://metaplex.com/docs/smart-contracts/core/fetch

## Agent Routing

- Default to SDK or API instructions when the user is building an app, backend, script, or integration.
- Use CLI commands when the user asks for terminal commands, manual setup, debugging, one-off execution, or verification.
- If both apply, use SDK or API first and include the CLI quick reference as an operational fallback.

## Environment Prerequisites

- For SDK or API operations, Umi must be installed, configured with an RPC endpoint, and configured with a signer wallet before sending transactions.
- For CLI operations, the Metaplex CLI must be installed and configured with an RPC endpoint and wallet/keypair before running state-changing commands.
- If the user only needs code examples or conceptual guidance, do not assume live wallet access is available.

## When To Use

- The user asks how to fetch a Core Asset by address.
- The user asks how to fetch a Core Collection by address.
- The user wants the CLI command to download asset or collection files.

## SDK Functions

- Fetch an asset with `fetchAsset(umi, publicKey)`.
- Fetch a collection with `fetchCollection(umi, publicKey)`.
- For large indexed queries, prefer DAS where available.

## CLI Commands

The CLI reference uses the `asset` and `collection` subcommands:

```bash
mplx core asset fetch <ADDR>
mplx core collection fetch <ADDR>
```

The human CLI docs may also show `mplx core fetch asset <assetId>` and `mplx core fetch collection <collectionId>`. Prefer the installed CLI help if there is a mismatch:

```bash
mplx core --help
mplx core asset --help
mplx core collection --help
```

## Common Flow

```bash
# Fetch a Core Asset.
mplx core asset fetch <ASSET_ADDRESS>

# Fetch a Core Collection.
mplx core collection fetch <COLLECTION_ADDRESS>
```

## Related Pages

- Create a Core Asset: /docs/smart-contracts/core/create-asset.md
- Update a Core Asset: /docs/smart-contracts/core/update.md
- Create a Core Collection: /docs/smart-contracts/core/collections/create.md
