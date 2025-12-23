---
title: 插入项目
metaTitle: 插入项目 | Core Candy Machine
description: 如何将 Core NFT 资产加载到 Core Candy Machine 中。
---

现在我们已经为所有项目准备好了名称和 URI，我们需要做的就是将它们插入到 Core Candy Machine 账户中。

这是过程中的重要部分，使用 Config Line Settings 时，**在所有项目都插入之前，铸造将不被允许**。

注意，每个插入项目的名称和 URI 分别受到 Config Line Settings 的 **Name Length** 和 **URI Length** 属性的约束。

此外，由于交易的大小有限制，我们不能在同一交易中插入数千个项目。我们每个交易可以插入的项目数量将取决于 Config Line Settings 中定义的 **Name Length** 和 **URI Length** 属性。我们的名称和 URI 越短，我们能在一个交易中容纳的项目就越多。

{% callout title="CLI 替代方案" type="note" %}
您也可以使用 MPLX CLI 插入项目，它会自动处理批量处理：
```bash
mplx cm insert
```
CLI 提供智能加载检测、进度跟踪和最佳批量大小。有关更多详细信息，请参阅 [CLI insert 命令文档](/zh/dev-tools/cli/cm/insert)。
{% /callout %}

{% dialect-switcher title="添加 config lines" %}
{% dialect title="JavaScript" id="js" %}

使用 Umi 库时，您可以使用 `addConfigLines` 函数将项目插入到 Core Candy Machine 中。它需要要添加的 config lines 以及您要插入它们的索引。

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

要简单地将项目追加到当前加载项目的末尾，您可以使用 `candyMachine.itemsLoaded` 属性作为索引，如下所示。

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

## 使用前缀插入项目

使用名称和/或 URI 前缀时，您只需要插入它们之后的部分。

注意，由于使用前缀可以显著减少 Name Length 和 URI Length，它应该帮助您在每个交易中容纳更多项目。

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

## 覆盖现有项目

插入项目时，您可以提供这些项目应该插入的位置。这使您可以按任意顺序插入项目，也允许您更新已经插入的项目。

{% dialect-switcher title="覆盖 config lines" %}
{% dialect title="JavaScript" id="js" %}

以下示例展示了如何插入三个项目，然后稍后更新第二个插入的项目。

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

## 结论

就这样，我们有了一个已加载并准备好铸造资产的 Core Candy Machine！然而，我们还没有为铸造过程创建任何要求。我们如何配置铸造价格？我们如何确保买家是特定代币的持有者或特定 collection 的资产持有者？我们如何设置铸造的开始日期？结束条件呢？
