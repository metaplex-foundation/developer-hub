---
title: MPL Agent Registry
metaTitle: MPL Agent Registry — Solana 온체인 에이전트 신원 | Metaplex
description: MPL Core 자산을 사용하여 Solana에서 에이전트 신원을 등록하고 실행을 위임하는 온체인 프로그램입니다.
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
updated: '03-30-2026'
---

**MPL Agent Registry**는 MPL Core 자산을 사용하여 Solana에서 에이전트 신원을 등록하고 실행 권한을 위임하는 온체인 프로그램을 제공합니다. {% .lead %}

## 요약

MPL Agent Registry는 검증 가능한 신원 기록을 MPL Core 자산에 바인딩하고 executive 프로필을 통해 실행 위임을 관리하는 한 쌍의 온체인 Solana 프로그램입니다.

- **Agent Identity 프로그램** — 신원 PDA를 등록하고 라이프사이클 훅이 있는 `AgentIdentity` 플러그인을 첨부하며 선택적으로 [Genesis](/smart-contracts/genesis) 토큰을 연결합니다
- **Agent Tools 프로그램** — executive 프로필, 실행 위임 기록 및 위임 철회를 관리합니다
- **JavaScript/TypeScript SDK** — `@metaplex-foundation/mpl-agent-registry`가 명령 빌더와 계정 fetcher를 제공합니다
- **Mainnet과 Devnet에서 동일한 주소** — 두 프로그램 모두 네트워크 간 동일한 주소에 배포되어 있습니다

{% callout title="경로 선택" %}
- **빠른 시작?** 설치 및 첫 등록은 [시작하기](/smart-contracts/mpl-agent/getting-started)를 참조하세요
- **에이전트 등록?** [에이전트 등록](/agents/register-agent) 가이드를 따르세요
- **에이전트 데이터 읽기?** [에이전트 데이터 읽기](/agents/run-agent) 가이드를 따르세요
{% /callout %}

## Agent Registry란?

Agent Registry는 검증 가능한 온체인 신원 기록을 MPL Core 자산에 바인딩합니다. 등록 시 에이전트를 온체인에서 검색 가능하게 하는 PDA(Program Derived Address)가 생성되며, Transfer, Update, Execute 이벤트에 대한 라이프사이클 훅이 있는 `AgentIdentity` 플러그인이 Core 자산에 첨부됩니다.

에이전트가 신원을 갖게 되면 **Agent Tools** 프로그램을 통해 자산 소유자가 executive 프로필에 실행 권한을 위임할 수 있어, 지정된 권한자가 에이전트 자산을 대신하여 작업을 실행할 수 있습니다.

## 프로그램

| 프로그램 | 주소 | 용도 |
|---------|---------|---------|
| **[Agent Identity](/smart-contracts/mpl-agent/identity)** | `1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p` | 신원을 등록하고 Core 자산에 라이프사이클 훅을 첨부합니다 |
| **[Agent Tools](/smart-contracts/mpl-agent/tools)** | `TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S` | Executive 프로필 및 실행 위임 |

## 작동 방식

### 신원 등록

1. MPL Core 자산과 `agentRegistrationUri`를 사용하여 `RegisterIdentityV1`을 호출합니다
2. 프로그램이 시드 `["agent_identity", <asset>]`에서 파생된 PDA를 생성합니다
3. 프로그램이 MPL Core에 CPI를 수행하여 URI와 Transfer, Update, Execute에 대한 라이프사이클 검사가 포함된 `AgentIdentity` 플러그인을 첨부합니다
4. PDA가 역방향 조회를 위해 자산의 공개 키를 저장합니다
5. 선택적으로 `SetAgentTokenV1`을 호출하여 [Genesis](/smart-contracts/genesis) 토큰을 신원에 연결합니다

### 실행 위임

1. Executive가 `RegisterExecutiveV1`을 통해 프로필을 등록합니다
2. 자산 소유자가 `DelegateExecutionV1`을 호출하여 executive에게 에이전트 자산을 대신하여 실행할 권한을 부여합니다
3. Executive 프로필과 자산을 연결하는 위임 기록 PDA가 생성됩니다
4. 소유자 또는 executive 중 누구든 `RevokeExecutionV1`을 호출하여 위임을 제거할 수 있습니다

## SDK

| 언어 | 패키지 |
|----------|---------|
| JavaScript/TypeScript | `@metaplex-foundation/mpl-agent-registry` |

```shell
npm install @metaplex-foundation/mpl-agent-registry
```

## 다음 단계

1. **[시작하기](/smart-contracts/mpl-agent/getting-started)** — 설치, 설정 및 첫 등록
2. **[Agent Identity](/smart-contracts/mpl-agent/identity)** — 신원 프로그램 세부사항, 계정 및 PDA 파생
3. **[Agent Tools](/smart-contracts/mpl-agent/tools)** — Executive 프로필 및 실행 위임
