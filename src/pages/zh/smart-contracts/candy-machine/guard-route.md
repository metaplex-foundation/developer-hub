---
title: 特殊Guard指令
metaTitle: 特殊Guard指令 | Candy Machine
description: 解释如何执行特定于guard的指令。
---

正如我们在前几页上看到的,guard是自定义Candy Machine铸造过程的强大方式。但您知道guard甚至可以提供自己的自定义指令吗?{% .lead %}

## Route指令

Candy Guard程序附带一个名为**"Route"指令**的特殊指令。

此指令允许我们**从Candy Machine中选择特定的guard**并**运行特定于此guard的自定义指令**。我们称其为"Route"指令,因为它会将我们的请求路由到选定的guard。

此功能使guard更加强大,因为它们可以附带自己的程序逻辑。它使guard能够:

- 将验证过程与铸造过程分离以进行繁重的操作。
- 提供否则需要部署自定义程序的自定义功能。

要调用route指令,我们必须指定要将该指令路由到哪个guard,以及**提供它期望的route设置**。请注意,如果我们尝试通过选择不支持它的guard来执行"route"指令,交易将失败。

由于每个在Candy Guard程序上注册的guard只能有一个"route"指令,因此通常在route设置中提供**Path**属性以区分同一guard提供的多个功能。

例如,添加对冻结NFT支持的guard——只有在铸造结束后才能解冻——可以使用其route指令来初始化国库托管账户,并允许任何人在正确条件下解冻铸造的NFT。我们可以通过使用**Path**属性来区分这两个功能,前者等于"init",后者等于"thaw"。

您将在支持它的每个guard的[各自页面](/zh/candy-machine/guards)上找到route指令及其底层路径的详细说明。

让我们花一分钟通过提供一个示例来说明route指令的工作原理。例如,[**Allow List**](/zh/candy-machine/guards/allow-list) guard支持route指令,以验证铸造钱包是否属于预配置的钱包列表。

它使用[Merkle树](https://en.m.wikipedia.org/wiki/Merkle_tree)来实现这一点,这意味着我们需要创建整个允许钱包列表的哈希,并将该哈希(称为**Merkle根**)存储在guard设置中。为了证明钱包在允许列表中,它必须提供一个哈希列表(称为**Merkle证明**),允许程序计算Merkle根并确保它与guard的设置匹配。

因此,Allow List guard**使用其route指令验证给定钱包的Merkle证明**,如果成功,将在区块链上创建一个小的PDA账户,作为铸造指令的验证证明。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Candy Machine" theme="blue" /%}
{% node label="所有者: Candy Machine Core程序" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="所有者: Candy Guard程序" theme="dimmed" /%}
{% node label="Guard" theme="mint" z=1 /%}
{% node #allow-list-guard label="Allow List" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=550 %}
{% node #mint-1 label="铸造" theme="pink" /%}
{% node label="Candy Guard程序" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="访问控制" theme="transparent" /%}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="铸造" theme="pink" /%}
{% node label="Candy Machine Core程序" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="铸造逻辑" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% node parent="mint-2" x=-250 %}
{% node #route label="Route" theme="pink" /%}
{% node label="Candy Machine Core程序" theme="pink" /%}
{% /node %}
{% node parent="route" x=70 y=-20 label="验证Merkle证明" theme="transparent" /%}

{% node #allow-list-pda parent="route" x=23 y=100 label="Allow List PDA" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="allow-list-guard" to="route" theme="pink" /%}
{% edge from="route" to="allow-list-pda" theme="pink" path="straight" /%}
{% edge from="allow-list-pda" to="mint-1" theme="pink" /%}

{% /diagram %}

那么为什么我们不能直接在铸造指令中验证Merkle证明呢?这只是因为,对于大型允许列表,Merkle证明可能会相当冗长。在一定大小之后,将其包含在已经包含大量指令的铸造交易中变得不可能。通过将验证过程与铸造过程分开,我们使允许列表可以根据需要变大。

{% dialect-switcher title="调用guard的route指令" %}
{% dialect title="JavaScript" id="js" %}

您可以使用`route`函数通过Umi库调用guard的route指令。您需要通过`guard`属性传递guard的名称,并通过`routeArgs`属性传递其route设置。

以下是使用Allow List guard的示例,该guard在铸造前验证钱包的Merkle证明。

```ts
import {
  create,
  route,
  getMerkleProof,
  getMerkleRoot,
} from '@metaplex-foundation/mpl-candy-machine'

// 准备允许列表。
// 假设列表上的第一个钱包是Metaplex身份。
const allowList = [
  'GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS',
  '2vjCrmEFiN9CLLhiqy8u1JPh48av8Zpzp3kNkdTtirYG',
  'AT8nPwujHAD14cLojTcB1qdBzA1VXnT6LVGuUd6Y73Cy',
]
const merkleRoot = getMerkleRoot(allowList)

// 使用Allow List guard创建Candy Machine。
await create(umi, {
  // ...
  guards: {
    allowList: some({ merkleRoot }),
  },
}).sendAndConfirm(umi)

// 如果我们现在尝试铸造,它将失败,因为
// 我们没有验证我们的Merkle证明。

// 使用route指令验证Merkle证明。
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

// 如果我们现在尝试铸造,它将成功。
```

API参考:[route](https://mpl-candy-machine.typedoc.metaplex.com/functions/route.html), [DefaultGuardSetRouteArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetRouteArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 使用组的Route指令

在使用guard组时调用route指令时,重要的是**指定我们希望选择的guard的组标签**。这是因为我们可能在不同组之间有多个相同类型的guard,程序需要知道应该为route指令使用哪一个。

例如,假设我们在一个组中有一个精选VIP钱包的**Allow List**,在另一个组中有一个抽奖获胜者的**Allow List**。然后说我们想验证Allow List guard的Merkle证明是不够的,我们还需要知道应该为哪个组执行该验证。

{% dialect-switcher title="调用route指令时按组过滤" %}
{% dialect title="JavaScript" id="js" %}

使用组时,Umi库的`route`函数接受一个额外的`group`属性,类型为`Option<string>`,必须设置为我们想要选择的组的标签。

```ts
import {
  create,
  route,
  getMerkleProof,
  getMerkleRoot,
} from "@metaplex-foundation/mpl-candy-machine";
import { base58PublicKey, some } from "@metaplex-foundation/umi";

// 准备允许列表。
const allowListA = [...];
const allowListB = [...];

// 使用两个Allow List guard创建Candy Machine。
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

// 通过指定要选择的组来验证Merkle证明。
await route(umi, {
  candyMachine: candyMachine.publicKey,
  guard: 'allowList',
  group: some('listA'), // <- 我们正在使用"allowListA"进行验证。
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

API参考:[route](https://mpl-candy-machine.typedoc.metaplex.com/functions/route.html), [DefaultGuardSetRouteArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetRouteArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 结论

route指令通过允许guard附带自己的自定义程序逻辑,使guard变得更加强大。查看[所有可用guard](/zh/candy-machine/guards)的专用页面,了解每个guard的完整功能集。

现在我们知道了关于设置Candy Machine及其guard的所有内容,是时候谈论铸造了。在[下一页](/zh/candy-machine/mint)见!
