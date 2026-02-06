---
title: 概要
metaTitle: Metaplexルールセット | Token Auth Rules
description: Metaplex Foundationが管理するpNFTルールセット。
---
Metaplex Foundationは、pNFT用の2つのルールセットを管理しています。

## Metaplex Foundation ルールセット

このルールセットは、マーケットプレイスロイヤリティを強制しないプログラムを見つけてブロックするためのベストエフォートを表しています。この状況は定期的にチェックされ、包括的なクリエイターロイヤリティの強制を継続するためにアップデートが実行されます。

### アドレス

**Devnet:** eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9

**Mainnet:** eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9

### 内容

現時点では、クリエイターロイヤリティを回避するプログラムは存在しないため、ルールセットは現在いかなるプログラムもブロックしていないことに注意してください。

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

## 互換性ルールセット

このルールセットはいかなるプログラムもブロックせず、標準NFTと同じレベルの転送制限（つまり、なし）を許可するために機能します。

### アドレス

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
