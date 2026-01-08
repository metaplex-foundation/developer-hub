---
title: MPL-Bubblegum V2 JavaScript SDK
metaTitle: JavaScript SDK | MPL-Bubblegum V2
description: MPL-Bubblegum V2 JavaScript SDKを実行するためのプロジェクト設定方法を学びます。
---

MetaplexはMPL-Bubblegumプログラムとの相互作用に使用できるJavaScriptライブラリを提供しています。[Umiフレームワーク](/ja/dev-tools/umi)のおかげで、多くの固有の依存関係なしに配布され、任意のJavaScriptプロジェクトで使用できる軽量なライブラリを提供します。

開始するには、[Umiフレームワークをインストール](/ja/dev-tools/umi/getting-started)し、MPL-Bubblegum JavaScriptライブラリをインストールする必要があります。

## インストール

インストールは任意のJavaScriptパッケージマネージャー（npm、yarn、bunなど）で実行できます。
```sh
npm install @metaplex-foundation/mpl-bubblegum
```

{% quick-links %}

{% quick-link title="typedoc" target="_blank" icon="JavaScript" href="https://mpl-bubblegum.typedoc.metaplex.com/" description="MPL-Bubblegum JavaScript SDK生成パッケージAPIドキュメント。" /%}

{% quick-link title="npmjs.com" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/mpl-bubblegum" description="NPM上のMPL-Bubblegum Javascript SDK。" /%}

{% /quick-links %}

## Umiのセットアップ

まだ`umi`インスタンスをセットアップして設定していない場合は、[Umiはじめに](/ja/dev-tools/umi/getting-started)ページをご確認ください。

`umi`インスタンスの初期化中に、以下を使用してMPL-Bubblegumパッケージを`umi`に追加できます

```js
.use(mplBubblegum())
```

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'

// お好みのRPCエンドポイントを使用してください。
const umi = createUmi('http://api.devnet.solana.com')
... // 追加のumi設定、パッケージ、署名者
.use(mplBubblegum())
```

ここから、`umi`インスタンスはMPL-Bubblegumパッケージにアクセスでき、その機能を探索できます。