---
# Remember to also update the date in src/components/products/guides/index.js
title: アドレスルックアップテーブルの取得
metaTitle: アドレスルックアップテーブルの取得 | Metaplex CLI
description: Solanaアドレスルックアップテーブル（LUT）の内容を取得して表示します。
keywords:
  - mplx CLI
  - Address Lookup Table
  - LUT
  - fetch LUT
  - Solana
about:
  - Metaplex CLI
  - Address Lookup Tables
  - Solana
proficiencyLevel: Intermediate
created: '04-20-2026'
updated: '04-20-2026'
---

## 概要

`mplx toolbox lut fetch`コマンドは、ネットワークから[アドレスルックアップテーブル](/dev-tools/umi/toolbox/address-lookup-table)を読み取り、その権限および含まれるアドレスを表示します。

- LUTアカウントを解決し、そこに保持されているすべてのアドレスを一覧表示します。
- 権限を表示します。凍結されたLUTの場合は`None`と表示します。
- verboseモードでは、無効化スロットおよび最終拡張スロットを追加で表示します。
- `--json`でマシン可読なJSON出力に対応しています。

## クイックリファレンス

以下の表は、コマンドの構文および出力モードをまとめたものです。

| 項目 | 値 |
|------|-------|
| コマンド | `mplx toolbox lut fetch <address>` |
| 必須引数 | `address` — LUTの公開鍵 |
| オプションフラグ | `--verbose`、`--json` |
| 読み取り専用 | はい — トランザクションは送信されません |

## 基本的な使用法

LUTを取得するには、そのアドレスを唯一の位置引数として渡します。

```bash
mplx toolbox lut fetch <address>
```

## 引数

このコマンドは、LUTを識別する単一の位置引数を取ります。

- `address` *(必須)*: 取得するLUTの公開鍵。

## フラグ

オプションフラグは出力を拡張します。

- `--verbose`: 追加の詳細（無効化スロット、最終拡張スロット）を表示します。
- `--json`: フォーマットされたテキストの代わりに構造化されたJSONを出力します。

## 例

これらの例は、デフォルト、verbose、JSONの各出力モードを示しています。

```bash
mplx toolbox lut fetch <address>
mplx toolbox lut fetch <address> --verbose
mplx toolbox lut fetch <address> --json
```

## 出力

デフォルトの出力は、権限、合計アドレス数、そしてテーブル内の各アドレスを一覧表示します。

```
--------------------------------
Address Lookup Table Details
LUT Address: <lut_address>
Authority: <authority_pubkey>
Total Addresses: <count>

Addresses in Table:
    1. <address1>
    2. <address2>
--------------------------------
```

## 注意事項

- `deactivationSlot`が`0`の場合、LUTはまだアクティブです。
- LUTを作成するには[`toolbox lut create`](/dev-tools/cli/toolbox/lut-create)を使用してください。
