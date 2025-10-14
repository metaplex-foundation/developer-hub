---
title: Third Party Signer ガード
metaTitle: Third Party Signer ガード | Core Candy Machine
description: "Core Candy Machine の 'Third Party Signer' ガードは、各ミントトランザクションに事前定義されたアドレスの署名を要求し、署名がない場合はトランザクションが失敗します。"
---

## 概要

**Third Party Signer** ガードは、各ミントトランザクションに事前定義されたアドレスの署名を要求します。署名者は、このガードのミント設定内で渡す必要があります。

これにより、すべてのミントトランザクションが特定の署名者を経由する必要がある、より集中化されたミントが可能になります。

{% diagram  %}

{% node %}
{% node #candy-machine label="Core Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Machine Core Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="20" %}
{% node #candy-guard label="Core Candy Guard" theme="blue" /%}
{% node theme="dimmed" %}
Owner: Core Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node label="Third Party Signer" /%}
{% node #guardSigner label="- Signer" /%}
{% node label="..." /%}
{% /node %}

{% node parent="guardSigner" #signer x="270" y="-19" %}
{% node  theme="indigo" %}
Signer {% .whitespace-nowrap %}
{% /node %}
{% node theme="dimmed" %}
Owner: Any Program {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
    Mint from

    _Core Candy Guard Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-9" %}
  {% node theme="pink" %}
    Mint from

    _Core Candy Machine Program_{% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="93" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}
{% edge from="guardSigner" to="signer" arrow="none" dashed=true /%}
{% edge from="mint-candy-guard" to="signer" arrow="none" dashed=true  theme="pink" %}
If this Signer Account does not

sign the mint transaction

minting will fail
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" path="straight" /%}

{% /diagram %}
## ガード設定

Third Party Signer ガードには以下の設定が含まれます：

- **Signer Key**: 各ミントトランザクションに署名する必要がある署名者のアドレス。

{% dialect-switcher title="Third Party Signer ガードを使用した Candy Machine の設定" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
const myConfiguredSigner = generateSigner(umi);

create(umi, {
  // ...
  guards: {
    thirdPartySigner: some({ signerKey: myConfiguredSigner.publicKey }),
  },
});
```

API リファレンス: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [ThirdPartySigner](https://mpl-core-candy-machine.typedoc.metaplex.com/types/ThirdPartySigner.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ミント設定

Third Party Signer ガードには以下のミント設定が含まれます：

- **Signer**: 必須のサードパーティ署名者。この署名者のアドレスは、ガード設定の Signer Key と一致する必要があります。

{% dialect-switcher title="Third Party Signer ガードを使用したミント" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

Umi ライブラリを介してミントする場合は、次のように `signer` 属性を介してサードパーティ署名者を提供するだけです。

```ts
create(umi, {
  // ...
  guards: {
    thirdPartySigner: some({ signer: myConfiguredSigner }),
  },
});
```

myConfiguredSigner キーペアでトランザクションに署名することも忘れないでください。

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route 命令

_Third Party Signer ガードは route 命令をサポートしません。_
