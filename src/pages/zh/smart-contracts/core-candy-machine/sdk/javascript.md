---
title: MPL Core Candy Machine Javascript SDK
metaTitle: Javascript SDK | MPL Core Candy Machine
description: 了解如何设置您的项目以运行 MPL Core Candy Machine Javascript SDK。
---

Metaplex 提供了一个可用于与 MPL Core Candy Machine 程序交互的 JavaScript 库。得益于 [Umi 框架](/zh/umi),它在没有许多自以为是的依赖项的情况下提供,因此提供了一个可在任何 JavaScript 项目中使用的轻量级库。

要开始使用,您需要[安装 Umi 框架](/zh/umi/getting-started)和 MPL-Core JavaScript 库。

## 安装

可以使用任何 JS 包管理器(npm、yarn、bun 等)执行安装...

```sh
npm install @metaplex-foundation/mpl-core-candy-machine
```

{% quick-links %}

{% quick-link title="typedoc" target="_blank" icon="JavaScript" href="https://mpl-core-candy-machine.typedoc.metaplex.com/" description="MPL Core Candy Machine Javascript SDK 生成的包 API 文档。" /%}

{% quick-link title="npmjs.com" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/mpl-core-candy-machine" description="NPM 上的 MPL Core Candy Machine Javascript SDK。" /%}

{% /quick-links %}

## Umi 设置

与 Metaplex Javascript SDK 交互需要一个 `umi` 实例。如果您还没有设置和配置 `umi` 实例,那么您可以查看 [Umi 入门](/zh/umi/getting-started)页面并配置您的 RPC 端点和您的 `umi` 身份/签名者。

在 `umi` 实例的初始化期间,您可以使用以下方式将 mpl-core 包添加到 `umi`:

```js
.use(mplCandyMachine())
```

您可以在 umi 实例创建的任何地方使用 `.use()` 添加 `mpCandyMachine()` 包。

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine'

// 使用您选择的 RPC 端点。
const umi = createUmi('http://api.devnet.solana.com')
... // 额外的 umi 设置、包和签名者
.use(mplCandyMachine())
```

从这里,您的 `umi` 实例将可以访问 mpl-core 包,您可以开始探索 mpl-core 功能集。
