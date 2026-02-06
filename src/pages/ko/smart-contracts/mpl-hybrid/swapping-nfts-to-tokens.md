---
title: MPL Hybrid에서 NFT를 토큰으로 스왑하기
metaTitle: NFT를 토큰으로 스왑하기 | MPL-Hybrid
description: MPL-Hybrid 프로그램에서 사용자가 자신의 NFT를 토큰으로 스왑할 수 있는 스왑 함수를 작성하는 방법을 학습합니다.
---

MPL-Hybrid 프로그램에서 소유한 토큰을 에스크로에 보관된 NFT로 스왑하는 작업을 `capture`라고 합니다.

## NFT 스왑하기

```ts
await releaseV1(umi, {
    // 스왑될 자산의 소유자.
    owner: umi.identity,
    // 에스크로 구성 주소.
    escrow: publicKey("11111111111111111111111111111111"),
    // SPL 토큰으로 스왑될 자산.
    asset: publicKey("22222222222222222222222222222222"),
    // 에스크로 구성에 할당된 컬렉션.
    collection: publicKey("33333333333333333333333333333333"),
    // 수수료 지갑 주소.
    feeProjectAccount: publicKey("44444444444444444444444444444444"),
    // 지갑의 토큰 계정.
    token: publicKey("55555555555555555555555555555555"),
  }).sendAndConfirm(umi);
```
