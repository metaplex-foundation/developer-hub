# Metaplex Core: Transfer Asset

Use this agent page when the user wants to transfer ownership of a Core Asset to another wallet.

Human page: https://metaplex.com/docs/smart-contracts/core/transfer

## Agent Routing

- Default to SDK or API instructions when the user is building an app, backend, script, or integration.
- Use CLI commands when the user asks for terminal commands, manual setup, debugging, one-off execution, or verification.
- If both apply, use SDK or API first and include the CLI quick reference as an operational fallback.

## Environment Prerequisites

- For SDK or API operations, Umi must be installed, configured with an RPC endpoint, and configured with a signer wallet before sending transactions.
- For CLI operations, the Metaplex CLI must be installed and configured with an RPC endpoint and wallet/keypair before running state-changing commands.
- If the user only needs code examples or conceptual guidance, do not assume live wallet access is available.

## When To Use

- The user asks how to send a Core Asset to another wallet.
- The user asks for the CLI command to transfer a Core Asset.
- The user asks whether collection data is needed for CLI transfer.

## SDK Function

Use `transfer(umi, { asset, newOwner })`. For SDK code, include collection data when required by the asset state or surrounding docs.

## CLI Command

```bash
mplx core asset transfer <ASSETID> <NEW_OWNER>
```

Notes:

- The CLI auto-detects the Collection from the asset.
- Only the owner or an authorized Transfer Delegate can transfer the asset.
- Transfer changes ownership, not update authority.

## Related Pages

- Fetch before transfer: /docs/smart-contracts/core/fetch.md
- Update metadata instead: /docs/smart-contracts/core/update.md
- Transfer Delegate plugin: /docs/smart-contracts/core/plugins/transfer-delegate
