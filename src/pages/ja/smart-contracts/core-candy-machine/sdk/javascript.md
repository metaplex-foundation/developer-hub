---
title: MPL Core Candy Machine JavaScript SDK
metaTitle: JavaScript SDK | MPL Core Candy Machine
description: Umiフレームワークを使用してMPL Core Candy Machine JavaScript SDKをインストールおよび設定し、Solana上でCandy Machineを作成・管理する方法を学びます。
keywords:
  - core candy machine
  - javascript sdk
  - mpl-core-candy-machine
  - umi framework
  - solana nft
  - candy machine javascript
  - metaplex sdk
  - nft minting
  - npm package
  - typescript
  - candy machine setup
about:
  - JavaScript SDK
  - Umi framework
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
---

## Summary

MPL Core Candy Machine JavaScript SDKは、[Umiフレームワーク](/ja/dev-tools/umi)を使用してSolana上でCore Candy Machineを作成・管理するための軽量なライブラリを提供します。 {% .lead %}

- npm、yarn、またはbunで`@metaplex-foundation/mpl-core-candy-machine`パッケージをインストール
- RPCエンドポイントと署名者が設定された[Umi](/ja/dev-tools/umi/getting-started)インスタンスが必要
- `.use(mplCandyMachine())`でUmiインスタンスにSDKをプラグインとして登録
- JavaScriptまたはTypeScriptプロジェクトと互換性あり

## インストール

`@metaplex-foundation/mpl-core-candy-machine`パッケージは、npm、yarn、bunなど、あらゆるJavaScriptパッケージマネージャーでインストールできます。

```sh
npm install @metaplex-foundation/mpl-core-candy-machine
```

{% quick-links %}

{% quick-link title="typedoc" target="_blank" icon="JavaScript" href="https://mpl-core-candy-machine.typedoc.metaplex.com/" description="MPL Core Candy Machine Javascript SDKの生成されたパッケージAPIドキュメント。" /%}

{% quick-link title="npmjs.com" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/mpl-core-candy-machine" description="NPM上のMPL Core Candy Machine Javascript SDK。" /%}

{% /quick-links %}

## Umiセットアップ

Core Candy Machine SDKを操作する前に、設定済みの[Umi](/ja/dev-tools/umi/getting-started)インスタンスが必要です。まだUmiをセットアップしていない場合は、[Umi入門](/ja/dev-tools/umi/getting-started)ページでRPCエンドポイントとアイデンティティ署名者の設定方法を確認してください。

`umi`インスタンスの初期化中に、以下を使用してmpl-coreパッケージを`umi`に追加できます。

```js
.use(mplCandyMachine())
```

`mplCandyMachine()`パッケージは、`.use()`を使用してumiインスタンス作成のどこにでも追加できます。

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine'

// Use the RPC endpoint of your choice.
const umi = createUmi('http://api.devnet.solana.com')
... // additional umi settings, packages, and signers
.use(mplCandyMachine())
```

ここから、あなたの`umi`インスタンスはmpl-coreパッケージにアクセスできるようになり、Core Candy Machineの機能セットを探索し始めることができます。

## Notes

- JavaScript SDKは、ピア依存関係として[Umiフレームワーク](/ja/dev-tools/umi)が必要です。このSDKを使用する前に、Umiのインストールと設定が必要です。
- Solana RPCエンドポイントが必要です。本番デプロイメントでは、パブリックエンドポイントではなく、専用のRPCプロバイダーを使用してください。
- このSDKは、Core Candy MachineプログラムとCore Candy Guardプログラムの両方を単一パッケージでカバーします。

*[Metaplex](https://github.com/metaplex-foundation/mpl-core-candy-machine)によりメンテナンス · 最終確認 2026年3月*
