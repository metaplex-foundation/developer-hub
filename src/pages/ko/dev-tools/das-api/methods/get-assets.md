---
title: Get Assets
metaTitle: Get Assets | DAS API
description: 여러 압축된/표준 자산의 정보를 반환합니다
tableOfContents: false
---

메타데이터 및 소유자를 포함한 여러 압축된/표준 자산의 정보를 반환합니다.

## 매개변수

| 이름  | 필수 | 설명            |
| ----- | :------: | ---------------------- |
| `ids` |    ✅    | 자산 ID 배열입니다. |
| `options` |          | 표시 옵션 객체입니다. 자세한 내용은 [표시 옵션](/ko/dev-tools/das-api/display-options)을 참조하세요. |

## 에이전트 필드 (`MplCoreAsset`)

응답 배열의 각 항목은 [`getAsset`](/ko/dev-tools/das-api/methods/get-asset#agent-fields-mplcoreasset)과 동일한 자산 형태를 사용합니다. `MplCoreAsset` 행에는 `is_agent`, `asset_signer`, `agent_token`이 포함될 수 있습니다.

필드 정의 및 예제는 [에이전트 데이터 읽기](/ko/agents/read-agent-data#read-agent-data-via-das-api)를 참조하세요.

## Playground

{% apiRenderer method="getAssets" /%}
