---
title: Umi SDK 入门
metaTitle: Umi SDK | Token Metadata
description: 使用 Metaplex Token Metadata Umi SDK 开始使用 NFT。
---

**Umi SDK** (`@metaplex-foundation/mpl-token-metadata`) 基于 Metaplex 的 Umi 框架构建，提供用于与 Token Metadata 交互的流畅 API。 {% .lead %}

## 安装

```sh
npm install \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults \
  @solana/web3.js@1 \
  @metaplex-foundation/mpl-token-metadata
```

## 设置

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';

// 使用 Token Metadata 插件创建 Umi 实例
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplTokenMetadata());
```

### 连接钱包

{% totem %}
{% totem-accordion title="使用密钥对" %}

```ts
import { keypairIdentity } from '@metaplex-foundation/umi';

// 从密钥数组
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
umi.use(keypairIdentity(keypair));
```

{% /totem-accordion %}
{% totem-accordion title="使用 Wallet Adapter" %}

```ts
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';

// 使用 wallet adapter（React）
umi.use(walletAdapterIdentity(wallet));
```

{% /totem-accordion %}
{% /totem %}

## 创建 NFT

```ts
import { generateSigner, percentAmount } from '@metaplex-foundation/umi';
import { createNft } from '@metaplex-foundation/mpl-token-metadata';

// 生成新的铸币密钥对
const mint = generateSigner(umi);

// 创建 NFT
await createNft(umi, {
  mint,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: percentAmount(5.5),
}).sendAndConfirm(umi);

console.log('NFT created:', mint.publicKey);
```

## 获取 NFT

```ts
import { fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata';

const asset = await fetchDigitalAsset(umi, mintAddress);

console.log('Name:', asset.metadata.name);
console.log('URI:', asset.metadata.uri);
console.log('Seller Fee:', asset.metadata.sellerFeeBasisPoints);
```

## 有用的链接

- [Umi 框架文档](https://github.com/metaplex-foundation/umi)
- [GitHub 仓库](https://github.com/metaplex-foundation/mpl-token-metadata)
- [NPM 包](https://www.npmjs.com/package/@metaplex-foundation/mpl-token-metadata)
- [API 参考](https://mpl-token-metadata.typedoc.metaplex.com/)
