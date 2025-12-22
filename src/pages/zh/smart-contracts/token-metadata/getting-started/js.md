---
title: 使用 JavaScript 入门
metaTitle: JavaScript SDK | Token Metadata
description: 使用 Metaplex Token Metadata JavaScript SDK 开始使用 NFT。
---

Metaplex 提供了一个可用于与 NFT 交互的 JavaScript 库。借助 [Umi 框架](https://github.com/metaplex-foundation/umi),它没有许多固执己见的依赖项,因此提供了一个可在任何 JavaScript 项目中使用的轻量级库。

首先,您需要[安装 Umi 框架](https://github.com/metaplex-foundation/umi/blob/main/docs/installation.md)和 Token Metadata JavaScript 库。

```sh
npm install \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults \
  @solana/web3.js@1 \
  @metaplex-foundation/mpl-token-metadata
```

接下来,您可以像这样创建您的 `Umi` 实例并安装 `mplTokenMetadata` 插件。

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'

// Use the RPC endpoint of your choice.
const umi = createUmi('http://127.0.0.1:8899').use(mplTokenMetadata())
```
然后,您需要告诉 Umi 使用哪个钱包。这可以是[密钥对](/zh/umi/connecting-to-umi#connecting-w-a-secret-key)或 [solana 钱包适配器](/zh/umi/connecting-to-umi#connecting-w-wallet-adapter)。

就是这样,您现在可以通过使用[库提供的各种函数](https://mpl-token-metadata.typedoc.metaplex.com/)并将您的 `Umi` 实例传递给它们来与 NFT 交互。以下是创建 NFT 并获取其所有链上账户数据的示例。

```ts
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import {
  createNft,
  fetchDigitalAsset,
} from '@metaplex-foundation/mpl-token-metadata'

const mint = generateSigner(umi)
await createNft(umi, {
  mint,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: percentAmount(5.5),
}).sendAndConfirm(umi)

const asset = await fetchDigitalAsset(umi, mint.publicKey)
```

🔗 **有用的链接:**

- [Umi 框架](https://github.com/metaplex-foundation/umi)
- [GitHub 仓库](https://github.com/metaplex-foundation/mpl-token-metadata)
- [NPM 包](https://www.npmjs.com/package/@metaplex-foundation/mpl-token-metadata)
- [API 参考](https://mpl-token-metadata.typedoc.metaplex.com/)
