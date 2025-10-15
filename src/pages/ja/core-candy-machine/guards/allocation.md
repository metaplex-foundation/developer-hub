---
title: Allocation ガード
metaTitle: Mint Allocation ガード | Core Candy Machine
description: "Core Candy Machine の 'Allocation' ガードでは、各ガードグループがミントできるアセット数の上限を指定できます。"
---

## 概要

**Allocation** ガードは、各ガードグループがミントできるアセット数の上限を指定できます。

上限は設定で提供される識別子ごとに設定され、同じ Core Candy Machine 内で複数の割り当てを可能にします。

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
{% node #allocation label="Allocation" /%}
{% node label="- id" /%}
{% node label="- limit" /%}
{% node label="..." /%}
{% /node %}

{% node parent="allocation" x="270" y="-9" %}
{% node #pda theme="indigo" %}
Allocation Tracker PDA {% .whitespace-nowrap %}
{% /node %}
{% /node %}

{% node parent="candy-machine" #mint-candy-guard x="600" %}
  {% node theme="pink" %}
    Mint from

    _Candy Guard Program_ {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-guard" y="-20" x="100" theme="transparent" %}
  Access Control
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-9" %}
  {% node theme="pink" %}
    Mint from

    _Candy Machine Program_ {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="71" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" /%}
{% edge from="allocation" to="pda" arrow="none" /%}
{% edge from="pda" to="mint-candy-guard" arrow="none" fromPosition="top" dashed=true%}
if the allocation tracker count

is equal to the limit

Minting will fail
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" /%}


{% /diagram %}

## ガード設定

Allocation ガードには以下の設定が含まれます：

- **ID**: このガードの一意の識別子。異なる識別子は、指定されたウォレットによってミントされたアイテム数を追跡するために異なるカウンターを使用します。これは、ガードのグループを使用する際に特に有用です。各グループに異なるミント上限を設定したい場合があるためです。
- **Limit**: ガードグループで許可されるミントの最大数。

{% dialect-switcher title="Allocation ガードを使用した Candy Machine の設定" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
create(umi, {
  // ...
  guards: {
    allocation: some({ id: 1, limit: 5 }),
  },
});
```

API リファレンス: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [Allocation](https://mpl-core-candy-machine.typedoc.metaplex.com/types/Allocation.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

config.json ファイルの guard セクションに以下のオブジェクトを追加してください：

```json
"allocation" : {
    "id": number,
    "limit": number
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ミント設定

Allocation ガードには以下のミント設定が含まれます：

- **ID**: このガードの一意の識別子。

注: SDK を使用せずに命令を構築する予定がある場合は、これらのミント設定をさらに命令引数と残りのアカウントの組み合わせとして提供する必要があります。詳細については、[Candy Guard のプログラムドキュメント](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#allocation)を参照してください。

{% dialect-switcher title="Allocation ガードを使用したミント" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

Allocation ガードのミント設定は、次のように `mintArgs` 引数を使用して渡すことができます。

```ts
mintV1(umi, {
  // ...
  mintArgs: {
    allocation: some({ id: 1 }),
  },
});
```

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_ガードが割り当てられると、sugar を使用してミントすることはできません。そのため、特定のミント設定はありません。_

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route 命令

Allocation ガードの route 命令は以下の機能をサポートします。

### Allocation Tracker の初期化

Allocation ガードを使用する場合、ミントを開始する前に Allocation Tracker アカウントを初期化する必要があります。これにより、ガード設定の id 属性から派生した PDA アカウントが作成されます。

Allocation Tracker PDA アカウントは、ガードグループ内のミント数を追跡し、上限に達すると そのグループ内のミントをブロックします。

この Allocation Tracker アカウントを初期化する際、ガードの route 命令に以下の引数を提供する必要があります：

- **ID**: ガード設定の Allocation の id。
- **Candy Guard Authority**: Core Candy Guard アカウントの権限（署名者として）。

{% diagram  %}

{% node %}
{% node #candy-machine label="Candy Machine" theme="blue" /%}
{% node theme="dimmed" %}

Owner: Candy Machine Core Program {% .whitespace-nowrap %}

{% /node %}
{% /node %}

{% node parent="candy-machine" y="100" x="22" %}
{% node #candy-guard label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node #guards label="Guards" theme="mint" z=1/%}
{% node #allocation label="Allocation" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine" x="415" %}
  {% node #candy-guard-route theme="pink" %}
    Route from the

    _Candy Guard Program_
  {% /node %}
{% /node %}
{% node parent="candy-guard-route" y="-20" x="-4" theme="transparent" %}
  Initialize Allocation Tracker
{% /node %}

{% edge from="guards" to="candy-guard-route" theme="pink" toPosition="left" /%}
{% edge from="candy-guard-route" to="freezeEscrow-PDA3" theme="pink" path="straight" y="-10" /%}

{% node #freezeEscrow-PDA3 parent="allocation" x="390" y="-10" %}
{% node label="Allocation Tracker PDA" theme="blue" /%}
{% node label="count = 0" theme="dimmed" /%}
{% /node %}

{% edge from="candy-guard" to="candy-machine" /%}
{% edge from="allocation" to="freezeEscrow-PDA3" arrow="none" dashed=true path="straight" /%}
{% edge from="candy-guard-route" to="mint-candy-machine" path="straight" /%}

{% /diagram %}

{% seperator h="6" /%}

{% dialect-switcher title="Allocation Tracker PDA の初期化" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

デフォルトガード用の Allocation Tracker PDA を初期化するには：

```ts
route(umi, {
  // ...
  guard: 'allocation',
  routeArgs: {
    id: 1,
    candyGuardAuthority: umi.identity,
  },
})
```

Allocation ガードが特定のグループに追加された場合、**group** 名を追加する必要があります：

```ts
route(umi, {
  // ...
  guard: 'allocation',
  routeArgs: {
    id: 1,
    candyGuardAuthority: umi.identity,
  },
  group: some('GROUPA'),
})
```

API リファレンス: [route](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/route.html), [AllocationRouteArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AllocationRouteArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_Sugar は現在 route 命令をサポートしていません。_

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Allocation アカウント
`Allocation` ガードが使用されると、route 命令の実行後に `allocationTracker` アカウントが作成されます。検証目的で次のように取得できます：

```js
import {
  safeFetchAllocationTrackerFromSeeds,
} from "@metaplex-foundation/mpl-core-candy-machine";

const allocationTracker = await safeFetchAllocationTrackerFromSeeds(umi, {
  id: 1, // ガード設定で設定した allocation id
  candyMachine: candyMachine.publicKey,
  // または candyMachine: publicKey("Address") で CM アドレスを指定
  candyGuard: candyMachine.mintAuthority,
  // または candyGuard: publicKey("Address") で candyGuard アドレスを指定
});
```
