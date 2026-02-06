---
title: Assetの作成
metaTitle: Assetの作成 | Metaplex Core
description: JavaScriptまたはRustを使用してSolanaでCore NFT Assetを作成する方法を学びます。メタデータのアップロード、コレクションへのミント、プラグインの追加を含みます。
updated: '01-31-2026'
keywords:
  - create NFT
  - mint NFT
  - Solana NFT
  - mpl-core create
  - upload metadata
about:
  - NFT minting
  - Metadata upload
  - Asset creation
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
howToSteps:
  - npm install @metaplex-foundation/mpl-core @metaplex-foundation/umiでSDKをインストール
  - メタデータJSONをArweaveまたはIPFSにアップロードしてURIを取得
  - メタデータURIでcreate(umi, { asset, name, uri })を呼び出す
  - core.metaplex.comでAssetを確認
howToTools:
  - Node.js
  - Umi framework
  - mpl-core SDK
  - Arweave or IPFS for storage
faqs:
  - q: Core AssetとToken Metadata NFTの違いは何ですか？
    a: Core Assetは単一アカウントを使用し、コストが約80%削減されます。Token Metadataは3つ以上のアカウント（mint、metadata、token）を使用します。新規プロジェクトにはCoreが推奨されます。
  - q: 1つのトランザクションで複数のアセットを作成できますか？
    a: いいえ。各create命令は1つのアセットを作成します。大量ミントにはCore Candy Machineまたはバッチトランザクションを使用してください。
  - q: 最初にCollectionを作成する必要がありますか？
    a: いいえ。AssetはCollectionなしで存在できます。ただし、Collectionはコレクションレベルのロイヤリティと操作を可能にします。
  - q: 別のウォレットにミントするにはどうすればよいですか？
    a: create関数でownerパラメータに受取人のアドレスを渡します。
  - q: どのメタデータ形式を使用すべきですか？
    a: name、description、image、およびオプションのattributes配列を含む標準NFTメタデータ形式を使用します。JSON Schemaドキュメントを参照してください。
---
このガイドでは、Metaplex Core SDKを使用してSolanaで**Core Asset**（NFT）を作成する方法を説明します。オフチェーンメタデータをアップロードし、オンチェーンAssetアカウントを作成し、オプションでCollectionに追加したりプラグインを添付したりします。 {% .lead %}
{% callout title="構築するもの" %}
以下を含むCore Asset：

- Arweaveに保存されたオフチェーンメタデータ（名前、画像、属性）
- 所有権とメタデータURIを持つオンチェーンAssetアカウント
- オプション：Collectionメンバーシップ
- オプション：プラグイン（ロイヤリティ、フリーズ、属性）
{% /callout %}

## 概要

メタデータJSONを分散ストレージにアップロードし、URIで`create()`を呼び出して**Core Asset**を作成します。Assetはスタンドアロンでミントするか、Collectionにミントでき、作成時にプラグインを含めることができます。

- メタデータJSONをArweave/IPFSにアップロードし、URIを取得
- name、URI、オプションのプラグインで`create()`を呼び出す
- コレクションの場合：`collection`パラメータを渡す
- アセットあたり約0.0029 SOLのコスト

## 対象外

Token Metadata NFT（mpl-token-metadataを使用）、圧縮NFT（Bubblegumを使用）、ファンジブルトークン（SPL Tokenを使用）、NFT移行。

## クイックスタート

**ジャンプ先：** [メタデータをアップロード](#uploading-off-chain-data) · [Assetを作成](#create-an-asset) · [Collectionと共に](#create-an-asset-into-a-collection) · [プラグインと共に](#create-an-asset-with-plugins)

1. インストール：`npm install @metaplex-foundation/mpl-core @metaplex-foundation/umi`
2. メタデータJSONをアップロードしてURIを取得
3. `create(umi, { asset, name, uri })`を呼び出す
4. [core.metaplex.com](https://core.metaplex.com)で確認

## 前提条件

- 署名者とRPC接続で構成された**Umi**
- トランザクション手数料用の**SOL**（アセットあたり約0.003 SOL）
- アップロード準備ができた**メタデータJSON**（名前、画像、属性）

## 作成プロセス

1. **オフチェーンデータをアップロード。** 名前、説明、画像URL、属性を含むJSONファイルを保存します。ファイルは公開**URI**経由でアクセス可能である必要があります。
2. **オンチェーンAssetアカウントを作成。** メタデータURIで`create`命令を呼び出してAssetをミントします。

## オフチェーンデータのアップロード

任意のストレージサービス（Arweave、IPFS、AWS）を使用してメタデータJSONをアップロードします。Umiは一般的なサービス用のアップローダープラグインを提供します。利用可能なすべてのメタデータフィールドについては[JSON Schema](/smart-contracts/core/json-schema)を参照してください。

```ts {% title="upload-metadata.ts" %}
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
// アップローダーを構成（Irys、AWSなど）
umi.use(irysUploader())
// 最初に画像をアップロード
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

## Assetを作成

`create`命令を使用して新しいCore Assetをミントします。
{% totem %}
{% totem-accordion title="技術的な命令の詳細" %}
**命令アカウント**

| アカウント | 説明 |
|---------|-------------|
| asset | 新しいMPL Core Assetのアドレス（署名者） |
| collection | Assetを追加するコレクション（オプション） |
| authority | 新しいアセットの権限 |
| payer | ストレージ手数料を支払うアカウント |
| owner | アセットを所有するウォレット |
| systemProgram | System Programアカウント |
**命令引数**
| 引数 | 説明 |
|----------|-------------|
| name | MPL Core Assetの名前 |
| uri | オフチェーンJSONメタデータURI |
| plugins | 作成時に追加するプラグイン（オプション） |
完全な命令の詳細：[GitHub](https://github.com/metaplex-foundation/mpl-core/blob/main/programs/mpl-core/src/instruction.rs)
{% /totem-accordion %}
{% /totem %}
{% code-tabs-imported from="core/create-asset" frameworks="umi" /%}

## CollectionにAssetを作成

Collectionの一部としてAssetを作成するには、`collection`パラメータを渡します。Collectionは既に存在している必要があります。
{% code-tabs-imported from="core/create-asset-in-collection" frameworks="umi" /%}
Collectionの作成については[Collection](/ja/smart-contracts/core/collections)を参照してください。

## プラグイン付きでAssetを作成

`plugins`配列で渡すことで、作成時にプラグインを追加します。この例ではRoyaltiesプラグインを追加します：
{% code-tabs-imported from="core/create-asset-with-plugins" frameworks="umi" /%}

### 一般的なプラグイン

よく使用されるプラグインをいくつか紹介します。完全なリストについては[プラグイン概要](/ja/smart-contracts/core/plugins)を参照してください。

- [Royalties](/ja/smart-contracts/core/plugins/royalties) - クリエイターロイヤリティの強制
- [Freeze Delegate](/ja/smart-contracts/core/plugins/freeze-delegate) - フリーズ/解除を許可
- [Burn Delegate](/ja/smart-contracts/core/plugins/burn-delegate) - バーンを許可
- [Transfer Delegate](/ja/smart-contracts/core/plugins/transfer-delegate) - 転送を許可
- [Update Delegate](/ja/smart-contracts/core/plugins/update-delegate) - メタデータ更新を許可
- [Attributes](/ja/smart-contracts/core/plugins/attribute) - オンチェーンキー/バリューデータ
完全なリストについては[プラグイン概要](/ja/smart-contracts/core/plugins)を参照してください。

## よくあるエラー

### `Asset account already exists`

アセットキーペアが既に使用されています。新しい署名者を生成してください：

```ts
const assetSigner = generateSigner(umi) // 一意である必要があります
```

### `Collection not found`

コレクションアドレスが存在しないか、有効なCore Collectionではありません。アドレスを確認し、最初にCollectionを作成したことを確認してください。

### `Insufficient funds`

支払者ウォレットにはレント用に約0.003 SOLが必要です。以下で資金を追加：

```bash
solana airdrop 1 <WALLET_ADDRESS> --url devnet
```

## 注意事項

- `asset`パラメータは**新しいキーペア**である必要があります - 既存のアカウントを再利用できません
- 別の所有者にミントする場合は、`owner`パラメータを渡します
- 作成時に追加されたプラグインは、後から追加するよりも安価です（1トランザクション対2トランザクション）
- すぐにフェッチするスクリプトでアセットを作成する場合は`commitment: 'finalized'`を使用

## クイックリファレンス

### プログラムID

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

Core Assetは単一アカウントを使用し、コストが約80%削減されます。Token Metadataは3つ以上のアカウント（mint、metadata、token）を使用します。新規プロジェクトにはCoreが推奨されます。

### 1つのトランザクションで複数のアセットを作成できますか？

いいえ。各`create`命令は1つのアセットを作成します。大量ミントには[Core Candy Machine](/smart-contracts/core-candy-machine)またはバッチトランザクションを使用してください。

### 最初にCollectionを作成する必要がありますか？

いいえ。AssetはCollectionなしで存在できます。ただし、Collectionはコレクションレベルのロイヤリティと操作を可能にします。

### 別のウォレットにミントするにはどうすればよいですか？

`owner`パラメータを渡します：

```ts
await create(umi, { asset, name, uri, owner: recipientAddress })
```

### どのメタデータ形式を使用すべきですか？

`name`、`description`、`image`、およびオプションの`attributes`配列を含む標準NFTメタデータ形式を使用します。[JSON Schema](/smart-contracts/core/json-schema)を参照してください。

## 用語集

| 用語 | 定義 |
|------|------------|
| **Asset** | NFTを表すCoreオンチェーンアカウント |
| **URI** | オフチェーンメタデータJSONを指すURL |
| **署名者** | トランザクションに署名するキーペア（アセットは作成時に署名者である必要があります） |
| **Collection** | 関連するAssetをグループ化するCoreアカウント |
| **Plugin** | Assetに動作を追加するモジュラー拡張機能 |
| **レント** | Solana上でアカウントを維持するために必要なSOL |
