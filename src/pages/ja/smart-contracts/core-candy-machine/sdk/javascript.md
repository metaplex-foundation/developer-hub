---
title: MPL Core Candy Machine Javascript SDK
metaTitle: Javascript SDK | MPL Core Candy Machine
description: MPL Core Candy Machine Javascript SDKを実行するためのプロジェクト設定方法を学びます。
---

Metaplexは、MPL Core Candy Machineプログラムと対話するために使用できるJavaScriptライブラリを提供しています。[Umi Framework](/ja/dev-tools/umi)のおかげで、多くの独自の依存関係なしで出荷されるため、あらゆるJavaScriptプロジェクトで使用できる軽量なライブラリとなっています。

始めるには、[Umiフレームワークのインストール](/ja/dev-tools/umi/getting-started)とMPL-Core JavaScriptライブラリが必要です。

## インストール

インストールは、npm、yarn、bunなど、どのJSパッケージマネージャーでも実行できます。

```sh
npm install @metaplex-foundation/mpl-core-candy-machine
```

{% quick-links %}

{% quick-link title="typedoc" target="_blank" icon="JavaScript" href="https://mpl-core-candy-machine.typedoc.metaplex.com/" description="MPL Core Candy Machine Javascript SDKの生成されたパッケージAPIドキュメント。" /%}

{% quick-link title="npmjs.com" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/mpl-core-candy-machine" description="NPM上のMPL Core Candy Machine Javascript SDK。" /%}

{% /quick-links %}

## Umi セットアップ

Metaplex Javascript SDKと対話するには、`umi`インスタンスが必要です。まだ`umi`インスタンスをセットアップおよび設定していない場合は、[Umi入門](/ja/dev-tools/umi/getting-started)ページを確認して、RPCエンドポイントと`umi`のアイデンティティ/署名者を設定してください。

`umi`インスタンスの初期化中に、以下を使用してmpl-coreパッケージを`umi`に追加できます。

```js
.use(mplCandyMachine())
```

`mpCandyMachine()`パッケージは、`.use()`を使用してumiインスタンス作成のどこにでも追加できます。

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine'

// お好みのRPCエンドポイントを使用してください。
const umi = createUmi('http://api.devnet.solana.com')
... // 追加のumi設定、パッケージ、署名者
.use(mplCandyMachine())
```

ここから、あなたの`umi`インスタンスはmpl-coreパッケージにアクセスできるようになり、mpl-coreの機能セットを探索し始めることができます。
