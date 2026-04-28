---
title: Core Collections
metaTitle: Core Collections 概要 | Metaplex Core
description: Solana上のCore Collectionsの概要 — Assetのグループ化、共有メタデータの保存、コレクションレベルのプラグイン適用について。
updated: '04-08-2026'
keywords:
  - NFT collection
  - Core Collection
  - mpl-core collection
  - group NFTs
  - collection metadata
about:
  - NFT collections
  - Collection management
proficiencyLevel: Beginner
faqs:
  - q: CollectionとAssetの違いは何ですか？
    a: CollectionはAssetをまとめるコンテナです。独自のメタデータを持ちますが、Assetのように所有・転送することはできません。Assetはユーザーが所有する実際のNFTです。
  - q: 既存のAssetをCollectionに追加できますか？
    a: はい、newCollectionパラメータを使用してupdate命令を使います。AssetのUpdate Authorityが対象CollectionへのAsset追加権限を持っている必要があります。
  - q: NFTにCollectionは必要ですか？
    a: いいえ。AssetはCollectionなしで単独で存在できます。ただし、Collectionによりコレクションレベルのロイヤリティ設定、発見しやすさの向上、バッチ操作が可能になります。
  - q: CollectionからAssetを削除できますか？
    a: はい、update命令を使ってAssetのコレクションを変更します。AssetとCollection両方の適切なAuthorityが必要です。
  - q: Collectionを削除するとどうなりますか？
    a: CollectionはAssetが含まれている間は削除できません。先にすべてのAssetを削除してから、CollectionアカウントをCloseしてください。
---

## Summary

**Core Collection**は、関連する[Core Asset](/smart-contracts/core/what-is-an-asset)を共有のメタデータとプラグインの下にグループ化するSolanaアカウントです。

- Collectionは名前、URI、およびすべてのメンバーAssetに適用されるオプションのプラグインを保存します
- Assetは作成時または更新時に`collection`フィールドを通じてCollectionを参照します
- コレクションレベルのプラグイン（例：[Royalties](/smart-contracts/core/plugins/royalties)）は、Assetレベルで上書きされない限りすべてのメンバーAssetに継承されます
- Collectionの作成にはレントとして約0.0015 SOLが必要です

**タスクへジャンプ：** [Collectionの作成](/smart-contracts/core/collections/create) · [Collectionの取得](/smart-contracts/core/collections/fetch) · [Collectionの更新](/smart-contracts/core/collections/update)

## Collectionとは？

Core Collectionは、同じシリーズやセットに属するAssetのグループです。Assetをまとめるには、まずコレクション名や画像URIなどの共有メタデータを保存するCollectionアカウントを作成します。Collectionアカウントはコレクションのフロントカバーとして機能し、コレクション全体のプラグインも保持できます。

Collectionアカウントに保存されるデータは次のとおりです：

| フィールド | 説明 |
| --- | --- |
| key | アカウントキーの識別子 |
| updateAuthority | Collectionの管理者 |
| name | コレクション名 |
| uri | コレクションのオフチェーンメタデータへのURI |
| numMinted | コレクションで作成された総Asset数 |
| currentSize | 現在コレクション内にあるAsset数 |

{% callout type="note" %}
Core CollectionはCore Assetのみをグループ化します。Token Metadata NFTには[mpl-token-metadata](https://developers.metaplex.com/token-metadata)を、圧縮NFTには[Bubblegum](/smart-contracts/bubblegum)を使用してください。
{% /callout %}

## コレクションメンバーシップの管理

Assetは作成後に`update`命令を使って、Collectionへの追加・移動・削除ができます。これらの操作はAssetの[update authority](/smart-contracts/core/update)を変更します。追加するとCollectionに設定され、削除するとウォレットアドレスに戻ります。

| 操作 | 説明 | ガイド |
|-----------|-------------|-------|
| AssetをCollectionに追加 | スタンドアローンのAssetをCollectionに割り当てる | [SDK](/smart-contracts/core/update#add-an-asset-to-a-collection) · [CLI](/dev-tools/cli/core/update-asset#add-an-asset-to-a-collection) |
| Assetを別のCollectionに移動 | AssetをあるCollectionから別のCollectionに移す | [SDK](/smart-contracts/core/update#change-the-collection-of-a-core-asset) · [CLI](/dev-tools/cli/core/update-asset#move-an-asset-to-a-different-collection) |
| CollectionからAssetを削除 | Assetを切り離してスタンドアローンに戻す | [SDK](/smart-contracts/core/update#remove-an-asset-from-a-collection) · [CLI](/dev-tools/cli/core/update-asset#remove-an-asset-from-a-collection) |

{% callout type="note" %}
メンバーシップを変更するにはCollectionのupdate authority（スタンドアローンの場合はAssetも）である必要があります。Collection間の移動には移動元と移動先両方のCollectionの権限が必要です。

**Collection**に登録された[Update Delegate](/smart-contracts/core/plugins/update-delegate)も、ルートupdate authorityの署名なしにこれらの操作を実行できます。CollectionからのAsset削除、および権限を持つAssetの追加が可能です。
{% /callout %}

## Notes

- AssetはCollectionなしで単独で存在できます — Collectionは必須ではありません
- コレクションレベルのプラグインは、同じタイプの独自プラグインを持つAssetを除き、メンバーAssetに継承されます
- `numMinted`はコレクションで作成されたすべてのAssetの累計数、`currentSize`はライブカウントです
- CollectionはAssetが含まれている間はCloseできません — 先にすべてのAssetを削除してください

## Quick Reference

### プログラムID

| ネットワーク | アドレス |
|---------|---------|
| Mainnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
| Devnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |

### Collectionの操作

| 操作 | ページ | SDK関数 |
|-----------|------|--------------|
| Collectionの作成 | [Collectionの作成](/smart-contracts/core/collections/create) | `createCollection` |
| Collectionの取得 | [Collectionの取得](/smart-contracts/core/collections/fetch) | `fetchCollection` |
| Collectionメタデータの更新 | [Collectionの更新](/smart-contracts/core/collections/update) | `updateCollection` |
| Collectionプラグインの更新 | [Collectionの更新](/smart-contracts/core/collections/update) | `updateCollectionPlugin` |

### コスト内訳

| 項目 | コスト |
|------|------|
| Collectionアカウントのレント | 約0.0015 SOL |
| トランザクション手数料 | 約0.000005 SOL |
| **合計** | **約0.002 SOL** |

## FAQ

### CollectionとAssetの違いは何ですか？

CollectionはAssetをまとめるコンテナです。独自のメタデータ（名前、画像）を持ちますが、Assetのように所有・転送することはできません。Assetはユーザーが所有する実際のNFTです。

### 既存のAssetをCollectionに追加できますか？

はい、`newCollection`パラメータを使用して`update`命令を使います。AssetのUpdate Authorityが対象CollectionへのAsset追加権限を持っている必要があります。

### NFTにCollectionは必要ですか？

いいえ。AssetはCollectionなしで単独で存在できます。ただし、Collectionによりコレクションレベルのロイヤリティ設定、発見しやすさの向上、バッチ操作が可能になります。

### CollectionからAssetを削除できますか？

はい、`update`命令を使ってAssetのコレクションを変更します。AssetとCollection両方の適切なAuthorityが必要です。

### Collectionを削除するとどうなりますか？

CollectionはAssetが含まれている間は削除できません。先にすべてのAssetを削除してから、CollectionアカウントをCloseしてください。

## Glossary

| 用語 | 定義 |
|------|------------|
| **Collection** | 関連するAssetを共有メタデータの下にグループ化するCoreアカウント |
| **Update Authority** | Collectionのメタデータとプラグインを変更できるアカウント |
| **numMinted** | Collectionで作成されたAssetの総数を追跡するカウンター |
| **currentSize** | 現在Collection内にあるAsset数 |
| **Collection Plugin** | すべてのメンバーAssetに適用される可能性のあるCollectionに付与されたプラグイン |
| **URI** | CollectionのオフチェーンJSONメタデータを指すURL |
