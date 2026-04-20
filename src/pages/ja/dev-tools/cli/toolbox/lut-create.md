---
# Remember to also update the date in src/components/products/guides/index.js
title: アドレスルックアップテーブルの作成
metaTitle: アドレスルックアップテーブルの作成 | Metaplex CLI
description: オプションの初期アドレス付きで、新しいSolanaアドレスルックアップテーブル（LUT）を作成します。
keywords:
  - mplx CLI
  - Address Lookup Table
  - LUT
  - create LUT
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

`mplx toolbox lut create`コマンドは、新しいSolanaアドレスルックアップテーブル（LUT）を作成し、アドレスが提供された場合は同一トランザクション内でそれを拡張します。

- 権限と最近のスロットからLUTアドレスを導出します。
- 初期エントリとして、カンマ区切りの公開鍵リスト（オプション）を受け付けます。
- `--authority`が渡されない限り、権限のデフォルトは現在のアイデンティティです。
- 成功すると、LUTアドレスとトランザクション署名を返します。

## クイックリファレンス

| 項目 | 値 |
|------|-------|
| コマンド | `mplx toolbox lut create [addresses]` |
| オプション引数 | `addresses` — 公開鍵のカンマ区切りリスト |
| オプションフラグ | `--recentSlot <number>`、`--authority <pubkey>` |
| LUTアドレス | `authority` + `recentSlot`から導出されるPDA |
| フォローアップ | [`toolbox lut fetch`](/dev-tools/cli/toolbox/lut-fetch)、[`toolbox lut deactivate`](/dev-tools/cli/toolbox/lut-deactivate)、[`toolbox lut close`](/dev-tools/cli/toolbox/lut-close) |

## 基本的な使用法

引数なしでコマンドを実行すると空のLUTが作成されます。公開鍵のカンマ区切りリストを渡して初期化することもできます。

```bash
# 空のLUTを作成
mplx toolbox lut create

# 初期アドレス付きのLUTを作成
mplx toolbox lut create "<pubkey1>,<pubkey2>"
```

## 引数

唯一の位置引数は、公開鍵のオプションのカンマ区切りリストです。

- `addresses` *(オプション)*: LUTに含める公開鍵のカンマ区切りリスト。

## フラグ

オプションフラグは、最近のスロットと権限のデフォルトを上書きします。

- `--recentSlot <number>`: LUT PDAの導出に使用する最近のスロット。デフォルトは最新スロットです。
- `--authority <pubkey>`: LUTの権限公開鍵。デフォルトは現在のアイデンティティです。

## 例

これらの例は、空、初期化済み、カスタム権限付きのLUT作成を示しています。

```bash
mplx toolbox lut create
mplx toolbox lut create "11111111111111111111111111111111,TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
mplx toolbox lut create "11111111111111111111111111111111" --authority <authority-pubkey>
```

## 出力

成功すると、コマンドは新しいLUTアドレスとトランザクション署名を出力します。

```
--------------------------------
Address Lookup Table Created
LUT Address: <lut_address>
Signature: <transaction_signature>
--------------------------------
```

## 注意事項

- LUTアドレスは、権限と最近のスロットから導出されるPDAです。
- 内容を読み戻すには[`toolbox lut fetch`](/dev-tools/cli/toolbox/lut-fetch)を使用してください。
- LUTを削除するには、まず[`toolbox lut deactivate`](/dev-tools/cli/toolbox/lut-deactivate)で無効化し、続いて[`toolbox lut close`](/dev-tools/cli/toolbox/lut-close)でクローズしてください。
