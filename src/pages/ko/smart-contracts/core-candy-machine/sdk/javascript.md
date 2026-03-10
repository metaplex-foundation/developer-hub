---
title: MPL Core Candy Machine JavaScript SDK
metaTitle: JavaScript SDK | MPL Core Candy Machine
description: Umi 프레임워크를 사용하여 Solana에서 Candy Machine을 생성하고 관리하기 위한 MPL Core Candy Machine JavaScript SDK 설치 및 구성 방법을 알아보세요.
keywords:
  - core candy machine
  - javascript sdk
  - mpl-core-candy-machine
  - umi framework
  - solana nft
  - candy machine javascript
  - metaplex sdk
  - nft minting
  - npm package
  - typescript
  - candy machine setup
about:
  - JavaScript SDK
  - Umi framework
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
---

## 요약

MPL Core Candy Machine JavaScript SDK는 [Umi 프레임워크](/ko/dev-tools/umi)를 사용하여 Solana에서 Core Candy Machine을 생성하고 관리하기 위한 경량 라이브러리를 제공합니다. {% .lead %}

- npm, yarn 또는 bun을 통해 `@metaplex-foundation/mpl-core-candy-machine` 패키지를 설치합니다
- RPC 엔드포인트와 서명자가 구성된 [Umi](/ko/dev-tools/umi/getting-started) 인스턴스가 필요합니다
- `.use(mplCandyMachine())`를 사용하여 Umi 인스턴스에 SDK를 플러그인으로 등록합니다
- 모든 JavaScript 또는 TypeScript 프로젝트와 호환됩니다

## 설치

`@metaplex-foundation/mpl-core-candy-machine` 패키지는 npm, yarn, bun 등 모든 JavaScript 패키지 매니저로 설치할 수 있습니다.

```sh
npm install @metaplex-foundation/mpl-core-candy-machine
```

{% quick-links %}

{% quick-link title="typedoc" target="_blank" icon="JavaScript" href="https://mpl-core-candy-machine.typedoc.metaplex.com/" description="MPL Core Candy Machine Javascript SDK 자동 생성 패키지 API 문서." /%}

{% quick-link title="npmjs.com" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/mpl-core-candy-machine" description="NPM의 MPL Core Candy Machine Javascript SDK." /%}

{% /quick-links %}

## Umi 설정

Core Candy Machine SDK와 상호작용하려면 구성된 [Umi](/ko/dev-tools/umi/getting-started) 인스턴스가 필요합니다. 아직 Umi를 설정하지 않았다면, [Umi 시작하기](/ko/dev-tools/umi/getting-started) 페이지를 방문하여 RPC 엔드포인트와 신원 서명자를 구성하세요.

`umi` 인스턴스를 초기화하는 동안 다음을 사용하여 mpl-core 패키지를 `umi`에 추가할 수 있습니다.

```js
.use(mplCandyMachine())
```

`.use()`를 사용하여 umi 인스턴스 생성의 어디서든 `mplCandyMachine()` 패키지를 추가할 수 있습니다.

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine'

// Use the RPC endpoint of your choice.
const umi = createUmi('http://api.devnet.solana.com')
... // additional umi settings, packages, and signers
.use(mplCandyMachine())
```

여기서부터 `umi` 인스턴스는 mpl-core 패키지에 액세스할 수 있으며 Core Candy Machine 기능 세트를 탐색하기 시작할 수 있습니다.

## 참고사항

- JavaScript SDK는 피어 의존성으로 [Umi 프레임워크](/ko/dev-tools/umi)를 필요로 합니다. 이 SDK를 사용하기 전에 Umi를 설치하고 구성해야 합니다.
- Solana RPC 엔드포인트가 필요합니다. 프로덕션 배포에는 공용 엔드포인트 대신 전용 RPC 제공자를 사용하세요.
- 이 SDK는 하나의 패키지에서 Core Candy Machine 프로그램과 Core Candy Guard 프로그램을 모두 포함합니다.

*[Metaplex](https://github.com/metaplex-foundation/mpl-core-candy-machine)에서 유지관리 · 2026년 3월 검증*
