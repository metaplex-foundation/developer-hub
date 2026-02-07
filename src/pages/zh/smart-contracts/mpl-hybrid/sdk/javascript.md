---
title: MPL-Hybrid Javascript SDK
metaTitle: Javascript SDK | MPL-Hybrid
description: 了解如何设置您的项目以运行MPL-Hybrid Javascript SDK。
---

Metaplex提供了一个JavaScript库，可用于与MPL-Hybrid 404程序交互。得益于[Umi框架](/zh/dev-tools/umi)，它不需要许多固定的依赖项，因此提供了一个可在任何JavaScript项目中使用的轻量级库。

要开始，您需要[安装Umi框架](/zh/dev-tools/umi/getting-started)和MPL-Hybrid JavaScript库。

## 安装

可以使用任何JS包管理器执行安装，如npm、yarn、bun等...

```sh
npm install @metaplex-foundation/mpl-hybrid
```

## Umi设置

需要一个`umi`实例来与Metaplex Javascript SDK交互。如果您尚未设置和配置`umi`实例，可以查看[Umi入门指南](/zh/dev-tools/umi/getting-started)页面。

在初始化`umi`实例期间，您可以使用以下方式将mpl-hybrid包添加到`umi`

```js
.use(mplHybrid())
```

您可以在umi实例创建的任何位置添加`mplHybrid()`包。
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplHybrid } from '@metaplex-foundation/mpl-hybrid'

// 使用您选择的RPC端点。
const umi = createUmi('http://api.devenet.solana.com')
... // 其他umi设置和包
.use(mplHybrid())
```

从这里开始，您的`umi`实例将可以访问mpl-hybrid包。
