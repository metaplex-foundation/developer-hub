---
title: 설치
metaTitle: 설치 | Metaplex 스킬
description: Claude Code, Cursor, Copilot 또는 모든 AI 코딩 에이전트에 Metaplex Skill을 설치합니다.
created: '02-23-2026'
updated: '03-04-2026'
keywords:
  - agent skill installation
  - Claude Code skills
  - Cursor skills
  - Copilot skills
  - npx skills add
about:
  - Agent Skills
  - AI coding agent configuration
proficiencyLevel: Beginner
howToSteps:
  - Run npx skills add metaplex-foundation/skill in your project directory
  - Verify installation by asking your agent to perform a Metaplex operation
howToTools:
  - npx
  - Claude Code
  - Cursor
  - GitHub Copilot
---

AI 코딩 에이전트가 모든 Metaplex 프로그램, CLI 명령 및 SDK 패턴에 대한 정확한 지식을 갖도록 Metaplex Skill을 설치합니다. {% .lead %}

## 요약

Metaplex Skill은 `npx skills` CLI 또는 에이전트의 스킬 디렉토리에 파일을 수동으로 복사하여 설치할 수 있습니다.

- `npx skills add`를 통한 원커맨드 설치 (호환 에이전트 지원)
- Claude Code용 수동 설치 지원 (프로젝트 범위 또는 글로벌)
- Claude Code, Cursor, Copilot, Windsurf 및 기타 에이전트에서 작동
- 에이전트에 Metaplex 오퍼레이션 수행을 요청하여 확인

## skills.sh를 통해 (권장)

가장 빠른 설치 방법입니다. 프로젝트 디렉토리에서 실행:

```bash
npx skills add metaplex-foundation/skill
```

이것은 Claude Code, Cursor, Copilot, Windsurf 및 [Agent Skills](https://agentskills.io) 형식을 지원하는 모든 에이전트에서 작동합니다. 명령은 스킬 파일을 프로젝트에 다운로드하여 에이전트가 자동으로 참조할 수 있게 합니다.

## Claude Code 수동 설치

`npx skills`를 사용하지 않으려면 스킬 파일을 수동으로 복사할 수 있습니다.

### 프로젝트 범위

프로젝트의 Claude 스킬 디렉토리에 스킬 파일을 복사합니다:

```bash
mkdir -p .claude/skills/metaplex
```

그런 다음 [GitHub 리포지토리](https://github.com/metaplex-foundation/skill)의 `skills/metaplex/` 내용을 `.claude/skills/metaplex/`에 복사합니다.

### 글로벌

모든 프로젝트에서 스킬을 사용할 수 있게 하려면:

```bash
mkdir -p ~/.claude/skills/metaplex
```

그런 다음 [GitHub 리포지토리](https://github.com/metaplex-foundation/skill)의 `skills/metaplex/` 내용을 `~/.claude/skills/metaplex/`에 복사합니다.

## 설치 확인

설치 후 에이전트에 Metaplex 오퍼레이션 수행을 요청합니다. 예를 들어:

- *"Genesis로 토큰 출시해줘"*
- *"devnet에서 Core NFT 컬렉션 만들어줘"*
- *"내 트리에 압축 NFT 민팅해줘"*

스킬이 올바르게 로드되면 에이전트가 잘못된 플래그나 API 없이 올바른 CLI 명령 또는 SDK 코드를 참조합니다.

## 참고사항

- `npx skills add` 명령에는 Node.js와 npm/npx 설치가 필요합니다
- 수동 설치 경로는 프로젝트 범위(`.claude/skills/`)와 글로벌(`~/.claude/skills/`) 설정에 따라 다릅니다
- 스킬 파일은 정적 참조입니다 — 최신 버전으로 업데이트하려면 설치 명령을 다시 실행하세요
