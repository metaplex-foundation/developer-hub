---
title: MPL-Bubblegum JavaScript SDK
metaTitle: JavaScript SDK | MPL-Bubblegum
description: MPL-Bubblegum JavaScript SDK를 실행하도록 프로젝트를 설정하는 방법을 알아보세요.
---

Metaplex는 MPL-Bubblegum 프로그램과 상호 작용하는 데 사용할 수 있는 JavaScript 라이브러리를 제공합니다. [Umi 프레임워크](/kr/umi) 덕분에 많은 의견이 있는 종속성 없이 제공되므로 모든 JavaScript 프로젝트에서 사용할 수 있는 경량 라이브러리를 제공합니다.

시작하려면 [Umi 프레임워크를 설치](/kr/umi/getting-started)하고 MPL-Bubblegum JavaScript 라이브러리를 설치해야 합니다.

## 설치

JavaScript 패키지 매니저(npm, yarn, bun 등)로 설치할 수 있습니다.
```sh
npm install @metaplex-foundation/mpl-bubblegum
```

{% quick-links %}

{% quick-link title="typedoc" target="_blank" icon="JavaScript" href="https://mpl-bubblegum.typedoc.metaplex.com/" description="MPL-Bubblegum JavaScript SDK 생성된 패키지 API 문서." /%}

{% quick-link title="npmjs.com" target="_blank" icon="JavaScript" href="https://www.npmjs.com/package/@metaplex-foundation/mpl-bubblegum" description="NPM의 MPL-Bubblegum Javascript SDK." /%}

{% /quick-links %}

## Umi 설정

아직 `umi` 인스턴스를 설정하고 구성하지 않았다면 [Umi 시작하기](/kr/umi/getting-started) 페이지를 확인할 수 있습니다.

`umi` 인스턴스를 초기화하는 동안 다음을 사용하여 MPL-Bubblegum 패키지를 `umi`에 추가할 수 있습니다

```js
.use(mplBubblegum())
```

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplBubblegum } from '@metaplex-foundation/mpl-bubblegum'

// 원하는 RPC 엔드포인트를 사용하세요.
const umi = createUmi('http://api.devnet.solana.com')
... // 추가 umi 설정, 패키지 및 서명자
.use(mplBubblegum())
```

여기서부터 `umi` 인스턴스가 MPL-Bubblegum 패키지에 액세스할 수 있어 그 기능을 탐색할 수 있습니다.