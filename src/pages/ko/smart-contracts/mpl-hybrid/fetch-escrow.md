---
title: MPL 404 하이브리드 에스크로 조회
metaTitle: MPL 404 하이브리드 에스크로 조회 | MPL-Hybrid
description: MPL 404 하이브리드 에스크로 구성을 조회하는 방법을 배우세요.
---

## 에스크로 구성 조회

에스크로 구성 계정을 조회하려면 `fetchEscrowV1` 함수를 사용할 수 있습니다.

```ts
const escrowAddress = publicKey('11111111111111111111111111111111')

const escrow = await fetchEscrowV1(umi, escrowAddress)
```

## 반환된 데이터 형식

다음 객체는 `fetchEscrowV1`에서 반환된 데이터의 예시입니다.

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