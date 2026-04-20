---
# Remember to also update the date in src/components/products/guides/index.js
title: トークンのミント
metaTitle: トークンのミント | Metaplex CLI
description: 既存のSPL mintから追加のトークンを受取人のウォレットにミントします。
keywords:
  - mplx CLI
  - mint tokens
  - SPL token
  - mint authority
  - Solana
about:
  - Metaplex CLI
  - SPL Token
proficiencyLevel: Beginner
created: '04-20-2026'
updated: '04-20-2026'
programmingLanguage:
  - Bash
---

## 概要

`mplx toolbox token mint`コマンドは、既存のSPLトークンの追加ユニットを受取人のウォレットにミントします。

- 現在のアイデンティティが、指定されたmintのミント権限を保持している必要があります。
- 受取人の関連トークンアカウントが存在しない場合、その場で作成します。
- `--recipient`が渡されない限り、受取人のデフォルトは現在のアイデンティティです。
- 量は生のトークン単位で表されます — 表示単位にするには`10^decimals`で割ってください。

## クイックリファレンス

| 項目 | 値 |
|------|-------|
| コマンド | `mplx toolbox token mint <mint> <amount>` |
| 必須引数 | `mint`、`amount`（`0`より大きい整数） |
| オプションフラグ | `--recipient <pubkey>` |
| 量の単位 | 生のトークン単位（表示単位ではない） |
| 関連項目 | [`toolbox token create`](/dev-tools/cli/toolbox/token-create) |

## 基本的な使用法

mintアドレスと量を位置引数として渡します。

```bash
mplx toolbox token mint <mint> <amount>
```

## 引数

このコマンドは、2つの位置引数を取ります。

- `mint` *(必須)*: トークンのmintアドレス。
- `amount` *(必須)*: ミントするトークンの数。`0`より大きい必要があります。

## フラグ

オプションフラグはデフォルトの受取人を上書きします。

- `--recipient <pubkey>`: ミントされたトークンを受け取るウォレット。デフォルトは現在のアイデンティティです。

## 例

これらの例は、現在のアイデンティティおよび特定の受取人へのミントを示しています。

```bash
mplx toolbox token mint 7EYnhQoR9YM3c7UoaKRoA4q6YQ2Jx4VvQqKjB5x8XqWs 1000
mplx toolbox token mint 7EYnhQoR9YM3c7UoaKRoA4q6YQ2Jx4VvQqKjB5x8XqWs 1000 --recipient 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
```

## 出力

成功すると、コマンドはmintアドレス、受取人、ミントされた量、およびトランザクション署名を出力します。

```
--------------------------------
Tokens minted successfully!

Mint Details:
Mint Address: <mint>
Recipient: <recipient>
Amount Minted: <amount>

Transaction Signature: <signature>
Explorer: <explorer_url>
--------------------------------
```

## 注意事項

- `amount`は生のトークン単位で表されます。表示単位で表すには`10^decimals`で割ってください。
- 受取人の関連トークンアカウントが存在しない場合、その場で作成されます。
- mintのミント権限を保持している必要があります — そうでない場合、トランザクションは失敗します。
- 新しいトークンを作成するには[`toolbox token create`](/dev-tools/cli/toolbox/token-create)を使用してください。
