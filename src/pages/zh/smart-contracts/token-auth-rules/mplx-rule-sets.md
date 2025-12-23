---
title: 概述
metaTitle: Metaplex规则集 | Token Auth Rules
description: Metaplex Foundation管理的pNFT规则集。
---
Metaplex Foundation为pNFT管理两个规则集。

## Metaplex Foundation规则集
此规则集代表查找和阻止不执行市场版税的程序的最大努力。此状态会定期检查，并执行任何更新以继续全面的创作者版税执行。

### 地址：
**Devnet:** eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9

**Mainnet:** eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9

### 内容
请注意，目前没有程序绕过创作者版税，因此规则集当前不阻止任何程序。

```json
{
  "libVersion": 1,
  "owner": "ELskdHjzTQ6F4bBibhk4iqy63gSPs8ELec9HbfAaSDJk",
  "ruleSetName": "Metaplex Foundation Rule Set",
  "operations": {
    "Transfer:WalletToWallet": "Pass",
    "Transfer:Owner": "Pass",
    "Transfer:MigrationDelegate": "Pass",
    "Transfer:SaleDelegate": "Pass",
    "Transfer:TransferDelegate": "Pass",
    "Delegate:LockedTransfer": "Pass",
    "Delegate:Update": "Pass",
    "Delegate:Transfer": "Pass",
    "Delegate:Utility": "Pass",
    "Delegate:Staking": "Pass",
    "Delegate:Authority": "Pass",
    "Delegate:Collection": "Pass",
    "Delegate:Use": "Pass",
    "Delegate:Sale": "Pass"
  }
}
```

## 兼容性规则集
此规则集不阻止任何程序，用于允许与标准NFT相同级别的转移限制（即无限制）。

### 地址：
**Devnet:** AdH2Utn6Fus15ZhtenW4hZBQnvtLgM1YCW2MfVp7pYS5

**Mainnet:** AdH2Utn6Fus15ZhtenW4hZBQnvtLgM1YCW2MfVp7pYS5

### 内容
```json
{
  "libVersion": 1,
  "owner": "ELskdHjzTQ6F4bBibhk4iqy63gSPs8ELec9HbfAaSDJk",
  "ruleSetName": "Compatibility Rule Set",
  "operations": {
    "Transfer:WalletToWallet": "Pass",
    "Transfer:Owner": "Pass",
    "Transfer:MigrationDelegate": "Pass",
    "Transfer:SaleDelegate": "Pass",
    "Transfer:TransferDelegate": "Pass",
    "Delegate:LockedTransfer": "Pass",
    "Delegate:Update": "Pass",
    "Delegate:Transfer": "Pass",
    "Delegate:Utility": "Pass",
    "Delegate:Staking": "Pass",
    "Delegate:Authority": "Pass",
    "Delegate:Collection": "Pass",
    "Delegate:Use": "Pass",
    "Delegate:Sale": "Pass"
  }
}

```
