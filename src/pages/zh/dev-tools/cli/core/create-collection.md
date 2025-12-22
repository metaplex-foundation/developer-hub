---
title: 创建集合
description: 使用不同方法创建 MPL Core 集合
---

`mplx core collection create` 命令允许您使用三种不同的方法创建 MPL Core 集合：简单创建、基于文件创建或交互式向导。此命令在如何创建集合方面提供了灵活性，同时保持一致的输出格式。

## 方法

### 1. 简单创建
通过命令行参数直接提供元数据的名称和 URI 来创建单个集合。

```bash
mplx core collection create --name "My Collection" --uri "https://example.com/metadata.json"
```

### 2. 基于文件创建
通过提供图片文件和 JSON 元数据文件来创建单个集合。命令将处理两个文件的上传并创建集合。

```bash
mplx core collection create --files --image "./my-collection.png" --json "./metadata.json"
```

### 3. 交互式向导
使用交互式向导创建集合，它会引导您完成整个过程，包括文件上传和元数据创建。

```bash
mplx core collection create --wizard
```

## 选项

### 基本选项
- `--name <string>`: 集合名称（简单创建时必需）
- `--uri <string>`: 集合元数据的 URI（简单创建时必需）

### 基于文件选项
- `--files`: 指示基于文件创建的标志
- `--image <path>`: 要上传并分配给集合的图片文件路径
- `--json <path>`: JSON 元数据文件路径

### 插件选项
- `--plugins`: 使用交互式插件选择
- `--pluginsFile <path>`: 包含插件数据的 JSON 文件路径

## 示例

1. 使用交互式向导创建集合：
```bash
mplx core collection create --wizard
```

2. 使用名称和 URI 创建集合：
```bash
mplx core collection create --name "My Collection" --uri "https://example.com/metadata.json"
```

3. 从文件创建集合：
```bash
mplx core collection create --files --image "./my-collection.png" --json "./metadata.json"
```

## 输出

成功创建后，命令将输出以下信息：
```
--------------------------------
  Collection: <collection_address>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
  Core Explorer: https://core.metaplex.com/explorer/<collection_address>
--------------------------------
```

## 注意事项

- 使用基于文件创建方法时，`--image` 和 `--json` 标志都是必需的
- 向导方法提供了创建集合的引导式体验，包括文件上传和元数据创建
- 插件配置可以通过交互方式或 JSON 文件完成
- JSON 元数据文件必须包含集合的 `name` 字段
- 使用基于文件或向导方法时，命令将自动处理文件上传和元数据创建
- 集合元数据遵循标准 NFT 元数据格式，并带有额外的集合特定字段
