---
title: 获取MPL 404混合托管
metaTitle: 获取MPL 404混合托管 | MPL-Hybrid
description: 学习获取MPL 404混合托管配置。
---

## 获取托管配置

要获取托管配置账户，您可以使用`fetchEscrowV1`函数。

```ts
const escrowAddress = publicKey('11111111111111111111111111111111')

const escrow = await fetchEscrowV1(umi, escrowAddress)
```

## 返回的数据格式

以下对象是`fetchEscrowV1`返回数据的示例。

```ts
{
    publicKey: '11111111111111111111111111111111',
    header: {
      executable: false,
      owner: 'MPL4o4wMzndgh8T1NVDxELQCj5UQfYTYEkabX3wNKtb',
      lamports: [Object],
      rentEpoch: 18446744073709551616n,
      exists: true
    },
    discriminator: [
       26,  90, 193, 218,
      188, 251, 139, 211
    ],
    collection: '11111111111111111111111111111111',
    authority: '11111111111111111111111111111111',
    token: '11111111111111111111111111111111',
    feeLocation: '11111111111111111111111111111111',
    name: 'My Escrow',
    uri: 'https://mybaseuri.net/',
    max: 100n,
    min: 0n,
    amount: 1000000000n,
    feeAmount: 2n,
    solFeeAmount: 0n,
    count: 1n,
    path: 0,
    bump: 255
  }

```
