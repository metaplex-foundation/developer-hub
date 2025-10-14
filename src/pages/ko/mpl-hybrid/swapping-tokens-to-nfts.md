---
title: 토큰을 NFT로 스왑하기
metaTitle: MPL-Hybrid 404를 사용하여 토큰을 NFT로 스왑하기 | MPL-Hybrid
description: MPL-Hybrid 프로그램에서 SPL 토큰을 NFT로 스왑하는 방법을 학습합니다.
---

MPL-Hybrid 프로그램의 에스크로에서 토큰을 NFT로 스왑하는 작업을 `capture`라고 합니다. 이 과정은 사용자가 설정된 양의 토큰과 교환하여 에스크로에서 NFT를 획득하는 것을 포함합니다.

에스크로 구성에서 reroll (path)이 활성화되어 있다면, NFT에 작성되는 메타데이터 인덱스는 사용 가능한 인덱스 풀 `min`, `max`에서 무작위로 선택됩니다.

## 토큰 스왑하기

```ts
await captureV1(umi, {
  // 스왑될 자산의 소유자.
  owner: umi.identity,
  // 에스크로 구성 주소.
  escrow: publicKey('11111111111111111111111111111111'),
  // SPL 토큰으로 스왑될 자산.
  asset: publicKey('22222222222222222222222222222222'),
  // 에스크로 구성에 할당된 컬렉션.
  collection: publicKey('33333333333333333333333333333333'),
  // 수수료 지갑 주소.
  feeProjectAccount: publicKey('44444444444444444444444444444444'),
  // 지갑의 토큰 계정.
  token: publicKey('55555555555555555555555555555555'),
}).sendAndConfirm(umi)
```