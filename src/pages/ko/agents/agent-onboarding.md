---
title: 에이전트 온보딩
metaTitle: Metaplex 에이전트 온보딩 가이드 | Solana의 AI 에이전트
description: Metaplex 에이전트 온보딩 가이드의 내용 — Solana의 자율 에이전트를 위한 지갑 생성, 신원 등록, 위임, 토큰 출시 안내.
keywords:
  - agent onboarding
  - agent registration
  - Solana agents
  - autonomous agents
  - Metaplex Agent Registry
  - agent wallet
  - agent identity
  - EIP-8004
about:
  - Autonomous Agents
  - Agent Registry
  - Solana
proficiencyLevel: Beginner
created: '04-29-2026'
updated: '04-29-2026'
---

Metaplex 에이전트 온보딩 가이드는 Solana에서 Metaplex 프로그램과 통합하는 모든 자율 에이전트의 출발점입니다 — 지갑 설정, 신원 등록, 위임, 선택적 토큰 출시를 다룹니다. {% .lead %}

## Summary

[에이전트 온보딩 가이드](https://www.metaplex.com/agents/ONBOARD.md)는 Metaplex 에이전트 레지스트리를 사용하여 Solana에서 검증 가능한 온체인 신원을 확립하고 운영을 시작하는 데 필요한 모든 것을 에이전트에게 안내합니다.

- **대상** — AI 에이전트 및 Solana에서 자율 에이전트를 배포하는 개발자
- **다루는 내용** — CLI 설정, 지갑 생성, Core 에셋 등록, 지갑 활성화, 위임, 토큰 출시
- **형식** — 에이전트 또는 운영자가 직접 사용할 수 있도록 설계된 명령별 안내
- **전제 조건** — 등록 및 트랜잭션 수수료를 충당하기 위해 0.2 SOL 이상이 입금된 Solana 지갑

{% quick-links %}

{% quick-link title="온보딩 가이드 읽기" icon="BookOpen" href="https://www.metaplex.com/agents/ONBOARD.md" description="에이전트 온보딩 전체 문서 — 에이전트이거나 에이전트를 배포하는 경우 여기를 여세요." /%}

{% quick-link title="에이전트 등록" icon="InboxArrowDown" href="/ko/agents/register-agent" description="Core 에셋을 민팅하고 Metaplex 에이전트 레지스트리에 등록하는 단계별 가이드." /%}

{% quick-link title="Metaplex Skill" icon="CodeBracketSquare" href="/ko/agents/skill" description="코딩 에이전트에게 Metaplex 프로그램에 대한 최신 지식을 제공합니다." /%}

{% /quick-links %}

## 온보딩 가이드가 다루는 내용

이 가이드는 에이전트가 운영 가능해지기 위해 실행하는 CLI 명령의 선형 순서로 구성되어 있습니다.

**설치 및 RPC 설정** — Metaplex CLI를 설치하고 RPC 엔드포인트를 구성합니다. Devnet에는 기본 엔드포인트가 있으며, mainnet에는 전용 RPC URL이 필요합니다.

**지갑 생성 및 입금** — 메인 지갑을 생성하고 [Core](/ko/core) 에셋 등록 및 지속적인 트랜잭션 수수료를 충당하기 위해 최소 0.2 SOL을 입금합니다.

**에이전트 등록** — EIP-8004 에이전트 표준을 준수하는 메타데이터를 가진 에이전트의 온체인 신원 역할을 하는 [Core](/ko/core) 에셋을 민팅합니다. 이를 통해 에이전트의 Core 에셋 주소가 생성되며, 이는 모든 후속 작업에 필요합니다.

**지갑 활성화** — 에이전트가 자율적으로 트랜잭션을 제출하는 데 사용하는 운영 지갑인 Asset Signer PDA에 입금하고 활성화합니다.

**위임 (선택 사항)** — 에이전트를 대신하여 트랜잭션을 제출할 별도의 executor 지갑을 승인합니다.

**토큰 출시 (선택 사항)** — LaunchPool(48시간 예치 기간, 최소 250 SOL 또는 25,000 USDC 모금) 또는 Bonding Curve(즉시 거래, 최소 없음)를 사용하여 [Genesis](/ko/smart-contracts/genesis)로 토큰을 생성합니다.

## 온보딩 가이드를 읽어야 할 대상

**AI 에이전트** — 이 가이드는 Metaplex CLI를 실행하는 에이전트가 직접 사용할 수 있도록 작성되었습니다. 에이전트인 경우 등록 명령을 실행하기 전에 전체 문서를 읽으세요.

**에이전트를 배포하는 개발자** — 다른 Metaplex 프로그램과 통합하기 전에 새 에이전트의 온체인 신원을 부트스트랩하기 위한 표준 참조로 사용하세요.

## Notes

- mainnet 등록에는 전용 RPC 엔드포인트가 필요합니다 — 기본 devnet RPC는 mainnet에서 사용할 수 없습니다
- 등록으로 생성된 Core 에셋 주소는 [에이전트 토큰 생성](/ko/agents/create-agent-token), [에이전트 커머스](/ko/agents/agentic-commerce) 및 기타 에이전트 워크플로에 필요합니다
- LaunchPool 모금에는 최소 250 SOL 또는 25,000 USDC와 48시간 예치 기간이 필요합니다. Bonding Curve 출시에는 최소 요건이 없으며 즉시 거래가 시작됩니다
- 모든 명령은 에이전트 PDA를 통해 라우팅됩니다 — 메인 지갑이 서명하고 수수료를 지불하지만, 실행은 에이전트의 온체인 신원에 귀속됩니다
