---
title: Umi 接口
metaTitle: Umi 核心接口 - Context 和 Umi 接口详解 | Metaplex
description: Umi 接口概述
---
## 核心接口

Umi 定义了一组核心接口，使与 Solana 区块链的交互变得简单。它们是：
- [`Signer`](https://umi.typedoc.metaplex.com/interfaces/umi.Signer.html): 表示可以签署交易和消息的钱包的接口。
- [`EddsaInterface`](https://umi.typedoc.metaplex.com/interfaces/umi.EddsaInterface.html): 使用 EdDSA 算法创建密钥对、查找 PDA 和签署/验证消息的接口。
- [`RpcInterface`](https://umi.typedoc.metaplex.com/interfaces/umi.RpcInterface.html): 表示 Solana RPC 客户端的接口。
- [`TransactionFactoryInterface`](https://umi.typedoc.metaplex.com/interfaces/umi.TransactionFactoryInterface.html): 允许我们创建和序列化交易的接口。
- [`UploaderInterface`](https://umi.typedoc.metaplex.com/interfaces/umi.UploaderInterface.html): 允许我们上传文件并获取访问它们的 URI 的接口。
- [`DownloaderInterface`](https://umi.typedoc.metaplex.com/interfaces/umi.DownloaderInterface.html): 允许我们从给定 URI 下载文件的接口。
- [`HttpInterface`](https://umi.typedoc.metaplex.com/interfaces/umi.HttpInterface.html): 允许我们发送 HTTP 请求的接口。
- [`ProgramRepositoryInterface`](https://umi.typedoc.metaplex.com/interfaces/umi.ProgramRepositoryInterface.html): 用于注册和检索程序的接口。

## Context 接口

上述接口都定义在一个 `Context` 接口中，可用于在代码中注入它们。`Context` 类型定义如下：

```ts
interface Context {
  downloader: DownloaderInterface;
  eddsa: EddsaInterface;
  http: HttpInterface;
  identity: Signer;
  payer: Signer;
  programs: ProgramRepositoryInterface;
  rpc: RpcInterface;
  transactions: TransactionFactoryInterface;
  uploader: UploaderInterface;
};
```

如您所见，`Signer` 接口在上下文中使用了两次：
- 一次用于 `identity`，即使用您的应用程序的签名者。
- 一次用于 `payer`，即支付交易费用和存储费用等的签名者。通常这将与 `identity` 是同一个签名者，但将它们分开为应用程序提供了更大的灵活性——例如，如果他们希望从用户那里抽象一些成本以改善用户体验。

## Umi 接口

`Umi` 接口建立在这个 `Context` 接口之上，只是添加了一个 `use` 方法，使最终用户能够注册插件。它定义如下：

```ts
interface Umi extends Context {
  use(plugin: UmiPlugin): Umi;
}
```

因此，最终用户可以像这样向其 `Umi` 实例添加插件：

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';
import { awsUploader } from '@metaplex-foundation/umi-uploader-aws';
import { myProgramRepository } from '../plugins';

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(walletAdapterIdentity(...))
  .use(awsUploader(...))
  .use(myProgramRepository());
```
