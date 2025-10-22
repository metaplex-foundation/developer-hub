---
title: MPL-Hybrid Javascript SDK
metaTitle: Javascript SDK | MPL-Hybrid
description: MPL-Hybrid Javascript SDKを実行するためのプロジェクト設定方法を学びましょう。
---

MetaplexはMPL-Hybrid 404プログラムとやり取りするために使用できるJavaScriptライブラリを提供しています。[Umiフレームワーク](/ja/umi)のおかげで、多くの意見的な依存関係なしで出荷されるため、任意のJavaScriptプロジェクトで使用できる軽量なライブラリを提供します。

開始するには、[Umiフレームワークをインストール](/ja/umi/getting-started)し、MPL-Hybrid JavaScriptライブラリをインストールする必要があります。

## インストール

インストールは任意のJSパッケージマネージャー（npm、yarn、bunなど）で実行できます...

```sh
npm install @metaplex-foundation/mpl-hybrid
```

## Umiセットアップ


Metaplex Javascript SDKとやり取りするには`umi`インスタンスが必要です。まだ`umi`インスタンスを設定・構成していない場合は、[Umiスタートガイド](/ja/umi/getting-started)ページをご覧ください。


`umi`インスタンスの初期化中に、以下を使用してmpl-hybridパッケージを`umi`に追加できます

```js
.use(mplHybrid())
```

`mplHybrid()`パッケージはumiインスタンス作成のどこにでも追加できます。
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplHybrid } from '@metaplex-foundation/mpl-hybrid'

// 任意のRPCエンドポイントを使用してください。
const umi = createUmi('http://api.devenet.solana.com')
... // 追加のumi設定とパッケージ
.use(mplHybrid())
```

ここから`umi`インスタンスはmpl-hybridパッケージにアクセスできます。