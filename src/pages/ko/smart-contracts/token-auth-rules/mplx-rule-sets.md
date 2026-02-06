---
title: 개요
metaTitle: Metaplex Rule Sets | Token Auth Rules
description: Metaplex Foundation이 관리하는 pNFT Rule Sets입니다.
---
Metaplex Foundation은 pNFT를 위한 두 개의 Rule Sets를 관리합니다.

## Metaplex Foundation Rule Set

이 rule set은 마켓플레이스 로열티를 강제하지 않는 프로그램을 찾아서 차단하는 최선의 노력을 나타냅니다. 이 상태는 주기적으로 확인되며 포괄적인 창작자 로열티 강제를 계속하기 위해 업데이트가 수행됩니다.

### 주소

**Devnet:** eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9

**Mainnet:** eBJLFYPxJmMGKuFwpDWkzxZeUrad92kZRC5BJLpzyT9

### 내용

현재 창작자 로열티를 우회하는 프로그램이 없기 때문에 rule set은 현재 어떤 프로그램도 차단하지 않습니다.

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

## 호환성 Rule Set

이 rule set은 어떤 프로그램도 차단하지 않으며 표준 NFT와 동일한 수준의 전송 제한(즉, 없음)을 허용하는 역할을 합니다.

### 주소

**Devnet:** AdH2Utn6Fus15ZhtenW4hZBQnvtLgM1YCW2MfVp7pYS5

**Mainnet:** AdH2Utn6Fus15ZhtenW4hZBQnvtLgM1YCW2MfVp7pYS5

### 내용

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
