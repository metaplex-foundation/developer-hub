---
title: "Token Gate"
metaTitle: Token Gate Guard | Candy Machine
description: "Token Gateガードは、設定されたミントアカウントのトークン保有者にミントを制限します。"
---

## 概要

**Token Gate**ガードは、設定されたミントアカウントのトークン保有者にミントを制限します。支払者が必要な量のトークンを持っていない場合、ミントは失敗します。

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
{% node label="Token Gate" /%}
{% node #guardAmount label="- Amount" /%}
{% node #guardMint label="- Token Mint" /%}
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

{% node #nft parent="mint-candy-machine" y="140" x="72" theme="blue" %}
  NFT
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}
{% edge from="guardMint" to="mint" arrow="none" dashed=true /%}
{% edge from="mint-candy-guard" to="mint" arrow="none" dashed=true  theme="pink" %}
Check that the

payer's token account

contains x amount tokens{% .whitespace-nowrap %}
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" /%}

{% /diagram %}

## ガード設定

Token Gateガードには以下の設定が含まれます：

- **Amount**: 必要なトークンの数。
- **Mint**: ゲートに使用したいSPLトークンを定義するミントアカウントのアドレス。

{% dialect-switcher title="Token Gateガードを使用してCandy Machineを設定する" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    tokenGate: some({
      amount: 300,
      mint: tokenMint.publicKey,
    }),
  },
});
```

APIリファレンス: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [TokenGate](https://mpl-candy-machine.typedoc.metaplex.com/types/TokenGateArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

config.jsonファイルのガードセクションに以下のオブジェクトを追加してください：

```json
"tokenGate" : {
    "amount": number in basis points (e.g. 1000 for 1 Token that has 3 decimals),
    "mint": "<PUBKEY>"
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ミント設定

Token Gateガードには以下のミント設定が含まれます：

- **Mint**: ゲートに使用したいSPLトークンを定義するミントアカウントのアドレス。

注意：SDK の助けなしで命令を構築する予定の場合、これらのミント設定およびそれ以外を命令引数と残りのアカウントの組み合わせとして提供する必要があります。詳細については、[Candy GuardのプログラムドキュメントAtion](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#tokengate)を参照してください。

{% dialect-switcher title="Token Gateガードでミントする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

次のように`mintArgs`引数を使用してToken Gateガードのミント設定を渡すことができます。

```ts
mintV2(umi, {
  // ...
  mintArgs: {
    tokenGate: some({ mint: tokenMint.publicKey }),
  },
});
```

APIリファレンス: [mintV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintV2.html), [TokenGateMintArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/TokenGateMintArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_ガードが割り当てられるとすぐに、sugarを使用してミントすることはできません - したがって、特定のミント設定はありません。_

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ルート命令

_Token Gateガードはルート命令をサポートしません。_
