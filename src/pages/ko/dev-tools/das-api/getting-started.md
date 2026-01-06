---
title: 시작하기
metaTitle: 시작하기 | DAS API
description: Metaplex DAS API 클라이언트의 설치 및 설정입니다.
---

`@metaplex-foundation/digital-asset-standard-api` 패키지를 사용하여 Metaplex DAS API와 상호작용할 수 있습니다:

DAS API 클라이언트는 Umi 플러그인이므로 DAS API 클라이언트와 함께 Umi를 설치해야 합니다.

아래 위치에서 umi와 플러그인을 설치할 수 있습니다.

```js
npm install @metaplex-foundation/umi
npm install @metaplex-foundation/umi-bundle-defaults
npm install @metaplex-foundation/digital-asset-standard-api
```

설치가 완료되면 라이브러리를 Umi 인스턴스에 등록할 수 있습니다.

```js
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api"
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';

const umi = createUmi("exampleDasProvider.com").use(dasApi());
```

이 플러그인은 Metaplex DAS API 사양을 지원하는 모든 RPC와 함께 사용할 수 있습니다. 사양을 지원하는 RPC는 [RPC 제공자 페이지](/ko/rpc-providers)에서 찾을 수 있습니다.

참고: 엔드포인트에서 DAS API를 "활성화"하려면 RPC 제공자에게 문의해야 할 수 있습니다.

{% callout title="Metaplex Core DAS API" type="note" %}
[Metaplex Core](/ko/smart-contracts/core) 자산에서 DAS를 사용하려면 추가로 `@metaplex-foundation/mpl-core-das` 패키지를 설치해야 합니다:
{% /callout %}

## MPL Core용 DAS

[MPL Core](/ko/smart-contracts/core)를 위한 [DAS 확장](/ko/dev-tools/das-api/core-extension)은 MPL SDK와 함께 사용할 수 있는 올바른 타입을 직접 반환합니다. 또한 컬렉션에서 상속된 자산의 플러그인을 자동으로 파생하고 [DAS-to-Core 타입 변환을 위한 함수](/ko/dev-tools/das-api/core-extension/convert-das-asset-to-core)를 제공합니다.

사용하려면 먼저 추가 패키지를 설치하세요:

```js
npm install @metaplex-foundation/mpl-core-das
```

그런 다음 해당 패키지를 가져옵니다

```js
import { das } from '@metaplex-foundation/mpl-core-das';
```

이후에는 위에서 언급한 것처럼 Core 전용 함수를 사용할 수 있습니다.
