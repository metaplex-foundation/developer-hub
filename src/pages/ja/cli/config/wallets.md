---
title: ウォレット
description: ウォレット設定の管理
---

CLI内のウォレット設定を管理します。異なる目的のためにウォレットを追加、リスト表示、削除、アクティブ化できます。

## 基本的な使用法

```bash
# 新しいウォレットを作成
mplx config wallets new --name <name>

# 既存のウォレットを追加
mplx config wallets add <name> <keypairPath>

# すべてのウォレットをリスト表示
mplx config wallets list

# ウォレットを削除
mplx config wallets remove <name>

# アクティブなウォレットを設定
mplx config wallets set <name>
```

## コマンド

### 新しいウォレット

新しいウォレットを作成し、設定に追加します。

```bash
mplx config wallets new --name <name>
```

#### 引数

| 引数 | 説明 |
|----------|-------------|
| `--name` | ウォレットの一意の名前 |

#### 例

```bash
mplx config wallets new --name dev1
```

### ウォレットを追加

既存のウォレットを設定に追加します。

```bash
mplx config wallets add <name> <keypairPath>
```

#### 引数

| 引数 | 説明 |
|----------|-------------|
| `name` | ウォレットの一意の名前 |
| `keypairPath` | キーペアファイルへのパス |

#### 例

```bash
mplx config wallets add dev1 ~/.config/solana/devnet/dev1.json
```

### ウォレットをリスト表示

設定されたすべてのウォレットを表示します。

```bash
mplx config wallets list
```

#### 出力

```
--------------------------------
Wallets
--------------------------------
Name: dev1
Public Key: 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU
Active: true

Name: dev2
Public Key: 9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
Active: false
--------------------------------
```

### ウォレットを削除

設定からウォレットを削除します。

```bash
mplx config wallets remove <name>
```

#### 引数

| 引数 | 説明 |
|----------|-------------|
| `name` | 削除するウォレットの名前 |

#### 例

```bash
mplx config wallets remove dev2
```

### アクティブなウォレットを設定

設定のアクティブなウォレットを設定します。

```bash
mplx config wallets set <name>
```

#### 引数

| 引数 | 説明 |
|----------|-------------|
| `name` | アクティブとして設定するウォレットの名前 |

#### 例

```bash
mplx config wallets set dev1
```

## 設定ファイル

ウォレットは`~/.mplx/config.json`の設定ファイルに保存されます：

```json
{
  "wallets": {
    "dev1": {
      "publicKey": "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU",
      "keypairPath": "~/.config/solana/devnet/dev1.json",
      "active": true
    },
    "dev2": {
      "publicKey": "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
      "keypairPath": "~/.config/solana/devnet/dev2.json",
      "active": false
    }
  }
}
```

## 注意事項

- ウォレット名は大文字小文字を区別します
- 一度に1つのウォレットのみがアクティブになれます
- アクティブなウォレットはすべてのトランザクションに使用されます
- 異なる目的のために複数のウォレットを追加できます
- アクティブなウォレットを削除すると、利用可能な場合は自動的に他のウォレットがアクティブとして設定されます
- キーペアファイルは安全に保管し、決して共有しないでください

## 関連コマンド

- [RPCs](/jp/cli/config/rpcs) - RPCエンドポイントの管理
- [エクスプローラー](/jp/cli/config/explorer) - 推奨ブロックチェーンエクスプローラーの設定