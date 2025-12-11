---
title: JavaScriptを使ったはじめに
metaTitle: JavaScript SDK | キャンディマシン
description: JavaScriptを使ってキャンディマシンを始めましょう
---

Metaplexは、キャンディマシンとやり取りするために使用できるJavaScriptライブラリを提供しています。[Umiフレームワーク](https://github.com/metaplex-foundation/umi)のおかげで、多くの主観的な依存関係なしで提供され、任意のJavaScriptプロジェクトで使用できる軽量なライブラリを提供します。

始めるには、[Umiフレームワークをインストール](https://github.com/metaplex-foundation/umi/blob/main/docs/installation.md)し、キャンディマシンJavaScriptライブラリをインストールする必要があります。

```sh
npm install \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults \
  @solana/web3.js@1 \
  @metaplex-foundation/mpl-candy-machine
```

次に、`Umi`インスタンスを作成し、以下のように`mplCandyMachine`プラグインをインストールできます。

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCandyMachine } from '@metaplex-foundation/mpl-candy-machine'

// 選択したRPCエンドポイントを使用してください。
const umi = createUmi('http://127.0.0.1:8899').use(mplCandyMachine())
```

次に、使用するウォレットをUmiに伝える必要があります。これは[キーペア](/ja/umi/connecting-to-umi#connecting-w-a-secret-key)または[Solanaウォレットアダプター](/ja/umi/connecting-to-umi#connecting-w-wallet-adapter)のいずれかです。

これで完了です。[ライブラリが提供するさまざまな関数](https://mpl-candy-machine.typedoc.metaplex.com/)を使用し、`Umi`インスタンスを渡すことでNFTと相互作用できるようになりました。以下は、キャンディマシンアカウントとそれに関連するキャンディガードアカウントを取得する例です。

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  fetchCandyMachine,
  fetchCandyGuard,
} from '@metaplex-foundation/mpl-candy-machine'

const candyMachinePublicKey = publicKey('...')
const candyMachine = await fetchCandyMachine(umi, candyMachinePublicKey)
const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority)
```

🔗 **役立つリンク:**

- [Umiフレームワーク](https://github.com/metaplex-foundation/umi)
- [GitHubリポジトリ](https://github.com/metaplex-foundation/mpl-candy-machine)
- [NPMパッケージ](https://www.npmjs.com/package/@metaplex-foundation/mpl-candy-machine)
- [APIリファレンス](https://mpl-candy-machine.typedoc.metaplex.com/)