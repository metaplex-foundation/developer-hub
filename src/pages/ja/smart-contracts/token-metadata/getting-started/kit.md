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
import { createSolanaRpc } from '@solana/rpc';
import { createSolanaRpcSubscriptions } from '@solana/rpc-subscriptions';
import { generateKeyPairSigner } from '@solana/signers';

// RPC接続を作成
const rpc = createSolanaRpc('https://api.devnet.solana.com');
const rpcSubscriptions = createSolanaRpcSubscriptions('wss://api.devnet.solana.com');

// キーペアを生成またはロード
const authority = await generateKeyPairSigner();
```

### トランザクションヘルパー

Kit SDKは `@solana/kit` を使用して送信するインストラクションを返します：

```ts
import { pipe } from '@solana/functional';
import {
  appendTransactionMessageInstructions,
  createTransactionMessage,
  setTransactionMessageFeePayer,
  setTransactionMessageLifetimeUsingBlockhash,
} from '@solana/transaction-messages';
import {
  compileTransaction,
  signTransaction,
  sendAndConfirmTransactionFactory,
} from '@solana/kit';

async function sendAndConfirm(instructions, signers) {
  const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

  const transactionMessage = pipe(
    createTransactionMessage({ version: 0 }),
    (tx) => setTransactionMessageFeePayer(signers[0].address, tx),
    (tx) => setTransactionMessageLifetimeUsingBlockhash(latestBlockhash, tx),
    (tx) => appendTransactionMessageInstructions(instructions, tx)
  );

  const transaction = compileTransaction(transactionMessage);
  const keyPairs = signers.map((s) => s.keyPair);
  const signedTransaction = await signTransaction(keyPairs, transaction);

  const sendAndConfirmTx = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });
  await sendAndConfirmTx(signedTransaction, { commitment: 'confirmed' });
}
```

## NFTの作成

```ts
import { generateKeyPairSigner } from '@solana/signers';
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
await sendAndConfirm([createIx, mintIx], [mint, authority]);

console.log('NFT created:', mint.address);
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
