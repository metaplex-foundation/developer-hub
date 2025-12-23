---
title: MPL Core Candy Machine Javascript SDK
metaTitle: Javascript SDK | MPL Core Candy Machine
description: MPL Core Candy Machine Javascript SDK를 실행하도록 프로젝트를 설정하는 방법을 알아보세요.
---

Metaplex는 MPL Core Candy Machine 프로그램과 상호작용하는 데 사용할 수 있는 JavaScript 라이브러리를 제공합니다. [Umi Framework](/ko/umi) 덕분에 많은 독선적인 종속성 없이 제공되어 모든 JavaScript 프로젝트에서 사용할 수 있는 경량 라이브러리를 제공합니다.

시작하려면 [Umi framework를 설치](/ko/dev-tools/umi/getting-started)하고 MPL-Core JavaScript 라이브러리를 설치해야 합니다.

## 설치

설치는 npm, yarn, bun 등 어떤 JS 패키지 매니저로도 실행할 수 있습니다...

```sh
npm install @metaplex-foundation/mpl-core-candy-machine
```

{% quick-links %}

{% quick-link title="typedoc" target="_blank" icon="JavaScript" href="https://mpl-core-candy-machine.typedoc.metaplex.com/" description="MPL Core Candy Machine Javascript SDK 생성된 패키지 API 문서." /%}

{% quick-link title="npmjs.com" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/mpl-core-candy-machine" description="NPM의 MPL Core Candy Machine Javascript SDK." /%}

{% /quick-links %}

## Umi 설정

Metaplex Javascript SDK와 상호작용하려면 `umi` 인스턴스가 필요합니다. 아직 `umi` 인스턴스를 설정하고 구성하지 않았다면 [Umi Getting Started](/ko/dev-tools/umi/getting-started) 페이지를 확인하고 RPC 엔드포인트와 `umi` 신원/서명자를 구성하세요.

`umi` 인스턴스를 초기화하는 동안 다음을 사용하여 mpl-core 패키지를 `umi`에 추가할 수 있습니다.

```js
.use(mplCandyMachine())
```

`.use()`를 사용하여 umi 인스턴스 생성의 어디서든 `mpCandyMachine()` 패키지를 추가할 수 있습니다.

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine'

// 선택한 RPC 엔드포인트를 사용하세요.
const umi = createUmi('http://api.devnet.solana.com')
... // 추가 umi 설정, 패키지, 서명자
.use(mplCandyMachine())
```

여기서부터 `umi` 인스턴스는 mpl-core 패키지에 액세스할 수 있으며 mpl-core 기능 세트를 탐색하기 시작할 수 있습니다.