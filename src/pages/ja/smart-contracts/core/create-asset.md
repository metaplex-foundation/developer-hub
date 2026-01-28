---
title: Assetの作成
metaTitle: Assetの作成 | Metaplex Core
description: JavaScriptまたはRustを使用してSolana上でCore NFT Assetを作成する方法を学びます。メタデータのアップロード、Collectionへのミント、プラグインの追加を含みます。
---

このガイドでは、Metaplex Core SDKを使用してSolana上で**Core Asset**（NFT）を作成する方法を説明します。オフチェーンメタデータのアップロード、オンチェーンAssetアカウントの作成、そしてオプションでCollectionへの追加やプラグインのアタッチを行います。 {% .lead %}

{% callout title="構築するもの" %}

以下を含むCore Asset：
- Arweave/IPFSに保存されたオフチェーンメタデータ（名前、画像、属性）
- 所有権とメタデータURIを持つオンチェーンAssetアカウント
- オプション：Collectionメンバーシップ
- オプション：プラグイン（ロイヤリティ、フリーズ、属性）

{% /callout %}

## 概要

分散型ストレージにメタデータJSONをアップロードし、そのURIで`create()`を呼び出して**Core Asset**を作成します。Assetはスタンドアロンでミントすることも、Collectionにミントすることもでき、作成時にプラグインを含めることができます。

- メタデータJSONをArweave/IPFSにアップロードし、URIを取得
- 名前、URI、オプションのプラグインで`create()`を呼び出す
- Collectionの場合：`collection`パラメータを渡す
- Assetあたり約0.0029 SOLかかる

## 対象外

Token Metadata NFT（mpl-token-metadataを使用）、圧縮NFT（Bubblegumを使用）、Fungible Token（SPL Tokenを使用）、NFT移行。

## クイックスタート

**移動先：** [メタデータのアップロード](#オフチェーンデータのアップロード) · [Assetの作成](#assetの作成) · [Collection付き](#collectionへのasset作成) · [プラグイン付き](#プラグイン付きassetの作成)

1. インストール: `npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. メタデータJSONをアップロードしてURIを取得
3. `create(umi, { asset, name, uri })`を呼び出す
4. [core.metaplex.com](https://core.metaplex.com)で確認

## 前提条件

- **Umi** - signerとRPC接続が設定済み
- **SOL** - トランザクション手数料用（Assetあたり約0.003 SOL）
- **メタデータJSON** - アップロード準備完了（名前、画像、属性）

## 作成プロセス

1. **オフチェーンデータのアップロード。** 名前、説明、画像URL、属性を含むJSONファイルを保存します。ファイルは公開**URI**経由でアクセス可能である必要があります。
2. **オンチェーンAssetアカウントの作成。** メタデータURIで`create`インストラクションを呼び出してAssetをミントします。

## オフチェーンデータのアップロード

任意のストレージサービス（Arweave、IPFS、AWS）を使用してメタデータJSONをアップロードします。Umiは一般的なサービス用のアップローダープラグインを提供しています。

```ts {% title="upload-metadata.ts" %}
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'

// アップローダーを設定（Irys、AWSなど）
umi.use(irysUploader())

// まず画像をアップロード
const [imageUri] = await umi.uploader.upload([imageFile])

// メタデータJSONをアップロード
const uri = await umi.uploader.uploadJson({
  name: 'My NFT',
  description: 'This is my NFT',
  image: imageUri,
  attributes: [
    { trait_type: 'Background', value: 'Blue' },
  ],
})
```

**URI**を取得したら、Assetを作成できます。

## Assetの作成

`create`インストラクションを使用して新しいCore Assetをミントします。

{% totem %}
{% totem-accordion title="技術的インストラクション詳細" %}
**インストラクションアカウント**

| アカウント | 説明 |
|---------|-------------|
| asset | 新しいMPL Core Assetのアドレス（signer） |
| collection | Assetを追加するCollection（オプション） |
| authority | 新しいAssetの権限 |
| payer | ストレージ手数料を支払うアカウント |
| owner | Assetを所有するウォレット |
| systemProgram | System Programアカウント |

**インストラクション引数**

| 引数 | 説明 |
|----------|-------------|
| name | MPL Core Assetの名前 |
| uri | オフチェーンJSONメタデータURI |
| plugins | 作成時に追加するプラグイン（オプション） |

完全なインストラクション詳細：[GitHub](https://github.com/metaplex-foundation/mpl-core/blob/main/programs/mpl-core/src/instruction.rs)

{% /totem-accordion %}
{% /totem %}

{% code-tabs-imported from="core/create-asset" frameworks="umi" /%}

## CollectionへのAsset作成

CollectionにAssetを作成するには、`collection`パラメータを渡します。Collectionは既に存在している必要があります。

{% code-tabs-imported from="core/create-asset-in-collection" frameworks="umi" /%}

Collectionの作成については[Collections](/ja/smart-contracts/core/collections)を参照してください。

## プラグイン付きAssetの作成

`plugins`配列にプラグインを渡すことで、作成時にプラグインを追加します。この例ではRoyaltiesプラグインを追加します：

{% code-tabs-imported from="core/create-asset-with-plugins" frameworks="umi" /%}

### 利用可能なプラグイン

- [Royalties](/ja/smart-contracts/core/plugins/royalties) - クリエイターロイヤリティの強制
- [Freeze Delegate](/ja/smart-contracts/core/plugins/freeze-delegate) - フリーズ/アンフリーズを許可
- [Burn Delegate](/ja/smart-contracts/core/plugins/burn-delegate) - バーンを許可
- [Transfer Delegate](/ja/smart-contracts/core/plugins/transfer-delegate) - 転送を許可
- [Update Delegate](/ja/smart-contracts/core/plugins/update-delegate) - メタデータ更新を許可
- [Attributes](/ja/smart-contracts/core/plugins/attribute) - オンチェーンキー/値データ

完全なリストは[プラグイン概要](/ja/smart-contracts/core/plugins)を参照してください。

## よくあるエラー

### `Asset account already exists`

Assetキーペアが既に使用されています。新しいsignerを生成してください：

```ts
const assetSigner = generateSigner(umi) // 一意である必要があります
```

### `Collection not found`

Collectionアドレスが存在しないか、有効なCore Collectionではありません。アドレスを確認し、先にCollectionを作成しているか確認してください。

### `Insufficient funds`

支払いウォレットにはレント用に約0.003 SOLが必要です。以下でチャージしてください：

```bash
solana airdrop 1 <WALLET_ADDRESS> --url devnet
```

## 注意事項

- `asset`パラメータは**新しいキーペア**である必要があります - 既存のアカウントを再利用できません
- 別のオーナーにミントする場合は`owner`パラメータを渡します
- 作成時にプラグインを追加する方が、後から追加するより安価です（1トランザクション対2トランザクション）
- すぐにAssetを取得するスクリプトでは`commitment: 'finalized'`を使用してください

## クイックリファレンス

### Program ID

| ネットワーク | アドレス |
|---------|---------|
| Mainnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
| Devnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |

### 最小コード

```ts {% title="minimal-create.ts" %}
import { generateSigner } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'

const asset = generateSigner(umi)
await create(umi, { asset, name: 'My NFT', uri: 'https://...' }).sendAndConfirm(umi)
```

### コスト内訳

| 項目 | コスト |
|------|------|
| Assetアカウントレント | 約0.0029 SOL |
| トランザクション手数料 | 約0.000005 SOL |
| **合計** | **約0.003 SOL** |

## FAQ

### Core AssetとToken Metadata NFTの違いは何ですか？

Core Assetは単一のアカウントを使用し、約80%安くなります。Token Metadataは3つ以上のアカウント（mint、metadata、token）を使用します。新規プロジェクトにはCoreが推奨されます。

### 1つのトランザクションで複数のAssetを作成できますか？

いいえ。各`create`インストラクションは1つのAssetを作成します。大量ミントには[Core Candy Machine](/ja/smart-contracts/core-candy-machine)またはバッチトランザクションを使用してください。

### 最初にCollectionを作成する必要がありますか？

いいえ。AssetはCollectionなしでも存在できます。ただし、Collectionsはコレクションレベルのロイヤリティと操作を可能にします。

### 別のウォレットにミントするにはどうすればよいですか？

`owner`パラメータを渡します：

```ts
await create(umi, { asset, name, uri, owner: recipientAddress })
```

### どのメタデータ形式を使用すべきですか？

`name`、`description`、`image`、オプションの`attributes`配列を含む標準NFTメタデータ形式を使用してください。[JSON Schema](/ja/smart-contracts/core/json-schema)を参照してください。

## 用語集

| 用語 | 定義 |
|------|------------|
| **Asset** | NFTを表すCoreオンチェーンアカウント |
| **URI** | オフチェーンメタデータJSONを指すURL |
| **Signer** | トランザクションに署名するキーペア（Assetは作成時にsignerである必要があります） |
| **Collection** | 関連するAssetをグループ化するCoreアカウント |
| **Plugin** | Assetに動作を追加するモジュール拡張 |
| **Rent** | Solana上でアカウントを維持するために必要なSOL |

---

*Metaplex Foundationによって管理 · 最終確認日 2026年1月 · @metaplex-foundation/mpl-coreに適用*
