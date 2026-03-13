---
title: JavaScript를 사용해서 시작하기
metaTitle: JavaScript SDK | Inscription
description: JavaScript를 사용해서 Inscription으로 시작하기
---

Metaplex는 Metaplex Inscriptions와 상호작용하는 데 사용할 수 있는 JavaScript 라이브러리를 제공합니다. [Umi 프레임워크](https://github.com/metaplex-foundation/umi) 덕분에 많은 독단적인 종속성 없이 제공되므로 모든 JavaScript 프로젝트에서 사용할 수 있는 가벼운 라이브러리를 제공합니다.

시작하려면 [Umi 프레임워크를 설치](https://github.com/metaplex-foundation/umi/blob/main/docs/installation.md)하고 Inscriptions JavaScript 라이브러리를 설치해야 합니다.

```sh
npm install \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults \
  @solana/web3.js@1 \
  @metaplex-foundation/mpl-inscription
```

다음으로 다음과 같이 `Umi` 인스턴스를 생성하고 `mplInscription` 플러그인을 설치할 수 있습니다.

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { mplInscription } from '@metaplex-foundation/mpl-inscription'

// 원하는 RPC 엔드포인트를 사용하세요.
const umi = createUmi('http://127.0.0.1:8899').use(mplInscription())
```

그런 다음 Umi에 사용할 지갑을 알려주어야 합니다. 이는 [키페어](/ko/dev-tools/umi/getting-started#connecting-w-a-secret-key) 또는 [솔라나 지갑 어댑터](/ko/dev-tools/umi/getting-started#connecting-w-wallet-adapter)일 수 있습니다.

이제 [라이브러리에서 제공하는 다양한 함수](https://mpl-inscription.typedoc.metaplex.com/)를 사용하고 `Umi` 인스턴스를 전달하여 Inscriptions와 상호작용할 수 있습니다. 다음은 작은 JSON 파일이 첨부된 간단한 inscription을 만들고, inscription의 데이터를 가져와서 inscription Rank를 출력하는 예제입니다.

```ts
// 1단계: NFT 또는 pNFT 민팅
// https://metaplex.com/docs/ko/smart-contracts/token-metadata/mint 참조

// 2단계: JSON Inscribe

const inscriptionAccount = await findMintInscriptionPda(umi, {
  mint: mint.publicKey,
})
const inscriptionMetadataAccount = await findInscriptionMetadataPda(umi, {
  inscriptionAccount: inscriptionAccount[0],
})

await initializeFromMint(umi, {
  mintAccount: mint.publicKey,
})
  .add(
    writeData(umi, {
      inscriptionAccount,
      inscriptionMetadataAccount,
      value: Buffer.from(
        JSON.stringify(metadata) // inscription할 NFT의 JSON
      ),
      associatedTag: null,
      offset: 0,
    })
  )
  .sendAndConfirm(umi)

const inscriptionMetadata = await fetchInscriptionMetadata(
  umi,
  inscriptionMetadataAccount
)
console.log(
  'Inscription 번호: ',
  inscriptionMetadata.inscriptionRank.toString()
)
```

🔗 **유용한 링크:**

- [Umi Framework](https://github.com/metaplex-foundation/umi)
- [GitHub Repository](https://github.com/metaplex-foundation/mpl-inscription)
- [NPM Package](https://www.npmjs.com/package/@metaplex-foundation/mpl-inscription)
- [API References](https://mpl-inscription.typedoc.metaplex.com/)
