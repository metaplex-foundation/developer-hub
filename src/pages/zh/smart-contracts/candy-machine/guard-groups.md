---
title: Guard组
metaTitle: Guard组 | Candy Machine
description: 解释如何配置多组guard。
---

在[上一页](/zh/candy-machine/guards)中,我们介绍了guard并使用它们来定义Candy Machine的访问控制。我们已经看到,使用guard,我们可以例如添加每次铸造1 SOL的付款,并确保铸造在特定日期后开始。但是,如果我们还想在第二个日期后收取2 SOL怎么办?如果我们想允许某些代币持有者免费或以折扣价铸造怎么办?{% .lead %}

如果我们可以定义多组guard,每组都有自己的要求,会怎么样?为此,我们创建了**Guard组**!

## 组如何工作?

还记得[我们如何在任何Candy Machine上设置guard](/zh/candy-machine/guards#creating-a-candy-machine-with-guards)吗?只需提供我们想要启用的guard的设置即可。Guard组的工作方式相同,只是您还必须给它们一个唯一的**标签**来识别它们。

因此,每个Guard组具有以下属性:

- **Label**:唯一的文本标识符。这不能超过6个字符。
- **Guard**:该组内所有激活的guard的设置。这就像直接在Candy Machine上设置guard一样。

让我们举一个简单的例子。假设我们想从下午4点到下午5点收取1 SOL,然后从下午5点到Candy Machine耗尽收取2 SOL。所有这些同时确保我们通过Bot Tax guard免受机器人攻击。以下是我们如何设置guard:

- 组1:
  - **Label**: "early"
  - **Guard**:
    - Sol Payment: 1 SOL
    - Start Date: 下午4点(为简单起见,此处忽略实际日期)
    - End Date: 下午5点
    - Bot Tax: 0.001 SOL
- 组2:
  - **Label**: "late"
  - **Guard**:
    - Sol Payment: 2 SOL
    - Start Date: 下午5点
    - Bot Tax: 0.001 SOL

就这样,我们创建了一个定制的2层铸造流程!

现在,每当有人尝试从我们的Candy Machine铸造时,**他们必须明确告诉我们他们从哪个组铸造**。在铸造时要求组标签很重要,因为:

- 它确保买家不会遇到意外的铸造行为。假设我们试图在第一组结束日期的最后铸造1 SOL,但在交易执行时,我们现在已经过了该日期。如果我们不要求组标签,交易将成功,我们将被收取2 SOL,即使我们期望只被收取1 SOL。
- 它使支持并行组成为可能。我们稍后将在本页面上详细讨论这一点。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Candy Machine" theme="blue" /%}
{% node label="所有者: Candy Machine Core程序" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="所有者: Candy Guard程序" theme="dimmed" /%}
{% node #group-1 theme="mint" z=1 %}
组1: "early" {% .font-semibold %}
{% /node %}
{% node label="Sol Payment" /%}
{% node label="Start Date" /%}
{% node label="End Date" /%}
{% node label="Bot Tax" /%}
{% node theme="mint" z=1 %}
组2: "late"
{% /node %}
{% node label="Sol Payment" /%}
{% node label="Start Date" /%}
{% node label="Bot Tax" /%}
{% /node %}

{% node parent="candy-machine-1" x=350 %}
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

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="group-1" to="mint-1" theme="pink" %}
选择从哪个组 \
铸造
{% /edge %}

{% /diagram %}

现在让我们看看如何使用我们的SDK创建和更新组。

{% dialect-switcher title="使用guard组创建Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

要创建带有guard组的Candy Machine,只需向`create`函数提供`groups`数组。该数组的每个项目必须包含一个`label`和一个`guards`对象,其中包含我们希望在该组中激活的所有guard的设置。

以下是我们如何使用Umi库实现上述示例。

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

要更新组,只需向`updateCandyGuard`函数提供相同的`groups`属性。
请注意,整个`guards`对象和`groups`数组将被更新,这意味着**它将覆盖所有现有数据**!

因此,请确保为所有组提供设置,即使它们的设置没有更改。您可能希望事先获取最新的candy guard账户数据以避免覆盖任何现有设置。

以下是一个示例,将"late"组的SOL付款guard从2 SOL更改为3 SOL。

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

API参考:[create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [updateCandyGuard](https://mpl-candy-machine.typedoc.metaplex.com/functions/updateCandyGuard.html), [DefaultGuardSetArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 默认Guard

请注意,在上面的示例中,我们必须向两个组都提供相同的**Bot Tax** guard。这可以通过利用在Candy Machine上设置的全局**Guard**来简化。

使用Guard组时,Candy Machine的全局Guard——如[上一页](/zh/candy-machine/guards)所解释的——**充当默认guard**!这意味着组将默认使用与全局guard相同的guard设置,除非它们通过在组中明确启用它们来覆盖它们。

以下是快速回顾:

- 如果guard在默认guard上启用但在组的guard上未启用,则组使用**在默认guard中定义的**guard。
- 如果guard在默认guard上启用_并且_在组的guard上启用,则组使用**在组的guard中定义的**guard。
- 如果guard在默认guard或组的guard上都未启用,则组不使用此guard。

为了说明这一点,让我们从上一节中取出示例,并将**Bot Tax** guard移至默认guard。

- 默认Guard:
  - Bot Tax: 0.001 SOL
- 组1:
  - **Label**: "early"
  - **Guard**:
    - Sol Payment: 1 SOL
    - Start Date: 下午4点
    - End Date: 下午5点
- 组2:
  - **Label**: "late"
  - **Guard**:
    - Sol Payment: 2 SOL
    - Start Date: 下午5点

如您所见,默认guard对于避免组内的重复很有用。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Candy Machine" theme="blue" /%}
{% node label="所有者: Candy Machine Core程序" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="所有者: Candy Guard程序" theme="dimmed" /%}
{% node label="Guard (默认guard)" theme="mint" z=1 /%}
{% node label="Bot Tax" /%}
{% node #group-1 theme="mint" z=1 %}
组1: "early" {% .font-semibold %}
{% /node %}
{% node label="Sol Payment" /%}
{% node label="Start Date" /%}
{% node label="End Date" /%}
{% node theme="mint" z=1 %}
组2: "late"
{% /node %}
{% node label="Sol Payment" /%}
{% node label="Start Date" /%}
{% /node %}

{% node parent="candy-machine-1" x=350 %}
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

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="group-1" to="mint-1" theme="pink" /%}

{% /diagram %}

请注意,即使使用默认guard,铸造时也必须提供组。这意味着,使用guard组时,**不可能仅使用默认guard进行铸造**。

{% dialect-switcher title="使用默认guard和guard组创建Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

要在Umi库中使用默认guard,只需在创建或更新Candy Machine时结合使用`guards`属性和`groups`数组。例如,以下是使用上述描述的guard设置创建Candy Machine的方法。

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

API参考:[create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [DefaultGuardSetArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 并行组

铸造时要求组标签的一个非常有趣的好处是能够在给定时间拥有**多个有效组**。这消除了程序的任何歧义,并允许买家选择他们想从哪个组铸造。

让我们用一个新示例来说明这一点。假设我们有一个名为"Innocent Bird"的NFT集合,我们想向持有"Innocent Bird"NFT的任何人提供1 SOL的折扣价格,并向其他人收取2 SOL。我们希望这两个组都能够同时开始铸造——比如下午4点——我们还想保护两个组免受机器人攻击。以下是我们如何配置guard:

- 默认Guard:
  - Start Date: 下午4点
  - Bot Tax: 0.001 SOL
- 组1:
  - **Label**: "nft"
  - **Guard**:
    - Sol Payment: 1 SOL
    - NFT Gate: "Innocent Bird"集合
- 组2:
  - **Label**: "public"
  - **Guard**:
    - Sol Payment: 2 SOL

如您所见,通过这些guard设置,两个组可以同时铸造。NFT持有者甚至可以支付全额2 SOL,如果他们决定从"public"组铸造。但是,如果他们可以,从"nft"组选择符合他们的最佳利益。

{% dialect-switcher title="使用并行组创建Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

以下是如何通过Umi库使用上述描述的guard设置创建Candy Machine。

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

API参考:[create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [DefaultGuardSetArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 结论

Guard组为我们的Candy Machine带来了全新的维度,允许我们定义适合我们需求的顺序和/或并行铸造工作流程。

在[下一页](/zh/candy-machine/guard-route)上,我们将看到另一个关于guard的令人兴奋的功能:Guard指令!
