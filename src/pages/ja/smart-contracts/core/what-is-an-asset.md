---
title: MPL Core Asset
metaTitle: Core Assetとは | Metaplex Core
description: SolanaでCore Assetとは何かを学びます。単一アカウントNFTモデル、アカウント構造、コレクションメンバーシップ、オフチェーンメタデータを理解します。
---

このページでは、**Core Assetとは何か**、そして従来のSolana NFTとどのように異なるかを説明します。アカウント構造、コレクションの関係、メタデータの保存について理解します。 {% .lead %}

{% callout title="主要概念" %}

- **単一アカウントモデル**: Core AssetはAssetアカウント自体内に所有権を保存します
- **トークンアカウント不要**: SPLトークンとは異なり、CoreはAssociated Token Accountを必要としません
- **コレクションメンバーシップ**: AssetはupdateAuthorityフィールドを介してコレクションに属することができます
- **オフチェーンメタデータ**: URIはArweave/IPFSに保存されたJSONメタデータを指します

{% /callout %}

## 概要

Core Assetは、NFTを表す単一のSolanaアカウントです。Token Metadata（3つ以上のアカウントを必要とする）とは異なり、Coreは1つのアカウントにすべての重要なデータを保存します：所有者、名前、URI、Update Authority。これにより、Core Assetは約80%安価で、扱いやすくなります。

## 概要

[SolanaのTokenプログラム](https://spl.solana.com/token)などの既存のアセットプログラムとは異なり、Metaplex CoreとCore Asset（Core NFT Assetとも呼ばれる）は、Associated Token Accountなどの複数のアカウントに依存しません。代わりに、Core Assetはウォレットと「mint」アカウントとの関係をアセット自体の中に保存します。

{% diagram %}
{% node %}
{% node #wallet label="ウォレットアカウント" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="wallet" label="誰かのウォレット" theme="transparent" /%}

{% node x="200" parent="wallet" %}
{% node #asset label="Assetアカウント" theme="blue" /%}
{% node label="Owner: Core Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="asset" theme="transparent" %}
所有者を含む \
アセットの情報を格納
{% /node %}

{% edge from="wallet" to="asset" /%}

{% /diagram %}

## Core Assetアカウント

Core Assetアカウントは、デジタルアセットに必要な最小限のデータを表します。この構造は、オンチェーン所有権のための偏見のないブロックチェーンプリミティブを提供します。

{% diagram %}
{% node %}
{% node #wallet label="ウォレットアカウント" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="wallet" theme="transparent" /%}
{% node x="200" parent="wallet" %}
{% node #asset label="Assetアカウント" theme="blue" /%}
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

| 名前             | 型              | サイズ | 説明                                               |                                                                                                                            |
| ---------------- | --------------- | ---- | -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| key              | u8              | 1    | アカウントタイプの識別子                               |                                                                                                                            |
| owner            | pubKey          | 32   | アセットの所有者                                      |                                                                                                                            |
| update_authority | enum<publicKey> | 33   | 新しいアセットの権限またはCollectionID                | [リンク](https://github.com/metaplex-foundation/mpl-core/blob/main/clients/rust/src/generated/types/update_authority.rs#L14) |
| name             | string          | 36   | アセットの名前                                        |                                                                                                                            |
| uri              | string          | 204  | オフチェーンデータを指すアセットのURI                   |                                                                                                                            |
| seq              | string          |      | 圧縮を使用したインデックス化のために使用されるシーケンス番号 |                                                                                                                            |

{% /totem-accordion %}
{% /totem %}

## 私のAssetはコレクションに含まれていますか？

MPL Core Assetはコレクションに属することができます。MPL Core Assetデータの`updateAuthority`フィールドは、アセットのUpdate Authorityを報告するか、それが属するMPL Core CollectionのpublicKeyを提供するかの2つの役割を提供します。

`updateAuthority`フィールドに直接アクセスするか、MPL Core Assetの`collectionAddress`ヘルパーを介してアクセスする場合、返される結果は以下のいずれかの結果になります：

**Collection**

アセットは指定されたアドレスのコレクションに属しています。
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

アセットにはUpdate Authorityが設定されており、コレクションには属していません。
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

アセットにはUpdate Authorityが設定されていません。

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

Assetアカウントの重要な属性の1つは、オフチェーンのJSONファイルを指す`URI`属性です。これは、オンチェーンデータの保存に関わる手数料に制約されることなく、追加データを安全に提供するために使用されます。そのJSONファイルは、[特定の標準](/ja/smart-contracts/token-metadata/token-standard)に従っており、誰でもトークンに関する有用な情報を見つけることができます。

オフチェーンメタデータは、公的にアクセス可能な任意の場所に保存できます。JSONファイルをホストする人気の場所には以下が含まれます：

- Arweave
- NFT.Storage/IPFS
- Amazon AWS S3/Google Cloud

{% diagram %}
{% node %}
{% node #wallet label="ウォレットアカウント" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="wallet" theme="transparent" /%}
{% node x="200" parent="wallet" %}
{% node #asset label="Assetアカウント" theme="blue" /%}
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

注意として、このJSONファイルは更新できないように永続的なストレージソリューション（Arweaveなど）を使用して保存できます。さらに、`Update Authority`フィールドをNoneに設定して不変にし、`URI`と`Name`属性が変更されることを禁止できます。この組み合わせを使用することで、オフチェーンJSONファイルの不変性を保証できます。

## FAQ

### CoreはToken Metadata NFTとどのように異なりますか？

Token Metadataは3つ以上のアカウント（ミント、メタデータ、トークンアカウント）を必要とします。Coreは所有者とメタデータを一緒に保存する単一のアカウントを使用します。これにより、Coreは約80%安価で、作成が高速です。

### オンチェーンとオフチェーンにはどのようなデータが保存されますか？

**オンチェーン**: 所有者、名前、URI、Update Authority、プラグイン。**オフチェーン**（URIで）: 説明、画像、属性、アニメーションURL、その他の拡張メタデータ。

### Token Metadata NFTをCoreに変換できますか？

直接はできません。CoreとToken Metadataは別々の標準です。古いNFTをバーンして新しいCore Assetをミントする必要があります。このプロセスを支援する移行ツールがいくつかあります。

### Coreは既存のNFTマーケットプレイスと互換性がありますか？

ほとんどの主要なSolanaマーケットプレイスはCore Assetをサポートしています。互換性のあるプラットフォームの現在のリストについては、[エコシステムサポート](/ja/smart-contracts/core/ecosystem-support)を確認してください。

### オフチェーンメタデータがオフラインになったらどうなりますか？

Assetは名前とURIと共にオンチェーンに存在し続けますが、画像/属性にはアクセスできなくなります。これを防ぐために永続的なストレージ（Arweave、ピンニング付きIPFS）を使用してください。

## 用語集

| 用語 | 定義 |
|------|------------|
| **Asset** | NFTを表す単一のCoreアカウント |
| **Owner** | 現在Assetを所有しているウォレット |
| **Update Authority** | Assetメタデータを変更する権限を持つアカウント |
| **URI** | オフチェーンJSONメタデータを指すURL |
| **Collection** | 関連するAssetをグループ化するCoreアカウント |
| **Key** | アカウントタイプを識別するアカウント識別子 |
| **seq** | 圧縮インデックス化に使用されるシーケンス番号 |

---

*Metaplex Foundationによって管理・2026年1月最終確認・@metaplex-foundation/mpl-coreに適用*
