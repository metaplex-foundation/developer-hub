---
title: "캔디 머신 명령어"
metaTitle: "MPLX CLI - 캔디 머신 명령어"
description: "MPLX CLI를 사용하여 MPL Core 캔디 머신을 생성하고 관리합니다. 대화형 마법사, 자산 업로드, 완전한 캔디 머신 라이프사이클 관리."
---

MPLX CLI는 Solana에서 **MPL Core 캔디 머신**을 생성하고 관리하기 위한 포괄적인 지원을 제공합니다. 이러한 명령을 사용하면 구성 가능한 민팅 규칙을 가진 NFT 컬렉션을 생성하고, 자산을 업로드하며, 직관적인 명령줄 인터페이스를 통해 전체 캔디 머신 라이프사이클을 관리할 수 있습니다.

## 빠른 시작

대화형 마법사로 빠르게 시작하세요:

```bash
mplx cm create --wizard
```

이 단일 명령으로 캔디 머신을 생성하는 모든 것을 처리합니다: 자산 검증, 업로드, 가드 구성을 포함한 캔디 머신 생성, 진행 상황 추적을 통한 아이템 삽입.

## 명령 개요

| 명령어 | 목적 | 주요 기능 |
|---------|---------|--------------|
| [`create`](/ko/cli/cm/create) | 새 캔디 머신 생성 | 대화형 마법사, 템플릿 생성, 수동 구성 |
| [`upload`](/ko/cli/cm/upload) | 스토리지에 자산 업로드 | 지능형 캐싱, 진행 상황 추적, 검증 |
| [`insert`](/ko/cli/cm/insert) | 캔디 머신에 아이템 삽입 | 스마트 로딩 감지, 배치 처리 |
| [`validate`](/ko/cli/cm/validate) | 자산 캐시 검증 | 포괄적인 검증, 오류 보고 |
| [`fetch`](/ko/cli/cm/fetch) | 캔디 머신 정보 가져오기 | 구성, 가드 설정, 상태 표시 |
| [`withdraw`](/ko/cli/cm/withdraw) | 인출 및 삭제 | 깔끔한 인출, 잔액 회복 |

## 주요 기능

### 대화형 마법사

- **안내식 설정**: 단계별 캔디 머신 생성
- **자산 검증**: 포괄적인 파일 및 메타데이터 검증
- **진행 상황 추적**: 모든 작업에 대한 실시간 표시기
- **오류 복구**: 실행 가능한 안내가 포함된 상세한 오류 메시지

### 지능형 자산 관리

- **스마트 캐싱**: 가능한 경우 기존 업로드 재사용
- **배치 처리**: 효율적인 자산 업로드 및 삽입
- **파일 검증**: 적절한 이름 지정 및 메타데이터 형식 보장
- **컬렉션 지원**: 자동 컬렉션 생성

### 유연한 구성

- **가드 지원**: 모든 Core Candy Machine 가드 지원
- **가드 그룹**: 서로 다른 규칙을 가진 다양한 민팅 단계 생성
- **템플릿 생성**: 빠른 디렉토리 구조 설정
- **수동 구성**: 고급 사용자는 사용자 정의 구성 생성 가능

## 디렉토리 구조

모든 캔디 머신 명령은 다음 구조를 가진 **캔디 머신 자산 디렉토리**에서 작동합니다:

```text
my-candy-machine/
├── assets/
│   ├── 0.png              # 이미지 파일 (PNG, JPG)
│   ├── 0.json             # 메타데이터 파일
│   ├── 1.png
│   ├── 1.json
│   ├── ...
│   ├── collection.png      # 컬렉션 이미지
│   └── collection.json     # 컬렉션 메타데이터
├── asset-cache.json        # 자산 업로드 캐시 (생성됨)
└── cm-config.json          # 캔디 머신 구성 (마법사 사용 시 생성됨)
```

## 워크플로우 옵션

### 옵션 1: 마법사 모드 (권장)

초보자와 대부분의 사용 사례에 완벽:

```bash
mplx cm create --wizard
```

**수행 작업:**

1. 자산 및 구성 검증
2. 진행 상황 추적을 통해 모든 자산 업로드
3. 온체인에서 캔디 머신 생성
4. 트랜잭션 진행 상황과 함께 모든 아이템 삽입
5. 포괄적인 완료 요약 제공

### 옵션 2: 수동 모드 (고급)

완전한 제어를 원하는 고급 사용자를 위해:

```bash
# 1. 수동으로 디렉토리 및 구성 설정
mkdir my-candy-machine && cd my-candy-machine
# (assets/ 디렉토리를 생성하고 자산 추가)

# 2. 자산 업로드
mplx cm upload

# 3. 캔디 머신 생성
mplx cm create

# 4. 아이템 삽입
mplx cm insert

# 5. 검증 (선택사항)
mplx cm validate
```

## 가드 구성

CLI는 모든 Core Candy Machine 가드 및 가드 그룹을 지원합니다:

### 글로벌 가드

```json
{
  "guardConfig": {
    "solPayment": {
      "lamports": 1000000000,
      "destination": "111111111111111111111111111111111"
    },
    "mintLimit": {
      "id": 1,
      "limit": 1
    }
  }
}
```

### 가드 그룹 (민팅 단계)

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
          "destination": "111111111111111111111111111111111"
        }
      }
    },
    {
      "label": "public",
      "guards": {
        "solPayment": {
          "lamports": 1000000000,
          "destination": "111111111111111111111111111111111"
        }
      }
    }
  ]
}
```

## 사용 가능한 가드

CLI는 모든 Core Candy Machine 가드를 지원합니다:

**결제 가드**: `solPayment`, `solFixedFee`, `tokenPayment`, `token2022Payment`, `nftPayment`, `assetPayment`, `assetPaymentMulti`

**액세스 제어**: `addressGate`, `allowList`, `nftGate`, `tokenGate`, `assetGate`, `programGate`, `thirdPartySigner`

**시간 기반**: `startDate`, `endDate`

**제한**: `mintLimit`, `allocation`, `nftMintLimit`, `assetMintLimit`, `redeemedAmount`

**소각 가드**: `nftBurn`, `tokenBurn`, `assetBurn`, `assetBurnMulti`

**특수**: `botTax`, `edition`, `vanityMint`

**동결 가드**: `freezeSolPayment`, `freezeTokenPayment`

자세한 가드 문서는 [Core Candy Machine 가드](/ko/core-candy-machine/guards) 참조를 확인하세요.

## 모범 사례

### 🎯 디렉토리 구성

- 각 캔디 머신을 별도의 디렉토리에 보관
- 설명적인 디렉토리 이름 사용
- 일관된 자산 이름 지정 유지 (0.png, 1.png 등)
- 캔디 머신 디렉토리 백업

### 📁 자산 준비

- 일관된 이름 지정 사용 (0.png, 1.png 등)
- 메타데이터 JSON 파일이 이미지 파일과 일치하는지 확인
- 이미지 형식 검증 (PNG, JPG 지원)
- 파일 크기를 적절하게 유지 (< 10MB 권장)
- 유효한 "name" 필드가 있는 collection.json 포함

### ⚙️ 구성

- 메인넷 전에 데브넷에서 테스트
- 안내식 구성을 위해 마법사 사용
- 구성 파일 백업
- 가드 설정 문서화
- 최소한 하나의 가드 또는 가드 그룹 추가 고려

### 🚀 배포

- 캔디 머신 생성 확인
- 민팅 기능 테스트
- 트랜잭션 상태 모니터링
- 검증을 위한 탐색기 링크 보관

## 관련 문서

- [Core Candy Machine 개요](/ko/core-candy-machine) - MPL Core 캔디 머신 이해
- [Core Candy Machine 가드](/ko/core-candy-machine/guards) - 완전한 가드 참조
- [CLI 설치](/ko/cli/installation) - MPLX CLI 설정
- [CLI 구성](/ko/cli/config/wallets) - 지갑 및 RPC 설정

## 다음 단계

1. 아직 설치하지 않았다면 **[CLI 설치](/ko/cli/installation)**
2. 마법사를 사용하여 **[첫 번째 캔디 머신 생성](/ko/cli/cm/create)**
3. 고급 민팅 규칙을 위한 **[가드 구성 탐색](/ko/core-candy-machine/guards)**
4. 단계별 출시를 위한 **[가드 그룹에 대해 배우기](/ko/core-candy-machine/guard-groups)**
