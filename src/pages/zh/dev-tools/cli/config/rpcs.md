---
title: RPC
metaTitle: RPC | Metaplex CLI
description: 在配置中管理 RPC 端点
---

在配置中管理 RPC 端点。您可以为不同的网络添加、列出、删除和设置活动 RPC。

## 基本用法

```bash
# 添加新的 RPC 端点
mplx config rpcs add <name> <endpoint>

# 列出所有 RPC 端点
mplx config rpcs list

# 删除 RPC 端点
mplx config rpcs remove <name>

# 设置活动 RPC 端点
mplx config rpcs set <name>
```

## 命令

### 添加 RPC

将新的 RPC 端点添加到您的配置中。

```bash
mplx config rpcs add <name> <endpoint>
```

#### 参数

| 参数 | 描述 |
|----------|-------------|
| `name` | RPC 端点的唯一名称(例如,'mainnet'、'devnet') |
| `endpoint` | RPC 端点 URL |

#### 示例

```bash
mplx config rpcs add mainnet https://api.mainnet-beta.solana.com
```

### 列出 RPC

显示所有已配置的 RPC 端点。

```bash
mplx config rpcs list
```

#### 输出

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

### 删除 RPC

从您的配置中删除 RPC 端点。

```bash
mplx config rpcs remove <name>
```

#### 参数

| 参数 | 描述 |
|----------|-------------|
| `name` | 要删除的 RPC 端点名称 |

#### 示例

```bash
mplx config rpcs remove devnet
```

### 设置活动 RPC

为您的配置设置活动 RPC 端点。

```bash
mplx config rpcs set <name>
```

#### 参数

| 参数 | 描述 |
|----------|-------------|
| `name` | 要设置为活动的 RPC 端点名称 |

#### 示例

```bash
mplx config rpcs set mainnet
```

## 配置文件

RPC 存储在 `~/.mplx/config.json` 的配置文件中:

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

## 注意事项

- RPC 名称区分大小写
- 一次只能有一个 RPC 处于活动状态
- 活动 RPC 用于所有网络操作
- 您可以为不同的网络添加多个 RPC
- 删除活动 RPC 将自动将另一个 RPC 设置为活动(如果可用)

## 相关命令

- [钱包](/zh/dev-tools/cli/config/wallets) - 管理钱包配置
- [浏览器](/zh/dev-tools/cli/config/explorer) - 设置首选区块链浏览器
