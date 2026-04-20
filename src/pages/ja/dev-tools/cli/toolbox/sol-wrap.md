---
# Remember to also update the date in src/components/products/guides/index.js
title: SOLのラップ
metaTitle: SOLのラップ | Metaplex CLI
description: ネイティブSOLをwSOL（ラップされたSOL）トークンにラップします。
keywords:
  - mplx CLI
  - wrap SOL
  - wSOL
  - wrapped SOL
  - Solana
about:
  - Metaplex CLI
  - Wrapped SOL
proficiencyLevel: Beginner
created: '04-20-2026'
updated: '04-20-2026'
---

## 概要

`mplx toolbox sol wrap`コマンドは、SOLをネイティブmintの関連トークンアカウントに転送し残高を同期することで、ネイティブSOLをwSOLにラップします。

- wSOLの関連トークンアカウントがまだ存在しない場合は作成します。
- 指定された量を現在のアイデンティティのwSOL残高に追加します。
- 量はSOL単位で表記された正の数値である必要があります（小数点以下可）。
- [`toolbox sol unwrap`](/dev-tools/cli/toolbox/sol-unwrap)の逆操作です。

## クイックリファレンス

| 項目 | 値 |
|------|-------|
| コマンド | `mplx toolbox sol wrap <amount>` |
| 必須引数 | `amount` — SOLの量（例: `1`、`0.5`） |
| フラグ | なし |
| ネイティブmint | `So11111111111111111111111111111111111111112` |
| 逆操作 | [`toolbox sol unwrap`](/dev-tools/cli/toolbox/sol-unwrap) |

## 基本的な使用法

ラップするSOLの量を唯一の位置引数として渡します。

```bash
mplx toolbox sol wrap <amount>
```

## 引数

このコマンドは、量を指定する単一の位置引数を取ります。

- `amount` *(必須)*: ラップするSOLの量（例: `1`や`0.5`）。`0`より大きい必要があります。

## 例

これらの例は、整数と小数点付きの量を示しています。

```bash
mplx toolbox sol wrap 1
mplx toolbox sol wrap 0.5
```

## 出力

成功すると、コマンドはラップされた量、wSOLトークンアカウント、およびトランザクション署名を出力します。

```
--------------------------------
    Wrapped <amount> SOL to wSOL
    Token Account: <associated_token_account>
    Signature: <transaction_signature>
    Explorer: <explorer_url>
--------------------------------
```

## 注意事項

- 関連するwSOLトークンアカウントがまだ存在しない場合、同じトランザクションの一部として作成されます。
- ネイティブmintアドレスは`So11111111111111111111111111111111111111112`です。
- [`toolbox sol unwrap`](/dev-tools/cli/toolbox/sol-unwrap)でアンラップしてください。
