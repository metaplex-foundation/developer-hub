---
title: 更新代币元数据
metaTitle: 如何在Solana上更新同质化代币元数据 | 代币
description: 学习如何使用JavaScript和Umi在Solana上更新同质化代币元数据
created: '11-28-2025'
updated: '11-28-2025'
---

更新同质化代币的元数据以更改名称、符号、图像或其他属性。 {% .lead %}

## 更新代币元数据

在以下部分，您可以看到完整的代码示例以及需要更改的参数。这将使用Token Metadata程序更新链上元数据。

{% code-tabs-imported from="token-metadata/fungibles/update" frameworks="umi,cli" /%}

## 参数

根据您的更新需求自定义以下参数：

| 参数 | 描述 |
|-----------|-------------|
| `mintAddress` | 代币铸币地址 |
| `name` | 新代币名称（最多32个字符） |
| `symbol` | 新代币符号（最多10个字符） |
| `uri` | 新链下元数据JSON的链接 |
| `sellerFeeBasisPoints` | 版税百分比（同质化代币通常为0） |

## 工作原理

更新过程很简单：

1. **以更新权限者身份连接** - 您的钱包必须是代币的更新权限者
2. **调用updateV1** - 提供铸币地址和新的元数据值
3. **确认交易** - 元数据在链上更新

## 可以更新什么

您可以更新以下链上元数据：

- **Name** - 代币的显示名称
- **Symbol** - 简短的股票代码符号
- **URI** - 链接到链下JSON元数据（图像、描述等）
- **Seller fee basis points** - 版税百分比

## 要求

要更新代币元数据，您必须：

- **是更新权限者** - 只有指定的更新权限者可以更改元数据
- **代币是可变的** - 代币必须使用`isMutable: true`创建

## 更新链下元数据

要更新代币的图像或描述：

1. 创建包含更新信息的新JSON元数据文件
2. 将新JSON上传到存储提供商（如Arweave）
3. 更新`uri`字段以指向新的JSON文件

```json
{
  "name": "Updated Token Name",
  "symbol": "UTN",
  "description": "An updated description for my token",
  "image": "https://arweave.net/new-image-hash"
}
```

## 重要说明

- 更新仅影响元数据，不影响代币本身或现有余额
- 如果代币创建时设置为不可变，则无法更新元数据
- 您可以通过更改`uri`来更新链下数据，如图像和描述
