---
title: 为 Core Candy Machine 生成自定义守卫客户端
metaTitle: 自定义守卫客户端 | Core Candy Machine
description: 了解如何为最新的 Core Candy Machine 程序自定义构建的守卫生成与 Umi 兼容的客户端。
---

一旦您为 Candy Machine Guard 程序编写了自定义守卫，您需要生成一个与 Umi SDK 兼容的 Kinobi 客户端，例如能够在前端中使用您的守卫。

## 生成 IDL 和初始客户端

### 配置 Shankjs

Shankjs 是一个适用于 Anchor 和非 Anchor 程序的 IDL 生成器。您需要使用新的自定义 Candy Guard 部署密钥配置它，以正确生成可用的客户端。编辑位于 mpl-candy-machine 仓库中 `/configs/shank.cjs` 的文件。

```js
/configs/shank.cjs

generateIdl({
  generator: "anchor",
  programName: "candy_guard",
  programId: "Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g", // 您的自定义 Candy Guard 部署程序密钥。
  idlDir,
  binaryInstallDir,
  programDir: path.join(programDir, "candy-guard", "program"),
});

```

{% callout %}
如果您使用 anchor 28 生成，由于缺少 crates.io crate，您需要在 Shankjs idl 生成器中添加到 anchor 27 的回退。
{% /callout %}

```js
/configs/shank.cjs

generateIdl({
  generator: "anchor",
  programName: "candy_guard",
  programId: "Guard1JwRhJkVH6XZhzoYxeBVQe872VH6QggF4BWmS9g", // 您的自定义 Candy Guard 部署程序密钥。
  idlDir,
  binaryInstallDir,
  programDir: path.join(programDir, "candy-guard", "program"),
  rustbin: {
    locked: true,
    versionRangeFallback: "0.27.0",
  },
});

```

### 生成 IDL 和客户端

现在您应该能够生成 IDL 和初始客户端。从项目根目录运行

```shell
pnpm run generate
```

这将依次执行 `pnpm generate:idls` 和 `pnpm generate:clients` 脚本并构建初始客户端。
如果由于某种原因需要单独运行这些脚本，您也可以这样做。

## 将守卫添加到客户端

### 创建守卫文件

成功生成初始客户端后，导航到 `/clients/js/src`。

第一步是将您的新守卫添加到 `/clients/js/src/defaultGuards` 文件夹中。

以下是您可以根据创建的守卫类型使用和调整的模板。
您可以随意命名您的守卫，但我将在示例中命名为 `customGuard.ts`

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
      // 从您的铸造参数传入自定义守卫所需的任何账户。
      // 您的守卫可能需要也可能不需要剩余账户。
      remainingAccounts: [
        { publicKey: publicKeyArg1, isWritable: true },
        { publicKey: publicKeyArg2, isWritable: false },
      ],
    }
  },
  routeParser: noopParser,
}

// 在这里您将填写守卫运行所需的任何自定义铸造参数。
// 您的守卫可能需要也可能不需要 MintArgs。

export type CustomGuardMintArgs = {
  /**
   * 自定义守卫铸造参数 1
   */
  publicKeyArg1: PublicKey

  /**
   * 自定义守卫铸造参数 2
   */
  publicKeyArg2: PublicKey

  /**
   * 自定义守卫铸造参数 3。
   */
  arg3: Number
}
```

### 将守卫添加到现有文件

从这里您需要将新守卫添加到一些现有文件中。

从 `/clients/js/src/defaultGuards.index.ts` 导出您的新守卫

```ts
...
export * from './tokenGate';
export * from './tokenPayment';
export * from './token2022Payment';
// 将您的守卫添加到列表中
export * from './customGuard';
```

在 `/clients/js/src/defaultGuards.defaults.ts` 中将您的守卫添加到以下位置：

```ts
import { CustomGuardArgs } from "../generated"

export type DefaultGuardSetArgs = GuardSetArgs & {
    ...
     // 将您的守卫添加到列表中
    customGuard: OptionOrNullable<CustomGuardArgs>;
}
```

```ts
import { customGuard } from "../generated"

export type DefaultGuardSet = GuardSet & {
    ...
     // 将您的守卫添加到列表中
    customGuard: Option<CustomGuard>
}
```

```ts
import { CustomGuardMintArgs } from "./defaultGuards/customGuard.ts"
export type DefaultGuardSetMintArgs = GuardSetMintArgs & {
    ...
    // 将您的守卫添加到列表中
    customGuard: OptionOrNullable<CustomGuardMintArgs>
}
```

```ts
export const defaultCandyGuardNames: string[] = [
  ...// 将您的守卫添加到列表中
  'customGuard',
]
```

最后，您需要将导出的 customGuardManifest 添加到位于 `/clients/js/src/plugin.ts` 的插件文件中

```ts
import {customGuardManifest} from "./defaultGuards"

 umi.guards.add(
  ...// 将您的守卫清单添加到列表中
  customGuardManifest
)
```

从这一点开始，您可以构建并将客户端包上传到 npm，或将其链接/移动到您想要访问新守卫客户端的项目文件夹中。

值得使用 AVA 内置测试套件编写一些在多种场景下全面测试您的守卫的测试。测试示例可以在 `/clients/js/tests` 中找到。
