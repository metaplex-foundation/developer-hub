---
title: NFT 가져오기
metaTitle: NFT 가져오기 | NFT
description: Metaplex Core를 사용하여 Solana에서 NFT를 가져오는 방법을 알아보세요
created: '03-12-2025'
updated: '03-12-2025'
---

Solana 블록체인에서 NFT 데이터를 가져옵니다. {% .lead %}

## NFT 또는 컬렉션 가져오기

다음 섹션에서 전체 코드 예제와 변경이 필요할 수 있는 파라미터를 확인할 수 있습니다. NFT와 컬렉션 가져오기에 대한 자세한 내용은 [Core 문서](/ko/smart-contracts/core/fetch)를 참조하세요.

{% code-tabs-imported from="core/fetch-asset" frameworks="umi,cli,das,curl" /%}

## 파라미터

가져오기에 맞게 다음 파라미터를 커스터마이징하세요:

| 파라미터 | 설명 |
|-----------|-------------|
| `assetAddress` | NFT 자산의 공개 키 |
| `collectionAddress` | 컬렉션의 공개 키 (선택 사항) |

## 작동 방식

가져오기 과정은 다음 단계를 포함합니다:

1. **주소 가져오기** - 가져오려는 NFT 자산 또는 컬렉션의 공개 키가 필요합니다
2. **자산 데이터 가져오기** - `fetchAsset`을 사용하여 이름, URI, 소유자, 플러그인을 포함한 NFT 정보를 조회합니다
3. **컬렉션 데이터 가져오기** - `fetchCollection`을 사용하여 컬렉션 정보를 조회합니다 (선택 사항)

## NFT와 컬렉션 데이터

자산을 가져오면 모든 데이터가 반환됩니다:

- **Name** - NFT의 이름
- **URI** - 메타데이터 JSON 링크
- **Owner** - NFT를 소유한 지갑
- **Update Authority** - NFT를 수정할 수 있는 사람
- **Plugins** - 로열티나 속성 같은 첨부된 플러그인

컬렉션을 가져오면 다음이 반환됩니다:

- **Name** - 컬렉션의 이름
- **URI** - 컬렉션 메타데이터 JSON 링크
- **Update Authority** - 컬렉션을 수정할 수 있는 사람
- **Num Minted** - 컬렉션 내 자산 수
- **Plugins** - 로열티나 속성 같은 첨부된 플러그인

