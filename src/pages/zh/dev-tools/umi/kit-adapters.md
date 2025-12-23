---
title: '@solana/kit 适配器'
metaTitle: 'Umi - @solana/kit 适配器'
description: '在 Umi 和 @solana/kit 之间转换类型的适配器。'
---

新的 [`@solana/kit`](https://github.com/anza-xyz/kit) 库是 Solana 现代 JavaScript SDK 的一部分，与 [`@solana/web3.js`](https://github.com/solana-foundation/solana-web3.js/) 相比，提供了更好的类型安全性和性能。当同时使用 Umi 和 `@solana/kit` 时，您可能需要在它们各自的类型之间进行转换。

为了解决这个问题，Umi 在 [`@metaplex-foundation/umi-kit-adapters`](https://www.npmjs.com/package/@metaplex-foundation/umi-kit-adapters) 包中提供了适配器，允许您在 Umi 和 `@solana/kit` 之间转换类型。

## 安装和导入

安装适配器包：

```
npm i @metaplex-foundation/umi-kit-adapters
```

安装后，转换函数即可使用：


## 地址

Umi 和 `@solana/kit` 都使用 base58 字符串作为地址，使转换变得简单。

### 从 @solana/kit 到 Umi

```ts
import { address } from '@solana/kit';
import { fromKitAddress } from '@metaplex-foundation/umi-kit-adapters';

// 创建一个 Kit 地址
const kitAddress = address("11111111111111111111111111111112");

// 转换为 Umi PublicKey
const umiPublicKey = fromKitAddress(kitAddress);
```

### 从 Umi 到 @solana/kit

```ts
import { publicKey } from '@metaplex-foundation/umi';
import { toKitAddress } from '@metaplex-foundation/umi-kit-adapters';

// 创建一个 Umi PublicKey
const umiPublicKey = publicKey("11111111111111111111111111111112");

// 转换为 Kit 地址
const kitAddress = toKitAddress(umiPublicKey);
```

## 密钥对

转换密钥对需要处理每个库使用的不同格式。

### 从 @solana/kit 到 Umi

```ts
import { generateKeyPair } from '@solana/kit';
import { fromKitKeypair } from '@metaplex-foundation/umi-kit-adapters';

// 创建一个新的 Kit CryptoKeyPair 作为示例
const kitKeypair = await generateKeyPair();

// 转换为 Umi Keypair
const umiKeypair = await fromKitKeypair(kitKeypair);
```

### 从 Umi 到 @solana/kit

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { generateSigner } from '@metaplex-foundation/umi';
import { toKitKeypair } from '@metaplex-foundation/umi-kit-adapters';

// 创建 Umi 实例并生成示例密钥对
const umi = createUmi('https://api.devnet.solana.com');
const umiKeypair = generateSigner(umi);

// 转换为 Kit CryptoKeyPair
const kitKeypair = await toKitKeypair(umiKeypair);
```

## 指令

指令可以在两种格式之间转换，处理不同的账户角色系统。

### 从 @solana/kit 到 Umi

```ts
import { getSetComputeUnitLimitInstruction } from '@solana-program/compute-budget';
import { fromKitInstruction } from '@metaplex-foundation/umi-kit-adapters';

// 创建一个新的 Kit 指令作为示例
const kitInstruction = getSetComputeUnitLimitInstruction({ units: 500 });

// 转换为 Umi 指令
const umiInstruction = fromKitInstruction(kitInstruction);
```

### 从 Umi 到 @solana/kit

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { setComputeUnitPrice } from '@metaplex-foundation/mpl-toolbox';
import { toKitInstruction } from '@metaplex-foundation/umi-kit-adapters';

// 为示例创建一个新的 Umi 实例
const umi = createUmi('https://api.devnet.solana.com');

// 创建一个新的 Umi 指令作为示例
const umiInstruction = setComputeUnitPrice(umi, { microLamports: 1 });

// 转换为 Kit 指令
const kitInstruction = toKitInstruction(umiInstruction);
```

## 使用场景

这些适配器在以下情况下特别有用：

- 您想将 Umi 和 Metaplex 功能与 `@solana/kit` 一起使用
- 构建需要在 Solana 生态系统的不同部分之间互操作的应用程序
- 集成使用不同类型系统的现有代码

适配器确保类型安全并自动处理转换细节，使在同一项目中使用这两个库变得容易。
