---
title: 대체 가능 토큰 전송하기
metaTitle: Solana에서 대체 가능 토큰을 전송하는 방법 | 토큰
description: JavaScript와 Umi를 사용하여 Solana에서 지갑 간 대체 가능 SPL 토큰을 전송하는 방법을 알아보세요
created: '11-25-2025'
updated: '11-25-2025'
---

Solana 블록체인에서 지갑 간 대체 가능 토큰(SPL 토큰)을 전송합니다. {% .lead %}

## 토큰 전송하기

다음 섹션에서 전체 코드 예제와 변경이 필요할 수 있는 파라미터를 확인할 수 있습니다. 토큰 전송 세부 사항에 대해서는 [Token Metadata 프로그램](/ko/smart-contracts/token-metadata) 페이지를 참조하세요.

{% code-tabs-imported from="token-metadata/fungibles/transfer" frameworks="umi,cli" /%}

## 파라미터

전송에 맞게 다음 파라미터를 커스터마이징하세요:

| 파라미터 | 설명 |
|-----------|-------------|
| `mintAddress` | 토큰 민트 주소 |
| `destinationAddress` | 수신자 지갑 주소 |
| `amount` | 전송할 토큰 수 |

## 작동 방식

전송 과정은 네 단계를 포함합니다:

1. **출발지 토큰 계정 찾기** - `findAssociatedTokenPda`를 사용하여 자신의 토큰 계정을 찾습니다
2. **대상 토큰 계정 찾기** - 수신자의 토큰 계정을 찾습니다
3. **필요시 대상 토큰 계정 생성** - `createTokenIfMissing`을 사용하여 수신자가 토큰 계정을 가지고 있는지 확인합니다
4. **토큰 전송** - `transferTokens`로 전송을 실행합니다

## 토큰 계정

각 지갑은 보유한 토큰 유형마다 Associated Token Account(ATA)를 가지고 있습니다. `findAssociatedTokenPda` 함수는 지갑 주소와 토큰 민트를 기반으로 이 계정들의 주소를 도출합니다.

`createTokenIfMissing` 함수는 토큰 계정이 아직 존재하지 않으면 자동으로 생성하고, 이미 존재하면 아무것도 하지 않습니다. 이를 통해 전송이 항상 성공합니다.
