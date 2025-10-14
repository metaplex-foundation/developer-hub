---
title: NFT 데이터 초기화
metaTitle: 에스크로 초기화 | MPL-Hybrid
description: MPL-Hybrid NFT 데이터 초기화
---

## MPL-Hybrid NFT 데이터 계정 구조

어떤 데이터가 저장되고 해당 데이터가 사용자에게 어떤 역할을 하는지 설명합니다.

{% totem %}
{% totem-accordion title="온체인 MPL-Hybrid NFT 데이터 구조" %}

MPL-Hybrid NFT 데이터의 온체인 계정 구조 [링크](https://github.com/metaplex-foundation/mpl-hybrid/blob/main/programs/mpl-hybrid/src/state/nft_data.rs)

| 이름           | 타입   | 크기 | 설명                                      |     |
| -------------- | ------ | ---- | ----------------------------------------- | --- |
| authority      | Pubkey | 32   | 에스크로의 권한                           |     |
| token          | Pubkey | 32   | 분배될 토큰                               |     |
| fee_location   | Pubkey | 32   | 토큰 수수료를 보낼 계정                   |     |
| name           | String | 4    | NFT 이름                                  |     |
| uri            | String | 8    | NFT 메타데이터의 기본 URI                 |     |
| max            | u64    | 8    | URI에 추가할 NFT의 최대 인덱스            |     |
| min            | u64    | 8    | URI에 추가할 NFT의 최소 인덱스            |     |
| amount         | u64    | 8    | 스왑하는 토큰 비용                        |     |
| fee_amount     | u64    | 8    | NFT를 획득하기 위한 토큰 수수료           |     |
| sol_fee_amount | u64    | 8    | NFT를 획득하기 위한 솔 수수료             |     |
| count          | u64    | 8    | 총 스왑 수                                |     |
| path           | u16    | 1    | 온체인/오프체인 메타데이터 업데이트 경로  |     |
| bump           | u8     | 1    | 에스크로 범프                             |     |

{% /totem-accordion %}
{% /totem %}