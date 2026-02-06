---
title: MPL-Bubblegum Javascript SDK
metaTitle: Javascript SDK | MPL-Bubblegum
description: 了解如何设置您的项目以运行MPL-Bubblegum Javascript SDK。
---

Metaplex提供了一个JavaScript库，可用于与MPL-Bubblegum程序交互。得益于[Umi框架](/zh/dev-tools/umi)，它不需要许多固定的依赖项，因此提供了一个可在任何JavaScript项目中使用的轻量级库。

要开始，您需要[安装Umi框架](/zh/dev-tools/umi/getting-started)和MPL-Bubblegum JavaScript库。

## 安装

可以使用任何JS包管理器执行安装，如npm、yarn、bun等...

```sh
npm install @metaplex-foundation/mpl-bubblegum
```

{% quick-links %}

{% quick-link title="typedoc" target="_blank" icon="JavaScript" href="<https://mpl-bubblegum.typedoc.metaplex.com/>" description="MPL-Bubblegum Javascript SDK生成的包API文档。" /%}

{% quick-link title="npmjs.com" target="_blank" icon="JavaScript" href="<https://www.npmjs.com/package/@metaplex-foundation/MPL-Bubblegum>" description="NPM上的MPL-Bubblegum Javascript SDK。" /%}

{% /quick-links %}

## Umi设置

需要一个`umi`实例来与Metaplex Javascript SDK交互。如果您尚未设置和配置`umi`实例，可以查看[Umi入门指南](/zh/dev-tools/umi/getting-started)页面并配置您的RPC端点和`umi`身份/签名者。

在初始化`umi`实例期间，您可以使用以下方式将MPL-Bubblegum包添加到`umi`

```js
.use(mplBubblegum())
```

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'

// 使用您选择的RPC端点。
const umi = createUmi('http://api.devnet.solana.com')
... // 其他umi设置、包和签名者
.use(mplBubblegum())
```

从这里开始，您的`umi`实例将可以访问MPL-Bubblegum包，您可以开始探索MPL-Bubblegum功能集。
