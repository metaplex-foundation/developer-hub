---
title: "자산 업로드"
metaTitle: "MPLX CLI - 자산 업로드 명령어"
description: "MPLX CLI를 사용하여 캔디 머신 자산을 분산 스토리지에 업로드합니다. 지능형 캐싱, 진행 상황 추적 및 포괄적인 검증."
---

`mplx cm upload` 명령어는 자산을 분산 스토리지에 업로드하고 업로드 URI 및 메타데이터를 포함하는 `asset-cache.json` 파일을 생성합니다. 이 명령은 지능형 캐싱, 진행 상황 추적 및 포괄적인 검증을 제공합니다.

## 사용법

```bash
# 현재 캔디 머신 디렉토리에서 자산 업로드
mplx cm upload

# 특정 캔디 머신 디렉토리에서 자산 업로드
mplx cm upload <directory>
```

### 디렉토리 구조

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
└── asset-cache.json        # 업로드 후 생성됨
```

## 업로드 프로세스

1. 자산 검색: 명령이 자동으로 `assets/` 디렉토리를 스캔하여 이미지, 메타데이터 및 컬렉션 파일을 식별합니다.
2. 검증 단계: 파일의 무결성을 확인합니다. 예를 들어 모든 이미지 파일에 일치하는 메타데이터 파일이 있고 메타데이터가 유효한 json인지 확인합니다.
3. 캐시 확인: 이미 업로드된 파일을 식별하기 위해 `asset-cache.json` 파일을 검증합니다.
4. 업로드: 실제 업로드가 수행됩니다.
5. 캐시 생성: `asset-cache.json` 파일이 생성됩니다

## 생성된 자산 캐시

`asset-cache.json` 파일에는 업로드된 자산에 대한 자세한 정보가 포함되어 있습니다. 수동으로 검사하고 사용하는 것은 고급 사용자에게만 권장됩니다.

예제:

```json
{
  "candyMachineId": null,
  "collection": null,
  "assetItems": {
    "0": {
      "name": "Asset #0",
      "image": "0.png",
      "imageUri": "https://gateway.irys.xyz/ABC123...",
      "imageType": "image/png",
      "json": "0.json",
      "jsonUri": "https://gateway.irys.xyz/DEF456...",
      "loaded": false
    },
    "1": {
      "name": "Asset #1",
      "image": "1.png",
      "imageUri": "https://gateway.irys.xyz/GHI789...",
      "imageType": "image/png",
      "json": "1.json",
      "jsonUri": "https://gateway.irys.xyz/JKL012...",
      "loaded": false
    }
  }
}
```

## 관련 명령어

- [`mplx cm create`](/ko/cli/cm/create) - 캔디 머신 생성 (자동으로 업로드 가능)
- [`mplx cm validate`](/ko/cli/cm/validate) - 업로드된 자산 검증
- [`mplx cm insert`](/ko/cli/cm/insert) - 업로드된 자산을 캔디 머신에 삽입
- [`mplx cm fetch`](/ko/cli/cm/fetch) - 캔디 머신 및 자산 정보 보기

## 다음 단계

1. 모든 것이 올바르게 업로드되었는지 확인하기 위해 **[업로드 검증](/ko/cli/cm/validate)**
2. 업로드된 자산을 사용하여 **[캔디 머신 생성](/ko/cli/cm/create)**
3. 캔디 머신에 자산을 로드하기 위해 **[아이템 삽입](/ko/cli/cm/insert)**
4. 모든 것이 작동하는지 확인하기 위해 **[설정 모니터링](/ko/cli/cm/fetch)**
