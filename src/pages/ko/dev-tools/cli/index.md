---
title: 소개
metaTitle: 소개 | Metaplex CLI
description: Metaplex CLI에 오신 것을 환영합니다
---

# Metaplex CLI

Metaplex CLI는 Solana에서 Metaplex 프로토콜과 상호작용하기 위한 포괄적인 유틸리티 모음을 제공하는 강력한 명령줄 도구입니다. NFT 애플리케이션을 구축하는 개발자이든 디지털 자산을 관리하는 창작자이든, CLI는 워크플로우를 간소화하는 강력한 기능 세트를 제공합니다.

## 주요 기능

### 핵심 기능

- MPL Core 자산 및 컬렉션 생성 및 관리
- 자산 메타데이터 업로드 및 업데이트
- 자산 및 컬렉션 정보 가져오기
- 자산 속성 및 특성 관리

### 도구상자 유틸리티

- 대체 가능한 토큰 생성 및 관리
- 주소 간 SOL 전송
- SOL 잔액 확인
- 테스트 목적의 SOL 에어드롭

### 구성 관리

- 여러 지갑 관리
- RPC 엔드포인트 구성
- 선호하는 블록체인 탐색기 설정
- CLI 동작 사용자 정의

## CLI를 사용해야 하는 이유

1. **개발자 친화적**: 개발자를 염두에 두고 구축되어 간단한 명령과 고급 옵션을 모두 제공
2. **대화형 모드**: 복잡한 작업을 위한 사용자 친화적인 마법사
3. **유연한 구성**: 여러 지갑과 RPC 엔드포인트로 환경을 사용자 정의
4. **포괄적인 도구**: NFT 및 토큰 관리에 필요한 모든 것을 한 곳에서 제공
5. **크로스 플랫폼**: Windows, macOS, Linux에서 작동

## 시작하기

1. [CLI 설치](/ko/dev-tools/cli/installation)
2. 환경 구성:
   - [지갑 설정](/ko/dev-tools/cli/config/wallets)
   - [RPC 엔드포인트 구성](/ko/dev-tools/cli/config/rpcs)
   - [선호하는 탐색기 선택](/ko/dev-tools/cli/config/explorer)
3. 핵심 명령 사용 시작:
   - [자산 생성](/ko/dev-tools/cli/core/create-asset)
   - [컬렉션 생성](/ko/dev-tools/cli/core/create-collection)
   - [자산 업데이트](/ko/dev-tools/cli/core/update-asset)
   - [자산 가져오기](/ko/dev-tools/cli/core/fetch)

## 명령 구조

CLI는 계층적 명령 구조를 따릅니다:

```bash
mplx <category> <command> [options]
```

카테고리에는 다음이 포함됩니다:

- `core`: MPL Core 자산 관리
- `toolbox`: 유틸리티 명령
- `config`: 구성 관리

## 모범 사례

1. **구성 사용**: 더 원활한 경험을 위해 지갑과 RPC 엔드포인트를 설정
2. **대화형 모드**: 안내식 작업을 위해 `--wizard` 플래그 사용
3. **잔액 확인**: 트랜잭션 전에 항상 SOL 잔액 확인
4. **먼저 테스트**: 메인넷 배포 전에 데브넷 사용
5. **백업**: 지갑 파일과 구성을 안전하게 보관

## 지원 및 리소스

- [GitHub 저장소](https://github.com/metaplex-foundation/cli)
- [문서](https://developers.metaplex.com)
- [Discord 커뮤니티](https://discord.gg/metaplex)

## 다음 단계

시작할 준비가 되셨나요? [설치 가이드](/ko/dev-tools/cli/installation)로 이동하여 시스템에 CLI를 설정하세요.
