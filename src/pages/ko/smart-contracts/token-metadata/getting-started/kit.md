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

Kit SDK는 관련 계정에 서명자가 이미 첨부된 인스트럭션을 반환합니다. 이를 통해 `signTransactionMessageWithSigners`를 사용할 수 있으며, 이 함수는 자동으로 서명자를 추출하여 사용합니다:

```ts
import {
  appendTransactionMessageInstructions,
  createTransactionMessage,
  getSignatureFromTransaction,
  type Instruction,
  type TransactionSigner,
  pipe,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from '@solana/kit';

async function sendAndConfirm(options: {
  instructions: Instruction[];
  payer: TransactionSigner;
}) {
  const { instructions, payer } = options;
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

  const transactionMessage = pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => setTransactionMessageFeePayer(payer.address, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    (tx) => appendTransactionMessageInstructions(instructions, tx),
  );

  // 인스트럭션 계정에 첨부된 모든 서명자로 서명
  const signedTransaction = await signTransactionMessageWithSigners(transactionMessage);

  const sendAndConfirmTx = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });
  await sendAndConfirmTx(signedTransaction, { commitment: 'confirmed' });

  return getSignatureFromTransaction(signedTransaction);
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
const sx = await sendAndConfirm({
  instructions: [createIx, mintIx],
  payer: authority,
});

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
