---
title: 에이전트 신원
metaTitle: 에이전트 신원 프로그램 | MPL 에이전트 레지스트리 | Metaplex
description: MPL 에이전트 신원 프로그램 기술 참조 — 명령어 계정, PDA 파생, 계정 구조, 오류 코드.
keywords:
  - Agent Identity program
  - RegisterIdentityV1
  - AgentIdentityV1
  - PDA derivation
  - lifecycle hooks
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Smart Contracts
  - Solana
  - Metaplex
proficiencyLevel: Advanced
created: '02-25-2026'
updated: '03-12-2026'
---

에이전트 신원 프로그램은 MPL Core 자산의 온체인 신원 레코드를 PDA로 등록합니다. {% .lead %}

## Summary

에이전트 신원 프로그램(`1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p`)은 MPL Core 자산을 위한 PDA 기반 신원 레코드를 생성하고 Transfer, Update, Execute 생명주기 훅이 있는 `AgentIdentity` 플러그인을 연결합니다.

- **단일 명령어** — `RegisterIdentityV1`이 하나의 트랜잭션에서 PDA 생성, 계정 초기화, 플러그인 연결을 처리합니다
- **40바이트 계정** — `AgentIdentityV1` PDA는 판별자, 범프, 자산 공개 키만 저장합니다
- **생명주기 훅** — 플러그인은 Transfer, Update, Execute 이벤트의 approve, listen, reject 체크를 등록합니다
- **결정론적 PDA** — 온체인 조회를 위해 시드 `["agent_identity", <asset_pubkey>]`에서 파생됩니다

## 프로그램 ID

| 네트워크 | 주소 |
|---------|------|
| 메인넷 | `1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p` |
| 데브넷 | `1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p` |

## 명령어: RegisterIdentityV1

PDA를 생성하고 Transfer, Update, Execute 생명주기 훅이 있는 `AgentIdentity` 플러그인을 MPL Core 자산에 연결하여 에이전트 신원을 등록합니다.

### 계정

| 계정 | 쓰기 가능 | 서명자 | 선택 사항 | 설명 |
|------|---------|--------|--------|------|
| `agentIdentity` | 예 | 아니요 | 아니요 | 생성될 PDA (자산에서 자동 파생) |
| `asset` | 예 | 아니요 | 아니요 | 등록할 MPL Core 자산 |
| `collection` | 예 | 아니요 | 예 | 자산의 컬렉션 |
| `payer` | 예 | 예 | 아니요 | 계정 임대 및 수수료 지불 |
| `authority` | 아니요 | 예 | 예 | 컬렉션 권한자 (기본값은 `payer`) |
| `mplCoreProgram` | 아니요 | 아니요 | 아니요 | MPL Core 프로그램 |
| `systemProgram` | 아니요 | 아니요 | 아니요 | 시스템 프로그램 |

### 인수

| 인수 | 유형 | 설명 |
|-----|------|------|
| `agentRegistrationUri` | `string` | 오프체인 에이전트 등록 메타데이터를 가리키는 URI |

### 동작 내용

1. 시드 `["agent_identity", <asset>]`에서 PDA를 파생합니다
2. `AgentIdentityV1` 계정(40바이트)을 생성하고 초기화합니다
3. MPL Core에 CPI하여 제공된 URI와 함께 `AgentIdentity` 플러그인을 자산에 연결합니다
4. **Transfer**, **Update**, **Execute** 이벤트(approve, listen, reject)의 생명주기 체크를 등록합니다

### 생명주기 체크

`AgentIdentity` 플러그인은 세 가지 생명주기 이벤트에 훅을 등록합니다.

| 이벤트 | Approve | Listen | Reject |
|-------|---------|--------|--------|
| Transfer | 예 | 예 | 예 |
| Update | 예 | 예 | 예 |
| Execute | 예 | 예 | 예 |

즉, 신원 플러그인은 자산의 Transfer, Update, Execute 승인, 관찰 또는 거부에 참여할 수 있습니다.

## PDA 파생

**시드:** `["agent_identity", <asset_pubkey>]`

```typescript
import { findAgentIdentityV1Pda } from '@metaplex-foundation/mpl-agent-registry';

const pda = findAgentIdentityV1Pda(umi, { asset: assetPublicKey });
// [publicKey, bump]를 반환합니다
```

## 계정: AgentIdentityV1

40바이트, 8바이트 정렬, bytemuck을 통한 제로 카피.

| 오프셋 | 필드 | 유형 | 크기 | 설명 |
|-------|------|------|------|------|
| 0 | `key` | `u8` | 1 | 계정 판별자 (`1` = AgentIdentityV1) |
| 1 | `bump` | `u8` | 1 | PDA 범프 시드 |
| 2 | `_padding` | `[u8; 6]` | 6 | 정렬 패딩 |
| 8 | `asset` | `Pubkey` | 32 | 이 신원이 바인딩된 MPL Core 자산 |

## 계정 가져오기

```typescript
import {
  fetchAgentIdentityV1,
  safeFetchAgentIdentityV1,
  fetchAgentIdentityV1FromSeeds,
  fetchAllAgentIdentityV1,
  getAgentIdentityV1GpaBuilder,
} from '@metaplex-foundation/mpl-agent-registry';

// PDA 주소로 가져오기 (찾지 못하면 throw)
const identity = await fetchAgentIdentityV1(umi, pda);

// 안전한 가져오기 (찾지 못하면 null 반환)
const identity = await safeFetchAgentIdentityV1(umi, pda);

// 시드로 가져오기 (내부적으로 PDA 파생)
const identity = await fetchAgentIdentityV1FromSeeds(umi, { asset });

// 배치 가져오기
const identities = await fetchAllAgentIdentityV1(umi, [pda1, pda2]);

// GPA 쿼리
const results = await getAgentIdentityV1GpaBuilder(umi)
  .whereField('asset', assetPublicKey)
  .get();
```

## 오류

| 코드 | 이름 | 설명 |
|-----|------|------|
| 0 | `InvalidSystemProgram` | 시스템 프로그램 계정이 잘못되었습니다 |
| 1 | `InvalidInstructionData` | 명령어 데이터가 올바르지 않습니다 |
| 2 | `InvalidAccountData` | PDA 파생이 자산과 일치하지 않습니다 |
| 3 | `InvalidMplCoreProgram` | MPL Core 프로그램 계정이 잘못되었습니다 |
| 4 | `InvalidCoreAsset` | 자산이 유효한 MPL Core 자산이 아닙니다 |

*[Metaplex](https://github.com/metaplex-foundation) 관리 · 2026년 3월 최종 확인 · [GitHub에서 소스 보기](https://github.com/metaplex-foundation/mpl-agent)*
