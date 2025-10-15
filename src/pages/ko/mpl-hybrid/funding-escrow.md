---
title: MPL Hybrid 404 에스크로 자금 지원
metaTitle: MPL Hybrid 404 에스크로 자금 지원 | MPL-Hybrid
description: 404 스왑을 가능하게 하는 SPL 토큰으로 MPL 404 하이브리드 에스크로 계정에 자금을 지원하는 방법을 배우세요.
---

스마트 스왑을 활성화하기 전에 에스크로에 자금을 지원해야 합니다. 일반적으로 프로젝트가 에스크로가 항상 자금을 지원받도록 하려는 경우, 모든 NFT 또는 토큰을 출시한 다음 다른 모든 자산을 에스크로에 배치하는 것으로 시작합니다. 이렇게 하면 모든 유통 자산이 에스크로의 카운터 자산으로 "뒷받침"됩니다. 에스크로는 PDA이기 때문에 지갑을 통한 로딩은 널리 지원되지 않습니다. 아래 코드를 사용하여 에스크로로 자산을 전송할 수 있습니다.

토큰으로 에스크로에 자금을 지원하려면 해당 토큰을 **에스크로의 토큰 계정**으로 보내야 합니다.

```ts
// 에스크로 구성의 주소.
const escrowConfigurationAddress = publicKey('11111111111111111111111111111111')
// SPL 토큰의 주소.
const tokenMint = publicKey('22222222222222222222222222222222')

// 자금 지원 지갑에서 토큰 계정 PDA 생성.
const sourceTokenAccountPda = findAssociatedTokenPda(umi, {
  owner: umi.identity.publicKey,
  mint: tokenMint,
})

// 에스크로 대상을 위한 토큰 계정 PDA 생성.
const escrowTokenAccountPda = findAssociatedTokenPda(umi, {
  owner: escrowConfigurationAddress,
  mint: tokenMint,
})

// 대상 토큰 계정이 존재하는지 확인하면서 토큰 전송을 실행하고,
// 존재하지 않으면 생성합니다.
await createTokenIfMissing(umi, {
  mint: tokenMint,
  owner: escrowConfigurationAddress,
  token: escrowTokenAccountPda,
  payer: umi.identity,
})
  .add(
    transferTokens(umi, {
      source: sourceTokenAccountPda,
      destination: escrowTokenAccountPda,
      // amount는 라모포트와 소수점으로 계산됩니다.
      amount: 100000,
    })
  )
  .sendAndConfirm(umi)
```