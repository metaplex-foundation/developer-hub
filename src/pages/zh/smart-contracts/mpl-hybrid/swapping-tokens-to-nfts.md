---
title: 将代币交换为NFT
metaTitle: 使用MPL-Hybrid 404将代币交换为NFT | MPL-Hybrid
description: 学习在MPL-Hybrid程序中将您的SPL代币交换为NFT。
---

在MPL-Hybrid程序中，将代币交换为托管中NFT的操作称为`capture`（捕获）。该过程涉及用户通过支付一定数量的代币从托管中捕获NFT。

如果在托管配置中启用了重掷（path），则写入NFT的元数据索引将从可用索引池`min`、`max`中随机选择。

## 交换代币

```ts
await captureV1(umi, {
  // 被交换资产的所有者。
  owner: umi.identity,
  // 托管配置地址。
  escrow: publicKey('11111111111111111111111111111111'),
  // 将被交换为SPL代币的资产。
  asset: publicKey('22222222222222222222222222222222'),
  // 分配给托管配置的集合。
  collection: publicKey('33333333333333333333333333333333'),
  // 费用钱包地址。
  feeProjectAccount: publicKey('44444444444444444444444444444444'),
  // 钱包的代币账户。
  token: publicKey('55555555555555555555555555555555'),
}).sendAndConfirm(umi)
```
