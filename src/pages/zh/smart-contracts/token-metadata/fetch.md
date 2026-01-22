---
title: 获取资产
metaTitle: 获取资产 | Token Metadata
description: 了解如何在 Token Metadata 上获取资产的各种链上账户
---

现在我们知道如何创建和铸造资产的各种链上账户，让我们学习如何获取它们。{% .lead %}

## 数字资产

如[上一页](/zh/smart-contracts/token-metadata/mint#creating-accounts)所述，一个资产——无论是否可替代——需要创建多个链上账户。根据资产的代币标准，某些账户可能不是必需的。以下是这些账户的快速概述：

- **铸造**账户（来自 SPL Token 程序）：它定义了底层 SPL 代币的核心属性。这是任何资产的入口点，因为所有其他账户都从它派生。
- **元数据**账户：它为底层 SPL 代币提供附加数据和功能。
- **主版**或**版本**账户（仅适用于非同质化代币）：它使原始 NFT 能够打印多个副本。即使 NFT 不允许打印版本，仍然会创建**主版**账户，因为它被用作**铸造**账户的铸造权限和冻结权限，以确保其非同质化性。

为了使获取资产更容易，我们的 SDK 提供了一组辅助方法，允许我们一次性获取资产的所有相关账户。我们称存储所有这些账户的数据类型为**数字资产**。在接下来的小节中，我们将介绍获取**数字资产**的各种方法。

{% dialect-switcher title="数字资产定义" %}
{% dialect title="Umi" id="umi" %}

```ts
import { PublicKey } from '@metaplex-foundation/umi'
import { Mint } from '@metaplex-foundation/mpl-toolbox'
import {
  Metadata,
  MasterEdition,
  Edition,
} from '@metaplex-foundation/mpl-token-metadata'

export type DigitalAsset = {
  publicKey: PublicKey
  mint: Mint
  metadata: Metadata
  edition?:
    | ({ isOriginal: true } & MasterEdition)
    | ({ isOriginal: false } & Edition)
}
```

{% /dialect %}

{% dialect title="Kit" id="kit" %}

```ts
import type { Address } from '@solana/addresses'
import type { Mint } from '@solana-program/token'
import type {
  Metadata,
  MasterEdition,
  Edition,
} from '@metaplex-foundation/mpl-token-metadata-kit'

export type DigitalAsset<TMint extends string = string> = {
  address: Address<TMint>
  mint: Mint
  metadata: Metadata
  edition?:
    | ({ isOriginal: true } & MasterEdition)
    | ({ isOriginal: false } & Edition)
}
```

{% /dialect %}
{% /dialect-switcher %}

### 按铸造获取

此辅助方法从其**铸造**账户的公钥获取单个**数字资产**。

{% code-tabs-imported from="token-metadata/fetch-asset" frameworks="umi,kit" /%}

### 按元数据获取

此辅助方法从其**元数据**账户的公钥获取单个**数字资产**。这比前一个辅助方法效率略低，因为我们首先需要获取**元数据**账户的内容来查找**铸造**地址，但如果您只能访问**元数据**公钥，这可能会有所帮助。

{% code-tabs-imported from="token-metadata/fetch-by-metadata" frameworks="umi,kit" /%}

### 按铸造列表获取所有

此辅助方法获取与提供列表中的**铸造**公钥一样多的**数字资产**。

{% code-tabs-imported from="token-metadata/fetch-all-by-mint-list" frameworks="umi,kit" /%}

### 按创作者获取所有

此辅助方法按创作者获取所有**数字资产**。由于创作者可以位于**元数据**账户中的五个不同位置，我们还必须提供我们感兴趣的创作者位置。例如，如果我们知道对于一组 NFT，第一个创作者是创作者 A，第二个创作者是 B，我们将希望在位置 1 中搜索创作者 A，在位置 2 中搜索创作者 B。

{% callout %}
此辅助方法需要 RPC 调用来过滤账户，在 Umi SDK 中可用。对于 Kit SDK，请考虑使用 DAS（数字资产标准）API 提供商进行高效查询。
{% /callout %}

{% code-tabs-imported from="token-metadata/fetch-all-by-creator" frameworks="umi" /%}

### 按所有者获取所有

此辅助方法按所有者获取所有**数字资产**。

{% callout %}
此辅助方法需要 RPC 调用来过滤账户，在 Umi SDK 中可用。对于 Kit SDK，请考虑使用 DAS（数字资产标准）API 提供商进行高效查询。
{% /callout %}

{% code-tabs-imported from="token-metadata/fetch-all-by-owner" frameworks="umi" /%}

### 按更新权限获取所有

此辅助方法从其更新权限的公钥获取所有**数字资产**。

{% callout %}
此辅助方法需要 RPC 调用来过滤账户，在 Umi SDK 中可用。对于 Kit SDK，请考虑使用 DAS（数字资产标准）API 提供商进行高效查询。
{% /callout %}

{% code-tabs-imported from="token-metadata/fetch-all-by-update-authority" frameworks="umi" /%}

## 带代币的数字资产

请注意，上述提到的**数字资产**数据结构不提供有关资产所有者的任何信息。第一个定义仅关注无论其所有者如何都需要的链上账户。但是，为了提供资产的更完整图景，我们可能还需要知道谁拥有它。这就是**带代币的数字资产**数据结构的用武之地。它是数字资产数据结构的扩展，还包括以下账户：

- **代币**账户（来自 SPL Token 程序）：它定义了**铸造**账户与其所有者之间的关系。它存储重要数据，例如所有者拥有的代币数量。在 NFT 的情况下，数量始终为 1。
- **代币记录**账户（仅适用于 PNFT）：它为[可编程非同质化代币](/zh/smart-contracts/token-metadata/pnfts)定义附加的代币相关信息，例如其当前的[代币委托](/zh/smart-contracts/token-metadata/delegates#token-delegates)及其角色。

请注意，对于可替代资产，同一个数字资产可能通过多个代币账户与多个所有者关联。因此，对于同一个数字资产，可以有多个带代币的数字资产。

在这里，我们还提供了一组辅助方法来获取带代币的数字资产。

{% dialect-switcher title="带代币的数字资产定义" %}
{% dialect title="Umi" id="umi" %}

```ts
import { Token } from '@metaplex-foundation/mpl-toolbox'
import {
  DigitalAsset,
  TokenRecord,
} from '@metaplex-foundation/mpl-token-metadata'

export type DigitalAssetWithToken = DigitalAsset & {
  token: Token
  tokenRecord?: TokenRecord
}
```

{% /dialect %}

{% dialect title="Kit" id="kit" %}

```ts
import type { Token } from '@solana-program/token'
import type {
  DigitalAsset,
  TokenRecord,
} from '@metaplex-foundation/mpl-token-metadata-kit'

export type DigitalAssetWithToken<TMint extends string = string> = DigitalAsset<TMint> & {
  token: Token
  tokenRecord?: TokenRecord
}
```

{% /dialect %}
{% /dialect-switcher %}

### 按铸造获取

此辅助方法从其**铸造**账户的公钥获取单个**带代币的数字资产**。这主要适用于非同质化资产，因为它只会返回一个带代币的数字资产，无论可替代资产存在多少个。

{% callout %}
Kit SDK 需要知道代币地址或所有者。如果您知道所有者，请使用下面的"按铸造和所有者获取"辅助方法。
{% /callout %}

{% code-tabs-imported from="token-metadata/fetch-with-token-by-mint" frameworks="umi" /%}

### 按铸造和所有者获取

此辅助方法比前一个辅助方法更高效，但要求我们知道资产的所有者。

{% code-tabs-imported from="token-metadata/fetch-with-token-by-owner" frameworks="umi,kit" /%}

### 按所有者获取所有

此辅助方法从给定所有者获取所有**带代币的数字资产**。

{% callout %}
此辅助方法需要 RPC 调用来过滤账户，在 Umi SDK 中可用。对于 Kit SDK，请考虑使用 DAS（数字资产标准）API 提供商进行高效查询。
{% /callout %}

{% code-tabs-imported from="token-metadata/fetch-all-with-token-by-owner" frameworks="umi" /%}

### 按铸造获取所有

此辅助方法从**铸造**账户的公钥获取所有**带代币的数字资产**。这对于可替代资产特别相关，因为它获取所有**代币**账户。

{% callout %}
此辅助方法需要 RPC 调用来过滤账户，在 Umi SDK 中可用。对于 Kit SDK，请考虑使用 DAS（数字资产标准）API 提供商进行高效查询。
{% /callout %}

{% code-tabs-imported from="token-metadata/fetch-all-with-token-by-mint" frameworks="umi" /%}

### 按所有者和铸造获取所有

此辅助方法从所有者和**铸造**账户获取所有**带代币的数字资产**。这对于为给定所有者拥有多个**代币**账户的可替代资产很有用。

{% callout %}
此辅助方法需要 RPC 调用来过滤账户，在 Umi SDK 中可用。对于 Kit SDK，请考虑使用 DAS（数字资产标准）API 提供商进行高效查询。
{% /callout %}

{% code-tabs-imported from="token-metadata/fetch-all-with-token-by-owner-and-mint" frameworks="umi" /%}
