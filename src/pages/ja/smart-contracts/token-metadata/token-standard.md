---
title: トークン標準
metaTitle: トークン標準 | Token Metadata
description: Token Metadataでサポートされる様々なトークン標準の概要
---

Solanaでのトークンの使用が進化するにつれて、単純に「Fungible」と「非Fungible」トークンだけでなく、より多くの種類のトークンがあることが明らかになりました。

例として、コミュニティが「半Fungibleトークン」と呼んでいるものがあります。これは供給量が1より大きいSPLトークンですが、JSONメタデータに画像や属性配列などの典型的なNFT属性があるものです。

コンセンサスでは、これらは標準NFTと同じビューでウォレットに保存されるか、独自のビューで保存されるが「標準の」FungibleなSPLトークン（USDCなど）とは分離されるべきだということのようです。これらのトークンは、剣や木の切れ端などのFungibleなアイテムをサポートするためにゲームコンテキストで人気になっていますが、USDCなどの典型的なFungible SPLトークンとは別のリーグにあります。

## [トークン標準フィールド](/ja/smart-contracts/token-metadata/token-standard#the-token-standard-field)

この特定の用途をサポートするだけでなく、将来的に他のトークンタイプへの拡張を可能にする十分な広さを持つ標準にするために、Metadataアカウントの`Token Standard`列挙型を使用してトークンのFungibility性を追跡します。このフィールドは特定のJSON標準にマップされ、トークンタイプを客観的に区別するために使用されます。

これは、このフィールドの前にはNFTであるものとないものを判断するために一貫性のないヒューリスティックを適用しなければならなかったウォレットなどのサードパーティにとっての痛点を解決します。

トークン標準フィールドは以下の値を持つことができます：

- `0` / `NonFungible`: Master Editionを持つ非Fungibleトークン。
- `1` / `FungibleAsset` (1): 属性も持つことができるメタデータを持つトークン、時には半Fungibleと呼ばれます。
- `2` / `Fungible` (2): シンプルなメタデータを持つトークン。
- `3` / `NonFungibleEdition` (3): Editionアカウント（Master editionから印刷された）を持つ非Fungibleトークン。
- `4` / `ProgrammableNonFungible` (4): カスタム認可ルールを強制するために常時フリーズされる特殊な`NonFungible`トークン。

トークン標準はToken Metadataプログラムによって自動的に設定され、手動で更新することはできないことに注意することが重要です。正しい標準を適用するために以下のロジックを使用します：

- トークンに**Master Editionアカウント**がある場合、それは`NonFungible`または`ProgrammableNonFungible`です。
- トークンに**Editionアカウント**がある場合、それは`NonFungibleEdition`です。
- トークンに（Master）Editionアカウントがない（供給量が> 1であることを保証）場合で、**小数点以下0桁を使用**する場合、それは`FungibleAsset`です。
- トークンに（Master）Editionアカウントがない（供給量が> 1であることを保証）場合で、**少なくとも1つの小数点以下を使用**する場合、それは`Fungible`です。

各トークン標準タイプには、以下で定義される独自のJSONスキーマがあります。

## Fungible標準

これらは限定されたメタデータと供給量>= 0を持つシンプルなSPLトークンです。例はUSDC、GBTC、RAYです。

{% partial file="token-standard-short.md" /%}

{% totem %}
{% totem-accordion title="例" %}

```json
{
  "name": "USD Coin",
  "symbol": "USDC",
  "description": "Fully reserved fiat-backed stablecoin created by Circle.",
  "image": "https://www.circle.com/hs-fs/hubfs/sundaes/USDC.png?width=540&height=540&name=USDC.png"
}
```

{% /totem-accordion %}
{% /totem %}

## FungibleアセT標準

これらはより広範なメタデータと供給量>= 0を持つFungibleトークンです。この種のトークンの例は、コミュニティが「半Fungibleトークン」と呼んでいるもので、剣や木の切れ端などの属性が重いゲーム内アイテムを表すためによく使用されます。

{% partial file="token-standard-full.md" /%}

{% totem %}
{% totem-accordion title="例" %}

```json
{
  "name": "SolanaGame Steel Sword",
  "symbol": "SG-SS-1",
  "description": "SolanaGame steel sword available after Level 4",
  "image": "<https://arweave.net/26YdhY_eAzv26YdhY1uu9uiA3nmDZYwP8MwZAultcE?ext=jpeg>",
  "animation_url": "<https://arweave.net/ZAultcE_eAzv26YdhY1uu9uiA3nmDZYwP8MwuiA3nm?ext=glb>",
  "external_url": "<https://SolanaGame.io>",
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

## 非Fungible標準

これらは、コミュニティがすでに馴染みがある「標準的な」非Fungibleトークンで、Metadata PDAとMaster Edition（またはEdition）PDAの両方を持ちます。これらの例には、Solana Monkey Business、Stylish Studs、Thugbirdzがあります。

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
    "category": "video",

    // @deprecated
    // 使用しないでください - 将来のリリースで削除される可能性があります。
    // 代わりにオンチェーンデータを使用してください。
    "collection": {
      "name": "Solflare X NFT",
      "family": "Solflare"
    },

    // @deprecated
    // 使用しないでください - 将来のリリースで削除される可能性があります。
    // 代わりにオンチェーンデータを使用してください。
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

## プログラマブル非Fungible標準

この標準は上記の**非Fungible**標準と似ていますが、基礎となるトークンアカウントが常時フリーズされ、Token Metadataプログラムを通さずに誰もプログラマブルNFTを転送、ロック、またはバーンできないようになっている点が異なります。これにより、クリエイターは2次売買のロイヤルティを強制するなど、NFTのカスタム認可ルールを定義できます。

[プログラマブルNFTについてはこちらで詳しく読むことができます](https://github.com/metaplex-foundation/mpl-token-metadata/blob/main/programs/token-metadata/program/ProgrammableNFTGuide.md)。

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
