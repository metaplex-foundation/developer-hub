---
title: Kit SDK로 시작하기
metaTitle: Kit SDK | Token Metadata
description: Metaplex Token Metadata Kit SDK를 사용하여 NFT를 시작하세요.
---

**Kit SDK** (`@metaplex-foundation/mpl-token-metadata-kit`)는 `@solana/kit` 위에 구축되었으며 Token Metadata와 상호작용하기 위한 함수형 API를 제공합니다. {% .lead %}

## 설치

```sh
npm install \
  @solana/kit \
  @metaplex-foundation/mpl-token-metadata-kit
```

## 설정

```ts
import { createSolanaRpc, createSolanaRpcSubscriptions, generateKeyPairSigner } from '@solana/kit';

// RPC 연결 생성
const rpc = createSolanaRpc('https://api.devnet.solana.com');
const rpcSubscriptions = createSolanaRpcSubscriptions('wss://api.devnet.solana.com');

// 키페어 생성 또는 로드
const authority = await generateKeyPairSigner();
```

### 트랜잭션 헬퍼

Kit SDK는 `@solana/kit`를 사용하여 전송하는 인스트럭션을 반환합니다:

```ts
import {
  appendTransactionMessageInstructions,
  assertIsTransactionWithinSizeLimit,
  compileTransaction,
  createTransactionMessage,
  getSignatureFromTransaction,
  type Instruction,
  type KeyPairSigner,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransaction,
} from '@solana/kit';

async function sendAndConfirm(instructions: Instruction[], signers: KeyPairSigner[]) {
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();
  if (signers.length === 0) {
    throw new Error('At least one signer is required for fee payer.');
  }

  const transaction = pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => setTransactionMessageFeePayer(signers[0].address, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    (tx) => appendTransactionMessageInstructions(instructions, tx),
    (tx) => compileTransaction(tx),
  );

  const keyPairs = signers.map((s) => s.keyPair);
  const signedTransaction = await signTransaction(keyPairs, transaction);

  const sendAndConfirmTx = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });
  assertIsTransactionWithinSizeLimit(signedTransaction);
  await sendAndConfirmTx(signedTransaction, { commitment: 'confirmed' });
  return getSignatureFromTransaction(signedTransaction)
}
```

## NFT 생성

```ts
import { generateKeyPairSigner } from '@solana/kit';
import { createNft } from '@metaplex-foundation/mpl-token-metadata-kit';

// 키페어 생성
const mint = await generateKeyPairSigner();
const authority = await generateKeyPairSigner();

// NFT 생성 및 민트
const [createIx, mintIx] = await createNft({
  mint,
  authority,
  payer: authority,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: 550, // 5.5%
  tokenOwner: authority.address,
});

// 트랜잭션 전송
const sx = await sendAndConfirm([createIx, mintIx], [mint, authority]);

console.log('NFT created:', mint.address);
console.log('Signature:', sx);
```

## NFT 조회

```ts
import { fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata-kit';

const asset = await fetchDigitalAsset(rpc, mintAddress);

console.log('Name:', asset.metadata.name);
console.log('URI:', asset.metadata.uri);
console.log('Seller Fee:', asset.metadata.sellerFeeBasisPoints);
```

## 유용한 링크

- [GitHub 저장소](https://github.com/metaplex-foundation/mpl-token-metadata)
- [NPM 패키지](https://www.npmjs.com/package/@metaplex-foundation/mpl-token-metadata-kit)
- [Solana Kit 문서](https://github.com/solana-labs/solana-web3.js)
