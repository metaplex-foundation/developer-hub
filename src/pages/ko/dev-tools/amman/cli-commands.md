---
title: CLI 명령어
metaTitle: CLI 명령어 | Amman
description: Metaplex Amman 로컬 검증자 도구 키트의 CLI 명령어.
---

```sh
amman [명령어]

명령어:
  amman start    solana-test-validator와 구성된 경우 amman relay 및/또는
                 mock storage를 시작합니다
  amman stop     relay와 storage를 중지하고 실행 중인 solana
                 test validator를 종료합니다
  amman logs     'solana logs'를 시작하고 prettifier를 통해 파이프합니다
  amman airdrop  제공된 Sol을 지불자에게 에어드롭합니다
  amman label    amman에 계정이나 트랜잭션용 레이블을 추가합니다
  amman account  PublicKey나 레이블에 대한 계정 정보를 검색하거나
                 모든 레이블된 계정을 보여줍니다
  amman run      모든 주소 레이블을 확장한 후 제공된 명령을 실행합니다

옵션:
  --help     도움말 보기                                                [boolean]
  --version  버전 번호 보기                                           [boolean]
```

## 명령어 실행

```sh
npx amman start <config.js>
```

`config.js`가 제공되지 않으면 _amman_은 현재 디렉터리에서 `.ammanrc.js` 파일을 찾습니다.
이것도 찾지 못하면 기본 구성을 사용합니다.

package.json 스크립트에 Amman을 추가했다면 선택한 패키지 설치 프로그램에서 Amman을 실행할 수 있습니다.

```sh
// npm
npm run amman:start

// yarn
yarn amman:start

// pnpm
pnpm run amman:start
```
