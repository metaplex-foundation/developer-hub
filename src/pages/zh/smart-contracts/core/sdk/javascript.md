---
title: MPL-Core Javascript SDK
metaTitle: Javascript SDK | MPL-Core
description: 了解如何设置您的项目以运行 MPL-Core Javascript SDK。
---

Metaplex 提供了一个可用于与 MPL-Core 程序交互的 JavaScript 库。得益于 [Umi 框架](/zh/dev-tools/umi)，它不附带很多固定依赖，因此提供了一个可在任何 JavaScript 项目中使用的轻量级库。

要开始使用，您需要[安装 Umi 框架](/zh/dev-tools/umi/getting-started)和 MPL-Core JavaScript 库。

## 安装

可以使用任何 JS 包管理器执行安装，如 npm、yarn、bun 等...

```sh
npm install @metaplex-foundation/mpl-core
```

{% quick-links %}

{% quick-link title="typedoc" target="_blank" icon="JavaScript" href="https://mpl-core.typedoc.metaplex.com/" description="MPL-Core Javascript SDK 生成的包 API 文档。" /%}

{% quick-link title="npmjs.com" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/mpl-core" description="NPM 上的 MPL-Core Javascript SDK。" /%}

{% /quick-links %}

## Umi 设置

与 Metaplex Javascript SDK 交互需要一个 `umi` 实例。如果您尚未设置和配置 `umi` 实例，则可以查看 [Umi 快速入门](/zh/dev-tools/umi/getting-started)页面并配置您的 RPC 端点和 `umi` 身份/签名者。

在 `umi` 实例初始化期间，您可以使用以下方式将 mpl-core 包添加到 `umi`：

```js
.use(mplCore())
```

您可以在使用 `.use()` 创建 umi 实例时的任何位置添加 `mplCore()` 包。

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCore } from '@metaplex-foundation/mpl-core'

// 使用您选择的 RPC 端点。
const umi = createUmi('http://api.devenet.solana.com')
... // 其他 umi 设置、包和签名者
.use(mplCore())
```

从这里开始，您的 `umi` 实例将可以访问 mpl-core 包，您可以开始探索 mpl-core 功能集。
