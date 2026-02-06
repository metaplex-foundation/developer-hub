---
title: 创建资产
metaTitle: 创建资产 | Metaplex CLI
description: 使用不同方法创建 MPL Core 资产
---

`mplx core asset create` 命令允许您使用三种不同的方法创建 MPL Core 资产：简单创建、基于文件创建或交互式向导。此命令在如何创建资产方面提供了灵活性，同时保持一致的输出格式。

## 方法

### 1. 简单创建

通过命令行参数直接提供元数据的名称和 URI 来创建单个资产。

```bash
mplx core asset create --name "My NFT" --uri "https://example.com/metadata.json"
```

### 2. 基于文件创建

通过提供图片文件和 JSON 元数据文件来创建单个资产。命令将处理两个文件的上传并创建资产。

```bash
mplx core asset create --files --image "./my-nft.png" --json "./metadata.json"
```

### 3. 交互式向导

使用交互式向导创建资产，它会引导您完成整个过程，包括文件上传和元数据创建。

```bash
mplx core asset create --wizard
```

## 选项

### 基本选项

- `--name <string>`: 资产名称（简单创建时必需）
- `--uri <string>`: 资产元数据的 URI（简单创建时必需）
- `--collection <string>`: 资产的集合 ID

### 基于文件选项

- `--files`: 指示基于文件创建的标志
- `--image <path>`: 要上传并分配给资产的图片文件路径
- `--json <path>`: JSON 元数据文件路径

### 插件选项

- `--plugins`: 使用交互式插件选择
- `--pluginsFile <path>`: 包含插件数据的 JSON 文件路径

## 示例

1. 使用交互式向导创建资产：

```bash
mplx core asset create --wizard
```

1. 使用名称和 URI 创建资产：

```bash
mplx core asset create --name "My NFT" --uri "https://example.com/metadata.json"
```

1. 从文件创建资产：

```bash
mplx core asset create --files --image "./my-nft.png" --json "./metadata.json"
```

1. 创建带有集合的资产：

```bash
mplx core asset create --name "My NFT" --uri "https://example.com/metadata.json" --collection "collection_id_here"
```

1. 使用文件和集合创建资产：

```bash
mplx core asset create --files --image "./my-nft.png" --json "./metadata.json" --collection "collection_id_here"
```

## 输出

成功创建后，命令将输出以下信息：

```
--------------------------------
  Asset: <asset_address>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
  Core Explorer: https://core.metaplex.com/explorer/<asset_address>
--------------------------------
```
