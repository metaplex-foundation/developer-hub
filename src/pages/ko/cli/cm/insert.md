---
title: "아이템 삽입"
metaTitle: "MPLX CLI - 아이템 삽입 명령어"
description: "MPLX CLI를 사용하여 업로드된 자산을 MPL Core 캔디 머신에 삽입합니다."
---

`mplx cm insert` 명령어는 캐시 파일에서 업로드된 자산을 온체인 캔디 머신에 삽입하여 민팅에 사용할 수 있도록 합니다. 스마트 로딩 감지, 효율적인 배치 처리 및 상세한 트랜잭션 추적 기능이 있습니다.

## 사용법

```bash
# 현재 캔디 머신 디렉토리에서 아이템 삽입
mplx cm insert

# 특정 캔디 머신 디렉토리에서 아이템 삽입
mplx cm insert <directory>
```

## 요구 사항

insert 명령을 실행하기 전에 다음이 있는지 확인하세요:

1. **자산 캐시**: 업로드된 URI가 포함된 유효한 `asset-cache.json`
2. **캔디 머신**: 캐시에 ID가 있는 생성된 캔디 머신
3. **지갑 잔액**: 트랜잭션 수수료를 위한 충분한 SOL
4. **네트워크 액세스**: Solana 네트워크에 대한 안정적인 연결

### 전제 조건

```bash
# 1. 캔디 머신이 생성되어 있어야 합니다
mplx cm create

# 2. 자산 업로드
mplx cm upload

# 3. 그런 다음 아이템 삽입
mplx cm insert
```

## 관련 명령어

- [`mplx cm upload`](/ko/cli/cm/upload) - 자산 업로드 (삽입 전 필요)
- [`mplx cm create`](/ko/cli/cm/create) - 캔디 머신 생성 (삽입 전 필요)
- [`mplx cm validate`](/ko/cli/cm/validate) - 캐시 및 업로드 검증
- [`mplx cm fetch`](/ko/cli/cm/fetch) - 삽입 상태 확인

## 다음 단계

1. 모든 아이템이 로드되었는지 확인하기 위해 **[삽입 확인](/ko/cli/cm/fetch)**
2. 캔디 머신이 작동하는지 확인하기 위해 **[민팅 테스트](/ko/core-candy-machine/mint)**
3. 문제를 확인하기 위해 **[캐시 및 자산 검증](/ko/cli/cm/validate)**
4. 적절한 가드로 **[출시 계획](/ko/core-candy-machine/guides)**
