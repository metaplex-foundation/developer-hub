---
title: JavaScriptを使った開始方法
metaTitle: JavaScript SDK | Inscription
description: JavaScriptを使ったInscriptionの開始方法
---

MetaplexはMetaplex Inscriptionとの相互作用に使用できるJavaScriptライブラリを提供しています。[Umiフレームワーク](https://github.com/metaplex-foundation/umi)のおかげで、多くの固有の依存関係なしで出荷され、どのJavaScriptプロジェクトでも使用できる軽量ライブラリを提供します。

開始するには、[Umiフレームワーク](https://github.com/metaplex-foundation/umi/blob/main/docs/installation.md)とInscriptions JavaScriptライブラリをインストールする必要があります。

```sh
npm install \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults \
  @solana/web3.js@1 \
  @metaplex-foundation/mpl-inscription
```

次に、`Umi`インスタンスを作成し、以下のように`mplInscription`プラグインをインストールします。

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplInscription } from '@metaplex-foundation/mpl-inscription'

// お好みのRPCエンドポイントを使用してください。
const umi = createUmi('http://127.0.0.1:8899').use(mplInscription())
```

次に、どのウォレットを使用するかをUmiに伝えます。これは[キーペア](/ja/dev-tools/umi/getting-started#connecting-w-a-secret-key)または[solana wallet adapter](/ja/dev-tools/umi/getting-started#connecting-w-wallet-adapter)のいずれかにできます。

これで、[ライブラリが提供するさまざまな関数](https://mpl-inscription.typedoc.metaplex.com/)を使用し、`Umi`インスタンスを渡すことでInscriptionと相互作用できます。以下は、小さなJSONファイルが添付されたシンプルなinscriptionをミントし、inscriptionのデータを取得してinscriptionランクを印刷する例です。

```ts
// ステップ1: NFTまたはpNFTをミント
// https://metaplex.com/docs/ja/smart-contracts/token-metadata/mint を参照

// ステップ2: JSONをInscribe

const inscriptionAccount = await findMintInscriptionPda(umi, {
  mint: mint.publicKey,
})
const inscriptionMetadataAccount = await findInscriptionMetadataPda(umi, {
  inscriptionAccount: inscriptionAccount[0],
})

await initializeFromMint(umi, {
  mintAccount: mint.publicKey,
})
  .add(
    writeData(umi, {
      inscriptionAccount,
      inscriptionMetadataAccount,
      value: Buffer.from(
        JSON.stringify(metadata) // inscribeされるNFTのJSON
      ),
      associatedTag: null,
      offset: 0,
    })
  )
  .sendAndConfirm(umi)

const inscriptionMetadata = await fetchInscriptionMetadata(
  umi,
  inscriptionMetadataAccount
)
console.log(
  'Inscription番号: ',
  inscriptionMetadata.inscriptionRank.toString()
)
```

🔗 **役に立つリンク:**

- [Umiフレームワーク](https://github.com/metaplex-foundation/umi)
- [GitHubリポジトリ](https://github.com/metaplex-foundation/mpl-inscription)
- [NPMパッケージ](https://www.npmjs.com/package/@metaplex-foundation/mpl-inscription)
- [APIリファレンス](https://mpl-inscription.typedoc.metaplex.com/)
