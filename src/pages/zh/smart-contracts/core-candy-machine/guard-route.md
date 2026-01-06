---
title: 特殊守卫指令
metaTitle: 特殊守卫指令 | Core Candy Machine
description: 解释如何为 Core Candy Machine 执行守卫特定的指令。
---

正如我们在前面的页面中所看到的，守卫是自定义 Candy Machine 铸造过程的强大方式。但您知道守卫甚至可以提供自己的自定义指令吗？ {% .lead %}

## Route 指令

Core Candy Guard 程序附带一个特殊指令，称为 **"Route" 指令**。

此指令允许我们**从 Core Candy Machine 选择特定的守卫**并**运行该守卫特定的自定义指令**。我们称其为 "Route" 指令，因为它会将我们的请求路由到所选的守卫。

此功能使守卫更加强大，因为它们可以附带自己的程序逻辑。它使守卫能够：

- 将繁重操作的验证过程与铸造过程分离。
- 提供否则需要部署自定义程序的自定义功能。

要调用 route 指令，我们必须指定我们要将该指令路由到哪个守卫，并**提供它期望的 route 设置**。注意，如果我们尝试通过选择不支持它的守卫来执行 "route" 指令，交易将失败。

由于在 Candy Guard 程序上每个注册的守卫只能有一个 "route" 指令，因此通常在 route 设置中提供 **Path** 属性以区分同一守卫提供的多个功能。

例如，添加对冻结 NFT 支持的守卫——只有在铸造结束后才能解冻——可以使用其 route 指令来初始化 treasury escrow 账户，以及允许任何人在正确条件下解冻铸造的 NFT。我们可以使用 **Path** 属性来区分这两个功能，前者等于 "init"，后者等于 "thaw"。

您将在每个支持它的守卫[各自的页面](/zh/smart-contracts/core-candy-machine/guards)上找到其 route 指令及其底层路径的详细说明。

让我们花一点时间通过提供一个例子来说明 route 指令的工作原理。例如，[**Allow List**](/zh/smart-contracts/core-candy-machine/guards/allow-list) 守卫支持 route 指令，以验证铸造钱包是否属于预配置的钱包列表。

它使用 [Merkle Trees](https://en.m.wikipedia.org/wiki/Merkle_tree) 来做到这一点，这意味着我们需要创建整个允许钱包列表的哈希并将该哈希——称为 **Merkle Root**——存储在守卫设置中。对于钱包来证明它在允许列表中，它必须提供一个哈希列表——称为 **Merkle Proof**——允许程序计算 Merkle Root 并确保它与守卫的设置匹配。

因此，Allow List 守卫**使用其 route 指令来验证给定钱包的 Merkle Proof**，如果成功，则在区块链上创建一个小的 PDA 账户，作为铸造指令的验证证明。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Candy Machine" theme="blue" /%}
{% node label="Owner: Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node label="Guards" theme="mint" z=1 /%}
{% node #allow-list-guard label="Allow List" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=550 %}
{% node #mint-1 label="Mint" theme="pink" /%}
{% node label="Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="Access Control" theme="transparent" /%}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% node parent="mint-2" x=-250 %}
{% node #route label="Route" theme="pink" /%}
{% node label="Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="route" x=70 y=-20 label="验证 Merkle Proof" theme="transparent" /%}

{% node #allow-list-pda parent="route" x=23 y=100 label="Allow List PDA" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="allow-list-guard" to="route" theme="pink" /%}
{% edge from="route" to="allow-list-pda" theme="pink" path="straight" /%}
{% edge from="allow-list-pda" to="mint-1" theme="pink" /%}

{% /diagram %}

那么为什么我们不能直接在铸造指令中验证 Merkle Proof 呢？这仅仅是因为，对于大型允许列表，Merkle Proof 可能会变得相当长。超过一定大小后，就不可能将其包含在已经包含相当数量指令的铸造交易中。通过将验证过程与铸造过程分离，我们使允许列表可以根据需要变大。

{% dialect-switcher title="调用守卫的 route 指令" %}
{% dialect title="JavaScript" id="js" %}

使用 Umi 库时，您可以使用 `route` 函数来调用守卫的 route 指令。您需要通过 `guard` 属性传递守卫的名称，并通过 `routeArgs` 属性传递其 route 设置。

以下是使用 Allow List 守卫的示例，它在铸造前验证钱包的 Merkle Proof。

```ts
import {
  create,
  route,
  getMerkleProof,
  getMerkleRoot,
} from '@metaplex-foundation/mpl-core-candy-machine'

// 准备允许列表。
// 假设列表上的第一个钱包是 Metaplex 身份。
const allowList = [
  'GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS',
  '2vjCrmEFiN9CLLhiqy8u1JPh48av8Zpzp3kNkdTtirYG',
  'AT8nPwujHAD14cLojTcB1qdBzA1VXnT6LVGuUd6Y73Cy',
]
const merkleRoot = getMerkleRoot(allowList)

// 创建带有 Allow List 守卫的 Candy Machine。
await create(umi, {
  // ...
  guards: {
    allowList: some({ merkleRoot }),
  },
}).sendAndConfirm(umi)

// 如果我们现在尝试铸造，它将失败，因为
// 我们没有验证我们的 Merkle Proof。

// 使用 route 指令验证 Merkle Proof。
await route(umi, {
  candyMachine: candyMachine.publicKey,
  guard: 'allowList',
  routeArgs: {
    path: 'proof',
    merkleRoot,
    merkleProof: getMerkleProof(
      allowList,
      'GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS'
    ),
  },
}).sendAndConfirm(umi)

// 如果我们现在尝试铸造，它将成功。
```

API 参考: [route](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/route.html), [DefaultGuardSetRouteArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetRouteArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 带有组的 Route 指令

在使用守卫组时调用 route 指令时，重要的是要**指定我们想要选择的守卫的组标签**。这是因为我们可能在不同的组中有多个相同类型的守卫，程序需要知道它应该为 route 指令使用哪一个。

例如，假设我们在一个组中有一个手工挑选的 VIP 钱包的 **Allow List**，在另一个组中有另一个抽奖获胜者的 **Allow List**。那么说我们想要验证 Allow List 守卫的 Merkle Proof 是不够的，我们还需要知道应该为哪个组执行该验证。

{% dialect-switcher title="调用 route 指令时按组过滤" %}
{% dialect title="JavaScript" id="js" %}

使用组时，Umi 库的 `route` 函数接受一个额外的 `group` 属性，类型为 `Option<string>`，必须设置为我们想要选择的组的标签。

```ts
import {
  create,
  route,
  getMerkleProof,
  getMerkleRoot,
} from "@metaplex-foundation/mpl-core-candy-machine";
import { base58PublicKey, some } from "@metaplex-foundation/umi";

// 准备允许列表。
const allowListA = [...];
const allowListB = [...];

// 创建带有两个 Allow List 守卫的 Candy Machine。
await create(umi, {
  // ...
  groups: [
    {
      label: "listA",
      guards: {
        allowList: some({ merkleRoot: getMerkleRoot(allowListA) }),
      },
    },
    {
      label: "listB",
      guards: {
        allowList: some({ merkleRoot: getMerkleRoot(allowListB) }),
      },
    },
  ],
}).sendAndConfirm(umi);

// 通过指定要选择的组来验证 Merkle Proof。
await route(umi, {
  candyMachine: candyMachine.publicKey,
  guard: 'allowList',
  group: some('listA'), // <- 我们正在使用 "allowListA" 验证。
  routeArgs: {
    path: 'proof',
    merkleRoot: getMerkleRoot(allowListA),
    merkleProof: getMerkleProof(
      allowListA,
      base58PublicKey(umi.identity),
    ),
  },
}).sendAndConfirm(umi);
```

API 参考: [route](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/route.html), [DefaultGuardSetRouteArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetRouteArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 结论

route 指令通过允许守卫附带自己的自定义程序逻辑使守卫更加强大。查看[所有可用守卫](/zh/smart-contracts/core-candy-machine/guards)的专用页面以了解每个守卫的完整功能集。

现在我们了解了设置 Core Candy Machine 及其守卫的所有内容，是时候谈谈铸造了。我们在[下一页](/zh/smart-contracts/core-candy-machine/mint)见！您可能还想阅读关于[获取它](/zh/smart-contracts/core-candy-machine/fetching-a-candy-machine)的内容。
