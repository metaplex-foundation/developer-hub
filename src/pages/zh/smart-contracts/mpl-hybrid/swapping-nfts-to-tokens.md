---
title: 在MPL Hybrid中将NFT交换为代币
metaTitle: 将NFT交换为代币 | MPL-Hybrid
description: 学习编写交换函数，使用户可以在MPL-Hybrid程序中将其NFT交换为代币。
---

在MPL-Hybrid程序中，将您拥有的代币交换为托管中持有的NFT的操作称为`capture`（捕获）。



## 交换NFT

```ts
await releaseV1(umi, {
    // 被交换资产的所有者。
    owner: umi.identity,
    // 托管配置地址。
    escrow: publicKey("11111111111111111111111111111111"),
    // 将被交换为SPL代币的资产。
    asset: publicKey("22222222222222222222222222222222"),
    // 分配给托管配置的集合。
    collection: publicKey("33333333333333333333333333333333"),
    // 费用钱包地址。
    feeProjectAccount: publicKey("44444444444444444444444444444444"),
    // 钱包的代币账户。
    token: publicKey("55555555555555555555555555555555"),
  }).sendAndConfirm(umi);
```
