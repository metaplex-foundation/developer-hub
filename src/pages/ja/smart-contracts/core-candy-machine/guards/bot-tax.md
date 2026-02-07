---
title: "Bot Tax Guard"
metaTitle: "Bot Tax Guard | Core Candy Machine"
description: "Core Candy Machine'Bot Tax'ガードにより、ユーザーからの無効なトランザクションに対して設定可能な税金を設定できます。これによりスパムとボットを抑制できます。"
---

{% callout type="warning" %}
一部のウォレット（Solflare、Phantom、および他の可能性があるもの）は現在、トランザクションにLighthouse命令を自動注入します。これにより、`lastInstruction`が`true`に設定されているときBot Taxガードがトリガーされます。

ウォレットの選択はユーザー次第であるため、**SolflareやANFTのようなウォレットでのミントを誰かが行うことを防ぐことはできません**。これらのウォレットを使用してユーザーがミントすることを期待している場合、偽陽性を避けるために`lastInstruction`を`false`に設定することを検討してください。

Bot Taxガードは慎重に使用してください。
{% /callout %}

## 概要

**Bot Tax**ガードは、ボットがNFTをミントしようとすることを阻止するために無効なトランザクションに対してペナルティを課します。この金額は通常、実際のユーザーからの本物の間違いに影響を与えることなくボットを傷つけるために小さく設定されます。すべてのボット税はCandy Machineアカウントに転送されるため、ミント完了後にCandy Machineアカウントを削除してこれらの資金にアクセスできます。

このガードは少し特別で、他のすべてのガードのミント動作に影響を与えます。Bot Taxが有効化され、他のガードのミント検証が失敗した場合、**トランザクションは成功したふりをします**。これは、プログラムからエラーが返されませんが、NFTもミントされないことを意味します。これは、ボットからCandy Machineアカウントに資金を転送するためにトランザクションが成功する必要があるためです。

さらに、Bot Taxガードにより、ミント命令がトランザクションの最後の命令であることを確保できます。これにより、ボットがミント後に悪意ある命令を追加することを防ぎ、税金の支払いを避けるためにエラーを返します。

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node label="Owner: Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine" y="100" x="22" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node #candy-guard-guards label="Guards" theme="mint" z=1 /%}
{% node #botTax label="botTax" /%}
{% node #lamports label="- Lamports" /%}
{% node #lastInstruction label="- Last Instruction" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine" x="700" %}
  {% node #mint-candy-guard theme="pink" %}
    からのミント

    _Candy Guard Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  アクセス制御
{% /node %}

{% node parent="mint-candy-guard" y="150" x="-8" %}
  {% node #mint-candy-machine theme="pink" %}
    からのミント

    _Candy Machine Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="110" theme="transparent" %}
  ミントロジック
{% /node %}

{% node #nft parent="mint-candy-machine" y="120" x="73" theme="blue" %}
  アセット
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" /%}
{% edge from="lamports" to="mint-candy-guard" arrow="none" dashed=true /%}
{% node parent="lamports" y="-30" x="200" theme="transparent" %}
他のガードが検証に失敗した場合

このSOL量を請求
{% /node %}
{% edge from="lastInstruction" to="mint-candy-guard" arrow="none" dashed=true %}

{% /edge %}
{% node parent="lastInstruction" y="15" x="200" theme="transparent" %}
ミント命令がトランザクションの

最後の命令でない場合、ミントは失敗
{% /node %}
{% edge from="candy-guard-guards" to="guards" /%}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## ガード設定

Bot Taxガードには以下の設定が含まれます：

- **Lamports**：無効なトランザクションに対して請求するSOL（またはlamport）の量。本物の間違いをした実際のユーザーに影響を与えないよう、かなり少額を設定することをお勧めします。クライアント側の検証も実際のユーザーへの影響を減らすのに役立ちます。
- **Last Instruction**：ミント命令がトランザクションの最後の命令でない場合にミントを禁止しボット税を課すかどうか。ボットからより良く保護されるために、これを`true`に設定することをお勧めします。

{% dialect-switcher title="Bot Taxガードを使用したCandy Machineの設定" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    botTax: some({
      lamports: sol(0.01),
      lastInstruction: true,
    }),
  },
});
```

APIリファレンス: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [BotTax](https://mpl-core-candy-machine.typedoc.metaplex.com/types/BotTax.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

config.jsonファイルのガードセクションにこのオブジェクトを追加してください：

```json
"botTax" : {
    "value": SOL値,
    "lastInstruction": boolean
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ミント設定

_Bot Taxガードはミント設定を必要としません。_

## Route命令

_Bot Taxガードはroute命令をサポートしていません。_
