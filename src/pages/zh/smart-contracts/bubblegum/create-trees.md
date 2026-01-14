---
title: 创建Bubblegum树
metaTitle: 创建Bubblegum树 | Bubblegum
description: 了解如何创建和获取可以存放压缩NFT的新默克尔树。
---

## 介绍

虽然压缩NFT的数据存储在交易中而不是链上账户中，但我们仍然需要一些链上账户来跟踪默克尔树及其配置。因此，在开始铸造压缩NFT之前，我们需要创建两个账户：

- **默克尔树账户**。此账户持有一个通用的默克尔树，可用于验证任何类型数据的真实性。它由Solana创建和维护的[账户压缩程序](https://spl.solana.com/account-compression)拥有。在我们的案例中，我们将使用它来验证压缩NFT的真实性。
- **树配置账户**。第二个账户是从默克尔树账户地址派生的PDA。它允许我们为默克尔树存储特定于压缩NFT的额外配置——例如，树创建者、铸造的cNFT数量等。

有了这两个账户，我们就拥有开始铸造压缩NFT所需的一切。请注意，我们将具有关联树配置账户的默克尔树账户称为**Bubblegum树**。

{% diagram height="h-64 md:h-[200px]" %}

{% node %}
{% node #merkle-tree label="默克尔树账户" theme="blue" /%}
{% node label="所有者：账户压缩程序" theme="dimmed" /%}
{% /node %}

{% node #tree-config-pda parent="merkle-tree" x="300" label="PDA" theme="crimson" /%}

{% node parent="tree-config-pda" y="60" %}
{% node #tree-config label="树配置账户" theme="crimson" /%}
{% node label="所有者：Bubblegum程序" theme="dimmed" /%}
{% /node %}

{% edge from="merkle-tree" to="tree-config-pda" /%}
{% edge from="tree-config-pda" to="tree-config" /%}

{% /diagram %}

## 创建Bubblegum树

现在让我们看看如何创建这两个账户来创建Bubblegum树。幸运的是，我们的库通过提供**创建树**操作使这个过程变得简单，它会为我们处理一切。此操作接受各种参数——大多数是可选的——允许我们根据需要自定义Bubblegum树。最重要的参数是：

- **默克尔树**：一个新生成的签名者，将用于创建默克尔树账户。然后可以在此地址访问默克尔树账户。
- **树创建者**：将能够管理Bubblegum树并铸造压缩NFT的账户地址。
- **最大深度**和**最大缓冲区大小**：**最大深度**参数用于计算默克尔树可以容纳的最大叶子数（因此也是压缩NFT的最大数量）。此最大值通过`2^maxDepth`计算。**最大缓冲区大小**参数表示默克尔树的最小并发限制。换句话说，它定义了树中可以并行发生多少更改。这两个参数不能任意选择，必须从下表中显示的预定义值集中选择。

以下是我们推荐的树设置，以便在Solana生态系统中兼容。

| cNFT数量 | 树深度 | 树冠深度 | 并发缓冲区 | 树成本 | 每个cNFT成本 |
| --------------- | ---------- | ------------ | ------------------ | --------- | ------------- |
| 16,384          | 14         | 8            | 64                 | 0.3358    | 0.00002550    |
| 65,536          | 16         | 10           | 64                 | 0.7069    | 0.00001579    |
| 262,144         | 18         | 12           | 64                 | 2.1042    | 0.00001303    |
| 1,048,576       | 20         | 13           | 1024               | 8.5012    | 0.00001311    |
| 16,777,216      | 24         | 15           | 2048               | 26.1201   | 0.00000656    |
| 67,108,864      | 26         | 17           | 2048               | 70.8213   | 0.00000606    |
| 1,073,741,824   | 30         | 17           | 2048               | 72.6468   | 0.00000507    |

树的最大深度如下。

  {% totem %}
  {% totem-accordion title="最大深度/最大缓冲区大小表" %}

  | 最大深度 | 最大缓冲区大小 | cNFT最大数量 |
  | --------- | --------------- | ------------------- |
  | 3         | 8               | 8                   |
  | 5         | 8               | 32                  |
  | 14        | 64              | 16,384              |
  | 14        | 256             | 16,384              |
  | 14        | 1,024           | 16,384              |
  | 14        | 2,048           | 16,384              |
  | 15        | 64              | 32,768              |
  | 16        | 64              | 65,536              |
  | 17        | 64              | 131,072             |
  | 18        | 64              | 262,144             |
  | 19        | 64              | 524,288             |
  | 20        | 64              | 1,048,576           |
  | 20        | 256             | 1,048,576           |
  | 20        | 1,024           | 1,048,576           |
  | 20        | 2,048           | 1,048,576           |
  | 24        | 64              | 16,777,216          |
  | 24        | 256             | 16,777,216          |
  | 24        | 512             | 16,777,216          |
  | 24        | 1,024           | 16,777,216          |
  | 24        | 2,048           | 16,777,216          |
  | 26        | 512             | 67,108,864          |
  | 26        | 1,024           | 67,108,864          |
  | 26        | 2,048           | 67,108,864          |
  | 30        | 512             | 1,073,741,824       |
  | 30        | 1,024           | 1,073,741,824       |
  | 30        | 2,048           | 1,073,741,824       |

  {% /totem-accordion %}
  {% /totem %}

- **公开**：Bubblegum树是否应该公开。如果是公开的，任何人都可以从中铸造压缩NFT。否则，只有树创建者或树委托（如[委托cNFT](/zh/smart-contracts/bubblegum/delegate-cnfts)中讨论的）才能铸造压缩NFT。

以下是如何使用我们的库创建Bubblegum树：

{% dialect-switcher title="创建Bubblegum树" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createTree } from '@metaplex-foundation/mpl-bubblegum'

const merkleTree = generateSigner(umi)
const builder = await createTree(umi, {
  merkleTree,
  maxDepth: 14,
  maxBufferSize: 64,
})
await builder.sendAndConfirm(umi)
```

默认情况下，树创建者设置为Umi身份，公开参数设置为`false`。但是，可以自定义这些参数，如下例所示。

```ts
const customTreeCreator = generateSigner(umi)
const builder = await createTree(umi, {
  // ...
  treeCreator: customTreeCreator,
  public: true,
})
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 获取Bubblegum树

由于**Bubblegum树**由两个链上账户组成，让我们看看如何获取其中任何一个。

### 获取默克尔树

默克尔树账户包含有关树的各种信息，例如：

- **树头部**，存储**最大深度**、**最大缓冲区大小**、树的**权限**以及树创建时的**创建槽位**。
- **树**本身，存储有关树的低级信息，如其**变更日志**（或根）、**序列号**等。我们在本文档的[专门页面](/zh/smart-contracts/bubblegum-v2/concurrent-merkle-trees)中更多地讨论并发默克尔树。
- **树冠**，如[默克尔树树冠](/zh/smart-contracts/bubblegum-v2/concurrent-merkle-trees)页面中讨论的。

以下是如何使用我们的库获取所有这些数据：

{% dialect-switcher title="获取默克尔树" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchMerkleTree } from '@metaplex-foundation/mpl-bubblegum'

const merkleTreeAccount = await fetchMerkleTree(umi, merkleTree)
```

{% /dialect %}
{% /dialect-switcher %}

### 获取树配置

树配置账户包含特定于压缩NFT的数据。它存储：

- Bubblegum树的**树创建者**。
- Bubblegum树的**树委托**（如果有）。否则，设置为**树创建者**。
- Bubblegum树的**总容量**，即可以从树中铸造的cNFT的最大数量。
- **已铸造数量**，跟踪铸造到树中的cNFT数量。此值很重要，因为它用作操作的**随机数**（"仅使用一次的数字"）值，以确保默克尔树叶子是唯一的。因此，此随机数充当资产的树范围唯一标识符。
- **是否公开**参数，指示是否任何人都可以从树中铸造cNFT。

以下是如何使用我们的库获取所有这些数据：

{% dialect-switcher title="获取树配置" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchTreeConfigFromSeeds } from '@metaplex-foundation/mpl-bubblegum'

const treeConfig = await fetchTreeConfigFromSeeds(umi, { merkleTree })
```

{% /dialect %}
{% /dialect-switcher %}
