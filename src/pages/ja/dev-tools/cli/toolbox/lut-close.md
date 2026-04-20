---
# Remember to also update the date in src/components/products/guides/index.js
title: アドレスルックアップテーブルのクローズ
metaTitle: アドレスルックアップテーブルのクローズ | Metaplex CLI
description: 無効化されたアドレスルックアップテーブル（LUT）をクローズして、そのレントを回収します。
keywords:
  - mplx CLI
  - Address Lookup Table
  - LUT
  - close LUT
  - reclaim rent
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

`mplx toolbox lut close`コマンドは、以前に無効化されたアドレスルックアップテーブルをクローズし、そのレントを受取人ウォレットに返却します。

- LUTアカウントと、そこに格納されているすべてのアドレスを恒久的に削除します。
- LUTが少なくとも512スロット（メインネットで約5分）以上無効化されている必要があります。
- デフォルトでは現在のアイデンティティにレントを回収しますが、`--recipient`で指定することもできます。
- 現在のアイデンティティ（または`--authority`）がLUTの権限と一致する場合にのみ成功します。

## クイックリファレンス

以下の表は、コマンドの構文、前提条件、およびデフォルトをまとめたものです。

| 項目 | 値 |
|------|-------|
| コマンド | `mplx toolbox lut close <address>` |
| 必須引数 | `address` — LUTの公開鍵 |
| オプションフラグ | `--recipient <pubkey>`、`--authority <pubkey>` |
| 前提条件 | [`toolbox lut deactivate`](/dev-tools/cli/toolbox/lut-deactivate)でLUTを無効化済みであること |
| 最小待機時間 | 無効化後512スロット |
| 取り消し可否 | 不可 |

## 基本的な使用法

無効化されたLUTをクローズするには、そのアドレスを唯一の位置引数として渡します。

```bash
mplx toolbox lut close <address>
```

## 引数

このコマンドは、クローズするLUTを識別する単一の位置引数を取ります。

- `address` *(必須)*: クローズするLUTの公開鍵。

## フラグ

オプションフラグは、デフォルトの受取人と権限を上書きします。

- `--recipient <pubkey>`: 回収されるレントの受取人。デフォルトは現在のアイデンティティです。
- `--authority <pubkey>`: LUTの権限公開鍵。デフォルトは現在のアイデンティティです。

## 例

次の例は、一般的なクローズのシナリオをカバーしています。

```bash
mplx toolbox lut close <address>
mplx toolbox lut close <address> --recipient <recipient-pubkey>
mplx toolbox lut close <address> --authority <authority-pubkey>
```

## 出力

成功すると、コマンドはクローズされたLUTアドレスとトランザクション署名を出力します。

```
--------------------------------
Address Lookup Table Closed
LUT Address: <lut_address>
Signature: <transaction_signature>
--------------------------------
```

## 注意事項

- LUTは事前に[`toolbox lut deactivate`](/dev-tools/cli/toolbox/lut-deactivate)で無効化する必要があります。
- 無効化とクローズの間には、最低512スロット（メインネットで約5分）経過する必要があります。
- クローズは取り消し不可能です — LUTとそこに含まれるアドレスは恒久的に削除されます。
- LUTの権限のみがクローズできます。
