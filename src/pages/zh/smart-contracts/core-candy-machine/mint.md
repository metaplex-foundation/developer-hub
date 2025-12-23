---
title: 铸造
metaTitle: 铸造 | Core Candy Machine
description: 如何从 Core Candy Machine 铸造，允许用户购买您的 Core NFT 资产。
---

到目前为止，我们已经学习了如何创建和维护 Candy Machine。我们已经看到了如何配置它们以及如何使用守卫和守卫组设置复杂的铸造工作流程。是时候谈谈最后一块拼图了：铸造！ {% .lead %}

## 基本铸造

如[Candy Guards 页面](/zh/smart-contracts/core-candy-machine/guards#why-another-program)所述，有两个程序负责从 Candy Machine 铸造 NFT：Candy Machine Core 程序——负责铸造 NFT——和 Candy Guard 程序，它在其上添加了可配置的访问控制层，并可以分叉以提供自定义守卫。

因此，有两种方式可以从 Candy Machine 铸造：

- **从 Candy Guard 程序**，然后将铸造委托给 Candy Machine Core 程序。大多数时候，您会想要这样做，因为它允许更复杂的铸造工作流程。根据账户中配置的守卫，您可能需要向铸造指令传递额外的剩余账户和指令数据。幸运的是，我们的 SDK 通过要求几个额外的参数并为我们计算其余部分使这变得容易。

- **直接从 Core Candy Machine Core 程序**。在这种情况下，只有配置的铸造权限可以从中铸造，因此它需要签署交易。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% node label="Features" /%}
{% node label="Authority" /%}
{% node #mint-authority-1 %}

Mint Authority = Candy Guard {% .font-semibold %}

{% /node %}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" y=160 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node label="Guards" theme="mint" z=1 /%}
{% node label="Sol Payment" /%}
{% node label="Token Payment" /%}
{% node label="Start Date" /%}
{% node label="End Date" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=350 %}
{% node #mint-1 label="Mint" theme="pink" /%}
{% node label="Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="Access Control" theme="transparent" /%}
{% node parent="mint-1" x=-120 y=-35 theme="transparent" %}
任何人都可以铸造，只要 \
他们符合激活的守卫。
{% /node %}

{% node parent="mint-1" x=-36 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Core Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}
{% node parent="mint-2" x=200 y=-18 theme="transparent" %}
只有 Alice \
可以铸造。
{% /node %}

{% node #nft parent="mint-2" x=77 y=100 label="NFT" /%}

{% node parent="mint-2" x=280 %}
{% node #candy-machine-2 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% node label="Features" /%}
{% node label="Authority" /%}
{% node #mint-authority-2 %}

Mint Authority = Alice {% .font-semibold %}

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

如果一切顺利，将根据 Core Candy Machine 中配置的参数创建一个 NFT。例如，如果给定的 Core Candy Machine 使用 **Config Line Settings** 并将 **Is Sequential** 设置为 `false`，那么我们将随机获取下一个项目。

从 Candy Guard 程序的 `1.0` 版本开始，铸造指令接受一个额外的 `minter` 签名者，它可以与现有的 `payer` 签名者不同。这允许我们创建铸造 NFT 的钱包不再需要支付 SOL 费用的铸造工作流程——例如存储费用和 SOL 铸造付款——因为 `payer` 签名者将抽象这些费用。注意，`minter` 签名者仍然需要支付基于代币的费用，并将用于验证配置的守卫。

{% dialect-switcher title="从 Core Candy Machine 铸造" %}
{% dialect title="JavaScript" id="js" %}

要通过配置的 Candy Guard 账户从 Core Candy Machine 铸造，您可以使用 `mintV1` 函数并提供铸造的 NFT 将属于的 collection NFT 的铸造地址和更新权限。也可以提供 `minter` 签名者和 `payer` 签名者，但它们将分别默认为 Umi 的身份和付款者。

```ts
import { mintV1 } from "@metaplex-foundation/mpl-core-candy-machine";
import { setComputeUnitLimit } from "@metaplex-foundation/mpl-toolbox";
import { generateSigner } from "@metaplex-foundation/umi";

const candyMachineId = publicKey("11111111111111111111111111111111");
const coreCollection = publicKey("22222222222222222222222222222222");
const asset = generateSigner(umi);

await mintV1(umi, {
  candyMachine: candyMachineId,
  asset,
  collection: coreCollection,
}).sendAndConfirm(umi);

```

在极少数情况下，您希望直接从 Core Candy Machine 程序而不是 Candy Guard 程序铸造，您可以改用 `mintAssetFromCandyMachine` 函数。此函数要求提供 Core Candy Machine 的铸造权限作为签名者，并接受一个明确的 `assetOwner` 属性。

```ts
import { mintFromCandyMachineV2 } from '@metaplex-foundation/mpl-core-candy-machine'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'
import { transactionBuilder, generateSigner } from '@metaplex-foundation/umi'

const candyMachineId = publicKey('11111111111111111111111111111111')
const coreCollection = publicKey('22222222222222222222222222222222')
const asset = generateSigner(umi)

await mintAssetFromCandyMachine(umi, {
  candyMachine: candyMachineId,
  mintAuthority: umi.identity,
  assetOwner: umi.identity.publicKey,
  asset,
  collection: coreCollection,
}).sendAndConfirm(umi);
```

API 参考: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [mintAssetFromCandyMachine](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintAssetFromCandyMachine.html)

{% /dialect %}
{% /dialect-switcher %}

## 使用守卫铸造

从使用一堆守卫的 Core Candy Machine 铸造时，您可能需要提供额外的守卫特定信息。

如果您要手动构建铸造指令，该信息将作为指令数据和剩余账户的混合提供。但是，使用我们的 SDK，每个在铸造时需要额外信息的守卫都定义了一组我们称为 **Mint Settings** 的设置。这些 Mint Settings 将被解析为程序所需的任何内容。

需要 Mint Settings 的守卫的一个很好的例子是 **NFT Payment** 守卫，它需要我们应该用来支付铸造的 NFT 的铸造地址等信息。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node label="Guards" theme="mint" z=1 /%}
{% node #nft-payment-guard label="NFT Payment" /%}
{% node label="Token Payment" /%}
{% node label="Start Date" /%}
{% node #third-party-signer-guard label="Third Party Signer" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=700 %}
{% node #mint-1 label="Mint" theme="pink" /%}
{% node label="Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="Access Control" theme="transparent" /%}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Core Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% node parent="mint-2" x=-400 %}
{% node #mint-settings label="Mint Settings" /%}
{% node label="使用我们的 SDK" theme="dimmed" /%}
{% /node %}

{% node #mint-args label="Mint Arguments" parent="mint-settings" x=100 y=80 theme="slate" /%}
{% node #mint-accounts label="Mint Remaining Accounts" parent="mint-args" y=50 theme="slate" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="nft-payment-guard" to="mint-settings" theme="slate" /%}
{% edge from="third-party-signer-guard" to="mint-settings" theme="slate" /%}
{% edge from="mint-settings" to="mint-args" theme="slate" fromPosition="bottom" /%}
{% edge from="mint-settings" to="mint-accounts" theme="slate" fromPosition="bottom" /%}
{% edge from="mint-args" to="mint-1" theme="pink" /%}
{% edge from="mint-accounts" to="mint-1" theme="pink" /%}

{% /diagram %}

[每个可用的守卫](/zh/smart-contracts/core-candy-machine/guards)都有自己的文档页面，它会告诉您该守卫在铸造时是否需要提供 Mint Settings。

如果您只使用不需要 Mint Settings 的守卫，您可以按照上面 "基本铸造" 部分描述的相同方式铸造。否则，您需要提供一个包含所有需要 Mint Settings 的守卫的附加对象属性。让我们看看使用我们的 SDK 在实践中是什么样子。

请注意，您可能需要根据创建 core candy machine 时使用的 candy guards 数量增加计算单元数量，以确保交易成功。我们的 SDK 也可能对此有所帮助。

{% dialect-switcher title="从带有守卫的 Core Candy Machine 铸造" %}
{% dialect title="JavaScript" id="js" %}

使用 Umi 库铸造时，您可以使用 `mintArgs` 属性来提供所需的 **Mint Settings**。

以下是使用 **Third Party Signer** 守卫（需要额外的签名者）和 **Mint Limit** 守卫（跟踪钱包从 Core Candy Machine 铸造的次数）的示例。

如上所述，您可能需要增加交易的计算单元限制以确保 `mintV1` 指令成功。当前单元设置为 `300_000`，但您可以根据需要调整此数字。您可以使用 `mpl-toolbox` Umi 库上的 `setComputeUnitLimit` 辅助函数来执行此操作，如下面的代码片段所示。

```ts
import {
  some,
  generateSigner,
  transactionBuilder,
} from '@metaplex-foundation/umi'
import { create, mintV1 } from '@metaplex-foundation/mpl-core-candy-machine'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'

// 创建带有守卫的 Core Candy Machine。
const thirdPartySigner = generateSigner()
await create(umi, {
  // ...
  guards: {
    thirdPartySigner: some({ signer: thirdPartySigner.publicKey }),
    mintLimit: some({ id: 1, limit: 3 }),
  },
}).sendAndConfirm(umi)

// 从 Core Candy Machine 铸造。
const nftMint = generateSigner(umi)
await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 300_000 }))
  .add(
    mintV1(umi, {
      candyMachine: candyMachineId,
      asset,
      collection: coreCollection,
      mintArgs: {
        thirdPartySigner: some({ signer: thirdPartySigner }),
        mintLimit: some({ id: 1 }),
      },
    })
  )
  .sendAndConfirm(umi)
```

API 参考: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [DefaultGuardSetMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetMintArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 使用守卫组铸造

从使用守卫组的 Core Candy Machine 铸造时，**我们必须通过提供其标签明确选择我们要从哪个组铸造**。

此外，如[上一节](#minting-with-guards)所述，也可能需要 Mint Settings。但是，**Mint Settings 将应用于所选组的 "Resolved Guards"**。

例如，假设一个 Core Candy Machine 有以下守卫：

- **默认守卫**：
  - Bot Tax
  - Third Party Signer
  - Start Date
- **组 1**
  - Label："nft"
  - Guards：
    - NFT Payment
    - Start Date
- **组 2**
  - Label："public"
  - Guards：
    - Sol Payment

组 1（标签为 "nft"）的 Resolved Guards 是：

- Bot Tax：来自**默认守卫**。
- Third Party Signer：来自**默认守卫**。
- NFT Payment：来自**组 1**。
- Start Date：来自**组 1**，因为它覆盖了默认守卫。

因此，提供的 Mint Settings 必须与这些 Resolved Guards 相关。在上面的示例中，必须为 Third Party Signer 守卫和 NFT Payment 守卫提供 Mint Settings。

{% dialect-switcher title="从带有守卫组的 Core Candy Machine 铸造" %}
{% dialect title="JavaScript" id="js" %}

从使用守卫组的 Core Candy Machine 铸造时，必须通过 `group` 属性提供我们要选择的组的标签。

此外，可以通过 `mintArgs` 属性提供该组的 Resolved Guards 的 Mint Settings。

以下是我们如何使用 Umi 库从上述示例 Core Candy Machine 铸造。

```ts
// 创建带有守卫的 Core Candy Machine。
const thirdPartySigner = generateSigner()
await create(umi, {
  // ...
  guards: {
    botTax: some({ lamports: sol(0.001), lastInstruction: true }),
    thirdPartySigner: some({ signer: thirdPartySigner.publicKey }),
    startDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
  },
  groups: [
    {
      label: 'nft',
      guards: {
        nftPayment: some({ requiredCollection, destination: nftTreasury }),
        startDate: some({ date: dateTime('2022-10-18T16:00:00Z') }),
      },
    },
    {
      label: 'public',
      guards: {
        solPayment: some({ lamports: sol(1), destination: solTreasury }),
      },
    },
  ],
}).sendAndConfirm(umi)

// 从 Core Candy Machine 铸造。

const candyMachineId = publicKey('11111111111111111111111111111111')
const coreCollection = publicKey('22222222222222222222222222222222')
const asset = generateSigner(umi)

await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 300_000 }))
  .add(
    mintV1(umi, {
      candyMachine: candyMachineId,
      asset,
      collection: coreCollection,
      group: some('nft'),
      mintArgs: {
        thirdPartySigner: some({ signer: thirdPartySigner }),
        nftPayment: some({
          mint: nftFromRequiredCollection.publicKey,
          destination: nftTreasury,
          tokenStandard: TokenStandard.NonFungible,
        }),
      },
    })
  )
  .sendAndConfirm(umi)
```

API 参考: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [DefaultGuardSetMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetMintArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 使用预验证铸造

重要的是要注意，某些守卫可能在我们可以从其 Core Candy Machine 铸造之前需要额外的验证步骤。此预验证步骤通常在区块链上创建一个账户或用一个代币奖励钱包，作为该验证的证明。

### 使用 route 指令

守卫可以要求预验证步骤的一种方式是通过 "route" 指令使用[它们自己的特殊指令](/zh/smart-contracts/core-candy-machine/guard-route)。

一个很好的例子是 **Allow List** 守卫。使用此守卫时，我们必须通过调用 route 指令并提供有效的 Merkle Proof 来验证我们的钱包属于预定义的钱包列表。如果此 route 指令成功，它将为该钱包创建一个 Allow List PDA，然后铸造指令可以读取它来验证 Allow List 守卫。[您可以在其专用页面上阅读更多关于 Allow List 守卫的内容](/zh/smart-contracts/core-candy-machine/guards/allow-list)。

### 使用外部服务

守卫执行预验证步骤的另一种方式是依赖外部解决方案。

例如，使用 **Gatekeeper** 守卫时，我们必须通过执行挑战（例如完成验证码）来请求 Gateway Token，这取决于配置的 Gatekeeper Network。然后 Gatekeeper 守卫将检查此类 Gateway Token 的存在以验证或拒绝铸造。[您可以在其专用页面上了解更多关于 Gatekeeper 守卫的内容](/zh/smart-contracts/core-candy-machine/guards/gatekeeper)。

## 使用 Bot Tax 铸造

您可能希望在 Core Candy Machine 中包含的一个守卫是 Bot Tax 守卫，它通过向失败的铸造收取可配置数量的 SOL 来保护您的 Core Candy Machine 免受机器人攻击。这个数量通常很小，以伤害机器人而不影响真实用户的真正错误。所有 bot taxes 将被转移到 Core Candy Machine 账户，以便在铸造结束后，您可以通过删除 Core Candy Machine 账户来访问这些资金。

此守卫有点特殊，会影响所有其他守卫的铸造行为。当 Bot Tax 被激活且任何其他守卫验证铸造失败时，**交易将假装成功**。这意味着程序不会返回任何错误，但也不会铸造任何 NFT。这是因为交易必须成功才能将资金从机器人转移到 Core Candy Machine 账户。[您可以在其专用页面上了解更多关于 Bot Tax 守卫的内容](/zh/smart-contracts/core-candy-machine/guards/bot-tax)。

## 结论

恭喜，您现在从头到尾了解了 Core Candy Machine 的工作原理！

以下是一些您可能感兴趣的额外阅读资源：

- [所有可用的守卫](/zh/smart-contracts/core-candy-machine/guards)：浏览所有可用的守卫，以便您可以选择您需要的。
