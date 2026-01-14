---
title: 插件
metaTitle: 插件 | Metaplex CLI
description: 管理 MPL Core 资产和集合插件
---

`mplx core plugins` 命令允许您管理 MPL Core 资产和集合的插件。插件通过附加功能和能力扩展资产和集合的功能。

## 添加插件

为资产或集合添加插件。

### 基本用法

```bash
mplx core plugins add <assetId> [options]
```

### 选项
- `--wizard`: 交互式向导模式，用于选择和配置插件
- `--collection`: 指示目标是集合的标志（默认：false）

### 方法

#### 1. 使用向导模式
```bash
mplx core plugins add <assetId> --wizard
```
这将：
1. 启动交互式向导以选择插件类型
2. 引导您完成插件配置
3. 将配置好的插件添加到资产/集合

#### 2. 使用 JSON 文件
```bash
mplx core plugins add <assetId> ./plugin.json
```
JSON 文件应包含以下格式的插件配置：
```json
[
  {
    "pluginType": {
      "property1": "value1",
      "property2": "value2"
    }
  }
]
```

### 示例

#### 为资产添加插件
```bash
mplx core plugins add 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --wizard
```

#### 为集合添加插件
```bash
mplx core plugins add 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --wizard --collection
```

#### 使用 JSON 添加插件
```bash
mplx core plugins add 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa ./my-plugin.json
```

## 输出

成功添加插件后，命令将显示：
```
--------------------------------
  Asset: <assetId>
  Signature: <transactionSignature>
  Explorer: <explorerUrl>
  Core Explorer: https://core.metaplex.com/explorer/<assetId>
--------------------------------
```

## 注意事项

- 向导模式提供了选择和配置插件的交互方式
- 资产和集合可用不同的插件
- 插件配置必须符合插件的要求
- 您必须拥有适当的权限才能向资产或集合添加插件
- 命令将自动处理：
  - 插件类型验证
  - 配置验证
  - 交易签名和确认
  - 权限验证

## 更新插件

更新资产或集合上的现有插件。

### 基本用法

```bash
mplx core plugins update <assetId> [options]
```

### 选项
- `--wizard`: 交互式向导模式，用于选择和配置要更新的插件
- `--collection`: 指示目标是集合的标志（默认：false）

### 方法

#### 1. 使用向导模式
```bash
mplx core plugins update <assetId> --wizard
```
这将：
1. 启动交互式向导以选择要更新的插件
2. 引导您完成更新后的插件配置
3. 将更改应用于资产/集合

#### 2. 使用 JSON 文件
```bash
mplx core plugins update <assetId> ./plugin.json
```
JSON 文件应包含与添加插件时相同格式的更新插件配置。
```

### 示例

#### 更新资产上的插件
```bash
mplx core plugins update 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --wizard
```

#### 更新集合上的插件
```bash
mplx core plugins update 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --wizard --collection
```

#### 使用 JSON 更新插件
```bash
mplx core plugins update 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa ./updated-plugin.json
```

### 示例：更新集合上的版税插件

```bash
mplx core plugins update collectionPublicKey ./royalties.json --collection
```

其中 `royalties.json` 包含：
```json
[
  {
    "type": "Royalties",
    "authority": {
      "type": "UpdateAuthority"
    },
    "basisPoints": 1000,
    "creators": [
      {
        "address": "4xbJp9sjeTEhheUDg8M1nJUomZcGmFZsjt9Gg3RQZAWp",
        "percentage": 100
      }
    ],
    "ruleSet": {"type": "None"}
  }
]
```

## 输出（更新）

成功更新插件后，命令将显示：

```text
--------------------------------
  Asset: <assetId>
  Signature: <transactionSignature>
  Explorer: <explorerUrl>
  Core Explorer: https://core.metaplex.com/explorer/<assetId>
--------------------------------
```
