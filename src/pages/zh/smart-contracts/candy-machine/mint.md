---
title: 铸造
metaTitle: 铸造 | Candy Machine
description: 解释如何从 Candy Machine 铸造以及如何处理预铸造要求。
---

到目前为止，我们已经学习了如何创建和维护 Candy Machine。我们已经看到了如何配置它们以及如何使用守卫和守卫组设置复杂的铸造工作流程。现在是时候讨论拼图的最后一块：铸造！{% .lead %}

## 基本铸造

如[在 Candy Guards 页面中所述](/zh/candy-machine/guards#why-another-program)，有两个程序负责从 Candy Machine 铸造 NFT：Candy Machine Core 程序——负责铸造 NFT——以及 Candy Guard 程序，它在其上添加了一个可配置的访问控制层，可以分叉以提供自定义守卫。

因此，有两种方式从 Candy Machine 铸造：

- **通过 Candy Guard 程序**，然后它将铸造委托给 Candy Machine Core 程序。大多数时候，您会想要这样做，因为它允许更复杂的铸造工作流程。根据账户中配置的守卫，您可能需要向铸造指令传递额外的剩余账户和指令数据。幸运的是，我们的 SDK 通过要求一些额外参数并为我们计算其余部分来简化此操作。

- **直接从 Candy Machine Core 程序**。在这种情况下，只有配置的铸造权限可以从中铸造，因此它需要签署交易。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Candy Machine" theme="blue" /%}
{% node label="Owner: Candy Machine Core Program" theme="dimmed" /%}
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
他们符合已激活的 \
守卫要求。
{% /node %}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}
{% node parent="mint-2" x=200 y=-18 theme="transparent" %}
只有 Alice \
可以铸造。
{% /node %}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% node parent="mint-2" x=280 %}
{% node #candy-machine-2 label="Candy Machine" theme="blue" /%}
{% node label="Owner: Candy Machine Core Program" theme="dimmed" /%}
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

如果一切顺利，将根据 Candy Machine 中配置的参数创建一个 NFT。例如，如果给定的 Candy Machine 使用 **Config Line Settings** 并将 **Is Sequential** 设置为 `false`，那么我们将随机获取下一个项目。

从 Candy Guard 程序的版本 `1.0` 开始，铸造指令接受一个额外的 `minter` 签名者，它可以与现有的 `payer` 签名者不同。这允许我们创建铸造工作流程，其中铸造 NFT 的钱包不再需要支付 SOL 费用——如存储费用和 SOL 铸造付款——因为 `payer` 签名者将抽象掉这些费用。请注意，`minter` 签名者仍然需要支付基于代币的费用，并将用于验证配置的守卫。

请注意，最新的铸造指令依赖于最新的 Token Metadata 指令，这些指令使用大量的计算单元。因此，您可能需要增加交易的计算单元限制以确保成功。我们的 SDK 也可以帮助解决这个问题。

{% dialect-switcher title="从 Candy Machine 铸造" %}
{% dialect title="JavaScript" id="js" %}

要通过配置的 Candy Guard 账户从 Candy Machine 铸造，您可以使用 `mintV2` 函数并提供铸造地址和铸造的 NFT 将属于的集合 NFT 的更新权限。也可以提供 `minter` 签名者和 `payer` 签名者，但它们将分别默认为 Umi 的 identity 和 payer。

如上所述，您可能需要增加交易的计算单元限制以确保 `mintV2` 指令成功。您可以使用 `mpl-toolbox` Umi 库上的 `setComputeUnitLimit` 辅助函数来实现，如下面的代码片段所示。

如果您想铸造 pNFT（例如用于版税执行）并已相应地设置了 Candy Machine，您需要添加 `tokenStandard` 字段。默认使用 `NonFungible`。如果您之前获取了 Candy Machine，可以使用 `candyMachine.tokenStandard`，否则您需要使用 `@metaplex-foundation/mpl-token-metadata` 中的 `tokenStandard: TokenStandard.ProgrammableNonFungible` 自己指定。

```ts
import { mintV2 } from '@metaplex-foundation/mpl-candy-machine'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'
import { transactionBuilder, generateSigner } from '@metaplex-foundation/umi'

const nftMint = generateSigner(umi)
await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 800_000 }))
  .add(
    mintV2(umi, {
      candyMachine: candyMachine.publicKey,
      nftMint,
      collectionMint: collectionNft.publicKey,
      collectionUpdateAuthority: collectionNft.metadata.updateAuthority,
      tokenStandard: candyMachine.tokenStandard,
    })
  )
  .sendAndConfirm(umi)
```

请注意，`mintV2` 指令默认会为我们创建 Mint 和 Token 账户，并将 NFT 所有者设置为 `minter`。如果您希望事先自己创建这些账户，您可以简单地将 NFT 铸币地址作为公钥而不是签名者提供。以下是使用 `mpl-toolbox` Umi 库中的 `createMintWithAssociatedToken` 函数的示例：

```ts
import { mintV2 } from '@metaplex-foundation/mpl-candy-machine'
import {
  createMintWithAssociatedToken,
  setComputeUnitLimit,
} from '@metaplex-foundation/mpl-toolbox'
import { transactionBuilder, generateSigner } from '@metaplex-foundation/umi'

const nftMint = generateSigner(umi)
const nftOwner = generateSigner(umi).publicKey
await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 800_000 }))
  .add(createMintWithAssociatedToken(umi, { mint: nftMint, owner: nftOwner }))
  .add(
    mintV2(umi, {
      candyMachine: candyMachine.publicKey,
      nftMint: nftMint.publicKey,
      collectionMint: collectionNft.publicKey,
      collectionUpdateAuthority: collectionNft.metadata.updateAuthority,
    })
  )
  .sendAndConfirm(umi)
```

在您希望直接从 Candy Machine Core 程序铸造的罕见情况下，您可以改用 `mintFromCandyMachineV2` 函数。此函数要求将 candy machine 的铸造权限作为签名者提供，并接受显式的 `nftOwner` 属性。

```ts
import { mintFromCandyMachineV2 } from '@metaplex-foundation/mpl-candy-machine'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'
import { transactionBuilder, generateSigner } from '@metaplex-foundation/umi'

const nftMint = generateSigner(umi)
const nftOwner = generateSigner(umi).publicKey
await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 800_000 }))
  .add(
    mintFromCandyMachineV2(umi, {
      candyMachine: candyMachine.publicKey,
      mintAuthority: umi.identity,
      nftOwner,
      nftMint,
      collectionMint: collectionNft.publicKey,
      collectionUpdateAuthority: collectionNft.metadata.updateAuthority,
    })
  )
  .sendAndConfirm(umi)
```

API 参考：[mintV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintV2.html)、[mintFromCandyMachineV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintFromCandyMachineV2.html)

{% /dialect %}
{% /dialect-switcher %}

## 使用守卫铸造

当从使用多个守卫的 Candy Machine 铸造时，您可能需要提供额外的守卫特定信息。

如果您要手动构建铸造指令，该信息将作为指令数据和剩余账户的混合提供。但是，使用我们的 SDK，每个在铸造时需要额外信息的守卫都定义了一组设置，我们称之为 **Mint Settings（铸造设置）**。这些铸造设置然后将被解析为程序所需的内容。

一个需要铸造设置的守卫的好例子是 **NFT Payment** 守卫，它需要我们应该用于支付铸造的 NFT 的铸币地址以及其他内容。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Candy Machine" theme="blue" /%}
{% node label="Owner: Candy Machine Core Program" theme="dimmed" /%}
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
{% node label="Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% node parent="mint-2" x=-400 %}
{% node #mint-settings label="Mint Settings" /%}
{% node label="Using our SDKs" theme="dimmed" /%}
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

[每个可用的守卫](/zh/candy-machine/guards)都有自己的文档页面，它会告诉您该守卫是否需要在铸造时提供铸造设置。

如果您只使用不需要铸造设置的守卫，您可以按照上面"基本铸造"部分描述的方式进行铸造。否则，您需要提供一个额外的对象属性，其中包含所有需要铸造设置的守卫的铸造设置。让我们看看使用我们的 SDK 在实践中是什么样子的。

{% dialect-switcher title="使用守卫从 Candy Machine 铸造" %}
{% dialect title="JavaScript" id="js" %}

通过 Umi 库铸造时，您可以使用 `mintArgs` 属性提供所需的 **Mint Settings（铸造设置）**。

以下是使用 **Third Party Signer** 守卫（需要额外的签名者）和 **Mint Limit** 守卫（跟踪钱包从 Candy Machine 铸造的次数）的示例。

```ts
import {
  some,
  generateSigner,
  transactionBuilder,
} from '@metaplex-foundation/umi'
import { create, mintV2 } from '@metaplex-foundation/mpl-candy-machine'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'

// 创建带守卫的 Candy Machine。
const thirdPartySigner = generateSigner()
await create(umi, {
  // ...
  guards: {
    thirdPartySigner: some({ signer: thirdPartySigner.publicKey }),
    mintLimit: some({ id: 1, limit: 3 }),
  },
}).sendAndConfirm(umi)

// 从 Candy Machine 铸造。
const nftMint = generateSigner(umi)
await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 800_000 }))
  .add(
    mintV2(umi, {
      candyMachine: candyMachine.publicKey,
      nftMint,
      collectionMint: collectionNft.publicKey,
      collectionUpdateAuthority: collectionNft.metadata.updateAuthority,
      mintArgs: {
        thirdPartySigner: some({ signer: thirdPartySigner }),
        mintLimit: some({ id: 1 }),
      },
    })
  )
  .sendAndConfirm(umi)
```

API 参考：[mintV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintV2.html)、[DefaultGuardSetMintArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetMintArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 使用守卫组铸造

当从使用守卫组的 Candy Machine 铸造时，**我们必须通过提供其标签明确选择要从哪个组铸造**。

此外，如[上一节](#minting-with-guards)所述，可能还需要铸造设置。但是，**铸造设置将应用于所选组的"已解析守卫"**。

例如，假设一个 Candy Machine 具有以下守卫：

- **默认守卫**：
  - Bot Tax
  - Third Party Signer
  - Start Date
- **组 1**
  - 标签："nft"
  - 守卫：
    - NFT Payment
    - Start Date
- **组 2**
  - 标签："public"
  - 守卫：
    - Sol Payment

组 1——标签为"nft"——的已解析守卫是：

- Bot Tax：来自**默认守卫**。
- Third Party Signer：来自**默认守卫**。
- NFT Payment：来自**组 1**。
- Start Date：来自**组 1**，因为它覆盖了默认守卫。

因此，提供的铸造设置必须与这些已解析守卫相关。在上面的示例中，必须为 Third Party Signer 守卫和 NFT Payment 守卫提供铸造设置。

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
{% node label="Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% node parent="mint-2" x=-400 y=60 %}
{% node #mint-settings label="Mint Settings" /%}
{% node label="Using our SDKs" theme="dimmed" /%}
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

{% dialect-switcher title="使用守卫组从 Candy Machine 铸造" %}
{% dialect title="JavaScript" id="js" %}

当从使用守卫组的 Candy Machine 铸造时，必须通过 `group` 属性提供我们要选择的组的标签。

此外，可以通过 `mintArgs` 属性提供该组已解析守卫的铸造设置。

以下是我们如何使用 Umi 库从上面描述的示例 Candy Machine 铸造。

```ts
// 创建带守卫的 Candy Machine。
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

// 从 Candy Machine 铸造。
const nftMint = generateSigner(umi)
await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 800_000 }))
  .add(
    mintV2(umi, {
      candyMachine: candyMachine.publicKey,
      nftMint,
      collectionMint: collectionNft.publicKey,
      collectionUpdateAuthority: collectionNft.metadata.updateAuthority,
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

API 参考：[mintV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintV2.html)、[DefaultGuardSetMintArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetMintArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 使用预验证铸造

重要的是要注意，在我们可以从 Candy Machine 铸造之前，某些守卫可能需要额外的验证步骤。这个预验证步骤通常在区块链上创建一个账户或奖励钱包一个代币，作为该验证的证明。

### 使用 route 指令

守卫要求预验证步骤的一种方式是通过"route"指令使用[它们自己的特殊指令](/zh/candy-machine/guard-route)。

一个很好的例子是 **Allow List** 守卫。使用此守卫时，我们必须通过调用 route 指令并提供有效的 Merkle 证明来验证我们的钱包属于预定义的钱包列表。如果此 route 指令成功，它将为该钱包创建一个 Allow List PDA，然后铸造指令可以读取该 PDA 来验证 Allow List 守卫。[您可以在其专用页面上阅读更多关于 Allow List 守卫的信息](/zh/candy-machine/guards/allow-list)。

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

### 使用外部服务

守卫执行预验证步骤的另一种方式是依赖外部解决方案。

例如，使用 **Gatekeeper** 守卫时，我们必须通过执行挑战（如完成验证码）来请求 Gateway Token，这取决于配置的 Gatekeeper Network。然后 Gatekeeper 守卫将检查此类 Gateway Token 的存在以验证或拒绝铸造。[您可以在其专用页面上了解更多关于 Gatekeeper 守卫的信息](/zh/candy-machine/guards/gatekeeper)。

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Candy Machine" theme="blue" /%}
{% node label="Owner: Candy Machine Core Program" theme="dimmed" /%}
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
{% node label="Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% node parent="mint-2" x=-250 y=-40 %}
{% node #network label="Gatekeeper Network" theme="slate" /%}
{% node theme="slate" %}
从 Gatekeeper \
Network 请求 Gateway Token，\
例如验证码。
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

您可能希望在 Candy Machine 中包含的一个守卫是 Bot Tax 守卫，它通过向失败的铸造收取可配置数量的 SOL 来保护您的 Candy Machine 免受机器人攻击。这个数量通常很小，足以伤害机器人而不会影响真实用户的真正错误。所有机器人税将转移到 Candy Machine 账户，以便在铸造结束后，您可以通过删除 Candy Machine 账户来访问这些资金。

这个守卫有点特殊，会影响所有其他守卫的铸造行为。当 Bot Tax 被激活并且任何其他守卫验证铸造失败时，**交易将假装成功**。这意味着程序不会返回错误，但也不会铸造 NFT。这是因为交易必须成功才能将资金从机器人转移到 Candy Machine 账户。[您可以在其专用页面上了解更多关于 Bot Tax 守卫的信息](/zh/candy-machine/guards/bot-tax)。

## 结论

恭喜，您现在从头到尾了解了 Candy Machine 的工作原理！

以下是您可能感兴趣的一些额外阅读资源：

- [所有可用守卫](/zh/candy-machine/guards)：浏览所有可用的守卫，以便您可以挑选所需的守卫。
- [创建您的第一个 Candy Machine](/zh/candy-machine/guides/create-an-nft-collection-on-solana-with-candy-machine)：此操作指南帮助您上传资产并使用名为"[Sugar](/zh/candy-machine/sugar)"的 CLI 工具从头创建新的 Candy Machine。
