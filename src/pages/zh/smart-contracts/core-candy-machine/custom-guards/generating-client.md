---
title: 为 Core Candy Machine 生成自定义守卫客户端
metaTitle: 自定义守卫客户端 | Core Candy Machine
description: 了解如何使用 Kinobi 和 Shankjs 为 Core Candy Machine 程序的自定义守卫生成兼容 Umi 的 JavaScript 客户端。
keywords:
  - custom guard
  - core candy machine
  - kinobi
  - IDL
  - shankjs
  - client generation
  - umi sdk
  - candy guard
  - solana nft
  - custom minting logic
  - guard manifest
  - code generation
  - metaplex
about:
  - Custom guards
  - Client generation
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
created: '03-10-2026'
updated: '03-10-2026'
---

## 概要

生成自定义守卫客户端可以从您的自定义 [Core Candy Machine](/zh/smart-contracts/core-candy-machine) 守卫程序生成兼容 [Umi](/zh/dev-tools/umi) 的 JavaScript SDK，实现前端和脚本集成。 {% .lead %}

- 使用 [Shankjs](https://github.com/metaplex-foundation/shank) 从您的自定义 Candy Guard 程序生成 IDL
- 运行 Kinobi 代码生成器生成 TypeScript 客户端文件
- 在生成的客户端包中注册守卫清单、类型和铸造参数
- 构建并将客户端包发布到 npm 或本地链接

## 生成 IDL 和初始客户端

编写自定义守卫后的第一步是使用 [mpl-core-candy-machine 仓库](https://github.com/metaplex-foundation/mpl-core-candy-machine)中的 Shankjs 和 Kinobi 生成 IDL 和初始 TypeScript 客户端。

### 配置 Shankjs 进行 IDL 生成

Shankjs 是一个适用于 Anchor 和非 Anchor 程序的 IDL 生成器。编辑位于 mpl-candy-machine 仓库中 `/configs/shank.cjs` 的文件，使用您的自定义 Candy Guard 部署密钥进行配置。

```js
/configs/shank.cjs

generateIdl({
  generator: "anchor",
  programName: "candy_guard",
  programId: "Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g", // Your custom Candy Guard deployed program key.
  idlDir,
  binaryInstallDir,
  programDir: path.join(programDir, "candy-guard", "program"),
});

```

{% callout %}
如果您使用 anchor 28 生成，由于缺少 crates.io crate，您需要在 Shankjs IDL 生成器中添加到 anchor 27 的回退。
{% /callout %}

```js
/configs/shank.cjs

generateIdl({
  generator: "anchor",
  programName: "candy_guard",
  programId: "Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g", // Your custom Candy Guard deployed program key.
  idlDir,
  binaryInstallDir,
  programDir: path.join(programDir, "candy-guard", "program"),
  rustbin: {
    locked: true,
    versionRangeFallback: "0.27.0",
  },
});

```

### 运行 IDL 和客户端生成

现在您应该能够生成 IDL 和初始客户端。从项目根目录运行：

```shell
pnpm run generate
```

这将依次执行 `pnpm generate:idls` 和 `pnpm generate:clients` 脚本并构建初始客户端。
如果由于某种原因需要单独运行这些脚本，您也可以这样做。

## 将自定义守卫添加到生成的客户端

成功生成初始客户端后，您需要创建守卫文件并在客户端的类型系统中注册它。

### 创建守卫文件

导航到生成的客户端中的 `/clients/js/src/defaultGuards`，为您的自定义守卫创建一个新文件。以下模板可以根据您创建的守卫类型进行调整。此示例使用名称 `customGuard.ts`。

```ts
import { PublicKey } from '@metaplex-foundation/umi'
import {
  getCustomGuardSerializer,
  CustomGuard,
  CustomGuardArgs,
} from '../generated'
import { GuardManifest, noopParser } from '../guards'

export const customGuardManifest: GuardManifest<
  CustomGuardArgs,
  CustomGuard,
  CustomGuardMintArgs
> = {
  name: 'customGuard',
  serializer: getCustomGuardSerializer,
  mintParser: (context, mintContext, args) => {
    const { publicKeyArg1, arg1 } = args
    return {
      data: new Uint8Array(),
      // Pass in any accounts needed for your custom guard from your mint args.
      // Your guard may or may not need remaining accounts.
      remainingAccounts: [
        { publicKey: publicKeyArg1, isWritable: true },
        { publicKey: publicKeyArg2, isWritable: false },
      ],
    }
  },
  routeParser: noopParser,
}

// Here you would fill out any custom Mint args needed for your guard to operate.
// Your guard may or may not need MintArgs.

export type CustomGuardMintArgs = {
  /**
   * Custom Guard Mint Arg 1
   */
  publicKeyArg1: PublicKey

  /**
   * Custom Guard Mint Arg 2
   */
  publicKeyArg2: PublicKey

  /**
   * Custom Guard Mint Arg 3.
   */
  arg3: Number
}
```

### 在现有文件中注册守卫

创建守卫文件后，您必须在生成的客户端中的多个现有文件中注册该守卫。

从 `/clients/js/src/defaultGuards/index.ts` 导出您的新守卫

```ts
...
export * from './tokenGate';
export * from './tokenPayment';
export * from './token2022Payment';
// add your guard to the list
export * from './customGuard';
```

在 `/clients/js/src/defaultGuards/defaults.ts` 中将您的守卫添加到以下位置：

```ts
import { CustomGuardArgs } from "../generated"

export type DefaultGuardSetArgs = GuardSetArgs & {
    ...
     // add your guard to the list
    customGuard: OptionOrNullable<CustomGuardArgs>;
}
```

```ts
import { customGuard } from "../generated"

export type DefaultGuardSet = GuardSet & {
    ...
     // add your guard to the list
    customGuard: Option<CustomGuard>
}
```

```ts
import { CustomGuardMintArgs } from "./defaultGuards/customGuard.ts"
export type DefaultGuardSetMintArgs = GuardSetMintArgs & {
    ...
    // add your guard to the list
    customGuard: OptionOrNullable<CustomGuardMintArgs>
}
```

```ts
export const defaultCandyGuardNames: string[] = [
  ...// add your guard to the list
  'customGuard',
]
```

最后，您需要将导出的 customGuardManifest 添加到位于 `/clients/js/src/plugin.ts` 的插件文件中

```ts
import {customGuardManifest} from "./defaultGuards"

 umi.guards.add(
  ...// add your guard manifest to the list
  customGuardManifest
)
```

从这一点开始，您可以构建并将客户端包上传到 npm，或将其链接/移动到您想要访问新守卫客户端的项目文件夹中。

## 注意事项

- 此工作流需要 [mpl-core-candy-machine 仓库](https://github.com/metaplex-foundation/mpl-core-candy-machine)的 fork 副本。请克隆并在该 fork 中工作。
- 使用内置的 [AVA](https://github.com/avajs/ava) 测试套件编写在多种场景下全面测试您的自定义守卫的测试。测试示例可以在 `/clients/js/tests` 中找到。
- 如果使用 Anchor 28，由于缺少 crates.io 依赖，您必须如上所示向 Shankjs 添加 `rustbin` 回退配置。
- 除了添加自定义守卫注册外，不应手动编辑生成后的客户端文件。

*由 [Metaplex](https://github.com/metaplex-foundation/mpl-core-candy-machine) 维护 · 最后验证于 2026 年 3 月*
