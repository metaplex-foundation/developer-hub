---
title: Allocation Guard
metaTitle: Allocation Guard | Candy Machine"
description: "Allocationガードはガードグループのミント最大数を指定します。"
---

## 概要

**Allocation**ガードは、各ガードグループがミントできるNFTの数に制限を指定することができます。

制限は設定で提供される識別子ごとに設定され、同じCandy Machine内で複数の割り当てを可能にします。

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

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-8" %}
  {% node theme="pink" %}
    Mint from 
    
    _Candy Machine Program_ {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  Mint Logic
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="71" theme="blue" %}
  NFT
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

Allocationガードには以下の設定が含まれます：

- **ID**: このガードの一意な識別子。異なる識別子は、指定されたウォレットによってミントされたアイテム数を追跡するために異なるカウンターを使用します。これは、ガードのグループを使用する際に、それぞれが異なるミント制限を持つことを望む場合に特に有用です。
- **Limit**: ガードグループで許可されるミントの最大数。

{% dialect-switcher title="Allocationガードを使用してCandy Machineを設定する" %}
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

APIリファレンス: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [Allocation](https://mpl-candy-machine.typedoc.metaplex.com/types/Allocation.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

config.jsonファイルのガードセクションに以下のオブジェクトを追加してください：

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

Allocationガードには以下のミント設定が含まれます：

- **ID**: このガードの一意な識別子。

注意：SDK の助けを借りずに命令を構築する予定の場合、これらのミント設定およびそれ以外を命令引数と残りのアカウントの組み合わせとして提供する必要があります。詳細については、[Candy GuardのプログラムドキュメントAtion](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#allocation)を参照してください。

{% dialect-switcher title="Allocationガードでミントする" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

次のように`mintArgs`引数を使用してAllocationガードのミント設定を渡すことができます。

```ts
mintV2(umi, {
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

_ガードが割り当てられるとすぐに、sugarを使用してミントすることはできません - したがって、特定のミント設定はありません。_

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## ルート命令

Allocationガードのルート命令は以下の機能をサポートします。

### Allocation Trackerの初期化

Allocationガードを使用する場合、ミントを開始する前にAllocation Trackerアカウントを初期化する必要があります。これにより、ガード設定のid属性から派生したPDAアカウントが作成されます。

Allocation Tracker PDAアカウントは、ガードグループ内のミント数を追跡し、制限に達するとそのグループ内のミントをブロックします。

このAllocation Trackerアカウントを初期化する際、ガードのルート命令に以下の引数を提供する必要があります：

- **ID**: ガード設定のAllocationのID。
- **Candy Guard Authority**: SignerとしてのCandy GuardアカウントのAuthority。

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
    Route frmo the 
    
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

‎

{% dialect-switcher title="Allocation Tracker PDAを初期化する" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

デフォルトガード用のAllocation Tracker PDAを初期化するには：

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

Allocationガードが特定のグループに追加されている場合、**group**名を追加する必要があります：

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

APIリファレンス: [route](https://mpl-candy-machine.typedoc.metaplex.com/functions/route.html), [AllocationRouteArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/AllocationRouteArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_Sugarは現在ルート命令をサポートしていません。_

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}