---
title: MPL 에이전트 레지스트리
metaTitle: MPL 에이전트 레지스트리 — Solana 온체인 에이전트 신원 | Metaplex
description: MPL Core 자산을 사용하여 Solana에서 에이전트 신원을 등록하고 실행 권한을 위임하는 온체인 프로그램.
keywords:
  - MPL Agent Registry
  - agent identity
  - execution delegation
  - MPL Core
  - Solana smart contracts
about:
  - Smart Contracts
  - Solana
  - Metaplex
proficiencyLevel: Intermediate
created: '02-25-2026'
updated: '03-12-2026'
---

**MPL 에이전트 레지스트리**는 MPL Core 자산을 사용하여 Solana에서 에이전트 신원을 등록하고 실행 권한을 위임하는 온체인 프로그램을 제공합니다. {% .lead %}

## Summary

MPL 에이전트 레지스트리는 검증 가능한 신원 레코드를 MPL Core 자산에 바인딩하고 임원 프로필을 통해 실행 위임을 관리하는 한 쌍의 온체인 Solana 프로그램입니다.

- **에이전트 신원 프로그램** — 신원 PDA를 등록하고 라이프사이클 훅이 있는 `AgentIdentity` 플러그인을 Core 자산에 연결합니다
- **에이전트 도구 프로그램** — 임원 프로필 및 실행 위임 레코드를 관리합니다
- **JavaScript/TypeScript SDK** — `@metaplex-foundation/mpl-agent-registry`는 명령어 빌더 및 계정 페처를 제공합니다
- **메인넷과 데브넷에서 동일한 주소** — 두 프로그램 모두 네트워크 전체에 동일한 주소로 배포되어 있습니다

{% callout title="경로 선택" %}
- **빠른 시작?** 설치 및 첫 번째 등록은 [시작하기](/smart-contracts/mpl-agent/getting-started)를 참조하세요
- **에이전트 등록?** [에이전트 등록](/agents/register-agent) 가이드를 따르세요
- **에이전트 데이터 읽기?** [에이전트 데이터 읽기](/agents/run-agent) 가이드를 따르세요
{% /callout %}

## 에이전트 레지스트리란 무엇인가?

에이전트 레지스트리는 검증 가능한 온체인 신원 레코드를 MPL Core 자산에 바인딩합니다. 등록하면 에이전트를 온체인에서 검색 가능하게 만드는 PDA(프로그램 파생 주소)가 생성되고, Transfer, Update, Execute 이벤트의 라이프사이클 훅이 있는 `AgentIdentity` 플러그인이 Core 자산에 연결됩니다.

에이전트가 신원을 갖게 되면 **에이전트 도구** 프로그램을 통해 자산 소유자가 임원 프로필에 실행 권한을 위임할 수 있습니다. 이를 통해 지정된 권한자가 에이전트 자산을 대신하여 작업을 실행할 수 있습니다.

## 프로그램

| 프로그램 | 주소 | 목적 |
|---------|------|------|
| **[에이전트 신원](/smart-contracts/mpl-agent/identity)** | `1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p` | 신원을 등록하고 라이프사이클 훅을 Core 자산에 연결합니다 |
| **[에이전트 도구](/smart-contracts/mpl-agent/tools)** | `TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S` | 임원 프로필 및 실행 위임 |

## 작동 방식

### 신원 등록

1. MPL Core 자산과 `agentRegistrationUri`를 지정하여 `RegisterIdentityV1`을 호출합니다
2. 프로그램이 시드 `["agent_identity", <asset>]`에서 파생된 PDA를 생성합니다
3. 프로그램이 MPL Core에 CPI하여 URI와 Transfer, Update, Execute 라이프사이클 체크가 있는 `AgentIdentity` 플러그인을 연결합니다
4. PDA는 역방향 조회를 위해 자산의 공개 키를 저장합니다

### 실행 위임

1. 임원이 `RegisterExecutiveV1`을 통해 프로필을 등록합니다
2. 자산 소유자가 `DelegateExecutionV1`을 호출하여 임원에게 에이전트 자산을 대신하여 실행할 권한을 부여합니다
3. 임원 프로필과 자산을 연결하는 위임 레코드 PDA가 생성됩니다

## SDK

| 언어 | 패키지 |
|------|--------|
| JavaScript/TypeScript | `@metaplex-foundation/mpl-agent-registry` |

```shell
npm install @metaplex-foundation/mpl-agent-registry
```

## 다음 단계

1. **[시작하기](/smart-contracts/mpl-agent/getting-started)** — 설치, 설정, 첫 번째 등록
2. **[에이전트 신원](/smart-contracts/mpl-agent/identity)** — 신원 프로그램 세부 정보, 계정, PDA 파생
3. **[에이전트 도구](/smart-contracts/mpl-agent/tools)** — 임원 프로필 및 실행 위임

*[Metaplex](https://github.com/metaplex-foundation) 관리 · 2026년 3월 최종 확인 · [GitHub에서 소스 보기](https://github.com/metaplex-foundation/mpl-agent)*
