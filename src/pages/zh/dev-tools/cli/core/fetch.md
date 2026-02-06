---
title: 获取资产或集合
metaTitle: 获取资产或集合 | Metaplex CLI
description: 通过铸币地址获取 MPL Core 资产或集合
---

`mplx core fetch` 命令允许您通过铸币地址获取 MPL Core 资产或集合。您可以查看元数据并可选择下载关联的文件。

## 获取资产

### 基本用法

```bash
mplx core fetch asset <assetId>
```

### 下载选项

```bash
mplx core fetch asset <assetId> --download --output ./assets
mplx core fetch asset <assetId> --download --image
mplx core fetch asset <assetId> --download --metadata
```

### 资产获取选项

- `--download`: 将资产文件下载到磁盘（也可以使用额外标志选择单个文件）
- `--output <path>`: 保存下载资产的目录路径（需要 --download）
- `--image`: 下载图片文件（需要 --download）
- `--metadata`: 下载元数据文件（需要 --download）
- `--asset`: 下载资产数据文件（需要 --download）

## 获取集合

### 基本用法

```bash
mplx core fetch collection <collectionId>
```

### 下载选项

```bash
mplx core fetch collection <collectionId> --output ./collections
```

### 集合获取选项

- `-o, --output <path>`: 下载集合文件的输出目录。如果未指定，将使用当前文件夹。

## 示例

### 获取资产示例

1. 获取单个资产：

```bash
mplx core fetch asset 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa
```

1. 将资产文件下载到指定目录：

```bash
mplx core fetch asset 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --download --output ./assets
```

1. 仅下载图片：

```bash
mplx core fetch asset 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --download --image
```

### 获取集合示例

1. 获取集合：

```bash
mplx core fetch collection HaKyubAWuTS9AZkpUHtFkTKAHs1KKAJ3onZPmaP9zBpe
```

1. 将集合文件下载到指定目录：

```bash
mplx core fetch collection HaKyubAWuTS9AZkpUHtFkTKAHs1KKAJ3onZPmaP9zBpe --output ./collections
```

## 输出

### 资产获取输出

下载文件时，将创建以下结构：

```
<output_directory>/
  <assetId>/
    metadata.json
    image.<extension>
    asset.json
```

### 集合获取输出

下载文件时，将创建以下结构：

```
<output_directory>/
  <collectionId>/
    metadata.json
    image.<extension>
    collection.json
```

## 注意事项

- 获取命令将自动检测文件类型并使用适当的扩展名
- 如果未指定集合的输出目录，文件将保存在当前目录
- 元数据 JSON 文件将进行美化打印以提高可读性
- 图片文件将保持其原始格式和质量
- 如果目录不存在，命令将创建必要的目录
- 对于集合，元数据和图片文件会一起下载
- 对于资产，您可以选择下载特定组件（图片、元数据或资产数据）
