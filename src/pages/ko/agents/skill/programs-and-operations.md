---
title: 프로그램 및 오퍼레이션
metaTitle: 프로그램 및 오퍼레이션 | Metaplex 스킬
description: Metaplex Skill이 다루는 프로그램과 오퍼레이션의 상세 분석.
created: '02-23-2026'
updated: '03-04-2026'
keywords:
  - Core
  - Token Metadata
  - Bubblegum
  - Candy Machine
  - Genesis
  - mplx CLI
  - Umi SDK
  - Kit SDK
about:
  - Metaplex programs
  - CLI operations
  - SDK operations
proficiencyLevel: Beginner
---

Metaplex Skill은 CLI, Umi SDK, Kit SDK에 걸쳐 5개 프로그램을 다룹니다. 이 페이지에서는 각 프로그램이 지원하는 기능과 사용 시기에 대한 상세 분석을 제공합니다. {% .lead %}

## 요약

Metaplex Skill은 CLI, Umi SDK, Kit SDK에 걸쳐 5개 Metaplex 프로그램과 사용 가능한 도구에 대한 지식을 AI 에이전트에 제공합니다.

- 5개 프로그램(Core, Token Metadata, Bubblegum, Candy Machine, Genesis) 모두 CLI와 Umi SDK 지원
- Kit SDK는 Token Metadata만 사용 가능
- `mplx` CLI는 코드 작성 없이 대부분의 오퍼레이션 처리
- 이 페이지에서 작업에 맞는 프로그램과 도구 접근 방식 결정

## 프로그램 커버리지

| 프로그램 | CLI | Umi SDK | Kit SDK |
|---------|-----|---------|---------|
| **Core** | Yes | Yes | — |
| **Token Metadata** | Yes | Yes | Yes |
| **Bubblegum** | Yes | Yes | — |
| **Candy Machine** | Yes | Yes | — |
| **Genesis** | Yes | Yes | — |

## Core

Solana의 차세대 NFT 표준. Core NFT는 Token Metadata NFT보다 상당히 저렴하며 로열티 강제, 프리즈 위임, 속성 등을 위한 플러그인 시스템을 지원합니다.

**CLI** (`mplx core`): 컬렉션과 자산 생성 및 업데이트, 플러그인 관리.

**Umi SDK**: 소유자/컬렉션/크리에이터별 조회, 플러그인 설정, 위임 관리를 포함한 완전한 프로그래밍 접근.

## Token Metadata

오리지널 Metaplex NFT 표준. 대체 가능 토큰, NFT, 프로그래밍 가능 NFT(pNFT), 에디션을 지원합니다.

**CLI** (`mplx tm`): 대체 가능 토큰, NFT, pNFT, 에디션 생성. 자산 전송 및 소각.

**Umi SDK**: 모든 Token Metadata 오퍼레이션에 대한 완전한 프로그래밍 접근.

**Kit SDK**: 최소 의존성으로 `@solana/kit`을 사용한 Token Metadata 오퍼레이션. Umi 프레임워크를 피하고 싶을 때 유용합니다.

## Bubblegum (압축 NFT)

상태 압축을 위한 Merkle 트리를 사용하여 대규모로 NFT를 생성. 압축 NFT는 초기 트리 생성 후 기존 NFT의 극히 일부 비용으로 생성됩니다.

**CLI** (`mplx bg`): Merkle 트리 생성, cNFT 민팅(배치 제한 ~100), 조회, 업데이트, 전송, 소각.

**Umi SDK**: 완전한 프로그래밍 접근. ~100을 초과하는 배치나 DAS API 쿼리에는 SDK 사용.

{% callout type="note" %}
압축 NFT 오퍼레이션에는 DAS 지원 RPC 엔드포인트가 필요합니다. 표준 Solana RPC 엔드포인트는 cNFT 오퍼레이션에 필요한 Digital Asset Standard API를 지원하지 않습니다.
{% /callout %}

## Candy Machine

설정 가능한 민팅 규칙(가드)으로 NFT 드롭 배포. 가드는 누가 민팅할 수 있는지, 언제, 얼마에, 몇 개까지 제어합니다.

**CLI** (`mplx cm`): Candy Machine 설정, 아이템 삽입, 배포. 민팅에는 SDK 필요.

**Umi SDK**: 민팅 오퍼레이션과 가드 설정을 포함한 완전한 프로그래밍 접근.

## Genesis

공정한 배포와 Raydium으로의 자동 유동성 졸업을 갖춘 토큰 출시 프로토콜.

**CLI** (`mplx genesis`): 토큰 출시 생성 및 관리.

**Umi SDK**: 토큰 출시 생성 및 관리를 위한 완전한 프로그래밍 접근.

## CLI 기능

`mplx` CLI는 코드 작성 없이 대부분의 Metaplex 오퍼레이션을 직접 처리할 수 있습니다:

| 작업 | CLI 지원 |
|------|-------------|
| 대체 가능 토큰 생성 | Yes |
| Core NFT/컬렉션 생성 | Yes |
| TM NFT/pNFT 생성 | Yes |
| TM NFT 전송 | Yes |
| 대체 가능 토큰 전송 | Yes |
| Core NFT 전송 | SDK만 |
| Irys에 업로드 | Yes |
| Candy Machine 드롭 | Yes (설정/구성/삽입 — 민팅에는 SDK 필요) |
| 압축 NFT (cNFT) | Yes (배치 제한 ~100, 더 큰 경우 SDK 사용) |
| SOL 잔액 확인 / 에어드롭 | Yes |
| 소유자/컬렉션별 자산 쿼리 | SDK만 (DAS API) |
| 토큰 출시 (Genesis) | Yes |

## 결정 가이드

작업에 적합한 프로그램과 도구를 선택하기 위한 가이드입니다.

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

공정한 배포 메커니즘과 자동 Raydium 유동성 졸업을 갖춘 토큰 생성 이벤트에는 **Genesis**를 사용합니다.

### CLI vs SDK

| 선택 | 조건 |
|--------|------|
| **CLI** | 기본 선택 — 직접 실행, 코드 불필요 |
| **Umi SDK** | 코드가 필요하거나 CLI에서 지원하지 않는 오퍼레이션 |
| **Kit SDK** | `@solana/kit`을 사용하고 최소 의존성을 원하는 경우 (Token Metadata만) |

## 참고사항

- 압축 NFT(Bubblegum) 오퍼레이션에는 DAS 지원 RPC 엔드포인트가 필요합니다; 표준 Solana RPC는 Digital Asset Standard API를 지원하지 않습니다
- Candy Machine 민팅에는 SDK가 필요합니다 — CLI는 설정, 구성, 아이템 삽입만 처리
- Core NFT 전송은 SDK만 가능하며 CLI에서는 사용할 수 없습니다
- 소유자 또는 컬렉션별 자산 쿼리에는 DAS API(SDK만)가 필요합니다
- Kit SDK 지원은 Token Metadata로 제한됩니다; 다른 모든 프로그램은 Umi 사용
