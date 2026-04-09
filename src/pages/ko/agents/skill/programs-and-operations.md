---
title: 프로그램 및 오퍼레이션
metaTitle: 프로그램 및 오퍼레이션 | Metaplex 스킬
description: Metaplex Skill이 다루는 프로그램과 오퍼레이션의 상세 분석.
created: '02-23-2026'
updated: '04-08-2026'
keywords:
  - Agent Registry
  - Core
  - Token Metadata
  - Bubblegum
  - Candy Machine
  - Genesis
  - bonding curve
  - mplx CLI
  - Umi SDK
  - Kit SDK
about:
  - Metaplex programs
  - CLI operations
  - SDK operations
proficiencyLevel: Beginner
---

Metaplex Skill은 CLI, Umi SDK, Kit SDK에 걸쳐 6개 프로그램을 다룹니다. 이 페이지에서는 각 프로그램이 지원하는 기능과 사용 시기에 대한 상세 분석을 제공합니다. {% .lead %}

## 요약

Metaplex Skill은 CLI, Umi SDK, Kit SDK에 걸쳐 6개 Metaplex 프로그램과 사용 가능한 도구에 대한 지식을 AI 에이전트에 제공합니다.

- 6개 프로그램([Agent Registry](/agents), [Genesis](/smart-contracts/genesis), [Core](/core), [Token Metadata](/token-metadata), [Bubblegum](/smart-contracts/bubblegum-v2), [Candy Machine](/smart-contracts/core-candy-machine)) 모두 CLI와 Umi SDK 지원
- Kit SDK는 Token Metadata만 사용 가능
- `mplx` CLI는 코드 작성 없이 대부분의 오퍼레이션 처리
- 이 페이지에서 작업에 맞는 프로그램과 도구 접근 방식 결정

## 프로그램 커버리지

다음 표는 각 프로그램에서 사용 가능한 도구 접근 방식을 보여줍니다.

| 프로그램 | CLI | Umi SDK | Kit SDK |
|---------|-----|---------|---------|
| **Agent Registry** | Yes | Yes | — |
| **Genesis** | Yes | Yes | — |
| **Core** | Yes | Yes | — |
| **Token Metadata** | Yes | Yes | Yes |
| **Bubblegum** | Yes | Yes | — |
| **Candy Machine** | Yes | Yes | — |

## Agent Registry

[Agent Registry](/agents)는 MPL Core 자산의 온체인 에이전트 아이덴티티, 월렛, 실행 위임을 제공합니다.

**CLI** (`mplx agents`): 에이전트 아이덴티티 등록, 실행 위임 및 취소, 에이전트 데이터 조회, Genesis 토큰을 에이전트에 연결. 전체 에이전트 토큰 생성 플로우에는 `mplx genesis launch create --agentMint --agentSetToken`을 사용하여 런치와 연결을 한 번에 실행.

**Umi SDK**: Mint Agent API(`mintAndSubmitAgent`)를 포함한 완전한 프로그래밍 접근. Core 자산 생성과 아이덴티티 등록을 단일 트랜잭션으로 실행. 기존 자산에는 `registerIdentityV1` 지원. 실행 위임과 전체 [에이전트 토큰 생성](/agents/create-agent-token) 플로우(Genesis로 토큰을 런치하고 `setAgentTokenV1`로 연결) 지원.

{% callout type="note" %}
모든 Core 자산은 Core의 Execute 훅을 통해 내장 월렛(Asset Signer PDA)을 갖습니다. Agent Registry는 발견 가능한 아이덴티티 레코드를 추가하고 소유자가 오프체인 실행자에게 에이전트 운영을 위임할 수 있게 합니다.
{% /callout %}

## Core

Solana의 차세대 NFT 표준. Core NFT는 Token Metadata NFT보다 상당히 저렴하며 로열티 강제, 프리즈 위임, 속성 등을 위한 플러그인 시스템을 지원합니다.

**CLI** (`mplx core`): 컬렉션과 자산 생성 및 업데이트, 플러그인 관리.

**Umi SDK**: 소유자/컬렉션/크리에이터별 조회, 플러그인 설정, 위임 관리를 포함한 완전한 프로그래밍 접근.

## Token Metadata

오리지널 Metaplex NFT 표준. 대체 가능 토큰, NFT, 프로그래밍 가능 NFT(pNFT), 에디션을 지원합니다.

**CLI** (`mplx tm`): NFT와 pNFT 생성. 자산 전송 및 업데이트. 대체 가능 토큰에는 `mplx toolbox token` 사용.

**Umi SDK**: 모든 Token Metadata 오퍼레이션에 대한 완전한 프로그래밍 접근.

**Kit SDK**: 최소 의존성으로 `@solana/kit`을 사용한 Token Metadata 오퍼레이션. Umi 프레임워크를 피하고 싶을 때 유용합니다.

## Bubblegum (압축 NFT)

[Bubblegum](/smart-contracts/bubblegum-v2)은 상태 압축을 위한 Merkle 트리를 사용하여 대규모로 NFT를 생성할 수 있습니다. 압축 NFT는 초기 트리 생성 후 기존 NFT의 극히 일부 비용으로 생성됩니다.

**CLI** (`mplx bg`): Merkle 트리 생성, cNFT 민팅(배치 제한 ~100), 조회, 업데이트, 전송, 소각.

**Umi SDK**: 완전한 프로그래밍 접근. ~100을 초과하는 배치나 DAS API 쿼리에는 SDK 사용.

{% callout type="note" %}
압축 NFT 오퍼레이션에는 DAS 지원 RPC 엔드포인트가 필요합니다. 표준 Solana RPC 엔드포인트는 cNFT 오퍼레이션에 필요한 Digital Asset Standard API를 지원하지 않습니다.
{% /callout %}

## Candy Machine

[Core Candy Machine](/smart-contracts/core-candy-machine)은 설정 가능한 민팅 규칙(가드)으로 NFT 드롭을 배포합니다. 가드는 누가 민팅할 수 있는지, 언제, 얼마에, 몇 개까지 제어합니다.

**CLI** (`mplx cm`): Candy Machine 설정, 아이템 삽입, 배포. 민팅에는 SDK 필요.

**Umi SDK**: 민팅 오퍼레이션과 가드 설정을 포함한 완전한 프로그래밍 접근.

## Genesis

[Genesis](/smart-contracts/genesis)는 공정한 배포와 Raydium으로의 자동 유동성 졸업을 갖춘 토큰 출시 프로토콜입니다. 두 가지 출시 유형을 지원: **launchpool**(설정 가능한 할당과 48시간 예치 기간, 선택적 팀 베스팅)과 **bonding curve**(즉시 상수 곱 AMM으로 거래가 즉시 시작, 매진 시 Raydium CPMM으로 자동 졸업).

**CLI** (`mplx genesis`): launchpool 또는 bonding curve를 통한 토큰 출시 생성 및 관리. bonding curve 출시의 크리에이터 수수료, 첫 구매, 에이전트 모드 지원.

**Umi SDK**: Launch API(`createAndRegisterLaunch`)를 통한 완전한 프로그래밍 접근. 상태 조회, 라이프사이클 헬퍼, 슬리피지 포함 견적 계산, 스왑 실행을 포함한 bonding curve 스왑 통합. Genesis 토큰을 Agent Registry 아이덴티티에 연결하는 에이전트 출시 플로우도 지원.

## CLI 기능

`mplx` CLI는 코드 작성 없이 대부분의 Metaplex 오퍼레이션을 직접 처리할 수 있습니다:

| 작업 | CLI 지원 |
|------|-------------|
| 에이전트 아이덴티티 등록 | Yes (`mplx agents register`) |
| 실행자 프로필 등록 | Yes (`mplx agents executive register`) |
| 실행 위임/취소 | Yes (`mplx agents executive delegate` / `revoke`) |
| 에이전트 데이터 조회 | Yes (`mplx agents fetch`) |
| 에이전트 토큰 설정 (Genesis 연결) | Yes (`mplx agents set-agent-token`, asset-signer 모드 필요) |
| 대체 가능 토큰 생성 | Yes (`mplx toolbox token create`) |
| Core NFT/컬렉션 생성 | Yes (`mplx core`) |
| TM NFT/pNFT 생성 | Yes (`mplx tm create`) |
| TM NFT 전송 | Yes (`mplx tm transfer`) |
| 대체 가능 토큰 전송 | Yes (`mplx toolbox token transfer`) |
| Core NFT 전송 | Yes (`mplx core asset transfer`) |
| Core NFT 소각 | Yes |
| Core NFT 메타데이터 업데이트 | Yes |
| 스토리지에 업로드 | Yes (`mplx toolbox storage upload`) |
| Candy Machine 드롭 | Yes (설정/구성/삽입 — 민팅에는 SDK 필요) |
| 압축 NFT (cNFT) | Yes (배치 제한 ~100, 더 큰 경우 SDK 사용) |
| Execute (asset-signer 월렛) | Yes (`mplx core asset execute`) |
| SOL 잔액 확인 / 에어드롭 | Yes (`mplx toolbox sol`) |
| 소유자/컬렉션별 자산 쿼리 | SDK만 (DAS API) |
| 토큰 출시 — launchpool (Genesis) | Yes (`mplx genesis launch create`) |
| 토큰 출시 — bonding curve (Genesis) | Yes (`mplx genesis launch create --launchType bonding-curve`) |
| 에이전트 토큰 출시 (Genesis + 연결) | Yes (`mplx genesis launch create --agentMint --agentSetToken`) |

## 결정 가이드

작업에 적합한 프로그램과 도구를 선택하기 위한 가이드입니다.

### 자율 에이전트

MPL Core 자산의 온체인 아이덴티티와 실행 위임 등록에는 **[Agent Registry](/agents)**를 사용합니다. Mint Agent API(`mintAndSubmitAgent`)는 Core 자산 생성과 아이덴티티 등록을 단일 트랜잭션으로 실행합니다. 기존 자산에는 `mplx agents register <asset> --use-ix`(CLI) 또는 `registerIdentityV1`(SDK)을 사용. 에이전트는 Genesis로 런치하고 `setAgentTokenV1`로 연결하여 [에이전트 토큰을 생성 및 연결](/agents/create-agent-token)할 수 있습니다.

### NFT: Core vs Token Metadata

| 선택 | 조건 |
|--------|------|
| **Core** | 새 NFT 프로젝트, 낮은 비용, 플러그인, 로열티 강제 |
| **Token Metadata** | 기존 TM 컬렉션, 에디션 필요, 레거시 호환성을 위한 pNFT |

### 압축 NFT를 사용할 때

최소 비용으로 수천 개 이상의 NFT를 민팅할 때 **Bubblegum**을 사용합니다. 초기 비용은 Merkle 트리 생성이며, 이후 각 민팅은 트랜잭션 수수료만 발생합니다.

### Candy Machine을 사용할 때

민팅 규칙(허용 목록, 시작/종료 날짜, 민팅 제한, 결제 토큰 등)을 제어해야 하는 NFT 드롭에는 **Core Candy Machine**을 사용합니다.

### 대체 가능 토큰

대체 가능 토큰에는 항상 **Token Metadata**를 사용합니다.

### 토큰 출시

공정한 배포와 자동 Raydium 유동성 졸업을 갖춘 토큰 생성 이벤트에는 **[Genesis](/smart-contracts/genesis)**를 사용합니다. 두 가지 출시 유형이 사용 가능:

- **Launchpool** (기본값) — 설정 가능한 할당과 48시간 예치 기간, 선택적 팀 베스팅 지원.
- **Bonding curve** — 즉시 상수 곱 AMM으로 거래가 즉시 시작. 크리에이터 수수료, 첫 구매, 에이전트 모드 지원. 매진 시 Raydium CPMM으로 자동 졸업.

### 자산을 에이전트/볼트/월렛으로 사용 (Execute)

자산(NFT, 에이전트, 볼트)이 SOL이나 토큰을 보유하거나, 자금을 전송하거나, 트랜잭션에 서명하거나, 다른 자산을 소유해야 할 때 **Core Execute**를 사용합니다. 모든 Core 자산에는 자율 월렛으로 작동하는 signer PDA가 있습니다.

### CLI vs SDK

| 선택 | 조건 |
|--------|------|
| **CLI** | 기본 선택 — 직접 실행, 코드 불필요 |
| **Umi SDK** | 코드가 필요하거나 CLI에서 지원하지 않는 오퍼레이션 |
| **Kit SDK** | `@solana/kit`을 사용하고 최소 의존성을 원하는 경우 (Token Metadata만) |

## 빠른 참조

각 프로그램에는 SDK 접근을 위한 npm 패키지가 있으며, CLI는 모든 프로그램을 하나의 도구로 번들합니다.

| 도구 | 패키지 |
|------|---------|
| CLI | [`@metaplex-foundation/cli`](https://github.com/metaplex-foundation/cli) (`mplx`) |
| Umi SDK | [`@metaplex-foundation/umi`](https://github.com/metaplex-foundation/umi) |
| Agent Registry SDK | [`@metaplex-foundation/mpl-agent-registry`](https://github.com/metaplex-foundation/mpl-agent-registry) |
| Core SDK | [`@metaplex-foundation/mpl-core`](https://github.com/metaplex-foundation/mpl-core) |
| Token Metadata SDK | [`@metaplex-foundation/mpl-token-metadata`](https://github.com/metaplex-foundation/mpl-token-metadata) |
| Bubblegum SDK | [`@metaplex-foundation/mpl-bubblegum`](https://github.com/metaplex-foundation/mpl-bubblegum) |
| Candy Machine SDK | [`@metaplex-foundation/mpl-core-candy-machine`](https://github.com/metaplex-foundation/mpl-core-candy-machine) |
| Genesis SDK | [`@metaplex-foundation/genesis`](https://github.com/metaplex-foundation/genesis) |
| Kit SDK (TM만) | [`@metaplex-foundation/mpl-token-metadata-kit`](https://github.com/metaplex-foundation/mpl-token-metadata/tree/main/clients/js-kit) |

## 참고사항

- 압축 NFT(Bubblegum) 오퍼레이션에는 DAS 지원 RPC 엔드포인트가 필요합니다; 표준 Solana RPC는 Digital Asset Standard API를 지원하지 않습니다
- Candy Machine 민팅에는 SDK가 필요합니다 — CLI는 설정, 구성, 아이템 삽입만 처리
- 소유자 또는 컬렉션별 자산 쿼리에는 DAS API(SDK만)가 필요합니다
- Kit SDK 지원은 Token Metadata로 제한됩니다; 다른 모든 프로그램은 Umi 사용
- 에이전트 토큰 설정(`setAgentTokenV1`)에는 Core 자산의 asset-signer 모드가 필요합니다
- Bonding curve 출시는 모든 토큰이 매진되면 Raydium CPMM으로 자동 졸업합니다
