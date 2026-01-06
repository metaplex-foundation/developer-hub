---
title: 浏览器配置
description: 设置您首选的区块链浏览器
---

`mplx config explorer` 命令允许您设置首选的区块链浏览器,用于查看交易和帐户。

## 基本用法

### 设置浏览器
```bash
mplx config explorer set
```

## 命令

### 设置浏览器
从可用选项列表中设置您首选的区块链浏览器。

#### 示例
```bash
mplx config explorer set
```

#### 注意事项
- 打开交互式提示以从可用浏览器中选择
- 更新配置中的活动浏览器
- 所选浏览器将用于查看交易和帐户
- 可用浏览器包括:
  - Solana Explorer (https://explorer.solana.com)
  - Solscan (https://solscan.io)
  - Solana FM (https://solana.fm)

## 配置文件

浏览器配置存储在您的配置文件中(默认: `~/.mplx/config.json`)。结构如下:

```json
{
  "explorer": "https://explorer.solana.com"
}
```

## 注意事项

- 显示交易和帐户链接时使用浏览器设置
- 如果配置文件不存在,将自动创建
- 您可以随时更改首选浏览器
- 所选浏览器将用于命令输出中的所有浏览器链接
- 每个浏览器提供不同的功能和界面来查看区块链数据
