---
title: 에이전트 조회
metaTitle: 에이전트 조회 | Metaplex CLI
description: Metaplex CLI를 사용하여 등록된 MPL Core 에셋의 에이전트 ID 데이터를 조회하고 표시합니다.
keywords:
  - agents fetch
  - mplx agents fetch
  - agent identity
  - agent data
  - Metaplex CLI
about:
  - Agent identity lookup
  - Metaplex CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
created: '04-09-2026'
updated: '04-09-2026'
howToSteps:
  - Run mplx agents fetch with the Core asset address
  - Review the identity PDA, wallet PDA, registration URI, and lifecycle hooks
howToTools:
  - Metaplex CLI (mplx)
---

{% callout title="수행할 작업" %}
등록된 에이전트의 온체인 ID 데이터를 조회하고 검사합니다:
- 에이전트 ID PDA 및 Asset Signer 지갑 확인
- 등록 URI 및 라이프사이클 훅 확인
- 에셋에 등록된 에이전트 ID가 있는지 검증
{% /callout %}

## 요약

`mplx agents fetch` 명령어는 [MPL Core](/core) 에셋의 온체인 [에이전트 ID](/agents) PDA를 읽어 등록 정보, 라이프사이클 훅, 에이전트의 내장 지갑([Asset Signer PDA](/dev-tools/cli/config/asset-signer-wallets))을 표시합니다.

- **입력**: MPL Core 에셋 주소 ([`agents register`](/dev-tools/cli/agents/register)에서 생성)
- **출력**: ID PDA, 지갑 PDA, 등록 URI, 라이프사이클 훅
- **필수 플래그 없음**: 에셋 주소만 필요하며, `--json`은 선택 사항

**바로 가기:** [빠른 참조](#빠른-참조) · [사용법](#사용법) · [출력](#출력) · [참고 사항](#참고-사항)

## 빠른 참조

| 항목 | 값 |
|------|-----|
| **명령어** | `mplx agents fetch <ASSET_ADDRESS>` |
| **필수 인수** | `ASSET_ADDRESS` — 조회할 MPL Core 에셋 |
| **선택적 플래그** | `--json` — 기계 판독 가능한 출력 |

## 사용법

```bash {% title="에이전트 ID 조회" %}
mplx agents fetch <ASSET_ADDRESS>
```

## 출력

```text {% title="예상 출력 (등록된 에이전트)" %}
{
  registered: true,
  asset: '<asset_address>',
  owner: '<owner_address>',
  identityPda: '<identity_pda_address>',
  wallet: '<asset_signer_pda_address>',
  registrationUri: 'https://...',
  lifecycleChecks: { ... }
}
```

에셋에 등록된 에이전트 ID가 없는 경우:

```text {% title="예상 출력 (등록되지 않음)" %}
No agent identity found for this asset. The asset may not be registered.
```

## 참고 사항

- `wallet` 필드는 Asset Signer PDA입니다 — 트랜잭션 서명 및 자금 보관에 사용되는 에이전트의 내장 지갑입니다
- `registrationUri`는 등록 중에 업로드된 JSON 문서를 가리키며, 에이전트의 이름, 설명, 서비스, 신뢰 모델을 포함합니다
- 기계 판독 가능한 출력을 위해 `--json`을 사용하세요
