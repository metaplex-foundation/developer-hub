---
title: 토큰 데이터 읽기
metaTitle: 토큰 데이터 읽기 | 토큰
description: Solana 블록체인에서 대체 가능 토큰 데이터를 가져오는 방법을 알아보세요
created: '11-28-2025'
updated: '11-28-2025'
---

Solana 블록체인에서 대체 가능 토큰 정보를 가져옵니다. {% .lead %}

## 토큰 메타데이터 가져오기

민트 주소를 사용하여 토큰의 메타데이터를 가져옵니다. 이름, 심볼, 소수점 자릿수, 공급량을 포함한 온체인 토큰 정보를 조회합니다.

{% code-tabs-imported from="token-metadata/fungibles/read" frameworks="umi,das,curl" /%}

## 파라미터

| 파라미터 | 설명 |
|-----------|-------------|
| `mintAddress` | 가져올 토큰 민트 주소 |

## 토큰 잔액 가져오기

Associated Token Account 또는 DAS API를 사용하여 특정 지갑의 토큰 잔액을 가져옵니다.

{% code-tabs-imported from="token-metadata/fungibles/read-balance" frameworks="umi,das,curl" /%}

## 소유자별 모든 토큰 가져오기

DAS API를 사용하여 지갑 주소가 소유한 모든 대체 가능 토큰을 조회합니다.

{% code-tabs-imported from="token-metadata/fungibles/read-all" frameworks="das,curl" /%}

## 접근 방식 비교

| 기능 | 직접 RPC | DAS API |
|---------|-----------|---------|
| 속도 | 대량 쿼리에서 느림 | 대량 쿼리에 최적화 |
| 데이터 신선도 | 실시간 | 거의 실시간 (인덱싱됨) |
| 검색 기능 | 제한적 | 고급 필터링 |
| 사용 사례 | 단일 토큰 조회 | 포트폴리오 보기, 검색 |

## 팁

- **포트폴리오 보기에 DAS 사용** - 사용자가 소유한 모든 토큰을 표시할 때, DAS API는 여러 RPC 호출보다 훨씬 빠릅니다
- **DAS에서 showFungible 설정** - `showFungible: true`를 설정하세요. 그렇지 않으면 일부 RPC는 NFT 데이터만 반환합니다

## 관련 가이드

- [토큰 생성하기](/tokens/create-a-token)
- [DAS API 개요](/das-api)
- [소유자별 대체 가능 자산 가져오기](/das-api/guides/get-fungible-assets)
