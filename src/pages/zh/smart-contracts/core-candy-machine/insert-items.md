---
title: 将物品插入 Core Candy Machine
metaTitle: 插入物品 | Core Candy Machine
description: 了解如何将 config line 物品插入 Core Candy Machine，包括批量插入、前缀优化和覆盖先前加载的物品。
keywords:
  - core candy machine
  - insert items
  - config lines
  - addConfigLines
  - candy machine loading
  - NFT minting setup
  - batch insert
  - prefix name
  - prefix URI
  - candy machine items
  - mpl-core-candy-machine
  - Metaplex
  - Solana NFT
about:
  - Core Candy Machine item insertion
  - Config line management for NFT minting
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
faqs:
  - q: 在 Core Candy Machine 中每个交易可以插入多少物品？
    a: 每个交易的物品数量取决于 Config Line Settings 中的 Name Length 和 URI Length 值。较短的名称和 URI 允许每个交易包含更多物品，因为 Solana 交易有大小限制。使用前缀可以显著减少这些长度，让您在每次调用中插入更多物品。
  - q: 可以更新或覆盖已插入的物品吗？
    a: 可以。addConfigLines 函数接受一个 index 参数来控制物品写入的位置。通过指定先前插入物品的索引，您可以用新数据覆盖该槽位。这适用于尚未被铸造的任何物品。
  - q: 铸造开始前是否需要插入所有物品？
    a: 是的。使用 Config Line Settings 时，Core Candy Machine 强制要求每个槽位（直到 itemsAvailable）都必须包含 config line 才允许任何铸造交易。
  - q: 使用前缀和不使用前缀插入物品有什么区别？
    a: 不使用前缀时，您需要为每个物品存储完整的名称和 URI。使用前缀时，Core Candy Machine 只存储共享前缀一次，您只需插入每个物品的唯一后缀。这减少了链上存储，降低了租金成本，并让您在每个交易中插入更多物品。
---

## 概要

`addConfigLines` 指令将名称和 URI 数据加载到 [Core Candy Machine](/zh/smart-contracts/core-candy-machine) 中，以便每个槽位准备好作为唯一的 Core NFT Asset 铸造。

- 使用 `addConfigLines` 在指定索引处插入一个或多个 config lines
- 使用 [Config Line Settings](/zh/smart-contracts/core-candy-machine/create#config-line-settings) 前缀优化批量大小，以在每个交易中容纳更多物品
- 通过指定索引位置覆盖先前插入的物品
- 铸造开始前必须插入所有物品

## 将物品加载到 Core Candy Machine

`addConfigLines` 指令将名称和 URI 对写入链上账户，以便 [Core Candy Machine](/zh/smart-contracts/core-candy-machine) 知道在铸造时分配什么元数据。每个物品必须符合您机器的 [Config Line Settings](/zh/smart-contracts/core-candy-machine/create#config-line-settings) 中定义的 **Name Length** 和 **URI Length** 约束。

由于 Solana 交易有大小限制，您无法在单个交易中插入数千个物品。每次调用可以包含的物品数量取决于每个名称和 URI 字符串的长度。字符串越短，每个交易中容纳的物品就越多。

{% callout type="note" %}
使用 Config Line Settings 时，**在所有物品都插入之前，铸造将不被允许**。在添加[守卫](/zh/smart-contracts/core-candy-machine/guards)或开放铸造之前，请验证 `itemsLoaded` 等于 `itemsAvailable`。
{% /callout %}

{% callout title="CLI 替代方案" type="note" %}
您也可以使用 MPLX CLI 插入物品，它会自动处理批量处理：
```bash
mplx cm insert
```
CLI 提供智能加载检测、进度跟踪和最佳批量大小。有关更多详细信息，请参阅 [CLI insert 命令文档](/zh/dev-tools/cli/cm/insert)。
{% /callout %}

{% dialect-switcher title="添加 config lines" %}
{% dialect title="JavaScript" id="js" %}

使用 Umi 库时，您可以使用 `addConfigLines` 函数将物品插入到 Core Candy Machine 中。它需要要添加的 config lines 以及您要插入它们的索引。

```ts
await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: 0,
  configLines: [
    { name: 'My NFT #1', uri: 'https://example.com/nft1.json' },
    { name: 'My NFT #2', uri: 'https://example.com/nft2.json' },
  ],
}).sendAndConfirm(umi)
```

要简单地将物品追加到当前加载物品的末尾，您可以使用 `candyMachine.itemsLoaded` 属性作为索引，如下所示。

```ts
await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: candyMachine.itemsLoaded,
  configLines: [
    { name: 'My NFT #3', uri: 'https://example.com/nft3.json' },
    { name: 'My NFT #4', uri: 'https://example.com/nft4.json' },
    { name: 'My NFT #5', uri: 'https://example.com/nft5.json' },
  ],
}).sendAndConfirm(umi)
```

API 参考: [addConfigLines](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/addConfigLines.html)

{% /dialect %}
{% /dialect-switcher %}

## 使用前缀插入物品

基于前缀的插入仅存储每个名称和 URI 的唯一后缀，因为共享前缀已保存在 [Config Line Settings](/zh/smart-contracts/core-candy-machine/create#config-line-settings) 中。这大幅减少了每个物品的数据大小，让您可以在每个交易中容纳更多物品。

{% dialect-switcher title="从给定索引添加 config lines" %}
{% dialect title="JavaScript" id="js" %}

向使用前缀的 Core Candy Machine 添加 config lines 时，使用 `addConfigLines` 函数时您只需提供前缀之后的名称和 URI 部分。

例如，假设您有一个具有以下 config line 设置的 Core Candy Machine。

```ts
await create(umi, {
  // ...
  configLineSettings: some({
    prefixName: 'My Asset #',
    nameLength: 4,
    prefixUri: 'https://example.com/nft',
    uriLength: 9,
    isSequential: false,
  }),
}).sendAndConfirm(umi)
```

然后，您可以像这样插入 config lines。

```ts
await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: candyMachine.itemsLoaded,
  configLines: [
    { name: '1', uri: '1.json' },
    { name: '2', uri: '2.json' },
    { name: '3', uri: '3.json' },
  ],
}).sendAndConfirm(umi)
```

API 参考: [addConfigLines](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/addConfigLines.html)

{% /dialect %}
{% /dialect-switcher %}

## 覆盖现有物品

`addConfigLines` 指令允许您通过指定要替换的槽位索引来覆盖先前插入的物品。这对于在铸造开始前更正元数据错误或替换物品非常有用。

{% dialect-switcher title="覆盖 config lines" %}
{% dialect title="JavaScript" id="js" %}

以下示例展示了如何插入三个物品，然后稍后更新第二个插入的物品。

```ts
await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: 0,
  configLines: [
    { name: 'My Asset #1', uri: 'https://example.com/nft1.json' },
    { name: 'My Asset #2', uri: 'https://example.com/nft2.json' },
    { name: 'My Asset #3', uri: 'https://example.com/nft3.json' },
  ],
}).sendAndConfirm(umi)

await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: 1,
  configLines: [{ name: 'My Asset #X', uri: 'https://example.com/nftX.json' }],
}).sendAndConfirm(umi)

candyMachine = await fetchCandyMachine(candyMachine.publicKey)
candyMachine.items[0].name // "My Asset #1"
candyMachine.items[1].name // "My Asset #X"
candyMachine.items[2].name // "My Asset #3"
```

API 参考: [addConfigLines](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/addConfigLines.html)

{% /dialect %}
{% /dialect-switcher %}

## 插入物品后的后续步骤

一旦所有物品都已加载（`itemsLoaded` 等于 `itemsAvailable`），Core Candy Machine 就准备好进行铸造配置。下一步是设置[守卫](/zh/smart-contracts/core-candy-machine/guards)来控制谁可以铸造、铸造何时开放、需要什么支付以及您发布所需的任何其他访问条件。

## 注意事项

- **交易大小限制**：Solana 交易上限为 1232 字节。每个交易可以插入的 config lines 数量直接取决于 Config Line Settings 中的 Name Length 和 URI Length 组合值。
- **Name Length 和 URI Length 约束**：每个插入物品的名称（不包括前缀）不得超过创建时定义的 `nameLength` 值，每个 URI（不包括前缀）不得超过 `uriLength` 值。超过这些限制将导致交易失败。
- **铸造前必须加载所有物品**：Core Candy Machine 程序在每个槽位（从索引 0 到 `itemsAvailable - 1`）都填充了 config line 之前，会拒绝铸造指令。
- **前缀减少存储成本**：使用 `prefixName` 和 `prefixUri` 只在链上存储共享字符串部分一次，而不是为每个物品重复存储，从而降低 Candy Machine 账户的租金成本。
- **覆盖仅限铸造前**：您可以覆盖任何尚未被铸造的 config line。一旦物品被铸造，其链上数据即为最终版本。

## 常见问题

### 在 Core Candy Machine 中每个交易可以插入多少物品？

每个交易的物品数量取决于 [Config Line Settings](/zh/smart-contracts/core-candy-machine/create#config-line-settings) 中的 **Name Length** 和 **URI Length** 值。较短的名称和 URI 允许每个交易包含更多物品，因为 Solana 交易的大小限制为 1232 字节。使用前缀可以显著减少这些长度，让您在每次调用中插入更多物品。

### 可以更新或覆盖已插入的物品吗？

可以。`addConfigLines` 函数接受一个 `index` 参数来控制物品写入的位置。通过指定先前插入物品的索引，您可以用新数据覆盖该槽位。这适用于尚未被铸造的任何物品。

### 铸造开始前是否需要插入所有物品？

是的。使用 Config Line Settings 时，Core Candy Machine 强制要求每个槽位（直到 `itemsAvailable`）都必须包含 config line 才允许任何铸造交易。

### 使用前缀和不使用前缀插入物品有什么区别？

不使用前缀时，您需要为每个物品存储完整的名称和 URI。使用前缀时，Core Candy Machine 只存储共享前缀一次，您只需插入每个物品的唯一后缀。这减少了链上存储，降低了租金成本，并让您在每个交易中插入更多物品。

