---
title: 方法
metaTitle: 方法 | DAS API
description: Metaplex DAS API 客户端的可调用 API 方法。
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

DAS API 方法索引列出了在 Solana 上获取、证明和搜索数字资产（涵盖 Core、Token Metadata 和压缩 NFT 标准）的全部 JSON-RPC 端点。

- **单条与批量读取** — `getAsset`、`getAssets`、默克尔证明和交易签名
- **筛选查询** — 按所有者、创建者、权限、分组、版本和代币账户
- **代理发现** — `searchAssets` 支持对已索引 Core 行使用 `isAgent`、`agentToken` 和 `assetSigner` 筛选器

## Quick Reference

| 方法 | 说明 |
|--------|-------------|
| [`getAsset`](/zh/dev-tools/das-api/methods/get-asset) | 返回一条压缩或标准资产，包括元数据和所有者。`MplCoreAsset` 响应可能包含代理字段（`is_agent`、`asset_signer`、`agent_token`）；集合和分组响应可能包含 `is_agent: false`。 |
| [`getAssets`](/zh/dev-tools/das-api/methods/get-assets) | 返回多条压缩或标准资产。每个项目使用与 `getAsset` 相同的资产形状；`MplCoreAsset` 行可能包含代理字段，而集合和分组行也可能包含 `is_agent: false`。 |
| [`getAssetProof`](/zh/dev-tools/das-api/methods/get-asset-proof) | 返回压缩资产的默克尔树证明。 |
| [`getAssetProofs`](/zh/dev-tools/das-api/methods/get-asset-proofs) | 返回多条压缩资产的默克尔树证明。 |
| [`getAssetSignatures`](/zh/dev-tools/das-api/methods/get-asset-signatures) | 返回压缩资产的交易签名。 |
| [`getAssetsByAuthority`](/zh/dev-tools/das-api/methods/get-assets-by-authority) | 返回指定权限地址的资产。 |
| [`getAssetsByCreator`](/zh/dev-tools/das-api/methods/get-assets-by-creator) | 返回指定创建者地址的资产。 |
| [`getAssetsByGroup`](/zh/dev-tools/das-api/methods/get-assets-by-group) | 返回指定分组键/值对（例如集合）的资产。 |
| [`getAssetsByOwner`](/zh/dev-tools/das-api/methods/get-assets-by-owner) | 返回指定所有者地址的资产。 |
| [`getNftEditions`](/zh/dev-tools/das-api/methods/get-nft-editions) | 返回主版 NFT 铸币的可打印版本。 |
| [`getTokenAccounts`](/zh/dev-tools/das-api/methods/get-token-accounts) | 按所有者或铸币返回代币账户。 |
| [`searchAssets`](/zh/dev-tools/das-api/methods/search-assets) | 返回符合搜索条件的资产。支持代理筛选器（`isAgent`、`agentToken`、`assetSigner`）——请参阅[读取代理数据](/zh/agents/read-agent-data#read-agent-data-via-das-api)。 |

## Notes

- 代理响应字段（`is_agent`、`asset_signer`、`agent_token`）在 Core 接口上建立索引；只有单个 `MplCoreAsset` 行可以是代理（`is_agent: true`）。详见 [`getAsset`](/zh/dev-tools/das-api/methods/get-asset)。
- `searchAssets` 请求参数使用 camelCase（`isAgent`、`agentToken`、`assetSigner`）；JSON-RPC 响应使用 snake_case。
- 各提供商对代理字段的支持不同——请确认您的 [DAS 提供商](/solana/rpcs-and-das) 运行支持代理注册表的索引器。
