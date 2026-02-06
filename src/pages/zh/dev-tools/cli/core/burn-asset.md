---
title: 销毁资产
metaTitle: 销毁资产 | Metaplex CLI
description: 使用 Metaplex CLI 销毁 MPL Core 资产
---

`mplx core asset burn` 命令允许您永久销毁 MPL Core 资产并回收租金费用。您可以销毁单个资产或使用 JSON 列表文件一次销毁多个资产。

## 基本用法

### 销毁单个资产

```bash
mplx core asset burn <assetId>
```

### 从集合中销毁资产

```bash
mplx core asset burn <assetId> --collection <collectionId>
```

### 销毁多个资产

```bash
mplx core asset burn --list ./assets-to-burn.json
```

## 参数

| 参数 | 描述 |
|----------|-------------|
| `ASSET` | 要销毁的资产的铸币地址 |

## 选项

| 选项 | 描述 |
|--------|-------------|
| `--collection <value>` | 要从中销毁资产的集合 ID |
| `--list <value>` | 要销毁的资产 JSON 列表的文件路径（例如 `["asset1", "asset2"]`） |

## 全局标志

| 标志 | 描述 |
|------|-------------|
| `-c, --config <value>` | 配置文件路径。默认为 `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | 密钥对文件或硬件钱包路径（例如 `usb://ledger?key=0`） |
| `-p, --payer <value>` | 付款方密钥对文件或硬件钱包路径 |
| `-r, --rpc <value>` | 集群的 RPC URL |
| `--commitment <option>` | 确认级别：`processed`、`confirmed` 或 `finalized` |
| `--json` | 以 JSON 格式输出 |
| `--log-level <option>` | 日志级别：`debug`、`warn`、`error`、`info` 或 `trace`（默认：`info`） |

## 示例

### 销毁单个资产

```bash
mplx core asset burn 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa
```

### 从集合中销毁资产

```bash
mplx core asset burn 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --collection HaKyubAWuTS9AZkpUHtFkTKAHs1KKAJ3onZPmaP9zBpe
```

### 从列表批量销毁资产

创建 JSON 文件 `assets-to-burn.json`：

```json
[
  "5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa",
  "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
]
```

然后运行：

```bash
mplx core asset burn --list ./assets-to-burn.json
```

## 注意事项

- **警告**：销毁是永久性的，无法撤销
- 您必须是资产的所有者才能销毁它
- 销毁资产时，大部分租金 SOL 会返还给所有者
- 少量金额（约 0.00089784 SOL）会保留以防止账户重用
- 销毁属于集合的资产时，请使用 `--collection` 标志
