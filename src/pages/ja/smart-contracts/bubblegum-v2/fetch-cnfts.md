---
title: 圧縮NFTの取得
metaTitle: 圧縮NFTの取得 - Bubblegum V2
description: Bubblegumで圧縮NFTを取得する方法を学びます。
created: '01-15-2025'
updated: '02-24-2026'
keywords:
  - fetch compressed NFT
  - read cNFT
  - DAS API
  - digital asset standard
  - getAsset
  - getAssetProof
  - getAssetsByOwner
about:
  - Compressed NFTs
  - DAS API
  - NFT indexing
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---

## Summary

**Fetching compressed NFTs** retrieves cNFT data and proofs using the Metaplex DAS API. This page covers the DAS API setup, asset IDs, fetching individual and multiple cNFTs, and retrieving proofs.

- Install and configure the Metaplex DAS API SDK
- Fetch individual cNFTs using getAsset and their proofs using getAssetProof
- Fetch multiple cNFTs by owner or by collection
- Derive Leaf Asset IDs from merkle tree addresses and leaf indices

## Out of Scope


[概要](/ja/smart-contracts/bubblegum#read-api)ページで述べたように、圧縮NFTは通常のNFTのようにオンチェーンアカウント内に保存されるのではなく、それらを作成し更新したトランザクションにログされます。 {% .lead %}

そのため、圧縮NFTの取得を容易にするために特別なインデクサーが作成されました。このインデックス化されたデータは、**Metaplex DAS API**と呼ぶSolana RPCメソッドの拡張を通じて利用できます。実際、DAS APIは任意の**デジタルアセット**を取得できます。これは圧縮NFT、通常のNFT、またはFungibleアセットでもかまいません。

すべてのRPCがDAS APIをサポートしているわけではないため、圧縮NFTを扱う予定がある場合は、RPCプロバイダーを慎重に選択する必要があります。Metaplex DAS APIをサポートするすべてのRPCのリストを[専用ページ](/ja/rpc-providers)で維持していることに注意してください。

このページでは、Metaplex DAS APIを使用して圧縮NFTを取得する方法を学習します。

## Metaplex DAS API SDKのインストール

Metaplex DAS APIをサポートするRPCプロバイダーを選択したら、特別なRPCメソッドを送信して圧縮NFTを取得できます。ただし、私たちのSDKは、ヘルパーメソッドを提供することでDAS APIを開始するより便利な方法を提供します。SDKを使用してMetaplex DAS APIを開始するには、以下の手順に従ってください。

{% totem %}

{% dialect-switcher title="Metaplex DAS APIを開始" %}
{% dialect title="JavaScript" id="js" %}

{% totem-prose %}
Umiを使用する場合、Metaplex DAS APIプラグインは`mplBubblegum`プラグイン内に自動的にインストールされます。そのため、すでに準備完了です！

`mplBubblegum`プラグイン全体をインポートせずに_のみ_DAS APIプラグインを使用したい場合は、Metaplex DAS APIプラグインを直接インストールできます：

```sh
npm install @metaplex-foundation/digital-asset-standard-api
```

その後、Umiインスタンスでライブラリを登録します：

```ts
import { dasApi } from '@metaplex-foundation/digital-asset-standard-api';

umi.use(dasApi());
```
{% /totem-prose %}

## Notes

- Not all RPC providers support the DAS API. Check the [RPC Providers](/rpc-providers) page for compatible options.
- The DAS API plugin is automatically included when you install `mplBubblegum` — no separate installation needed.
- Proofs fetched via `getAssetProof` may become stale if the tree is modified. Always fetch fresh proofs before performing write operations.

## FAQ

#

## Glossary

| Term | Definition |
|------|------------|
| **DAS API** | Digital Asset Standard API — an RPC extension for fetching compressed and standard NFT data |
| **Asset ID** | A unique identifier for an NFT. For cNFTs, it is a PDA derived from the merkle tree and leaf index |
| **Leaf Asset ID** | The PDA-based identifier specific to compressed NFTs, derived from tree address and leaf index |
| **getAsset** | DAS API method that returns metadata, ownership, and compression info for a digital asset |
| **getAssetProof** | DAS API method that returns the merkle proof and root needed for write operations on a cNFT |
| **getAssetsByOwner** | DAS API method that returns all assets owned by a given wallet address |
| **getAssetsByGroup** | DAS API method that returns all assets in a given group (e.g., collection) |
