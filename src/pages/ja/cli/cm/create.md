---
title: "キャンディマシンを作成"
metaTitle: "MPLX CLI - キャンディマシン作成コマンド"
description: "MPLX CLIを使用してMPL Coreキャンディマシンを作成します。検証、アセットアップロード、完全なセットアップ自動化を備えたインタラクティブウィザードモード。"
---

`mplx cm create`コマンドは、設定可能な設定とアセットアップロードを持つ新しいMPL Coreキャンディマシンを作成します。初心者向けのインタラクティブウィザードと上級ユーザー向けの手動設定の両方を提供します。

## 使用方法

```bash
# インタラクティブウィザード (推奨)
mplx cm create --wizard

# ディレクトリテンプレートを作成
mplx cm create --template

# 手動作成 (既存のcm-config.jsonが必要)
mplx cm create
```

## 前提条件アセット

選択したモード(ウィザードまたは手動)に関係なく、アセットを準備する必要があります。ダミーアセットで試したい場合は、`mplx cm create --template`を使用して作成できます。すべての画像とメタデータファイルは、独自の`assets`フォルダーにある必要があります。

*画像ファイル:*

- **フォーマット**: PNG、JPG
- **命名**: 連続的 (0.png、1.png、2.png、...)

*メタデータファイル:*

- **フォーマット**: JSON
- **命名**: 画像ファイルと一致 (0.json、1.json、2.json、...)
- **スキーマ**: 標準[Metaplex Coreメタデータフォーマット](/ja/core/json-schema)

*コレクションファイル:*

- **collection.png**: コレクション画像
- **collection.json**: コレクションメタデータ

## テンプレートモード

開始するための基本的なディレクトリ構造を作成します:

```bash
mplx cm create --template
```

これにより、以下の構造が作成されますが、キャンディマシンは作成されません。

```text
candy-machine-template/
├── assets/
│   ├── 0.png              # サンプル画像
│   ├── 0.json             # サンプルメタデータ
│   ├── collection.png     # サンプルコレクション画像
│   └── collection.json    # サンプルコレクションメタデータ
└── cm-config.json         # サンプル設定
```

テンプレート作成後:

1. サンプルアセットを実際のファイルに置き換える
2. `cm-config.json`の設定を更新
3. `mplx cm create`を実行してデプロイ

## インタラクティブウィザードモード

ウィザードは、包括的な検証と進行状況追跡を備えたガイド付きのユーザーフレンドリーな体験を提供します。**これはほとんどのユーザーに推奨されるアプローチです。**

### ウィザードワークフロー

1. プロジェクトセットアップ
2. アセット検出と検証
3. コレクション設定
4. キャンディマシンとキャンディガードの設定
5. アセットのアップロードと処理
6. キャンディマシンの作成
7. アイテムの挿入

## 手動設定モード

設定プロセスを完全に制御したい上級ユーザー向け。

### 前提条件

1. 適切な構造を持つ**キャンディマシンアセットディレクトリ**
2. 必要な設定を含む**手動作成された`cm-config.json`**。以下の例を参照
3. 以下に示す構造で`assets/`ディレクトリに**準備されたアセット**

### ディレクトリ構造

```text
my-candy-machine/
├── assets/
│   ├── 0.png
│   ├── 0.json
│   ├── 1.png
│   ├── 1.json
│   ├── ...
│   ├── collection.png
│   └── collection.json
└── cm-config.json          # 必須
```

### 設定ファイル形式

この構造で`cm-config.json`を作成します:

```json
{
  "name": "My Candy Machine",
  "config": {
    "collection": "CollectionPublicKey...",  // 既存のコレクション
    "itemsAvailable": 100,
    "isMutable": true,
    "isSequential": false,
    "guardConfig": {
      "solPayment": {
        "lamports": 1000000000,
        "destination": "111111111111111111111111111111111"
      },
      "mintLimit": {
        "id": 1,
        "limit": 1
      }
    },
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
      }
    ]
  }
}
```

### 手動ワークフロー

```bash
# 1. キャンディマシンディレクトリに移動
cd ./my-candy-machine

# 2. 既存の設定を使用してキャンディマシンを作成
mplx cm create

# 3. アセットをストレージにアップロード
mplx cm upload

# 4. アイテムをキャンディマシンに挿入
mplx cm insert

# 5. セットアップを検証 (オプション)
mplx cm validate
```

## 設定オプション

### コア設定

| 設定 | 説明 | 必須 |
|---------|-------------|----------|
| `name` | キャンディマシンの表示名 | ✅ |
| `itemsAvailable` | ミントする総アイテム数 | ✅ |
| `isMutable` | ミント後にNFTを更新できるか | ✅ |
| `isSequential` | アイテムを順番にミントするか | ✅ |
| `collection` | 既存のコレクションアドレス (オプション) | ❌ |

### ガード設定

**グローバルガード** (`guardConfig`):

- すべてのグループとキャンディマシン全体に適用
- グループガードによってオーバーライドできない
- 普遍的な制限に便利

**ガードグループ** (`groups`):

- 特定のグループにのみ適用
- ミントフェーズごとに異なるルールを許可
- グループラベルは最大6文字に制限

### 一般的なガードの例

#### 基本的なパブリックセール

```json
{
  "guardConfig": {
    "solPayment": {
      "lamports": 1000000000,
      "destination": "YourWalletAddress..."
    },
    "mintLimit": {
      "id": 1,
      "limit": 1
    }
  }
}
```

#### ホワイトリストフェーズ

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
          "destination": "YourWalletAddress..."
        }
      }
    }
  ]
}
```

### ヘルプの取得

- コマンドオプションについては`mplx cm create --help`を使用
- サポートについては[Metaplex Discord](https://discord.gg/metaplex)に参加

## 関連コマンド

- [`mplx cm upload`](/ja/cli/cm/upload) - アセットをストレージにアップロード
- [`mplx cm insert`](/ja/cli/cm/insert) - アイテムをキャンディマシンに挿入
- [`mplx cm validate`](/ja/cli/cm/validate) - アセットキャッシュを検証
- [`mplx cm fetch`](/ja/cli/cm/fetch) - キャンディマシン情報を表示

## 次のステップ

1. 手動で作成した場合は**[アセットをアップロード](/ja/cli/cm/upload)**
2. アセットをキャンディマシンにロードするために**[アイテムを挿入](/ja/cli/cm/insert)**
3. すべてが機能することを確認するために**[セットアップを検証](/ja/cli/cm/validate)**
4. 高度な設定については**[ガードについて学ぶ](/ja/core-candy-machine/guards)**
