---
# Remember to also update the date in src/components/products/guides/index.js
title: 스토리지 업로드
metaTitle: 스토리지 업로드 | Metaplex CLI
description: 파일 또는 파일 디렉터리를 구성된 스토리지 제공자에 업로드합니다.
keywords:
  - mplx CLI
  - storage upload
  - Irys
  - Arweave
  - upload file
  - upload directory
about:
  - Metaplex CLI
  - Storage Providers
proficiencyLevel: Beginner
created: '04-20-2026'
updated: '04-20-2026'
---

## 요약

`mplx toolbox storage upload` 명령어는 단일 파일 또는 전체 디렉터리를 구성된 스토리지 제공자에 업로드합니다.

- 기본적으로 하나의 파일을 업로드하거나, `--directory`를 사용하여 디렉터리 내 모든 파일을 업로드합니다.
- 디렉터리 업로드는 각 파일을 URI에 매핑하는 `uploadCache.json`을 생성합니다.
- 잔액이 부족하면 스토리지 계정에 자동으로 자금을 충전합니다.
- 업로드된 콘텐츠의 URI와 MIME 타입을 반환합니다.

## 빠른 참조

| 항목 | 값 |
|------|-------|
| 명령어 | `mplx toolbox storage upload <path> [--directory]` |
| 필수 인수 | `path` — 파일 경로 또는 `--directory`와 함께 디렉터리 경로 |
| 선택적 플래그 | `--directory` |
| 디렉터리 출력 | 현재 디렉터리에 `uploadCache.json` 작성 |
| 제공자 | 활성 스토리지 제공자 (예: Irys) |

## 기본 사용법

단일 파일을 업로드하려면 파일 경로를 전달하거나, 디렉터리 내 모든 파일을 업로드하려면 `--directory`를 추가합니다.

```bash
# Upload a single file
mplx toolbox storage upload <path>

# Upload every file in a directory
mplx toolbox storage upload <directory> --directory
```

## 인수

단일 위치 인수는 업로드되는 경로입니다.

- `path` *(필수)*: 파일 경로 또는 `--directory`와 결합할 때 디렉터리 경로.

## 플래그

선택적 플래그는 디렉터리 모드로 전환합니다.

- `--directory`: 지정된 디렉터리의 모든 파일을 업로드합니다.

## 예시

다음 예시는 단일 파일과 디렉터리 업로드를 보여줍니다.

```bash
mplx toolbox storage upload ./metadata.json
mplx toolbox storage upload ./assets --directory
```

## 출력

단일 파일 업로드는 결과 URI를 출력합니다. 디렉터리 업로드는 개수와 캐시 파일 경로를 보고합니다.

단일 파일:
```
--------------------------------
    Uploaded <path>
    URI: <uri>
---------------------------------
```

디렉터리:
```
--------------------------------
    Successfully uploaded <N> files

    Upload cache saved to uploadCache.json
---------------------------------
```

## 참고사항

- 스토리지는 활성 스토리지 제공자를 통해 자금이 조달되고 청구됩니다. 스토리지 잔액이 부족하면 명령어는 업로드 전에 자동으로 자금을 충전합니다.
- [`toolbox storage balance`](/dev-tools/cli/toolbox/storage-balance)로 스토리지 잔액을 확인하세요.
- [`toolbox storage fund`](/dev-tools/cli/toolbox/storage-fund)로 스토리지 계정에 자금을 충전하세요.
