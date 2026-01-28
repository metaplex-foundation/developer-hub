---
title: MPL Core 资产
metaTitle: 什么是 Core 资产 | Metaplex Core
description: 了解 Solana 上的 Core Asset 是什么。理解单账户 NFT 模型、账户结构、集合成员身份和链外元数据。
---

本页面解释**什么是 Core Asset** 以及它与传统 Solana NFT 有何不同。理解账户结构、集合关系和元数据存储。 {% .lead %}

{% callout title="关键概念" %}

- **单账户模型**：Core Assets 将所有权存储在 Asset 账户本身内
- **不需要代币账户**：与 SPL 代币不同，Core 不需要 Associated Token Account
- **集合成员身份**：资产可以通过 updateAuthority 字段属于集合
- **链外元数据**：URI 指向存储在 Arweave/IPFS 上的 JSON 元数据

{% /callout %}

## 摘要

Core Asset 是代表 NFT 的单个 Solana 账户。与 Token Metadata（需要 3 个以上账户）不同，Core 将所有基本数据存储在一个账户中：所有者、名称、URI 和 Update Authority。这使得 Core Assets 便宜约 80%，更易于使用。

## 概述

与现有的资产程序（如 [Solana 的 Token 程序](https://spl.solana.com/token)）不同，Metaplex Core 和 Core 资产（有时称为 Core NFT 资产）不依赖于多个账户，如关联代币账户。相反，Core 资产将钱包与"铸造"账户之间的关系存储在资产本身内。

{% diagram %}
{% node %}
{% node #wallet label="钱包账户" theme="indigo" /%}
{% node label="所有者：System Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="wallet" label="某人的钱包" theme="transparent" /%}

{% node x="200" parent="wallet" %}
{% node #asset label="资产账户" theme="blue" /%}
{% node label="所有者：Core 程序" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="asset" theme="transparent" %}
存储关于资产的信息，\
包括所有者
{% /node %}

{% edge from="wallet" to="asset" /%}

{% /diagram %}

## Core 资产账户

Core 资产账户代表数字资产的最基本数据。这个结构为链上所有权提供了一个不带偏见的区块链原语。

{% diagram %}
{% node %}
{% node #wallet label="钱包账户" theme="indigo" /%}
{% node label="所有者：System Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="wallet" theme="transparent" /%}
{% node x="200" parent="wallet" %}
{% node #asset label="资产账户" theme="blue" /%}
{% node label="所有者：Core 程序" theme="dimmed" /%}
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
{% totem-accordion title="链上资产账户结构" %}

MPL Core 资产的链上账户结构。[链接](https://github.com/metaplex-foundation/mpl-core/blob/ce5d16f2de3c0038caae81a8c6496420b1a0462a/programs/mpl-core/src/state/asset.rs#L19)

| 名称             | 类型            | 大小 | 描述                                                      |                                                                                                                            |
| ---------------- | --------------- | ---- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| key              | u8              | 1    | 账户类型的鉴别器                                          |                                                                                                                            |
| owner            | pubKey          | 32   | 资产的所有者                                              |                                                                                                                            |
| update_authority | enum<publicKey> | 33   | 新资产的权限或 CollectionID                               | [链接](https://github.com/metaplex-foundation/mpl-core/blob/main/clients/rust/src/generated/types/update_authority.rs#L14) |
| name             | string          | 36   | 资产的名称                                                |                                                                                                                            |
| uri              | string          | 204  | 指向链外数据的资产 URI                                    |                                                                                                                            |
| seq              | string          |      | 用于压缩索引的序列号                                      |                                                                                                                            |

{% /totem-accordion %}
{% /totem %}

## 我的资产是否在集合中？

MPL Core 资产可以属于集合。MPL Core 资产数据中的 `updateAuthority` 字段提供两个职责：报告资产的 Update Authority，或提供它所属的 MPL Core 集合的公钥。

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

// 日志
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

资产已设置 Update Authority，不属于集合。
{% dialect-switcher title="创建资产" %}
{% dialect title="JavaScript" id="js" %}

```javascript
import { fetchAssetV1 } from '@metaplex-foundation/mpl-core'

const asset = await fetchAssetV1(umi, assetAddress.publicKey)
const collectionId = collectionAddress(asset)

console.log({collectionId})
console.log({asset})

// 日志
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

资产没有设置 Update Authority。

{% dialect-switcher title="创建资产" %}
{% dialect title="JavaScript" id="js" %}

```javascript
import { fetchAssetV1 } from '@metaplex-foundation/mpl-core'

const asset = await fetchAssetV1(umi, assetAddress.publicKey)
const collectionId = collectionAddress(asset)

console.log({collectionId})
console.log({asset})

// 日志
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

资产账户的一个重要属性是指向链外 JSON 文件的 `URI` 属性。这用于安全地提供额外数据，同时不受存储链上数据所涉及费用的限制。该 JSON 文件[遵循特定标准](/zh/smart-contracts/token-metadata/token-standard)，任何人都可以使用它来查找代币的有用信息。

链外元数据可以存储在任何可公开访问的位置。托管 JSON 文件的流行位置包括：

- Arweave
- NFT.Storage/IPFS
- Amazon AWS S3/Google Cloud

{% diagram %}
{% node %}
{% node #wallet label="钱包账户" theme="indigo" /%}
{% node label="所有者：System Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="wallet" theme="transparent" /%}
{% node x="200" parent="wallet" %}
{% node #asset label="资产账户" theme="blue" /%}
{% node label="所有者：Core 程序" theme="dimmed" /%}
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

## 常见问题

### Core 与 Token Metadata NFT 有何不同？

Token Metadata 需要 3 个以上账户（铸造、元数据、代币账户）。Core 使用单个账户，将所有者和元数据存储在一起。这使得 Core 便宜约 80%，创建速度更快。

### 链上和链外存储什么数据？

**链上**：所有者、名称、URI、Update Authority、插件。**链外**（在 URI 处）：描述、图片、属性、动画 URL 和其他扩展元数据。

### 可以将 Token Metadata NFT 转换为 Core 吗？

不能直接转换。Core 和 Token Metadata 是不同的标准。您需要销毁旧 NFT 并铸造新的 Core Asset。有一些迁移工具可以帮助完成此过程。

### Core 与现有的 NFT 市场兼容吗？

大多数主要的 Solana 市场支持 Core Assets。查看[生态系统支持](/zh/smart-contracts/core/ecosystem-support)了解兼容平台的当前列表。

### 如果链外元数据离线会怎样？

资产仍然以其名称和 URI 存在于链上，但图片/属性将无法访问。使用永久存储（Arweave、带 pinning 的 IPFS）来防止这种情况。

## 术语表

| 术语 | 定义 |
|------|------------|
| **Asset** | 代表 NFT 的单个 Core 账户 |
| **Owner** | 当前拥有资产的钱包 |
| **Update Authority** | 被授权修改资产元数据的账户 |
| **URI** | 指向链外 JSON 元数据的 URL |
| **Collection** | 将相关资产分组的 Core 账户 |
| **Key** | 标识账户类型的账户鉴别器 |
| **seq** | 用于压缩索引的序列号 |

---

*由 Metaplex Foundation 维护 · 2026年1月最后验证 · 适用于 @metaplex-foundation/mpl-core*
