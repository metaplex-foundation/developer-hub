---
title: Metaplex 스킬
metaTitle: Metaplex 스킬 | 에이전트
description: AI 코딩 에이전트에 Metaplex 프로그램, CLI 명령 및 SDK 패턴에 대한 완전한 지식을 제공하는 에이전트 스킬.
keywords:
  - agent skill
  - AI coding agent
  - Claude Code
  - Cursor
  - Copilot
  - Metaplex
  - Solana
  - NFT
  - agent registry
  - bonding curve
  - Genesis
about:
  - Agent Skills
  - AI-assisted development
  - Metaplex
proficiencyLevel: Beginner
created: '02-23-2026'
updated: '04-08-2026'
---

Metaplex Skill은 [Agent Skill](https://agentskills.io)입니다 — AI 코딩 에이전트에 Metaplex 프로그램, CLI 명령 및 SDK 패턴에 대한 정확하고 최신의 지식을 제공하는 지식 베이스입니다. {% .lead %}

## 요약

Metaplex Skill은 모든 Metaplex 프로그램, CLI 명령 및 SDK 패턴에 대한 정확한 지식을 AI 코딩 에이전트에 제공합니다.

- 6개 프로그램 지원: [Agent Registry](/agents), [Genesis](/smart-contracts/genesis), [Core](/smart-contracts/core), [Token Metadata](/smart-contracts/token-metadata), [Bubblegum](/smart-contracts/bubblegum-v2), [Candy Machine](/smart-contracts/core-candy-machine)
- CLI, Umi SDK, Kit SDK 접근 방식 지원
- Claude Code, Cursor, Copilot, Codex, Windsurf 및 기타 호환 에이전트에서 작동
- 프로그레시브 디스클로저를 통해 토큰 사용량을 최소화하면서 전체 커버리지 제공

잘못된 API나 플래그에 의존하는 대신 AI 에이전트가 스킬을 참조하여 첫 번째 시도에서 정확한 명령과 코드를 얻을 수 있습니다.

{% quick-links %}

{% quick-link title="설치" icon="InboxArrowDown" href="/agents/skill/installation" description="Claude Code, Cursor, Copilot 또는 Agent Skills 형식을 지원하는 모든 에이전트에 스킬을 설치합니다." /%}

{% quick-link title="작동 방식" icon="CodeBracketSquare" href="/agents/skill/how-it-works" description="프로그레시브 디스클로저가 컨텍스트를 가볍게 유지하면서 전체 커버리지를 제공하는 방법을 알아봅니다." /%}

{% /quick-links %}

## 지원 프로그램

스킬은 6개 Metaplex 프로그램과 전체 오퍼레이션 세트를 지원합니다:

| 프로그램 | 용도 | CLI | Umi SDK | Kit SDK |
|---------|---------|-----|---------|---------|
| **[Agent Registry](/agents)** | 온체인 에이전트 아이덴티티, 월렛, 실행 위임 | Yes | Yes | — |
| **[Genesis](/smart-contracts/genesis)** | launchpool 또는 bonding curve를 통한 토큰 출시와 Raydium 졸업 | Yes | Yes | — |
| **[Core](/smart-contracts/core)** | 플러그인과 로열티 강제가 있는 차세대 NFT | Yes | Yes | — |
| **[Token Metadata](/smart-contracts/token-metadata)** | 대체 가능 토큰, NFT, pNFT, 에디션 | Yes | Yes | Yes |
| **[Bubblegum](/smart-contracts/bubblegum-v2)** | Merkle 트리를 통한 압축 NFT | Yes | Yes | — |
| **[Core Candy Machine](/smart-contracts/core-candy-machine)** | 설정 가능한 가드가 있는 NFT 드롭 | Yes | Yes | — |

## 지원 오퍼레이션

스킬은 Metaplex 개발의 세 가지 접근 방식에 대한 참조 자료를 제공합니다:

- **CLI (`mplx`)** — 터미널에서 Metaplex 오퍼레이션 직접 실행. 에이전트 등록(`mplx agents`), 토큰 출시 및 bonding curve 생성(`mplx genesis`), 자산 생성, 업로드, Candy Machine 배포, 트리 생성, 전송 등.
- **Umi SDK** — 모든 프로그램을 커버하는 완전한 프로그래밍 접근. 에이전트 아이덴티티와 위임, Genesis 출시와 bonding curve 스왑, 소유자/컬렉션/크리에이터별 조회, DAS API 쿼리, 위임 관리, 플러그인 설정.
- **Kit SDK** — 최소 의존성으로 `@solana/kit`을 사용한 Token Metadata 오퍼레이션.

## 호환 에이전트

스킬은 [Agent Skills](https://agentskills.io) 형식을 지원하는 모든 AI 코딩 에이전트에서 작동합니다:

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
- [Cursor](https://www.cursor.com/)
- [GitHub Copilot](https://github.com/features/copilot)
- [Codex](https://openai.com/index/codex/)
- [Windsurf](https://windsurf.com/)

## 다음 단계

- **[스킬 설치](/agents/skill/installation)**로 시작
- **[작동 방식](/agents/skill/how-it-works)**으로 아키텍처 이해
- **[프로그램 및 오퍼레이션](/agents/skill/programs-and-operations)**에서 상세 커버리지 확인

## 빠른 참조

| 항목 | 값 |
|------|-------|
| 설치 명령 | `npx skills add metaplex` |
| 스킬 형식 | [Agent Skills](https://agentskills.io) |
| CLI 패키지 | [`@metaplex-foundation/cli`](https://github.com/metaplex-foundation/cli) (`mplx`) |
| 지원 프로그램 | 6개 (Agent Registry, Genesis, Core, Token Metadata, Bubblegum, Candy Machine) |
| SDK 접근 방식 | Umi SDK (전체 프로그램), Kit SDK (Token Metadata만) |

## 용어집

| 용어 | 정의 |
|------|-----------|
| Agent Skill | AI 코딩 에이전트에 특정 도메인의 정확한 컨텍스트를 제공하는 구조화된 지식 베이스 |
| 프로그레시브 디스클로저 | 에이전트가 먼저 가벼운 라우터를 읽고 현재 작업에 필요한 참조 파일만 로드하는 아키텍처 |
| SKILL.md | 작업을 특정 참조 파일에 매핑하는 라우터 파일 |
| `mplx` | 모든 지원 프로그램에 대한 직접 터미널 접근을 제공하는 Metaplex CLI 도구 |
| Umi SDK | 모든 프로그램에 대한 프로그래밍 접근을 제공하는 Metaplex의 주요 TypeScript SDK 프레임워크 |
| Kit SDK | `@solana/kit`을 사용한 경량 대안 SDK. 현재 Token Metadata만 지원 |

## 참고사항

- 스킬은 [Agent Skills](https://agentskills.io) 형식을 지원하는 AI 코딩 에이전트가 필요합니다
- 스킬 파일은 프로젝트에 번들된 정적 참조입니다 — 업데이트하려면 설치 명령을 다시 실행하세요
- `npx skills add` 명령에는 Node.js와 npm/npx가 필요합니다
