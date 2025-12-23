---
title: 管理 Candy Machine
metaTitle: 创建、更新、获取和删除 | Candy Machine
description: 解释如何管理 Candy Machine。
---

在[上一页](/zh/candy-machine/settings)中，我们介绍了 Candy Machine 的各种设置。现在，让我们看看如何使用这些设置来创建和更新 Candy Machine。我们还将讨论如何获取现有的 Candy Machine 以及在其完成使命后如何删除它。{% .lead %}

本质上，我们将介绍 Candy Machine 的创建、读取、更新和删除步骤。让我们开始吧！

## 创建 Candy Machine

您可以使用上一页讨论的设置来创建一个全新的 Candy Machine 账户。

我们的 SDK 进一步推动了这一点，将每个新的 Candy Machine 账户与一个新的 Candy Guard 账户关联，该账户跟踪影响铸造过程的所有已激活的守卫。在本页中，我们将重点关注 Candy Machine 账户，但我们将在[专门的页面](/zh/candy-machine/guards)中深入探讨 Candy Guard 账户以及我们可以用它们做什么。

请记住，Candy Machine [必须与一个 Collection NFT 关联](/zh/candy-machine/settings#metaplex-certified-collections)，其更新权限必须授权此操作。如果您还没有为 Candy Machine 准备 Collection NFT，我们的 SDK 也可以帮助您。

{% callout type="note" title="随机性" %}

建议使用[隐藏设置](/zh/candy-machine/settings#hidden-settings)来实现揭示机制，因为资产的"随机"铸造过程并不完全不可预测，可以被足够的资源和恶意行为影响。

{% /callout %}

{% dialect-switcher title="创建 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

以下是如何使用 Umi 库通过全新的 Collection NFT 创建 Candy Machine。

```ts
import {
  createNft,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata'
import { create } from '@metaplex-foundation/mpl-candy-machine'
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'

// 创建 Collection NFT。
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: umi.identity,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
    collectionDetails: {
    __kind: 'V1',
    size: 0,
  },
}).sendAndConfirm(umi)

// 创建 Candy Machine。
const candyMachine = generateSigner(umi)
await create(umi, {
  candyMachine,
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority: umi.identity,
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  itemsAvailable: 5000,
  creators: [
    {
      address: umi.identity.publicKey,
      verified: true,
      percentageShare: 100,
    },
  ],
  configLineSettings: some({
    prefixName: '',
    nameLength: 32,
    prefixUri: '',
    uriLength: 200,
    isSequential: false,
  }),
}).sendAndConfirm(umi)
```

如上所述，此操作还将负责创建并关联一个新的 Candy Guard 账户到已创建的 Candy Machine。这是因为没有 Candy Guard 的 Candy Machine 不是很有用，您大多数时候都会想要这样做。不过，如果您想禁用该行为，可以改用 `createCandyMachineV2` 方法。

```tsx
import { createCandyMachineV2 } from '@metaplex-foundation/mpl-candy-machine'

await createCandyMachineV2(umi, {
  // ...
}).sendAndConfirm(umi)
```

在这些示例中，我们只关注了必需的参数，但您可能想查看以下 API 参考，了解可以使用此 `create` 函数做什么。

API 参考：[create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html)、[createCandyMachineV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/createCandyMachineV2.html)。

{% /dialect %}
{% /dialect-switcher %}

## Candy Machine 账户

现在我们已经创建了 Candy Machine 账户，让我们看看里面存储了什么数据。

首先，它存储了创建账户时提供的所有设置，并跟踪任何更改。有关这些设置的更多详情，请参阅[上一页](/zh/candy-machine/settings)。

此外，它还存储以下属性：

- **Items Redeemed（已兑换项目数）**。这跟踪从 Candy Machine 铸造的 NFT 数量。请注意，一旦这个数字从 0 变为 1，大多数设置将不再可更新。
- **Account Version（账户版本）**。此枚举用于跟踪 Candy Machine 的账户版本。它用于确定哪些功能可用以及应如何解释账户。请注意，这不要与"Candy Machine V3"混淆，后者指的是 Candy Machine 程序的第三个也是最新的迭代（包括 Candy Machine Core 和 Candy Guard 程序）。
- **Feature Flags（功能标志）**。这有助于程序在引入更多功能时实现向后和向前兼容。

最后，它存储插入到 Candy Machine 中的所有项目以及它们是否已被铸造。这仅适用于使用[**Config Line Settings**](/zh/candy-machine/settings#config-line-settings)的 Candy Machine，因为[**Hidden Settings**](/zh/candy-machine/settings#hidden-settings)不允许您插入任何项目。此部分包含以下信息：

- 已加载的项目数量。
- 已插入或将要插入的所有项目的列表。当项目尚未插入时，该位置的项目名称和 URI 为空。
- 一个位图——一个是或否的列表——用于跟踪哪些项目已加载。当此位图全是是时，所有项目都已加载。
- 使用随机顺序铸造时尚未铸造的所有项目的列表。这允许程序随机抓取一个索引，而不必担心选择了一个已经铸造的索引然后重新开始。

请注意，最后这一部分故意没有在程序上反序列化，但我们的 SDK 会以人性化的格式为您解析所有这些数据。

有关 Candy Machine 账户的更多详细信息，请查看[程序的 API 参考](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-machine-core#account)。

{% dialect-switcher title="Candy Machine 账户内部" %}
{% dialect title="JavaScript" id="js" %}

检查 Umi 库中 Candy Machine 建模方式的最佳方法是查看 [`CandyMachine` 账户的 API 参考](https://mpl-candy-machine.typedoc.metaplex.com/types/CandyMachine.html)。您可能还想查看 [`candyGuard` 账户的 API 参考](https://mpl-candy-machine.typedoc.metaplex.com/types/CandyGuard.html)，因为使用 `create` 函数时会为每个 candy machine 自动创建一个。

以下是展示一些 Candy Machine 属性的小代码示例。

```tsx
import {
  fetchCandyMachine,
  fetchCandyGuard,
} from '@metaplex-foundation/mpl-candy-machine'

const candyMachine = await fetchCandyMachine(umi, candyMachineAddress)
const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority)

candyMachine.publicKey // Candy Machine 账户的公钥。
candyMachine.mintAuthority // Candy Machine 的铸造权限，在大多数情况下是 Candy Guard 地址。
candyMachine.data.itemsAvailable // 可用 NFT 的总数。
candyMachine.itemsRedeemed // 已铸造的 NFT 数量。
candyMachine.items[0].index // 第一个已加载项目的索引。
candyMachine.items[0].name // 第一个已加载项目的名称（带前缀）。
candyMachine.items[0].uri // 第一个已加载项目的 URI（带前缀）。
candyMachine.items[0].minted // 第一个项目是否已被铸造。
```

{% /dialect %}
{% /dialect-switcher %}

## 获取 Candy Machine

要获取现有的 Candy Machine，您只需提供其地址，我们的 SDK 将负责为您解析账户数据。

{% dialect-switcher title="获取 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

以下是如何使用地址获取 Candy Machine 及其关联的 Candy Guard 账户（如果有）。

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  fetchCandyMachine,
  fetchCandyGuard,
} from '@metaplex-foundation/mpl-candy-machine'

const candyMachine = await fetchCandyMachine(umi, publicKey('...'))
const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority)
```

API 参考：[fetchCandyMachine](https://mpl-candy-machine.typedoc.metaplex.com/functions/fetchCandyMachine.html)、[fetchCandyGuard](https://mpl-candy-machine.typedoc.metaplex.com/functions/fetchCandyGuard.html)。

{% /dialect %}
{% /dialect-switcher %}

## 更新权限

创建 Candy Machine 后，只要您是 Candy Machine 的权限者，就可以稍后更新其大部分设置。在接下来的几节中，我们将看到如何更新这些设置，但首先，让我们看看如何更新 Candy Machine 的 **Authority（权限）** 和 **Mint Authority（铸造权限）**。

- 要更新权限，您需要将当前权限作为签名者传递，以及新权限的地址。
- 要更新铸造权限，您需要将当前权限和新铸造权限都作为签名者传递。这是因为铸造权限主要用于将 Candy Guard 与 Candy Machine 关联。使铸造权限成为签名者可以防止任何人使用其他人的 Candy Guard，因为这可能会对原始 Candy Machine 产生副作用。

{% dialect-switcher title="更新 Candy Machine 的权限" %}
{% dialect title="JavaScript" id="js" %}

以下是如何使用 Umi 库更新 Candy Machine 的权限。请注意，在大多数情况下，您还需要更新关联的 Candy Guard 账户的权限。

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import {
  setCandyMachineAuthority,
  setCandyGuardAuthority,
} from '@metaplex-foundation/mpl-candy-machine'

const newAuthority = generateSigner(umi)
await setCandyMachineAuthority(umi, {
  candyMachine: candyMachine.publicKey,
  authority: currentAuthority,
  newAuthority: newAuthority.publicKey,
})
  .add(
    setCandyGuardAuthority(umi, {
      candyGuard: candyMachine.mintAuthority,
      authority: currentAuthority,
      newAuthority: newAuthority.publicKey,
    })
  )
  .sendAndConfirm(umi)
```

虽然您可能永远不想直接更新 `mintAuthority`，因为它会覆盖关联的 Candy Guard 账户，但以下是操作方法。

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { setMintAuthority } from '@metaplex-foundation/mpl-candy-machine'

const newMintAuthority = generateSigner(umi)
await setMintAuthority(umi, {
  candyMachine: candyMachine.publicKey,
  authority: currentAuthority,
  mintAuthority: newMintAuthority,
}).sendAndConfirm(umi)
```

API 参考：[setCandyMachineAuthority](https://mpl-candy-machine.typedoc.metaplex.com/functions/setCandyMachineAuthority.html)、[setCandyGuardAuthority](https://mpl-candy-machine.typedoc.metaplex.com/functions/setCandyGuardAuthority.html)、[setMintAuthority](https://mpl-candy-machine.typedoc.metaplex.com/functions/setMintAuthority.html)。

{% /dialect %}
{% /dialect-switcher %}

## 更新共享 NFT 数据

您还可以更新 Candy Machine 所有铸造 NFT 之间共享的属性。如[上一页](/zh/candy-machine/settings#settings-shared-by-all-nf-ts)所述，这些是：Seller Fee Basis Points（卖家费用基点）、Symbol（符号）、Max Edition Supply（最大版本供应量）、Is Mutable（是否可变）和 Creators（创作者）。

请注意，一旦第一个 NFT 被铸造，这些属性将不再可更新。

{% dialect-switcher title="更新 Candy Machine 的 NFT 数据" %}
{% dialect title="JavaScript" id="js" %}

以下是更新 Candy Machine 上一些共享 NFT 数据的示例。

```tsx
import { percentAmount } from '@metaplex-foundation/umi'
import {
  updateCandyMachine,
  fetchCandyMachine,
} from '@metaplex-foundation/mpl-candy-machine'

const candyMachine = await fetchCandyMachine(umi, candyMachineAddress)
await updateCandyMachine(umi, {
  candyMachine: candyMachine.publicKey,
  data: {
    ...candyMachine.data,
    symbol: 'NEW',
    sellerFeeBasisPoints: percentAmount(5.5, 2),
    creators: [{ address: newCreator, verified: false, percentageShare: 100 }],
  },
}).sendAndConfirm(umi)
```

API 参考：[updateCandyMachine](https://mpl-candy-machine.typedoc.metaplex.com/functions/updateCandyMachine.html)。

{% /dialect %}
{% /dialect-switcher %}

## 更新代币标准

代币标准和规则集属性也可以使用"Set Token Standard"指令在 Candy Machine 上更新。这允许我们在常规 NFT 和可编程 NFT 之间切换，反之亦然。切换到可编程 NFT 时，我们可以选择性地指定或更新铸造的 NFT 应遵守的规则集。

请注意，如果您的 candy machine 使用的是旧账户版本，此指令还将自动将其升级到支持可编程 NFT 和常规 NFT 的最新账户版本。升级后，您需要使用最新的指令从 candy machine 或 candy guard 铸造。

{% dialect-switcher title="更新 Candy Machine 的代币标准" %}
{% dialect title="JavaScript" id="js" %}

以下是使用 Umi 更新 Candy Machine 上代币标准和规则集的示例。

```ts
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'
import { setTokenStandard } from '@metaplex-foundation/mpl-candy-machine'

await setTokenStandard(umi, {
  candyMachine: candyMachine.publicKey,
  collectionMint: candyMachine.collectionMint,
  collectionUpdateAuthority,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
  ruleSet: newRuleSetAccount,
}).sendAndConfirm(umi)
```

请注意，如果您的 candy machine 使用账户版本 `V1`，您需要显式设置 `collectionAuthorityRecord` 账户，因为它使用旧版集合委托权限记录账户。

```ts
import { findCollectionAuthorityRecordPda } from '@metaplex-foundation/mpl-token-metadata'
import { findCandyMachineAuthorityPda } from '@metaplex-foundation/mpl-candy-machine'

await setTokenStandard(umi, {
  // ...
  collectionAuthorityRecord: findCollectionAuthorityRecordPda(umi, {
    mint: candyMachine.collectionMint,
    collectionAuthority: findCandyMachineAuthorityPda(umi, {
      candyMachine: candyMachine.publicKey,
    }),
  }),
}).sendAndConfirm(umi)
```

API 参考：[setTokenStandard](https://mpl-candy-machine.typedoc.metaplex.com/functions/setTokenStandard.html)。

{% /dialect %}
{% /dialect-switcher %}

## 更新集合

更改与 Candy Machine 关联的 Collection NFT 也是可能的。您需要提供 Collection NFT 的铸币账户地址以及其更新权限作为签名者来批准此更改。

请注意，这里也是一样，一旦第一个 NFT 被铸造，集合就不能再更改了。

{% dialect-switcher title="更新 Candy Machine 的集合" %}
{% dialect title="JavaScript" id="js" %}

要使用 Umi 库更新 Candy Machine 的 Collection NFT，您可以使用 `setCollectionV2` 方法，如下所示。

```ts
await setCollectionV2(umi, {
  candyMachine: candyMachine.publicKey,
  collectionMint: candyMachine.collectionMint,
  collectionUpdateAuthority: collectionUpdateAuthority.publicKey,
  newCollectionMint: newCollectionMint.publicKey,
  newCollectionUpdateAuthority,
}).sendAndConfirm(umi)
```

请注意，如果您的 candy machine 使用账户版本 `V1`，您需要显式设置 `collectionDelegateRecord` 账户，因为它使用旧版集合委托权限记录账户。

```ts
import { findCollectionAuthorityRecordPda } from '@metaplex-foundation/mpl-token-metadata'
import { findCandyMachineAuthorityPda } from '@metaplex-foundation/mpl-candy-machine'

await setCollectionV2(umi, {
  // ...
  collectionDelegateRecord: findCollectionAuthorityRecordPda(umi, {
    mint: candyMachine.collectionMint,
    collectionAuthority: findCandyMachineAuthorityPda(umi, {
      candyMachine: candyMachine.publicKey,
    }),
  }),
}).sendAndConfirm(umi)
```

API 参考：[setCollectionV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/setCollectionV2.html)。

{% /dialect %}
{% /dialect-switcher %}

## 更新项目设置

Candy Machine 的项目设置也可以更新，但有一些限制。

- 项目设置不能更新到在 **Config Line Settings** 和 **Hidden Settings** 之间切换。但是，如果我们不切换模式，这些设置内部的属性可以更新。
- 使用 **Config Line Settings** 时：
  - **Items Available** 属性无法更新。
  - **Name Length** 和 **URI Length** 属性只能更新为更小的值，因为程序在更新期间不会调整 Candy Machine 账户的大小。
- 一旦第一个 NFT 被铸造，这些设置将不再可更新。

{% dialect-switcher title="更新 Candy Machine 的项目设置" %}
{% dialect title="JavaScript" id="js" %}

以下示例展示了如何使用 Umi 库更新 Candy Machine 的 Config Line Settings。同样可以用于 Hidden Settings 和 Items Available 属性（使用 Hidden Settings 时）。

```ts
import {
  updateCandyMachine,
  fetchCandyMachine,
} from '@metaplex-foundation/mpl-candy-machine'

const candyMachine = await fetchCandyMachine(umi, candyMachineAddress)
await updateCandyMachine(umi, {
  candyMachine: candyMachine.publicKey,
  data: {
    ...candyMachine.data,
    hiddenSettings: none(),
    configLineSettings: some({
      type: 'configLines',
      prefixName: 'My New NFT #$ID+1$',
      nameLength: 0,
      prefixUri: 'https://arweave.net/',
      uriLength: 43,
      isSequential: true,
    }),
  },
}).sendAndConfirm(umi)
```

API 参考：[updateCandyMachine](https://mpl-candy-machine.typedoc.metaplex.com/functions/updateCandyMachine.html)。

{% /dialect %}
{% /dialect-switcher %}

## 删除 Candy Machine

一旦 Candy Machine 完全铸造完成，它就完成了使命，可以安全地处理掉。这允许其创建者收回 Candy Machine 账户的存储成本，以及（可选的）Candy Guard 账户的成本。

{% dialect-switcher title="删除 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

您可以使用 Umi 库删除 Candy Machine 账户和/或其关联的 Candy Guard 账户，如下所示。

```ts
import {
  deleteCandyMachine,
  deleteCandyGuard,
} from '@metaplex-foundation/mpl-candy-machine'

await deleteCandyMachine(umi, {
  candyMachine: candyMachine.publicKey,
}).sendAndConfirm(umi)

await deleteCandyGuard(umi, {
  candyGuard: candyMachine.mintAuthority,
}).sendAndConfirm(umi)
```

API 参考：[deleteCandyMachine](https://mpl-candy-machine.typedoc.metaplex.com/functions/deleteCandyMachine.html)、[deleteCandyGuard](https://mpl-candy-machine.typedoc.metaplex.com/functions/deleteCandyGuard.html)。

{% /dialect %}
{% /dialect-switcher %}

## 结论

我们现在可以创建、读取、更新和删除 Candy Machine，但我们仍然不知道如何向它们加载项目。让我们在[下一页](/zh/candy-machine/insert-items)中解决这个问题！
