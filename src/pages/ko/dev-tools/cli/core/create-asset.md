---
title: 자산 생성
metaTitle: 자산 생성 | Metaplex CLI
description: 다양한 방법을 사용하여 MPL Core 자산 생성
---

`mplx core asset create` 명령어를 사용하면 세 가지 다른 방법으로 MPL Core 자산을 생성할 수 있습니다: 간단한 생성, 파일 기반 생성 또는 대화형 마법사. 이 명령어는 일관된 출력 형식을 유지하면서 자산을 생성하는 방법의 유연성을 제공합니다.

## 방법

### 1. 간단한 생성
명령줄 인수를 통해 메타데이터의 이름과 URI를 직접 제공하여 단일 자산을 생성합니다.

```bash
mplx core asset create --name "My NFT" --uri "https://example.com/metadata.json"
```

### 2. 파일 기반 생성
이미지 파일과 JSON 메타데이터 파일을 제공하여 단일 자산을 생성합니다. 명령어가 두 파일 업로드 및 자산 생성을 처리합니다.

```bash
mplx core asset create --files --image "./my-nft.png" --json "./metadata.json"
```

### 3. 대화형 마법사
파일 업로드 및 메타데이터 생성을 포함한 전체 프로세스를 안내하는 대화형 마법사를 사용하여 자산을 생성합니다.

```bash
mplx core asset create --wizard
```

## 옵션

### 기본 옵션
- `--name <string>`: 자산 이름 (간단한 생성에 필수)
- `--uri <string>`: 자산 메타데이터의 URI (간단한 생성에 필수)
- `--collection <string>`: 자산의 컬렉션 ID

### 파일 기반 옵션
- `--files`: 파일 기반 생성을 나타내는 플래그
- `--image <path>`: 업로드하고 자산에 할당할 이미지 파일 경로
- `--json <path>`: JSON 메타데이터 파일 경로

### 플러그인 옵션
- `--plugins`: 대화형 플러그인 선택 사용
- `--pluginsFile <path>`: 플러그인 데이터가 포함된 JSON 파일 경로

## 예시

1. 대화형 마법사를 사용하여 자산 생성:
```bash
mplx core asset create --wizard
```

2. 이름과 URI로 자산 생성:
```bash
mplx core asset create --name "My NFT" --uri "https://example.com/metadata.json"
```

3. 파일에서 자산 생성:
```bash
mplx core asset create --files --image "./my-nft.png" --json "./metadata.json"
```

4. 컬렉션과 함께 자산 생성:
```bash
mplx core asset create --name "My NFT" --uri "https://example.com/metadata.json" --collection "collection_id_here"
```

5. 파일과 컬렉션으로 자산 생성:
```bash
mplx core asset create --files --image "./my-nft.png" --json "./metadata.json" --collection "collection_id_here"
```

## 출력

명령어는 성공적으로 생성되면 다음 정보를 출력합니다:
```
--------------------------------
  Asset: <asset_address>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
  Core Explorer: https://core.metaplex.com/explorer/<asset_address>
--------------------------------
```
