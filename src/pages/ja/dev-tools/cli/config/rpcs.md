---
title: RPCs
metaTitle: RPCs | Metaplex CLI
description: 設定内のRPCエンドポイントの管理
---

設定内のRPCエンドポイントを管理します。異なるネットワーク用にRPCを追加、リスト表示、削除、アクティブ化できます。

## 基本的な使用法

```bash
# 新しいRPCエンドポイントを追加
mplx config rpcs add <name> <endpoint>

# すべてのRPCエンドポイントをリスト表示
mplx config rpcs list

# RPCエンドポイントを削除
mplx config rpcs remove <name>

# アクティブなRPCエンドポイントを設定
mplx config rpcs set <name>
```

## コマンド

### RPCを追加

設定に新しいRPCエンドポイントを追加します。

```bash
mplx config rpcs add <name> <endpoint>
```

#### 引数

| 引数 | 説明 |
|----------|-------------|
| `name` | RPCエンドポイントの一意の名前（例：'mainnet'、'devnet'） |
| `endpoint` | RPCエンドポイントのURL |

#### 例

```bash
mplx config rpcs add mainnet https://api.mainnet-beta.solana.com
```

### RPCをリスト表示

設定されたすべてのRPCエンドポイントを表示します。

```bash
mplx config rpcs list
```

#### 出力

```
--------------------------------
RPC Endpoints
--------------------------------
Name: mainnet
Endpoint: https://api.mainnet-beta.solana.com
Active: true

Name: devnet
Endpoint: https://api.devnet.solana.com
Active: false
--------------------------------
```

### RPCを削除

設定からRPCエンドポイントを削除します。

```bash
mplx config rpcs remove <name>
```

#### 引数

| 引数 | 説明 |
|----------|-------------|
| `name` | 削除するRPCエンドポイントの名前 |

#### 例

```bash
mplx config rpcs remove devnet
```

### アクティブなRPCを設定

設定のアクティブなRPCエンドポイントを設定します。

```bash
mplx config rpcs set <name>
```

#### 引数

| 引数 | 説明 |
|----------|-------------|
| `name` | アクティブとして設定するRPCエンドポイントの名前 |

#### 例

```bash
mplx config rpcs set mainnet
```

## 設定ファイル

RPCは`~/.mplx/config.json`の設定ファイルに保存されます：

```json
{
  "rpcs": {
    "mainnet": {
      "endpoint": "https://api.mainnet-beta.solana.com",
      "active": true
    },
    "devnet": {
      "endpoint": "https://api.devnet.solana.com",
      "active": false
    }
  }
}
```

## 注意事項

- RPC名は大文字小文字を区別します
- 一度に1つのRPCのみがアクティブになれます
- アクティブなRPCはすべてのネットワーク操作に使用されます
- 異なるネットワーク用に複数のRPCを追加できます
- アクティブなRPCを削除すると、利用可能な場合は自動的に他のRPCがアクティブとして設定されます

## 関連コマンド

- [ウォレット](/ja/dev-tools/cli/config/wallets) - ウォレット設定の管理
- [エクスプローラー](/ja/dev-tools/cli/config/explorer) - 推奨ブロックチェーンエクスプローラーの設定
