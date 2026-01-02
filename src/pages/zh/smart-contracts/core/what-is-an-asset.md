---
title: MPL Core 资产
metaTitle: 什么是 Core 资产 | Core
description: 了解什么是 MPL Core 资产以及为什么它是 Solana NFT 的未来。
---

## 概述

与现有的资产程序（如 [Solana 的 Token 程序](https://spl.solana.com/token)）不同，Metaplex Core 和 Core 资产（有时称为 Core NFT 资产）不依赖于多个账户，如关联代币账户。相反，Core 资产将钱包与"铸造"账户之间的关系存储在资产本身内。

{% diagram %}
{% node %}
{% node #wallet label="钱包账户" theme="indigo" /%}
{% node label="所有者：系统程序" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="wallet" label="某人的钱包。" theme="transparent" /%}

{% node x="200" parent="wallet" %}
{% node #asset label="资产账户" theme="blue" /%}
{% node label="所有者：Core 程序" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="asset" theme="transparent" %}
存储有关资产的信息，\
包括所有者
{% /node %}

{% edge from="wallet" to="asset" /%}

{% /diagram %}

## Core 资产账户

Core 资产账户代表数字资产的最基本数据。这个结构为链上所有权提供了一个不带偏见的区块链原语。

{% diagram %}
{% node %}
{% node #wallet label="钱包账户" theme="indigo" /%}
{% node label="所有者：系统程序" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="wallet" theme="transparent" /%}
{% node x="200" parent="wallet" %}
{% node #asset label="资产账户" theme="blue" /%}
{% node label="所有者：Core 程序" theme="dimmed" /%}
{% node label="Key = Asset" /%}
{% node label="所有者" /%}
{% node label="更新权限" /%}
{% node label="名称" /%}
{% node label="URI" /%}
{% /node %}
{% node y="70" parent="asset" theme="transparent" %}
{% /node %}

{% edge from="wallet" to="asset" /%}

{% /diagram %}

{% seperator h="6" /%}

{% totem %}
{% totem-accordion title="链上资产账户结构" %}

MPL Core 资产的链上账户结构。[链接](https://github.com/metaplex-foundation/mpl-core/blob/ce5d16f2de3c0038caae81a8c6496420b1a0462a/programs/mpl-core/src/state/asset.rs#L19)

| 名称             | 类型            | 大小 | 描述                                                      |                                                                                                                            |
| ---------------- | --------------- | ---- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| key              | u8              | 1    | 账户类型的鉴别器                                          |                                                                                                                            |
| owner            | pubKey          | 32   | 资产的所有者。                                            |                                                                                                                            |
| update_authority | enum<publicKey> | 33   | 新资产的权限或集合 ID。                                   | [链接](https://github.com/metaplex-foundation/mpl-core/blob/main/clients/rust/src/generated/types/update_authority.rs#L14) |
| name             | string          | 36   | 资产的名称。                                              |                                                                                                                            |
| uri              | string          | 204  | 指向链外数据的资产 URI。                                  |                                                                                                                            |
| seq              | string          |      | 用于使用压缩进行索引的序列号。                            |                                                                                                                            |

{% /totem-accordion %}
{% /totem %}

## 我的资产是否在集合中？

MPL Core 资产可以属于集合。MPL Core 资产数据中的 `updateAuthority` 字段提供两个职责：报告资产的更新权限，或提供它所属的 MPL Core 集合的公钥。

当直接通过资产访问 `updateAuthority` 字段，或通过 MPL Core 资产的 `collectionAddress` 辅助函数访问时，返回结果将是以下结果之一：

**集合**

资产属于给定地址的集合。
{% dialect-switcher title="创建资产" %}
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

// log
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

**地址**

资产已设置更新权限，不属于集合。
{% dialect-switcher title="创建资产" %}
{% dialect title="JavaScript" id="js" %}

```javascript
import { fetchAssetV1 } from '@metaplex-foundation/mpl-core'

const asset = await fetchAssetV1(umi, assetAddress.publicKey)
const collectionId = collectionAddress(asset)

console.log({collectionId})
console.log({asset})

// log
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

**无**

资产没有设置更新权限。

{% dialect-switcher title="创建资产" %}
{% dialect title="JavaScript" id="js" %}

```javascript
import { fetchAssetV1 } from '@metaplex-foundation/mpl-core'

const asset = await fetchAssetV1(umi, assetAddress.publicKey)
const collectionId = collectionAddress(asset)

console.log({collectionId})
console.log({asset})

// log
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

## 链外元数据

资产账户的一个重要属性是指向链外 JSON 文件的 `URI` 属性。这用于安全地提供额外数据，同时不受存储链上数据所涉及费用的限制。该 JSON 文件[遵循某个标准](/zh/smart-contracts/token-metadata/token-standard)，任何人都可以使用它来查找代币的有用信息。

链外元数据可以存储在任何可公开访问的位置。托管 json 文件的流行位置包括：

- Arweave
- NFT.Storage/IPFS
- Amazon AWS S3/Google Cloud

{% diagram %}
{% node %}
{% node #wallet label="钱包账户" theme="indigo" /%}
{% node label="所有者：系统程序" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="wallet" theme="transparent" /%}
{% node x="200" parent="wallet" %}
{% node #asset label="资产账户" theme="blue" /%}
{% node label="所有者：Core 程序" theme="dimmed" /%}
{% node label="Key = Asset" /%}
{% node label="所有者" /%}
{% node label="更新权限" /%}
{% node label="名称" /%}
{% node #uri label="URI" /%}
{% /node %}
{% node y="70" parent="asset" theme="transparent" %}
{% /node %}

{% node parent="uri" x="-200" y="-23" %}
{% node #json theme="slate" %}
链外 \
JSON 元数据
{% /node %}
{% node label="名称" /%}
{% node label="描述" /%}
{% node label="图片" /%}
{% node label="动画 URL" /%}
{% node label="属性" /%}
{% node label="..." /%}
{% /node %}

{% edge from="wallet" to="asset" /%}
{% edge from="uri" to="json" path="straight" /%}

{% /diagram %}

{% partial file="token-standard-full.md" /%}

{% totem %}
{% totem-accordion title="示例" %}

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

请注意，可以使用永久存储解决方案（如 Arweave）存储此 JSON 文件，以确保它不能被更新。此外，可以将 `Update Authority` 字段设置为 None 以使其不可变，从而禁止 `URI` 和 `Name` 属性被更改。使用这种组合，我们可以保证链外 JSON 文件的不可变性。
