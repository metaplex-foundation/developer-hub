---
title: JavaScript를 사용하여 시작하기
metaTitle: JavaScript SDK | Token Metadata
description: Metaplex Token Metadata JavaScript SDK를 사용하여 NFT를 시작하세요.
---

Metaplex는 NFT와 상호작용하는 데 사용할 수 있는 JavaScript 라이브러리를 제공합니다. [Umi 프레임워크](https://github.com/metaplex-foundation/umi) 덕분에 많은 주관적인 종속성 없이 제공되므로 모든 JavaScript 프로젝트에서 사용할 수 있는 경량 라이브러리를 제공합니다.

시작하려면 [Umi 프레임워크를 설치](https://github.com/metaplex-foundation/umi/blob/main/docs/installation.md)하고 Token Metadata JavaScript 라이브러리를 설치해야 합니다.

```sh
npm install \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults \
  @solana/web3.js@1 \
  @metaplex-foundation/mpl-token-metadata
```

다음으로, 다음과 같이 `Umi` 인스턴스를 생성하고 `mplTokenMetadata` 플러그인을 설치할 수 있습니다.

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'

// 선택한 RPC 엔드포인트를 사용하세요.
const umi = createUmi('http://127.0.0.1:8899').use(mplTokenMetadata())
```
그런 다음 Umi에게 사용할 지갑을 알려주고 싶을 것입니다. 이는 [키페어](/ko/dev-tools/umi/getting-started#connecting-w-a-secret-key) 또는 [솔라나 지갑 어댑터](/ko/dev-tools/umi/getting-started#connecting-w-wallet-adapter)일 수 있습니다.

그게 다입니다. 이제 [라이브러리에서 제공하는 다양한 함수](https://mpl-token-metadata.typedoc.metaplex.com/)를 사용하고 `Umi` 인스턴스를 전달하여 NFT와 상호작용할 수 있습니다. 다음은 NFT를 생성하고 모든 온체인 계정의 데이터를 가져오는 예제입니다.

```ts
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import {
  createNft,
  fetchDigitalAsset,
} from '@metaplex-foundation/mpl-token-metadata'

const mint = generateSigner(umi)
await createNft(umi, {
  mint,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: percentAmount(5.5),
}).sendAndConfirm(umi)

const asset = await fetchDigitalAsset(umi, mint.publicKey)
```

🔗 **유용한 링크:**

- [Umi 프레임워크](https://github.com/metaplex-foundation/umi)
- [GitHub 저장소](https://github.com/metaplex-foundation/mpl-token-metadata)
- [NPM 패키지](https://www.npmjs.com/package/@metaplex-foundation/mpl-token-metadata)
- [API 참조](https://mpl-token-metadata.typedoc.metaplex.com/)