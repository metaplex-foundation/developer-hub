---
title: MPL-Core Javascript SDK
metaTitle: Javascript SDK | MPL-Core
description: MPL-Core Javascript SDKを実行するためのプロジェクトのセットアップ方法を学びます。
---

MetaplexはMPL-Coreプログラムとやり取りするために使用できるJavaScriptライブラリを提供しています。[Umiフレームワーク](/ja/dev-tools/umi)のおかげで、多くの強制的な依存関係なしに配布されるため、任意のJavaScriptプロジェクトで使用できる軽量なライブラリを提供します。

はじめに、[Umiフレームワークをインストール](/ja/dev-tools/umi/getting-started)し、MPL-Core JavaScriptライブラリをインストールする必要があります。

## インストール

インストールは任意のJSパッケージマネージャー（npm、yarn、bunなど）で実行できます。

```sh
npm install @metaplex-foundation/mpl-core
```

{% quick-links %}

{% quick-link title="typedoc" target="_blank" icon="JavaScript" href="https://mpl-core.typedoc.metaplex.com/" description="MPL-Core Javascript SDKで生成されたパッケージAPIドキュメント。" /%}

{% quick-link title="npmjs.com" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/mpl-core" description="NPMのMPL-Core Javascript SDK。" /%}

{% /quick-links %}

## Umiセットアップ

Metaplex Javascript SDKとやり取りするには`umi`インスタンスが必要です。まだ`umi`インスタンスをセットアップして設定していない場合は、[Umiはじめに](/ja/dev-tools/umi/getting-started)ページをチェックして、RPCエンドポイントと`umi`アイデンティティ/サイナーを設定できます。

`umi`インスタンスの初期化中に、以下を使用してmpl-coreパッケージを`umi`に追加できます：

```js
.use(mplCore())
```

`.use()`を使って、umiインスタンス作成の任意の場所に`mplCore()`パッケージを追加できます。

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCore } from '@metaplex-foundation/mpl-core'

// お好みのRPCエンドポイントを使用してください。
const umi = createUmi('http://api.devenet.solana.com')
... // 追加のumi設定、パッケージ、サイナー
.use(mplCore())
```

ここから、あなたの`umi`インスタンスはmpl-coreパッケージにアクセスでき、mpl-coreの機能セットを探索し始めることができます。