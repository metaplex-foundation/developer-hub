---
title: Kit SDKを使用したはじめに
metaTitle: Kit SDK | Token Metadata
description: Metaplex Token Metadata Kit SDKを使用してNFTの開発を始めましょう。
---

**Kit SDK** (`@metaplex-foundation/mpl-token-metadata-kit`) は `@solana/kit` をベースに構築されており、Token Metadataとやり取りするための関数型APIを提供します。 {% .lead %}

## インストール

```sh
npm install \
  @solana/kit \
  @metaplex-foundation/mpl-token-metadata-kit
```

## セットアップ

```ts
import { createSolanaRpc, createSolanaRpcSubscriptions, generateKeyPairSigner } from '@solana/kit';

// RPC接続を作成
const rpc = createSolanaRpc('https://api.devnet.solana.com');
const rpcSubscriptions = createSolanaRpcSubscriptions('wss://api.devnet.solana.com');

// キーペアを生成またはロード
const authority = await generateKeyPairSigner();
```

### トランザクションヘルパー

Kit SDKは、関連するアカウントに署名者が既にアタッチされたインストラクションを返します。これにより、`signTransactionMessageWithSigners`を使用でき、署名者は自動的に抽出されて使用されます：

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

  // インストラクションアカウントにアタッチされたすべての署名者で署名
  const signedTransaction = await signTransactionMessageWithSigners(transactionMessage);

  const sendAndConfirmTx = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });
  await sendAndConfirmTx(signedTransaction, { commitment: 'confirmed' });

  return getSignatureFromTransaction(signedTransaction);
}
```

## NFTの作成

```ts
import { generateKeyPairSigner } from '@solana/kit';
import { createNft } from '@metaplex-foundation/mpl-token-metadata-kit';

// キーペアを生成
const mint = await generateKeyPairSigner();
const authority = await generateKeyPairSigner();

// NFTを作成してミント
const [createIx, mintIx] = await createNft({
  mint,
  authority,
  payer: authority,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: 550, // 5.5%
  tokenOwner: authority.address,
});

// トランザクションを送信
const sx = await sendAndConfirm({
  instructions: [createIx, mintIx],
  payer: authority,
});

console.log('NFT created:', mint.address);
console.log('Signature:', sx);
```

## NFTの取得

```ts
import { fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata-kit';

const asset = await fetchDigitalAsset(rpc, mintAddress);

console.log('Name:', asset.metadata.name);
console.log('URI:', asset.metadata.uri);
console.log('Seller Fee:', asset.metadata.sellerFeeBasisPoints);
```

## 役立つリンク

- [GitHubリポジトリ](https://github.com/metaplex-foundation/mpl-token-metadata)
- [NPMパッケージ](https://www.npmjs.com/package/@metaplex-foundation/mpl-token-metadata-kit)
- [Solana Kitドキュメント](https://github.com/solana-labs/solana-web3.js)
