---
title: JavaScript를 사용하여 시작하기
metaTitle: JavaScript SDK | Candy Machine
description: JavaScript를 사용하여 Candy Machine을 시작하세요
---

Metaplex는 Candy Machine과 상호작용하는 데 사용할 수 있는 JavaScript 라이브러리를 제공합니다. [Umi 프레임워크](https://github.com/metaplex-foundation/umi) 덕분에 많은 고정된 종속성 없이 제공되므로 모든 JavaScript 프로젝트에서 사용할 수 있는 경량 라이브러리를 제공합니다.

시작하려면 [Umi 프레임워크](https://github.com/metaplex-foundation/umi/blob/main/docs/installation.md)와 Candy Machine JavaScript 라이브러리를 설치해야 합니다.

```sh
npm install \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults \
  @solana/web3.js@1 \
  @metaplex-foundation/mpl-candy-machine
```

다음으로 `Umi` 인스턴스를 생성하고 다음과 같이 `mplCandyMachine` 플러그인을 설치할 수 있습니다.

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplCandyMachine } from '@metaplex-foundation/mpl-candy-machine'

// 선택한 RPC 엔드포인트를 사용하세요.
const umi = createUmi('http://127.0.0.1:8899').use(mplCandyMachine())
```

그런 다음 사용할 지갑을 Umi에게 알려주어야 합니다. 이는 [키페어](/ko/dev-tools/umi/connecting-to-umi#connecting-w-a-secret-key) 또는 [Solana 지갑 어댑터](/ko/dev-tools/umi/connecting-to-umi#connecting-w-wallet-adapter)일 수 있습니다.

이제 [라이브러리에서 제공하는 다양한 함수](https://mpl-candy-machine.typedoc.metaplex.com/)를 사용하고 `Umi` 인스턴스를 전달하여 NFT와 상호작용할 수 있습니다. 다음은 Candy Machine 계정과 관련된 Candy Guard 계정을 가져오는 예시입니다.

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  fetchCandyMachine,
  fetchCandyGuard,
} from '@metaplex-foundation/mpl-candy-machine'

const candyMachinePublicKey = publicKey('...')
const candyMachine = await fetchCandyMachine(umi, candyMachinePublicKey)
const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority)
```

🔗 **유용한 링크:**

- [Umi 프레임워크](https://github.com/metaplex-foundation/umi)
- [GitHub 저장소](https://github.com/metaplex-foundation/mpl-candy-machine)
- [NPM 패키지](https://www.npmjs.com/package/@metaplex-foundation/mpl-candy-machine)
- [API 참조](https://mpl-candy-machine.typedoc.metaplex.com/)