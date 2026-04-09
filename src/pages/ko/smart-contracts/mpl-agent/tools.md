---
title: 에이전트 도구
metaTitle: 에이전트 도구 프로그램 | MPL 에이전트 레지스트리 | Metaplex
description: MPL 에이전트 도구 프로그램 기술 참조 — 임원 프로필, 실행 위임, 계정, PDA 파생.
keywords:
  - Agent Tools program
  - executive profile
  - execution delegation
  - RegisterExecutiveV1
  - DelegateExecutionV1
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Smart Contracts
  - Solana
  - Metaplex
proficiencyLevel: Advanced
created: '03-11-2026'
updated: '03-12-2026'
---

에이전트 도구 프로그램은 에이전트 자산의 임원 위임을 관리하여, 자산 소유자가 임원 프로필에 실행 권한을 위임할 수 있도록 합니다. {% .lead %}

## Summary

에이전트 도구 프로그램(`TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S`)은 실행 위임을 관리하는 두 가지 명령어를 제공합니다: `RegisterExecutiveV1`은 임원 프로필을 생성하고, `DelegateExecutionV1`은 해당 프로필에 에이전트 자산을 대신하여 실행할 권한을 부여합니다.

- **두 가지 명령어** — `RegisterExecutiveV1`(일회성 프로필 설정)과 `DelegateExecutionV1`(자산별 위임)
- **ExecutiveProfileV1** — `["executive_profile", <authority>]`에서 파생된 40바이트 PDA. 지갑당 하나
- **ExecutionDelegateRecordV1** — 임원 프로필과 특정 에이전트 자산을 연결하는 104바이트 PDA
- **소유자 전용 위임** — 자산 소유자만 위임 레코드를 생성할 수 있습니다. 프로그램이 온체인에서 소유권을 검증합니다

## 프로그램 ID

동일한 프로그램 주소가 메인넷과 데브넷 모두에 배포되어 있습니다.

| 네트워크 | 주소 |
|---------|------|
| 메인넷 | `TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S` |
| 데브넷 | `TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S` |

## 개요

도구 프로그램은 두 가지 명령어를 제공합니다.

1. **RegisterExecutiveV1** — 에이전트 자산의 실행자 역할을 할 수 있는 임원 프로필을 생성합니다
2. **DelegateExecutionV1** — 임원 프로필에 에이전트 자산을 대신하여 실행할 권한을 부여합니다

임원 프로필은 권한자당 한 번 등록됩니다. 위임은 자산별로 이루어집니다. 자산 소유자가 에이전트 자산을 특정 임원 프로필에 연결하는 위임 레코드를 생성합니다.

## 명령어: RegisterExecutiveV1

지정된 권한자의 임원 프로필 PDA를 생성합니다.

### 계정

프로필 PDA, 페이어, 선택적 권한자, 시스템 프로그램의 네 가지 계정이 필요합니다.

| 계정 | 쓰기 가능 | 서명자 | 선택 사항 | 설명 |
|------|---------|--------|--------|------|
| `executiveProfile` | 예 | 아니요 | 아니요 | 생성될 PDA (권한자에서 자동 파생) |
| `payer` | 예 | 예 | 아니요 | 계정 임대 및 수수료 지불 |
| `authority` | 아니요 | 예 | 예 | 이 임원 프로필의 권한자 (기본값은 `payer`) |
| `systemProgram` | 아니요 | 아니요 | 아니요 | 시스템 프로그램 |

### 동작 내용

1. 시드 `["executive_profile", <authority>]`에서 PDA를 파생합니다
2. 계정이 초기화되지 않았음을 검증합니다
3. 권한자를 저장하는 `ExecutiveProfileV1` 계정(40바이트)을 생성하고 초기화합니다

## 명령어: DelegateExecutionV1

에이전트 자산에 대한 실행 권한을 임원 프로필에 위임합니다.

### 계정

임원 프로필, 에이전트 자산, 신원 PDA, 생성될 위임 레코드 PDA를 포함한 7개의 계정이 필요합니다.

| 계정 | 쓰기 가능 | 서명자 | 선택 사항 | 설명 |
|------|---------|--------|--------|------|
| `executiveProfile` | 아니요 | 아니요 | 아니요 | 등록된 임원 프로필 |
| `agentAsset` | 아니요 | 아니요 | 아니요 | 위임할 MPL Core 자산 |
| `agentIdentity` | 아니요 | 아니요 | 아니요 | 자산의 에이전트 신원 PDA |
| `executionDelegateRecord` | 예 | 아니요 | 아니요 | 생성될 PDA (자동 파생) |
| `payer` | 예 | 예 | 아니요 | 계정 임대 및 수수료 지불 |
| `authority` | 아니요 | 예 | 예 | 자산 소유자여야 합니다 (기본값은 `payer`) |
| `systemProgram` | 아니요 | 아니요 | 아니요 | 시스템 프로그램 |

### 동작 내용

1. 임원 프로필이 존재하고 초기화되었음을 검증합니다
2. 에이전트 자산이 유효한 MPL Core 자산임을 검증합니다
3. 에이전트 신원이 자산에 등록되었음을 검증합니다
4. 서명자가 자산 소유자임을 검증합니다
5. 시드 `["execution_delegate_record", <executive_profile>, <agent_asset>]`에서 PDA를 파생합니다
6. `ExecutionDelegateRecordV1` 계정(104바이트)을 생성하고 초기화합니다

## PDA 파생

두 계정 유형 모두 결정론적 시드에서 파생된 PDA입니다. SDK 헬퍼를 사용하여 계산하세요.

| 계정 | 시드 | 크기 |
|------|------|------|
| `ExecutiveProfileV1` | `["executive_profile", <authority>]` | 40바이트 |
| `ExecutionDelegateRecordV1` | `["execution_delegate_record", <executive_profile>, <agent_asset>]` | 104바이트 |

```typescript
import {
  findExecutiveProfileV1Pda,
  findExecutionDelegateRecordV1Pda,
} from '@metaplex-foundation/mpl-agent-registry';

const profilePda = findExecutiveProfileV1Pda(umi, {
  authority: authorityPublicKey,
});

const delegatePda = findExecutionDelegateRecordV1Pda(umi, {
  executiveProfile: profilePda,
  agentAsset: assetPublicKey,
});
```

## 계정: ExecutiveProfileV1

이 임원 프로필을 소유하는 권한자를 저장합니다. 40바이트, 8바이트 정렬.

| 오프셋 | 필드 | 유형 | 크기 | 설명 |
|-------|------|------|------|------|
| 0 | `key` | `u8` | 1 | 계정 판별자 (`1` = ExecutiveProfileV1) |
| 1 | `_padding` | `[u8; 7]` | 7 | 정렬 패딩 |
| 8 | `authority` | `Pubkey` | 32 | 이 임원 프로필의 권한자 |

## 계정: ExecutionDelegateRecordV1

임원 프로필과 에이전트 자산을 연결하여 대신 실행 권한이 있는 사람을 기록합니다. 104바이트, 8바이트 정렬.

| 오프셋 | 필드 | 유형 | 크기 | 설명 |
|-------|------|------|------|------|
| 0 | `key` | `u8` | 1 | 계정 판별자 (`2` = ExecutionDelegateRecordV1) |
| 1 | `bump` | `u8` | 1 | PDA 범프 시드 |
| 2 | `_padding` | `[u8; 6]` | 6 | 정렬 패딩 |
| 8 | `executiveProfile` | `Pubkey` | 32 | 임원 프로필 주소 |
| 40 | `authority` | `Pubkey` | 32 | 임원 권한자 |
| 72 | `agentAsset` | `Pubkey` | 32 | 에이전트 자산 주소 |

## 오류

프로그램은 등록 또는 위임 중 검증 실패 시 이 오류들을 반환합니다.

| 코드 | 이름 | 설명 |
|-----|------|------|
| 0 | `InvalidSystemProgram` | 시스템 프로그램 계정이 잘못되었습니다 |
| 1 | `InvalidInstructionData` | 명령어 데이터가 올바르지 않습니다 |
| 2 | `InvalidAccountData` | 유효하지 않은 계정 데이터 |
| 3 | `InvalidMplCoreProgram` | MPL Core 프로그램 계정이 잘못되었습니다 |
| 4 | `InvalidCoreAsset` | 자산이 유효한 MPL Core 자산이 아닙니다 |
| 5 | `ExecutiveProfileMustBeUninitialized` | 임원 프로필이 이미 존재합니다 |
| 6 | `InvalidExecutionDelegateRecordDerivation` | 위임 레코드 PDA 파생 불일치 |
| 7 | `ExecutionDelegateRecordMustBeUninitialized` | 위임 레코드가 이미 존재합니다 |
| 8 | `InvalidAgentIdentity` | 에이전트 신원 계정이 유효하지 않습니다 |
| 9 | `AgentIdentityNotRegistered` | 자산에 등록된 신원이 없습니다 |
| 10 | `AssetOwnerMustBeTheOneToDelegateExecution` | 실행을 위임할 수 있는 것은 자산 소유자뿐입니다 |
| 11 | `InvalidExecutiveProfileDerivation` | 임원 프로필 PDA 파생 불일치 |

*[Metaplex](https://github.com/metaplex-foundation) 관리 · 2026년 3월 최종 확인 · [GitHub에서 소스 보기](https://github.com/metaplex-foundation/mpl-agent)*
