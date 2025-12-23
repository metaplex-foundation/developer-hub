---
title: Candy Guard
metaTitle: Candy Guard | Candy Machine
description: 解释guard的工作原理以及如何启用它们。
---

现在我们知道了Candy Machine的工作原理以及如何加载它们,是时候谈谈拼图的最后一块了:Guard。{% .lead %}

## 什么是guard?

guard是一段模块化代码,可以限制对Candy Machine铸造的访问,甚至为其添加新功能!

有大量guard可供选择,每个guard都可以根据需要激活和配置。

我们稍后将在本文档中介绍所有可用的guard,但让我们在这里通过一些示例来说明。

- 当启用**Start Date** guard时,将在预配置日期之前禁止铸造。还有一个**End Date** guard可以在给定日期后禁止铸造。
- 当启用**Sol Payment** guard时,铸造钱包必须向配置的目标钱包支付配置的金额。存在类似的guard,用于使用代币或特定集合的NFT付款。
- **Token Gate**和**NFT Gate** guard分别将铸造限制为某些代币持有者和NFT持有者。
- **Allow List** guard仅允许钱包是预定义钱包列表的一部分时进行铸造。有点像铸造的宾客列表。

如您所见,每个guard只负责一项责任,这使它们可组合。换句话说,您可以挑选您需要的guard来创建完美的Candy Machine。

## Candy Guard账户

如果您还记得我们的[Candy Machine账户](/zh/candy-machine/manage#candy-machine-account)的内容,您会发现其中没有guard的迹象。这是因为guard存在于另一个账户中,称为**Candy Guard账户**,该账户由**Candy Guard程序**创建。

每个Candy Machine账户通常应该与其自己的Candy Guard账户相关联,这将为其添加一层保护。

这通过创建Candy Guard账户并使其成为Candy Machine账户的**铸造权限**来工作。这样做后,就不再可能直接从主Candy Machine程序(称为**Candy Machine Core程序**)铸造。相反,我们必须通过Candy Guard程序铸造,如果所有guard成功解析,它将推迟到Candy Machine Core程序完成铸造过程。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Candy Machine" theme="blue" /%}
{% node label="所有者: Candy Machine Core程序" theme="dimmed" /%}
{% node label="功能" /%}
{% node label="权限" /%}
{% node #mint-authority-1 %}

铸造权限 = Candy Guard {% .font-semibold %}

{% /node %}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" y=160 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="所有者: Candy Guard程序" theme="dimmed" /%}
{% node label="Guard" theme="mint" z=1 /%}
{% node label="Sol Payment" /%}
{% node label="Token Payment" /%}
{% node label="Start Date" /%}
{% node label="End Date" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=350 %}
{% node #mint-1 label="铸造" theme="pink" /%}
{% node label="Candy Guard程序" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="访问控制" theme="transparent" /%}
{% node parent="mint-1" x=-120 y=-35 theme="transparent" %}
任何人都可以铸造,只要 \
他们符合 \
激活的guard。
{% /node %}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="铸造" theme="pink" /%}
{% node label="Candy Machine Core程序" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="铸造逻辑" theme="transparent" /%}
{% node parent="mint-2" x=200 y=-18 theme="transparent" %}
只有Alice \
可以铸造。
{% /node %}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% node parent="mint-2" x=280 %}
{% node #candy-machine-2 label="Candy Machine" theme="blue" /%}
{% node label="所有者: Candy Machine Core程序" theme="dimmed" /%}
{% node label="功能" /%}
{% node label="权限" /%}
{% node #mint-authority-2 %}

铸造权限 = Alice {% .font-semibold %}

{% /node %}
{% node label="..." /%}
{% /node %}

{% edge from="candy-guard-1" to="mint-authority-1" fromPosition="left" toPosition="left" arrow=false dashed=true /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="candy-guard-1" to="mint-1" theme="pink" /%}
{% edge from="candy-machine-2" to="mint-2" theme="pink" path="straight" /%}

{% /diagram %}

请注意,由于Candy Machine和Candy Guard账户协同工作,我们的SDK将它们视为一个实体。当您使用我们的SDK创建Candy Machine时,默认情况下也会创建一个关联的Candy Guard账户。更新Candy Machine时也是如此,因为它们允许您同时更新guard。我们将在本页面上看到一些具体示例。

## 为什么要另一个程序?

guard不存在于主Candy Machine程序中的原因是为了将访问控制逻辑与主Candy Machine职责(即铸造NFT)分开。

这使guard不仅模块化而且可扩展。任何人都可以创建和部署自己的Candy Guard程序以创建自定义guard,同时仍然能够依赖主Candy Machine Core程序处理所有其他事务。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Candy Machine" theme="blue" /%}
{% node label="所有者: Candy Machine Core程序" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="所有者: Candy Guard程序" theme="dimmed" /%}
{% node label="Guard" theme="mint" z=1 /%}
{% node label="Sol Payment" /%}
{% node label="Token Payment" /%}
{% node label="Start Date" /%}
{% node label="End Date" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=300 %}
{% node #mint-1 label="铸造" theme="pink" /%}
{% node label="Candy Guard程序" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=160 %}
{% node #mint-1b label="铸造" theme="pink" /%}
{% node label="自定义Candy Guard程序" theme="pink" /%}
{% /node %}
{% node parent="mint-1b" x=-80 y=-22 label="不同的访问控制" theme="transparent" /%}

{% node parent="mint-1" x=60 y=100 %}
{% node #mint-2 label="铸造" theme="pink" /%}
{% node label="Candy Machine Core程序" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=95 y=-20 label="相同的铸造逻辑" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% node parent="mint-1b" x=250 %}
{% node #candy-machine-2 label="Candy Machine" theme="blue" /%}
{% node label="所有者: Candy Machine Core程序" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-2" y=80 x=0 %}
{% node #candy-guard-2 label="Candy Guard" theme="blue" /%}
{% node label="所有者: 自定义Candy Guard程序" theme="dimmed" /%}
{% node label="Guard" theme="mint" z=1 /%}
{% node label="Sol Payment" /%}
{% node label="Token Payment" /%}
{% node label="Start Date" /%}
{% node %}
我的自定义Guard {% .font-semibold %}
{% /node %}
{% node label="..." /%}
{% /node %}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="candy-guard-2" to="candy-machine-2" fromPosition="right" toPosition="right" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" fromPosition="bottom" toPosition="top" /%}
{% edge from="mint-1b" to="mint-2" theme="pink" fromPosition="bottom" toPosition="top" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="candy-guard-1" to="mint-1" theme="pink" /%}
{% edge from="candy-machine-2" to="mint-1b" theme="pink" /%}
{% edge from="candy-guard-2" to="mint-1b" theme="pink" /%}

{% /diagram %}

请注意,我们的SDK还提供了注册您自己的Candy Guard程序及其自定义guard的方法,因此您可以利用它们友好的API并轻松与他人共享您的guard。

## 所有可用的guard

好的,现在我们了解了什么是guard,让我们看看有哪些默认guard可供我们使用。

在以下列表中,我们将提供每个guard的简短描述,并提供指向其专用页面的链接以进行更高级的阅读。

- [**Address Gate**](/zh/candy-machine/guards/address-gate):将铸造限制为单个地址。
- [**Allow List**](/zh/candy-machine/guards/allow-list):使用钱包地址列表确定谁被允许铸造。
- [**Bot Tax**](/zh/candy-machine/guards/bot-tax):可配置的税收以对无效交易收费。
- [**End Date**](/zh/candy-machine/guards/end-date):确定铸造的结束日期。
- [**Freeze Sol Payment**](/zh/candy-machine/guards/freeze-sol-payment):以SOL设置铸造价格并设置冻结期。
- [**Freeze Token Payment**](/zh/candy-machine/guards/freeze-token-payment):以代币金额设置铸造价格并设置冻结期。
- [**Gatekeeper**](/zh/candy-machine/guards/gatekeeper):通过Gatekeeper网络限制铸造,例如验证码集成。
- [**Mint Limit**](/zh/candy-machine/guards/mint-limit):指定每个钱包的铸造数量限制。
- [**Nft Burn**](/zh/candy-machine/guards/nft-burn):将铸造限制为指定集合的持有者,需要销毁NFT。
- [**Nft Gate**](/zh/candy-machine/guards/nft-gate):将铸造限制为指定集合的持有者。
- [**Nft Payment**](/zh/candy-machine/guards/nft-payment):将铸造价格设置为指定集合的NFT。
- [**Redeemed Amount**](/zh/candy-machine/guards/redeemed-amount):根据铸造的总量确定铸造的结束。
- [**Sol Payment**](/zh/candy-machine/guards/sol-payment):以SOL设置铸造价格。
- [**Start Date**](/zh/candy-machine/guards/start-date):确定铸造的开始日期。
- [**Third Party Signer**](/zh/candy-machine/guards/third-party-signer):在交易上需要额外的签名者。
- [**Token Burn**](/zh/candy-machine/guards/token-burn):将铸造限制为指定代币的持有者,需要销毁代币。
- [**Token Gate**](/zh/candy-machine/guards/token-gate):将铸造限制为指定代币的持有者。
- [**Token Payment**](/zh/candy-machine/guards/token-payment):以代币金额设置铸造价格。

## 使用guard创建Candy Machine

到目前为止,我们创建的Candy Machine没有启用任何guard。现在我们知道了所有可用的guard,让我们看看如何设置启用了某些guard的新Candy Machine。

具体实现将取决于您使用的SDK(见下文),但主要思想是通过提供所需的设置来启用guard。任何未设置的guard都将被禁用。

{% dialect-switcher title="使用guard创建Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

要使用Umi库启用guard,只需向`create`函数提供`guards`属性,并传入要启用的每个guard的设置。任何设置为`none()`或未提供的guard都将被禁用。

```ts
import { some, sol, dateTime } from '@metaplex-foundation/umi'

await create(umi, {
  // ...
  guards: {
    botTax: some({ lamports: sol(0.01), lastInstruction: true }),
    solPayment: some({ lamports: sol(1.5), destination: treasury }),
    startDate: some({ date: dateTime('2023-04-04T16:00:00Z') }),
    // 所有其他guard都被禁用...
  },
}).sendAndConfirm(umi)
```

API参考:[create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [DefaultGuardSetArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 更新guard

您在guard中设置了错误的内容吗?您改变了铸造价格的想法吗?您需要稍微延迟铸造的开始吗?不用担心,可以使用创建它们时使用的相同设置轻松更新guard。

您可以通过提供其设置来启用新的guard,或通过给它们空设置来禁用当前的guard。

{% dialect-switcher title="更新guard" %}
{% dialect title="JavaScript" id="js" %}

您可以使用创建它们时相同的方式更新Candy Machine的guard。也就是说,通过在`updateCandyGuard`函数的`guards`对象内提供它们的设置。任何设置为`none()`或未提供的guard都将被禁用。

请注意,整个`guards`对象将被更新,这意味着**它将覆盖所有现有的guard**!

因此,确保为要启用的所有guard提供设置,即使它们的设置没有更改。您可能希望首先获取candy guard账户以回退到其当前的guard。

```tsx
import { some, none, sol } from '@metaplex-foundation/umi'

const candyGuard = fetchCandyGuard(umi, candyMachine.mintAuthority)
await updateCandyGuard(umi, {
  candyGuard: candyGuard.publicKey,
  guards: {
    ...candyGuard.guards,
    botTax: none(),
    solPayment: some({ lamports: sol(3), destination: treasury }),
  },
})
```

API参考:[updateCandyGuard](https://mpl-candy-machine.typedoc.metaplex.com/functions/updateCandyGuard.html), [CandyGuard](https://mpl-candy-machine.typedoc.metaplex.com/types/CandyGuard.html), [DefaultGuardSetArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 查看Candy Machine的guard

一旦您在Candy Machine上设置了guard,任何人都可以在Candy Guard账户上检索和查看所有提供的设置。

{% dialect-switcher title="获取guard" %}
{% dialect title="JavaScript" id="js" %}

您可以使用candy machine账户的`mintAuthority`属性上的`fetchCandyGuard`函数访问与candy machine关联的candy guard。

```ts
import {
  fetchCandyMachine,
  fetchCandyGuard,
} from '@metaplex-foundation/mpl-candy-machine'

const candyMachine = await fetchCandyMachine(umi, candyMachineAddress)
const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority)

candyGuard.guards // 所有guard设置。
candyGuard.guards.botTax // Bot Tax设置。
candyGuard.guards.solPayment // Sol Payment设置。
// ...
```

请注意,使用`create`函数时,会为每个candy machine自动创建一个关联的candy guard账户,以便其地址是确定性的。因此,在这种情况下,我们可以使用一个RPC调用获取两个账户,如下所示。

```ts
import { assertAccountExists } from '@metaplex-foundation/umi'
import {
  findCandyGuardPda,
  deserializeCandyMachine,
  deserializeCandyGuard,
} from '@metaplex-foundation/mpl-candy-machine'

const candyGuardAddress = findCandyGuardPda(umi, { base: candyMachineAddress })
const [rawCandyMachine, rawCandyGuard] = await umi.rpc.getAccounts([
  candyMachineAddress,
  candyGuardAddress,
])
assertAccountExists(rawCandyMachine)
assertAccountExists(rawCandyGuard)

const candyMachine = deserializeCandyMachine(umi, rawCandyMachine)
const candyGuard = deserializeCandyGuard(umi, rawCandyGuard)
```

API参考:[fetchCandyGuard](https://mpl-candy-machine.typedoc.metaplex.com/functions/fetchCandyGuard.html), [findCandyGuardPda](https://mpl-candy-machine.typedoc.metaplex.com/functions/findCandyGuardPda.html), [CandyGuard](https://mpl-candy-machine.typedoc.metaplex.com/types/CandyGuard.html), [DefaultGuardSetArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 手动包装和解包Candy Guard账户

到目前为止,我们一起管理Candy Machine和Candy Guard账户,因为这对大多数项目来说最有意义。

但是,重要的是要注意,即使使用我们的SDK,也可以在不同的步骤中创建和关联Candy Machine和Candy Guard。

您首先需要分别创建两个账户并手动关联/解除关联它们。

{% dialect-switcher title="从Candy Machine关联和解除关联guard" %}
{% dialect title="JavaScript" id="js" %}

Umi库的`create`函数已经负责为创建的每个Candy Machine账户创建和关联一个全新的Candy Guard账户。

但是,如果您想分别创建它们并手动关联/解除关联它们,这是您的做法。

```ts
import { some, percentAmount, sol, dateTime } from '@metaplex-foundation/umi'

// 创建一个没有Candy Guard的Candy Machine。
const candyMachine = generateSigner(umi)
await (await createCandyMachineV2(umi, {
  candyMachine,
  tokenStandard: TokenStandard.NonFungible,
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 100,
  sellerFeeBasisPoints: percentAmount(1.23),
  creators: [
    { address: umi.identity.publicKey, verified: false, percentageShare: 100 },
  ],
  configLineSettings: some({
    prefixName: 'My NFT #',
    nameLength: 3,
    prefixUri: 'https://example.com/',
    uriLength: 20,
    isSequential: false,
  }),
})).sendAndConfirm(umi)

// 创建一个Candy Guard。
const base = generateSigner(umi)
const candyGuard = findCandyGuardPda(umi, { base: base.publicKey })
await createCandyGuard(umi, {
  base,
  guards: {
    botTax: { lamports: sol(0.01), lastInstruction: false },
    solPayment: { lamports: sol(1.5), destination: treasury },
    startDate: { date: dateTime('2022-10-17T16:00:00Z') },
  },
}).sendAndConfirm(umi)

// 将Candy Guard与Candy Machine关联。
await wrap(umi, {
  candyMachine: candyMachine.publicKey,
  candyGuard,
}).sendAndConfirm(umi)

// 解除关联它们。
await unwrap(umi, {
  candyMachine: candyMachine.publicKey,
  candyGuard,
}).sendAndConfirm(umi)
```

API参考:[createCandyMachineV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/createCandyMachineV2.html), [createCandyGuard](https://mpl-candy-machine.typedoc.metaplex.com/functions/createCandyGuard.html), [wrap](https://mpl-candy-machine.typedoc.metaplex.com/functions/wrap.html), [unwrap](https://mpl-candy-machine.typedoc.metaplex.com/functions/unwrap.html)

{% /dialect %}
{% /dialect-switcher %}

## 结论

Guard是Candy Machine的重要组成部分。它们使配置铸造过程变得容易,同时允许任何人为特定于应用程序的需求创建自己的guard。[在下一页](/zh/candy-machine/guard-groups)上,我们将看到如何通过使用guard组创建更多铸造场景!
