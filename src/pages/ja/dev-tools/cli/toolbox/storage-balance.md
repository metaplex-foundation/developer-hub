---
# Remember to also update the date in src/components/products/guides/index.js
title: ストレージ残高
metaTitle: ストレージ残高 | Metaplex CLI
description: ストレージプロバイダアカウントの現在の残高を表示します。
keywords:
  - mplx CLI
  - storage balance
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

`mplx toolbox storage balance`コマンドは、設定されたストレージプロバイダで保持されている現在の前払い残高を出力します。

- アクティブなストレージプロバイダ（例: Irys）から残高を読み取ります。
- 引数もフラグも取りません。
- `basisPoints`（lamports）とSOL建ての金額を含むJSONオブジェクトを出力します。
- ウォレットのSOL残高とは別です — ストレージクレジットのみを反映します。

## クイックリファレンス

| 項目 | 値 |
|------|-------|
| コマンド | `mplx toolbox storage balance` |
| 引数 | なし |
| フラグ | なし |
| 出力フォーマット | JSON |
| 入金 | [`toolbox storage fund`](/dev-tools/cli/toolbox/storage-fund) |
| 引き出し | [`toolbox storage withdraw`](/dev-tools/cli/toolbox/storage-withdraw) |

## 基本的な使用法

引数なしでコマンドを実行します。

```bash
mplx toolbox storage balance
```

## 例

このコマンドには単一の呼び出し形式があります。

```bash
mplx toolbox storage balance
```

## 出力

コマンドは、`basisPoints`（lamports）とSOL建ての金額を含むJSONとして残高を出力します。

## 注意事項

- ストレージ残高は、ストレージプロバイダ（例: Irys）で保持される前払いクレジットです。ウォレットのSOL残高とは別です。
- [`toolbox storage fund`](/dev-tools/cli/toolbox/storage-fund)で入金するか、[`toolbox storage withdraw`](/dev-tools/cli/toolbox/storage-withdraw)で引き出します。
