---
# Remember to also update the date in src/components/products/guides/index.js
title: 웹사이트 스캐폴딩
metaTitle: 웹사이트 스캐폴딩 | Metaplex CLI
description: Metaplex 웹사이트 템플릿을 복제하여 새로운 프런트엔드 프로젝트를 시작합니다.
keywords:
  - mplx CLI
  - website template
  - scaffolding
  - Next.js
  - Tailwind
  - shadcn
about:
  - Metaplex CLI
  - Website Scaffolding
proficiencyLevel: Beginner
created: '04-20-2026'
updated: '04-20-2026'
---

## 요약

`mplx toolbox template website` 명령어는 Metaplex에서 관리하는 웹사이트 템플릿을 현재 디렉터리로 복제합니다.

- Metaplex 흐름에 맞게 구성된 Next.js + Tailwind 프런트엔드를 부트스트랩합니다.
- 템플릿이 제공되지 않으면 대화형 선택기를 시작합니다.
- 위치 인수가 아닌 `--template` 플래그를 통해 템플릿을 선택합니다.
- `git`이 `PATH`에서 사용 가능해야 합니다.

## 빠른 참조

아래 표는 명령어의 플래그, 전제 조건, 부작용을 요약합니다.

| 항목 | 값 |
|------|-------|
| 명령어 | `mplx toolbox template website [--template <key>]` |
| 선택적 플래그 | `--template <key>` |
| 대화형 | 예 — `--template`이 생략되면 선택기가 표시됨 |
| 필요 항목 | `PATH`의 `git` |
| 부작용 | 현재 작업 디렉터리로 복제됨 |

## 사용 가능한 템플릿

사용 가능한 템플릿 키는 Metaplex에서 관리하는 저장소에 매핑됩니다.

| 템플릿 | 설명 |
|----------|-------------|
| `standard - nextjs-tailwind` | Next.js + Tailwind 스타터. |
| `standard - nextjs-tailwind-shadcn` | Next.js + Tailwind + shadcn/ui 스타터. |
| `404 - nextjs-tailwind-shadcn` | MPL Hybrid 404 UI 스타터 (Next.js + Tailwind + shadcn/ui). |

## 기본 사용법

대화형으로 선택하려면 플래그 없이 실행하고, 직접 복제하려면 `--template`을 전달합니다.

```bash
# Launch an interactive template picker
mplx toolbox template website

# Clone a specific template
mplx toolbox template website --template "<template-key>"
```

## 플래그

단일 선택적 플래그는 템플릿을 선택합니다.

- `--template <key>` *(선택)*: 템플릿 키. 생략되면 대화형 선택기가 표시됩니다.

## 예시

다음 예시는 대화형 선택기와 직접 복제를 모두 보여줍니다.

```bash
mplx toolbox template website
mplx toolbox template website --template "standard - nextjs-tailwind"
```

## 참고사항

- 템플릿은 `git clone`을 통해 현재 작업 디렉터리로 복제됩니다.
- `git`이 설치되어 있고 `PATH`에서 사용 가능한지 확인하세요.
- 온체인 프로그램 템플릿은 [`toolbox template program`](/dev-tools/cli/toolbox/scaffolding-program)을 사용하세요.
