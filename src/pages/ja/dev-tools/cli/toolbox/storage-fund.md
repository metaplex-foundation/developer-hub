---
# Remember to also update the date in src/components/products/guides/index.js
title: ストレージへの入金
metaTitle: ストレージへの入金 | Metaplex CLI
description: ストレージプロバイダアカウントにSOLを入金します。
keywords:
  - mplx CLI
  - storage fund
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

`mplx toolbox storage fund`コマンドは、ストレージプロバイダアカウントにSOLを預け入れ、以降のアップロードで利用可能なクレジットを確保します。

- 現在のCLIペイヤーからストレージプロバイダにSOLを転送します。
- 量はSOL単位で指定します（小数点以下可）。
- 成功すると、新しいストレージ残高を出力します。
- 大規模なアップロード前に実行することで、実行途中での入金プロンプトを回避できます。

## クイックリファレンス

| 項目 | 値 |
|------|-------|
| コマンド | `mplx toolbox storage fund <amount>` |
| 必須引数 | `amount` — 預け入れるSOLの量 |
| フラグ | なし |
| プロバイダ | アクティブなストレージプロバイダ（例: Irys） |
| 逆操作 | [`toolbox storage withdraw`](/dev-tools/cli/toolbox/storage-withdraw) |

## 基本的な使用法

預け入れるSOLの量を唯一の位置引数として渡します。

```bash
mplx toolbox storage fund <amount>
```

## 引数

このコマンドは、量を指定する単一の位置引数を取ります。

- `amount` *(必須)*: ストレージアカウントに預け入れるSOLの量。

## 例

これらの例は、小数点付きおよび整数SOLの入金を示しています。

```bash
mplx toolbox storage fund 0.1
mplx toolbox storage fund 1
```

## 出力

成功すると、コマンドはストレージアカウントの新しい残高を出力します。

## 注意事項

- 資金は、CLIペイヤーとして設定されたウォレットから転送されます。
- 現在の残高を確認するには[`toolbox storage balance`](/dev-tools/cli/toolbox/storage-balance)を使用してください。
- [`toolbox storage withdraw`](/dev-tools/cli/toolbox/storage-withdraw)で資金を引き出せます。
