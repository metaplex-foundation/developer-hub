---
title: 자산 업데이트
metaTitle: 자산 업데이트 | Metaplex CLI
description: MPL Core 자산 메타데이터 및 속성 업데이트
---

`mplx core asset update` 명령어를 사용하면 메타데이터, 이름, URI 또는 이미지를 수정하여 MPL Core 자산을 업데이트할 수 있습니다. 단일 자산 또는 여러 자산을 한 번에 업데이트할 수 있습니다.

## 기본 사용법

### 단일 자산 업데이트
```bash
mplx core asset update <assetId> [options]
```

### 업데이트 옵션
- `--name <string>`: 자산의 새 이름
- `--uri <string>`: 자산 메타데이터의 새 URI
- `--image <path>`: 새 이미지 파일 경로
- `--json <path>`: 새 메타데이터가 포함된 JSON 파일 경로

## 업데이트 방법

### 1. 이름과 URI 업데이트
```bash
mplx core asset update <assetId> --name "Updated Asset" --uri "https://example.com/metadata.json"
```

### 2. JSON 파일로 업데이트
```bash
mplx core asset update <assetId> --json ./asset/metadata.json
```

### 3. 이미지로 업데이트
```bash
mplx core asset update <assetId> --image ./asset/image.jpg
```

### 4. JSON과 이미지로 업데이트
```bash
mplx core asset update <assetId> --json ./asset/metadata.json --image ./asset/image.jpg
```

## 예시

### 자산 이름 업데이트
```bash
mplx core asset update 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --name "New Asset Name"
```

### 새 이미지로 자산 업데이트
```bash
mplx core asset update 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --image ./images/new-image.png
```

### 새 메타데이터로 자산 업데이트
```bash
mplx core asset update 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --json ./metadata/new-metadata.json
```

## 출력

업데이트가 성공하면 명령어가 다음을 표시합니다:
```
--------------------------------
  Asset: <assetId>
  Signature: <transactionSignature>
  Explorer: <explorerUrl>
  Core Explorer: https://core.metaplex.com/explorer/<assetId>
--------------------------------
```

## 참고사항

- 최소한 하나의 업데이트 플래그를 제공해야 합니다: `--name`, `--uri`, `--image`, `--json` 또는 `--edit`
- `--name` 및 `--uri` 플래그는 `--json` 또는 `--edit`와 함께 사용할 수 없습니다
- `--json`을 사용할 때 메타데이터 파일은 유효한 `name` 필드를 포함해야 합니다
- `--image` 플래그는 메타데이터의 이미지 URI와 이미지 파일 참조를 모두 업데이트합니다
- 명령어는 다음을 자동으로 처리합니다:
  - 적절한 스토리지에 파일 업로드
  - 메타데이터 JSON 형식화
  - 이미지 파일 유형 감지
  - 컬렉션 권한 확인
