---
title: 트랜잭션 직렬화, 역직렬화 및 전송
metaTitle: Umi - 트랜잭션 직렬화, 역직렬화 및 전송
description: Metaplex Umi 클라이언트를 사용하면서 다양한 환경 간에 트랜잭션을 이동하기 위해 트랜잭션을 직렬화하고 역직렬화하는 방법을 배우세요.
created: '08-15-2024'
updated: '08-15-2024'
---

**이 가이드에서 다룰 내용:**

- 트랜잭션 직렬화 및 역직렬화
- Noop Signer
- 부분 서명된 트랜잭션
- 다양한 환경 간에 트랜잭션 전달

## 소개

트랜잭션은 일반적으로 다양한 환경 간의 이동을 용이하게 하기 위해 직렬화됩니다. 하지만 이유는 다를 수 있습니다:

- 별도의 환경에 저장된 다양한 권한자로부터 서명이 필요할 수 있습니다.
- 프론트엔드에서 트랜잭션을 생성한 후 데이터베이스에 저장하기 전에 백엔드에서 전송하고 검증하고 싶을 수 있습니다.

예를 들어, NFT를 생성할 때 NFT를 컬렉션에 승인하기 위해 `collectionAuthority` 키페어로 트랜잭션에 서명해야 할 수 있습니다. 키페어를 노출하지 않고 안전하게 서명하려면 먼저 백엔드에서 트랜잭션을 생성하고, 보안되지 않은 환경에서 키페어를 노출하지 않고도 `collectionAuthority`로 부분적으로 트랜잭션에 서명하고, 트랜잭션을 직렬화한 후 전송할 수 있습니다. 그런 다음 트랜잭션을 안전하게 역직렬화하고 `Buyer` 지갑으로 서명할 수 있습니다.

**참고**: Candy Machine을 사용할 때는 `collectionAuthority` 서명이 필요하지 않습니다.

## 초기 설정

### 필수 패키지와 가져오기

다음 패키지를 사용할 예정입니다:

{% packagesUsed packages=["umi", "umiDefaults", "core"] type="npm" /%}

설치하려면 다음 명령을 사용하세요:

```
npm i @metaplex-foundation/umi
```

```
npm i @metaplex-foundation/umi-bundle-defaults
```

```
npm i @metaplex-foundation/mpl-core
```

이 가이드에서 사용할 모든 가져오기입니다.

```ts
import { generateSigner, signerIdentity, createNoopSigner } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { fetchCollection, create, mplCore } from '@metaplex-foundation/mpl-core'
import { base64 } from '@metaplex-foundation/umi/serializers';
```

## Umi 설정

Umi를 설정할 때 다양한 소스에서 키페어/지갑을 사용하거나 생성할 수 있습니다. 테스트용 새 지갑을 생성하거나, 파일 시스템에서 기존 지갑을 가져오거나, 웹사이트/dApp을 만드는 경우 `walletAdapter`를 사용할 수 있습니다.

{% totem %}

{% totem-accordion title="새 지갑으로" %}

```ts
const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())

// 새로운 키페어 서명자를 생성합니다.
const signer = generateSigner(umi)

// Umi에게 새 서명자를 사용하도록 지시합니다.
umi.use(signerIdentity(signer))
```

{% /totem-accordion %}

{% totem-accordion title="기존 지갑으로" %}

```ts
import * as fs from "fs";
import * as path from "path";

const umi = createUmi('https://api.devnet.solana.com')
  .use(mplCore())

// fs를 사용하여 상대 경로를 통해 사용하고자 하는
// 지갑에 도달할 때까지 파일 시스템을 탐색합니다.
const walletFile = fs.readFileSync(
  path.join(__dirname, './keypair.json')
)

// 일반적으로 키페어는 Uint8Array로 저장되므로
// 사용 가능한 키페어로 변환해야 합니다.
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

// Umi가 이 키페어를 사용하기 전에
// Signer 타입을 생성해야 합니다.
const signer = createSignerFromKeypair(umi, keyair);

// Umi에게 새 서명자를 사용하도록 지시합니다.
umi.use(signerIdentity(walletFile))
```

{% /totem-accordion %}

{% totem-accordion title="Wallet Adapter로" %}

```ts
import { walletAdapterIdentity } from '@metaplex-foundation/umi-signer-wallet-adapters'
import { useWallet } from '@solana/wallet-adapter-react'

const wallet = useWallet()

const umi = createUmi('https://api.devnet.solana.com')
.use(mplCore())
// Wallet Adapter를 Umi에 등록
.use(walletAdapterIdentity(wallet))
```

{% /totem-accordion %}

{% /totem %}

## 직렬화

트랜잭션의 직렬화는 트랜잭션 객체를 쉽게 전송 가능한 형태로 트랜잭션의 상태를 저장하는 일련의 바이트 또는 문자열로 변환하는 과정입니다. 이를 통해 HTTP 요청과 같은 것을 통해 전달할 수 있습니다.

직렬화 예시에서 우리는 다음을 수행할 것입니다:

- `NoopSigner`를 사용하여 인스트럭션에서 `Payer`를 `Signer`로 추가
- 버전 트랜잭션을 생성하고 `collectionAuthority`와 `Asset`으로 서명
- 모든 세부 사항이 보존되고 프론트엔드에서 정확하게 재구성될 수 있도록 직렬화
- 요청을 통해 전달할 수 있도록 u8 대신 문자열로 전송

### Noop Signer

트랜잭션을 부분적으로 서명한 후 직렬화하는 것은 `NoopSigner` 때문에만 가능합니다.

Umi 인스트럭션은 기본적으로 로컬 키페어 파일이나 `walletAdapter` 서명자에서 생성되는 `Signer` 타입을 사용할 수 있습니다. 때로는 특정 서명자에 액세스할 수 없어서 나중에 해당 서명자로 서명해야 하는 경우가 있습니다. 이때 Noop Signer가 등장합니다.

**Noop Signer**는 공개키를 받아 특별한 `Signer` 타입을 생성하여 Umi가 현재 시점에서 Noop Signer가 존재하거나 트랜잭션에 서명할 필요 없이 인스트럭션을 구축할 수 있게 해줍니다.

*Noop Signers*로 구축된 인스트럭션과 트랜잭션은 트랜잭션을 체인에 전송하기 전 어느 시점에서 서명하기를 기대하며, 존재하지 않으면 "missing signature" 오류를 발생시킵니다.

사용 방법은 다음과 같습니다:

```ts
createNoopSigner(publickey('11111111111111111111111111111111'))
```

### 바이너리 데이터 대신 문자열 사용

환경 간에 전달하기 전에 직렬화된 트랜잭션을 문자열로 변환하는 결정의 근거:

- Base64와 같은 형식은 보편적으로 인식되며 데이터 손상이나 오해석의 위험 없이 HTTP를 통해 안전하게 전송할 수 있습니다.
- 문자열 사용은 웹 통신의 표준 관행과 일치합니다. 대부분의 API와 웹 서비스는 JSON 또는 기타 문자열 기반 형식의 데이터를 기대합니다.

`@metaplex-foundation/umi/serializers` 패키지에 있는 `base64` 함수를 사용하는 방법입니다.

**참고**: `@metaplex-foundation/umi` 패키지에 포함되어 있으므로 패키지를 설치할 필요가 없습니다.

```ts
// base64.deserialize를 사용하고 serializedTx를 전달
const serializedTxAsString = base64.deserialize(serializedTx)[0];

// base64.serialize를 사용하고 serializedTxAsString을 전달
const deserializedTxAsU8 = base64.serialize(serializedTxAsString);
```

### 코드 예시

```ts
// Collection Authority 키페어 사용
const collectionAuthority = generateSigner(umi)
umi.use(signerIdentity(collectionAuthority))

// 나중에 서명할 수 있는 noop signer 생성
const frontendPubkey = publickey('11111111111111111111111111111111')
const frontEndSigner = createNoopSigner(frontendPubkey)

// Asset 키페어 생성
const asset = generateSigner(umi);

// 컬렉션 가져오기
const collection = await fetchCollection(umi, publickey(`11111111111111111111111111111111`));

// createAssetIx 생성
const createAssetTx = await create(umi, {
  asset: asset,
  collection: collection,
  authority: collectionAuthority,
  payer: frontEndSigner,
  owner: frontendPubkey,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
})
  .useV0()
  .setBlockhash(await umi.rpc.getLatestBlockhash())
  .buildAndSign(umi);

// 트랜잭션 직렬화
const serializedCreateAssetTx = umi.transactions.serialize(createAssetTx)

// Uint8Array를 문자열로 인코딩하고 트랜잭션을 프론트엔드로 반환
const serializedCreateAssetTxAsString = base64.deserialize(serializedCreateAssetTx)[0];

return serializedCreateAssetTxAsString
```

## 역직렬화

역직렬화 예시에서 우리는 다음을 수행할 것입니다:

- 요청을 통해 받은 트랜잭션을 Uint8Array로 다시 변환
- 중단한 지점부터 작업할 수 있도록 역직렬화
- 다른 환경에서 `NoopSigner`를 통해 사용했으므로 `Payer` 키페어로 서명
- 전송

### 코드 예시

```ts
// 문자열을 Uint8Array로 디코딩하여 사용 가능하게 만들기
const deserializedCreateAssetTxAsU8 = base64.serialize(serializedCreateAssetTxAsString);

// 백엔드에서 반환된 트랜잭션 역직렬화
const deserializedCreateAssetTx = umi.transactions.deserialize(deserializedCreateAssetTxAsU8)

// walletAdapter에서 가져온 키페어로 트랜잭션 서명
const signedDeserializedCreateAssetTx = await umi.identity.signTransaction(deserializedCreateAssetTx)

// 트랜잭션 전송
await umi.rpc.sendTransaction(signedDeserializedCreateAssetTx)
```

## 전체 코드 예시

당연히 실행 중인 인스트럭션의 완전히 재현 가능한 예시를 위해서는 프론트엔드 서명자 처리 및 컬렉션 생성과 같은 추가 단계를 포함해야 합니다.

모든 것이 동일하지 않더라도 걱정하지 마세요. 백엔드와 프론트엔드 부분은 일관됩니다.

```ts
import { generateSigner, createSignerFromKeypair, signerIdentity, sol, createNoopSigner, transactionBuilder } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { base58 } from '@metaplex-foundation/umi/serializers';
import { createCollection, create, fetchCollection } from '@metaplex-foundation/mpl-core'

const umi = createUmi("https://api.devnet.solana.com", "finalized")

const collectionAuthority = generateSigner(umi);
umi.use(signerIdentity(collectionAuthority));

const frontEndSigner = generateSigner(umi);

(async () => {

  // 지갑에 토큰 에어드롭
  await umi.rpc.airdrop(umi.identity.publicKey, sol(1));
  await umi.rpc.airdrop(frontEndSigner.publicKey, sol(1));

  // 컬렉션 키페어 생성
  const collectionAddress = generateSigner(umi)
  console.log("\nCollection Address: ", collectionAddress.publicKey.toString())

  // 컬렉션 생성
  let createCollectionTx = await createCollection(umi, {
    collection: collectionAddress,
    name: 'My Collection',
    uri: 'https://example.com/my-collection.json',
  }).sendAndConfirm(umi)

  const createCollectionSignature = base58.deserialize(createCollectionTx.signature)[0]
  console.log(`\nCollection Created: https://solana.fm/tx/${createCollectionSignature}?cluster=devnet-alpha`);

  // 직렬화

  const asset = generateSigner(umi);
  console.log("\nAsset Address: ", asset.publicKey.toString());

  const collection = await fetchCollection(umi, collectionAddress.publicKey);

  let createAssetIx = await create(umi, {
    asset: asset,
    collection: collection,
    authority: collectionAuthority,
    payer: createNoopSigner(frontEndSigner.publicKey),
    owner: frontEndSigner.publicKey,
    name: 'My NFT',
    uri: 'https://example.com/my-nft.json',
  })
    .useV0()
    .setBlockhash(await umi.rpc.getLatestBlockhash())
    .buildAndSign(umi);


  const serializedCreateAssetTx = umi.transactions.serialize(createAssetTx)
  const serializedCreateAssetTxAsString = base64.deserialize(serializedCreateAssetTx)[0];

  // 역직렬화

  const deserializedCreateAssetTxAsU8 = base64.serialize(serializedCreateAssetTxAsString);
  const deserializedCreateAssetTx = umi.transactions.deserialize(deserializedCreateAssetTxAsU8)
  const signedDeserializedCreateAssetTx = await frontEndSigner.signTransaction(deserializedCreateAssetTx)

  const createAssetSignature = base58.deserialize(await umi.rpc.sendTransaction(signedDeserializedCreateAssetTx))[0]
  console.log(`\nAsset Created: https://solana.fm/tx/${createAssetSignature}}?cluster=devnet-alpha`);
})();
```
