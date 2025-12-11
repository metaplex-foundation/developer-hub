---
title: "정보 가져오기"
metaTitle: "MPLX CLI - 캔디 머신 정보 가져오기"
description: "MPLX CLI를 사용하여 MPL Core 캔디 머신 정보를 가져오고 표시합니다. 구성, 가드 설정, 아이템 상태 및 배포 세부 정보 보기."
---

`mplx cm fetch` 명령어는 구성, 가드 설정, 아이템 상태 및 배포 세부 정보를 포함한 캔디 머신에 대한 포괄적인 정보를 검색하고 표시합니다. 이 명령은 캔디 머신 설정을 모니터링하고 검증하는 데 필수적입니다.

## 사용법

```bash
# 현재 캔디 머신 디렉토리에서 정보 가져오기
mplx cm fetch

# 주소로 특정 캔디 머신 가져오기
mplx cm fetch <candy_machine_address>

```

fetch 명령어는 자세한 정보를 위한 추가 플래그를 지원합니다:

- `--items`: 로드된 아이템에 대한 자세한 정보 포함

## 관련 명령어

- [`mplx cm create`](/ko/cli/cm/create) - 가져올 캔디 머신 생성
- [`mplx cm insert`](/ko/cli/cm/insert) - 아이템 로드 (아이템 수에 영향)
- [`mplx cm validate`](/ko/cli/cm/validate) - 캐시와 온체인 데이터 검증
- [`mplx cm withdraw`](/ko/cli/cm/withdraw) - 상태 확인 후 정리
