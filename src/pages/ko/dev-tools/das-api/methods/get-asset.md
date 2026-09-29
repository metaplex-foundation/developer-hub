---
title: Get Asset
metaTitle: Get Asset | DAS API
description: 압축된/표준 자산의 정보를 반환합니다
tableOfContents: false
---

메타데이터 및 소유자를 포함한 압축된/표준 자산의 정보를 반환합니다.

MPL-Core 컬렉션에서 판매자 수수료를 상속하는 Bubblegum V2 cNFT의 경우, 컬렉션에서 해석된 표시 값은 `royalty.basis_points` / `creators`에 있고, 리프 값은 `royalty.basis_points_raw` / `creators_raw`에 있습니다(`royalty.inherited: true`). [상속 로열티 읽기](/ko/smart-contracts/bubblegum-v2/reading-inherited-royalties)를 참조하세요.

## 매개변수

| 이름            | 필수 | 설명                                |
| --------------- | :------: | ------------------------------------------ |
| `id`            |    ✅    | 자산의 ID입니다.                       |
| `options`       |          | 표시 옵션 객체입니다. 자세한 내용은 [표시 옵션](/ko/dev-tools/das-api/display-options)을 참조하세요. |

## 에이전트 필드 (`MplCoreAsset`) {#agent-fields-mplcoreasset}

`MplCoreAsset` 응답에는 [에이전트 레지스트리](/ko/smart-contracts/mpl-agent)에서 인덱싱된 에이전트 관련 필드가 포함될 수 있습니다. Core가 아닌 인터페이스에서는 이러한 필드가 생략됩니다. 컬렉션 및 그룹에는 `is_agent: false`가 포함될 수 있지만, 개별 Core 자산만 에이전트가 될 수 있습니다.

| 필드 | 타입 | 설명 |
|-------|------|-------------|
| `is_agent` | `boolean` | 자산에 `AgentIdentity` 외부 플러그인이 있으면 `true` |
| `asset_signer` | `string` | Core Asset Signer PDA — 모든 `MplCoreAsset`에서 반환되며, `is_agent`가 `true`일 때 에이전트 지갑으로 작동 |
| `agent_token` | `string` | `AgentIdentityV2` PDA의 정규 토큰 민트. [`setAgentTokenV1`](/ko/dev-tools/cli/agents/set-agent-token)이 호출될 때까지 생략됨 |

예제 및 인덱싱 동작은 [에이전트 데이터 읽기](/ko/agents/read-agent-data#read-agent-data-via-das-api)를 참조하세요.

## Playground

{% apiRenderer method="getAsset" /%}
