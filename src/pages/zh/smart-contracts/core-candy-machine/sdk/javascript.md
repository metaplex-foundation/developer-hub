---
title: MPL Core Candy Machine JavaScript SDK
metaTitle: JavaScript SDK | MPL Core Candy Machine
description: 了解如何使用 Umi 框架安装和配置 MPL Core Candy Machine JavaScript SDK，在 Solana 上创建和管理 Candy Machine。
keywords:
  - core candy machine
  - javascript sdk
  - mpl-core-candy-machine
  - umi framework
  - solana nft
  - candy machine javascript
  - metaplex sdk
  - nft minting
  - npm package
  - typescript
  - candy machine setup
about:
  - JavaScript SDK
  - Umi framework
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
---

## 概要

MPL Core Candy Machine JavaScript SDK 提供了一个轻量级库，用于通过 [Umi 框架](/zh/dev-tools/umi)在 Solana 上创建和管理 Core Candy Machine。 {% .lead %}

- 通过 npm、yarn 或 bun 安装 `@metaplex-foundation/mpl-core-candy-machine` 包
- 需要配置好的 [Umi](/zh/dev-tools/umi/getting-started) 实例，包括 RPC 端点和签名者
- 使用 `.use(mplCandyMachine())` 将 SDK 注册为 Umi 实例的插件
- 兼容任何 JavaScript 或 TypeScript 项目

## 安装

`@metaplex-foundation/mpl-core-candy-machine` 包可以使用任何 JavaScript 包管理器安装，包括 npm、yarn 和 bun。

```sh
npm install @metaplex-foundation/mpl-core-candy-machine
```

{% quick-links %}

{% quick-link title="typedoc" target="_blank" icon="JavaScript" href="https://mpl-core-candy-machine.typedoc.metaplex.com/" description="MPL Core Candy Machine Javascript SDK 生成的包 API 文档。" /%}

{% quick-link title="npmjs.com" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/mpl-core-candy-machine" description="NPM 上的 MPL Core Candy Machine Javascript SDK。" /%}

{% /quick-links %}

## Umi 设置

在与 Core Candy Machine SDK 交互之前，需要配置好 [Umi](/zh/dev-tools/umi/getting-started) 实例。如果您尚未设置 Umi，请访问 [Umi 入门](/zh/dev-tools/umi/getting-started)页面配置您的 RPC 端点和身份签名者。

在 `umi` 实例初始化期间，您可以使用以下方式将 mpl-core 包添加到 `umi`：

```js
.use(mplCandyMachine())
```

您可以在 umi 实例创建的任何位置使用 `.use()` 添加 `mplCandyMachine()` 包。

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine'

// Use the RPC endpoint of your choice.
const umi = createUmi('http://api.devnet.solana.com')
... // additional umi settings, packages, and signers
.use(mplCandyMachine())
```

从这里开始，您的 `umi` 实例将可以访问 mpl-core 包，您可以开始探索 Core Candy Machine 功能集。

## 注意事项

- JavaScript SDK 需要 [Umi 框架](/zh/dev-tools/umi)作为对等依赖。使用此 SDK 之前，您必须安装并配置 Umi。
- 需要 Solana RPC 端点。生产部署请使用专用的 RPC 提供商，而非公共端点。
- 此 SDK 在单个包中同时涵盖 Core Candy Machine 程序和 Core Candy Guard 程序。

*由 [Metaplex](https://github.com/metaplex-foundation/mpl-core-candy-machine) 维护 · 最后验证于 2026 年 3 月*
