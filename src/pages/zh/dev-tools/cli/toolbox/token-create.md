---
title: 创建代币
metaTitle: 创建代币 | Metaplex CLI
description: 在 Solana 上创建新的同质化代币
---

`mplx toolbox token create` 命令允许您在 Solana 上创建新的同质化代币。您可以通过两种方式创建代币：使用交互式向导或直接提供所有必需信息。

## 基本用法

### 交互式向导
```bash
mplx toolbox token create --wizard
```

### 直接创建
```bash
mplx toolbox token create --name "My Token" --symbol "TOKEN" --mint-amount 1000000
```

## 选项

### 必需选项（不使用向导时）
- `--name <string>`: 代币名称（例如 "My Awesome Token"）
- `--symbol <string>`: 代币符号（2-6 个字符，例如 "MAT"）
- `--mint-amount <number>`: 要铸造的初始代币数量（必须大于 0）

### 可选选项
- `--decimals <number>`: 小数位数（0-9，默认：0）
- `--description <string>`: 代币及其用途的描述
- `--image <path>`: 代币图片文件路径（PNG、JPG 或 GIF）
- `--speed-run`: 启用极速模式以测量执行时间

## 示例

### 使用基本信息创建代币
```bash
mplx toolbox token create --name "My Token" --symbol "TOKEN" --mint-amount 1000000
```

### 使用所有选项创建代币
```bash
mplx toolbox token create \
  --name "My Awesome Token" \
  --symbol "MAT" \
  --description "A token for awesome things" \
  --image ./token-image.png \
  --decimals 2 \
  --mint-amount 1000000
```

### 使用向导创建代币
```bash
mplx toolbox token create --wizard
```

## 输出

成功创建代币后，命令将显示：
```
--------------------------------
Token created successfully!

Token Details:
Name: <name>
Symbol: <symbol>
Decimals: <decimals>
Initial Supply: <formattedAmount>

Mint Address: <mintAddress>
Explorer: <explorerUrl>

Transaction Signature: <signature>
Explorer: <transactionExplorerUrl>
Execution Time: <time> seconds
--------------------------------
```

## 注意事项

- 代币符号必须为 2-6 个字符长
- 铸造数量必须大于 0
- 小数位数决定代币的最小单位（例如，2 位小数意味着 100 个代币 = 100_00）
- 图片文件必须为 PNG、JPG 或 GIF 格式
- 向导将以交互方式引导您填写所有必填字段
- 命令将自动：
  - 上传代币图片（如果提供）
  - 创建并上传代币元数据
  - 在区块链上创建代币
  - 铸造初始供应量
- 提供交易签名和铸币地址以供验证
- 极速模式可用于测量执行时间
