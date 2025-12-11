---
title: "Redeemed Amountガード"
metaTitle: "Redeemed Amountガード | Core Candy Machine"
description: "Core Candy Machineの「Redeemed Amount」ガードは、Core Candy Machine全体でミントされたアセットの数が設定された最大量に達したときにミントを禁止します。"
---

## 概要

**Redeemed Amount**ガードは、Core Candy Machine全体でミントされたアセットの数が設定された最大量に達したときにミントを禁止します。

このガードは、[ガードグループ](/core-candy-machine/guard-groups)と一緒に使用するとより面白くなります。グループにグローバルなミントしきい値を追加できるためです。

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="21" %}
{% node #candy-guard label="Core Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node #redeemedAmount label="RedeemedAmount" /%}
{% node #maximum label="- maximum" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine" #mint-candy-guard x="595" %}
  {% node theme="pink" %}
    _Core Candy Guard Program_

    からミント{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  アクセス制御
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-9" %}
  {% node theme="pink" %}
    _Core Candy Machine Program_

    からミント{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  ミントロジック
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="93" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}
{% edge from="maximum" to="mint-candy-guard" arrow="none" dashed=true %}
その量のアセットが

ミントされると、

ミントは失敗します
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## ガード設定

Redeemed Amountガードには以下の設定が含まれます:

- **Maximum**: ミントできるNFTの最大量。

{% dialect-switcher title="Redeemed Amountガードを使用してCore Candy Machineをセットアップする" %}
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
{% /dialect-switcher %}

Candy Machineに500アイテムが含まれていても、このガードのために300アイテムしかミント可能にならないことに注意してください。

したがって、このガードは[ガードグループ](/core-candy-machine/guard-groups)を使用する際により便利になります。以下は、2つのグループを使用した別の例で、最初の300アセットは1 SOLでミントできますが、最後の200は2 SOLが必要です。

{% dialect-switcher title="グループを使用したRedeemed Amountガードの例" %}
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
{% /dialect-switcher %}

## ミント設定

_Redeemed Amountガードはミント設定を必要としません。_

## ルート命令

_Redeemed Amountガードはルート命令をサポートしていません。_
