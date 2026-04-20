---
# Remember to also update the date in src/components/products/guides/index.js
title: SOLのアンラップ
metaTitle: SOLのアンラップ | Metaplex CLI
description: すべてのwSOL（ラップされたSOL）トークンをネイティブSOLにアンラップします。
keywords:
  - mplx CLI
  - wSOL
  - wrapped SOL
  - unwrap SOL
  - Solana
about:
  - Metaplex CLI
  - Wrapped SOL
proficiencyLevel: Beginner
created: '04-20-2026'
updated: '04-20-2026'
---

## 概要

`mplx toolbox sol unwrap`コマンドは、関連トークンアカウントをクローズすることでwSOL残高全体をアンラップし、SOLを所有者に返却します。

- wSOLの関連トークンアカウントをクローズし、すべてのSOLをアイデンティティに返却します。
- 引数もフラグも取りません。
- オールオアナッシング — 部分的なアンラップはサポートされていません。
- 現在のウォレットにwSOLトークンアカウントが存在しない場合は失敗します。

## クイックリファレンス

| 項目 | 値 |
|------|-------|
| コマンド | `mplx toolbox sol unwrap` |
| 引数 | なし |
| フラグ | なし |
| ネイティブmint | `So11111111111111111111111111111111111111112` |
| 逆操作 | [`toolbox sol wrap`](/dev-tools/cli/toolbox/sol-wrap) |

## 基本的な使用法

引数なしでコマンドを実行すると、現在のウォレットのwSOL残高全体がアンラップされます。

```bash
mplx toolbox sol unwrap
```

## 例

このコマンドには単一の呼び出し形式があります。

```bash
mplx toolbox sol unwrap
```

## 出力

成功すると、コマンドはアンラップされた量、クローズされたトークンアカウント、およびトランザクション署名を出力します。

```
--------------------------------
    Unwrapped <amount> SOL
    Token Account Closed: <associated_token_account>
    Signature: <transaction_signature>
    Explorer: <explorer_url>
--------------------------------
```

## 注意事項

- アンラップはオールオアナッシングです — wSOL残高全体がSOLに戻され、トークンアカウントはクローズされます。
- 現在のウォレットにwSOLトークンアカウントが存在しない場合は失敗します。
- [`toolbox sol wrap`](/dev-tools/cli/toolbox/sol-wrap)でラップしてください。
