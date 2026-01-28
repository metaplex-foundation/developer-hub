---
title: Umi SDK로 시작하기
metaTitle: Umi SDK | Token Metadata
description: Metaplex Token Metadata Umi SDK를 사용하여 NFT를 시작하세요.
---

**Umi SDK** (`@metaplex-foundation/mpl-token-metadata`)는 Metaplex의 Umi 프레임워크 위에 구축되었으며 Token Metadata와 상호작용하기 위한 유연한 API를 제공합니다. {% .lead %}

## 설치

```sh
npm install \
  @metaplex-foundation/umi \
  @metaplex-foundation/umi-bundle-defaults \
  @solana/web3.js@1 \
  @metaplex-foundation/mpl-token-metadata
```

## 설정

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata';

// Token Metadata 플러그인으로 Umi 인스턴스 생성
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplTokenMetadata());
```

### 지갑 연결

{% totem %}
{% totem-accordion title="키페어 사용" %}

```ts
import { keypairIdentity } from '@metaplex-foundation/umi';

// 비밀 키 배열에서
const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
umi.use(keypairIdentity(keypair));
```

{% /totem-accordion %}
{% totem-accordion title="Wallet Adapter 사용" %}

```ts
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters';

// wallet adapter (React)로
umi.use(walletAdapterIdentity(wallet));
```

{% /totem-accordion %}
{% /totem %}

## NFT 생성

```ts
import { generateSigner, percentAmount } from '@metaplex-foundation/umi';
import { createNft } from '@metaplex-foundation/mpl-token-metadata';

// 새 민트 키페어 생성
const mint = generateSigner(umi);

// NFT 생성
await createNft(umi, {
  mint,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: percentAmount(5.5),
}).sendAndConfirm(umi);

console.log('NFT created:', mint.publicKey);
```

## NFT 조회

```ts
import { fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata';

const asset = await fetchDigitalAsset(umi, mintAddress);

console.log('Name:', asset.metadata.name);
console.log('URI:', asset.metadata.uri);
console.log('Seller Fee:', asset.metadata.sellerFeeBasisPoints);
```

## 유용한 링크

- [Umi 프레임워크 문서](https://github.com/metaplex-foundation/umi)
- [GitHub 저장소](https://github.com/metaplex-foundation/mpl-token-metadata)
- [NPM 패키지](https://www.npmjs.com/package/@metaplex-foundation/mpl-token-metadata)
- [API 참조](https://mpl-token-metadata.typedoc.metaplex.com/)
