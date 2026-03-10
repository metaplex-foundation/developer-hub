---
title: Core Candy Machine 守卫的路由指令
metaTitle: Core Candy Machine 守卫的路由指令 | Core Candy Machine
description: 路由指令允许 Core Candy Machine 上的各个守卫公开其自定义链上逻辑，例如在铸造前运行的预验证步骤。
keywords:
  - route instruction
  - core candy machine
  - candy guard
  - guard instructions
  - allow list
  - merkle proof
  - merkle tree
  - pre-validation
  - minting guards
  - Solana NFT
  - Metaplex
  - guard groups
  - custom guard logic
  - PDA verification
about:
  - Route instruction
  - Guard instructions
  - Pre-validation
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
faqs:
  - q: 哪些守卫支持路由指令？
    a: 并非所有守卫都支持路由指令。只有需要预验证或自定义链上逻辑的守卫才会公开路由处理程序。Allow List 守卫是最常见的示例，使用路由在铸造前验证 Merkle Proof。请查看每个守卫的专用文档页面以了解路由支持详情。
  - q: 如果我对不支持路由指令的守卫调用路由指令会发生什么？
    a: 交易将失败。Core Candy Guard 程序会拒绝针对未实现路由处理程序的守卫的路由调用。在调用之前，请始终验证守卫是否支持路由指令。
  - q: 为什么 Allow List 守卫使用单独的路由指令而不是在铸造期间验证？
    a: 大型允许列表产生的 Merkle Proof 与铸造指令自身的数据组合时可能超过交易大小限制。通过将证明验证分离为专用路由交易，Allow List 守卫可以支持任意大的列表而不会触及 Solana 的交易大小限制。
  - q: 调用路由指令时需要指定组标签吗？
    a: 仅当您的 Core Candy Machine 使用守卫组时需要。如果同一守卫类型出现在多个组中，程序需要组标签来确定哪个守卫实例应处理路由调用。没有组时，不需要组参数。
  - q: 路由设置中的 Path 属性是什么？
    a: Path 属性用于区分单个守卫路由指令提供的多个功能。例如，支持冻结 NFT 的守卫可能使用 path "init" 来初始化 escrow 账户，使用 path "thaw" 来解冻铸造的 NFT。每个守卫定义自己的有效路径集。
---

## 概述

路由指令是 Core Candy Guard 程序中的特殊指令，将执行委托给特定的[守卫](/zh/smart-contracts/core-candy-machine/guards)，使守卫能够在标准[铸造](/zh/smart-contracts/core-candy-machine/mint)流程之外运行自定义链上逻辑。

- 将请求路由到所选守卫，以便它可以独立于铸造交易执行自己的程序逻辑。
- 支持预验证工作流程，例如 [Allow List 守卫](/zh/smart-contracts/core-candy-machine/guards/allow-list)的 Merkle Proof 验证。
- 支持 **Path** 属性以区分单个守卫路由处理程序中的多个功能。
- 当 Core Candy Machine 使用[守卫组](/zh/smart-contracts/core-candy-machine/guard-groups)时，需要**组标签**。

正如我们在前面的页面中所看到的，守卫是自定义 Candy Machine 铸造过程的强大方式。但您知道守卫甚至可以提供自己的自定义指令吗？ {% .lead %}

## 路由指令

路由指令是 Core Candy Guard 程序中的专用入口点，将请求转发到特定守卫，允许该守卫独立于铸造交易执行自定义链上逻辑。

此指令允许我们**从 Core Candy Machine 选择特定的守卫**并**运行该守卫特定的自定义指令**。我们称其为 "Route" 指令，因为它会将我们的请求路由到所选的守卫。

此功能使守卫更加强大，因为它们可以附带自己的程序逻辑。它使守卫能够：

- 将繁重操作的验证过程与铸造过程分离。
- 提供否则需要部署自定义程序的自定义功能。

要调用 route 指令，我们必须指定我们要将该指令路由到哪个守卫，并**提供它期望的 route 设置**。

{% callout type="warning" %}
如果您通过选择不支持路由指令的守卫来执行路由指令，交易将失败。在调用之前，请查看[守卫的文档页面](/zh/smart-contracts/core-candy-machine/guards)以确认路由支持。
{% /callout %}

由于在 Candy Guard 程序上每个注册的守卫只能有一个 "route" 指令，因此通常在 route 设置中提供 **Path** 属性以区分同一守卫提供的多个功能。

例如，添加对冻结 NFT 支持的守卫——只有在铸造结束后才能解冻——可以使用其 route 指令来初始化 treasury escrow 账户，以及允许任何人在正确条件下解冻铸造的 NFT。我们可以使用 **Path** 属性来区分这两个功能，前者等于 "init"，后者等于 "thaw"。

您将在每个支持它的守卫[各自的页面](/zh/smart-contracts/core-candy-machine/guards)上找到其 route 指令及其底层路径的详细说明。

### Allow List 守卫路由示例

[Allow List 守卫](/zh/smart-contracts/core-candy-machine/guards/allow-list)是使用路由指令最常见的守卫，在允许铸造之前验证铸造钱包是否属于预配置的允许钱包列表。

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

## 带有守卫组的路由指令

当 Core Candy Machine 使用[守卫组](/zh/smart-contracts/core-candy-machine/guard-groups)时，路由指令需要组标签，因为同一守卫类型可能出现在多个组中，程序必须知道要定位哪个实例。

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

## 注意事项

- 并非所有[守卫](/zh/smart-contracts/core-candy-machine/guards)都支持路由指令。只有需要预验证或公开额外链上功能的守卫才实现路由处理程序。
- 对不支持路由指令的守卫调用路由指令将导致交易失败。
- 使用[守卫组](/zh/smart-contracts/core-candy-machine/guard-groups)时，需要 `group` 标签，以便程序可以识别哪个守卫实例应处理路由调用。
- 每个守卫只能有一个路由指令，但 **Path** 属性允许单个路由处理程序公开多个不同的功能。
- 路由指令与[铸造](/zh/smart-contracts/core-candy-machine/mint)交易是分开的。它创建的任何链上状态（如 Allow List PDA）都会持久存在，并在铸造期间被检查。

## FAQ

### 哪些守卫支持路由指令？

并非所有守卫都支持路由指令。只有需要预验证或自定义链上逻辑的守卫才会公开路由处理程序。[Allow List 守卫](/zh/smart-contracts/core-candy-machine/guards/allow-list)是最常见的示例，使用路由在[铸造](/zh/smart-contracts/core-candy-machine/mint)前验证 Merkle Proof。请查看每个守卫的[专用文档页面](/zh/smart-contracts/core-candy-machine/guards)以了解路由支持详情。

### 如果我对不支持路由指令的守卫调用路由指令会发生什么？

交易将失败。Core Candy Guard 程序会拒绝针对未实现路由处理程序的[守卫](/zh/smart-contracts/core-candy-machine/guards)的路由调用。在调用之前，请始终验证守卫是否支持路由指令。

### 为什么 Allow List 守卫使用单独的路由指令而不是在铸造期间验证？

大型允许列表产生的 Merkle Proof 与[铸造](/zh/smart-contracts/core-candy-machine/mint)指令自身的数据组合时可能超过交易大小限制。通过将证明验证分离为专用路由交易，[Allow List 守卫](/zh/smart-contracts/core-candy-machine/guards/allow-list)可以支持任意大的列表而不会触及 Solana 的交易大小限制。

### 调用路由指令时需要指定组标签吗？

仅当您的 Core Candy Machine 使用[守卫组](/zh/smart-contracts/core-candy-machine/guard-groups)时需要。如果同一守卫类型出现在多个组中，程序需要组标签来确定哪个守卫实例应处理路由调用。没有组时，不需要组参数。

### 路由设置中的 Path 属性是什么？

Path 属性用于区分单个守卫路由指令提供的多个功能。例如，支持冻结 NFT 的守卫可能使用 path "init" 来初始化 escrow 账户，使用 path "thaw" 来解冻铸造的 NFT。每个守卫定义自己的有效路径集。

## 术语表

| 术语 | 定义 |
|------|------|
| Route Instruction（路由指令） | Core Candy Guard 程序中的特殊指令，将执行委托给特定守卫，使该守卫能够在铸造交易之外运行自定义链上逻辑。 |
| Merkle Tree（默克尔树） | 一种基于哈希的数据结构，其中每个叶节点是数据的哈希，每个非叶节点是其子节点的哈希，用于高效验证大型数据集中的成员资格。 |
| Merkle Proof（默克尔证明） | 一个有序的哈希列表，允许在不揭示整棵树的情况下验证特定元素是否属于 Merkle Tree。 |
| Merkle Root（默克尔根） | Merkle Tree 的单一顶级哈希，代表整个数据集；存储在 Allow List 守卫设置中用于链上比较。 |
| Path（路径） | 路由设置中的属性，用于区分单个守卫路由处理程序公开的多个功能（例如 "init" 与 "thaw"）。 |
| Allow List PDA | Allow List 守卫的路由指令创建的程序派生账户，用于记录钱包已成功验证其 Merkle Proof，作为后续铸造交易的证明。 |
| Guard Groups（守卫组） | Core Candy Machine 上的命名守卫集，允许不同受众使用不同的铸造条件，调用路由指令时需要组标签。 |

