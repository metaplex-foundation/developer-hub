---
title: Fetching an MPL 404 Hybrid Escrow
metaTitle: Fetching an MPL 404 Hybrid Escrow | MPL-Hybrid
description: Learn to fetch an MPL 404 Hybrid Escrow configuration.
---

## Fetching Escrow Configuration

To fetch an Escrow configuration account you can use the `fetchEscrowV1` function.

```ts
const escrowAddress = publicKey('11111111111111111111111111111111')

const escrow = await fetchEscrowV1(umi, escrowAddress)
```

## Returned Data Format

The following object is an example of the returned data from `fetchEscrowV1`.

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
