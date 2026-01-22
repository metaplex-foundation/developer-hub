---
title: Umi SDKを使用したはじめに
metaTitle: Umi SDK | Token Metadata
description: Metaplex Token Metadata Umi SDKを使用してNFTの開発を始めましょう。
---

**Umi SDK** (`@metaplex-foundation/mpl-token-metadata`) は MetaplexのUmiフレームワーク上に構築されており、Token Metadataとやり取りするための流暢なAPIを提供します。 {% .lead %}

## インストール

```sh
npm install \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults \
  @solana/web3.js@1 \
  @metaplex-foundation/mpl-token-metadata
```

## セットアップ

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';

// Token Metadataプラグインを使用してUmiインスタンスを作成
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplTokenMetadata());
```

### ウォレットの接続

{% totem %}
{% totem-accordion title="キーペアを使用する" %}

```ts
import { keypairIdentity } from '@metaplex-foundation/umi';

// シークレットキー配列から
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
umi.use(keypairIdentity(keypair));
```

{% /totem-accordion %}
{% totem-accordion title="Wallet Adapterを使用する" %}

```ts
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';

// wallet adapter（React）を使用
umi.use(walletAdapterIdentity(wallet));
```

{% /totem-accordion %}
{% /totem %}

## NFTの作成

```ts
import { generateSigner, percentAmount } from '@metaplex-foundation/umi';
import { createNft } from '@metaplex-foundation/mpl-token-metadata';

// 新しいミントキーペアを生成
const mint = generateSigner(umi);

// NFTを作成
await createNft(umi, {
  mint,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: percentAmount(5.5),
}).sendAndConfirm(umi);

console.log('NFT created:', mint.publicKey);
```

## NFTの取得

```ts
import { fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata';

const asset = await fetchDigitalAsset(umi, mintAddress);

console.log('Name:', asset.metadata.name);
console.log('URI:', asset.metadata.uri);
console.log('Seller Fee:', asset.metadata.sellerFeeBasisPoints);
```

## 役立つリンク

- [Umiフレームワークドキュメント](https://github.com/metaplex-foundation/umi)
- [GitHubリポジトリ](https://github.com/metaplex-foundation/mpl-token-metadata)
- [NPMパッケージ](https://www.npmjs.com/package/@metaplex-foundation/mpl-token-metadata)
- [APIリファレンス](https://mpl-token-metadata.typedoc.metaplex.com/)
