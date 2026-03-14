---
title: 创建 Core Candy Machine
metaTitle: 创建 Core Candy Machine | Core Candy Machine
description: 在 Solana 上创建 Core Candy Machine 的分步教程，包括使用 mpl-core-candy-machine SDK 配置 Config Line Settings、Hidden Settings 和守卫。
keywords:
  - core candy machine
  - create candy machine
  - mpl-core-candy-machine
  - candy machine settings
  - config line settings
  - hidden settings
  - candy machine guards
  - solana NFT minting
  - metaplex core
  - NFT collection launch
  - candy machine reveal
  - solana NFT distribution
about:
  - Creating and configuring a Core Candy Machine for NFT distribution
  - Core Candy Machine item settings including Config Line and Hidden Settings
  - Applying guards to a Core Candy Machine during creation
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
howToSteps:
  - 准备资产和用于 Candy Machine 的 Core Collection
  - 使用 Candy Machine 签名者、collection 和 itemsAvailable 调用 create 指令
  - 可选配置 Config Line Settings 或 Hidden Settings 进行资产数据存储
  - 可选附加守卫以控制铸造访问和支付
howToTools:
  - '@metaplex-foundation/mpl-core-candy-machine'
  - '@metaplex-foundation/umi'
faqs:
  - q: Config Line Settings 和 Hidden Settings 有什么区别？
    a: Config Line Settings 使用前缀压缩在链上单独存储资产名称和 URI，以减少租金成本。Hidden Settings 向所有买家铸造相同的占位资产，支持在后续日期进行揭示。每个 Candy Machine 只能使用其中一个——它们是互斥的。
  - q: 创建一个 Core Candy Machine 需要多少费用？
    a: 租金成本取决于物品数量和存储模式。使用带前缀的 Config Line Settings 可以显著降低租金，因为重复的名称和 URI 前缀只存储一次。Hidden Settings 是最便宜的选项，因为无论集合大小如何，只存储一个名称、URI 和哈希值。
  - q: 创建 Core Candy Machine 后可以添加守卫吗？
    a: 可以。您可以随时创建 Candy Guard 账户并将其设置为现有 Core Candy Machine 的铸造权限。也可以在创建时直接传递守卫以方便操作。
  - q: 创建 Candy Machine 前是否需要现有的 Core Collection？
    a: 是的。Core Candy Machine 在创建时需要一个 Core Collection 地址。集合更新权限必须签署交易，以便 Candy Machine 可以被批准为将铸造资产验证到集合中的委托。
  - q: 在 Config Line Settings 中将 isSequential 设置为 false 会怎样？
    a: Candy Machine 将以伪随机顺序而非顺序铸造资产。请注意，这种随机性不是密码学安全的，可以通过足够的资源影响。当不可预测性至关重要时，Hidden Settings 可能更可取。
---

## 概要

`create` 指令在 Solana 上初始化一个新的 [Core](/zh/smart-contracts/core) Candy Machine 账户，将其链接到 Core Collection 并定义资产如何存储和分发。{% .lead %}

- **核心指令**：`@metaplex-foundation/mpl-core-candy-machine` 中的 `create` 部署新的 Candy Machine 账户
- **存储模式**：选择 [Config Line Settings](#config-line-settings-字段) 进行前缀压缩的单独资产数据，或 [Hidden Settings](#hidden-settings-字段) 用于单次揭示占位符
- **守卫支持**：在创建时附加[守卫](/zh/smart-contracts/core-candy-machine/guards)以控制铸造访问、支付和调度
- **前提条件**：在创建 Candy Machine 之前必须存在 [Core Collection](/zh/smart-contracts/core/collections#creating-a-collection)

**跳转至：** [前提条件](#前提条件) · [创建 Candy Machine](#创建-candy-machine) · [创建 Candy Machine 参数](#创建-candy-machine-参数) · [Config Line Settings](#config-line-settings-字段) · [Hidden Settings](#hidden-settings-字段) · [使用守卫创建](#使用守卫创建-core-candy-machine) · [注意事项](#注意事项) · [常见问题](#常见问题)


## 前提条件

- [准备资产](/zh/smart-contracts/core-candy-machine/preparing-assets)
- [创建 Core Collection](/zh/smart-contracts/core/collections#creating-a-collection)

如果您希望将 Core Candy Machine 资产创建到一个 collection（新的或现有的），您需要在创建 Core Candy Machine 时提供 Core Collection。

## 创建 Candy Machine

`create` 函数部署一个新的 Core Candy Machine 账户，将其分配给一个 [Core](/zh/smart-contracts/core) Collection，并设置可供铸造的物品总数。

{% callout title="CLI 替代方案" type="note" %}
您也可以使用带有交互式向导的 MPLX CLI 创建 Core Candy Machine：
```bash
mplx cm create --wizard
```
这提供了逐步指导、资产验证和自动部署。有关详细说明，请参阅 [CLI Candy Machine 文档](/zh/dev-tools/cli/cm)。
{% /callout %}

{% dialect-switcher title="创建 Core Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

```ts
// 创建 Candy Machine。
import { create } from '@metaplex-foundation/mpl-core-candy-machine'
import { generateSigner } from '@metaplex-foundation/umi'

const candyMachine = generateSigner(umi)

const createIx = await create(umi, {
  candyMachine,
  collection: collectionMint.publicKey,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 1000,
  authority: umi.identity.publicKey,
})

await createIx.sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

### 创建 Candy Machine 参数

`create` 函数接受以下参数来在部署时配置 Core Candy Machine。

一个新生成的密钥对/签名者，用于创建 Core Candy Machine。

{% dialect-switcher title="Create CandyMachine Args" %}
{% dialect title="JavaScript" id="js" %}

| 名称                      | 类型                          |
| ------------------------- | ----------------------------- |
| candyMachine              | signer                        |
| authorityPda (可选)       | publicKey                     |
| authority (可选)          | publicKey                     |
| payer (可选)              | signer                        |
| collection                | publicKey                     |
| collectionUpdateAuthority | signer                        |
| itemsAvailable            | number                        |
| isMutable                 | boolean                       |
| configLineSettings        | [详见Config Line Settings](#config-line-settings-字段) |
| hiddenSettings            | [详见Hidden Settings](#hidden-settings-字段)      |

{% /dialect %}
{% dialect title="Rust" id="rust" %}

| 名称                      | 类型                          |
| ------------------------- | ----------------------------- |
| candyMachine              | signer                        |
| authorityPda (可选)       | pubkey                        |
| authority (可选)          | pubkey                        |
| payer (可选)              | signer                        |
| collection                | pubkey                        |
| collectionUpdateAuthority | signer                        |
| itemsAvailable            | number                        |
| isMutable                 | boolean                       |
| configLineSettings        | [详见Config Line Settings](#config-line-settings-字段) |
| hiddenSettings            | [详见Hidden Settings](#hidden-settings-字段)      |

{% /dialect %}
{% /dialect-switcher %}

### authorityPda 字段

`authorityPda` 是用于验证铸造资产到集合的 PDA。此字段是可选的，省略时将根据默认种子自动计算。

{% dialect-switcher title="Authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
authorityPda: string
```

{% /dialect %}
{% /dialect-switcher %}

### authority 字段

`authority` 是将对 Core Candy Machine 拥有管理控制权的钱包或公钥，包括更新设置和管理[守卫](/zh/smart-contracts/core-candy-machine/guards)的能力。

{% dialect-switcher title="authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
authority: string
```

{% /dialect %}
{% /dialect-switcher %}

### payer 字段

`payer` 是支付交易和租金成本的钱包。省略时默认为当前签名者。

{% dialect-switcher title="authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
payer: publicKey
```

{% /dialect %}
{% /dialect-switcher %}

### collection 字段

`collection` 是 Candy Machine 将向其铸造资产的 [Core Collection](/zh/smart-contracts/core/collections#creating-a-collection) 的公钥。

{% dialect-switcher title="authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
collection: publicKey
```

{% /dialect %}
{% /dialect-switcher %}

### collectionUpdateAuthority 字段

`collectionUpdateAuthority` 是集合的更新权限。这必须是签名者，以便 Candy Machine 可以批准委托来验证创建的资产到 Collection。

{% dialect-switcher title="authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
collectionUpdateAuthority: signer
```

{% /dialect %}
{% /dialect-switcher %}

<!-- ### Seller Fee Basis Points

{% dialect-switcher title="sellerFeeBasisPoints" %}
{% dialect title="JavaScript" id="js" %}

```ts
sellerFeeBasisPoints: number
```

{% /dialect %}
{% /dialect-switcher %}

The `sellerFeeBasisPoints` fields is the royalty basis points that will be written to each created Asset from the Candy Machine.
This is designated as a number based on 2 decimal places, so `500` basis points is equal to `5%`.

There is also a `percentageAmount` helper than can also be used for calculation that can be imported from the `umi` library.

{% dialect-switcher title="percentageAmount" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { percentAmount } from '@metaplex-foundation/umi'

sellerFeeBasisPoints: percentageAmount(5)
```

{% /dialect %}
{% /dialect-switcher %} -->

### itemsAvailable 字段

`itemsAvailable` 字段指定可以从 Core Candy Machine 铸造的资产总数。此值在创建时设置，决定了 Candy Machine 账户的大小。

{% dialect-switcher title="itemsAvailable" %}
{% dialect title="JavaScript" id="js" %}

```ts
itemsAvailable: number
```

{% /dialect %}
{% /dialect-switcher %}

### isMutable 字段

`isMutable` 字段是一个布尔值，确定铸造后的资产是否可以更新。设置为 `false` 时，资产元数据在铸造时永久锁定。

{% dialect-switcher title="isMutable" %}
{% dialect title="JavaScript" id="js" %}

```ts
isMutable: boolean
```

{% /dialect %}
{% /dialect-switcher %}

### Config Line Settings 字段

Config Line Settings 使用前缀压缩在链上存储单独的资产名称和 URI，与为每个资产存储完整字符串相比，显著降低了 Candy Machine 的租金成本。

{% callout type="note" title="随机性" %}

Config Line Settings 和 [Hidden Settings](#hidden-settings-字段) 是互斥的。一次只能使用一个。

建议使用 Hidden Settings 进行揭示机制，因为资产的"随机"铸造过程并不完全不可预测，可以通过足够的资源和恶意意图来影响。

{% /callout %}

通过将资产名称和 URI 前缀存储到 Core Candy Machine 中，所需存储的数据显著减少，因为您不会为每个资产存储相同的名称和 URI。

例如，如果您所有的资产都有相同的命名结构，从 `Example Asset #1` 到 `Example Asset #1000`，这通常需要您存储字符串 `Example Asset #` 1000 次，占用 15,000 字节。

通过将名称前缀存储在 Core Candy Machine 中并让 Core Candy Machine 将创建的索引号附加到字符串后，您可以节省这 15,000 字节的租金成本。

这也适用于 URI 前缀。

{% dialect-switcher title="ConfigLineSettings Object" %}
{% dialect title="JavaScript" id="js" %}

```ts
ConfigLineSettings = {
    prefixName: string;
    nameLength: number;
    prefixUri: string;
    uriLength: number;
    isSequential: boolean;
}
```

{% /dialect %}
{% /dialect-switcher %}

#### prefixName 字段

`prefixName` 存储资产的名称前缀，并在铸造时将铸造索引附加到名称末尾。

如果您的资产有 `Example Asset #1` 的命名结构，那么您的前缀将是 `Example Asset #`。铸造时，Core Candy Machine 将把索引附加到字符串末尾。

#### nameLength 字段

`nameLength` 是每个插入项目名称的最大长度，不包括名称前缀。

例如给定...
- 一个包含 `1000` 个项目的 candy machine。
- 每个项目的名称是 `Example Asset #X`，其中 X 是从 1 开始的项目索引。

... 将导致需要存储 19 个字符。15 个字符用于 "My NFT Project #"，4 个字符用于最高数字 "1000"。使用 `prefixName` 时，`nameLength` 可以减少到 4。

#### prefixUri 字段

`prefixUri` 是您元数据的基础 URI，不包括变量标识 ID。

如果您的资产将有 `https://example.com/metadata/0.json` 的元数据 URI，那么您的基础元数据 URI 将是 `https://example.com/metadata/`。

#### uriLength 字段

`uriLength` 是您的 URI 的最大长度，不包括 `prefixUri`。

例如给定...
- 一个基础 URI `https://arweave.net/`，有 20 个字符。
- 和一个最大长度为 43 个字符的唯一标识符

... 不使用前缀将需要 63 个字符来存储。使用 `prefixUri` 时，`uriLength` 可以减少 `https://arweave.net/` 的 20 个字符到唯一标识符的 43 个字符。

#### isSequential 字段

`isSequential` 字段指示资产是按顺序还是伪随机铸造。设置为 `false` 时，Candy Machine 以伪随机顺序铸造。[Hidden Settings](#hidden-settings-字段) 无论此字段如何始终按顺序铸造。

#### Config Line Settings 示例

以下是创建应用了 `configLineSettings` 的 Core Candy Machine 的示例：

{% dialect-switcher title="使用 configLineSettings 创建 Core Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { create } from '@metaplex-foundation/mpl-core-candy-machine'

const candyMachine = generateSigner(umi)

const coreCollection = publicKey('11111111111111111111111111111111')

const createIx = await create(umi, {
  candyMachine,
  collection: coreCollection,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 5000,
  configLineSettings: some({
    prefixName: 'Example Asset #',
    nameLength: 15,
    prefixUri: 'https://example.com/metadata/',
    uriLength: 29,
    isSequential: false,
  }),
})

await createIx.sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

### Hidden Settings 字段

Hidden Settings 配置 Core Candy Machine 向所有买家铸造相同的占位资产，支持流行的"揭示"机制，在后续日期分配最终元数据。当与 Edition Guard 结合使用时，它还支持打印 [Core](/zh/smart-contracts/core) Editions。

{% callout type="note" %}
[Config Line Settings](#config-line-settings-字段) 和 Hidden Settings 是互斥的。创建 Candy Machine 时必须选择其中一个。
{% /callout %}

{% dialect-switcher title="Hidden Settings" %}
{% dialect title="JavaScript" id="js" %}

```ts
hiddenSettings = {
  name: string,
  uri: string,
  hash: Uint8Array,
}
```

{% /dialect %}
{% /dialect-switcher %}

#### Hidden Settings name 字段

`name` 是启用 Hidden Settings 时所有铸造资产上显示的名称。注意，就像 Config Line Settings 的前缀一样，Hidden Settings 的 Name 和 URI 可以使用特殊变量。提醒一下，这些变量是：

- `$ID$`：这将被替换为从 0 开始的铸造资产的索引。
- `$ID+1$`：这将被替换为从 1 开始的铸造资产的索引。

您应该使用它来能够将您想要的资产与揭示的数据匹配。

#### Hidden Settings uri 字段

`uri` 是启用 Hidden Settings 时所有铸造资产上显示的元数据 URI。通常指向一个共享的占位 JSON 文件。

#### Hidden Settings hash 字段

`hash` 存储揭示数据的加密哈希/校验和，允许任何人验证最终揭示的元数据是否与最初提交的顺序匹配。这防止了篡改行为，如在铸造后将稀有资产重新分配给特定持有者。

{% dialect-switcher title="哈希揭示数据" %}
{% dialect title="JavaScript" id="js" %}

```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```

{% /dialect %}
{% /dialect-switcher %}

#### Hidden Settings 创建示例

{% dialect-switcher title="创建带有 Hidden Settings 的 Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { create } from '@metaplex-foundation/mpl-core-candy-machine'
import crypto from "crypto";

const candyMachine = generateSigner(umi)

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

const createIx = await create(umi, {
  candyMachine,
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
  sellerFeeBasisPoints: percentAmount(10),
  itemsAvailable: 5000,
  hiddenSettings: {
    name: "Hidden Asset",
    uri: "https://example.com/hidden-asset.json",
    hash,
  }
})

await createIx.sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 使用守卫创建 Core Candy Machine

`create` 函数接受一个 `guards` 字段，可以在创建时直接附加[守卫](/zh/smart-contracts/core-candy-machine/guards)规则，控制谁可以铸造、何时铸造以及费用多少。

到目前为止，我们创建的 Core Candy Machine 没有启用任何守卫。现在我们知道了所有可用的守卫，让我们看看如何设置启用了一些守卫的新 Candy Machine。

具体实现将取决于您使用的 SDK（见下文），但主要思想是通过提供所需的设置来启用守卫。任何未设置的守卫将被禁用。

{% dialect-switcher title="创建带有守卫的 Core Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

<!-- To enable guards using the Umi library, simply provides the `guards` attribute to the `create` function and pass in the settings of every guard you want to enable. Any guard set to `none()` or not provided will be disabled. -->

```ts
import { some, sol, dateTime } from '@metaplex-foundation/umi'

const createIx = await create(umi, {
  // ...
  guards: {
    botTax: some({ lamports: sol(0.01), lastInstruction: true }),
    solPayment: some({ lamports: sol(1.5), destination: treasury }),
    startDate: some({ date: dateTime('2023-04-04T16:00:00Z') }),
    // 所有其他守卫被禁用...
  },
})

await createIx.sendAndConfirm(umi)
```

API 参考: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [DefaultGuardSetArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 注意事项

- **Config Line Settings 和 Hidden Settings 是互斥的。** 您必须选择其中一个。同时传递两者到 `create` 指令将导致错误。
- **租金成本随物品数量和存储模式变化。** 使用短前缀的 Config Line Settings 比存储完整名称和 URI 更便宜。Hidden Settings 是最便宜的选项，因为只存储一个名称、URI 和哈希值。
- **集合更新权限必须是签名者。** Candy Machine 需要集合更新权限签署创建交易，以便其被批准为集合上的验证委托。
- **伪随机铸造顺序不是密码学安全的。** 当 Config Line Settings 中的 `isSequential` 设置为 `false` 时，铸造顺序会被打乱，但可以通过足够的资源预测或影响。当不可预测性重要时，请使用 Hidden Settings 配合揭示机制。
- **本页面介绍的是 Core Candy Machine，而非传统 Candy Machine V3。** Core Candy Machine 铸造 [Core](/zh/smart-contracts/core) 资产。要铸造 Metaplex Token Metadata NFT，请参阅 [Candy Machine V3](/zh/smart-contracts/candy-machine)。

## 常见问题

### Config Line Settings 和 Hidden Settings 有什么区别？

[Config Line Settings](#config-line-settings-字段) 使用前缀压缩在链上单独存储资产名称和 URI 以减少租金。[Hidden Settings](#hidden-settings-字段) 向所有买家铸造相同的占位资产，支持在后续日期进行揭示。每个 Candy Machine 只能使用一个，因为它们是互斥的。

### 创建一个 Core Candy Machine 需要多少费用？

租金成本取决于物品数量和所选的存储模式。使用短前缀的 Config Line Settings 可以显著降低租金，因为重复的前缀只存储一次。Hidden Settings 是最便宜的，因为无论 Candy Machine 包含多少物品，只存储一个名称、URI 和 SHA-256 哈希值。

### 创建 Core Candy Machine 后可以添加守卫吗？

可以。您可以随时创建单独的 Candy Guard 账户并将其设置为现有 Core Candy Machine 的铸造权限。或者，您可以在 `create` 指令中直接传递[守卫](/zh/smart-contracts/core-candy-machine/guards)以方便操作。

### 创建 Candy Machine 前是否需要现有的 Core Collection？

是的。`create` 指令需要一个 [Core Collection](/zh/smart-contracts/core/collections#creating-a-collection) 地址。集合更新权限必须签署交易，以便 Candy Machine 可以注册为将铸造资产添加到集合的验证委托。

### 在 Config Line Settings 中将 isSequential 设置为 false 会怎样？

Candy Machine 将以伪随机顺序而非索引顺序铸造资产。这种随机性不是密码学安全的，可以通过足够的资源影响。当不可预测性至关重要时，请优先使用 [Hidden Settings](#hidden-settings-字段) 配合揭示机制。
