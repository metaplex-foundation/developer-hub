---
title: MPL Core Asset
metaTitle: 什么是 Core Asset | Metaplex Core
description: 了解 Solana 上的 Core Asset 是什么。理解单账户 NFT 模型、账户结构、收藏成员资格和链下元数据。
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
  - q: Core 与 Token Metadata NFT 有什么区别？
    a: Token Metadata 需要 3 个以上的账户（mint、metadata、token account）。Core 使用单个账户将所有者和元数据存储在一起，成本降低约 80% 且速度更快。
  - q: 链上和链下分别存储什么数据？
    a: 链上存储所有者、名称、URI、update authority 和插件。链下（URI 位置）存储描述、图像、属性、动画 URL 和扩展元数据。
  - q: 可以将 Token Metadata NFT 转换为 Core 吗？
    a: 不能直接转换。它们是不同的标准。您需要销毁旧 NFT 并铸造新的 Core Asset。有迁移工具可以提供帮助。
  - q: Core 与现有的 NFT 市场兼容吗？
    a: 大多数主要的 Solana 市场都支持 Core Asset。请查看 Ecosystem Support 获取当前列表。
  - q: 如果链下元数据离线会怎样？
    a: Asset 仍然以名称和 URI 存在于链上，但图像和链下属性无法加载。链上属性（通过 Attributes 插件）仍可访问。使用 Arweave 或固定的 IPFS 等永久存储。
---
本页说明 **Core Asset 是什么** 以及它与传统 Solana NFT 的区别。了解账户结构、收藏关系和元数据存储。 {% .lead %}
{% callout title="核心概念" %}

- **单账户模型**: Core Asset 在 Asset 账户本身中存储所有权
- **无需代币账户**: 与 SPL 代币不同，Core 不需要 Associated Token Accounts
- **收藏成员资格**: Asset 可以通过 updateAuthority 字段属于 Collection
- **链下元数据**: URI 指向 JSON 元数据（建议使用 Arweave/IPFS 等永久存储）
{% /callout %}

## 摘要

Core Asset 是代表 NFT 的单个 Solana 账户。与 Token Metadata（需要 3 个以上账户）不同，Core 将所有重要数据存储在一个账户中：所有者、名称、URI 和 update authority。这使得 Core Asset 成本降低约 80% 且更易于使用。

## 概述

与 [Solana 的 Token 程序](https://spl.solana.com/token) 等现有 Asset 程序不同，Metaplex Core 和 Core Asset（有时称为 Core NFT Asset）不依赖于多个账户，如 Associated Token Accounts。相反，Core Asset 将钱包和 Asset 本身的"mint"账户之间的关系存储在内部。
{% diagram %}
{% node %}
{% node #wallet label="Wallet Account" theme="indigo" /%}
{% node label="Owner: System Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="wallet" label="某人的钱包" theme="transparent" /%}
{% node x="200" parent="wallet" %}
{% node #asset label="Asset Account" theme="blue" /%}
{% node label="Owner: Core Program" theme="dimmed" /%}
{% /node %}
{% node y="70" parent="asset" theme="transparent" %}
存储 Asset 的信息，\
包括所有者
{% /node %}
{% edge from="wallet" to="asset" /%}
{% /diagram %}

## Core Asset 账户

Core Asset 账户代表数字资产的最小数据。此结构为链上所有权提供了一个无主见的区块链原语。
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
{% totem-accordion title="链上 Asset 账户结构" %}
MPL Core Asset 的链上账户结构。[链接](https://github.com/metaplex-foundation/mpl-core/blob/ce5d16f2de3c0038caae81a8c6496420b1a0462a/programs/mpl-core/src/state/asset.rs#L19)

| 名称             | 类型            | 大小 | 描述                                                      |                                                                                                                            |
| ---------------- | --------------- | ---- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| key              | u8              | 1    | 账户类型的鉴别器                                      |                                                                                                                            |
| owner            | pubKey          | 32   | Asset 的所有者                                          |                                                                                                                            |
| update_authority | enum<publicKey> | 33   | 新 Asset 的权限或 CollectionID                  | [链接](https://github.com/metaplex-foundation/mpl-core/blob/main/clients/rust/src/generated/types/update_authority.rs#L14) |
| name             | string          | 36   | Asset 的名称                                           |                                                                                                                            |
| uri              | string          | 204  | 指向链下数据的 Asset URI          |                                                                                                                            |
| seq              | string          |      | 用于压缩索引的序列号          |                                                                                                                            |
{% /totem-accordion %}
{% /totem %}

## 我的 Asset 在 Collection 中吗？

MPL Core Asset 可以属于 Collection。MPL Core Asset 数据中的 `updateAuthority` 字段有两个作用：报告 Asset 的 update authority，或提供其所属的 MPL Core Collection 的 publicKey。
访问 `updateAuthority` 字段时，无论是直接通过 Asset 还是通过 MPL Core Asset 的 `collectionAddress` 辅助函数，返回结果将是以下之一：
**Collection**
Asset 属于该地址的 Collection。
{% dialect-switcher title="创建 Asset" %}
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
**Address**
Asset 设置了 update authority 但不属于任何 Collection。
{% dialect-switcher title="创建 Asset" %}
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
**None**
Asset 没有设置 update authority。
{% dialect-switcher title="创建 Asset" %}
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

## 链下元数据

Asset 账户的一个重要属性是指向链下 JSON 文件的 `URI` 属性。这用于安全地提供额外数据，同时不受链上数据存储费用的限制。该 JSON 文件 [遵循特定标准](/smart-contracts/token-metadata/token-standard)，任何人都可以用来查找代币的有用信息。
链下元数据可以存储在任何可公开访问的位置。托管 JSON 文件的常见位置包括：

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
链下 \
JSON 元数据
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
请注意，此 JSON 文件可以使用 Arweave 等永久存储解决方案存储，以确保无法更新。此外，可以将 `Update Authority` 字段设置为 None 使其不可变，从而禁止更改 `URI` 和 `Name` 属性。使用这种组合，我们可以保证链下 JSON 文件的不可变性。

## FAQ

### Core 与 Token Metadata NFT 有什么区别？

Token Metadata 需要 3 个以上的账户（mint、metadata、token account）。Core 使用单个账户将所有者和元数据存储在一起。这使得 Core 成本降低约 80% 且创建速度更快。

### 链上和链下分别存储什么数据？

**链上**: 所有者、名称、URI、update authority、插件。**链下**（URI 位置）: 描述、图像、属性、动画 URL 和其他扩展元数据。

### 可以将 Token Metadata NFT 转换为 Core 吗？

不能直接转换。Core 和 Token Metadata 是不同的标准。您需要销毁旧 NFT 并铸造新的 Core Asset。有一些迁移工具可以帮助完成此过程。

### Core 与现有的 NFT 市场兼容吗？

大多数主要的 Solana 市场都支持 Core Asset。请查看 [Ecosystem Support](/zh/smart-contracts/core/ecosystem-support) 获取兼容平台的当前列表。

### 如果链下元数据离线会怎样？

Asset 仍然以名称和 URI 存在于链上，但图像和链下属性将无法访问。链上属性（通过 [Attributes 插件](/zh/smart-contracts/core/plugins/attribute)）仍可访问。使用永久存储（Arweave、带固定的 IPFS）来防止这种情况。

## 术语表

| 术语 | 定义 |
|------|------------|
| **Asset** | 代表 NFT 的单个 Core 账户 |
| **Owner** | 当前拥有 Asset 的钱包 |
| **Update Authority** | 被授权修改 Asset 元数据的账户 |
| **URI** | 指向链下 JSON 元数据的 URL |
| **Collection** | 将相关 Asset 分组的 Core 账户 |
| **Key** | 标识账户类型的账户鉴别器 |
| **seq** | 用于压缩索引的序列号 |
