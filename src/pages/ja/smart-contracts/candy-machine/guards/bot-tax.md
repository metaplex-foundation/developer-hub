---
title: Bot Tax Guard
metaTitle: Bot Tax Guard | Candy Machine
description: "無効なトランザクションに対して課税する設定可能な税金。"
---

{% callout type="warning" %}
一部のウォレット（Solflare、Phantom、その他のウォレットなど）は現在、トランザクションにLighthouse命令を自動注入します。これにより、`lastInstruction`が`true`に設定されている場合、Bot Taxガードがトリガーされます。

ウォレットの選択はユーザー次第であるため、**SolflareやSimilarウォレットでのミントを阻止することはできません**。これらのウォレットを使用してユーザーがミントすることが予想される場合、偽陽性を避けるために`lastInstruction`を`false`に設定することを検討してください。

Bot Taxガードは注意して使用してください。
{% /callout %}

## 概要

**Bot Tax**ガードは、ボットがNFTのミントを試みることを阻止するために、無効なトランザクションに対してペナルティを課します。この金額は通常、実際のユーザーの真正な間違いに影響を与えることなく、ボットを損害するために小額に設定されます。すべてのボット税はCandy Machineアカウントに転送されるため、ミントが終了した後、Candy Machineアカウントを削除することでこれらの資金にアクセスできます。

このガードは少し特別で、他のすべてのガードのミント動作に影響します。Bot Taxがアクティブ化され、他のガードがミントの検証に失敗した場合、**トランザクションは成功したかのように振る舞います**。これは、プログラムによってエラーが返されませんが、NFTもミントされません。これは、ボットからCandy Machineアカウントに資金を転送するために、トランザクションが成功する必要があるためです。

さらに、Bot Taxガードにより、ミント命令がトランザクションの最後の命令であることを確認できます。これにより、ボットがミント後に悪意のある命令を追加することを防ぎ、税金の支払いを避けるためにエラーを返します。

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
    Mint from

    _Candy Guard Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}

{% node parent="mint-candy-guard" y="150" x="-8" %}
  {% node #mint-candy-machine theme="pink" %}
    Mint from

    _Candy Machine Program_
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="110" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="120" x="76" theme="blue" %}
  NFT
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" /%}
{% edge from="lamports" to="mint-candy-guard" arrow="none" dashed=true /%}
{% node parent="lamports" y="-30" x="200" theme="transparent" %}
If any other guard fails to validate

charge this amount of SOL
{% /node %}
{% edge from="lastInstruction" to="mint-candy-guard" arrow="none" dashed=true %}

{% /edge %}
{% node parent="lastInstruction" y="15" x="200" theme="transparent" %}
If the mint instruction is not the last

Instruction of the transaction minting will fail
{% /node %}
{% edge from="candy-guard-guards" to="guards" /%}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## ガード設定

Bot Taxガードには以下の設定が含まれます：

- **Lamports**: 無効なトランザクションに対して課税するSOL（またはlamports）の金額。真正な間違いをした実際のユーザーに影響を与えることを避けるために、かなり小額に設定することをお勧めします。クライアント側の検証も、実際のユーザーへの影響を減らすのに役立ちます。
- **Last Instruction**: ミント命令がトランザクションの最後の命令でない場合に、ミントを禁止してボット税を課すかどうか。ボットに対してより良い保護を得るために、これを`true`に設定することをお勧めします。

{% dialect-switcher title="Bot Taxガードを使用してCandy Machineを設定する" %}
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

APIリファレンス: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [BotTax](https://mpl-candy-machine.typedoc.metaplex.com/types/BotTax.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

config.jsonファイルのガードセクションに以下のオブジェクトを追加してください：

```json
"botTax" : {
    "value": SOL value,
    "lastInstruction": boolean
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ミント設定

_Bot Taxガードにはミント設定は必要ありません。_

## ルート命令

_Bot Taxガードはルート命令をサポートしません。_
