---
title: 更新资产
metaTitle: 更新资产 | Metaplex CLI
description: 使用 Metaplex CLI 的 mplx core asset update 命令更新 MPL Core 资产的元数据、名称、URI、图片或集合成员身份。
keywords:
  - mplx cli
  - core asset update
  - MPL Core
  - update NFT
  - metaplex cli update
  - core update
  - collection management
  - add to collection
  - remove from collection
  - move collection
about:
  - MPL Core Asset update
  - Metaplex CLI
  - collection management
proficiencyLevel: Beginner
created: '03-15-2026'
updated: '04-17-2026'
---

## Summary

`mplx core asset update` 命令可修改 [MPL Core 资产](/core)的链上名称、URI、图片、链下元数据或[集合](/core/collections)成员身份。

- 单独更新元数据字段 (`--name`、`--uri`) 或从 JSON 文件更新 (`--offchain`)
- 使用 `--image` 上传并分配新图片
- 将资产添加到集合、在集合之间移动或从集合中移除
- 调用者必须是资产当前的[更新权限](/core/update)（或集合资产的情况下是集合的更新权限）

## Basic Usage

```bash {% title="Update an asset" %}
mplx core asset update <assetId> [options]
```

您必须至少提供一个更新标志。可以在单个命令中组合多个标志 — 例如，同时更新名称并添加到集合。

## Update Options

| Flag | Description |
|------|-------------|
| `--name <string>` | 资产的新名称（不能与 `--offchain` 一起使用） |
| `--uri <string>` | 资产元数据的新 URI（不能与 `--offchain` 一起使用） |
| `--image <path>` | 要上传的新图片文件的路径 |
| `--offchain <path>` | JSON 元数据文件的路径（不能与 `--name` 或 `--uri` 一起使用） |
| `--collection <collectionId>` | 将资产添加到集合或移动到不同的集合（不能与 `--remove-collection` 一起使用） |
| `--remove-collection` | 从当前集合中移除资产（不能与 `--collection` 一起使用） |

## Global Flags

| Flag | Description |
|------|-------------|
| `-c, --config <value>` | 配置文件路径。默认为 `~/.config/mplx/config.json` |
| `-k, --keypair <value>` | 密钥对文件或账本的路径（例如 `usb://ledger?key=0`） |
| `-p, --payer <value>` | 付款人密钥对文件或账本的路径 |
| `-r, --rpc <value>` | 集群的 RPC URL |
| `--commitment <option>` | 提交级别：`processed`、`confirmed` 或 `finalized` |
| `--json` | 将输出格式化为 JSON |
| `--log-level <option>` | 日志级别：`debug`、`warn`、`error`、`info` 或 `trace`（默认：`info`） |

## Update Metadata

更新资产的名称、URI、图片或链下元数据。`--offchain` 标志读取本地 JSON 文件并从其 `name` 字段同步链上名称。`--image` 标志上传文件并更新元数据中的图片 URI。

{% code-tabs-imported from="core/update-asset" frameworks="cli" /%}

## Manage Collection Membership

`--collection` 和 `--remove-collection` 标志控制资产所属的[集合](/core/collections)。这些标志可以单独使用，也可以与元数据更新标志结合在单个事务中使用。

### Add an Asset to a Collection

`--collection` 标志将独立资产分配给集合。资产的[更新权限](/core/update)从地址更改为集合。

{% code-tabs-imported from="core/add-to-collection" frameworks="cli" /%}

Output:

```
✔ Asset added to collection (Tx: <transactionSignature>)
```

{% callout type="note" %}
要将资产添加到集合，您必须是资产和目标集合的更新权限。
{% /callout %}

### Move an Asset to a Different Collection

对已经属于集合的资产使用相同的 `--collection` 标志。CLI 会检测现有集合并将资产移动到新集合。

{% code-tabs-imported from="core/change-collection" frameworks="cli" /%}

Output:

```
✔ Asset moved to new collection (Tx: <transactionSignature>)
```

{% callout type="note" %}
您必须是资产当前集合和目标集合的更新权限。
{% /callout %}

### Remove an Asset from a Collection

`--remove-collection` 标志将资产从其当前集合中分离。资产的更新权限从集合恢复为签名者的地址。

{% code-tabs-imported from="core/remove-from-collection" frameworks="cli" /%}

Output:

```
✔ Asset removed from collection (Tx: <transactionSignature>)
```

对不在集合中的资产运行 `--remove-collection` 会产生错误：

```
✖ Asset is not in a collection
  Error: Cannot remove from collection: asset does not belong to a collection
```

{% callout type="note" %}
集合标志可以与元数据标志在单个事务中组合 — 例如，`mplx core asset update <assetId> --name "New Name" --collection <collectionId>`。
{% /callout %}

## Output

元数据更新成功后，命令会显示：

```
--------------------------------
  Asset: <assetId>
  Signature: <transactionSignature>
  Explorer: <explorerUrl>
  Core Explorer: https://core.metaplex.com/explorer/<assetId>
--------------------------------
```

对于仅集合的操作，输出为单行确认：

```
✔ Asset added to collection (Tx: <transactionSignature>)
```

使用 `--json` 获取结构化输出：

```json {% title="JSON response" %}
{
  "asset": "<assetId>",
  "signature": "<transactionSignature>",
  "explorer": "<explorerUrl>"
}
```

## Quick Reference

| Item | Value |
|------|-------|
| Update command | `mplx core asset update` |
| Add-to-collection alias | `mplx core collection add`（仅适用于添加到集合的情况；不适用于移动、移除或仅元数据更新） |
| Applies to | 仅 [MPL Core Assets](/core) — 不适用于 Token Metadata NFT |
| Source | [GitHub — metaplex-foundation/cli](https://github.com/metaplex-foundation/cli) |

## Notes

- 您必须至少提供一个更新标志：`--name`、`--uri`、`--image`、`--offchain`、`--collection` 或 `--remove-collection`
- `--name` 和 `--uri` 标志不能与 `--offchain` 一起使用
- `--collection` 和 `--remove-collection` 标志是互斥的
- 使用 `--offchain` 时，JSON 元数据文件必须包含有效的 `name` 字段 — 链上名称从该字段同步
- `--image` 标志自动上传文件并更新元数据中的图片 URI
- 集合操作会更改资产的[更新权限](/core/update)：添加到集合会将其设置为集合地址；移除会恢复为签名者的钱包地址
- 调用者必须是资产的更新权限（或集合资产的情况下是集合的更新权限）才能执行任何更新
- 此命令仅适用于 [MPL Core Assets](/core) — 对于 Token Metadata NFT，请使用不同的更新指令
