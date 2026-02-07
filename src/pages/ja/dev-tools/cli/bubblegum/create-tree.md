---
title: ツリー作成
metaTitle: マークルツリー作成 | Metaplex CLI
description: 圧縮NFT用のマークルツリーを作成する
---

`mplx bg tree create`コマンドは、圧縮NFTを保存するマークルツリーを作成します。圧縮NFTをミントする前にツリーを作成する必要があります。

{% callout type="note" %}
これは**Bubblegum V2**ツリーを作成します。V2ツリーはV1と互換性がなく、[Metaplex Coreコレクション](/smart-contracts/core/collections)を使用します。
{% /callout %}

## 基本的な使い方

### インタラクティブウィザード（推奨）

```bash
mplx bg tree create --wizard
```

### 直接作成

```bash
mplx bg tree create --maxDepth 14 --maxBufferSize 64 --canopyDepth 8 --name "my-tree"
```

## オプション

| オプション | 説明 |
|--------|-------------|
| `--wizard` | インタラクティブウィザードを使用してツリーを作成 |
| `--maxDepth <value>` | ツリーの最大深度（最大NFT数を決定） |
| `--maxBufferSize <value>` | 同時変更の最大バッファサイズ |
| `--canopyDepth <value>` | 検証最適化のためのキャノピー深度 |
| `--public` | ツリーをパブリックにする（誰でもNFTをミント可能） |
| `--name <value>` | 簡単に参照できる短い名前 |

## グローバルフラグ

| フラグ | 説明 |
|------|-------------|
| `-c, --config <value>` | 設定ファイルのパス。デフォルトは`~/.config/mplx/config.json` |
| `-k, --keypair <value>` | キーペアファイルまたはレジャーへのパス（例：`usb://ledger?key=0`） |
| `-r, --rpc <value>` | クラスターのRPC URL |
| `--json` | JSON形式で出力 |

## ツリー設定

CLIは、異なるコレクションサイズに最適化された推奨設定を提供します：

| 最大NFT数 | 最大深度 | バッファサイズ | キャノピー深度 | 推定コスト |
|----------|-----------|-------------|--------------|----------------|
| 16,384 | 14 | 64 | 8 | ~0.34 SOL |
| 65,536 | 16 | 64 | 10 | ~0.71 SOL |
| 262,144 | 18 | 64 | 12 | ~2.10 SOL |
| 1,048,576 | 20 | 1024 | 13 | ~8.50 SOL |
| 16,777,216 | 24 | 2048 | 15 | ~26.12 SOL |

## 例

1. ウィザードを使用してツリーを作成：

   ```bash
   mplx bg tree create --wizard
   ```

1. テスト用の小さなツリーを作成：

   ```bash
   mplx bg tree create --maxDepth 14 --maxBufferSize 64 --canopyDepth 8 --name "test-tree"
   ```

1. パブリックツリーを作成（誰でもミント可能）：

   ```bash
   mplx bg tree create --maxDepth 14 --maxBufferSize 64 --canopyDepth 8 --public --name "public-tree"
   ```

## 出力

```text
--------------------------------
Tree Created Successfully!

Tree Name: my-collection-tree
Tree Address: 9hRvTxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Max Depth: 14
Max Buffer Size: 64
Canopy Depth: 8
Public Tree: No
Max NFTs: 16,384

Transaction: 5xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
Explorer: https://solscan.io/tx/5xxx...
Tree Explorer: https://solscan.io/account/9hRv...
--------------------------------
```

## ツリーパラメータの理解

- **最大深度**: NFTの最大数を決定：`2^maxDepth`（深度14 = 16,384 NFT）
- **最大バッファサイズ**: 同時に実行できる変更の数を制御
- **キャノピー深度**: プルーフの一部をオンチェーンに保存し、トランザクションサイズを削減

## 注意事項

- ツリー名はネットワークごとに一意である必要があります（devnet/mainnet）
- ツリー名には文字、数字、ハイフン、アンダースコア、スペースを含めることができます（1-50文字）
- レントコストはツリー作成時に一度だけ支払います
- ツリーは作成後にサイズ変更できません
- **警告**: パブリックツリーでは誰でもNFTをミントできます - 注意して使用してください
