---
title: 에이전트 토큰 생성
metaTitle: Solana에서 에이전트 토큰 생성 | Metaplex Agent Kit
description: Metaplex Genesis를 사용하여 에이전트의 온체인 지갑에서 토큰을 발행합니다. Solana에서 에이전트를 등록한 다음 Genesis 프로토콜로 토큰을 생성하고 배포합니다.
keywords:
  - agent token
  - token launch
  - Genesis
  - agent wallet
  - Solana agents
  - Metaplex
about:
  - Agent Tokens
  - Genesis
  - Solana
proficiencyLevel: Beginner
created: '04-05-2026'
updated: '04-05-2026'
---

Metaplex Genesis 프로토콜을 사용하여 에이전트의 온체인 지갑에서 토큰을 생성합니다. {% .lead %}

## 요약

에이전트 토큰은 에이전트의 온체인 지갑에서 직접 발행되는 토큰입니다. 에이전트는 Solana에서 ID를 등록한 후 [Metaplex Genesis](/smart-contracts/genesis) 프로토콜을 사용하여 토큰을 생성하고 배포합니다.

- **등록** — [Metaplex Agent Registry](/agents/register-agent)로 Solana에 에이전트 ID 등록
- **발행** — Metaplex API, SDK 또는 CLI를 통해 [Genesis](/smart-contracts/genesis) 프로토콜로 토큰 발행
- **필수 조건** — 토큰 생성 전에 온체인 지갑이 있는 등록된 에이전트 필요
- **지원** — 런치 풀, 프리세일, 경매 등 모든 Genesis 발행 유형 지원

## 에이전트 토큰 생성 방법

에이전트 토큰 생성은 에이전트 ID 등록과 Genesis 토큰 발행 프로토콜을 결합한 2단계 프로세스입니다.

### 1단계: Solana에서 에이전트 등록

에이전트는 먼저 [Solana에서 Metaplex에 등록](/agents/register-agent)해야 합니다. 이를 통해 공개 ID와 온체인 지갑이 생성됩니다. 등록은 ID 레코드를 MPL Core 자산에 바인딩하여 에이전트를 온체인에서 검색 가능하게 만듭니다. 전체 지침은 [에이전트 등록](/agents/register-agent) 가이드를 참조하세요.

### 2단계: Genesis로 토큰 발행

등록 후 에이전트는 [Metaplex Genesis](/smart-contracts/genesis) 프로토콜을 사용하여 토큰을 발행합니다. Genesis는 런치 풀, 프리세일, 균일 가격 경매 등 여러 발행 메커니즘을 지원합니다. 에이전트는 다음 방법으로 Genesis와 상호작용할 수 있습니다:

- **[Metaplex API](/smart-contracts/genesis/integration-apis)** — REST 엔드포인트를 통한 프로그래밍 방식의 토큰 생성
- **[Metaplex SDK](/smart-contracts/genesis/sdk/javascript)** — JavaScript/TypeScript SDK 통합
- **[Metaplex CLI](/dev-tools/cli/genesis)** — 명령줄 토큰 발행 워크플로우

전체 Genesis 문서는 [Genesis 개요](/smart-contracts/genesis)를 참조하세요.

{% callout type="note" %}
에이전트 토큰 생성에 대한 전체 엔드투엔드 문서가 곧 제공될 예정입니다. 이 페이지는 완전한 코드 예제와 단계별 지침으로 업데이트될 예정입니다.
{% /callout %}

## 참고 사항

- 에이전트는 토큰을 발행하기 전에 [등록](/agents/register-agent)이 필요합니다. 등록을 통해 토큰 생성에 사용되는 온체인 지갑이 생성됩니다.
- 에이전트 토큰은 [Genesis](/smart-contracts/genesis)를 통해 발행되는 표준 SPL 토큰으로, Solana 토큰 생태계와 완전히 호환됩니다.
- Genesis 프로토콜은 발행자가 에이전트이든 사람의 지갑이든 관계없이 모든 토큰 배포 메커니즘(런치 풀, 프리세일, 경매)을 처리합니다.

*Metaplex 관리 · 2026년 4월 검증 완료 · [Genesis](https://github.com/metaplex-foundation/mpl-genesis)*
