---
title: MPL 404 Hybridエスクローの取得
metaTitle: MPL 404 Hybridエスクローの取得 | MPL-Hybrid
description: MPL 404 Hybridエスクロー設定の取得方法を学びましょう。
---

## エスクロー設定の取得

エスクロー設定アカウントを取得するには、`fetchEscrowV1`関数を使用できます。

```ts
const escrowAddress = publicKey('11111111111111111111111111111111')

const escrow = await fetchEscrowV1(umi, escrowAddress)
```

## 返されるデータ形式

以下のオブジェクトは、`fetchEscrowV1`から返されるデータの例です。

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
