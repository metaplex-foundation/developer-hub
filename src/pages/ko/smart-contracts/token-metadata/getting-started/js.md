---
title: JavaScript를 사용하여 시작하기
metaTitle: JavaScript SDKs | Token Metadata
description: Metaplex Token Metadata JavaScript SDK를 사용하여 NFT를 시작하세요.
---

Metaplex는 Token Metadata NFT와 상호작용하기 위한 두 가지 JavaScript SDK를 제공합니다. 두 SDK 모두 Token Metadata의 모든 기능에 접근할 수 있습니다 - 프로젝트의 아키텍처에 따라 선택하세요. {% .lead %}

## SDK 선택

{% quick-links %}

{% quick-link title="Umi SDK" icon="JavaScript" href="/ko/smart-contracts/token-metadata/getting-started/umi" description="유연한 API를 가진 Umi 프레임워크 기반. Umi를 사용하는 프로젝트에 적합." /%}

{% quick-link title="Kit SDK" icon="JavaScript" href="/ko/smart-contracts/token-metadata/getting-started/kit" description="함수형 인스트럭션 빌더를 가진 @solana/kit 기반. 새 프로젝트에 적합." /%}

{% /quick-links %}

## 비교

| 기능 | Umi SDK | Kit SDK |
| ------- | ------- | ------- |
| 패키지 | `@metaplex-foundation/mpl-token-metadata` | `@metaplex-foundation/mpl-token-metadata-kit` |
| 기반 | Umi 프레임워크 | @solana/kit |
| 트랜잭션 구축 | `.sendAndConfirm()`을 사용한 유연한 API | 인스트럭션 빌더를 사용한 함수형 |
| 지갑 처리 | 내장 아이덴티티 시스템 | 표준 @solana/signers |
| 적합한 용도 | 이미 Umi를 사용하는 프로젝트 | @solana/kit를 사용하는 새 프로젝트 |

## 빠른 예제

{% dialect-switcher title="NFT 생성" %}
{% dialect title="Umi SDK" id="umi" %}

```ts
import { generateSigner, percentAmount } from '@metaplex-foundation/umi';
import { createNft } from '@metaplex-foundation/mpl-token-metadata';

const mint = generateSigner(umi);
await createNft(umi, {
  mint,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: percentAmount(5.5),
}).sendAndConfirm(umi);
```

{% /dialect %}
{% dialect title="Kit SDK" id="kit" %}

```ts
import { generateKeyPairSigner } from '@solana/kit';
import { createNft } from '@metaplex-foundation/mpl-token-metadata-kit';

const mint = await generateKeyPairSigner();
const [createIx, mintIx] = await createNft({
  mint,
  authority,
  payer: authority,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: 550,
  tokenOwner: authority.address,
});
await sendAndConfirm({
  instructions: [createIx, mintIx],
  payer: authority,
});
```

{% /dialect %}
{% /dialect-switcher %}

자세한 설정 지침과 더 많은 예제는 각 페이지를 참조하세요.
