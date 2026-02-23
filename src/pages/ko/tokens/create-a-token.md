---
title: 대체 가능 토큰 생성하기
metaTitle: 대체 가능 토큰 생성하기 | 토큰
description: Solana에서 메타데이터가 있는 대체 가능 SPL 토큰을 생성하는 방법을 알아보세요
created: '11-25-2025'
updated: '11-25-2025'
---

Token Metadata 프로그램을 사용하여 Solana에서 메타데이터가 있는 대체 가능 토큰을 생성합니다. {% .lead %}

## 학습 내용
이 가이드에서는 다음을 포함한 대체 가능 토큰 생성 및 발행 방법을 설명합니다:

- 커스텀 이름, 심볼, 메타데이터
- 토큰 이미지와 설명
- 설정 가능한 소수점 자릿수(분할 가능성)
- 초기 토큰 공급량

## 토큰 생성하기

다음 코드는 완전히 실행 가능한 예제입니다. 아래에 커스터마이징할 수 있는 파라미터가 표시됩니다. 토큰 생성 세부 사항에 대해서는 [Token Metadata 프로그램](/ko/smart-contracts/token-metadata/mint#minting-tokens) 페이지에서 자세히 알아볼 수 있습니다.

{% code-tabs-imported from="token-metadata/fungibles/create" frameworks="umi,kit,cli" /%}

## 파라미터

토큰에 맞게 다음 파라미터를 커스터마이징하세요:

| 파라미터 | 설명 |
|-----------|-------------|
| `name` | 토큰 이름 (최대 32자) |
| `symbol`| 토큰의 짧은 이름 (최대 6자) |
| `uri` | 오프체인 메타데이터 JSON 링크 |
| `sellerFeeBasisPoints` | 로열티 비율 (550 = 5.5%) |
| `decimals` | 소수점 자릿수 (`some(9)`이 표준) |
| `amount` | 발행할 토큰 수 |

## 메타데이터와 이미지

`uri`는 최소한 다음 정보를 포함하는 JSON 파일을 가리켜야 합니다. 자세한 내용은 [Token Metadata 표준 페이지](/ko/smart-contracts/token-metadata/token-standard#the-fungible-standard)에서 확인할 수 있습니다. JSON과 이미지 URL을 어디서나 접근할 수 있도록 업로드해야 합니다. Arweave와 같은 web3 스토리지 제공업체 사용을 권장합니다. 코드로 수행하려면 이 [Turbo로 결정론적 메타데이터 생성 가이드](/ko/guides/general/create-deterministic-metadata-with-turbo)를 따르세요.

```json
{
  "name": "My Fungible Token",
  "symbol": "MFT",
  "description": "A fungible token on Solana",
  "image": "https://arweave.net/tx-hash"
}
```
