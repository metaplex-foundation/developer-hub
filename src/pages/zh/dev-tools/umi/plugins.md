---
title: Umi 插件
metaTitle: 插件 | Umi
description: Metaplex Umi 中的插件
---
虽然 Umi 是一个小型零依赖框架，但它被设计为可通过插件扩展。插件不仅允许我们与其接口交互或更换其接口实现，还可以向 Umi 本身添加新功能。

## 使用插件

要安装 Umi 插件，您只需在 Umi 实例上调用 `use` 方法。此 `use` 方法返回 Umi 实例，因此它们可以链接在一起。

```ts
import { somePlugin } from 'some-umi-library';
import { myLocalPlugin } from '../plugins';

umi.use(somePlugin).use(myLocalPlugin);
```

值得注意的是，库通常会提供一个返回插件的函数，而不是插件本身。这样做是为了我们可以传递任何参数来配置插件的行为。

```ts
import { somePlugin } from 'some-umi-library';
import { myLocalPlugin } from '../plugins';

umi.use(somePlugin(somePluginOptions))
  .use(myLocalPlugin(myLocalPluginOptions));
```

为了保持一致，Umi 提供的插件始终遵循此模式，即使它们不需要任何参数。以下是一些示例：

```ts
import { web3JsRpc } from '@metaplex-foundation/umi-rpc-web3js';
import { mockStorage } from '@metaplex-foundation/umi-storage-mock';
import { httpDownloader } from '@metaplex-foundation/umi-downloader-http';

umi.use(web3JsRpc('https://api.mainnet-beta.solana.com'))
  .use(mockStorage())
  .use(httpDownloader());
```

## 创建插件

在底层，Umi 将插件定义为具有 `install` 函数的对象，该函数可用于以我们想要的任何方式扩展 Umi 实例。

```ts
export const myPlugin: UmiPlugin = {
  install(umi: Umi) {
    // 对 Umi 实例执行某些操作。
  },
}
```

如上所述，建议导出插件函数，以便我们可以从最终用户请求可能需要的任何参数。

```ts
export const myPlugin = (myPluginOptions?: MyPluginOptions): UmiPlugin => ({
  install(umi: Umi) {
    // 对 Umi 实例执行某些操作。
  },
})
```

## 在插件中可以做什么

现在我们知道如何创建插件了，让我们看看可以用它们做什么的一些示例。

### 设置接口实现

插件最常见的用例之一是将实现分配给一个或多个 Umi 接口。这是将虚构的 `MyRpc` 实现设置为 `rpc` 接口的示例。请注意，我们如何将 Umi 实例传递给 `MyRpc` 实现，以便它可以在需要时依赖其他接口。

```ts
export const myRpc = (endpoint: string): UmiPlugin => ({
  install(umi: Umi) {
    umi.rpc = new MyRpc(umi, endpoint);
  },
})
```

### 装饰接口实现

设置接口实现的另一种方法是装饰现有的实现。这允许最终用户通过向现有实现添加额外功能来组合插件，而无需担心其底层实现细节。

这是一个装饰 `rpc` 接口的插件示例，使其将所有发送的交易记录到第三方服务。

```ts
export const myLoggingRpc = (provider: LoggingProvider): UmiPlugin => ({
  install(umi: Umi) {
    umi.rpc = new MyLoggingRpc(umi.rpc, provider);
  },
})
```

### 创建捆绑包

由于插件也可以在 Umi 实例上调用 `use` 方法，因此可以在插件中安装插件。这允许我们创建可以一起安装的插件捆绑包。

例如，Umi 的"defaults"插件捆绑包是这样定义的：

```ts
export const defaultPlugins = (
  endpoint: string,
  rpcOptions?: Web3JsRpcOptions
): UmiPlugin => ({
  install(umi) {
    umi.use(dataViewSerializer());
    umi.use(defaultProgramRepository());
    umi.use(fetchHttp());
    umi.use(httpDownloader());
    umi.use(web3JsEddsa());
    umi.use(web3JsRpc(endpoint, rpcOptions));
    umi.use(web3JsTransactionFactory());
  },
});
```

### 使用接口

除了设置和更新 Umi 的接口外，插件还可以使用它们。一个常见的用例是允许库将新程序注册到程序仓库接口。这是一个示例，说明 Token Metadata 库如何注册其程序。请注意，它将 `override` 参数设置为 `false`，以便仅在程序不存在时才注册。

```ts
export const mplTokenMetadata = (): UmiPlugin => ({
  install(umi) {
    umi.programs.add(createMplTokenMetadataProgram(), false);
  },
});
```

### 扩展 Umi 实例

最后但同样重要的是，插件还可以扩展 Umi 实例的功能集。这允许库提供自己的接口、扩展现有接口等。

一个很好的例子是 Candy Machine 库，它将所有 candy guards 存储在一个仓库中——非常像程序仓库。这允许最终用户注册自己的 guards，以便在创建、获取和从带有关联 candy guards 的 candy machines 铸造时可以识别它们。为了使其工作，库向 Umi 实例添加了一个新的 `guards` 属性，并为其分配了一个新的 guard 仓库。

```ts
export const mplCandyMachine = (): UmiPlugin => ({
  install(umi) {
    umi.guards = new DefaultGuardRepository(umi);
    umi.guards.add(botTaxGuardManifest);
    umi.guards.add(solPaymentGuardManifest);
    umi.guards.add(tokenPaymentGuardManifest);
    // ...
  },
});
```

上述代码的轻微问题是 `Umi` 类型不再反映实际实例。也就是说，TypeScript 会抱怨 `Umi` 类型上不存在 `guards` 属性。要解决这个问题，我们可以使用 TypeScript 的[模块增强](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)来扩展 `Umi` 类型，使其包含新属性，如下所示

```ts
declare module '@metaplex-foundation/umi' {
  interface Umi {
    guards: GuardRepository;
  }
}
```

此模块增强也可用于扩展现有接口。例如，我们可以分配一个包含额外方法的新 RPC 接口，同时让 TypeScript 知道我们添加的方法，如下所示。

```ts
export const myRpcWithAddedMethods = (): UmiPlugin => ({
  install(umi) {
    umi.rpc = new MyRpcWithAddedMethods(umi.rpc);
  },
});

declare module '@metaplex-foundation/umi' {
  interface Umi {
    rpc: MyRpcWithAddedMethods;
  }
}
```
