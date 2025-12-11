---
title: "Address Gate Guard"
metaTitle: Address Gate Guard | Candy Machine
description: "ミントを単一のアドレスに制限します。"
---

## 概要

**Address Gate**ガードは、ミント用ウォレットのアドレスと一致しなければならない単一のアドレスにミントを制限します。

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
{% node #addressGate label="AddressGate" /%}
{% node #address label="- Address" /%}
{% node label="..." /%}
{% /node %}

{% node parent="address" x="270" y="-9" %}
{% node #payer label="Payer" theme="indigo" /%}
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
{% edge from="address" to="payer" arrow="none" dashed=true /%}
{% edge from="payer" to="mint-candy-guard" arrow="none" dashed=true%}
if the payer does not match the address on the guard 

Minting will fail
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" /%}


{% /diagram %}

## ガード設定

Address Gateガードには以下の設定が含まれます：

- **Address**: Candy Machineからのミントが許可される唯一のアドレス。

{% dialect-switcher title="Address Gateガードを使用してCandy Machineを設定する" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    addressGate: some({ address: someWallet.publicKey }),
  },
});
```

APIリファレンス: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [AddressGate](https://mpl-candy-machine.typedoc.metaplex.com/types/AddressGate.html)


{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

config.jsonファイルのガードセクションに以下のオブジェクトを追加してください：

```json
"addressGate" : {
    "address": "<PUBKEY>"
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

これで、定義された公開鍵のみがこのCandy Machineからミントできるようになります。

## ミント設定

_Address Gateガードにはミント設定は必要ありません。_

## ルート命令

_Address Gateガードはルート命令をサポートまたは要求しません。_