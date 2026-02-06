---
title: トークンの作成
metaTitle: トークンの作成 | Metaplex CLI
description: Solanaで新しい代替可能トークンを作成
---

`mplx toolbox token create`コマンドを使用すると、Solanaで新しい代替可能トークンを作成できます。トークンは2つの方法で作成できます：インタラクティブウィザードを使用するか、必要な情報をすべて直接提供します。

## 基本的な使用法

### インタラクティブウィザード

```bash
mplx toolbox token create --wizard
```

### 直接作成

```bash
mplx toolbox token create --name "My Token" --symbol "TOKEN" --mint-amount 1000000
```

## オプション

### 必須オプション（ウィザードを使用しない場合）

- `--name <string>`: トークンの名前（例："My Awesome Token"）
- `--symbol <string>`: トークンシンボル（2-6文字、例："MAT"）
- `--mint-amount <number>`: ミントするトークンの初期量（0より大きい必要があります）

### オプションのオプション

- `--decimals <number>`: 小数点以下の桁数（0-9、デフォルト：0）
- `--description <string>`: トークンとその目的の説明
- `--image <path>`: トークン画像ファイルへのパス（PNG、JPG、またはGIF）
- `--speed-run`: 実行時間を測定するスピードランモードを有効化

## 例

### 基本情報でトークンを作成

```bash
mplx toolbox token create --name "My Token" --symbol "TOKEN" --mint-amount 1000000
```

### すべてのオプションでトークンを作成

```bash
mplx toolbox token create \
  --name "My Awesome Token" \
  --symbol "MAT" \
  --description "A token for awesome things" \
  --image ./token-image.png \
  --decimals 2 \
  --mint-amount 1000000
```

### ウィザードを使用してトークンを作成

```bash
mplx toolbox token create --wizard
```

## 出力

トークンの作成が成功した後、コマンドは以下を表示します：

```
--------------------------------
Token created successfully!

Token Details:
Name: <name>
Symbol: <symbol>
Decimals: <decimals>
Initial Supply: <formattedAmount>

Mint Address: <mintAddress>
Explorer: <explorerUrl>

Transaction Signature: <signature>
Explorer: <transactionExplorerUrl>
Execution Time: <time> seconds
--------------------------------
```

## 注意事項

- トークンシンボルは2-6文字の長さである必要があります
- ミント量は0より大きい必要があります
- 小数点は、トークンの最小単位を決定します（例：2小数点は100トークン = 100_00を意味）
- 画像ファイルはPNG、JPG、またはGIF形式である必要があります
- ウィザードは必要なフィールドすべてをインタラクティブにガイドします
- コマンドは自動的に以下を行います：
  - トークン画像をアップロード（提供された場合）
  - トークンメタデータを作成してアップロード
  - ブロックチェーン上にトークンを作成
  - 初期供給をミント
- トランザクション署名とミントアドレスは確認のために提供されます
- スピードランモードは実行時間を測定するために使用できます
