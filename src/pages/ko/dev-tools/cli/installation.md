---
title: 설치
metaTitle: 설치 | Metaplex CLI
description: Metaplex CLI 설치 및 설정
---

# 설치 가이드

이 가이드는 시스템에 Metaplex CLI를 설치하고 설정하는 방법을 안내합니다.

## 사전 요구사항

CLI를 설치하기 전에 다음을 확인하세요:

- Node.js 16.x 이상
- npm 7.x 이상
- Solana 지갑 (선택사항, 권장)
- Git (선택사항, 개발용)

## 설치 방법

### npm 사용 (권장)

```bash
npm install -g @metaplex-foundation/cli
```

### yarn 사용

```bash
yarn global add @metaplex-foundation/cli
```

### pnpm 사용

```bash
pnpm add -g @metaplex-foundation/cli
```

## 설치 확인

설치 후 CLI가 올바르게 설치되었는지 확인:

```bash
mplx --version
```

현재 CLI 버전이 표시되어야 합니다.

## 초기 설정

### 1. 구성 디렉토리 생성

CLI는 처음 구성 설정을 할 때 `~/.config/mplx`에 구성 파일을 자동으로 생성합니다. 이 구성은 다음을 저장합니다:
- 지갑 구성
- RPC 엔드포인트 설정
- 탐색기 기본 설정
- 기타 CLI 설정

### 2. 환경 구성

#### 지갑 설정
```bash
# 새 지갑 생성
mplx config wallets new --name dev1

# 또는 기존 지갑 추가
mplx config wallets add <name> <path>
mplx config wallets add dev1 /path/to/keypair.json

# 지갑을 추가한 후 설정해야 합니다
mplx config wallets set
```

추가 정보는 참조

#### RPC 엔드포인트 구성
```bash
mplx config set rpcUrl  https://api.mainnet-beta.solana.com
```

#### 선호하는 탐색기 설정
```bash
mplx config explorer set
```

## 개발 설치

CLI에 기여하거나 소스에서 실행하려면:

1. 저장소 복제:
```bash
git clone https://github.com/metaplex-foundation/cli.git
cd cli
```

2. 종속성 설치:
```bash
npm install
```

3. 프로젝트 빌드:
```bash
npm run build
```

4. CLI 연결:
```bash
npm link
```

## 문제 해결

### 일반적인 문제

1. **명령을 찾을 수 없음**
   - 전역 npm bin 디렉토리가 PATH에 있는지 확인
   - 패키지 재설치 시도

2. **권한 오류**
   - Unix 기반 시스템에서 전역 설치 시 `sudo` 사용
   - 또는 sudo 없이 전역 패키지를 설치하도록 npm 구성

3. **Node 버전 문제**
   - nvm을 사용하여 Node.js 버전 관리
   - 호환되는 Node.js 버전을 사용하는지 확인

### 도움말

문제가 발생한 경우:

1. [문서](https://developers.metaplex.com) 확인
2. [GitHub 이슈](https://github.com/metaplex-foundation/cli/issues) 검색
3. [Discord 커뮤니티](https://discord.gg/metaplex) 참여

## 다음 단계

이제 CLI가 설치되었으므로 다음을 수행할 수 있습니다:

1. [핵심 명령에 대해 알아보기](/ko/dev-tools/cli/core/create-asset)
2. [도구상자 유틸리티 탐색](/ko/dev-tools/cli/toolbox/token-create)
3. [환경 구성](/ko/dev-tools/cli/config/wallets)

## 업데이트

CLI를 최신 버전으로 업데이트:

```bash
npm update -g @metaplex-foundation/cli
```

yarn으로 설치한 경우:

```bash
yarn global upgrade @metaplex-foundation/cli
```

## 제거

CLI를 제거하려면:

```bash
npm uninstall -g @metaplex-foundation/cli
```

yarn으로 설치한 경우:

```bash
yarn global remove @metaplex-foundation/cli
```
