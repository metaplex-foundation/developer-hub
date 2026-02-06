---
title: 자산 또는 컬렉션 가져오기
metaTitle: 자산 또는 컬렉션 가져오기 | Metaplex CLI
description: 민트 주소로 MPL Core 자산 또는 컬렉션 가져오기
---

`mplx core fetch` 명령어를 사용하면 민트 주소로 MPL Core 자산이나 컬렉션을 가져올 수 있습니다. 메타데이터를 보고 선택적으로 관련 파일을 다운로드할 수 있습니다.

## 자산 가져오기

### 기본 사용법

```bash
mplx core fetch asset <assetId>
```

### 다운로드 옵션

```bash
mplx core fetch asset <assetId> --download --output ./assets
mplx core fetch asset <assetId> --download --image
mplx core fetch asset <assetId> --download --metadata
```

### 자산 가져오기 옵션

- `--download`: 자산 파일을 디스크에 다운로드 (추가 플래그로 개별 파일 선택 가능)
- `--output <path>`: 다운로드한 자산을 저장할 디렉토리 경로 (--download 필요)
- `--image`: 이미지 파일 다운로드 (--download 필요)
- `--metadata`: 메타데이터 파일 다운로드 (--download 필요)
- `--asset`: 자산 데이터 파일 다운로드 (--download 필요)

## 컬렉션 가져오기

### 기본 사용법

```bash
mplx core fetch collection <collectionId>
```

### 다운로드 옵션

```bash
mplx core fetch collection <collectionId> --output ./collections
```

### 컬렉션 가져오기 옵션

- `-o, --output <path>`: 다운로드한 컬렉션 파일의 출력 디렉토리. 지정하지 않으면 현재 폴더가 사용됩니다.

## 예시

### 자산 가져오기 예시

1. 단일 자산 가져오기:

```bash
mplx core fetch asset 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa
```

1. 자산 파일을 특정 디렉토리에 다운로드:

```bash
mplx core fetch asset 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --download --output ./assets
```

1. 이미지만 다운로드:

```bash
mplx core fetch asset 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --download --image
```

### 컬렉션 가져오기 예시

1. 컬렉션 가져오기:

```bash
mplx core fetch collection HaKyubAWuTS9AZkpUHtFkTKAHs1KKAJ3onZPmaP9zBpe
```

1. 컬렉션 파일을 특정 디렉토리에 다운로드:

```bash
mplx core fetch collection HaKyubAWuTS9AZkpUHtFkTKAHs1KKAJ3onZPmaP9zBpe --output ./collections
```

## 출력

### 자산 가져오기 출력

파일을 다운로드할 때 다음 구조가 생성됩니다:

```
<output_directory>/
  <assetId>/
    metadata.json
    image.<extension>
    asset.json
```

### 컬렉션 가져오기 출력

파일을 다운로드할 때 다음 구조가 생성됩니다:

```
<output_directory>/
  <collectionId>/
    metadata.json
    image.<extension>
    collection.json
```

## 참고사항

- 가져오기 명령어는 파일 유형을 자동으로 감지하고 적절한 확장자를 사용합니다
- 컬렉션에 대해 출력 디렉토리를 지정하지 않으면 현재 디렉토리에 파일이 저장됩니다
- 메타데이터 JSON 파일은 가독성을 위해 예쁘게 인쇄됩니다
- 이미지 파일은 원래 형식과 품질을 유지합니다
- 명령어는 존재하지 않는 경우 필요한 디렉토리를 생성합니다
- 컬렉션의 경우 메타데이터와 이미지 파일이 함께 다운로드됩니다
- 자산의 경우 특정 구성 요소(이미지, 메타데이터 또는 자산 데이터)를 선택하여 다운로드할 수 있습니다
