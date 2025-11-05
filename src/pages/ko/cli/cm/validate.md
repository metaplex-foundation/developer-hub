---
title: "캐시 검증"
metaTitle: "MPLX CLI - 캐시 검증 명령어"
description: "MPLX CLI를 사용하여 캔디 머신 자산 캐시 및 업로드를 검증합니다. 포괄적인 검증, 오류 감지 및 캐시 무결성 확인."
---

`mplx cm validate` 명령어는 모든 자산이 올바르게 업로드되고 액세스 가능한지 확인하기 위해 자산 캐시 파일을 검증합니다. 포괄적인 검증, 오류 감지 및 캐시 무결성 확인을 제공합니다.

## 사용법

```bash
# 현재 캔디 머신 디렉토리에서 캐시 검증
mplx cm validate

# 특정 캐시 파일 검증
mplx cm validate <path_to_asset_cache>

# 온체인 삽입 검증 (캔디 머신이 존재해야 함)
mplx cm validate --onchain
```

검증 명령이 문제를 표시하면 오류에 따라 자산 문제를 확인하거나 upload 또는 insert 명령을 실행하는 것이 좋습니다.

## 관련 명령어

- [`mplx cm upload`](/ko/cli/cm/upload) - 자산 업로드 및 캐시 생성
- [`mplx cm create`](/ko/cli/cm/create) - 캔디 머신 생성
- [`mplx cm insert`](/ko/cli/cm/insert) - 검증된 자산 삽입
- [`mplx cm fetch`](/ko/cli/cm/fetch) - 캔디 머신 상태 확인

## 다음 단계

1. 검증 중 발견된 **[문제 수정](/ko/cli/cm/upload)**
2. 캐시가 유효한 경우 **[캔디 머신 생성](/ko/cli/cm/create)**
3. 자산을 로드하기 위해 **[아이템 삽입](/ko/cli/cm/insert)**
4. 성공을 확인하기 위해 **[배포 모니터링](/ko/cli/cm/fetch)**
