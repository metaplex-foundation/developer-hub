---
title: Agent Identity
metaTitle: Agent Identity 프로그램 | MPL Agent Registry | Metaplex
description: MPL Agent Identity 프로그램 기술 참조 — RegisterIdentityV1, SetAgentTokenV1, AgentIdentityV2 계정 구조, PDA 파생 및 오류 코드.
keywords:
  - Agent Identity program
  - RegisterIdentityV1
  - SetAgentTokenV1
  - AgentIdentityV2
  - AgentIdentityV1
  - PDA derivation
  - lifecycle hooks
  - Genesis token
programmingLanguage:
  - JavaScript
  - TypeScript
about:
  - Smart Contracts
  - Solana
  - Metaplex
proficiencyLevel: Advanced
created: '02-25-2026'
updated: '03-30-2026'
---

Agent Identity 프로그램은 MPL Core 자산에 대한 온체인 신원 기록을 등록하고 선택적으로 [Genesis](/smart-contracts/genesis) 토큰을 연결합니다. {% .lead %}

## 요약

Agent Identity 프로그램(`1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p`)은 [MPL Core](/smart-contracts/core) 자산에 대한 PDA 기반 신원 기록을 생성하고 Transfer, Update, Execute에 대한 라이프사이클 훅이 있는 `AgentIdentity` 플러그인을 첨부합니다.

- **두 가지 명령** — `RegisterIdentityV1`은 신원 기록을 생성하고, `SetAgentTokenV1`은 기존 신원에 [Genesis](/smart-contracts/genesis) 토큰을 연결합니다
- **104바이트 계정** — `AgentIdentityV2` PDA는 discriminator, bump, 자산 공개 키, 선택적 에이전트 토큰 주소 및 예약된 공간을 저장합니다
- **라이프사이클 훅** — 플러그인은 Transfer, Update, Execute 이벤트에 approve, listen, reject 검사를 등록합니다
- **결정론적 PDA** — 온체인 조회를 위해 시드 `["agent_identity", <asset_pubkey>]`에서 파생됩니다

## Program ID

| 네트워크 | 주소 |
|---------|---------|
| Mainnet | `1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p` |
| Devnet | `1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p` |

## 명령: RegisterIdentityV1

MPL Core 자산에 PDA를 생성하고 Transfer, Update, Execute에 대한 라이프사이클 훅이 있는 `AgentIdentity` 플러그인을 첨부하여 에이전트 신원을 등록합니다.

### 계정

| 계정 | Writable | Signer | Optional | 설명 |
|---------|----------|--------|----------|-------------|
| `agentIdentity` | Yes | No | No | 생성할 PDA (자산에서 자동 파생) |
| `asset` | Yes | No | No | 등록할 MPL Core 자산 |
| `collection` | Yes | No | Yes | 자산의 컬렉션 |
| `payer` | Yes | Yes | No | 계정 렌트 및 수수료 지불 |
| `authority` | No | Yes | Yes | 컬렉션 권한 (기본값: `payer`) |
| `mplCoreProgram` | No | No | No | MPL Core 프로그램 |
| `systemProgram` | No | No | No | System 프로그램 |

### 인수

| 인수 | 타입 | 설명 |
|----------|------|-------------|
| `agentRegistrationUri` | `string` | 오프체인 에이전트 등록 메타데이터를 가리키는 URI |

### RegisterIdentityV1의 동작

1. 시드 `["agent_identity", <asset>]`에서 PDA를 파생합니다
2. `AgentIdentityV2` 계정(104바이트)을 생성하고 초기화합니다
3. MPL Core에 CPI를 수행하여 제공된 URI가 포함된 `AgentIdentity` 플러그인을 자산에 첨부합니다
4. **Transfer**, **Update**, **Execute** 이벤트에 대한 라이프사이클 검사를 등록합니다 (approve, listen, reject)

### 라이프사이클 검사

`AgentIdentity` 플러그인은 세 가지 라이프사이클 이벤트에 훅을 등록합니다:

| 이벤트 | Approve | Listen | Reject |
|-------|---------|--------|--------|
| Transfer | Yes | Yes | Yes |
| Update | Yes | Yes | Yes |
| Execute | Yes | Yes | Yes |

이는 신원 플러그인이 자산에 대한 전송, 업데이트 및 실행의 승인, 관찰 또는 거부에 참여할 수 있음을 의미합니다.

## 명령: SetAgentTokenV1

기존 에이전트 신원에 [Genesis](/smart-contracts/genesis) 토큰을 연결합니다. Genesis 계정은 `Mint` 펀딩 모드를 사용해야 합니다. 신원이 아직 `AgentIdentityV1`(40바이트)인 경우 프로그램이 자동으로 `AgentIdentityV2`(104바이트)로 업그레이드합니다.

### 계정

| 계정 | Writable | Signer | Optional | 설명 |
|---------|----------|--------|----------|-------------|
| `agentIdentity` | Yes | No | No | 에이전트 신원 PDA (V1 또는 V2) — 자산에서 자동 파생 |
| `asset` | No | No | No | MPL Core 자산 |
| `genesisAccount` | No | No | No | 에이전트의 토큰 론칭을 위한 Genesis 계정 |
| `payer` | Yes | Yes | No | 추가 렌트 지불 (V1에서 V2로 업그레이드 시) |
| `authority` | No | Yes | Yes | [Asset Signer](/smart-contracts/core/execute-asset-signing) PDA여야 합니다 (기본값: `payer`) |
| `systemProgram` | No | No | No | System 프로그램 |

### SetAgentTokenV1의 동작

1. 에이전트 신원 PDA가 존재하고 V1 또는 V2인지 확인합니다
2. Genesis 계정이 Genesis 프로그램(`GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`)이 소유하고 `Mint` 펀딩 모드를 사용하는지 확인합니다
3. 신원이 V1인 경우 계정을 104바이트로 크기를 조정하고 discriminator를 V2로 업그레이드합니다
4. Genesis 계정 데이터에서 `base_mint` 공개 키를 읽습니다
5. `base_mint`를 신원의 `agent_token` 필드로 저장합니다

{% callout type="warning" %}
에이전트 토큰은 한 번만 설정할 수 있습니다. 이미 `agent_token`이 설정된 신원에 `SetAgentTokenV1`을 호출하면 `AgentTokenAlreadySet` 오류로 실패합니다.
{% /callout %}

{% callout type="note" %}
`authority`는 자산의 [Asset Signer](/smart-contracts/core/execute-asset-signing) PDA여야 합니다. 이것은 Core 자산의 내장 지갑으로, 개인 키 없이 자산의 공개 키에서 파생된 PDA입니다.
{% /callout %}

```typescript
import { setAgentTokenV1 } from '@metaplex-foundation/mpl-agent-registry';

await setAgentTokenV1(umi, {
  asset: assetPublicKey,
  genesisAccount: genesisAccountPublicKey,
}).sendAndConfirm(umi);
```

## PDA 파생

**시드:** `["agent_identity", <asset_pubkey>]`

V1과 V2 계정 모두 동일한 PDA 파생을 사용합니다. SDK는 두 버전 모두에 대한 finder를 제공합니다:

```typescript
import {
  findAgentIdentityV2Pda,
} from '@metaplex-foundation/mpl-agent-registry';

const pda = findAgentIdentityV2Pda(umi, { asset: assetPublicKey });
// Returns [publicKey, bump]
```

## 계정: AgentIdentityV2

104바이트, 8바이트 정렬, bytemuck를 통한 zero-copy. 이것은 `RegisterIdentityV1`에 의해 생성되고 `SetAgentTokenV1`에서 사용되는 현재 계정 버전입니다.

| Offset | 필드 | 타입 | 크기 | 설명 |
|--------|-------|------|------|-------------|
| 0 | `key` | `u8` | 1 | 계정 discriminator (`AgentIdentityV2`) |
| 1 | `bump` | `u8` | 1 | PDA bump 시드 |
| 2 | `_padding` | `[u8; 6]` | 6 | 정렬 패딩 |
| 8 | `asset` | `Pubkey` | 32 | 이 신원이 바인딩된 MPL Core 자산 |
| 40 | `agentToken` | `OptionalPubkey` | 33 | Genesis 토큰 민트 주소 (설정된 경우) |
| 73 | `_reserved` | `[u8; 31]` | 31 | 향후 사용을 위해 예약됨 |

## 계정: AgentIdentityV1 (레거시)

40바이트, 8바이트 정렬. 이것은 레거시 계정 형식입니다. 기존 V1 계정은 `SetAgentTokenV1`이 호출될 때 자동으로 V2로 업그레이드됩니다.

| Offset | 필드 | 타입 | 크기 | 설명 |
|--------|-------|------|------|-------------|
| 0 | `key` | `u8` | 1 | 계정 discriminator (`AgentIdentityV1`) |
| 1 | `bump` | `u8` | 1 | PDA bump 시드 |
| 2 | `_padding` | `[u8; 6]` | 6 | 정렬 패딩 |
| 8 | `asset` | `Pubkey` | 32 | 이 신원이 바인딩된 MPL Core 자산 |

## 계정 가져오기

```typescript
import {
  fetchAgentIdentityV2,
  safeFetchAgentIdentityV2,
  fetchAllAgentIdentityV2,
  getAgentIdentityV2GpaBuilder,
} from '@metaplex-foundation/mpl-agent-registry';

// By PDA address (throws if not found)
const identity = await fetchAgentIdentityV2(umi, pda);

// Safe fetch (returns null if not found)
const identity = await safeFetchAgentIdentityV2(umi, pda);

// Batch fetch
const identities = await fetchAllAgentIdentityV2(umi, [pda1, pda2]);

// GPA query
const results = await getAgentIdentityV2GpaBuilder(umi)
  .whereField('asset', assetPublicKey)
  .get();
```

### 레거시 V1 Fetcher

V1 fetch 함수는 V2로 업그레이드되지 않은 계정에 대해 여전히 작동합니다. 새로운 통합은 위의 V2 fetcher를 사용해야 합니다.

```typescript
import {
  fetchAgentIdentityV1,
  safeFetchAgentIdentityV1,
  findAgentIdentityV1Pda,
  fetchAgentIdentityV1FromSeeds,
  getAgentIdentityV1GpaBuilder,
} from '@metaplex-foundation/mpl-agent-registry';

const v1Pda = findAgentIdentityV1Pda(umi, { asset: assetPublicKey });

// Safe fetch (returns null if not found)
const identity = await safeFetchAgentIdentityV1(umi, v1Pda);

// By seeds
const identity = await fetchAgentIdentityV1FromSeeds(umi, { asset: assetPublicKey });

// GPA query
const results = await getAgentIdentityV1GpaBuilder(umi)
  .whereField('asset', assetPublicKey)
  .get();
```

## 오류

| 코드 | 이름 | 설명 |
|------|------|-------------|
| 0 | `InvalidSystemProgram` | System 프로그램 계정이 올바르지 않습니다 |
| 1 | `InvalidInstructionData` | 명령 데이터가 잘못되었습니다 |
| 2 | `InvalidAccountData` | PDA 파생이 자산과 일치하지 않습니다 |
| 3 | `InvalidMplCoreProgram` | MPL Core 프로그램 계정이 올바르지 않습니다 |
| 4 | `InvalidCoreAsset` | 자산이 유효한 MPL Core 자산이 아닙니다 |
| 5 | `InvalidAgentToken` | 에이전트 토큰 계정이 유효하지 않습니다 |
| 6 | `OnlyAssetSignerCanSetAgentToken` | `SetAgentTokenV1`을 호출하려면 authority가 Asset Signer PDA여야 합니다 |
| 7 | `AgentTokenAlreadySet` | 이 신원에 에이전트 토큰이 이미 설정되어 있습니다 |
| 8 | `InvalidAgentIdentity` | 에이전트 신원 계정이 유효하지 않거나 이 프로그램이 소유하지 않습니다 |
| 9 | `AgentIdentityAlreadyRegistered` | 이 자산에 이미 등록된 신원이 있습니다 |
| 10 | `InvalidGenesisAccount` | Genesis 계정이 유효하지 않습니다 (잘못된 소유자, 잘못된 discriminator 또는 너무 작음) |
| 11 | `GenesisNotMintFunded` | Genesis 계정이 `Mint` 펀딩 모드를 사용하지 않습니다 |

## 참고사항

- `RegisterIdentityV1`은 이제 `AgentIdentityV2` 계정(104바이트)을 생성합니다. 레거시 V1 계정(40바이트)은 `SetAgentTokenV1`에 의해 자동으로 V2로 업그레이드됩니다.
- V2의 `agentToken` 필드는 `OptionalPubkey`입니다. `SetAgentTokenV1`이 호출될 때까지 비어 있습니다(`None`).
- `_reserved` 필드(31바이트)는 0으로 초기화되며 향후 확장을 위해 예약되어 있습니다.
- V1과 V2 계정 모두 동일한 PDA 파생 시드를 공유합니다: `["agent_identity", <asset_pubkey>]`.
