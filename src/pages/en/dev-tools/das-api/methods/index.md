---
title: Methods
metaTitle: Methods | DAS API
description: Callable API Methods for the Metaplex DAS API client.
keywords:
  - DAS API methods
  - getAsset
  - getAssets
  - searchAssets
  - digital asset standard
  - Metaplex
about:
  - DAS API
  - Digital Asset Standard
proficiencyLevel: Intermediate
created: '07-08-2026'
updated: '07-13-2026'
---

## Summary

The DAS API methods index lists every JSON-RPC endpoint for fetching, proving, and searching digital assets on Solana across Core, Token Metadata, and compressed NFT standards.

- **Single and batch reads** — `getAsset`, `getAssets`, merkle proofs, and transaction signatures
- **Filtered lookups** — by owner, creator, authority, group, edition, and token account
- **Agent discovery** — `searchAssets` supports `isAgent`, `agentToken`, and `assetSigner` filters on indexed Core rows

## Quick Reference

| Method | Description |
|--------|-------------|
| [`getAsset`](/dev-tools/das-api/methods/get-asset) | Returns one compressed or standard asset including metadata and owner. `MplCoreAsset` responses may include agent fields (`is_agent`, `asset_signer`, `agent_token`); collection and group responses may include `is_agent: false`. |
| [`getAssets`](/dev-tools/das-api/methods/get-assets) | Returns multiple compressed or standard assets. Each item uses the same asset shape as `getAsset`; `MplCoreAsset` rows may include agent fields, while collection and group rows may also include `is_agent: false`. |
| [`getAssetProof`](/dev-tools/das-api/methods/get-asset-proof) | Returns the merkle tree proof for a compressed asset. |
| [`getAssetProofs`](/dev-tools/das-api/methods/get-asset-proofs) | Returns merkle tree proofs for multiple compressed assets. |
| [`getAssetSignatures`](/dev-tools/das-api/methods/get-asset-signatures) | Returns transaction signatures for compressed assets. |
| [`getAssetsByAuthority`](/dev-tools/das-api/methods/get-assets-by-authority) | Returns assets for an authority address. |
| [`getAssetsByCreator`](/dev-tools/das-api/methods/get-assets-by-creator) | Returns assets for a creator address. |
| [`getAssetsByGroup`](/dev-tools/das-api/methods/get-assets-by-group) | Returns assets for a group key/value pair, such as a collection. |
| [`getAssetsByOwner`](/dev-tools/das-api/methods/get-assets-by-owner) | Returns assets for an owner address. |
| [`getNftEditions`](/dev-tools/das-api/methods/get-nft-editions) | Returns printable editions for a master edition NFT mint. |
| [`getTokenAccounts`](/dev-tools/das-api/methods/get-token-accounts) | Returns token accounts by owner or mint. |
| [`searchAssets`](/dev-tools/das-api/methods/search-assets) | Returns assets matching search criteria. Supports agent filters (`isAgent`, `agentToken`, `assetSigner`) — see [Read Agent Data](/agents/read-agent-data#read-agent-data-via-das-api). |

## Notes

- Agent response fields (`is_agent`, `asset_signer`, `agent_token`) are indexed on Core interfaces; only individual `MplCoreAsset` rows can be agents (`is_agent: true`). See [`getAsset`](/dev-tools/das-api/methods/get-asset) for field details.
- `searchAssets` request parameters use camelCase (`isAgent`, `agentToken`, `assetSigner`); JSON-RPC responses use snake_case.
- Provider support for agent fields varies — confirm your [DAS provider](/solana/rpcs-and-das) runs an indexer with agent registry support.
