---
title: ファンジブルトークンを転送する
metaTitle: Solanaでファンジブルトークンを転送する方法 | トークン
description: JavaScriptとUmiを使用してSolana上でウォレット間でファンジブルSPLトークンを転送する方法を学びます
created: '11-25-2025'
updated: '11-25-2025'
---

Solanaブロックチェーン上でウォレット間でファンジブルトークン（SPLトークン）を転送します。 {% .lead %}

## トークンを転送する

以下のセクションでは、完全なコード例と変更が必要なパラメータを確認できます。トークン転送の詳細については、[Token Metadataプログラム](/token-metadata)ページをご覧ください。

{% code-tabs-imported from="token-metadata/fungibles/transfer" frameworks="umi" /%}

## パラメータ

転送に合わせて以下のパラメータをカスタマイズしてください：

| パラメータ | 説明 |
|-----------|-------------|
| `mintAddress` | トークンミントアドレス |
| `destinationAddress` | 受取人のウォレットアドレス |
| `amount` | 転送するトークン数 |

## 仕組み

転送プロセスには4つの手順が含まれます：

1. **送信元トークンアカウントを見つける** - `findAssociatedTokenPda`を使用して自分のトークンアカウントを特定
2. **宛先トークンアカウントを見つける** - 受取人のトークンアカウントを特定
3. **必要に応じて宛先トークンアカウントを作成** - `createTokenIfMissing`を使用して受取人がトークンアカウントを持っていることを確認
4. **トークンを転送** - `transferTokens`で転送を実行

## トークンアカウント

各ウォレットは、保有するトークンの種類ごとにAssociated Token Account（ATA）を持っています。`findAssociatedTokenPda`関数は、ウォレットアドレスとトークンミントに基づいてこれらのアカウントのアドレスを導出します。

`createTokenIfMissing`関数は、トークンアカウントがまだ存在しない場合は自動的に作成し、すでに存在する場合は何もしません。これにより、転送は常に成功します。
