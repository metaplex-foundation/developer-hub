---
title: MPL-Bubblegum V2 JavaScript SDK
metaTitle: JavaScript SDK - MPL-Bubblegum V2
description: MPL-Bubblegum V2 JavaScript SDKを実行するためのプロジェクト設定方法を学びます。
created: '01-15-2025'
updated: '02-24-2026'
keywords:
  - JavaScript SDK
  - TypeScript
  - Umi
  - MPL-Bubblegum
  - npm install
  - mplBubblegum
about:
  - Compressed NFTs
  - JavaScript SDK
  - Umi framework
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
---

## Summary

The **MPL-Bubblegum V2 JavaScript SDK** provides a lightweight library built on the Umi framework for creating and managing compressed NFTs from JavaScript/TypeScript applications.

- Install via npm: `npm install @metaplex-foundation/mpl-bubblegum`
- Register with Umi using `.use(mplBubblegum())`
- Includes the DAS API plugin automatically for fetching cNFTs

Metaplex provides a JavaScript library that can be used to interact with the MPL-Bubblegum program. Thanks to the [Umi framework](/dev-tools/umi), it ships without many opinionated dependencies, thus providing a lightweight library that can be used in any JavaScript project.

To get started, you'll need to [install the Umi framework](/dev-tools/umi/getting-started) and the MPL-Bubblegum JavaScript library.


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
