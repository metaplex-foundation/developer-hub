---
title: JavaScript SDK
metaTitle: JavaScript SDK | Genesis
description: 学习如何安装和配置Genesis JavaScript SDK以在Solana上发行代币。
---

Metaplex提供了一个用于与Genesis程序交互的JavaScript库。它基于[Umi框架](/zh/umi)构建，作为轻量级库发布，可在任何JavaScript或TypeScript项目中使用。

{% quick-links %}

{% quick-link title="API参考" target="_blank" icon="JavaScript" href="https://mpl-genesis.typedoc.metaplex.com/" description="Genesis JavaScript SDK生成的API文档。" /%}

{% quick-link title="NPM包" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/genesis" description="NPM上的Genesis JavaScript SDK。" /%}

{% quick-link title="GitHub" target="_blank" icon="GitHub" href="https://github.com/metaplex-foundation/genesis" description="Genesis程序和SDK源代码。" /%}

{% /quick-links %}

## 安装

安装Genesis SDK以及所需的Metaplex和Solana依赖：

```bash
npm install \
  @metaplex-foundation/genesis \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults \
  @metaplex-foundation/mpl-toolbox \
  @metaplex-foundation/mpl-token-metadata
```

### 包概述

| 包 | 用途 |
|---------|---------|
| `@metaplex-foundation/genesis` | 核心Genesis SDK，包含所有指令和辅助函数 |
| `@metaplex-foundation/umi` | Metaplex的Solana框架，用于构建交易 |
| `@metaplex-foundation/umi-bundle-defaults` | 默认Umi插件和配置 |
| `@metaplex-foundation/mpl-toolbox` | 用于处理SPL代币的工具 |
| `@metaplex-foundation/mpl-token-metadata` | 代币元数据程序集成 |

## Umi设置

Genesis SDK构建在[Umi](/zh/umi)之上，这是Metaplex的Solana JavaScript框架。如果您尚未设置Umi，请查看[Umi快速开始](/zh/umi/getting-started)指南。

### 基本配置

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { genesis } from '@metaplex-foundation/genesis';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';

// 创建并配置Umi实例
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(genesis())
  .use(mplTokenMetadata());
```

`genesis()`插件向Umi注册所有Genesis指令和账户反序列化器。`mplTokenMetadata()`插件是必需的，因为Genesis创建带有元数据的代币。

### 开发与生产环境

```typescript
// 开发：使用devnet
const umi = createUmi('https://api.devnet.solana.com')
  .use(genesis())
  .use(mplTokenMetadata());

// 生产：使用mainnet和可靠的RPC
const umi = createUmi('https://your-rpc-provider.com')
  .use(genesis())
  .use(mplTokenMetadata());
```

## 设置签名者

Genesis操作需要签名者进行交易授权。对于后端操作，您通常使用从环境变量加载的密钥对。

### 从密钥创建签名者

```typescript
import {
  createSignerFromKeypair,
  signerIdentity,
  type Signer,
  type Umi,
} from '@metaplex-foundation/umi';

// 从JSON编码的密钥创建签名者的辅助函数
const createSignerFromSecretKeyString = (
  umi: Umi,
  secretKeyString: string
): Signer => {
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  const keypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
  return createSignerFromKeypair(umi, keypair);
};

// 从环境加载后端签名者
const backendSigner = createSignerFromSecretKeyString(
  umi,
  process.env.BACKEND_KEYPAIR!
);

// 设置为交易的默认身份
umi.use(signerIdentity(backendSigner));
```

{% callout type="warning" %}
**安全提示**：永远不要将密钥对提交到版本控制。在生产部署中使用环境变量、AWS KMS、GCP Secret Manager或硬件钱包。
{% /callout %}

### 完整设置示例

以下是包含所有必需导入的完整设置：

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  createSignerFromKeypair,
  generateSigner,
  signerIdentity,
  publicKey,
  type Signer,
  type Umi,
} from '@metaplex-foundation/umi';
import {
  genesis,
  initializeV2,
  addLaunchPoolBucketV2,
  addUnlockedBucketV2,
  finalizeV2,
  findGenesisAccountV2Pda,
} from '@metaplex-foundation/genesis';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';

// 初始化Umi
const umi = createUmi('https://api.mainnet-beta.solana.com')
  .use(genesis())
  .use(mplTokenMetadata());

// 设置后端签名者
const createSignerFromSecretKeyString = (umi: Umi, secretKeyString: string): Signer => {
  const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
  const keypair = umi.eddsa.createKeypairFromSecretKey(secretKey);
  return createSignerFromKeypair(umi, keypair);
};

const backendSigner = createSignerFromSecretKeyString(umi, process.env.BACKEND_KEYPAIR!);
umi.use(signerIdentity(backendSigner));

console.log('Umi已配置后端签名者:', backendSigner.publicKey);
```

## 错误处理

```typescript
try {
  await initializeV2(umi, { ... }).sendAndConfirm(umi);
  console.log('成功！');
} catch (error) {
  if (error.message.includes('insufficient funds')) {
    console.error('交易费用SOL不足');
  } else if (error.message.includes('already initialized')) {
    console.error('Genesis账户已存在');
  } else {
    console.error('交易失败:', error);
  }
}
```

## 交易确认

```typescript
// 等待最终确认（最安全）
const result = await initializeV2(umi, { ... })
  .sendAndConfirm(umi, {
    confirm: { commitment: 'finalized' }
  });

console.log('交易签名:', result.signature);
```

## 后续步骤

配置好带有Genesis程序的Umi实例后，您就可以开始构建了。探索Genesis功能：

- **[发行池](/zh/smart-contracts/genesis/launch-pool)** - 带存款窗口的代币分配
- **[定价销售](/zh/smart-contracts/genesis/priced-sale)** - 交易前的预存款收集
- **[统一价格拍卖](/zh/smart-contracts/genesis/uniform-price-auction)** - 具有统一清算价格的基于时间的拍卖
