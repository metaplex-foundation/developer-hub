---
title: 守卫组
metaTitle: 守卫组 | Core Candy Machine
description: 守卫组允许单个 Core Candy Machine 定义多个独立的守卫集，每个集都有自己的标签和访问控制规则，支持顺序和并行铸造工作流程。
keywords:
  - guard groups
  - Core Candy Machine
  - candy guard
  - minting workflow
  - default guards
  - parallel minting
  - group label
  - access control
  - NFT minting
  - Solana
  - Metaplex
  - guard configuration
  - multi-tier mint
about:
  - Guard Groups
  - Candy Machine configuration
  - Minting workflows
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
faqs:
  - q: 守卫组标签的最大长度是多少？
    a: 守卫组标签必须为 6 个字符或更少。链上账户结构强制执行此限制，因此任何超过 6 个字符的标签将导致交易失败。
  - q: 配置了守卫组后，我可以仅使用默认守卫进行铸造吗？
    a: 不可以。当存在守卫组时，每个铸造交易都必须指定组标签。无法仅从默认守卫进行铸造；默认守卫仅作为组的继承后备设置。
  - q: 守卫组是否共享单个物品池，还是每个组有自己的供应？
    a: 所有守卫组从相同的 Core Candy Machine 物品池中提取。除非您在每个组中添加 Allocation 等守卫来限制该组可以分发多少物品，否则没有每组供应限制。
  - q: 并行守卫组如何处理重叠的时间窗口？
    a: 当两个或更多组的开始和结束日期重叠时，买家通过在铸造指令中指定组标签来选择从哪个组铸造。Candy Guard 程序仅评估所选组中的守卫（与默认守卫合并），因此两个组可以同时运行而不冲突。
  - q: 如果我更新现有 Candy Machine 上的守卫组会发生什么？
    a: updateCandyGuard 指令会一次性替换整个守卫和组配置。您必须在更新调用中包含每个组，即使设置未更改的组也必须包含，否则它们将被删除。在更新前获取当前 Candy Guard 账户数据以避免意外覆盖现有设置。
---

## 概述

守卫组允许单个 [Core Candy Machine](/zh/smart-contracts/core-candy-machine/overview) 定义多个独立的[守卫](/zh/smart-contracts/core-candy-machine/guards)集，每个集由唯一标签标识，以便不同的访问控制规则适用于不同的铸造阶段或受众。

- 每个组携带自己的守卫配置和最多 6 个字符的标签，买家在[铸造](/zh/smart-contracts/core-candy-machine/mint)时需要指定该标签。
- 默认（全局）守卫被每个组继承，除非在组级别显式覆盖。
- 组可以顺序运行（时间门控层级）或并行运行（持有者折扣与公开销售并行）。
- 当存在组时，无法仅从默认守卫铸造；始终需要组标签。

在[前面的页面](/zh/smart-contracts/core-candy-machine/guards)中，我们介绍了守卫并使用它们来定义 Candy Machine 的访问控制。我们已经看到使用守卫，我们可以例如添加每次铸造 1 SOL 的付款并确保铸造在某个日期之后开始。但是如果我们还想在第二个日期之后收取 2 SOL 呢？如果我们想让某些代币持有者免费铸造或以折扣价铸造呢？ {% .lead %}

如果我们可以定义多组守卫，每组都有自己的要求呢？出于这个原因，我们创建了**守卫组**！

## 守卫组的工作原理

守卫组通过允许您将多个命名的守卫配置集附加到单个 Core Candy Machine 来扩展标准[守卫](/zh/smart-contracts/core-candy-machine/guards)系统。每个集由短标签标识，并在铸造时独立评估。

因此，每个守卫组都有以下属性：

- **Label**：唯一的文本标识符。这不能超过 6 个字符。
- **Guards**：该组中所有激活守卫的设置。这与直接在 Core Candy Machine 上设置守卫的工作方式相同。

让我们举一个简单的例子。假设我们想在下午 4 点到 5 点之间收取 1 SOL，然后从下午 5 点开始收取 2 SOL 直到 Core Candy Machine 耗尽。同时确保我们通过 Bot Tax 守卫受到保护免受机器人攻击。以下是我们可以如何设置守卫：

- 组 1：
  - **Label**："early"
  - **Guards**：
    - Sol Payment：1 SOL
    - Start Date：下午 4 点（为简单起见忽略实际日期）
    - End Date：下午 5 点
    - Bot Tax：0.001 SOL
- 组 2：
  - **Label**："late"
  - **Guards**：
    - Sol Payment：2 SOL
    - Start Date：下午 5 点
    - Bot Tax：0.001 SOL

就这样，我们创建了一个自定义的 2 层铸造流程！

现在，每当有人尝试从我们的 Core Candy Machine [铸造](/zh/smart-contracts/core-candy-machine/mint)时，**他们必须明确告诉我们他们从哪个组铸造**。在铸造时要求组标签很重要，因为：

- 它确保买家不会经历意外的铸造行为。假设我们在第一组结束日期的最后时刻尝试以 1 SOL 铸造，但到交易执行时，我们已经过了那个日期。如果我们不要求组标签，交易将成功，我们将被收取 2 SOL，尽管我们只期望被收取 1 SOL。
- 它使支持并行组成为可能。我们将在本页稍后详细讨论这一点。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Core Candy Guard" theme="blue" /%}
{% node label="Owner: Core Candy Guard Program" theme="dimmed" /%}
{% node #group-1 theme="mint" z=1 %}
Group 1: "early" {% .font-semibold %}
{% /node %}
{% node label="Sol Payment" /%}
{% node label="Start Date" /%}
{% node label="End Date" /%}
{% node label="Bot Tax" /%}
{% node theme="mint" z=1 %}
Group 2: "late"
{% /node %}
{% node label="Sol Payment" /%}
{% node label="Start Date" /%}
{% node label="Bot Tax" /%}
{% /node %}

{% node parent="candy-machine-1" x=350 %}
{% node #mint-1 label="Mint" theme="pink" /%}
{% node label="Core Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=70 y=-20 label="Access Control" theme="transparent" /%}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Core Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}

{% node #nft parent="mint-2" x=78 y=100 label="NFT" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="group-1" to="mint-1" theme="pink" %}
选择要铸造的组
{% /edge %}

{% /diagram %}

现在让我们看看如何使用我们的 SDK 创建和更新组。

{% dialect-switcher title="创建带有守卫组的 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

要创建带有守卫组的 Candy Machine，只需将 `groups` 数组提供给 `create` 函数。此数组的每个项目必须包含一个 `label` 和一个 `guards` 对象，其中包含我们希望在该组中激活的所有守卫的设置。

以下是我们如何使用 Umi 库实现上述示例。

```ts
import { some, sol, dateTime } from '@metaplex-foundation/umi'

await create(umi, {
  // ...
  groups: [
    {
      label: 'early',
      guards: {
        solPayment: some({ lamports: sol(1), destination: treasury }),
        startDate: some({ date: dateTime('2022-10-18T16:00:00Z') }),
        endDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
        botTax: some({ lamports: sol(0.001), lastInstruction: true }),
      },
    },
    {
      label: 'late',
      guards: {
        solPayment: some({ lamports: sol(2), destination: treasury }),
        startDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
        botTax: some({ lamports: sol(0.001), lastInstruction: true }),
      },
    },
  ],
}).sendAndConfirm(umi)
```

要更新组，只需将相同的 `groups` 属性提供给 `updateCandyGuard` 函数。
请注意，整个 `guards` 对象和 `groups` 数组将被更新，这意味着**它将覆盖所有现有数据**！

因此，请确保为所有组提供设置，即使它们的设置没有变化。您可能需要先获取最新的 candy guard 账户数据，以避免覆盖任何现有设置。

以下是一个示例，将 "late" 组的 SOL payment 守卫从 2 SOL 更改为 3 SOL。

```ts
import { some, sol, dateTime } from '@metaplex-foundation/umi'

const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority)
await updateCandyGuard(umi, {
  candyGuard: candyGuard.publicKey,
  guards: candyGuard.guards,
  groups: [
    {
      label: 'early',
      guards: {
        solPayment: some({ lamports: sol(1), destination: treasury }),
        startDate: some({ date: dateTime('2022-10-18T16:00:00Z') }),
        endDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
        botTax: some({ lamports: sol(0.001), lastInstruction: true }),
      },
    },
    {
      label: 'late',
      guards: {
        solPayment: some({ lamports: sol(3), destination: treasury }),
        startDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
        botTax: some({ lamports: sol(0.001), lastInstruction: true }),
      },
    },
  ],
}).sendAndConfirm(umi)
```

API 参考: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [updateCandyGuard](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/updateCandyGuard.html), [DefaultGuardSetArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 默认守卫和守卫组继承

默认（全局）守卫作为共享基线，每个守卫组自动继承。当组未显式启用某个守卫时，它将回退到默认设置；当组启用了相同的守卫时，组级别的设置优先。

以下是快速回顾：

- 如果守卫在默认守卫上启用但在组的守卫上未启用，组将使用**默认守卫中定义的**守卫。
- 如果守卫在默认守卫_和_组的守卫上都启用，组将使用**组的守卫中定义的**守卫。
- 如果守卫在默认守卫或组的守卫上都未启用，组不使用此守卫。

为了说明这一点，让我们以上一节的示例为例，将 **Bot Tax** 守卫移动到默认守卫。

- 默认守卫：
  - Bot Tax：0.001 SOL
- 组 1：
  - **Label**："early"
  - **Guards**：
    - Sol Payment：1 SOL
    - Start Date：下午 4 点
    - End Date：下午 5 点
- 组 2：
  - **Label**："late"
  - **Guards**：
    - Sol Payment：2 SOL
    - Start Date：下午 5 点

如您所见，默认守卫有助于避免组内的重复。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Candy Machine" theme="blue" /%}
{% node label="Owner: Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node label="Guards (default guards)" theme="mint" z=1 /%}
{% node label="Bot Tax" /%}
{% node #group-1 theme="mint" z=1 %}
Group 1: "early" {% .font-semibold %}
{% /node %}
{% node label="Sol Payment" /%}
{% node label="Start Date" /%}
{% node label="End Date" /%}
{% node theme="mint" z=1 %}
Group 2: "late"
{% /node %}
{% node label="Sol Payment" /%}
{% node label="Start Date" /%}
{% /node %}

{% node parent="candy-machine-1" x=350 %}
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

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="group-1" to="mint-1" theme="pink" /%}

{% /diagram %}

{% callout type="warning" %}
即使使用默认守卫，铸造时也必须提供组标签。当配置了守卫组时，**不可能仅使用默认守卫进行铸造**。
{% /callout %}

{% dialect-switcher title="创建带有默认守卫和守卫组的 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

要在 Umi 库中使用默认守卫，只需在创建或更新 Candy Machine 时将 `guards` 属性与 `groups` 数组一起使用。例如，以下是如何使用上述守卫设置创建 Candy Machine。

```ts
import { some, sol, dateTime } from '@metaplex-foundation/umi'

await create(umi, {
  // ...
  guards: {
    botTax: some({ lamports: sol(0.001), lastInstruction: true }),
  },
  groups: [
    {
      label: 'early',
      guards: {
        solPayment: some({ lamports: sol(1), destination: treasury }),
        startDate: some({ date: dateTime('2022-10-18T16:00:00Z') }),
        endDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
      },
    },
    {
      label: 'late',
      guards: {
        solPayment: some({ lamports: sol(2), destination: treasury }),
        startDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
      },
    },
  ],
}).sendAndConfirm(umi)
```

API 参考: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [DefaultGuardSetArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 并行守卫组

并行守卫组允许两个或更多组同时有效，让买家选择从哪个组铸造。在铸造指令中要求组标签消除了歧义，并使并发组成为可能。

让我们用一个新的例子来说明这一点。假设我们有一个名为 "Innocent Bird" 的资产 collection，我们想向持有 "Innocent Bird" 资产的任何人提供 1 SOL 的折扣价，而向其他人收取 2 SOL。我们希望这两个组能够同时开始铸造——假设下午 4 点——我们还希望两个组都受到机器人的保护。以下是我们可以如何配置守卫：

- 默认守卫：
  - Start Date：下午 4 点
  - Bot Tax：0.001 SOL
- 组 1：
  - **Label**："nft"
  - **Guards**：
    - Sol Payment：1 SOL
    - NFT Gate："Innocent Bird" Collection
- 组 2：
  - **Label**："public"
  - **Guards**：
    - Sol Payment：2 SOL

如您所见，使用这些守卫设置，两个组可以同时铸造。NFT 持有者甚至可以选择从 "public" 组铸造来支付完整的 2 SOL。然而，如果可以的话，选择 "nft" 组对他们最有利。

{% dialect-switcher title="创建带有并行组的 Core Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

以下是如何使用 Umi 库使用上述守卫设置创建 Core Candy Machine。

```ts
import { some, sol, dateTime } from '@metaplex-foundation/umi'

await create(umi, {
  // ...
  guards: {
    botTax: some({ lamports: sol(0.001), lastInstruction: true }),
    startDate: some({ date: dateTime('2022-10-18T16:00:00Z') }),
  },
  groups: [
    {
      label: 'early',
      guards: {
        solPayment: some({ amount: sol(1), destination: treasury }),
        nftGate: some({
          requiredCollection: innocentBirdCollectionNft.publicKey,
        }),
      },
    },
    {
      label: 'late',
      guards: {
        solPayment: some({ amount: sol(2), destination: treasury }),
      },
    },
  ],
}).sendAndConfirm(umi)
```

API 参考: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [DefaultGuardSetArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 注意事项

- 守卫组标签最大长度为 **6 个字符**。超过此限制将导致交易失败。
- 当配置了守卫组时，组会**覆盖**它们显式启用的任何默认守卫。组中禁用的守卫将回退到默认值。
- 当存在组时，买家**必须在每个铸造交易中指定组标签**。无法仅从默认守卫铸造。
- 通过 `updateCandyGuard` 更新守卫组会替换**整个**守卫和组配置。请始终在更新中包含所有组，即使是未更改的组，以避免数据丢失。
- 所有组共享相同的 Core Candy Machine 物品池。如果需要限制每组供应，请使用 Allocation 等每组守卫。
- 对于需要[路由指令](/zh/smart-contracts/core-candy-machine/guard-route)的守卫（如 Allow List 验证），路由调用还必须包含组标签，以便评估正确的守卫配置。

## 结论

守卫组为我们的 Core Candy Machine 带来了全新的维度，允许我们定义根据我们需求定制的顺序和/或并行铸造工作流程。

在[下一页](/zh/smart-contracts/core-candy-machine/guard-route)，我们将看到关于守卫的另一个令人兴奋的功能：守卫指令！

## FAQ

### 守卫组标签的最大长度是多少？

守卫组标签必须为 6 个字符或更少。链上账户结构强制执行此限制，因此任何超过 6 个字符的标签将导致交易失败。

### 配置了守卫组后，我可以仅使用默认守卫进行铸造吗？

不可以。当存在守卫组时，每个[铸造](/zh/smart-contracts/core-candy-machine/mint)交易都必须指定组标签。无法仅从默认守卫进行铸造；默认守卫仅作为组的继承后备设置。

### 守卫组是否共享单个物品池，还是每个组有自己的供应？

所有守卫组从相同的 Core Candy Machine 物品池中提取。除非您在每个组中添加 Allocation 等守卫来限制该组可以分发多少物品，否则没有每组供应限制。

### 并行守卫组如何处理重叠的时间窗口？

当两个或更多组的开始和结束日期重叠时，买家通过在铸造指令中指定组标签来选择从哪个组铸造。Candy Guard 程序仅评估所选组中的[守卫](/zh/smart-contracts/core-candy-machine/guards)（与默认守卫合并），因此两个组可以同时运行而不冲突。

### 如果我更新现有 Candy Machine 上的守卫组会发生什么？

`updateCandyGuard` 指令会一次性替换整个守卫和组配置。您必须在更新调用中包含每个组，即使设置未更改的组也必须包含，否则它们将被删除。在更新前获取当前 Candy Guard 账户数据以避免意外覆盖现有设置。

## 术语表

| 术语 | 定义 |
|------|------|
| Guard Group（守卫组） | 附加到 Core Candy Machine 的命名守卫配置集，由唯一标签标识。 |
| Label（标签） | 唯一标识守卫组的字符串标识符（最多 6 个字符），必须在铸造指令中指定。 |
| Default Guards（默认守卫） | Core Candy Machine 上的全局守卫设置，每个守卫组都会继承，除非显式覆盖。 |
| Resolved Guards（解析后守卫） | 铸造时应用的最终守卫设置集，通过将组的守卫与默认守卫合并生成。 |
| Parallel Guard Groups（并行守卫组） | 时间窗口重叠的两个或更多守卫组，允许买家在同一时间选择从哪个组铸造。 |
| Candy Guard | 存储 Core Candy Machine 所有守卫和组配置并充当其铸造权限的链上账户。 |
| Bot Tax（机器人税） | 对未通过其他守卫检查的钱包收取少量 SOL 罚金的守卫，用于阻止机器人活动。 |
| Route Instruction（路由指令） | Candy Guard 程序上的特殊指令，在铸造流程之外执行守卫特定逻辑，如 Allow List 验证。 |

