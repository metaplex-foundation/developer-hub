---
title: "캔디 머신 생성"
metaTitle: "MPLX CLI - 캔디 머신 생성 명령어"
description: "MPLX CLI를 사용하여 MPL Core 캔디 머신을 생성합니다. 검증, 자산 업로드 및 완전한 설정 자동화를 갖춘 대화형 마법사 모드."
---

`mplx cm create` 명령어는 구성 가능한 설정과 자산 업로드를 통해 새로운 MPL Core 캔디 머신을 생성합니다. 초보자를 위한 대화형 마법사와 고급 사용자를 위한 수동 구성을 모두 제공합니다.

## 사용법

```bash
# 대화형 마법사 (권장)
mplx cm create --wizard

# 디렉토리 템플릿 생성
mplx cm create --template

# 수동 생성 (기존 cm-config.json 필요)
mplx cm create
```

## 전제 조건 자산

선택한 모드(마법사 또는 수동)와 관계없이 자산을 준비해야 합니다. 더미 자산으로 실험하고 싶다면 `mplx cm create --template`를 사용하여 생성할 수 있습니다. 모든 이미지 및 메타데이터 파일은 별도의 `assets` 폴더에 있어야 합니다.

*이미지 파일:*

- **형식**: PNG, JPG
- **이름 지정**: 순차적 (0.png, 1.png, 2.png, ...)

*메타데이터 파일:*

- **형식**: JSON
- **이름 지정**: 이미지 파일과 일치 (0.json, 1.json, 2.json, ...)
- **스키마**: 표준 [Metaplex Core 메타데이터 형식](/ko/smart-contracts/core/json-schema)

*컬렉션 파일:*

- **collection.png**: 컬렉션 이미지
- **collection.json**: 컬렉션 메타데이터

## 템플릿 모드

시작하기 위한 기본 디렉토리 구조를 생성합니다:

```bash
mplx cm create --template
```

이것은 다음 구조를 생성하지만 캔디 머신은 생성하지 않습니다.

```text
candy-machine-template/
├── assets/
│   ├── 0.png              # 예제 이미지
│   ├── 0.json             # 예제 메타데이터
│   ├── collection.png     # 예제 컬렉션 이미지
│   └── collection.json    # 예제 컬렉션 메타데이터
└── cm-config.json         # 예제 구성
```

템플릿 생성 후:

1. 예제 자산을 실제 파일로 교체
2. `cm-config.json`에서 구성 업데이트
3. `mplx cm create`를 실행하여 배포

## 대화형 마법사 모드

마법사는 포괄적인 검증과 진행 상황 추적을 통해 안내되는 사용자 친화적인 경험을 제공합니다. **이것은 대부분의 사용자에게 권장되는 접근 방식입니다.**

### 마법사 워크플로우

1. 프로젝트 설정
2. 자산 검색 및 검증
3. 컬렉션 구성
4. 캔디 머신 및 캔디 가드 설정
5. 자산 업로드 및 처리
6. 캔디 머신 생성
7. 아이템 삽입

## 수동 구성 모드

구성 프로세스를 완전히 제어하고자 하는 고급 사용자를 위한 것입니다.

### 전제 조건

1. 적절한 구조를 가진 **캔디 머신 자산 디렉토리**
2. 필수 구성이 포함된 **수동으로 생성된 `cm-config.json`**. 아래 예제 참조
3. 아래와 같은 구조의 `assets/` 디렉토리에 **준비된 자산**

### 디렉토리 구조

```text
my-candy-machine/
├── assets/
│   ├── 0.png
│   ├── 0.json
│   ├── 1.png
│   ├── 1.json
│   ├── ...
│   ├── collection.png
│   └── collection.json
└── cm-config.json          # 필수
```

### 구성 파일 형식

이 구조로 `cm-config.json`을 생성합니다:

```json
{
  "name": "My Candy Machine",
  "config": {
    "collection": "CollectionPublicKey...",  // 기존 컬렉션
    "itemsAvailable": 100,
    "isMutable": true,
    "isSequential": false,
    "guardConfig": {
      "solPayment": {
        "lamports": 1000000000,
        "destination": "111111111111111111111111111111111"
      },
      "mintLimit": {
        "id": 1,
        "limit": 1
      }
    },
    "groups": [
      {
        "label": "wl",
        "guards": {
          "allowList": {
            "merkleRoot": "MerkleRootHash..."
          },
          "solPayment": {
            "lamports": 500000000,
            "destination": "111111111111111111111111111111111"
          }
        }
      }
    ]
  }
}
```

### 수동 워크플로우

```bash
# 1. 캔디 머신 디렉토리로 이동
cd ./my-candy-machine

# 2. 기존 구성을 사용하여 캔디 머신 생성
mplx cm create

# 3. 스토리지에 자산 업로드
mplx cm upload

# 4. 캔디 머신에 아이템 삽입
mplx cm insert

# 5. 설정 검증 (선택사항)
mplx cm validate
```

## 구성 옵션

### 핵심 설정

| 설정 | 설명 | 필수 |
|---------|-------------|----------|
| `name` | 캔디 머신의 표시 이름 | ✅ |
| `itemsAvailable` | 민팅할 총 아이템 수 | ✅ |
| `isMutable` | 민팅 후 NFT를 업데이트할 수 있는지 여부 | ✅ |
| `isSequential` | 아이템을 순서대로 민팅할지 여부 | ✅ |
| `collection` | 기존 컬렉션 주소 (선택사항) | ❌ |

### 가드 구성

**글로벌 가드** (`guardConfig`):

- 모든 그룹과 캔디 머신 전체에 적용
- 그룹 가드로 재정의할 수 없음
- 범용 제한에 유용

**가드 그룹** (`groups`):

- 특정 그룹에만 적용
- 민팅 단계별로 다른 규칙 허용
- 그룹 레이블은 최대 6자로 제한

### 일반적인 가드 예제

#### 기본 퍼블릭 세일

```json
{
  "guardConfig": {
    "solPayment": {
      "lamports": 1000000000,
      "destination": "YourWalletAddress..."
    },
    "mintLimit": {
      "id": 1,
      "limit": 1
    }
  }
}
```

#### 화이트리스트 단계

```json
{
  "groups": [
    {
      "label": "wl",
      "guards": {
        "allowList": {
          "merkleRoot": "MerkleRootHash..."
        },
        "solPayment": {
          "lamports": 500000000,
          "destination": "YourWalletAddress..."
        }
      }
    }
  ]
}
```

### 도움말 받기

- 명령 옵션은 `mplx cm create --help` 사용
- 지원은 [Metaplex Discord](https://discord.gg/metaplex) 참여

## 관련 명령어

- [`mplx cm upload`](/ko/dev-tools/cli/cm/upload) - 스토리지에 자산 업로드
- [`mplx cm insert`](/ko/dev-tools/cli/cm/insert) - 캔디 머신에 아이템 삽입
- [`mplx cm validate`](/ko/dev-tools/cli/cm/validate) - 자산 캐시 검증
- [`mplx cm fetch`](/ko/dev-tools/cli/cm/fetch) - 캔디 머신 정보 보기

## 다음 단계

1. 수동으로 생성한 경우 **[자산 업로드](/ko/dev-tools/cli/cm/upload)**
2. 캔디 머신에 자산을 로드하기 위해 **[아이템 삽입](/ko/dev-tools/cli/cm/insert)**
3. 모든 것이 작동하는지 확인하기 위해 **[설정 검증](/ko/dev-tools/cli/cm/validate)**
4. 고급 구성을 위해 **[가드에 대해 배우기](/ko/smart-contracts/core-candy-machine/guards)**
