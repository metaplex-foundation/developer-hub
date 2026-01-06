---
title: NFT 전송하기
metaTitle: NFT 전송하기 | NFT
description: Metaplex Core를 사용하여 Solana에서 지갑 간 NFT를 전송하는 방법을 알아보세요
created: '03-12-2025'
updated: '03-12-2025'
---

Solana에서 지갑 간 NFT 소유권을 전송합니다. {% .lead %}

## NFT 전송하기

다음 섹션에서 전체 코드 예제와 변경이 필요할 수 있는 파라미터를 확인할 수 있습니다. NFT 전송에 대한 자세한 내용은 [Core 문서](/ko/smart-contracts/core/transfer)를 참조하세요.

{% code-tabs-imported from="core/transfer-asset" frameworks="umi" /%}

## 파라미터

전송에 맞게 다음 파라미터를 커스터마이징하세요:

| 파라미터 | 설명 |
|-----------|-------------|
| `assetAddress` | 전송할 NFT의 공개 키 |
| `newOwner` | 수신자의 지갑 주소 |

## 작동 방식

전송 과정은 세 단계를 포함합니다:

1. **소유권 확인** - NFT의 현재 소유자여야 합니다
2. **수신자 지정** - 새 소유자의 지갑 주소를 제공합니다
3. **전송 실행** - NFT 소유권이 즉시 전송됩니다

## NFT 전송

SPL/대체 가능 토큰과 달리, Core NFT는 수신자가 먼저 토큰 계정을 생성할 필요가 없습니다. 소유권은 NFT에 직접 기록되어 전송이 더 간단하고 저렴해집니다.
