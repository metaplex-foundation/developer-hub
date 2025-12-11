---
title: MPL-Hybrid Javascript SDK
metaTitle: Javascript SDK | MPL-Hybrid
description: MPL-Hybrid Javascript SDK를 실행하기 위한 프로젝트 설정 방법을 알아보세요.
---

Metaplex는 MPL-Hybrid 404 프로그램과 상호 작용하는 데 사용할 수 있는 JavaScript 라이브러리를 제공합니다. [Umi 프레임워크](/ko/umi) 덕분에 많은 독단적인 종속성 없이 제공되므로 모든 JavaScript 프로젝트에서 사용할 수 있는 경량 라이브러리를 제공합니다.

시작하려면 [Umi 프레임워크를 설치](/ko/umi/getting-started)하고 MPL-Hybrid JavaScript 라이브러리를 설치해야 합니다.

## 설치

설치는 npm, yarn, bun 등 모든 JS 패키지 관리자로 실행할 수 있습니다...

```sh
npm install @metaplex-foundation/mpl-hybrid
```

## Umi 설정


Metaplex Javascript SDK와 상호 작용하려면 `umi` 인스턴스가 필요합니다. 아직 `umi` 인스턴스를 설정하고 구성하지 않았다면 [Umi 시작 가이드](/ko/umi/getting-started) 페이지를 확인하세요.


`umi` 인스턴스를 초기화하는 동안 다음을 사용하여 mpl-hybrid 패키지를 `umi`에 추가할 수 있습니다

```js
.use(mplHybrid())
```

`mplHybrid()` 패키지는 umi 인스턴스 생성의 어디에나 추가할 수 있습니다.
```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplHybrid } from '@metaplex-foundation/mpl-hybrid'

// 원하는 RPC 엔드포인트를 사용하세요.
const umi = createUmi('http://api.devenet.solana.com')
... // 추가 umi 설정 및 패키지
.use(mplHybrid())
```

이제 `umi` 인스턴스가 mpl-hybrid 패키지에 액세스할 수 있습니다.
