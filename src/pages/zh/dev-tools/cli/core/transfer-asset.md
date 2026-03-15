---
title: 转移资产
metaTitle: 转移资产 | Metaplex CLI
description: 使用Metaplex CLI的mplx core asset transfer命令将MPL Core资产的所有权转移到新钱包。
keywords:
  - mplx cli
  - core asset transfer
  - MPL Core
  - transfer NFT
  - metaplex cli transfer
  - core transfer
about:
  - MPL Core Asset transfer
  - Metaplex CLI
proficiencyLevel: Beginner
created: '03-15-2026'
updated: '03-15-2026'
---

## 摘要

`mplx core asset transfer` 命令将 [MPL Core 资产](/core) 的所有权转移到新钱包。当资产属于某个合集时，合集账户会自动解析 — 无需额外标志。

- 将单个 Core 资产转移到指定的公钥
- 如果资产属于合集，自动检测并包含合集
- 调用者必须是当前所有者或授权的转移委托人
- 冻结的资产必须先解冻才能转移

## 基本用法

```bash {% title="转移资产" %}
mplx core asset transfer <assetId> <newOwner>
```

## 参数

| 参数 | 说明 |
|----------|-------------|
| `ASSET_ID` | 要转移的资产地址 |
| `NEW_OWNER` | 新所有者钱包的公钥 |

## 全局标志

| 标志 | 说明 |
|------|-------------|
| `-c, --config <value>` | 配置文件路径。默认为 `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | 密钥对文件或 Ledger 路径（例如：`usb://ledger?key=0`） |
| `-p, --payer <value>` | 付款方密钥对文件或 Ledger 路径 |
| `-r, --rpc <value>` | 集群的 RPC URL |
| `--commitment <option>` | 确认级别：`processed`、`confirmed` 或 `finalized` |
| `--json` | 将输出格式化为 JSON |
| `--log-level <option>` | 日志级别：`debug`、`warn`、`error`、`info` 或 `trace`（默认：`info`） |

## 示例

### 转移独立资产

```bash {% title="转移独立资产" %}
mplx core asset transfer 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa \
  9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
```

### 转移属于合集的资产

合集账户会从资产中自动解析 — 无需 `--collection` 标志。

```bash {% title="转移合集资产" %}
mplx core asset transfer BXBJbGGjMPBNKmRoUVGpMKFNMmvzfJTvEUqY1bBXqzNd \
  9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM
```

### 获取结构化 JSON 输出

```bash {% title="以 JSON 输出转移" %}
mplx core asset transfer <assetId> <newOwner> --json
```

返回：

```json {% title="JSON 响应" %}
{
  "asset": "<assetId>",
  "newOwner": "<newOwner>",
  "signature": "<transactionSignature>",
  "explorer": "<explorerUrl>"
}
```

## 快速参考

| 项目 | 值 |
|------|-------|
| 命令 | `mplx core asset transfer` |
| 适用范围 | 仅限 [MPL Core 资产](/core) — 不支持 Token Metadata NFT |
| 源码 | [GitHub — metaplex-foundation/cli](https://github.com/metaplex-foundation/cli) |

## 注意事项

- 运行此命令需要是资产的当前所有者或授权的[转移委托人](/core/plugins)
- 冻结的资产无法转移 — 必须先使用冻结/解冻[插件](/core/plugins)解冻
- 合集内的资产，合集账户会自动获取 — 无需手动 `--collection` 标志
- 此命令仅适用于 [MPL Core 资产](/core) — Token Metadata NFT 请使用其他转移指令

*由 Metaplex Foundation 维护 · 2026年3月最后验证 · 适用于 MPLX CLI 0.x*
