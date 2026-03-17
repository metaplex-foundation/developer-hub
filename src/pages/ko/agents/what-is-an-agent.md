---
title: 에이전트란?
metaTitle: Solana의 에이전트란? | Metaplex Agent Registry
description: Solana의 자율 에이전트는 내장 지갑과 온체인 신원 기록을 가진 MPL Core 자산입니다. 에이전트 신원, 지갑 및 실행 위임의 작동 방식을 알아봅니다.
keywords:
  - Solana agents
  - autonomous agents
  - agent identity
  - MPL Core
  - execution delegation
  - Asset Signer
about:
  - Autonomous Agents
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '03-12-2026'
updated: '03-12-2026'
---

Solana의 자율 에이전트는 [Metaplex Agent Registry](/smart-contracts/mpl-agent)가 관리하는 내장 지갑과 온체인 신원 기록을 가진 [MPL Core](/smart-contracts/core) 자산입니다. {% .lead %}

## 요약

에이전트는 온체인 신원으로 등록되어 자체 PDA 파생 지갑에 자금을 보유할 수 있는 MPL Core 자산입니다. 실행은 오프체인 운영자에게 위임되므로 소유자가 모든 트랜잭션을 승인할 필요 없이 에이전트가 자율적으로 행동할 수 있습니다.

- **신원** — PDA 레코드와 `AgentIdentity` 플러그인이 검증 가능한 신원을 Core 자산에 바인딩합니다
- **지갑** — 자산의 내장 PDA 지갑(Asset Signer)은 개인 키 노출 없이 SOL, 토큰 및 기타 자산을 보유합니다
- **위임** — 오프체인 이그제큐티브가 Core의 Execute 라이프사이클 훅을 통해 에이전트를 대신하여 트랜잭션에 서명합니다
- **소유자 제어** — 소유자는 에이전트의 신원이나 지갑을 변경하지 않고 언제든지 위임을 취소하거나 전환할 수 있습니다

## 에이전트 자산의 작동 방식

모든 [MPL Core](/smart-contracts/core) 자산에는 내장 지갑이 있습니다. 이는 자산의 공개 키에서 파생된 PDA입니다. 개인 키가 존재하지 않으므로 지갑이 도난될 수 없습니다. Core의 [Execute](/smart-contracts/core/execute-asset-signing) 라이프사이클 훅을 통해 자산 자체만이 자신의 지갑에 대해 서명할 수 있습니다.

이것이 Core 자산을 자율 에이전트에 적합하게 만듭니다:

- **자산이 에이전트의 신원** — [AgentIdentity](/agents/register-agent) 플러그인으로 온체인에 등록됩니다
- **자산의 PDA 지갑이 에이전트의 자금을 보유** — 에이전트만이 독점적으로 제어하는 SOL, 토큰 및 기타 자산
- **이그제큐티브가 에이전트를 대신하여 행동** — Solana에는 백그라운드 작업이나 온체인 추론이 없으므로 위임된 [이그제큐티브](/agents/run-an-agent)가 에이전트를 대신하여 트랜잭션에 서명합니다. 소유자는 모든 작업을 승인할 필요가 없습니다.

소유자는 완전한 제어를 유지합니다. 어떤 이그제큐티브에게 위임할지 선택하고, 에이전트의 신원이나 지갑을 변경하지 않고 언제든지 위임을 취소하거나 전환할 수 있습니다.

## 다음 단계

- **[스킬](/agents/skill)** — AI 코딩 에이전트에 Metaplex 프로그램의 완전한 지식 제공
- **[에이전트 등록](/agents/register-agent)** — MPL Core 자산에 신원 기록 바인딩
- **[에이전트 데이터 읽기](/agents/run-agent)** — 등록 확인 및 온체인 에이전트 신원 검사
- **[에이전트 실행](/agents/run-an-agent)** — 이그제큐티브 프로필 설정 및 실행 위임

*Metaplex 관리 · 2026년 3월 검증 완료*
