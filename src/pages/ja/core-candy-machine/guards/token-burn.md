---
title: Token Burnガード
metaTitle: Token Burnガード | Core Candy Machine
description: "Core Candy Machineの「Token Burn」ガードは、ミント通貨をSPLトークンアドレスと値に設定することでミントを許可します。"
---

## 概要

**Token Burn**ガードは、設定されたミントアカウントから支払者のトークンの一部をバーンすることでミントを許可します。支払者がバーンするために必要な量のトークンを持っていない場合、ミントは失敗します。

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="20" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node label="Token Burn" /%}
{% node #guardAmount label="- Amount" /%}
{% node #guardMint label="- Mint" /%}
{% node label="..." /%}
{% /node %}

{% node parent="guardMint" #mint x="270" y="-19" %}
{% node  theme="indigo" %}
Mint Account {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: Token Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
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
{% edge from="guardMint" to="mint" arrow="none" dashed=true /%}
{% edge from="mint-candy-guard" to="mint" arrow="none" dashed=true  theme="pink" %}
支払者のトークンアカウント

からトークンをバーン
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

## ガード設定

Token Burnガードには以下の設定が含まれます:

- **Amount**: バーンするトークンの数。
- **Mint**: バーンしたいSPLトークンを定義するミントアカウントのアドレス。

{% dialect-switcher title="NFT Burnガードを使用してCandy Machineをセットアップする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    tokenBurn: some({
      amount: 300,
      mint: tokenMint.publicKey,
    }),
  },
});
```

APIリファレンス: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [TokenBurn](https://mpl-core-candy-machine.typedoc.metaplex.com/types/TokenBurnArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ミント設定

Token Burnガードには以下のミント設定が含まれます:

- **Mint**: バーンしたいSPLトークンを定義するミントアカウントのアドレス。

SDKを使用せずに手動で命令を構築する場合は、これらのミント設定などを命令の引数と残りのアカウントの組み合わせとして提供する必要があることに注意してください。詳細については、[Candy Guardのプログラムドキュメント](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#tokenburn)を参照してください。

{% dialect-switcher title="NFT Burnガードを使用してミントする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

Token BurnガードのMint Settingsは、次のように`mintArgs`引数を使用して渡すことができます。

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    tokenBurn: some({ mint: tokenMint.publicKey }),
  },
});
```

APIリファレンス: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [TokenBurnMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/TokenBurnMintArgs.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ルート命令

_Token Burnガードはルート命令をサポートしていません。_
