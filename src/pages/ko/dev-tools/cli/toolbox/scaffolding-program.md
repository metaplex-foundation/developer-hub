---
# Remember to also update the date in src/components/products/guides/index.js
title: 프로그램 스캐폴딩
metaTitle: 프로그램 스캐폴딩 | Metaplex CLI
description: Metaplex 프로그램 템플릿을 복제하여 새로운 온체인 프로그램 프로젝트를 시작합니다.
keywords:
  - mplx CLI
  - program template
  - scaffolding
  - Solana program
  - Shank
about:
  - Metaplex CLI
  - Program Scaffolding
proficiencyLevel: Beginner
created: '04-20-2026'
updated: '04-20-2026'
---

## 요약

`mplx toolbox template program` 명령어는 Metaplex에서 관리하는 프로그램 템플릿을 현재 디렉터리로 복제합니다.

- Metaplex 규칙이 사전 구성된 새로운 Solana 프로그램 프로젝트를 부트스트랩합니다.
- 템플릿 키가 제공되지 않으면 대화형 선택기를 시작합니다.
- `git`이 `PATH`에서 사용 가능해야 합니다.
- 프런트엔드 템플릿은 [`toolbox template website`](/dev-tools/cli/toolbox/scaffolding-website)를 참조하세요.

## 빠른 참조

| 항목 | 값 |
|------|-------|
| 명령어 | `mplx toolbox template program [template]` |
| 선택적 인수 | `template` — 다음 중 하나: `shank` |
| 대화형 | 예 — 인수가 생략되면 선택기가 표시됨 |
| 필요 항목 | `PATH`의 `git` |
| 부작용 | 현재 작업 디렉터리로 복제됨 |

## 사용 가능한 템플릿

사용 가능한 템플릿 키는 Metaplex에서 관리하는 저장소에 매핑됩니다.

| 템플릿 | 설명 |
|----------|-------------|
| `shank` | IDL 생성을 위해 Shank를 사용하는 Solana 프로그램 템플릿 2.0. |

## 기본 사용법

대화형으로 선택하려면 인수 없이 실행하고, 직접 복제하려면 템플릿 키를 전달합니다.

```bash
# Launch an interactive template picker
mplx toolbox template program

# Clone a specific template
mplx toolbox template program <template>
```

## 인수

단일 선택적 위치 인수는 템플릿을 선택합니다.

- `template` *(선택)*: 템플릿 키. 생략되면 대화형 선택기가 표시됩니다.

## 예시

다음 예시는 대화형 선택기와 직접 복제를 모두 보여줍니다.

```bash
mplx toolbox template program
mplx toolbox template program shank
```

## 참고사항

- 템플릿은 `git clone`을 통해 현재 작업 디렉터리로 복제됩니다.
- `git`이 설치되어 있고 `PATH`에서 사용 가능한지 확인하세요.
- 웹사이트/프런트엔드 템플릿은 [`toolbox template website`](/dev-tools/cli/toolbox/scaffolding-website)를 사용하세요.
