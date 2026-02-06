---
title: Mint Limitガード
metaTitle: "Mint Limitガード | Core Candy Machine"
description: "Core Candy Machineの「Mint Limit」ガードは、各ウォレットがミントできるアセットの数に制限を指定できます。"
---

## 概要

**Mint Limit**ガードは、各ウォレットがミントできるアセットの数に制限を指定できます。

制限は、ウォレットごと、Candy Machineごと、設定で提供される識別子ごとに設定され、同じCore Candy Machine内で複数のミント制限を許可します。

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
Owner: Candy Guard Program {% .whitespace-nowrap %}
{% /node %}
{% node #candy-guard-guards label="Guards" theme="mint" z=1/%}
{% node #mintLimit label="MintLimit" /%}
{% node #limit label="- Limit" /%}
{% node #id label="- ID" /%}
{% node label="..." /%}
{% /node %}

{% node parent="id" x="270" y="-9"  %}
{% node #mintCounterPda %}
Mint Counter PDA {% .whitespace-nowrap %}
{% /node %}
{% /node %}
{% edge from="payer" to="mintCounterPda" path="straight" /%}
{% edge from="id" to="mintCounterPda" /%}

{% node parent="mintCounterPda" x="18" y="100" %}
{% node #payer label="Payer" theme="indigo" /%}
{% node label="Owner: Any Program" theme="dimmed" /%}
{% /node %}

{% edge from="mintLimit" to="mint-candy-guard" theme="indigo" dashed=true/%}
{% node parent="candy-machine" x="600" %}
  {% node #mint-candy-guard theme="pink" %}
    _Candy Guard Program_

    からミント
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  アクセス制御
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-30" %}
  {% node  theme="pink" %}
    _Core Candy Machine Program_

    からミント
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  ミントロジック
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="90" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" path="straight" /%}

{% edge from="mint-candy-guard" to="mint-candy-machine" /%}

{% /diagram %}

## ガード設定

Mint Limitガードには以下の設定が含まれます:

- **ID**: このガードの一意の識別子。異なる識別子は、特定のウォレットによってミントされたアイテムの数を追跡するために異なるカウンターを使用します。これは、ガードのグループを使用する場合に特に便利で、それぞれに異なるミント制限を持たせることができます。
- **Limit**: その識別子のウォレットごとに許可される最大ミント数。

{% dialect-switcher title="Mint Limitガードを使用してCandy Machineをセットアップする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    mintLimit: some({ id: 1, limit: 5 }),
  },
});
```

APIリファレンス: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [MintLimit](https://mpl-core-candy-machine.typedoc.metaplex.com/types/MintLimit.html)

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ミント設定

Mint Limitガードには以下のミント設定が含まれます:

- **ID**: このガードの一意の識別子。

SDKを使用せずに手動で命令を構築する場合は、これらのミント設定などを命令の引数と残りのアカウントの組み合わせとして提供する必要があることに注意してください。詳細については、[Core Candy Guardのプログラムドキュメント](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#mintlimit)を参照してください。

{% dialect-switcher title="Mint Limitガードを使用してミントする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

Mint LimitガードのMint Settingsは、次のように`mintArgs`引数を使用して渡すことができます。

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    mintLimit: some({ id: 1 }),
  },
});
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ルート命令

_Mint Limitガードはルート命令をサポートしていません。_

## MintLimitアカウント

`MintLimit`ガードを使用すると、各ウォレット、CandyMachine、および`id`の組み合わせに対して`MintCounter`アカウントが作成されます。検証目的で次のようにフェッチできます:

```js
import { safeFetchMintCounterFromSeeds } from "@metaplex-foundation/mpl-core-candy-machine";
import { umi } from "@metaplex-foundation/mpl-core-candy-machine";

const mintCounter = await safeFetchMintCounterFromSeeds(umi, {
  id: 1, // ガード設定で設定したmintLimitのid
  user: umi.identity.publicKey,
  candyMachine: candyMachine.publicKey,
  // または candyMachine: publicKey("Address") でCMアドレスを指定
  candyGuard: candyMachine.mintAuthority,
  // または candyGuard: publicKey("Address") でcandyGuardアドレスを指定
});

// 既にミントされた量
console.log(mintCounter.count)
```
