---
title: "Core Candy Machine - Vanity Mintガード"
metaTitle: "Core Candy Machine - Guards - Vanity Mint"
description: "Core Candy Machineの「Vanity Mint」ガードは、ミンターが特定のバニティミントをアセットアドレスとして提供する必要があります"
---

## 概要

**Vanity Mint**ガードは、指定されたミントアドレスが特定の形式と一致する場合にミントを許可します。このガードは基本的に、ユーザーがパターンに一致するPublic Keyをグラインドする必要があるProof of Work (POW)要件を追加できます。

ミンターが一致するミントアドレスを使用しない場合、ミントは失敗します。

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="20" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node #vanityMint label="vanityMint" /%}
{% node #regEx label="- Regular Expression" /%}
{% node label="..." /%}
{% /node %}

{% node parent="regEx" x="270" y="-9"  %}
{% node #nftMint theme="blue" %}
Mint {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="regEx" to="nftMint" /%}

{% edge from="nftMint" to="mint-candy-guard" theme="indigo" dashed=true %}
ミントアドレスが

正規表現と一致するかを確認
{% /edge %}
{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
    _Candy Guard Program_

    からミント
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  アクセス制御
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-9" %}
  {% node theme="pink" %}
    _Candy Machine Program_

    からミント
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  ミントロジック
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="69" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}

{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## ガード設定

Vanity Mintガードには以下の設定が含まれます:

- **Regular Expression**: ミントアドレスが一致する必要がある正規表現。例えば、すべてのミントを文字列`mplx`で始めたい場合は、これを`regex`パラメータとして使用できます。

使用できる正規表現のアイデアは次のとおりです:
- 特定のパターンで始まる: `^mplx`
- 特定のパターンで終わる: `mplx$`
- 特定のパターンで始まり、終わる: `^mplx*mplx$`
- 特定のパターンと完全に一致: `^mplx1111111111111111111111111111111111111mplx$`
文字列`mplx`は期待される文字に置き換える必要があります。

{% dialect-switcher title="ミントが`mplx`で始まり、終わるVanity Mintガードを使用してCandy Machineをセットアップする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    vanityMint: some({
      regex: "^mplx*mplx$",
    }),
  },
});
```

APIリファレンス: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [VanityMint](https://mpl-core-candy-machine.typedoc.metaplex.com/types/VanityMint.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ミント設定

_Vanity Mintガードはミント設定を必要としません。ミントアドレスが一致することを期待します。_

## ルート命令

_Vanity Mintガードはルート命令をサポートしていません。_
