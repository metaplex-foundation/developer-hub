---
title: 그룹별 Core 자산 가져오기
metaTitle: 그룹별 Core 자산 가져오기 | DAS API Core 확장
description: mpl-core GroupV1의 멤버를 Core 타입의 자산, 컬렉션 또는 중첩 그룹으로 나열합니다.
created: '07-22-2026'
updated: '11-04-2026'
keywords:
  - das getAssetsByGroup core
  - mpl-core-das getAssetsByGroup
  - core group members
  - groupKey group
about:
  - DAS API
  - MPL Core
  - Core Groups
proficiencyLevel: Intermediate
---

## 요약

`das.getAssetsByGroup`은 [mpl-core GroupV1](/ko/smart-contracts/core/groups)의 멤버를 나열하고 Core 타입의 결과를 반환합니다.

- `groupKey: "group"`으로 기본 DAS를 호출합니다
- 멤버는 자산, 컬렉션 또는 중첩 그룹일 수 있습니다
- `skipDerivePlugins: true`를 지정하지 않으면 자산의 컬렉션 플러그인을 파생합니다
- 이름과 크기만 필요하면 [`getGrouping`](/ko/dev-tools/das-api/core-extension/methods/get-grouping)을 사용하세요

## 코드 예제

`das.getAssetsByGroup`은 Umi 인스턴스와 `GroupV1` 주소를 받아 그룹의 멤버를 Core 타입의 결과로 반환합니다.

`<ENDPOINT>`를 DAS RPC로, `<PublicKey>`를 GroupV1 주소로 바꾸세요.

{% code-tabs-imported from="das-api/core-extension/get-assets-by-group" frameworks="umi" /%}

## 파라미터

이 헬퍼는 Umi 인스턴스와 그 뒤의 옵션 객체를 받습니다.

| 이름                 | 필수 | 설명 |
| -------------------- | :------: | ----------- |
| `group`              |    ✅    | mpl-core GroupV1 공개 키. |
| `sortBy`             |          | 정렬 기준 `{ sortBy, sortDirection }`. |
| `limit`              |          | 가져올 최대 항목 수. |
| `page`               |          | 가져올 페이지의 인덱스. |
| `before` / `after`   |          | 커서 방식의 페이지네이션 ID. |
| `cursor`             |          | 지원되는 경우 제공자 커서. |
| `displayOptions`     |          | Core에서는 `showCollectionMetadata`만 지원됩니다. |
| `skipDerivePlugins`  |          | 자산의 자동 컬렉션 플러그인 파생을 건너뜁니다. |

## 참고 사항

- 이것은 GroupV1 멤버십용 Core 헬퍼입니다. 기본 DAS를 통한 Token Metadata / 컬렉션 그룹화는 `groupKey: "collection"`을 사용하는 [`getAssetsByGroup`](/ko/dev-tools/das-api/methods/get-assets-by-group)을 참고하세요.
- `@metaplex-foundation/digital-asset-standard-api` ≥ 2.1.1과 Core 그룹을 인덱싱하는 RPC가 필요합니다.
