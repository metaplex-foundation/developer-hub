---
title: "Redeemed Amount Guard"
metaTitle: Redeemed Amount Guard | Candy Machine
description: "Redeemed Amountガードは、Candy Machine全体のミントされたNFT数が設定された最大量に達した場合、ミントを禁止します。"
---

## 概要

**Redeemed Amount**ガードは、Candy Machine全体のミントされたNFT数が設定された最大量に達した場合、ミントを禁止します。

このガードは、グループにグローバルミント閾値を追加することを可能にするため、[Guard Groups](/candy-machine/guard-groups)と組み合わせて使用すると更に興味深くなります。

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="21" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node #redeemedAmount label="RedeemedAmount" /%}
{% node #maximum label="- maximum" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine" #mint-candy-guard x="595" %}
  {% node theme="pink" %}
    Mint from

    _Candy Guard Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-8" %}
  {% node theme="pink" %}
    Mint from 
    
    _Candy Machine Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="70" theme="blue" %}
  NFT
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}
{% edge from="maximum" to="mint-candy-guard" arrow="none" dashed=true %}
once that amount of

NFTs have been minted

Minting will fail
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" /%}

{% /diagram %}

## ガード設定

Redeemed Amountガードには以下の設定が含まれます：

- **Maximum**: ミント可能なNFTの最大量。

{% dialect-switcher title="Redeemed Amountガードを使用してCandy Machineを設定する" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  itemsAvailable: 500,
  guards: {
    redeemedAmount: some({ maximum: 300 }),
  },
});
```

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}
config.jsonファイルのガードセクションに以下のオブジェクトを追加してください：

```json
"redeemedAmount" : {
    "maximum": number,
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

Candy Machineに500個のアイテムが含まれていても、このガードのため300個のアイテムのみがミント可能になることに注意してください。

したがって、このガードは[Guard Groups](/candy-machine/guard-groups)を使用するときにより有用になります。最初の300個のNFTは1 SOLでミントできるが、最後の200個は2 SOLが必要になる2つのグループを使用した別の例を以下に示します。

{% dialect-switcher title="グループでRedeemed Amountガードを使用する例" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  itemsAvailable: 500,
  groups: [
    {
      label: "early",
      guards: {
        redeemedAmount: some({ maximum: 300 }),
        solPayment: some({ lamports: sol(1), destination: treasury }),
      },
    },
    {
      label: "late",
      guards: {
        solPayment: some({ lamports: sol(2), destination: treasury }),
      },
    },
  ],
});
```

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

他のすべてのガードと同様に、次のようにグループとして追加することもできます：

```json
    "groups": [
      {
        "label": "early",
        "guards": {
          "redeemedAmount": {
            "maximum": 300,
          },
          "solPayment": {
            "value": 1,
            "destination": "<PUBKEY>"
          }
        }
      },
      {
        "label": "late",
        "guards": {
          "solPayment": {
            "value": 2,
            "destination": "<PUBKEY>"
          }
        }
      }
    ]

```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ミント設定

_Redeemed Amountガードにはミント設定は必要ありません。_

## ルート命令

_Redeemed Amountガードはルート命令をサポートしません。_