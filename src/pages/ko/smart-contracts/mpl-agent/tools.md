---
title: Agent Tools
metaTitle: Agent Tools 프로그램 | MPL Agent Registry | Metaplex
description: MPL Agent Tools 프로그램 기술 참조 — executive 프로필, 실행 위임, 철회, 계정 및 PDA 파생.
keywords:
  - Agent Tools program
  - executive profile
  - execution delegation
  - RegisterExecutiveV1
  - DelegateExecutionV1
  - RevokeExecutionV1
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Smart Contracts
  - Solana
  - Metaplex
proficiencyLevel: Advanced
created: '03-11-2026'
updated: '03-30-2026'
---

Agent Tools 프로그램은 에이전트 자산의 executive 위임을 관리하여 자산 소유자가 실행 권한을 위임하고 철회할 수 있게 합니다. {% .lead %}

## 요약

Agent Tools 프로그램(`TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S`)은 실행 위임을 관리하는 세 가지 명령을 제공합니다: `RegisterExecutiveV1`은 executive 프로필을 생성하고, `DelegateExecutionV1`은 해당 프로필에 에이전트 자산을 대신하여 실행할 권한을 부여하며, `RevokeExecutionV1`은 해당 권한을 제거합니다.

- **세 가지 명령** — `RegisterExecutiveV1`(1회 프로필 설정), `DelegateExecutionV1`(자산별 위임), `RevokeExecutionV1`(철회)
- **ExecutiveProfileV1** — `["executive_profile", <authority>]`에서 파생된 40바이트 PDA, 지갑당 하나
- **ExecutionDelegateRecordV1** — executive 프로필을 특정 에이전트 자산에 연결하는 104바이트 PDA
- **소유자 전용 위임** — 자산 소유자만 위임 기록을 생성할 수 있으며 프로그램이 온체인에서 소유권을 확인합니다
- **이중 권한 철회** — 자산 소유자 또는 executive 권한자 모두 위임을 철회할 수 있습니다

## Program ID

동일한 프로그램 주소가 Mainnet과 Devnet 모두에 배포되어 있습니다.

| 네트워크 | 주소 |
|---------|---------|
| Mainnet | `TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S` |
| Devnet | `TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S` |

## 개요

tools 프로그램은 세 가지 명령을 제공합니다:

1. **RegisterExecutiveV1** — 에이전트 자산의 실행자로 활동할 수 있는 executive 프로필 생성
2. **DelegateExecutionV1** — executive 프로필에 에이전트 자산을 대신하여 실행할 권한 부여
3. **RevokeExecutionV1** — 기존 실행 위임 제거 및 렌트 회수

Executive 프로필은 권한자당 한 번 등록됩니다. 위임은 자산별로 수행됩니다 — 자산 소유자가 에이전트 자산을 특정 executive 프로필에 연결하는 위임 기록을 생성합니다. 어느 쪽이든 위임을 철회할 수 있습니다.

## 명령: RegisterExecutiveV1

주어진 권한자에 대한 executive 프로필 PDA를 생성합니다.

### 계정

프로필 PDA 생성, payer, 선택적 authority, system 프로그램 등 네 개의 계정이 필요합니다.

| 계정 | Writable | Signer | Optional | 설명 |
|---------|----------|--------|----------|-------------|
| `executiveProfile` | Yes | No | No | 생성할 PDA (authority에서 자동 파생) |
| `payer` | Yes | Yes | No | 계정 렌트 및 수수료 지불 |
| `authority` | No | Yes | Yes | 이 executive 프로필의 권한자 (기본값: `payer`) |
| `systemProgram` | No | No | No | System 프로그램 |

### RegisterExecutiveV1의 동작

1. 시드 `["executive_profile", <authority>]`에서 PDA를 파생합니다
2. 계정이 초기화되지 않았는지 확인합니다
3. authority를 저장하는 `ExecutiveProfileV1` 계정(40바이트)을 생성하고 초기화합니다

## 명령: DelegateExecutionV1

에이전트 자산에 대한 실행 권한을 executive 프로필에 위임합니다.

### 계정

Executive 프로필, 에이전트 자산, 신원 PDA, 생성할 위임 기록 PDA를 포함한 7개의 계정이 필요합니다.

| 계정 | Writable | Signer | Optional | 설명 |
|---------|----------|--------|----------|-------------|
| `executiveProfile` | No | No | No | 등록된 executive 프로필 |
| `agentAsset` | No | No | No | 위임할 MPL Core 자산 |
| `agentIdentity` | No | No | No | 자산의 [에이전트 신원](/smart-contracts/mpl-agent/identity) PDA |
| `executionDelegateRecord` | Yes | No | No | 생성할 PDA (자동 파생) |
| `payer` | Yes | Yes | No | 계정 렌트 및 수수료 지불 |
| `authority` | No | Yes | Yes | 자산 소유자여야 합니다 (기본값: `payer`) |
| `systemProgram` | No | No | No | System 프로그램 |

### DelegateExecutionV1의 동작

1. Executive 프로필이 존재하고 초기화되었는지 확인합니다
2. 에이전트 자산이 유효한 MPL Core 자산인지 확인합니다
3. 자산에 대해 [에이전트 신원](/smart-contracts/mpl-agent/identity)이 등록되어 있는지 확인합니다
4. 서명자가 자산 소유자인지 확인합니다
5. 시드 `["execution_delegate_record", <executive_profile>, <agent_asset>]`에서 PDA를 파생합니다
6. `ExecutionDelegateRecordV1` 계정(104바이트)을 생성하고 초기화합니다

## 명령: RevokeExecutionV1

실행 위임 기록을 닫아 executive가 에이전트 자산을 대신하여 활동할 수 있는 권한을 제거합니다. 닫힌 계정의 렌트는 지정된 목적지로 환불됩니다.

### 계정

| 계정 | Writable | Signer | Optional | 설명 |
|---------|----------|--------|----------|-------------|
| `executionDelegateRecord` | Yes | No | No | 닫을 위임 기록 |
| `agentAsset` | No | No | No | 위임 대상이었던 에이전트 자산 |
| `destination` | Yes | No | No | 닫힌 계정에서 환불된 렌트를 수신 |
| `payer` | Yes | Yes | No | Payer |
| `authority` | No | Yes | Yes | 자산 소유자 또는 executive 권한자여야 합니다 (기본값: `payer`) |
| `systemProgram` | No | No | No | System 프로그램 |

### RevokeExecutionV1의 동작

1. 위임 기록이 존재하고 초기화되었으며 이 프로그램이 소유하는지 확인합니다
2. 기록의 `agentAsset` 필드가 제공된 에이전트 자산과 일치하는지 확인합니다
3. 위임 기록의 PDA 파생을 확인합니다
4. 에이전트 자산이 유효한 MPL Core 자산인지 확인합니다
5. 서명자가 **자산 소유자** 또는 위임에 기록된 **executive 권한자**인지 확인합니다
6. 위임 기록 계정을 닫고 `destination`으로 렌트를 환불합니다

{% callout type="note" %}
자산 소유자와 executive 모두 위임을 철회할 수 있습니다. 이는 executive가 자발적으로 에이전트에서 자신을 해제할 수 있고, 소유자가 executive의 서명 없이도 executive를 제거할 수 있음을 의미합니다.
{% /callout %}

```typescript
import { revokeExecutionV1 } from '@metaplex-foundation/mpl-agent-registry';

await revokeExecutionV1(umi, {
  executionDelegateRecord: delegateRecordPda,
  agentAsset: agentAssetPublicKey,
  destination: umi.payer.publicKey,
}).sendAndConfirm(umi);
```

## PDA 파생

두 계정 타입 모두 결정론적 시드에서 파생된 PDA입니다. SDK 헬퍼를 사용하여 계산하세요.

| 계정 | 시드 | 크기 |
|---------|-------|------|
| `ExecutiveProfileV1` | `["executive_profile", <authority>]` | 40 bytes |
| `ExecutionDelegateRecordV1` | `["execution_delegate_record", <executive_profile>, <agent_asset>]` | 104 bytes |

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

이 executive 프로필을 소유하는 authority를 저장합니다. 40바이트, 8바이트 정렬.

| Offset | 필드 | 타입 | 크기 | 설명 |
|--------|-------|------|------|-------------|
| 0 | `key` | `u8` | 1 | 계정 discriminator (`1` = ExecutiveProfileV1) |
| 1 | `_padding` | `[u8; 7]` | 7 | 정렬 패딩 |
| 8 | `authority` | `Pubkey` | 32 | 이 executive 프로필의 권한자 |

## 계정: ExecutionDelegateRecordV1

Executive 프로필을 에이전트 자산에 연결하여 누가 대신 실행할 권한이 있는지 기록합니다. 104바이트, 8바이트 정렬.

| Offset | 필드 | 타입 | 크기 | 설명 |
|--------|-------|------|------|-------------|
| 0 | `key` | `u8` | 1 | 계정 discriminator (`2` = ExecutionDelegateRecordV1) |
| 1 | `bump` | `u8` | 1 | PDA bump 시드 |
| 2 | `_padding` | `[u8; 6]` | 6 | 정렬 패딩 |
| 8 | `executiveProfile` | `Pubkey` | 32 | Executive 프로필 주소 |
| 40 | `authority` | `Pubkey` | 32 | Executive 권한자 |
| 72 | `agentAsset` | `Pubkey` | 32 | 에이전트 자산 주소 |

## 계정 가져오기

### Executive 프로필

```typescript
import {
  fetchExecutiveProfileV1,
  safeFetchExecutiveProfileV1,
  fetchAllExecutiveProfileV1,
  fetchExecutiveProfileV1FromSeeds,
  getExecutiveProfileV1GpaBuilder,
} from '@metaplex-foundation/mpl-agent-registry';

// By PDA address (throws if not found)
const profile = await fetchExecutiveProfileV1(umi, profilePda);

// Safe fetch (returns null if not found)
const profile = await safeFetchExecutiveProfileV1(umi, profilePda);

// By seeds (derives PDA internally)
const profile = await fetchExecutiveProfileV1FromSeeds(umi, {
  authority: authorityPublicKey,
});

// Batch fetch
const profiles = await fetchAllExecutiveProfileV1(umi, [pda1, pda2]);

// GPA query
const results = await getExecutiveProfileV1GpaBuilder(umi)
  .whereField('authority', authorityPublicKey)
  .get();
```

### 실행 위임 기록

```typescript
import {
  fetchExecutionDelegateRecordV1,
  safeFetchExecutionDelegateRecordV1,
  fetchAllExecutionDelegateRecordV1,
  fetchExecutionDelegateRecordV1FromSeeds,
  getExecutionDelegateRecordV1GpaBuilder,
} from '@metaplex-foundation/mpl-agent-registry';

// By PDA address (throws if not found)
const record = await fetchExecutionDelegateRecordV1(umi, delegatePda);

// Safe fetch (returns null if not found)
const record = await safeFetchExecutionDelegateRecordV1(umi, delegatePda);

// By seeds (derives PDA internally)
const record = await fetchExecutionDelegateRecordV1FromSeeds(umi, {
  executiveProfile: profilePda,
  agentAsset: assetPublicKey,
});

// Batch fetch
const records = await fetchAllExecutionDelegateRecordV1(umi, [pda1, pda2]);

// GPA query — find all delegations for a specific agent
const results = await getExecutionDelegateRecordV1GpaBuilder(umi)
  .whereField('agentAsset', assetPublicKey)
  .get();
```

## 오류

| 코드 | 이름 | 설명 |
|------|------|-------------|
| 0 | `InvalidSystemProgram` | System 프로그램 계정이 올바르지 않습니다 |
| 1 | `InvalidInstructionData` | 명령 데이터가 잘못되었습니다 |
| 2 | `InvalidAccountData` | 계정 데이터가 유효하지 않습니다 |
| 3 | `InvalidMplCoreProgram` | MPL Core 프로그램 계정이 올바르지 않습니다 |
| 4 | `InvalidCoreAsset` | 자산이 유효한 MPL Core 자산이 아닙니다 |
| 5 | `ExecutiveProfileMustBeUninitialized` | Executive 프로필이 이미 존재합니다 |
| 6 | `InvalidExecutionDelegateRecordDerivation` | 위임 기록 PDA 파생 불일치 |
| 7 | `ExecutionDelegateRecordMustBeUninitialized` | 위임 기록이 이미 존재합니다 |
| 8 | `InvalidAgentIdentity` | 에이전트 신원 계정이 유효하지 않습니다 |
| 9 | `AgentIdentityNotRegistered` | 자산에 등록된 신원이 없습니다 |
| 10 | `AssetOwnerMustBeTheOneToDelegateExecution` | 자산 소유자만 실행을 위임할 수 있습니다 |
| 11 | `InvalidExecutiveProfileDerivation` | Executive 프로필 PDA 파생 불일치 |
| 12 | `ExecutionDelegateRecordMustBeInitialized` | 위임 기록이 존재하지 않거나 초기화되지 않았습니다 |
| 13 | `UnauthorizedRevoke` | 서명자가 자산 소유자 또는 executive 권한자가 아닙니다 |

## 참고사항

- 각 지갑은 하나의 executive 프로필만 가질 수 있습니다. 동일한 지갑에 대해 두 번째 프로필을 등록하려고 하면 `ExecutiveProfileMustBeUninitialized` 오류로 실패합니다.
- 위임 기록은 (executive, asset) 쌍별로 존재합니다. 동일한 executive가 여러 에이전트 자산에 위임될 수 있습니다.
- 철회 시 위임 기록의 렌트가 원래 payer가 아닌 `destination` 계정으로 환불됩니다.
- 자산 소유자 또는 executive 권한자 모두 위임을 철회할 수 있습니다 — 양쪽 모두 이 권한을 가집니다.
