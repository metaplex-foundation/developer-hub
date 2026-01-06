---
title: MPL-Core Javascript SDK
metaTitle: Javascript SDK | MPL-Core
description: MPL-Core Javascript SDK를 실행하기 위해 프로젝트를 설정하는 방법을 알아보세요.
---

Metaplex는 MPL-Core 프로그램과 상호작용하는 데 사용할 수 있는 JavaScript 라이브러리를 제공합니다. [Umi 프레임워크](/ko/dev-tools/umi) 덕분에 많은 고정된 의존성 없이 제공되어 모든 JavaScript 프로젝트에서 사용할 수 있는 가벼운 라이브러리입니다.

시작하려면 [Umi 프레임워크를 설치](/ko/dev-tools/umi/getting-started)하고 MPL-Core JavaScript 라이브러리를 설치해야 합니다.

## 설치

설치는 npm, yarn, bun 등 모든 JS 패키지 매니저로 실행할 수 있습니다...

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
const umi = createUmi('http://api.devenet.solana.com')
... // 추가 umi 설정, 패키지, 그리고 signer들
.use(mplCore())
```

여기서부터 `umi` 인스턴스는 mpl-core 패키지에 액세스할 수 있고 mpl-core 기능 세트를 탐색할 수 있습니다.