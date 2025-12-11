---
title: '@solana/kit 어댑터'
metaTitle: 'Umi - @solana/kit 어댑터'
description: 'Umi와 @solana/kit 사이의 타입을 변환하는 어댑터입니다.'
---

새로운 [`@solana/kit`](https://github.com/anza-xyz/kit) 라이브러리는 Solana의 현대적인 JavaScript SDK의 일부이며 [`@solana/web3.js`](https://github.com/solana-foundation/solana-web3.js/)와 비교하여 향상된 타입 안전성과 성능을 제공합니다. Umi와 `@solana/kit`을 모두 사용할 때 각각의 타입 간 변환이 필요할 수 있습니다.

이를 도와주기 위해 Umi는 [`@metaplex-foundation/umi-kit-adapters`](https://www.npmjs.com/package/@metaplex-foundation/umi-kit-adapters) 패키지에서 Umi와 `@solana/kit` 사이의 타입을 변환할 수 있는 어댑터를 제공합니다.

## 설치 및 가져오기

어댑터 패키지를 설치합니다:

```
npm i @metaplex-foundation/umi-kit-adapters
```

설치 후 변환 함수를 사용할 수 있습니다:


## 주소

Umi와 `@solana/kit` 모두 주소에 base58 문자열을 사용하므로 변환이 간단합니다.

### @solana/kit에서 Umi로

```ts
import { address } from '@solana/kit';
import { fromKitAddress } from '@metaplex-foundation/umi-kit-adapters';

// Kit 주소 생성
const kitAddress = address("11111111111111111111111111111112");

// Umi PublicKey로 변환
const umiPublicKey = fromKitAddress(kitAddress);
```

### Umi에서 @solana/kit으로

```ts
import { publicKey } from '@metaplex-foundation/umi';
import { toKitAddress } from '@metaplex-foundation/umi-kit-adapters';

// Umi PublicKey 생성
const umiPublicKey = publicKey("11111111111111111111111111111112");

// Kit 주소로 변환
const kitAddress = toKitAddress(umiPublicKey);
```

## 키페어

키페어 변환은 각 라이브러리에서 사용하는 다른 형식을 처리해야 합니다.

### @solana/kit에서 Umi로

```ts
import { generateKeyPair } from '@solana/kit';
import { fromKitKeypair } from '@metaplex-foundation/umi-kit-adapters';

// 예시로 새 Kit CryptoKeyPair 생성
const kitKeypair = await generateKeyPair();

// Umi Keypair로 변환
const umiKeypair = await fromKitKeypair(kitKeypair);
```

### Umi에서 @solana/kit으로

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { generateSigner } from '@metaplex-foundation/umi';
import { toKitKeypair } from '@metaplex-foundation/umi-kit-adapters';

// Umi 인스턴스 생성 및 예시 키페어 생성
const umi = createUmi('https://api.devnet.solana.com');
const umiKeypair = generateSigner(umi);

// Kit CryptoKeyPair로 변환
const kitKeypair = await toKitKeypair(umiKeypair);
```

## 명령어

명령어는 서로 다른 계정 역할 시스템을 처리하면서 두 형식 간에 변환될 수 있습니다.

### @solana/kit에서 Umi로

```ts
import { getSetComputeUnitLimitInstruction } from '@solana-program/compute-budget';
import { fromKitInstruction } from '@metaplex-foundation/umi-kit-adapters';

// 예시로 새 Kit 명령어 생성
const kitInstruction = getSetComputeUnitLimitInstruction({ units: 500 });

// Umi Instruction으로 변환
const umiInstruction = fromKitInstruction(kitInstruction);
```

### Umi에서 @solana/kit으로

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { setComputeUnitPrice } from '@metaplex-foundation/mpl-toolbox';
import { toKitInstruction } from '@metaplex-foundation/umi-kit-adapters';

// 예시를 위한 새 Umi 인스턴스 생성
const umi = createUmi('https://api.devnet.solana.com');

// 예시로 새 Umi 명령어 생성
const umiInstruction = setComputeUnitPrice(umi, { microLamports: 1 });

// Kit 명령어로 변환
const kitInstruction = toKitInstruction(umiInstruction);
```

## 사용 사례

이러한 어댑터는 다음과 같은 경우에 특히 유용합니다:

- Umi와 Metaplex 기능을 `@solana/kit`과 함께 사용하고 싶을 때
- Solana 생태계의 다른 부분 간에 상호 운용성이 필요한 애플리케이션을 구축할 때
- 다른 타입 시스템을 사용하는 기존 코드를 통합할 때

어댑터는 타입 안전성을 보장하고 변환 세부사항을 자동으로 처리하여 같은 프로젝트에서 두 라이브러리를 모두 쉽게 사용할 수 있게 해줍니다.