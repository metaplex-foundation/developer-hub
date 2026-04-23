---
# Remember to also update the date in src/components/products/guides/index.js
title: ストレージからの引き出し
metaTitle: ストレージからの引き出し | Metaplex CLI
description: ストレージプロバイダアカウントから資金をウォレットに引き出します。
keywords:
  - mplx CLI
  - storage withdraw
  - Irys
  - Arweave
  - storage provider
about:
  - Metaplex CLI
  - Storage Providers
proficiencyLevel: Beginner
created: '04-20-2026'
updated: '04-20-2026'
---

## 概要

`mplx toolbox storage withdraw`コマンドは、ストレージプロバイダアカウントからSOLをウォレットに引き出します。

- 特定のSOLの量を引き出すか、`--all`で残高全体を引き出します。
- `amount`または`--all`のいずれかが必要です — 両方は指定できません。
- 資金は、CLIペイヤーとして設定されたウォレットに返却されます。
- 成功すると、新しいストレージ残高を出力します。

## クイックリファレンス

以下の表は、コマンドの入力および関連コマンドをまとめたものです。

| 項目 | 値 |
|------|-------|
| コマンド | `mplx toolbox storage withdraw {<amount> \| --all}` |
| 入力 | `amount`（SOL）または`--all`のいずれか1つ — 相互排他 |
| デフォルトの受取人 | CLIペイヤーとして設定されたウォレット |
| プロバイダ | アクティブなストレージプロバイダ（例: Irys） |
| 逆操作 | [`toolbox storage fund`](/dev-tools/cli/toolbox/storage-fund) |

## 基本的な使用法

特定の値を引き出すには量を渡すか、`--all`を使用して残高全体を引き出します。

```bash
# 特定の量を引き出す
mplx toolbox storage withdraw <amount>

# すべての資金を引き出す
mplx toolbox storage withdraw --all
```

## 引数

唯一の位置引数は、`--all`が設定されていない場合の量を指定します。

- `amount` *(`--all`が設定されていない場合は必須)*: 引き出すSOLの量。

## フラグ

オプションフラグは残高全体を引き出します。

- `--all`: ストレージアカウントから残高全体を引き出します。

## 例

これらの例は、固定量と全額引き出しを示しています。

```bash
mplx toolbox storage withdraw 0.05
mplx toolbox storage withdraw --all
```

## 出力

成功すると、コマンドはストレージアカウントの新しい残高を出力します。

## 注意事項

- 量または`--all`のいずれかを指定してください — 両方は指定できません。
- 資金は、CLIペイヤーとして設定されたウォレットに返却されます。
- 現在の残高を確認するには[`toolbox storage balance`](/dev-tools/cli/toolbox/storage-balance)を使用してください。
