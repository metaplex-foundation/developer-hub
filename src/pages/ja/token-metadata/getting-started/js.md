---
title: JavaScriptを使用したはじめに
metaTitle: JavaScript SDK | Token Metadata
description: Metaplex Token Metadata JavaScript SDKを使用してNFTの開発を始めましょう。
---

MetaplexはNFTとのやり取りに使用できるJavaScriptライブラリを提供しています。[Umiフレームワーク](https://github.com/metaplex-foundation/umi)のおかげで、多くの意見を押し付ける依存関係なしで提供され、したがって任意のJavaScriptプロジェクトで使用できる軽量なライブラリを提供します。

はじめるために、[Umiフレームワークをインストール](https://github.com/metaplex-foundation/umi/blob/main/docs/installation.md)し、Token Metadata JavaScriptライブラリをインストールする必要があります。

```sh
npm install \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults \
  @solana/web3.js@1 \
  @metaplex-foundation/mpl-token-metadata
```

次に、`Umi`インスタンスを作成し、次のように`mplTokenMetadata`プラグインをインストールできます。

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'

// お好みのRPCエンドポイントを使用してください。
const umi = createUmi('http://127.0.0.1:8899').use(mplTokenMetadata())
```

次に、どのウォレットを使用するかをUmiに伝える必要があります。これは[キーペア](/jp/umi/connecting-to-umi#connecting-w-a-secret-key)または[solana wallet adapter](/jp/umi/connecting-to-umi#connecting-w-wallet-adapter)のいずれかです。

以上です。これで、[ライブラリが提供する様々な関数](https://mpl-token-metadata.typedoc.metaplex.com/)を使用し、それらに`Umi`インスタンスを渡すことでNFTとやり取りできます。NFTを作成し、そのすべてのオンチェーンアカウントのデータを取得する例は次のとおりです。

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

🔗 **役立つリンク:**

- [Umiフレームワーク](https://github.com/metaplex-foundation/umi)
- [GitHubリポジトリ](https://github.com/metaplex-foundation/mpl-token-metadata)
- [NPMパッケージ](https://www.npmjs.com/package/@metaplex-foundation/mpl-token-metadata)
- [APIリファレンス](https://mpl-token-metadata.typedoc.metaplex.com/)