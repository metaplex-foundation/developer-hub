---
title: MPL Core JavaScript SDK
metaTitle: JavaScript SDK | Metaplex Core
description: MPL Core JavaScript SDK를 설치하고 설정하세요. Core Assets 및 Collections 생성, 관리, 전송을 위한 완전한 TypeScript 지원.
---

**MPL Core JavaScript SDK**는 Solana에서 Core Assets와 Collections를 생성하고 관리하기 위한 완전한 TypeScript 라이브러리입니다. Umi 프레임워크를 기반으로 하며 완전한 타입 안전성과 최소한의 의존성을 제공합니다. {% .lead %}

{% callout title="배울 내용" %}

- SDK 설치 및 설정
- Umi 인스턴스 구성
- mpl-core 패키지 등록

{% /callout %}

## 요약

SDK는 npm을 통해 설치하고 Umi 인스턴스와 함께 구성합니다. 완전한 TypeScript 지원으로 Assets, Collections 및 플러그인 작업을 위한 모든 기능을 제공합니다.

- `npm install @metaplex-foundation/mpl-core`로 설치
- Umi 프레임워크 필요(의존성 관리)
- `.use(mplCore())`로 umi에 등록

## 설치

설치는 npm, yarn, bun 등 모든 JS 패키지 매니저로 실행할 수 있습니다.

```sh
npm install @metaplex-foundation/mpl-core
```

{% quick-links %}

{% quick-link title="typedoc" target="_blank" icon="JavaScript" href="https://mpl-core.typedoc.metaplex.com/" description="MPL-Core Javascript SDK 생성된 패키지 API 문서." /%}

{% quick-link title="npmjs.com" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/mpl-core" description="NPM의 MPL-Core Javascript SDK." /%}

{% /quick-links %}

## Umi 설정

Metaplex Javascript SDK와 상호작용하려면 `umi` 인스턴스가 필요합니다. 아직 `umi` 인스턴스를 설정하고 구성하지 않았다면 [Umi 시작하기](/ko/dev-tools/umi/getting-started) 페이지를 확인하고 RPC 엔드포인트와 `umi` identity/signer를 구성할 수 있습니다.

`umi` 인스턴스 초기화 중에 다음을 사용하여 mpl-core 패키지를 `umi`에 추가할 수 있습니다

```js
.use(mplCore())
```

umi 인스턴스 생성에서 `.use()`로 `mplCore()` 패키지를 어디든 추가할 수 있습니다.

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCore } from '@metaplex-foundation/mpl-core'

// 원하는 RPC 엔드포인트를 사용하세요.
const umi = createUmi('http://api.devnet.solana.com')
... // 추가 umi 설정, 패키지, 그리고 signer들
.use(mplCore())
```

여기서부터 `umi` 인스턴스는 mpl-core 패키지에 액세스할 수 있고 mpl-core 기능 세트를 탐색할 수 있습니다.

## 일반적인 오류

### `Umi instance not configured`

mpl-core를 사용하기 전에 `.use(mplCore())`를 호출해야 합니다.

### `No signer configured`

트랜잭션에 서명할 identity/signer를 Umi에 구성해야 합니다.

## 참고 사항

- SDK는 Umi 프레임워크 필요(별도 설치)
- 모든 함수는 완전한 TypeScript 타입 지원
- devnet과 mainnet 모두에서 작동
- 트랜잭션 빌더 패턴으로 체이닝 가능

## FAQ

### Umi가 필요한가요?

네. Umi 프레임워크는 RPC 연결, 서명자 관리, 트랜잭션 빌딩을 처리합니다. mpl-core를 사용하기 전에 먼저 설정해야 합니다.

### SDK가 React/Next.js에서 작동하나요?

네. SDK는 모든 JavaScript 환경에서 작동합니다. Next.js의 경우 `umi-bundle-defaults`를 사용하세요.

### TypeScript가 필요한가요?

필수는 아니지만 권장됩니다. SDK는 JavaScript에서도 작동하지만 TypeScript의 자동완성과 타입 검사가 개발 경험을 크게 향상시킵니다.

## 관련 페이지

- [Umi 시작하기](/ko/dev-tools/umi/getting-started) - Umi 설치 및 구성
- [Core 개요](/ko/smart-contracts/core) - Core 프로그램 소개
- [Asset 생성하기](/ko/smart-contracts/core/create-asset) - 첫 번째 Asset 생성

---

*Metaplex Foundation 관리 · 2026년 1월 최종 검증 · @metaplex-foundation/mpl-core 적용*
