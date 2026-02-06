---
title: 更新资产
metaTitle: 更新资产 | Metaplex CLI
description: 更新 MPL Core 资产元数据和属性
---

`mplx core asset update` 命令允许您通过修改元数据、名称、URI 或图片来更新 MPL Core 资产。您可以更新单个资产或一次更新多个资产。

## 基本用法

### 更新单个资产

```bash
mplx core asset update <assetId> [options]
```

### 更新选项

- `--name <string>`: 资产的新名称
- `--uri <string>`: 资产元数据的新 URI
- `--image <path>`: 新图片文件的路径
- `--json <path>`: 包含新元数据的 JSON 文件路径

## 更新方法

### 1. 更新名称和 URI

```bash
mplx core asset update <assetId> --name "Updated Asset" --uri "https://example.com/metadata.json"
```

### 2. 使用 JSON 文件更新

```bash
mplx core asset update <assetId> --json ./asset/metadata.json
```

### 3. 使用图片更新

```bash
mplx core asset update <assetId> --image ./asset/image.jpg
```

### 4. 使用 JSON 和图片更新

```bash
mplx core asset update <assetId> --json ./asset/metadata.json --image ./asset/image.jpg
```

## 示例

### 更新资产名称

```bash
mplx core asset update 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --name "New Asset Name"
```

### 使用新图片更新资产

```bash
mplx core asset update 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --image ./images/new-image.png
```

### 使用新元数据更新资产

```bash
mplx core asset update 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --json ./metadata/new-metadata.json
```

## 输出

成功更新后，命令将显示：

```
--------------------------------
  Asset: <assetId>
  Signature: <transactionSignature>
  Explorer: <explorerUrl>
  Core Explorer: https://core.metaplex.com/explorer/<assetId>
--------------------------------
```

## 注意事项

- 您必须至少提供一个更新标志：`--name`、`--uri`、`--image`、`--json` 或 `--edit`
- `--name` 和 `--uri` 标志不能与 `--json` 或 `--edit` 一起使用
- 使用 `--json` 时，元数据文件必须包含有效的 `name` 字段
- `--image` 标志将同时更新元数据中的图片 URI 和图片文件引用
- 命令将自动处理：
  - 文件上传到适当的存储
  - 元数据 JSON 格式化
  - 图片文件类型检测
  - 集合权限验证
