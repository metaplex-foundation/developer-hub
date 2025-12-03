---
title: ファンジブルトークン
metaTitle: ファンジブルトークン | Metaplex
description: Metaplex SDKを使用してSolana上でファンジブルトークンを作成・管理する方法を学びます。
---

Metaplex SDKを使用して、Solana上でファンジブルトークン（SPLトークン）を作成・管理します。 {% .lead %}

## 概要

ファンジブルトークンは、各ユニットが他のユニットと同一の交換可能なデジタル資産です。一般的な例には、暗号通貨、ロイヤリティポイント、ゲーム内通貨などがあります。Solanaでは、ファンジブルトークンはSPL Tokenプログラムを使用して作成され、メタデータはToken Metadataプログラムによって管理されます。

## できること

このセクションでは、一般的なトークン操作について初心者向けのガイドを提供します：

- **[トークンを作成する](/tokens/create-a-token)** - カスタムメタデータを持つ新しいファンジブルトークンを作成
- **[トークンデータを読み取る](/tokens/read-token)** - ブロックチェーンまたはDAS APIからトークン情報を取得
- **[トークンをミントする](/tokens/mint-tokens)** - 追加のトークンをミントして供給量を増加
- **[トークンを転送する](/tokens/transfer-a-token)** - ウォレット間でトークンを転送
- **[トークンメタデータを更新する](/tokens/update-token)** - トークンの名前、シンボル、または画像を更新
- **[トークンをバーンする](/tokens/burn-tokens)** - 流通からトークンを永久に削除

## 前提条件

始める前に、以下を確認してください：

- Node.js 16以上がインストールされていること
- トランザクション手数料用のSOLを持つSolanaウォレット
- JavaScript/TypeScriptの基本的な知識

## クイックスタート

必要なパッケージをインストールします：

```bash
npm install @metaplex-foundation/mpl-token-metadata @metaplex-foundation/mpl-toolbox @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults
```

その後、[トークンを作成する](/tokens/create-a-token)ガイドに従って、最初のファンジブルトークンを作成してください。

## さらに詳しく

より高度なトークン機能については、以下をご覧ください：

- [Token Metadataプログラム](/token-metadata) - Token Metadataプログラムの完全なドキュメント
- [MPL Toolbox](https://github.com/metaplex-foundation/mpl-toolbox) - 低レベルトークン操作
