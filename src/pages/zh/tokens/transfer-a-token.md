---
title: 转移同质化代币
metaTitle: 如何在Solana上转移同质化代币 | 代币
description: 学习如何使用JavaScript和Umi在Solana上的钱包之间转移同质化SPL代币
created: '11-25-2025'
updated: '11-25-2025'
---

在Solana区块链上的钱包之间转移同质化代币（SPL代币）。 {% .lead %}

## 转移代币

在以下部分，您可以看到完整的代码示例以及需要更改的参数。有关代币转移的更多详情，请参阅[Token Metadata程序](/token-metadata)页面。

{% code-tabs-imported from="token-metadata/fungibles/transfer" frameworks="umi,cli" /%}

## 参数

根据您的转移需求自定义以下参数：

| 参数 | 描述 |
|-----------|-------------|
| `mintAddress` | 代币铸币地址 |
| `destinationAddress` | 接收者的钱包地址 |
| `amount` | 要转移的代币数量 |

## 工作原理

转移过程涉及4个步骤：

1. **查找源代币账户** - 使用`findAssociatedTokenPda`定位您的代币账户
2. **查找目标代币账户** - 定位接收者的代币账户
3. **如有需要创建目标代币账户** - 使用`createTokenIfMissing`确保接收者有代币账户
4. **转移代币** - 使用`transferTokens`执行转移

## 代币账户

每个钱包为其持有的每种代币类型都有一个关联代币账户（ATA）。`findAssociatedTokenPda`函数根据钱包地址和代币铸币地址派生这些账户的地址。

`createTokenIfMissing`函数会自动创建代币账户（如果尚不存在），如果已存在则不执行任何操作。这确保了转移始终成功。
