---
title: 从 Core Candy Machine 铸造
metaTitle: 从 Core Candy Machine 铸造 | Core Candy Machine
description: 如何使用 mintV1 指令从 Core Candy Machine 铸造 Core NFT Assets，包括守卫配置、守卫组、预验证和 Bot Tax 行为。
keywords:
  - core candy machine minting
  - mintV1 instruction
  - candy guard program
  - mint settings
  - guard groups
  - bot tax
  - pre-validation
  - route instruction
  - NFT minting Solana
  - mpl-core-candy-machine
  - Metaplex Core
  - mint args
  - allow list
  - compute unit limit
about:
  - Minting NFTs from a Core Candy Machine
  - Configuring guards and guard groups for minting workflows
  - Pre-validation and bot protection for minting
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
faqs:
  - q: 通过 Candy Guard 程序铸造和直接从 Core Candy Machine 程序铸造有什么区别？
    a: 通过 Candy Guard 程序铸造允许任何用户在满足配置的守卫条件后铸造，支持支付、允许列表和开始日期等复杂的访问控制工作流程。直接从 Core Candy Machine 程序铸造会绕过所有守卫，但需要配置的铸造权限签署交易，仅适用于权限控制的铸造。
  - q: 使用多个守卫铸造时如何增加计算单元限制？
    a: 使用 @metaplex-foundation/mpl-toolbox 中的 setComputeUnitLimit 辅助函数在交易构建器中设置。300,000 单元是一个常见的起点，但您应根据配置的守卫数量进行调整。守卫越多需要的计算单元越多。
  - q: 铸造失败且启用了 Bot Tax 时会发生什么？
    a: 当 Bot Tax 启用且另一个守卫拒绝铸造时，交易仍会在链上成功，但不会创建 NFT。相反，配置的 Bot Tax 金额（以 SOL 计）会从铸造者转移到 Candy Machine 账户。这种设计防止机器人廉价地探测守卫条件，因为失败的尝试仍然消耗 SOL。
  - q: 铸造时是否需要为每个守卫提供 Mint Settings？
    a: 不需要。只有需要额外运行时信息的守卫才需要 Mint Settings。例如，Third Party Signer 需要签名者引用，Mint Limit 需要 ID。像 Start Date 或 End Date 这样的守卫会自动验证，不需要 Mint Settings。每个守卫的文档页面会说明是否需要 Mint Settings。
  - q: minter 签名者和 payer 签名者有什么区别？
    a: 从 Candy Guard v1.0 开始，mintV1 指令接受单独的 minter 和 payer 签名者。payer 支付基于 SOL 的费用（如存储和 SOL 支付守卫）。minter 根据守卫条件（如允许列表和铸造限制）进行验证，并支付基于代币的费用。这种分离支持无 Gas 铸造工作流程，后端付款者代表最终用户支付 SOL 费用。
---

## 概要

`mintV1` 指令通过 [Candy Guard](/zh/smart-contracts/core-candy-machine/guards) 程序进行访问控制，然后将实际铸造委托给 Core Candy Machine 程序，从已加载的 [Core Candy Machine](/zh/smart-contracts/core-candy-machine) 创建 Core Asset。

- **两种铸造路径**：通过 Candy Guard 程序铸造（推荐，支持守卫）或直接通过 Core Candy Machine 程序铸造（需要铸造权限签名）。
- **Mint Settings**：需要运行时数据的守卫（如 Third Party Signer 或 NFT Payment）需要在铸造时通过 `mintArgs` 传递额外参数。
- **守卫组**：配置[守卫组](/zh/smart-contracts/core-candy-machine/guard-groups)时，必须指定从哪个组标签铸造，Mint Settings 适用于该组的已解析守卫。
- **预验证**：某些守卫（如 Allow List 和 Gatekeeper）需要在铸造指令成功之前执行单独的验证步骤。

## 基本铸造

Core Candy Machine 使用两个链上程序处理铸造：**Core Candy Machine 程序**（负责实际的铸造逻辑）和 **Candy Guard 程序**（在其上添加可配置的访问控制层）。如[Candy Guards 页面](/zh/smart-contracts/core-candy-machine/guards#why-another-program)所述，这两个程序协同工作以实现灵活的铸造工作流程。

有两种方式可以从 Core Candy Machine 铸造：

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

{% callout type="note" %}
从 Candy Guard 程序的 `1.0` 版本开始，铸造指令接受一个额外的 `minter` 签名者，它可以与现有的 `payer` 签名者不同。`payer` 支付基于 SOL 的费用（存储、SOL 支付守卫），而 `minter` 根据守卫条件进行验证并支付基于代币的费用。这支持无 Gas 铸造工作流程，后端钱包代表最终用户支付 SOL 费用。
{% /callout %}

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

需要运行时信息的守卫使用 **Mint Settings**——通过 `mintArgs` 传递的额外参数，用于提供守卫特定的数据，如签名者引用、代币铸造地址或限制标识符。如果您要手动构建铸造指令，该信息将作为指令数据和剩余账户的混合提供。但是，使用我们的 SDK，每个在铸造时需要额外信息的守卫都定义了一组我们称为 **Mint Settings** 的设置。这些 Mint Settings 将被解析为程序所需的任何内容。

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

如果您只使用不需要 Mint Settings 的守卫，您可以按照上面"基本铸造"部分描述的相同方式铸造。否则，您需要提供一个包含所有需要 Mint Settings 的守卫的附加对象属性。让我们看看使用我们的 SDK 在实践中是什么样子。

{% callout type="note" %}
您可能需要根据 Core Candy Machine 上配置的[守卫](/zh/smart-contracts/core-candy-machine/guards)数量增加计算单元限制。使用 `@metaplex-foundation/mpl-toolbox` 中的 `setComputeUnitLimit` 设置更高的限制（例如 `300_000` 单元）。根据使用的守卫数量调整此值。
{% /callout %}

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

配置[守卫组](/zh/smart-contracts/core-candy-machine/guard-groups)时，铸造指令需要一个明确的 `group` 标签来选择从哪个组铸造。Mint Settings 然后适用于所选组的 **已解析守卫（Resolved Guards）**——该组的守卫与任何默认守卫合并的组合。

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

组 1（标签为 "nft"）的已解析守卫是：

- Bot Tax：来自**默认守卫**。
- Third Party Signer：来自**默认守卫**。
- NFT Payment：来自**组 1**。
- Start Date：来自**组 1**，因为它覆盖了默认守卫。

因此，提供的 Mint Settings 必须与这些已解析守卫相关。在上面的示例中，必须为 Third Party Signer 守卫和 NFT Payment 守卫提供 Mint Settings。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node label="Guards (default guards)" theme="mint" z=1 /%}
{% node label="Bot Tax" /%}
{% node #third-party-signer-guard label="Third Party Signer" /%}
{% node label="Start Date" /%}
{% node #nft-group theme="mint" z=1 %}
Group 1: "nft" {% .font-semibold %}
{% /node %}
{% node #nft-payment-guard label="NFT Payment" /%}
{% node label="Start Date" /%}
{% node theme="mint" z=1 %}
Group 2: "public"
{% /node %}
{% node label="SOL Payment" /%}
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

{% node parent="mint-2" x=-400 y=60 %}
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
{% edge from="nft-group" to="mint-1" theme="pink" /%}

{% /diagram %}

{% seperator h="6" /%}

{% dialect-switcher title="从带有守卫组的 Core Candy Machine 铸造" %}
{% dialect title="JavaScript" id="js" %}

从使用守卫组的 Core Candy Machine 铸造时，必须通过 `group` 属性提供我们要选择的组的标签。

此外，可以通过 `mintArgs` 属性提供该组的已解析守卫的 Mint Settings。

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

某些守卫需要在铸造指令成功之前执行额外的验证步骤。此预验证步骤通常在区块链上创建一个账户或发行一个代币，作为资格证明，铸造指令在执行过程中会检查该证明。

### 通过 Route 指令预验证

[route 指令](/zh/smart-contracts/core-candy-machine/guard-route)允许守卫执行自己的自定义指令进行铸造前验证。守卫定义 route 指令执行的操作，由此产生的链上证明在后续的铸造调用中被检查。

一个很好的例子是 **Allow List** 守卫。使用此守卫时，我们必须通过调用 route 指令并提供有效的 Merkle Proof 来验证我们的钱包属于预定义的钱包列表。如果此 route 指令成功，它将为该钱包创建一个 Allow List PDA，然后铸造指令可以读取它来验证 Allow List 守卫。[您可以在其专用页面上阅读更多关于 Allow List 守卫的内容](/zh/smart-contracts/core-candy-machine/guards/allow-list)。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
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
{% node label="Core Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% node parent="mint-2" x=-250 %}
{% node #route label="Route" theme="pink" /%}
{% node label="Core Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="route" x=70 y=-20 label="Verify Merkle Proof" theme="transparent" /%}

{% node #allow-list-pda parent="route" x=23 y=100 label="Allow List PDA" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="allow-list-guard" to="route" theme="pink" /%}
{% edge from="route" to="allow-list-pda" theme="pink" path="straight" /%}
{% edge from="allow-list-pda" to="mint-1" theme="pink" /%}

{% /diagram %}

### 通过外部服务预验证

某些守卫将预验证委托给外部服务，而不是使用 route 指令。外部服务发行一个代币或凭证，守卫在铸造期间检查该凭证。

例如，使用 **Gatekeeper** 守卫时，我们必须通过执行挑战（例如完成验证码）来请求 Gateway Token，这取决于配置的 Gatekeeper Network。然后 Gatekeeper 守卫将检查此类 Gateway Token 的存在以验证或拒绝铸造。[您可以在其专用页面上了解更多关于 Gatekeeper 守卫的内容](/zh/smart-contracts/core-candy-machine/guards/gatekeeper)。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node label="Guards" theme="mint" z=1 /%}
{% node #gatekeeper-guard label="Gatekeeper" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=550 %}
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

{% node parent="mint-2" x=-250 y=-40 %}
{% node #network label="Gatekeeper Network" theme="slate" /%}
{% node theme="slate" %}
Request Gateway Token \
from the Gatekeeper \
Network, e.g. Captcha.
{% /node %}
{% /node %}

{% node #gateway-token parent="network" x=23 y=140 label="Gateway Token" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="gatekeeper-guard" to="network" theme="slate" /%}
{% edge from="network" to="gateway-token" theme="slate" path="straight" /%}
{% edge from="gateway-token" to="mint-1" theme="pink" /%}

{% /diagram %}

## 使用 Bot Tax 铸造

[Bot Tax](/zh/smart-contracts/core-candy-machine/guards/bot-tax) 守卫通过对失败的铸造收取可配置的 SOL 费用而非回滚交易来保护 Core Candy Machine 免受机器人攻击。这个金额通常很小，以伤害机器人而不影响真实用户的真正错误。所有 bot taxes 将被转移到 Core Candy Machine 账户，以便在铸造结束后，您可以通过删除 Core Candy Machine 账户来访问这些资金。

此守卫有点特殊，会影响所有其他守卫的铸造行为。当 Bot Tax 被激活且任何其他守卫验证铸造失败时，**交易将假装成功**。这意味着程序不会返回任何错误，但也不会铸造任何 NFT。这是因为交易必须成功才能将资金从机器人转移到 Core Candy Machine 账户。[您可以在其专用页面上了解更多关于 Bot Tax 守卫的内容](/zh/smart-contracts/core-candy-machine/guards/bot-tax)。

{% callout type="warning" %}
因为 Bot Tax 导致失败的铸造看起来像成功的交易，您应该始终验证铸造交易确认后预期的 NFT 是否实际创建。检查交易日志或验证资产账户是否存在。
{% /callout %}

## 注意事项

- **计算单元限制**：使用多个[守卫](/zh/smart-contracts/core-candy-machine/guards)铸造可能超过默认计算预算。使用 `@metaplex-foundation/mpl-toolbox` 中的 `setComputeUnitLimit` 增加限制——`300_000` 单元是常见的起点，但根据活跃守卫的数量进行调整。
- **Minter 与 payer 签名者**：从 Candy Guard 程序 v1.0 开始，`mintV1` 指令接受单独的 `minter` 和 `payer` 签名者。`payer` 支付 SOL 费用（租金、SOL 支付守卫）；`minter` 根据守卫进行验证并支付基于代币的费用。如果未明确设置，两者都默认为 Umi 的身份和付款者。
- **Bot Tax 行为**：启用 [Bot Tax](/zh/smart-contracts/core-candy-machine/guards/bot-tax) 且另一个守卫拒绝铸造时，交易在链上成功但不创建 NFT。Bot Tax SOL 金额会转移到 Candy Machine 账户。当 Bot Tax 启用时，始终确认铸造后 NFT 已创建。
- **Config Line 顺序**：如果 Core Candy Machine 使用 Config Line Settings 且 `isSequential` 设置为 `false`，则从剩余池中随机选择铸造的物品。设置为 `true` 则按顺序铸造物品。
- **守卫组标签必填**：配置[守卫组](/zh/smart-contracts/core-candy-machine/guard-groups)时，`group` 参数是必需的。省略它将导致铸造指令失败。

## 常见问题

### 通过 Candy Guard 程序铸造和直接从 Core Candy Machine 程序铸造有什么区别？

通过 Candy Guard 程序铸造允许任何用户在满足配置的[守卫](/zh/smart-contracts/core-candy-machine/guards)条件后铸造，支持支付、允许列表和开始日期等复杂的访问控制工作流程。直接从 Core Candy Machine 程序铸造会绕过所有守卫，但需要配置的铸造权限签署交易，仅适用于权限控制的铸造。

### 使用多个守卫铸造时如何增加计算单元限制？

使用 `@metaplex-foundation/mpl-toolbox` 中的 `setComputeUnitLimit` 辅助函数在交易构建器中设置。`300_000` 单元是常见的起点，但您应根据配置的守卫数量进行调整。守卫越多需要的计算单元越多。

### 铸造失败且启用了 Bot Tax 时会发生什么？

当 [Bot Tax](/zh/smart-contracts/core-candy-machine/guards/bot-tax) 启用且另一个守卫拒绝铸造时，交易仍会在链上成功，但不会创建 NFT。相反，配置的 Bot Tax 金额（以 SOL 计）会从铸造者转移到 Candy Machine 账户。这种设计防止机器人廉价地探测守卫条件，因为失败的尝试仍然消耗 SOL。

### 铸造时是否需要为每个守卫提供 Mint Settings？

不需要。只有需要额外运行时信息的守卫才需要 Mint Settings。例如，Third Party Signer 需要签名者引用，Mint Limit 需要 ID。像 Start Date 或 End Date 这样的守卫会自动验证，不需要 Mint Settings。每个[守卫的文档页面](/zh/smart-contracts/core-candy-machine/guards)会说明是否需要 Mint Settings。

### minter 签名者和 payer 签名者有什么区别？

从 Candy Guard v1.0 开始，`mintV1` 指令接受单独的 `minter` 和 `payer` 签名者。`payer` 支付基于 SOL 的费用（如存储和 SOL 支付守卫）。`minter` 根据守卫条件（如允许列表和铸造限制）进行验证，并支付基于代币的费用。这种分离支持无 Gas 铸造工作流程，后端付款者代表最终用户支付 SOL 费用。

---

## 后续步骤

以下是一些您可能感兴趣的额外阅读资源：

- [所有可用的守卫](/zh/smart-contracts/core-candy-machine/guards)：浏览所有可用的守卫，以便您可以选择您需要的。
- [守卫组](/zh/smart-contracts/core-candy-machine/guard-groups)：了解如何为不同铸造阶段配置多个守卫组。
- [Route 指令](/zh/smart-contracts/core-candy-machine/guard-route)：了解守卫如何使用 route 指令进行预验证。

