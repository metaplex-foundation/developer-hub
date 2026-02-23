---
title: ツリー一覧
metaTitle: マークルツリー一覧 | Metaplex CLI
description: 保存されたBubblegumマークルツリーをすべて表示する
---

`mplx bg tree list`コマンドは、作成してローカルに保存したすべてのマークルツリーを表示します。

## 基本的な使い方

```bash
mplx bg tree list
```

### ネットワークでフィルター

```bash
mplx bg tree list --network devnet
```

## オプション

| オプション | 説明 |
|--------|-------------|
| `--network <value>` | ネットワークでツリーをフィルター（mainnet, devnet, testnet, localnet） |

## グローバルフラグ

| フラグ | 説明 |
|------|-------------|
| `-c, --config <value>` | 設定ファイルのパス。デフォルトは`~/.config/mplx/config.json` |
| `--json` | JSON形式で出力 |

## 例

1. すべてのツリーを一覧表示：

   ```bash
   mplx bg tree list
   ```

1. devnetのツリーのみを一覧表示：

   ```bash
   mplx bg tree list --network devnet
   ```

1. mainnetのツリーのみを一覧表示：

   ```bash
   mplx bg tree list --network mainnet
   ```

## 出力

```text
Saved Trees:
┌─────────┬────────────────────────────────────────────┬─────────┬───────────┬────────┬────────────┐
│ Name    │ Address                                    │ Network │ Max NFTs  │ Public │ Created    │
├─────────┼────────────────────────────────────────────┼─────────┼───────────┼────────┼────────────┤
│ my-tree │ 9hRvTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   │ devnet  │ 16,384    │ No     │ 1/15/2025  │
│ prod    │ 7kPqYxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx   │ mainnet │ 1,048,576 │ No     │ 1/10/2025  │
└─────────┴────────────────────────────────────────────┴─────────┴───────────┴────────┴────────────┘

Total: 2 trees
```

## ツリー名の使用

名前を付けてツリーを保存すると、他のコマンドで名前で参照できます：

```bash
# ツリー名を使用
mplx bg nft create my-tree --wizard

# ツリーアドレスを使用（こちらも機能します）
mplx bg nft create 9hRvTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx --wizard
```

## 注意事項

- ツリーはネットワークごとに保存されるため、同じ名前が異なるネットワークに存在できます
- ツリーデータは`~/.config/mplx/trees.json`にローカルに保存されます
- ツリーが見つからない場合、コマンドは`mplx bg tree create --wizard`でツリーを作成することを提案します
