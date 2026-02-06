---
title: 创建 Core Candy Machine
metaTitle: 创建 Core Candy Machine | Core Candy Machine
description: 学习如何在 Javascript 和 Rust 中创建 Core Candy Machine 及其各种设置。
---

## 前提条件

- [准备资产](/zh/smart-contracts/core-candy-machine/preparing-assets)
- [创建 Core Collection](/zh/smart-contracts/core/collections#creating-a-collection)

如果您希望将 Core Candy Machine 资产创建到一个 collection（新的或现有的），您需要在创建 Core Candy Machine 时提供 Core Collection。

## 创建 Candy Machine

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

### Args

可以传递给 createCandyMachine 函数的可用参数。

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
| configLineSettings        | [链接](#config-line-settings) |
| hiddenSettings            | [链接](#hidden-settings)      |

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
| configLineSettings        | [链接](#config-line-settings) |
| hiddenSettings            | [链接](#hidden-settings)      |

{% /dialect %}
{% /dialect-switcher %}

### authorityPda (可选)

{% dialect-switcher title="Authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
authorityPda: string
```

{% /dialect %}
{% /dialect-switcher %}

authorityPda 字段是用于验证铸造资产到 collection 的 PDA。这是可选的，如果留空则根据默认种子自动计算。

### authority (可选)

{% dialect-switcher title="authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
authority: string
```

{% /dialect %}
{% /dialect-switcher %}

### payer (可选)

支付交易和租金成本的钱包。默认为签名者。

{% dialect-switcher title="authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
payer: publicKey
```

{% /dialect %}
{% /dialect-switcher %}

authority 字段是将成为 Core Candy Machine 权限的钱包/公钥。

### Collection

Core Candy Machine 将在其中创建资产的 collection。

{% dialect-switcher title="authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
collection: publicKey
```

{% /dialect %}
{% /dialect-switcher %}

### Collection Update Authority

collection 的更新权限。这需要是一个签名者，以便 Candy Machine 可以批准一个委托来验证创建的资产到 Collection。

{% dialect-switcher title="authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
collectionUpdateAuthority: signer
```

{% /dialect %}
{% /dialect-switcher %}

### itemsAvailable

加载到 Core Candy Machine 中的项目数量。

{% dialect-switcher title="itemsAvailable" %}
{% dialect title="JavaScript" id="js" %}

```ts
itemsAvailable: number
```

{% /dialect %}
{% /dialect-switcher %}

### Is Mutable

一个布尔值，标记资产在创建时是可变的还是不可变的。

{% dialect-switcher title="isMutable" %}
{% dialect title="JavaScript" id="js" %}

```ts
isMutable: boolean
```

{% /dialect %}
{% /dialect-switcher %}

### Config Line Settings

{% callout type="note" title="随机性" %}

Config Line Settings 和 Hidden Settings 是互斥的。一次只能使用一个。

建议使用 Hidden Settings 进行揭示机制，因为资产的"随机"铸造过程并不完全不可预测，可以通过足够的资源和恶意意图来影响。

{% /callout %}

Config Line Settings 是一个可选字段，允许将资产数据添加到 Core Candy Machine 的高级选项，使 Core Candy Machine 的租金成本显著降低。

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

#### prefixName

这存储 NFT 的名称前缀，并在铸造时将铸造的索引附加到名称末尾。

如果您的资产有 `Example Asset #1` 的命名结构，那么您的前缀将是 `Example Asset #`。铸造时，Core Candy Machine 将把索引附加到字符串末尾。

#### nameLength

每个插入项目名称的最大长度，不包括名称前缀

例如给定...

- 一个包含 `1000` 个项目的 candy machine。
- 每个项目的名称是 `Example Asset #X`，其中 X 是从 1 开始的项目索引。

... 将导致需要存储 19 个字符。15 个字符用于 "My NFT Project #"，4 个字符用于最高数字 "1000"。使用 `prefixName` 时，`nameLength` 可以减少到 4。

#### prefixUri

您的元数据的基础 URI，不包括变量标识 ID。

如果您的资产将有 `https://example.com/metadata/0.json` 的元数据 URI，那么您的基础元数据 URI 将是 `https://example.com/metadata/`。

#### uriLength

您的 URI 的最大长度，不包括 `prefixUri`。

例如给定...

- 一个基础 URI `https://arweave.net/`，有 20 个字符。
- 和一个最大长度为 43 个字符的唯一标识符

... 不使用前缀将需要 63 个字符来存储。使用 `prefixUri` 时，`uriLength` 可以减少 `https://arweave.net/` 的 20 个字符到唯一标识符的 43 个字符。

#### isSequential

指示是否使用顺序索引生成器。如果为 false，Candy Machine 将随机铸造。HiddenSettings 将始终是顺序的。

#### configLineSettings

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

### Hidden Settings

Hidden settings 允许 Core Candy Machine 向所有购买者铸造完全相同的资产。其设计原则是允许流行的"揭示"机制在稍后的日期进行。当与 Edition Guard 结合使用时，它还允许打印 Core Editions。

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

#### name

启用 hidden settings 时所有铸造的资产上显示的名称。注意，就像 Config Line Settings 的前缀一样，Hidden Settings 的 Name 和 URI 可以使用特殊变量。提醒一下，这些变量是：

- `$ID$`：这将被替换为从 0 开始的铸造资产的索引。
- `$ID+1$`：这将被替换为从 1 开始的铸造资产的索引。

您应该使用它来能够将您想要的资产与揭示的数据匹配。

#### uri

启用 hidden settings 时所有铸造的资产上显示的 URI。

#### hash

哈希的目的是存储一段数据的加密哈希/校验和，用于验证每个更新/揭示的 NFT 是与 Candy Machine 铸造的索引匹配的正确 NFT。这允许用户检查验证，以及您是否更改了共享的数据，实际上 `Hidden NFT #39` 也是 `Revealed NFT #39`，并且原始数据没有被篡改以将稀有物移动给特定的人/持有者。

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

#### 使用 Hidden Settings 的 Core Candy Machine 示例

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

要创建带有 `Guards` 的 `Core Candy Machine`，您可以在创建期间提供 `guards:` 字段并提供您希望应用到 Candy Machine 的默认守卫。

到目前为止，我们创建的 Core Candy Machine 没有启用任何守卫。现在我们知道了所有可用的守卫，让我们看看如何设置启用了一些守卫的新 Candy Machine。

具体实现将取决于您使用的 SDK（见下文），但主要思想是通过提供所需的设置来启用守卫。任何未设置的守卫将被禁用。

{% dialect-switcher title="创建带有守卫的 Core Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

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
