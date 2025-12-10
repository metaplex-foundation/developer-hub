---
title: "キャンディマシンコマンド"
metaTitle: "MPLX CLI - キャンディマシンコマンド"
description: "MPLX CLIを使用してMPL Coreキャンディマシンを作成および管理します。インタラクティブウィザード、アセットアップロード、完全なキャンディマシンのライフサイクル管理。"
---

MPLX CLIは、Solana上で**MPL Coreキャンディマシン**を作成および管理するための包括的なサポートを提供します。これらのコマンドを使用すると、設定可能なミントルールを持つNFTコレクションの作成、アセットのアップロード、直感的なコマンドラインインターフェイスを通じてキャンディマシン全体のライフサイクルを管理できます。

## クイックスタート

インタラクティブウィザードですぐに始めましょう:

```bash
mplx cm create --wizard
```

この単一のコマンドで、キャンディマシンを作成するためのすべてを処理します: アセットの検証、アップロード、ガード設定を含むキャンディマシンの作成、進行状況追跡を伴うアイテムの挿入。

## コマンド概要

| コマンド | 目的 | 主要機能 |
|---------|---------|--------------|
| [`create`](/ja/cli/cm/create) | 新しいキャンディマシンを作成 | インタラクティブウィザード、テンプレート生成、手動設定 |
| [`upload`](/ja/cli/cm/upload) | アセットをストレージにアップロード | インテリジェントキャッシング、進行状況追跡、検証 |
| [`insert`](/ja/cli/cm/insert) | キャンディマシンにアイテムを挿入 | スマートロード検出、バッチ処理 |
| [`validate`](/ja/cli/cm/validate) | アセットキャッシュを検証 | 包括的な検証、エラー報告 |
| [`fetch`](/ja/cli/cm/fetch) | キャンディマシン情報を取得 | 設定、ガード設定、ステータスの表示 |
| [`withdraw`](/ja/cli/cm/withdraw) | 引き出しと削除 | クリーンな引き出し、残高回復 |

## 主要機能

### インタラクティブウィザード

- **ガイド付きセットアップ**: ステップバイステップのキャンディマシン作成
- **アセット検証**: 包括的なファイルとメタデータの検証
- **進行状況追跡**: すべての操作のリアルタイムインジケーター
- **エラー回復**: 実行可能なガイダンス付きの詳細なエラーメッセージ

### インテリジェントアセット管理

- **スマートキャッシング**: 可能な限り既存のアップロードを再利用
- **バッチ処理**: 効率的なアセットのアップロードと挿入
- **ファイル検証**: 適切な命名とメタデータ形式を保証
- **コレクションサポート**: 自動コレクション作成

### 柔軟な設定

- **ガードサポート**: すべてのCore Candy Machineガードをサポート
- **ガードグループ**: 異なるルールで異なるミントフェーズを作成
- **テンプレート生成**: ディレクトリ構造の迅速なセットアップ
- **手動設定**: 上級ユーザーはカスタム設定を作成可能

## ディレクトリ構造

すべてのキャンディマシンコマンドは、以下の構造を持つ**キャンディマシンアセットディレクトリ**から動作します:

```text
my-candy-machine/
├── assets/
│   ├── 0.png              # 画像ファイル (PNG, JPG)
│   ├── 0.json             # メタデータファイル
│   ├── 1.png
│   ├── 1.json
│   ├── ...
│   ├── collection.png      # コレクション画像
│   └── collection.json     # コレクションメタデータ
├── asset-cache.json        # アセットアップロードキャッシュ (生成)
└── cm-config.json          # キャンディマシン設定 (ウィザード使用時に生成)
```

## ワークフローオプション

### オプション1: ウィザードモード (推奨)

初心者とほとんどのユースケースに最適:

```bash
mplx cm create --wizard
```

**実行内容:**

1. アセットと設定を検証
2. 進行状況追跡を伴うすべてのアセットをアップロード
3. オンチェーンでキャンディマシンを作成
4. トランザクション進行状況を伴うすべてのアイテムを挿入
5. 包括的な完了サマリーを提供

### オプション2: 手動モード (上級)

完全な制御を望む上級ユーザー向け:

```bash
# 1. ディレクトリと設定を手動でセットアップ
mkdir my-candy-machine && cd my-candy-machine
# (assets/ディレクトリを作成してアセットを追加)

# 2. アセットをアップロード
mplx cm upload

# 3. キャンディマシンを作成
mplx cm create

# 4. アイテムを挿入
mplx cm insert

# 5. 検証 (オプション)
mplx cm validate
```

## ガード設定

CLIはすべてのCore Candy Machineガードとガードグループをサポートしています:

### グローバルガード

```json
{
  "guardConfig": {
    "solPayment": {
      "lamports": 1000000000,
      "destination": "111111111111111111111111111111111"
    },
    "mintLimit": {
      "id": 1,
      "limit": 1
    }
  }
}
```

### ガードグループ (ミントフェーズ)

```json
{
  "groups": [
    {
      "label": "wl",
      "guards": {
        "allowList": {
          "merkleRoot": "MerkleRootHash..."
        },
        "solPayment": {
          "lamports": 500000000,
          "destination": "111111111111111111111111111111111"
        }
      }
    },
    {
      "label": "public",
      "guards": {
        "solPayment": {
          "lamports": 1000000000,
          "destination": "111111111111111111111111111111111"
        }
      }
    }
  ]
}
```

## 利用可能なガード

CLIはすべてのCore Candy Machineガードをサポートしています:

**ペイメントガード**: `solPayment`、`solFixedFee`、`tokenPayment`、`token2022Payment`、`nftPayment`、`assetPayment`、`assetPaymentMulti`

**アクセス制御**: `addressGate`、`allowList`、`nftGate`、`tokenGate`、`assetGate`、`programGate`、`thirdPartySigner`

**時間ベース**: `startDate`、`endDate`

**制限**: `mintLimit`、`allocation`、`nftMintLimit`、`assetMintLimit`、`redeemedAmount`

**バーンガード**: `nftBurn`、`tokenBurn`、`assetBurn`、`assetBurnMulti`

**特別**: `botTax`、`edition`、`vanityMint`

**フリーズガード**: `freezeSolPayment`、`freezeTokenPayment`

詳細なガードドキュメントについては、[Core Candy Machineガード](/ja/core-candy-machine/guards)リファレンスを参照してください。

## ベストプラクティス

### 🎯 ディレクトリの整理

- 各キャンディマシンを独自のディレクトリに保持
- 説明的なディレクトリ名を使用
- 一貫したアセット命名を維持 (0.png、1.pngなど)
- キャンディマシンディレクトリをバックアップ

### 📁 アセットの準備

- 一貫した命名を使用 (0.png、1.pngなど)
- メタデータJSONファイルが画像ファイルと一致することを確認
- 画像フォーマットを検証 (PNG、JPGサポート)
- ファイルサイズを適切に保つ (< 10MB推奨)
- 有効な「name」フィールドを持つcollection.jsonを含める

### ⚙️ 設定

- メインネット前にdevnetでテスト
- ガイド付き設定にはウィザードを使用
- 設定ファイルをバックアップ
- ガード設定を文書化
- 少なくとも1つのガードまたはガードグループの追加を検討

### 🚀 デプロイ

- キャンディマシンの作成を検証
- ミント機能をテスト
- トランザクションステータスを監視
- 検証用のエクスプローラーリンクを保持

## 関連ドキュメント

- [Core Candy Machine概要](/ja/core-candy-machine) - MPL Core Candy Machinesの理解
- [Core Candy Machineガード](/ja/core-candy-machine/guards) - 完全なガードリファレンス
- [CLIインストール](/ja/cli/installation) - MPLX CLIのセットアップ
- [CLI設定](/ja/cli/config/wallets) - ウォレットとRPCのセットアップ

## 次のステップ

1. まだの場合は**[CLIをインストール](/ja/cli/installation)**
2. ウィザードを使用して**[最初のキャンディマシンを作成](/ja/cli/cm/create)**
3. 高度なミントルールのために**[ガード設定を探索](/ja/core-candy-machine/guards)**
4. 段階的なローンチのために**[ガードグループについて学ぶ](/ja/core-candy-machine/guard-groups)**
