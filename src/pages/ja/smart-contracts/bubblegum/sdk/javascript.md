---
title: MPL-Bubblegum JavaScript SDK
metaTitle: JavaScript SDK | MPL-Bubblegum
description: MPL-Bubblegum JavaScript SDKを実行するためのプロジェクト設定方法を学びます。
---

MetaplexはMPL-BubblegumプログラムとやりとりするためのJavaScriptライブラリを提供しています。[Umiフレームワーク](/ja/umi)のおかげで、多くの独断的な依存関係なしに配布されるため、任意のJavaScriptプロジェクトで使用できる軽量なライブラリを提供します。

開始するには、[Umiフレームワークをインストール](/ja/umi/getting-started)し、MPL-Bubblegum JavaScriptライブラリをインストールする必要があります。

## インストール

インストールは、npm、yarn、bunなどの任意のJSパッケージマネージャーで実行できます。

```sh
npm install @metaplex-foundation/mpl-bubblegum
```

{% quick-links %}

{% quick-link title="typedoc" target="_blank" icon="JavaScript" href="https://mpl-bubblegum.typedoc.metaplex.com/" description="MPL-Bubblegum JavaScript SDK生成パッケージAPIドキュメント。" /%}

{% quick-link title="npmjs.com" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/MPL-Bubblegum" description="NPM上のMPL-Bubblegum JavaScript SDK。" /%}

{% /quick-links %}

## Umiセットアップ

Metaplex JavaScript SDKとやりとりするには`umi`インスタンスが必要です。まだ`umi`インスタンスをセットアップおよび設定していない場合は、[Umi入門](/ja/umi/getting-started)ページをチェックし、RPCエンドポイントと`umi`のidentity/signerを設定してください。

`umi`インスタンスの初期化中に、以下を使用してMPL-Bubblegumパッケージを`umi`に追加できます：

```js
.use(mplBubblegum())
```

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'

// 選択したRPCエンドポイントを使用します。
const umi = createUmi('http://api.devnet.solana.com')
... // 追加のumi設定、パッケージ、signers
.use(mplBubblegum())
```

ここから、あなたの`umi`インスタンスはMPL-Bubblegumパッケージにアクセスでき、MPL-Bubblegum機能セットの探索を開始できます。