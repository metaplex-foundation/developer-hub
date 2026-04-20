---
# Remember to also update the date in src/components/products/guides/index.js
title: アドレスルックアップテーブルの無効化
metaTitle: アドレスルックアップテーブルの無効化 | Metaplex CLI
description: アドレスルックアップテーブル（LUT）をクローズする前の最初のステップとして無効化します。
keywords:
  - mplx CLI
  - Address Lookup Table
  - LUT
  - deactivate LUT
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

`mplx toolbox lut deactivate`コマンドはアドレスルックアップテーブルを無効化し、後でクローズしてそのレントを回収できるようにします。

- LUTに新しいアドレスを追加できないようにします。
- `toolbox lut close`でレントを回収する前に必須です。
- クローズが可能になるまで約512スロット（メインネットで約5分）待機します。
- LUTの権限のみがテーブルを無効化できます。

## クイックリファレンス

| 項目 | 値 |
|------|-------|
| コマンド | `mplx toolbox lut deactivate <address>` |
| 必須引数 | `address` — LUTの公開鍵 |
| オプションフラグ | `--authority <pubkey>` |
| クールダウン | LUTをクローズできるまで512スロット |
| 次のステップ | [`toolbox lut close`](/dev-tools/cli/toolbox/lut-close) |

## 基本的な使用法

LUTを無効化するには、そのアドレスを唯一の位置引数として渡します。

```bash
mplx toolbox lut deactivate <address>
```

## 引数

このコマンドは、LUTを識別する単一の位置引数を取ります。

- `address` *(必須)*: 無効化するLUTの公開鍵。

## フラグ

オプションフラグは、デフォルトの権限を上書きします。

- `--authority <pubkey>`: LUTの権限公開鍵。デフォルトは現在のアイデンティティです。

## 例

これらの例は、デフォルトおよびカスタム権限による無効化のフローを示しています。

```bash
mplx toolbox lut deactivate <address>
mplx toolbox lut deactivate <address> --authority <authority-pubkey>
```

## 出力

成功すると、コマンドは無効化されたLUTアドレスとトランザクション署名を出力します。

```
--------------------------------
Address Lookup Table Deactivated
LUT Address: <lut_address>
Signature: <transaction_signature>
--------------------------------
```

## 注意事項

- 無効化により、これ以上のアドレスの追加が防がれます。
- LUTがクローズできるまで、無効化後に約512スロット（メインネットで約5分）待つ必要があります。
- LUTの権限のみがLUTを無効化できます。
- 待機期間の経過後、[`toolbox lut close`](/dev-tools/cli/toolbox/lut-close)でLUTをクローズしてください。
