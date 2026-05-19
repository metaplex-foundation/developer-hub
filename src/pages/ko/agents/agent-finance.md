---
title: 에이전트 파이낸스 - AI 에이전트의 자본화 및 거버넌스
metaTitle: 에이전트 파이낸스 - Solana에서 AI 에이전트 자본화 및 거버넌스 | Metaplex
description: 자체 온체인 토큰을 통해 AI 에이전트를 자본화하고 거버넌스합니다. Genesis 본딩 커브로 에이전트 토큰을 발행하고, setAgentTokenV1로 에이전트에 영구 바인딩하며, Asset Signer PDA로 수익을 라우팅 — 모두 Metaplex에서.
keywords:
  - agent finance
  - agent token
  - AI agent capitalization
  - AI agent governance
  - raise funds for agent
  - agent bonding curve
  - agent token launch
  - AI agent token
  - Solana agent token
  - agent fundraising
  - autonomous agent economy
  - setAgentTokenV1
  - AgentIdentityV2
about:
  - Agent Finance
  - Agent Tokens
  - Genesis bonding curve
  - Solana
proficiencyLevel: Beginner
created: '04-13-2026'
updated: '05-06-2026'
faqs:
  - q: 에이전트 파이낸스란 무엇인가요?
    a: 에이전트 파이낸스는 자체 온체인 토큰을 통해 자율 AI 에이전트를 자본화하고 거버넌스하는 관행입니다. Metaplex에서는 에이전트가 Genesis 본딩 커브를 통해 토큰을 발행하고 setAgentTokenV1을 통해 에이전트에 영구적으로 바인딩하므로, 수익과 크리에이터 수수료가 오프체인 합의가 아닌 온체인 프리미티브를 통해 라우팅됩니다.
  - q: 에이전트 파이낸스는 에이전트 커머스와 어떻게 다른가요?
    a: 에이전트 파이낸스는 에이전트가 토큰을 통해 어떻게 자금을 조달하고 거버넌스되는지 — 자본화, 트레저리, 홀더 정렬 — 를 다룹니다. 에이전트 커머스는 에이전트가 어떻게 수익을 얻고 경제 활동을 생성하는지를 다룹니다. 둘은 동일한 에이전트 신원, PDA 지갑, EIP-8004 메타데이터를 공유합니다.
  - q: 에이전트의 지갑은 어떻게 파생되나요?
    a: 에이전트의 운영 지갑은 Asset Signer입니다 — 시드 ["mpl-core-execute", asset]에서 파생된 MPL Core PDA입니다. 개인 키는 없습니다. 지갑은 SOL, SPL 토큰 및 기타 자산을 보유할 수 있으며 Core의 Execute 라이프사이클 훅을 통해서만 제어됩니다.
  - q: 에이전트 토큰은 어떻게 에이전트에 바인딩되나요?
    a: setAgentTokenV1 인스트럭션은 AgentIdentityV2 PDA의 agentToken 필드에 토큰 민트를 기록합니다. 바인딩은 영구적입니다 — 한 번 설정되면 에이전트는 해당 토큰 민트에 되돌릴 수 없게 연결됩니다. 동일한 필드가 에이전트의 EIP-8004 메타데이터에 노출되므로 거래 상대방은 에이전트의 등록에서 정식 토큰을 해석할 수 있습니다.
  - q: 프리세일이나 페어 런치 대신 본딩 커브를 사용하는 이유는 무엇인가요?
    a: 본딩 커브는 입금 기간 없이 즉시 거래를 시작하고, 콘스탄트 프로덕트 커브를 통한 지속적인 가격 발견을 제공하며, 완전히 채워지면 자동으로 Raydium CPMM 풀로 그래쥬에이션됩니다. 이를 통해 에이전트 토큰에 즉각적인 유동성과 오픈 마켓 거래로의 명확한 경로가 제공됩니다.
  - q: 조달된 자금은 어떻게 되나요?
    a: 크리에이터 수수료는 거래 중 본딩 커브 버킷에 쌓이며 크리에이터 지갑으로 청구할 수 있습니다. Raydium으로 그래쥬에이션된 후, 크리에이터는 CPMM 풀에서 그래쥬에이션 후 크리에이터 수수료를 계속 얻습니다. 에이전트가 크리에이터로 설정되면 수수료는 에이전트의 PDA 지갑으로 직접 라우팅됩니다.
---

Metaplex에서의 에이전트 파이낸스는 자율 AI 에이전트가 자체 온체인 토큰을 통해 자본화되고 거버넌스되는 방식입니다. 에이전트는 검증 가능한 신원을 등록하고, [Genesis 본딩 커브](/smart-contracts/genesis)를 통해 토큰을 발행하며, `setAgentTokenV1` 인스트럭션을 통해 그 토큰을 자신에게 영구적으로 바인딩합니다 — 에이전트에 트레저리를 제공하고, 홀더 커뮤니티를 그 미션에 정렬시키며, 누가 위험을 감수하는지에 대한 투명한 기록을 만듭니다. {% .lead %}

## 요약

에이전트 파이낸스는 AI 에이전트가 어떻게 자본화되고 거버넌스되는지를 다룹니다. Metaplex 스택은 모든 프리미티브를 엔드 투 엔드로 제공합니다: 에이전트 신원, Core 자산에서 파생된 Asset Signer PDA, 에이전트 지갑에서의 Genesis 본딩 커브, 그리고 `setAgentTokenV1`을 통한 영구적인 토큰-에이전트 바인딩.

- **에이전트 신원**: [`mpl-agent-identity`](/smart-contracts/mpl-agent/identity)를 통해 온체인으로 등록하여 Core 자산에 바인딩된 [`AgentIdentityV2`](/smart-contracts/mpl-agent/identity) PDA와 EIP-8004 메타데이터 문서를 생성
- **Asset Signer PDA**: 에이전트의 지갑은 [MPL Core](/smart-contracts/core)에 의해 시드 `["mpl-core-execute", asset]`에서 파생됩니다 — 개인 키 없음, Core의 Execute 라이프사이클 훅을 통해서만 제어
- **토큰 발행**: `agent` 매개변수와 함께 [`createAndRegisterLaunch`](/smart-contracts/genesis)를 호출하여 에이전트의 지갑에서 [Genesis 본딩 커브](/dev-tools/cli/genesis/bonding-curve)를 시작하고 크리에이터 수수료를 에이전트로 라우팅
- **영구 바인딩**: [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token)이 `AgentIdentityV2`의 `agentToken: Option<Pubkey>` 필드에 토큰 민트를 기록 — 되돌릴 수 없고, 공개되며, 에이전트의 EIP-8004 메타데이터의 일부
- **오픈 마켓으로 그래쥬에이션**: 커브가 채워지면 유동성이 [Raydium](https://raydium.io) CPMM 풀로 자동 마이그레이션되어 거래가 계속됨

{% callout type="note" title="에이전트 파이낸스 vs. 에이전트 커머스" %}
**에이전트 파이낸스**는 에이전트가 어떻게 *자본화되고 거버넌스되는지* — 에이전트의 토큰을 통한 자금 조달, 트레저리, 홀더 정렬 — 에 관한 것입니다. **[에이전트 커머스](/agents/agent-commerce)**는 에이전트가 어떻게 *경제 활동*을 생성하는지 — 서비스 비용 지불, 다른 에이전트와의 거래, 생산적인 작업으로 수익 획득 — 에 관한 것입니다. 이 페이지는 에이전트 파이낸스를 다룹니다.
{% /callout %}

## Metaplex 에이전트 파이낸스 프리미티브

에이전트 파이낸스 흐름의 모든 레이어는 Metaplex 프리미티브로 제공됩니다 — 온체인 신원, Asset Signer 지갑, 런치 프로그램, 되돌릴 수 없는 토큰-에이전트 바인딩:

| 프리미티브 | 위치 | 가능한 기능 |
|-----------|----------------|-----------------|
| **온체인 신원** | 시드 `["agent_identity", asset]`의 [`AgentIdentityV2`](/smart-contracts/mpl-agent/identity) PDA | 발행된 토큰과 특정 등록된 에이전트 간의 검증 가능한 바인딩 |
| **EIP-8004 메타데이터** | `agentMetadataUri`의 오프체인 JSON, `AgentIdentity` 플러그인에서 온체인으로 기록됨 | 토큰 홀더와 거래 상대방이 단일 문서에서 에이전트의 신원, 서비스, 바인딩된 토큰을 해석 |
| **Asset Signer (PDA 지갑)** | [MPL Core](/smart-contracts/core)에 의해 파생된 시드 `["mpl-core-execute", asset]` | SOL, 에이전트의 토큰, 크리에이터 수수료 수익, 모든 SPL 토큰을 보유; 개인 키 없음 |
| **토큰 바인딩** | `AgentIdentityV2`의 [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token) | 영구 온체인 링크 — `agentToken` 필드는 재할당될 수 없음 |
| **토큰 발행** | [Genesis](/smart-contracts/genesis)의 `createAndRegisterLaunch`에 `agent: { mint, setToken }` | 한 트랜잭션으로 본딩 커브 생성, 공급량 발행, (선택적으로) 토큰을 에이전트에 바인딩 |
| **이그제큐티브 위임** | [`mpl-agent-tools`](/smart-contracts/mpl-agent/tools)의 `ExecutionDelegateRecordV1` | 오프체인 운영자가 에이전트를 대신하여 크리에이터 수수료 청구 및 트레저리 운영에 서명; 자산별로 취소 가능 |
| **그래쥬에이션** | 본딩 커브가 채워지면 자동 Raydium CPMM 마이그레이션 | 수동 유동성 공급 없이 오픈 마켓 거래와 지속적인 크리에이터 수수료 누적 |

## 왜 에이전트 토큰을 발행하나요?

에이전트 토큰은 AI 에이전트를 투자 가능하고 자율적인 경제 행위자로 변환합니다. 거래, 콘텐츠 제작, 데이터 분석 또는 모든 온체인 서비스이든 홀더는 에이전트의 미션을 지원하며, 토큰 가치는 에이전트의 성과와 채택을 반영합니다.

**에이전트 빌더용:**
- 에이전트 자체의 소유권을 포기하지 않고 자금 조달
- 본딩 커브 거래와 그래쥬에이션 후 Raydium 거래 모두에서 크리에이터 수수료 획득
- 에이전트의 성공과 정렬된 토큰 홀더 커뮤니티 구축
- 에이전트가 자율적으로 제어하는 트레저리 (Asset Signer PDA) 제공

**토큰 홀더용:**
- 성과를 발휘할 것으로 믿는 특정 AI 에이전트 지원
- 즉각적인 유동성으로 본딩 커브를 통해 진입 및 퇴출
- 에이전트의 [EIP-8004 등록](/agents/agent-commerce)에서 정식 토큰 민트 해석 — 오프체인 신뢰 불필요

## Metaplex의 에이전트 토큰 라이프사이클

Metaplex 스택은 에이전트 생성에서 토큰 거래까지의 전체 라이프사이클을 처리합니다:

1. **에이전트 생성**: [`mintAndSubmitAgent`](/agents/mint-agent) 단일 호출로 MPL Core 자산을 생성하고 `AgentIdentityV2`를 한 트랜잭션으로 등록하여, EIP-8004 메타데이터 URI를 Core 플러그인으로 첨부
2. **실행 설정**: `mpl-agent-tools`를 통해 [이그제큐티브 프로필 등록](/agents/run-an-agent) 및 `ExecutionDelegateRecordV1` 생성으로 에이전트가 자율적으로 서명할 수 있도록 함
3. **토큰 발행**: Genesis에서 `agent` 매개변수와 함께 [`createAndRegisterLaunch`](/smart-contracts/genesis)를 호출 — `agent: { mint: agentAssetAddress, setToken: true }`는 에이전트의 PDA 지갑에서 본딩 커브를 생성하고 동일 트랜잭션 내에서 `setAgentTokenV1` 인스트럭션을 발행
4. **그래쥬에이션**: 본딩 커브가 100% 채워지면, 유동성이 Raydium CPMM 풀로 마이그레이션되고 토큰이 오픈 마켓에서 거래되며 크리에이터 수수료가 계속 누적됨

{% callout type="note" title="에이전트당 하나의 토큰" %}
`AgentIdentityV2`의 `agentToken` 필드는 한 번만 설정할 수 있습니다 — [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token)은 되돌릴 수 없습니다. 동일한 필드가 에이전트의 EIP-8004 메타데이터에도 읽혀지므로 거래 상대방은 항상 정식 토큰 민트를 볼 수 있습니다.
{% /callout %}

## 에이전트 자금 조달 방법 비교

모든 토큰 발행 방법이 AI 에이전트에 동일하지는 않습니다. 아래 표는 Metaplex 에이전트 토큰을 일반적인 대안과 비교합니다.

| 기능 | Metaplex 에이전트 토큰 | 일반 런치패드 | 수동 토큰 + DEX 상장 | 오프체인 자금 조달 |
|---------|---------------------|-------------------|---------------------------|----------------------|
| **온체인 에이전트 신원** | `AgentIdentityV2` PDA + EIP-8004 메타데이터 | 없음 | 없음 | 없음 |
| **에이전트 소유 지갑** | Asset Signer PDA, 개인 키 없음 | 사람이 제어하는 지갑 | 사람이 제어하는 지갑 | 지갑 없음 |
| **토큰-에이전트 바인딩** | `setAgentTokenV1`, 되돌릴 수 없음 | 없음 | 없음 | 없음 |
| **즉시 거래** | 본딩 커브가 즉시 시작 | 플랫폼에 따라 다름 | 수동 LP 설정 필요 | N/A |
| **가격 발견** | 콘스탄트 프로덕트 커브 | 다양함 | 수동 가격 책정 | N/A |
| **유동성 그래쥬에이션** | Raydium CPMM으로 자동 마이그레이션 | 플랫폼 종속 | 수동 LP 관리 | N/A |
| **크리에이터 수수료** | 내장, 구성 가능, 에이전트 PDA로 라우팅 | 고정, 플랫폼이 결정 | 내장 메커니즘 없음 | 플랫폼이 결정 |
| **자율 운영** | `mpl-agent-tools`를 통한 `ExecutionDelegateRecordV1` | 지원되지 않음 | 지원되지 않음 | 지원되지 않음 |

### Metaplex의 차별점

**검증 가능한 에이전트 신원.** [`mpl-agent-identity`](/smart-contracts/mpl-agent/identity)는 `AgentIdentityV2` PDA를 특정 MPL Core 자산에 바인딩하고 자산에 `AgentIdentity` 외부 플러그인을 첨부합니다. 누구나 토큰이 특정 등록된 에이전트에 의해 발행되었다는 것을 온체인에서 검증할 수 있으며, 에이전트의 `agentToken` 필드에서 정식 토큰 민트를 해석할 수 있습니다.

**개인 키 노출 없음.** Asset Signer PDA는 `["mpl-core-execute", asset]`에서 파생됩니다. 유출되거나 분실되거나 도난당할 개인 키가 없습니다. 지갑은 Core의 [Execute 라이프사이클 훅](/smart-contracts/core/execute-asset-signing)을 통해서만 제어되며, 자산 소유자는 언제든지 이그제큐티브 위임을 취소할 수 있습니다.

**영구적인 토큰-에이전트 바인딩.** `setAgentTokenV1`은 `AgentIdentityV2`의 일회성 필드에 기록합니다 — 한 번 설정되면 바인딩을 변경할 수 없습니다. 이는 정식 토큰이 조용히 교체되는 러그 풀 시나리오를 제거하고, EIP-8004 컨슈머가 단일 신뢰 출처에서 바인딩된 토큰을 해석할 수 있게 합니다.

**그래쥬에이션을 통한 즉각적인 유동성.** Genesis 본딩 커브는 발행 순간부터 즉시 거래를 제공합니다 — 입금 기간 없음, 대기 시간 없음. 커브가 100% 채워지면 수동 유동성 공급 없이 자동으로 Raydium CPMM 풀로 그래쥬에이션됩니다.

**풀스택 통합.** Metaplex는 모든 레이어를 제공합니다: 신원 ([`mpl-agent-identity`](/smart-contracts/mpl-agent)), 자산 관리 ([Core](/smart-contracts/core)), 토큰 발행 ([Genesis](/smart-contracts/genesis)), 실행 위임 ([`mpl-agent-tools`](/smart-contracts/mpl-agent/tools)), 개발자 도구 ([CLI](/dev-tools/cli/agents), [Skill](/agents/skill)). 타사 서비스를 결합할 필요가 없습니다.

## 에이전트 토큰 발행

Metaplex의 에이전트 토큰 발행은 노코드, CLI, SDK 워크플로우를 통해 가능합니다.

### metaplex.com에서 에이전트 토큰 발행

[metaplex.com](https://www.metaplex.com)은 본딩 커브로 에이전트 토큰을 발행하기 위한 노코드 인터페이스를 제공합니다. 지갑을 연결하고, 에이전트를 등록하고, 토큰을 구성하고, 발행합니다 — 코딩이 필요하지 않습니다.

### CLI로 에이전트 토큰 발행

[Metaplex CLI](/dev-tools/cli)는 단일 명령으로 에이전트 토큰을 발행합니다. `--agentAsset` 플래그는 런치를 Core Execute 인스트럭션으로 래핑하여 에이전트의 PDA가 크리에이터가 되도록 합니다. `--agentSetToken`은 동일한 트랜잭션 내에서 `setAgentTokenV1`을 발행합니다.

```bash {% title="본딩 커브를 통해 에이전트 토큰 발행" %}
mplx genesis launch create --launchType bonding-curve \
  --name "My Agent Token" \
  --symbol "MAT" \
  --image "https://gateway.irys.xyz/your-image-hash" \
  --agentAsset <AGENT_CORE_ASSET_ADDRESS> \
  --agentSetToken
```

이는 본딩 커브를 생성하고, 에이전트의 PDA에서 토큰 공급량을 발행하며, `setAgentTokenV1`을 통해 에이전트에 영구적으로 연결합니다 — 모두 한 트랜잭션으로.

스왑 명령, 상태 확인 및 라이프사이클 관리에 대한 자세한 내용은 [본딩 커브 CLI 가이드](/dev-tools/cli/genesis/bonding-curve)를 참조하세요.

### SDK로 에이전트 토큰 발행

프로그래밍 방식의 발행은 [Genesis JavaScript SDK](/smart-contracts/genesis/sdk/javascript)를 사용하여 `createAndRegisterLaunch`에 `agent` 매개변수를 전달합니다:

```ts
await createAndRegisterLaunch(umi, {
  // ...launch params
  agent: {
    mint: agentAssetAddress,
    setToken: true,
  },
}).sendAndConfirm(umi);
```

`setToken: true`를 설정하면 런치와 바인딩이 원자적이 되도록 동일한 트랜잭션 내에서 `setAgentTokenV1` 인스트럭션이 트리거됩니다.

## 에이전트 토큰 이코노믹스

에이전트 토큰 이코노믹스는 본딩 커브 거래 중 크리에이터 수수료 누적과 그래쥬에이션 후 자동 유동성 마이그레이션을 결합합니다.

### 크리에이터 수수료

모든 본딩 커브 발행은 구성 가능한 크리에이터 수수료를 지원합니다. 각 스왑의 일정 비율은 본딩 커브 단계 동안 크리에이터 지갑으로 전달됩니다. 에이전트가 크리에이터로 설정되면 수수료가 Asset Signer PDA로 흘러갑니다:

- 수수료는 본딩 커브 버킷에 누적되며 크리에이터가 청구할 수 있습니다
- 수수료 비율은 발행 시 설정되며 온체인에서 볼 수 있습니다
- 그래쥬에이션 후 Raydium 거래로부터 크리에이터 수수료가 계속 누적됩니다
- 크리에이터 지갑은 모든 주소가 될 수 있으므로, 에이전트는 수수료를 자체 PDA, 멀티시그 또는 별도의 트레저리로 라우팅할 수 있습니다

### 그래쥬에이션

본딩 커브의 모든 토큰이 구매되면 커브는 자동으로 그래쥬에이션됩니다:

1. 유동성이 Raydium CPMM 풀로 마이그레이션됩니다
2. 오픈 마켓에서 거래가 계속됩니다
3. 토큰은 모든 Solana DEX 어그리게이터에서 완전히 거래 가능합니다
4. 크리에이터 지갑은 그래쥬에이션 후 거래로부터 크리에이터 수수료를 계속 얻습니다

### 에이전트 트레저리

Asset Signer PDA는 SOL, 에이전트 자체의 토큰, 스테이블코인, NFT 및 기타 SPL 토큰을 보유할 수 있습니다. `ExecutionDelegateRecordV1`을 통해 에이전트의 이그제큐티브는 자율적으로 트레저리 자금을 배포할 수 있습니다: 컴퓨팅 비용 지불, 리소스 획득 또는 다른 프로토콜과의 상호작용 — 모두 Core의 Execute 훅을 통해, 자산별로 취소 가능한 권한으로 서명됩니다.

## Metaplex 에이전트 스택으로 빌드하기

Metaplex 에이전트 스택은 자율 에이전트 토큰 운영을 위한 신원, 실행, 발행 및 도구 구성 요소를 결합합니다.

| 도구 | 목적 | 링크 |
|------|---------|------|
| **`mpl-agent-identity`** | `AgentIdentityV2` PDA, EIP-8004 메타데이터, `setAgentTokenV1` | [문서](/smart-contracts/mpl-agent/identity) |
| **`mpl-agent-tools`** | 이그제큐티브 프로필 및 실행 위임 레코드 | [문서](/smart-contracts/mpl-agent/tools) |
| **MPL Core** | Asset Signer PDA 및 Execute 라이프사이클 훅 | [문서](/smart-contracts/core) |
| **Genesis** | `agent` 매개변수가 있는 본딩 커브 및 런치풀 | [문서](/smart-contracts/genesis) |
| **CLI** | 명령줄 에이전트 및 토큰 관리 | [Agents CLI](/dev-tools/cli/agents) · [Genesis CLI](/dev-tools/cli/genesis) |
| **Skill** | AI 코딩 에이전트 지식 베이스 | [문서](/agents/skill) |
| **Metaplex Launchpad** | 노코드 토큰 발행 인터페이스 | [metaplex.com](https://www.metaplex.com) |

## 참고 사항

이 참고 사항은 Metaplex의 에이전트 토큰 발행에 대한 중요한 제약 조건과 라이프사이클 세부 정보를 다룹니다.

- 엔드 투 엔드 에이전트-토큰 바인딩 흐름은 [Genesis](/smart-contracts/genesis) 본딩 커브를 중심으로 구축됩니다. Genesis 런치풀도 지원되지만, 원자적 런치 + `setAgentTokenV1` 흐름은 본딩 커브에서 가장 일반적으로 사용됩니다
- `AgentIdentityV2`의 `agentToken` 필드는 `Option<Pubkey>`입니다. `setAgentTokenV1`이 호출될 때까지 `None`이며, 그 후 `Some(mint)`로 영구적으로 됩니다 — 지우거나 재할당하는 인스트럭션이 없습니다
- 본딩 커브는 콘스탄트 프로덕트 공식을 사용합니다. 토큰을 구매하면 가격이 상승하고 판매하면 하락합니다
- 그래쥬에이션 후, Metaplex는 토큰에 대한 제어 권한이 없습니다 — 토큰은 Raydium 및 DEX 어그리게이터에서 자유롭게 거래됩니다
- 크리에이터 수수료는 발행 시 설정되며 본딩 커브가 생성된 후에는 변경할 수 없습니다. 수령자는 모든 지갑 (에이전트의 PDA 포함) 이 될 수 있습니다
- Asset Signer에는 개인 키가 없습니다 — `ExecutionDelegateRecordV1`을 통해 부여된 이그제큐티브 권한으로 Core의 Execute 라이프사이클 훅을 통해서만 제어할 수 있으며 자산 소유자가 취소할 수 있습니다

## FAQ

Metaplex의 에이전트 파이낸스에 대한 일반적인 구현 및 설계 질문.

### 에이전트 파이낸스란 무엇인가요?
에이전트 파이낸스는 자체 온체인 토큰을 통해 자율 AI 에이전트를 자본화하고 거버넌스하는 관행입니다. Metaplex에서는 에이전트가 Genesis 본딩 커브를 통해 토큰을 발행하고 `setAgentTokenV1`을 통해 바인딩하므로, 수익과 크리에이터 수수료가 온체인 프리미티브를 통해 라우팅됩니다.

### 에이전트 파이낸스는 에이전트 커머스와 어떻게 다른가요?
에이전트 파이낸스는 에이전트가 토큰을 통해 어떻게 **자금을 조달하고 거버넌스되는지** — 자본화, 트레저리, 홀더 정렬 — 를 다룹니다. [에이전트 커머스](/agents/agent-commerce)는 에이전트가 어떻게 **수익을 얻고 경제 활동을 생성하는지** — 서비스에 비용 지불, 다른 에이전트와의 거래, 온체인 시장 참여 — 를 다룹니다. 둘은 동일한 에이전트 신원, PDA 지갑, EIP-8004 메타데이터를 공유합니다. 파이낸스는 에이전트가 운영할 자원을 제공하고, 커머스는 에이전트가 그것으로 무엇을 하는지입니다.

### 에이전트의 지갑은 어떻게 파생되나요?
에이전트의 운영 지갑은 Asset Signer입니다 — 시드 `["mpl-core-execute", asset]`에서 파생된 MPL Core PDA입니다. 개인 키는 없습니다. 지갑은 Core의 [Execute 라이프사이클 훅](/smart-contracts/core/execute-asset-signing)을 통해서만 제어되며, 이그제큐티브 권한은 [`mpl-agent-tools`](/smart-contracts/mpl-agent/tools)를 통해 위임됩니다.

### 에이전트 토큰은 어떻게 에이전트에 바인딩되나요?
[`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token) 인스트럭션은 [`AgentIdentityV2`](/smart-contracts/mpl-agent/identity) PDA의 `agentToken` 필드에 토큰 민트를 기록합니다. 바인딩은 영구적이며 에이전트의 EIP-8004 메타데이터에 노출되므로 거래 상대방은 단일 신뢰 출처에서 정식 토큰을 해석할 수 있습니다.

### 프리세일이나 페어 런치 대신 본딩 커브를 사용하는 이유는 무엇인가요?
본딩 커브는 입금 기간 없이 즉시 거래를 시작하고, 콘스탄트 프로덕트 커브를 통한 지속적인 가격 발견을 제공하며, 완전히 채워지면 자동으로 Raydium CPMM 풀로 그래쥬에이션됩니다. 이를 통해 에이전트 토큰에 즉각적인 유동성과 오픈 마켓 거래로의 명확한 경로가 제공됩니다.

### 조달된 자금은 어떻게 되나요?
크리에이터 수수료는 거래 중 본딩 커브 버킷에 쌓이며 크리에이터 지갑으로 청구할 수 있습니다. Raydium으로 그래쥬에이션된 후, 크리에이터는 CPMM 풀에서 그래쥬에이션 후 크리에이터 수수료를 계속 얻습니다. 에이전트가 크리에이터로 설정되면 수수료는 Asset Signer PDA로 직접 라우팅됩니다.

### 모든 AI 에이전트가 Metaplex에서 토큰을 발행할 수 있나요?
예. [`mpl-agent-identity`](/smart-contracts/mpl-agent/identity)를 통해 등록된 모든 에이전트는 토큰을 발행할 수 있습니다. 에이전트에는 `AgentIdentityV2`가 등록된 MPL Core 자산과 자율 운영을 위한 `ExecutionDelegateRecordV1`이 필요합니다.

### 이는 pump.fun이나 다른 런치패드에서의 발행과 어떻게 다른가요?
Metaplex 에이전트 토큰은 `AgentIdentityV2`를 통해 검증 가능한 온체인 신원에 바인딩됩니다. 에이전트의 지갑은 개인 키가 없는 PDA이며, `setAgentTokenV1` 바인딩은 영구적이고 감사 가능합니다. 일반 런치패드는 에이전트 신원, 에이전트 소유 지갑 또는 실행 위임 개념이 없습니다.

## 용어집

Metaplex 에이전트 파이낸스 워크플로우에서 사용되는 핵심 용어.

| 용어 | 정의 |
|------|------------|
| **Agent Finance(에이전트 파이낸스)** | 자체 온체인 토큰을 통해 자율 AI 에이전트를 자본화하고 거버넌스하는 관행 — 자금 조달, 트레저리, 홀더 정렬 |
| **Agent Commerce(에이전트 커머스)** | 에이전트가 생성하는 경제 활동 — 서비스 비용 지불, 다른 에이전트와의 거래, 생산적인 작업으로 수익 획득 ([에이전트 커머스](/agents/agent-commerce) 페이지에서 다룸) |
| **Agent Token(에이전트 토큰)** | Genesis 본딩 커브를 통해 에이전트의 PDA 지갑에서 발행되어 `setAgentTokenV1`을 통해 에이전트에 영구적으로 연결된 토큰 |
| **`AgentIdentityV2`** | MPL Core 자산에 바인딩된 Metaplex Agent Registry PDA; `setAgentTokenV1`에 의해 설정되는 `agentToken: Option<Pubkey>` 필드를 가짐 |
| **Asset Signer (PDA 지갑)** | `["mpl-core-execute", asset]`에서 파생된 MPL Core PDA — 에이전트의 온체인 지갑, Core의 Execute 훅을 통해서만 제어 |
| **`setAgentTokenV1`** | `AgentIdentityV2`의 `agentToken` 필드에 토큰 민트를 기록하는 `mpl-agent-identity` 인스트럭션. 일회성이며 되돌릴 수 없음 |
| **`createAndRegisterLaunch`** | 본딩 커브를 생성하고 (`agent.setToken: true`인 경우) 원자적으로 `setAgentTokenV1`을 발행하는 Genesis SDK 호출 |
| **EIP-8004 메타데이터** | 에이전트를 설명하는 오프체인 JSON 문서 (services, x402 지원, registrations, supportedTrust); 바인딩된 `agentToken`은 `AgentIdentityV2` PDA를 통해 이 문서의 일부 |
| **Bonding Curve(본딩 커브)** | 공급량에 따라 토큰 가격을 책정하는 콘스탄트 프로덕트 AMM; 완전히 채워지면 Raydium으로 자동 그래쥬에이션 |
| **Graduation(그래쥬에이션)** | 커브의 모든 토큰이 판매되면 유동성이 Raydium CPMM 풀로 자동 마이그레이션됨 |
| **Executive Profile(이그제큐티브 프로필)** | `mpl-agent-tools`를 통해 등록된, 에이전트를 대신하여 트랜잭션에 서명할 권한을 가진 오프체인 운영자의 온체인 신원 |
| **`ExecutionDelegateRecordV1`** | 이그제큐티브에 에이전트를 대신하여 행동할 권한을 부여하는 `mpl-agent-tools`의 자산별 PDA; 자산 소유자에 의해 취소 가능 |
| **Creator Fee(크리에이터 수수료)** | 크리에이터 지갑 (종종 에이전트의 PDA) 으로 전달되는 각 본딩 커브 스왑의 구성 가능한 백분율 |
