---
title: メソッド
metaTitle: メソッド | DAS API
description: Metaplex DAS APIクライアントの呼び出し可能なAPIメソッド。
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

DAS APIメソッド一覧は、Core、Token Metadata、圧縮NFTの各標準にわたるSolana上のデジタルアセットの取得、証明、検索に使うJSON-RPCエンドポイントをまとめています。

- **単一・一括読み取り** — `getAsset`、`getAssets`、マークル証明、トランザクション署名
- **フィルター付き検索** — オーナー、クリエイター、オーソリティ、グループ、エディション、トークンアカウント別
- **エージェント検索** — `searchAssets`はインデックス済みCore行に対する`isAgent`、`agentToken`、`assetSigner`フィルターをサポート

## Quick Reference

| メソッド | 説明 |
|--------|-------------|
| [`getAsset`](/ja/dev-tools/das-api/methods/get-asset) | 圧縮または標準アセット1件のメタデータとオーナーを返します。`MplCoreAsset`レスポンスにはエージェントフィールド（`is_agent`、`asset_signer`、`agent_token`）が含まれる場合があり、コレクションとグループのレスポンスには`is_agent: false`が含まれる場合があります。 |
| [`getAssets`](/ja/dev-tools/das-api/methods/get-assets) | 複数の圧縮または標準アセットを返します。各アイテムは`getAsset`と同じアセット形状を使用し、`MplCoreAsset`行にはエージェントフィールドが含まれる場合があり、コレクションとグループの行には`is_agent: false`が含まれる場合もあります。 |
| [`getAssetProof`](/ja/dev-tools/das-api/methods/get-asset-proof) | 圧縮アセットのマークルツリー証明を返します。 |
| [`getAssetProofs`](/ja/dev-tools/das-api/methods/get-asset-proofs) | 複数の圧縮アセットのマークルツリー証明を返します。 |
| [`getAssetSignatures`](/ja/dev-tools/das-api/methods/get-asset-signatures) | 圧縮アセットのトランザクション署名を返します。 |
| [`getAssetsByAuthority`](/ja/dev-tools/das-api/methods/get-assets-by-authority) | オーソリティアドレスに紐づくアセットを返します。 |
| [`getAssetsByCreator`](/ja/dev-tools/das-api/methods/get-assets-by-creator) | クリエイターアドレスに紐づくアセットを返します。 |
| [`getAssetsByGroup`](/ja/dev-tools/das-api/methods/get-assets-by-group) | グループのキー/値ペア（コレクションなど）に紐づくアセットを返します。 |
| [`getAssetsByOwner`](/ja/dev-tools/das-api/methods/get-assets-by-owner) | オーナーアドレスに紐づくアセットを返します。 |
| [`getNftEditions`](/ja/dev-tools/das-api/methods/get-nft-editions) | マスターエディションNFTミントの印刷可能なエディションを返します。 |
| [`getTokenAccounts`](/ja/dev-tools/das-api/methods/get-token-accounts) | オーナーまたはミント別のトークンアカウントを返します。 |
| [`searchAssets`](/ja/dev-tools/das-api/methods/search-assets) | 検索条件に一致するアセットを返します。エージェントフィルター（`isAgent`、`agentToken`、`assetSigner`）をサポート — [エージェントデータの読み取り](/ja/agents/read-agent-data#read-agent-data-via-das-api)を参照。 |

## Notes

- エージェント応答フィールド（`is_agent`、`asset_signer`、`agent_token`）はCoreインターフェースでインデックスされます。エージェント（`is_agent: true`）になり得るのは個別の`MplCoreAsset`行のみです。詳細は[`getAsset`](/ja/dev-tools/das-api/methods/get-asset)を参照してください。
- `searchAssets`のリクエストパラメータはcamelCase（`isAgent`、`agentToken`、`assetSigner`）を使用し、JSON-RPCレスポンスはsnake_caseを使用します。
- エージェントフィールドのプロバイダーサポートは異なります — [DASプロバイダー](/solana/rpcs-and-das)がエージェントレジストリサポート付きのインデクサーを実行していることを確認してください。
