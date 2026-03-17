---
title: 작동 방식
metaTitle: 작동 방식 | Metaplex 스킬
description: Metaplex 스킬의 프로그레시브 디스클로저 아키텍처를 이해합니다.
created: '02-23-2026'
updated: '03-04-2026'
keywords:
  - progressive disclosure
  - agent skill architecture
  - task router
  - SKILL.md
  - reference files
about:
  - Progressive disclosure
  - Agent Skill architecture
  - Context management
proficiencyLevel: Intermediate
---

Metaplex Skill은 **프로그레시브 디스클로저**를 사용하여 AI 에이전트에 필요한 컨텍스트만 정확히 제공합니다. 토큰 사용량을 낮게 유지하면서 모든 Metaplex 프로그램의 포괄적인 커버리지를 제공합니다. {% .lead %}

## 요약

Metaplex Skill은 2계층 프로그레시브 디스클로저 아키텍처를 사용하여 토큰 사용량을 최소화하면서 AI 에이전트에 정확한 Metaplex 지식을 제공합니다.

- 경량 라우터 파일(`SKILL.md`)이 작업을 특정 참조 파일에 매핑
- 에이전트는 현재 작업과 관련된 파일만 읽음
- 참조 파일은 CLI 명령, SDK 패턴 및 개념적 기반을 포함
- 아키텍처는 모든 Metaplex 프로그램을 커버하면서 컨텍스트를 작게 유지

## 아키텍처

스킬에는 두 개의 레이어가 있습니다:

1. **`SKILL.md`** — 에이전트가 먼저 읽는 경량 라우터 파일. 모든 프로그램의 개요, 도구 선택 가이드, 작업을 특정 참조 파일에 매핑하는 작업 라우터 테이블을 포함합니다.

2. **참조 파일** — CLI 설정, 프로그램별 CLI 명령, SDK 패턴, 개념적 기반을 다루는 상세 파일. 에이전트는 현재 작업과 관련된 파일만 읽습니다.

## 에이전트가 Metaplex Skill을 사용하는 방법

에이전트에게 Metaplex 작업을 수행하도록 요청하면:

1. 에이전트가 `SKILL.md`를 읽고 작업 유형을 식별
2. 작업 라우터 테이블이 에이전트를 관련 참조 파일로 안내
3. 에이전트가 해당 파일만 읽고 정확한 명령과 코드로 작업 실행

예를 들어 *"devnet에서 Core NFT를 만들어줘"*라고 요청하면, 에이전트는 `SKILL.md`를 읽고 이것을 CLI Core 작업으로 식별한 후 `cli.md`(공통 설정)와 `cli-core.md`(Core 전용 명령)를 읽습니다.

## 참조 파일

스킬에는 접근 방식과 프로그램별로 구성된 참조 파일이 포함되어 있습니다:

### CLI 참조

이 파일들은 각 프로그램의 `mplx` CLI 명령을 다룹니다.

| 파일 | 내용 |
|------|----------|
| `cli.md` | 공통 CLI 설정, 구성, 도구 상자 명령 |
| `cli-core.md` | Core NFT 및 컬렉션 CLI 명령 |
| `cli-token-metadata.md` | Token Metadata NFT/pNFT CLI 명령 |
| `cli-bubblegum.md` | 압축 NFT(cNFT) CLI 명령 |
| `cli-candy-machine.md` | Candy Machine 설정 및 배포 CLI 명령 |
| `cli-genesis.md` | Genesis 토큰 출시 CLI 명령 |

### SDK 참조

이 파일들은 각 프로그램의 Umi 및 Kit SDK 오퍼레이션을 다룹니다.

| 파일 | 내용 |
|------|----------|
| `sdk-umi.md` | Umi SDK 설정 및 공통 패턴 |
| `sdk-core.md` | Umi를 통한 Core NFT 오퍼레이션 |
| `sdk-token-metadata.md` | Umi를 통한 Token Metadata 오퍼레이션 |
| `sdk-bubblegum.md` | Umi를 통한 압축 NFT 오퍼레이션 |
| `sdk-genesis.md` | Umi를 통한 Genesis 토큰 출시 오퍼레이션 |
| `sdk-token-metadata-kit.md` | Kit SDK를 통한 Token Metadata 오퍼레이션 |

### 개념

이 파일들은 계정 구조 및 프로그램 ID와 같은 공유 지식을 다룹니다.

| 파일 | 내용 |
|------|----------|
| `concepts.md` | 계정 구조, PDA, 프로그램 ID |

## 작업 라우터

`SKILL.md`의 작업 라우터는 각 작업 유형을 에이전트가 읽어야 할 파일에 매핑합니다:

| 작업 유형 | 로드되는 파일 |
|-----------|-------------|
| CLI 오퍼레이션(공통 설정) | `cli.md` |
| CLI: Core NFT/컬렉션 | `cli.md` + `cli-core.md` |
| CLI: Token Metadata NFT | `cli.md` + `cli-token-metadata.md` |
| CLI: 압축 NFT(Bubblegum) | `cli.md` + `cli-bubblegum.md` |
| CLI: Candy Machine(NFT 드롭) | `cli.md` + `cli-candy-machine.md` |
| CLI: 토큰 출시(Genesis) | `cli.md` + `cli-genesis.md` |
| CLI: 대체 가능 토큰 | `cli.md`(도구 상자 섹션) |
| SDK 설정(Umi) | `sdk-umi.md` |
| SDK: Core NFT | `sdk-umi.md` + `sdk-core.md` |
| SDK: Token Metadata | `sdk-umi.md` + `sdk-token-metadata.md` |
| SDK: 압축 NFT(Bubblegum) | `sdk-umi.md` + `sdk-bubblegum.md` |
| SDK: Candy Machine(민팅/가드) | `sdk-umi.md` |
| SDK: Kit을 사용한 Token Metadata | `sdk-token-metadata-kit.md` |
| SDK: 토큰 출시(Genesis) | `sdk-umi.md` + `sdk-genesis.md` |
| 계정 구조, PDA, 개념 | `concepts.md` |

## 참고사항

- 스킬은 AI 코딩 에이전트용으로 설계되었으며 사람이 읽는 문서로 렌더링되지 않을 수 있습니다
- 참조 파일은 [Skill 리포지토리](https://github.com/metaplex-foundation/skill)와 함께 유지되며 개발자 허브와 독립적으로 업데이트될 수 있습니다
- [Agent Skills](https://agentskills.io) 형식을 지원하지 않는 에이전트도 수동 설치를 통해 스킬을 사용할 수 있습니다
