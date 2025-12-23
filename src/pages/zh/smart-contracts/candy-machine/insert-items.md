---
title: 插入项目
metaTitle: 插入项目 | Candy Machine
description: 解释如何将项目加载到Candy Machine中。
---

到目前为止,我们已经学会了创建和配置Candy Machine,但我们还没有看到如何向其中插入可以铸造成NFT的项目。因此,让我们在本页面上解决这个问题。{% .lead %}

重要的是要记住,**插入项目仅适用于使用[Config Line Settings](/zh/candy-machine/settings#config-line-settings)的Candy Machine**。这是因为使用[Hidden Settings](/zh/candy-machine/settings#hidden-settings)从Candy Machine铸造的NFT都将共享相同的"隐藏"名称和URI。

## 上传JSON元数据

要在Candy Machine中插入项目,您需要为每个项目提供以下两个参数:

- 其**名称**:将从此项目铸造的NFT的名称。如果在Config Line Settings中提供了名称前缀,则只需提供该前缀后面的名称部分。
- 其**URI**:指向将从此项目铸造的NFT的JSON元数据的URI。这里也是,它排除了可能在Config Line Settings中提供的URI前缀。

如果您的项目没有URI,则首先需要逐个上传其JSON元数据。这可以使用链下解决方案——例如AWS或您自己的服务器——或链上解决方案——例如Arweave或IPFS。

您可以在此[Github仓库](https://github.com/metaplex-foundation/example-candy-machine-assets)中找到用于测试的示例资产。

幸运的是,我们的SDK可以帮助您。它们允许您上传JSON对象并检索其URI。

此外,[Sugar](/zh/candy-machine/sugar)等工具通过并行上传、缓存过程和重试失败的上传,使上传JSON元数据变得轻而易举。

{% dialect-switcher title="上传项目" %}
{% dialect title="JavaScript" id="js" %}

Umi附带一个`uploader`接口,可用于将JSON数据上传到您选择的存储提供商。例如,这是您选择uploader接口的Irys实现的方式。

```ts
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
umi.use(irysUploader())
```

然后,您可以使用`uploader`接口的`upload`和`uploadJson`方法上传您的资产及其JSON元数据。

```ts
import { createGenericFileFromBrowserFile } from '@metaplex-foundation/umi'

// 上传资产。
const file = await createGenericFileFromBrowserFile(event.target.files[0])
const [fileUri] = await umi.uploader.upload([file])

// 上传JSON元数据。
const uri = await umi.uploader.uploadJson({
  name: 'My NFT #1',
  description: 'My description',
  image: fileUri,
})
```

API参考:[UploaderInterface](https://umi.typedoc.metaplex.com/interfaces/umi.UploaderInterface.html), [createGenericFileFromBrowserFile](https://umi.typedoc.metaplex.com/functions/umi.createGenericFileFromBrowserFile.html)。

{% /dialect %}
{% /dialect-switcher %}

## 插入项目

现在我们为所有项目都有了名称和URI,我们需要做的就是将它们插入到Candy Machine账户中。

这是过程的重要部分,在使用Config Line Settings时,**在插入所有项目之前不允许铸造**。

请注意,每个插入项目的名称和URI分别受Config Line Settings的**Name Length**和**URI Length**属性约束。

此外,由于交易限制为特定大小,我们无法在同一交易中插入数千个项目。我们每个交易可以插入的项目数将取决于Config Line Settings中定义的**Name Length**和**URI Length**属性。我们的名称和URI越短,我们就能在交易中容纳越多。

{% dialect-switcher title="添加config line" %}
{% dialect title="JavaScript" id="js" %}

使用Umi库时,您可以使用`addConfigLines`函数将项目插入Candy Machine。它需要添加的config line以及您想要插入它们的索引。

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

要简单地将项目附加到当前加载的项目的末尾,您可以使用`candyMachine.itemsLoaded`属性作为索引,如下所示。

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

API参考:[addConfigLines](https://mpl-candy-machine.typedoc.metaplex.com/functions/addConfigLines.html)

{% /dialect %}
{% /dialect-switcher %}

## 使用前缀插入项目

使用名称和/或URI前缀时,您只需要插入它们后面的部分。

请注意,由于使用前缀可以显著减少Name Length和URI Length,因此应该帮助您在每个交易中容纳更多项目。

{% dialect-switcher title="从给定索引添加config line" %}
{% dialect title="JavaScript" id="js" %}

向使用前缀的candy machine添加config line时,使用`addConfigLines`函数时,您只需提供前缀后面的名称和URI部分。

例如,假设您有一个具有以下config line设置的candy machine。

```ts
await create(umi, {
  // ...
  configLineSettings: some({
    prefixName: 'My NFT #',
    nameLength: 4,
    prefixUri: 'https://example.com/nft',
    uriLength: 9,
    isSequential: false,
  }),
}).sendAndConfirm(umi)
```

然后,您可以像这样插入config line。

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

API参考:[addConfigLines](https://mpl-candy-machine.typedoc.metaplex.com/functions/addConfigLines.html)

{% /dialect %}
{% /dialect-switcher %}

## 覆盖现有项目

插入项目时,您可以提供应插入这些项目的位置。这使您能够以任何顺序插入项目,但也允许您更新已插入的项目。

{% dialect-switcher title="覆盖config line" %}
{% dialect title="JavaScript" id="js" %}

以下示例显示了如何插入三个项目,然后更新插入的第二个项目。

```ts
await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: 0,
  configLines: [
    { name: 'My NFT #1', uri: 'https://example.com/nft1.json' },
    { name: 'My NFT #2', uri: 'https://example.com/nft2.json' },
    { name: 'My NFT #3', uri: 'https://example.com/nft3.json' },
  ],
}).sendAndConfirm(umi)

await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: 1,
  configLines: [{ name: 'My NFT #X', uri: 'https://example.com/nftX.json' }],
}).sendAndConfirm(umi)

candyMachine = await fetchCandyMachine(candyMachine.publicKey)
candyMachine.items[0].name // "My NFT #1"
candyMachine.items[1].name // "My NFT #X"
candyMachine.items[2].name // "My NFT #3"
```

API参考:[addConfigLines](https://mpl-candy-machine.typedoc.metaplex.com/functions/addConfigLines.html)

{% /dialect %}
{% /dialect-switcher %}

## 结论

就这样,我们有了一个已加载的Candy Machine,准备铸造NFT!但是,我们还没有为铸造过程创建任何要求。我们如何配置铸造的价格?我们如何确保买家是特定代币或来自特定集合的NFT的持有者?我们如何设置铸造的开始日期?结束条件呢?

[在下一页](/zh/candy-machine/guards)上,我们将讨论使所有这些成为可能的Candy Guard。
