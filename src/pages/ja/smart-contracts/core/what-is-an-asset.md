---
title: MPL Core Asset
metaTitle: Core Assetとは | Metaplex Core
description: SolanaでのCore Assetとは何かを学びます。シングルアカウントNFTモデル、アカウント構造、コレクションメンバーシップ、オフチェーンメタデータを理解します。
updated: '01-31-2026'
keywords:
  - Core Asset
  - NFT account
  - single-account NFT
  - asset structure
  - off-chain metadata
about:
  - NFT architecture
  - Account structure
  - Metadata storage
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
faqs:
  - q: CoreはToken Metadata NFTとどう違いますか？
    a: Token Metadataは3つ以上のアカウント（mint、metadata、token account）が必要です。Coreは単一のアカウントで所有者とメタデータを一緒に保存し、約80%安く高速です。
  - q: オンチェーンとオフチェーンで何が保存されますか？
    a: オンチェーンには所有者、名前、URI、update authority、プラグインが保存されます。オフチェーン（URI先）には説明、画像、属性、アニメーションURL、拡張メタデータが保存されます。
  - q: Token Metadata NFTをCoreに変換できますか？
    a: 直接はできません。別々の標準です。古いNFTをバーンして新しいCore Assetをミントする必要があります。移行ツールが役立ちます。
  - q: Coreは既存のNFTマーケットプレイスと互換性がありますか？
    a: ほとんどの主要なSolanaマーケットプレイスがCore Assetをサポートしています。現在のリストはEcosystem Supportを確認してください。
  - q: オフチェーンメタデータがオフラインになったらどうなりますか？
    a: Assetは名前とURIでオンチェーンに存在し続けますが、画像やオフチェーン属性は読み込まれません。オンチェーン属性（Attributesプラグイン経由）はアクセス可能のままです。ArweaveやピニングされたIPFSなどの永続ストレージを使用してください。
---
このページでは、**Core Assetとは何か**、従来のSolana NFTとどう違うかを説明します。アカウント構造、コレクションの関係、メタデータストレージを理解します。 {% .lead %}
{% callout title="主要概念" %}

- **シングルアカウントモデル**: Core AssetはAssetアカウント自体に所有権を保存します
- **トークンアカウント不要**: SPLトークンと異なり、CoreはAssociated Token Accountsを必要としません
- **コレクションメンバーシップ**: AssetはupdateAuthorityフィールドを通じてCollectionに属することができます
- **オフチェーンメタデータ**: URIがJSONメタデータを指します（Arweave/IPFSなどの永続ストレージが推奨）
{% /callout %}

## 概要

Core Assetは、NFTを表す単一のSolanaアカウントです。Token Metadata（3つ以上のアカウントが必要）と異なり、Coreはすべての重要データを1つのアカウントに保存します：所有者、名前、URI、update authority。これによりCore Assetは約80%安く、扱いやすくなります。

## 概要説明

[SolanaのTokenプログラム](https://spl.solana.com/token)などの既存のAssetプログラムとは異なり、Metaplex CoreとCore Asset（Core NFT Assetとも呼ばれる）はAssociated Token Accountsなどの複数のアカウントに依存しません。代わりに、Core AssetはウォレットとAsset自体の「mint」アカウント間の関係を保存します。
{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="wallet" label="誰かのウォレット" theme="transparent" /%}
{% node x="200" parent="wallet" %}
{% node #asset label="Asset Account" theme="blue" /%}
{% node label="Owner: Core Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="asset" theme="transparent" %}
所有者を含む、Assetに関する \
情報を保存
{% /node %}
{% edge from="wallet" to="asset" /%}
{% /diagram %}

## Core Assetアカウント

Core Assetアカウントは、デジタルアセットの最小限のデータを表します。この構造は、オンチェーン所有権のための意見のないブロックチェーンプリミティブを提供します。
{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="wallet" theme="transparent" /%}
{% node x="200" parent="wallet" %}
{% node #asset label="Asset Account" theme="blue" /%}
{% node label="Owner: Core Program" theme="dimmed" /%}
{% node label="Key = Asset" /%}
{% node label="Owner" /%}
{% node label="Update Authority" /%}
{% node label="Name" /%}
{% node label="URI" /%}
{% /node %}
{% node y="70" parent="asset" theme="transparent" %}
{% /node %}
{% edge from="wallet" to="asset" /%}
{% /diagram %}
{% seperator h="6" /%}
{% totem %}
{% totem-accordion title="オンチェーンAssetアカウント構造" %}
MPL Core Assetのオンチェーンアカウント構造。[リンク](https://github.com/metaplex-foundation/mpl-core/blob/ce5d16f2de3c0038caae81a8c6496420b1a0462a/programs/mpl-core/src/state/asset.rs#L19)

| 名前             | 型              | サイズ | 説明                                                      |                                                                                                                            |
| ---------------- | --------------- | ---- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| key              | u8              | 1    | アカウントタイプの識別子                                      |                                                                                                                            |
| owner            | pubKey          | 32   | Assetの所有者                                          |                                                                                                                            |
| update_authority | enum<publicKey> | 33   | 新しいAssetの権限またはCollectionID                  | [リンク](https://github.com/metaplex-foundation/mpl-core/blob/main/clients/rust/src/generated/types/update_authority.rs#L14) |
| name             | string          | 36   | Assetの名前                                           |                                                                                                                            |
| uri              | string          | 204  | オフチェーンデータを指すAssetのURI          |                                                                                                                            |
| seq              | string          |      | 圧縮でのインデックス用シーケンス番号          |                                                                                                                            |
{% /totem-accordion %}
{% /totem %}

## AssetはCollection内にありますか？

MPL Core AssetはCollectionに属することができます。MPL Core AssetデータのupdateAuthorityフィールドは2つの役割を果たします：Assetのupdate authorityを報告するか、所属するMPL Core CollectionのpublicKeyを提供するかです。
`updateAuthority`フィールドにアクセスする際、Asset経由で直接アクセスするか、MPL Core Assetの`collectionAddress`ヘルパー経由でアクセスするかにかかわらず、結果は以下のいずれかになります：
**Collection**
AssetはそのアドレスのCollectionに属しています。
{% dialect-switcher title="Assetの作成" %}
{% dialect title="JavaScript" id="js" %}

```javascript
{
  __kind: 'Collection'
  fields: [PublicKey]
}
import { fetchAssetV1 } from '@metaplex-foundation/mpl-core'
const asset = await fetchAssetV1(umi, assetAddress.publicKey)
const collectionId = collectionAddress(asset)
console.log({collectionId})
console.log({asset})
// ログ
collection: '2222222222222222222222222222222'
asset: {
    key: AssetV1,
    owner: "11111111111111111111111111111111",
    updateAuthority: {
      type: 'Collection',
      address: '2222222222222222222222222222222'
    },
    name: "My Core Asset",
    uri: "https://example.com/metadata.json",
    ...
}
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
Collection(Pubkey)
```

{% /dialect %}
{% /dialect-switcher %}
**Address**
Assetにはupdate authorityが設定されていますが、Collectionには属していません。
{% dialect-switcher title="Assetの作成" %}
{% dialect title="JavaScript" id="js" %}

```javascript
import { fetchAssetV1 } from '@metaplex-foundation/mpl-core'
const asset = await fetchAssetV1(umi, assetAddress.publicKey)
const collectionId = collectionAddress(asset)
console.log({collectionId})
console.log({asset})
// ログ
collectionId: undefined
asset: {
    key: AssetV1,
    owner: "11111111111111111111111111111111",
    updateAuthority: {
      type: 'Address',
      address: '2222222222222222222222222222222'
    }
    name: "My Core Asset",
    uri: "https://example.com/metadata.json",
    ...
}
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
Address(Pubkey)
```

{% /dialect %}
{% /dialect-switcher %}
**None**
Assetにはupdate authorityが設定されていません。
{% dialect-switcher title="Assetの作成" %}
{% dialect title="JavaScript" id="js" %}

```javascript
import { fetchAssetV1 } from '@metaplex-foundation/mpl-core'
const asset = await fetchAssetV1(umi, assetAddress.publicKey)
const collectionId = collectionAddress(asset)
console.log({collectionId})
console.log({asset})
// ログ
collectionId: undefined
asset: {
    key: AssetV1,
    owner: "11111111111111111111111111111111",
    updateAuthority: {
      type: 'None',
    },
    name: "My Core Asset",
    uri: "https://example.com/metadata.json",
}
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
None
```

{% /dialect %}
{% /dialect-switcher %}

## オフチェーンメタデータ

Assetアカウントの重要な属性の1つは、オフチェーンのJSONファイルを指す`URI`属性です。これは、オンチェーンデータの保存に伴う手数料に制約されることなく、追加データを安全に提供するために使用されます。そのJSONファイルは[特定の標準に従っており](/smart-contracts/token-metadata/token-standard)、誰でもトークンに関する有用な情報を見つけることができます。
オフチェーンメタデータは、パブリックにアクセス可能な任意の場所に保存できます。JSONファイルをホストする一般的な場所：

- Arweave
- NFT.Storage/IPFS
- Amazon AWS S3/Google Cloud
{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="wallet" theme="transparent" /%}
{% node x="200" parent="wallet" %}
{% node #asset label="Asset Account" theme="blue" /%}
{% node label="Owner: Core Program" theme="dimmed" /%}
{% node label="Key = Asset" /%}
{% node label="Owner" /%}
{% node label="Update Authority" /%}
{% node label="Name" /%}
{% node #uri label="URI" /%}
{% /node %}
{% node y="70" parent="asset" theme="transparent" %}
{% /node %}
{% node parent="uri" x="-200" y="-23" %}
{% node #json theme="slate" %}
オフチェーン \
JSONメタデータ
{% /node %}
{% node label="Name" /%}
{% node label="Description" /%}
{% node label="Image" /%}
{% node label="Animated URL" /%}
{% node label="Attributes" /%}
{% node label="..." /%}
{% /node %}
{% edge from="wallet" to="asset" /%}
{% edge from="uri" to="json" path="straight" /%}
{% /diagram %}
{% partial file="token-standard-full.md" /%}
{% totem %}
{% totem-accordion title="例" %}

```json
{
  "name": "SolanaArtProject #1",
  "description": "Generative art on Solana.",
  "image": "https://arweave.net/26YdhY_eAzv26YdhY1uu9uiA3nmDZYwP8MwZAultcE?ext=jpeg",
  "animation_url": "https://arweave.net/ZAultcE_eAzv26YdhY1uu9uiA3nmDZYwP8MwuiA3nm?ext=glb",
  "external_url": "https://example.com",
  "attributes": [
    {
      "trait_type": "trait1",
      "value": "value1"
    },
    {
      "trait_type": "trait2",
      "value": "value2"
    }
  ],
  "properties": {
    "files": [
      {
        "uri": "https://www.arweave.net/abcd5678?ext=png",
        "type": "image/png"
      },
      {
        "uri": "https://watch.videodelivery.net/9876jkl",
        "type": "unknown",
        "cdn": true
      },
      {
        "uri": "https://www.arweave.net/efgh1234?ext=mp4",
        "type": "video/mp4"
      }
    ],
    "category": "video"
  }
}
```

{% /totem-accordion %}
{% /totem %}
このJSONファイルは、Arweaveなどの永続ストレージソリューションを使用して保存し、更新できないようにすることができます。さらに、`Update Authority`フィールドをNoneに設定して不変にし、`URI`と`Name`属性の変更を禁止することができます。この組み合わせにより、オフチェーンJSONファイルの不変性を保証できます。

## FAQ

### CoreはToken Metadata NFTとどう違いますか？

Token Metadataは3つ以上のアカウント（mint、metadata、token account）が必要です。Coreは所有者とメタデータを一緒に保存する単一のアカウントを使用します。これによりCoreは約80%安く、作成が高速です。

### オンチェーンとオフチェーンで何が保存されますか？

**オンチェーン**: 所有者、名前、URI、update authority、プラグイン。**オフチェーン**（URI先）: 説明、画像、属性、アニメーションURL、その他の拡張メタデータ。

### Token Metadata NFTをCoreに変換できますか？

直接はできません。CoreとToken Metadataは別々の標準です。古いNFTをバーンして新しいCore Assetをミントする必要があります。このプロセスを支援する移行ツールがいくつかあります。

### Coreは既存のNFTマーケットプレイスと互換性がありますか？

ほとんどの主要なSolanaマーケットプレイスがCore Assetをサポートしています。互換性のあるプラットフォームの現在のリストは[Ecosystem Support](/ja/smart-contracts/core/ecosystem-support)を確認してください。

### オフチェーンメタデータがオフラインになったらどうなりますか？

Assetは名前とURIでオンチェーンに存在し続けますが、画像やオフチェーン属性はアクセスできなくなります。オンチェーン属性（[Attributesプラグイン](/ja/smart-contracts/core/plugins/attribute)経由）はアクセス可能のままです。これを防ぐために永続ストレージ（Arweave、ピニング付きIPFS）を使用してください。

## 用語集

| 用語 | 定義 |
|------|------------|
| **Asset** | NFTを表す単一のCoreアカウント |
| **Owner** | 現在Assetを所有しているウォレット |
| **Update Authority** | Assetメタデータの変更を許可されたアカウント |
| **URI** | オフチェーンJSONメタデータを指すURL |
| **Collection** | 関連するAssetをグループ化するCoreアカウント |
| **Key** | アカウントタイプを識別するアカウント識別子 |
| **seq** | 圧縮インデックスに使用されるシーケンス番号 |
