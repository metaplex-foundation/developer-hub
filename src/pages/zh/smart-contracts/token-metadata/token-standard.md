---
title: 代币标准
metaTitle: 代币标准 | Token Metadata
description: Token Metadata 支持的各种代币标准概述
---

随着 Solana 上代币使用的演变，越来越明显的是，代币类型不仅仅是"同质化"和"非同质化"代币。

一个例子是社区所称的"半同质化代币"，这是一种供应量大于 1 的 SPL 代币，但具有典型的 NFT 属性，如 JSON 元数据中的图像和属性数组。

共识似乎是这些代币应该与标准 NFT 一起存储在钱包的同一视图中，或者在它们自己的视图中但与"标准"同质化 SPL 代币（如 USDC）分开。这些代币在游戏环境中变得流行，用于支持同质化物品，如某种剑或一块木头等，但它们与 USDC 等典型的同质化 SPL 代币属于不同的类别。

## [代币标准字段](/zh/smart-contracts/token-metadata/token-standard#the-token-standard-field)

为了支持这个特定用例，同时使标准足够广泛以允许将来扩展到其他代币类型，我们使用 Metadata 账户上的 `Token Standard` 枚举来跟踪代币的同质性。此字段映射到特定的 JSON 标准，用于客观区分代币类型。

这解决了第三方（如钱包）的痛点，在此字段之前，它们必须应用不一致的启发式方法来确定什么是和什么不是"NFT"。

代币标准字段可以有以下值：

- `0` / `NonFungible`：具有 Master Edition 的非同质化代币。
- `1` / `FungibleAsset` (1)：具有元数据的代币，也可以有属性，有时称为半同质化。
- `2` / `Fungible` (2)：具有简单元数据的代币。
- `3` / `NonFungibleEdition` (3)：具有 Edition 账户的非同质化代币（从 Master edition 打印）。
- `4` / `ProgrammableNonFungible` (4)：一种特殊的 `NonFungible` 代币，始终处于冻结状态以强制执行自定义授权规则。

重要的是要注意，代币标准由 Token Metadata 程序自动设置，不能手动更新。它使用以下逻辑来应用正确的标准：

- 如果代币有 **Master Edition 账户**，它是 `NonFungible` 或 `ProgrammableNonFungible`。
- 如果代币有 **Edition 账户**，它是 `NonFungibleEdition`。
- 如果代币没有 (Master) Edition 账户（确保其供应量可以 > 1）并且**使用零小数位**，它是 `FungibleAsset`。
- 如果代币没有 (Master) Edition 账户（确保其供应量可以 > 1）并且**使用至少一个小数位**，它是 `Fungible`。

每种代币标准类型都有自己的 JSON 模式，定义如下。

## Fungible 标准

这些是具有有限元数据和供应量 >= 0 的简单 SPL 代币。例如 USDC、GBTC 和 RAY。

{% partial file="token-standard-short.md" /%}

{% totem %}
{% totem-accordion title="示例" %}

```json
{
  "name": "USD Coin",
  "symbol": "USDC",
  "description": "由 Circle 创建的完全储备支持的法币稳定币。",
  "image": "https://www.circle.com/hs-fs/hubfs/sundaes/USDC.png?width=540&height=540&name=USDC.png"
}
```

{% /totem-accordion %}
{% /totem %}

## Fungible Asset 标准

这些是具有更广泛元数据和供应量 >= 0 的同质化代币。这种代币的一个例子是社区所称的"半同质化代币"，通常用于表示游戏中的同质化但属性丰富的物品，如剑或一块木头。

{% partial file="token-standard-full.md" /%}

{% totem %}
{% totem-accordion title="示例" %}

```json
{
  "name": "SolanaGame Steel Sword",
  "symbol": "SG-SS-1",
  "description": "4级后可用的 SolanaGame 钢剑",
  "image": "https://arweave.net/26YdhY_eAzv26YdhY1uu9uiA3nmDZYwP8MwZAultcE?ext=jpeg",
  "animation_url": "https://arweave.net/ZAultcE_eAzv26YdhY1uu9uiA3nmDZYwP8MwuiA3nm?ext=glb",
  "external_url": "https://SolanaGame.io",
  "attributes": [
    {
      "trait_type": "attack",
      "value": "4"
    },
    {
      "trait_type": "defense",
      "value": "3"
    },
    {
      "trait_type": "durability",
      "value": "47"
    },
    {
      "trait_type": "components",
      "value": "iron: 10; carbon: 1; wood: 2"
    }
  ]
}
```

{% /totem-accordion %}
{% /totem %}

## Non-Fungible 标准

这些是社区已经熟悉的"标准"非同质化代币，同时具有 Metadata PDA 和 Master Edition（或 Edition）PDA。例如 Solana Monkey Business、Stylish Studs 和 Thugbirdz。

{% partial file="token-standard-full.md" /%}

{% totem %}
{% totem-accordion title="示例" %}

```json
{
  "name": "SolanaArtProject #1",
  "description": "Solana 上的生成艺术。",
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
    "category": "video",

    // @deprecated
    // 请勿使用 - 可能在未来版本中移除。
    // 请使用链上数据替代。
    "collection": {
      "name": "Solflare X NFT",
      "family": "Solflare"
    },

    // @deprecated
    // 请勿使用 - 可能在未来版本中移除。
    // 请使用链上数据替代。
    "creators": [
      {
        "address": "xEtQ9Fpv62qdc1GYfpNReMasVTe9YW5bHJwfVKqo72u",
        "share": 100
      }
    ]
  }
}
```

{% /totem-accordion %}
{% /totem %}

## Programmable Non-Fungible 标准

此标准类似于上面的 **Non-Fungible** 标准，不同之处在于底层 token 账户始终保持冻结状态，以确保没有人可以在不通过 Token Metadata 程序的情况下转移、锁定或销毁可编程 NFT。这使创作者能够为其 NFT 定义自定义授权规则，例如强制执行二次销售版税。

您可以[在此处阅读更多关于可编程 NFT 的信息](https://github.com/metaplex-foundation/mpl-token-metadata/blob/main/programs/token-metadata/program/ProgrammableNFTGuide.md)。

{% partial file="token-standard-full.md" /%}

{% totem %}
{% totem-accordion title="示例" %}

```json
{
  "name": "SolanaArtProject #1",
  "description": "Solana 上的生成艺术。",
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
