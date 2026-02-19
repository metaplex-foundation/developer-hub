---
title: 配额守卫
metaTitle: 铸造配额守卫 | Core Candy Machine
description: "了解 Core Candy Machine 的 'Allocation' 守卫，您可以为 Core Candy Machine 的守卫组指定最大铸造数量。"
---

## 概述

**Allocation** 守卫允许指定每个守卫组可以铸造的资产数量限制。

限制是按标识符设置的——在设置中提供——以允许在同一个 Core Candy Machine 中进行多个配额分配。

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
  访问控制
{% /node %}

{% node parent="mint-candy-guard" #mint-candy-machine y="150" x="-9" %}
  {% node theme="pink" %}
    Mint from

    _Candy Machine Program_ {% .whitespace-nowrap %}
  {% /node %}
{% /node %}
{% node parent="mint-candy-machine" y="-20" x="140" theme="transparent" %}
  铸造逻辑
{% /node %}

{% node #nft parent="mint-candy-machine" y="140" x="71" theme="blue" %}
  Asset
{% /node %}
{% edge from="mint-candy-machine" to="nft" path="straight" /%}

{% edge from="candy-guard" to="candy-machine" /%}
{% edge from="allocation" to="pda" arrow="none" /%}
{% edge from="pda" to="mint-candy-guard" arrow="none" fromPosition="top" dashed=true%}
如果配额追踪器计数

等于限制

铸造将失败
{% /edge %}
{% edge from="mint-candy-guard" to="mint-candy-machine" /%}

{% /diagram %}

## 守卫设置

Allocation 守卫包含以下设置：

- **ID**：此守卫的唯一标识符。不同的标识符将使用不同的计数器来跟踪给定钱包铸造了多少物品。这在使用守卫组时特别有用，因为我们可能希望每个组都有不同的铸造限制。
- **Limit**：守卫组允许的最大铸造数量。

{% dialect-switcher title="使用 Allocation 守卫设置 Candy Machine" %}
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

API 参考：[create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html)、[Allocation](https://mpl-core-candy-machine.typedoc.metaplex.com/types/Allocation.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

将此对象添加到您的 config.json 文件的守卫部分：

```json
"allocation" : {
    "id": number,
    "limit": number
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 铸造设置

Allocation 守卫包含以下铸造设置：

- **ID**：此守卫的唯一标识符。

注意，如果您计划在没有我们 SDK 帮助的情况下构建指令，您需要将这些铸造设置和更多内容作为指令参数和剩余账户的组合提供。详情请参阅 [Candy Guard 的程序文档](https://github.com/metaplex-foundation/mpl-core-candy-machine/tree/main/programs/candy-guard#allocation)。

{% dialect-switcher title="使用 Allocation 守卫铸造" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

您可以使用 `mintArgs` 参数传递 Allocation 守卫的铸造设置，如下所示。

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

_一旦分配了守卫，您就不能使用 sugar 铸造 - 因此没有特定的铸造设置。_

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route 指令

Allocation 守卫的 route 指令支持以下功能。

### 初始化配额追踪器

使用 Allocation 守卫时，我们必须在铸造开始前初始化配额追踪器账户。这将创建一个从守卫设置的 id 属性派生的 PDA 账户。

配额追踪器 PDA 账户将跟踪守卫组中的铸造数量，一旦达到限制，它将阻止该组中的任何铸造。

初始化此配额追踪器账户时，我们必须向守卫的 route 指令提供以下参数：

- **ID**：守卫设置中 Allocation 的 id。
- **Candy Guard Authority**：Core Candy Guard 账户的授权作为签名者。

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
  初始化配额追踪器
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

{% dialect-switcher title="初始化配额追踪器 PDA" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

要为默认守卫初始化配额追踪器 PDA：

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

当 Allocation 守卫添加到特定组时，您需要添加 **group** 名称：

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

API 参考：[route](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/route.html)、[AllocationRouteArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/AllocationRouteArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_Sugar 目前不支持 route 指令。_

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 配额账户
当使用 `Allocation` 守卫时，在运行 route 指令后会创建一个 `allocationTracker` 账户。出于验证目的，可以这样获取它：

```js
import {
  safeFetchAllocationTrackerFromSeeds,
} from "@metaplex-foundation/mpl-core-candy-machine";

const allocationTracker = await safeFetchAllocationTrackerFromSeeds(umi, {
  id: 1, // 您在守卫配置中设置的配额 id
  candyMachine: candyMachine.publicKey,
  // 或者使用您的 CM 地址 candyMachine: publicKey("Address")
  candyGuard: candyMachine.mintAuthority,
  // 或者使用您的 candyGuard 地址 candyGuard: publicKey("Address")
});
```
