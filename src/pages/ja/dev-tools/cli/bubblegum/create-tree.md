---
title: ツリー作成
metaTitle: マークルツリー作成 | Metaplex CLI
description: Metaplex CLIのmplx bg tree createコマンドで圧縮NFT用のBubblegum V2マークルツリーを作成します。--canopyDepth 0などのキャノピー深度オプションも解説します。
keywords:
  - mplx cli
  - bg tree create
  - Bubblegum V2
  - merkle tree
  - canopy depth
  - compressed NFTs
  - cNFT tree
about:
  - Bubblegum V2 Merkle tree creation
  - Metaplex CLI
proficiencyLevel: Beginner
created: '02-23-2026'
updated: '10-28-2026'
---

## 概要

`mplx bg tree create`コマンドは、圧縮NFT（cNFT）を保存する[Bubblegum V2](/smart-contracts/bubblegum-v2)の[マークルツリー](/smart-contracts/bubblegum-v2/concurrent-merkle-trees)を作成します。圧縮NFTをミントする前にツリーを作成する必要があります。

- `--wizard`でインタラクティブに、または`--maxDepth`、`--maxBufferSize`、`--canopyDepth`で直接ツリーを作成
- `--canopyDepth`には`0`（キャノピーなしのツリー）を含む任意の整数を指定可能（CLI 0.4.5以降）
- フラグの組み合わせが推奨設定に含まれない場合は警告を表示しますが、ツリーは作成されます
- ツリーサイズとキャノピー深度は作成時に固定され、後から変更できません

{% callout type="note" %}
これは**Bubblegum V2**ツリーを作成します。V2ツリーはV1と互換性がなく、[Metaplex Coreコレクション](/smart-contracts/core/collections)を使用します。
{% /callout %}

## 基本的な使い方

このコマンドは、インタラクティブウィザードとして実行するか、ツリーサイズの3つのフラグをすべて直接指定して実行します。

### インタラクティブウィザード（推奨）

```bash {% title="ウィザードでツリーを作成" %}
mplx bg tree create --wizard
```

### 直接作成

```bash {% title="フラグを指定してツリーを作成" %}
mplx bg tree create --maxDepth 14 --maxBufferSize 64 --canopyDepth 8 --name "my-tree"
```

直接作成するには、`--maxDepth`、`--maxBufferSize`、`--canopyDepth`の3つすべてが必要です。いずれかが欠けている場合、コマンドは`You must either use --wizard or provide all required flags: --maxDepth, --maxBufferSize, --canopyDepth`で終了します。

## オプション

ツリーサイズのフラグは`--wizard`と併用できません。

| オプション | 説明 |
|--------|-------------|
| `--wizard` | インタラクティブウィザードを使用してツリーを作成 |
| `--maxDepth <value>` | ツリーの最大深度（最大NFT数を決定） |
| `--maxBufferSize <value>` | 同時変更の最大バッファサイズ |
| `--canopyDepth <value>` | オンチェーンにキャッシュするツリー上位レベルの数。`0`も有効で、キャノピーなしのツリーを作成 |
| `--public` | ツリーをパブリックにする（誰でもNFTをミント可能） |
| `--name <value>` | 簡単に参照できる短い名前 |

## グローバルフラグ

これらのフラグはすべての`mplx`トランザクションコマンドで共通で、使用する設定、署名者、クラスターを制御します。

| フラグ | 説明 |
|------|-------------|
| `-c, --config <value>` | 設定ファイルのパス。デフォルトは`~/.config/mplx/config.json` |
| `-k, --keypair <value>` | キーペアファイルまたはレジャーへのパス（例：`usb://ledger?key=0`） |
| `-p, --payer <value>` | 支払者のキーペアファイルまたはレジャーへのパス |
| `-r, --rpc <value>` | クラスターのRPC URL |
| `--commitment <option>` | コミットメントレベル：`processed`、`confirmed`、または`finalized` |
| `--json` | JSON形式で出力 |
| `--log-level <option>` | ログレベル：`debug`、`warn`、`error`、`info`、または`trace`（デフォルト：`info`） |

## 推奨ツリー設定

CLIには7つの推奨設定が用意されており、ウィザードではこれらが選択肢として表示されます：

| 最大NFT数 | 最大深度 | バッファサイズ | キャノピー深度 | Txあたりのプルーフバイト数 | 推定コスト |
|----------|-----------|-------------|--------------|--------------------|----------------|
| 16,384 | 14 | 64 | 8 | 192 | ~0.34 SOL |
| 65,536 | 16 | 64 | 10 | 192 | ~0.71 SOL |
| 262,144 | 18 | 64 | 12 | 192 | ~2.10 SOL |
| 1,048,576 | 20 | 1024 | 13 | 224 | ~8.50 SOL |
| 16,777,216 | 24 | 2048 | 15 | 288 | ~26.12 SOL |
| 67,108,864 | 26 | 2048 | 17 | 288 | ~70.82 SOL |
| 1,073,741,824 | 30 | 2048 | 17 | 416 | ~72.65 SOL |

それ以外のフラグの組み合わせでもツリーは作成されますが、CLIは先に`This configuration is not in our recommended list. Use --wizard to see recommended configurations.`を表示します。

## キャノピーなしのツリー（`--canopyDepth 0`）

`--canopyDepth 0`を指定すると、プルーフノードをオンチェーンに一切キャッシュしないツリーが作成されます。ツリーアカウントが最小になり、レントも最も安くなります。その代わり、転送、バーン、デリゲート、更新のたびに完全なプルーフ（`maxDepth` × 32バイト）を送信する必要があります。そのためトランザクションの容量をより多く使い、Bubblegumの命令を他のプログラムと1つのトランザクションで組み合わせにくくなります。キャノピー深度ごとのコスト比較は[マークルツリーキャノピー](/smart-contracts/bubblegum-v2/merkle-tree-canopy)ページを参照してください。

```bash {% title="キャノピーなしのツリーを作成" %}
mplx bg tree create --maxDepth 14 --maxBufferSize 64 --canopyDepth 0 --name "no-canopy-tree"
```

{% callout type="note" %}
`--canopyDepth 0`には`@metaplex-foundation/cli` 0.4.5以降が必要です。キャノピーなしのツリーは推奨設定に含まれないため、CLIは作成前に「not in our recommended list」の警告を表示します。
{% /callout %}

## 例

ツリーを作成する代表的な方法は次のとおりです：

1. ウィザードを使用してツリーを作成：

   ```bash {% title="ウィザード" %}
   mplx bg tree create --wizard
   ```

1. テスト用の小さなツリーを作成：

   ```bash {% title="小さなテスト用ツリー" %}
   mplx bg tree create --maxDepth 14 --maxBufferSize 64 --canopyDepth 8 --name "test-tree"
   ```

1. パブリックツリーを作成（誰でもミント可能）：

   ```bash {% title="パブリックツリー" %}
   mplx bg tree create --maxDepth 14 --maxBufferSize 64 --canopyDepth 8 --public --name "public-tree"
   ```

## ツリー作成の出力

成功すると、ツリーアドレス、パラメータ、エクスプローラーリンクが表示されます：

```text {% title="出力例" %}
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

3つのパラメータが、ツリーの容量、同時に受け付けられる変更の数、各トランザクションに必要なプルーフデータの量を決めます：

- **最大深度**: NFTの最大数を決定：`2^maxDepth`（深度14 = 16,384 NFT）
- **最大バッファサイズ**: 同時に実行できる変更の数を制御
- **キャノピー深度**: ツリーの上位レベルをオンチェーンに保存するため、各トランザクションで送信するプルーフノードは`maxDepth - canopyDepth`個だけになります。`0`の場合は何も保存しません

## クイックリファレンス

| 項目 | 値 |
|------|-------|
| コマンド | `mplx bg tree create` |
| 必須（直接モード） | `--maxDepth`、`--maxBufferSize`、`--canopyDepth` |
| `--canopyDepth`の最小値 | `0`（CLI 0.4.5以降） |
| ツリーバージョン | [Bubblegum V2](/smart-contracts/bubblegum-v2)のみ（Bubblegum V1は非対応） |
| 次のステップ | [圧縮NFTを作成](/dev-tools/cli/bubblegum/create-cnft) |
| ソース | [GitHub: metaplex-foundation/cli](https://github.com/metaplex-foundation/cli) |

## 注意事項

- ツリー名はネットワークごとに一意である必要があります（devnet/mainnet）
- ツリー名には文字、数字、ハイフン、アンダースコア、スペースを含めることができます（1-50文字）
- レントコストはツリー作成時に一度だけ支払います
- ツリーは作成後にサイズ変更できず、キャノピー深度も変更できません
- 0.4.5より前のCLIは`--canopyDepth 0`を受け付けません。`mplx --version`でバージョンを確認してください
- **警告**: パブリックツリーでは誰でもNFTをミントできます - 注意して使用してください
