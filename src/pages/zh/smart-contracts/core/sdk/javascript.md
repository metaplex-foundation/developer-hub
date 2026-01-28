---
title: MPL Core JavaScript SDK
metaTitle: JavaScript SDK | Metaplex Core
description: 安装和设置 MPL Core JavaScript SDK。创建、管理和转移 Core Assets 和 Collections 的完整 TypeScript 支持。
---

**MPL Core JavaScript SDK** 是在 Solana 上创建和管理 Core Assets 和 Collections 的完整 TypeScript 库。基于 Umi 框架构建，提供完整的类型安全性和最小化的依赖项。{% .lead %}

{% callout title="您将学到" %}

- 安装和设置 SDK
- 配置 Umi 实例
- 注册 mpl-core 包

{% /callout %}

## 摘要

SDK 通过 npm 安装并与 Umi 实例配置。提供完整的 TypeScript 支持，包含处理 Assets、Collections 和插件的所有功能。

- 使用 `npm install @metaplex-foundation/mpl-core` 安装
- 需要 Umi 框架（管理依赖项）
- 使用 `.use(mplCore())` 注册到 umi

## 安装

可以使用任何 JS 包管理器执行安装，如 npm、yarn、bun 等。

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
const umi = createUmi('http://api.devnet.solana.com')
... // 其他 umi 设置、包和签名者
.use(mplCore())
```

从这里开始，您的 `umi` 实例将可以访问 mpl-core 包，您可以开始探索 mpl-core 功能集。

## 常见错误

### `Umi instance not configured`

在使用 mpl-core 之前必须调用 `.use(mplCore())`。

### `No signer configured`

您需要在 Umi 中配置 identity/signer 来签署交易。

## 注意事项

- SDK 需要 Umi 框架（单独安装）
- 所有函数都有完整的 TypeScript 类型支持
- 在 devnet 和 mainnet 上都可使用
- 交易构建器模式允许链式调用

## FAQ

### 需要 Umi 吗？

是的。Umi 框架处理 RPC 连接、签名者管理和交易构建。您必须在使用 mpl-core 之前设置它。

### SDK 在 React/Next.js 中工作吗？

是的。SDK 在任何 JavaScript 环境中都可以工作。对于 Next.js，使用 `umi-bundle-defaults`。

### 需要 TypeScript 吗？

不是必需的，但推荐使用。SDK 在 JavaScript 中也可以工作，但 TypeScript 的自动完成和类型检查大大改善了开发体验。

## 相关页面

- [Umi 快速入门](/zh/dev-tools/umi/getting-started) - 安装和配置 Umi
- [Core 概述](/zh/smart-contracts/core) - Core 程序介绍
- [创建 Asset](/zh/smart-contracts/core/create-asset) - 创建您的第一个 Asset

---

*由 Metaplex Foundation 维护 · 最后验证于 2026 年 1 月 · 适用于 @metaplex-foundation/mpl-core*
