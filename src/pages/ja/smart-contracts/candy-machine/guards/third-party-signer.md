---
title: "Third Party Signer Guard"
metaTitle: Third Party Signer Guard | Candy Machine
description: "Third Party Signerガードは、各ミントトランザクションに事前定義されたアドレスの署名を要求します。"
---

## 概要

**Third Party Signer**ガードは、各ミントトランザクションに事前定義されたアドレスの署名を要求します。署名者はこのガードのミント設定内で渡される必要があります。

これにより、すべての単一のミントトランザクションが特定の署名者を通過しなければならない、より一元化されたミントが可能になります。

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
{% edge from="guardSigner" to="signer" arrow="none" dashed=true /%}
{% edge from="mint-candy-guard" to="signer" arrow="none" dashed=true  theme="pink" %}
If this Signer Account does not

sign the mint transaction

minting will fail
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" /%}

{% /diagram %}
## ガード設定

Third Party Signerガードには以下の設定が含まれます：

- **Signer Key**: 各ミントトランザクションに署名する必要がある署名者のアドレス。

{% dialect-switcher title="Third Party Signerガードを使用してCandy Machineを設定する" %}
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

APIリファレンス: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [ThirdPartySigner](https://mpl-candy-machine.typedoc.metaplex.com/types/ThirdPartySigner.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

config.jsonファイルのガードセクションに以下のオブジェクトを追加してください：

```json
"thirdPartySigner" : {
    "signerKey": "<PUBKEY>"
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ミント設定

Third Party Signerガードには以下のミント設定が含まれます：

- **Signer**: 必要なサードパーティ署名者。この署名者のアドレスは、ガード設定のSigner Keyと一致する必要があります。

{% dialect-switcher title="Third Party Signerガードでミントする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

Umiライブラリを介してミントする際は、次のように`signer`属性を介してサードパーティ署名者を提供するだけです。

```ts
create(umi, {
  // ...
  guards: {
    thirdPartySigner: some({ signer: myConfiguredSigner }),
  },
});
```

myConfiguredSignerキーペアでトランザクションに署名することも忘れずに行ってください。

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_ガードが割り当てられるとすぐに、sugarを使用してミントすることはできません - したがって、特定のミント設定はありません。_

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ルート命令

_Third Party Signerガードはルート命令をサポートしません。_
