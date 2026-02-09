---
title: 플러그인
metaTitle: 플러그인 | Metaplex CLI
description: MPL Core 자산 및 컬렉션 플러그인 관리
---

`mplx core plugins` 명령어를 사용하면 MPL Core 자산과 컬렉션의 플러그인을 관리할 수 있습니다. 플러그인은 추가 기능과 역량으로 자산과 컬렉션의 기능을 확장합니다.

## 플러그인 추가

자산 또는 컬렉션에 플러그인을 추가합니다.

### 기본 사용법

```bash
mplx core plugins add <assetId> [options]
```

### 옵션
- `--wizard`: 플러그인 선택 및 구성을 위한 대화형 마법사 모드
- `--collection`: 대상이 컬렉션임을 나타내는 플래그 (기본값: false)

### 방법

#### 1. 마법사 모드 사용
```bash
mplx core plugins add <assetId> --wizard
```
다음과 같은 작업을 수행합니다:
1. 플러그인 유형을 선택하는 대화형 마법사 실행
2. 플러그인 구성 안내
3. 구성된 플러그인을 자산/컬렉션에 추가

#### 2. JSON 파일 사용
```bash
mplx core plugins add <assetId> ./plugin.json
```
JSON 파일은 다음 형식의 플러그인 구성을 포함해야 합니다:
```json
{
  "pluginType": {
    "property1": "value1",
    "property2": "value2"
  }
}
```

### 예시

#### 자산에 플러그인 추가
```bash
mplx core plugins add 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --wizard
```

#### 컬렉션에 플러그인 추가
```bash
mplx core plugins add 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa --wizard --collection
```

#### JSON을 사용하여 플러그인 추가
```bash
mplx core plugins add 5avjMVza8SuMhgTfzEGNWJskDELMCQk9juAAc8zeQoNa ./my-plugin.json
```

## 출력

플러그인 추가가 성공하면 명령어가 다음을 표시합니다:
```
--------------------------------
  Asset: <assetId>
  Signature: <transactionSignature>
  Explorer: <explorerUrl>
  Core Explorer: https://core.metaplex.com/explorer/<assetId>
--------------------------------
```

## 참고사항

- 마법사 모드는 플러그인을 선택하고 구성하는 대화형 방법을 제공합니다
- 자산과 컬렉션에 대해 다양한 플러그인을 사용할 수 있습니다
- 플러그인 구성은 플러그인 요구 사항에 따라 유효해야 합니다
- 자산이나 컬렉션에 플러그인을 추가하려면 적절한 권한이 있어야 합니다
- 명령어는 다음을 자동으로 처리합니다:
  - 플러그인 유형 검증
  - 구성 검증
  - 거래 서명 및 확인
  - 권한 확인
