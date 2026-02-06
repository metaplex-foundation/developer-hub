---
title: 快速入门
metaTitle: 快速入门 | Umi
description: 一个用于 Solana 的 Javascript 框架。
---

## Umi 安装

要使用 Umi，您需要安装 Umi 和所有您想使用的外部插件。或者，如果您不需要特定插件，可以安装包含适合大多数用例的插件集的默认捆绑包。

**注意**：由于默认捆绑包依赖 web3.js 来实现某些接口，您还需要安装该包。

### 必需的包

{% packagesUsed packages=["umi", "umiDefaults", "@solana/web3.js@1"] type="npm" /%}

要安装它们，请使用以下命令：

```
npm i @metaplex-foundation/umi
```

```
npm i @metaplex-foundation/umi-bundle-defaults
```

```
npm i @solana/web3.js@1
```

### 库作者须知

想要使用 Umi 接口来大幅减少依赖项的库作者只需要安装主 Umi 库。强烈建议将其作为对等依赖项安装，以确保最终用户不会使用多个版本的 Umi 库，使用以下命令：

```
npm i @metaplex-foundation/umi --save-peer
```

然后，您可以使用 Umi 的 `Context` 对象或其子集在函数中注入您需要的任何接口。

{% totem %}

{% totem-accordion title="示例" %}

```ts
import type { Context, PublicKey } from '@metaplex-foundation/umi';
import { u32 } from '@metaplex-foundation/umi/serializers';

export async function myFunction(
  context: Pick<Context, 'rpc'>, // <-- 注入您需要的接口。
  publicKey: PublicKey
): number {
  const rawAccount = await context.rpc.getAccount(publicKey);
  if (!rawAccount.exists) return 0;
  return u32().deserialize(rawAccount.data)[0];
}
```

{% /totem-accordion %}

{% /totem %}

### 用于测试

另请注意，Umi 附带了一个测试捆绑包，可以帮助最终用户和库作者测试他们的代码。例如，它包含一个用于 `UploaderInterface` 和 `DownloaderInterface` 的 `MockStorage` 实现，因此您可以可靠地测试代码，而无需依赖真实的存储提供商。

```
npm i @metaplex-foundation/umi
```

```
npm i @metaplex-foundation/umi-bundle-tests
```

## Umi 基础

在本节中，我们将介绍开始使用 Umi 的基本步骤：

- [创建 Umi 并连接到 RPC](/zh/dev-tools/umi/getting-started#连接到-rpc)
- [连接钱包](/zh/dev-tools/umi/getting-started#连接钱包)
- [注册程序和客户端](/zh/dev-tools/umi/getting-started#注册程序和客户端)

### 连接到 RPC

Solana 有不同的集群（例如 Mainnet-beta、Devnet、Testnet 等），服务于各种目的，每个集群都有专用的 API 节点来处理 RPC 请求。

将 Umi 连接到所选集群就像创建 umi 实例一样简单，因为 RPC 端点作为第一个参数传递。

**注意**：如果您连接到 **Mainnet**，建议使用来自 Solana RPC 提供商的专用 RPC 端点，而不是公共端点（`https://api.mainnet-beta.solana.com`），因为它有限制。

要创建 Umi 实例，导入 `createUmi` 函数并提供您的 RPC 端点。可选地，您还可以将确认级别指定为第二个参数。

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'

const umi = createUmi('<RPC-Endpoint>', '<Commitment-Level>')
```

### 连接钱包

设置 Umi 时，您需要使用或生成钱包才能发送交易。为此，您可以**创建新钱包**进行测试，从文件系统**导入现有钱包**，或为基于 Web 的 dApp 使用 **walletAdapter**。

**注意**：`walletAdapter` 部分仅提供将其连接到 Umi 所需的代码，假设您已经安装并设置了 `walletAdapter`。有关完整指南，请参阅[此处](https://github.com/anza-xyz/wallet-adapter/blob/master/APP.md)

{% totem %}

{% totem-accordion title="从新钱包" %}

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { generateSigner, signerIdentity } from '@metaplex-foundation/umi'

const umi = createUmi('https://api.devnet.solana.com')

// 生成新的密钥对签名者。
const signer = generateSigner(umi)

// 告诉 Umi 使用新签名者。
umi.use(signerIdentity(signer))
```

{% /totem-accordion %}

{% totem-accordion title="从文件系统保存的现有钱包" %}

```ts
import * as fs from "fs";
import * as path from "path";
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { createSignerFromKeypair, signerIdentity } from '@metaplex-foundation/umi'

const umi = createUmi('https://api.devnet.solana.com')

// 使用 fs 导航文件系统，通过相对路径
// 到达您想使用的钱包。
const walletFile = fs.readFileSync(
  path.join(__dirname, './keypair.json')
)

// 通常密钥对保存为 Uint8Array，因此您
// 需要将其转换为可用的密钥对。
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

// 在 Umi 使用此密钥对之前，您需要用它
// 生成一个 Signer 类型。
const signer = createSignerFromKeypair(umi, keypair);

// 告诉 Umi 使用新签名者。
umi.use(signerIdentity(signer))
```

{% /totem-accordion %}

{% totem-accordion title="从使用 Wallet Adapter 保存的现有钱包" %}

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { useWallet } from '@solana/wallet-adapter-react'

const wallet = useWallet()

const umi = createUmi('https://api.devnet.solana.com')

// 将 Wallet Adapter 注册到 Umi
umi.use(walletAdapterIdentity(wallet))
```

{% /totem-accordion %}

{% /totem %}

**注意**：**Umi** 接口存储两个 **Signer** 实例：使用应用程序的 **identity** 和支付交易和存储费用的 **payer**。默认情况下，`signerIdentity` 方法也会更新 **payer** 属性，因为在大多数情况下，identity 也是 payer。

如果您想了解更多，请访问 [Umi 上下文接口段落](/zh/dev-tools/umi/interfaces#context-接口)

### 注册程序和客户端

在某些情况下，Umi 要求您指定要使用的程序或客户端（例如，铸造 Core 资产时，您需要告诉 Umi 使用 `Core` 程序）。您可以通过在 Umi 实例上调用 `.use()` 方法并传入客户端来完成此操作。

以下是如何向 Umi 注册 `mpl-token-metadata` 客户端：

```ts
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplTokenMetadata())
```

**注意**：您还可以链接 `.use()` 调用来注册多个客户端，如下所示：

```ts
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import { mplCandyMachine } from '@metaplex-foundation/mpl-candy-machine'

const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(mplTokenMetadata())
  .use(mplCandyMachine())
```
