---
title: Kit SDK 入门
metaTitle: Kit SDK | Token Metadata
description: 使用 Metaplex Token Metadata Kit SDK 开始使用 NFT。
---

**Kit SDK** (`@metaplex-foundation/mpl-token-metadata-kit`) 基于 `@solana/kit` 构建，提供用于与 Token Metadata 交互的函数式 API。 {% .lead %}

## 安装

```sh
npm install \
  @solana/kit \
  @metaplex-foundation/mpl-token-metadata-kit
```

## 设置

```ts
import { createSolanaRpc, createSolanaRpcSubscriptions, generateKeyPairSigner } from '@solana/kit';

// 创建 RPC 连接
const rpc = createSolanaRpc('https://api.devnet.solana.com');
const rpcSubscriptions = createSolanaRpcSubscriptions('wss://api.devnet.solana.com');

// 生成或加载密钥对
const authority = await generateKeyPairSigner();
```

### 交易助手

Kit SDK 返回的指令已将签名者附加到相关账户上。这允许您使用 `signTransactionMessageWithSigners`，它会自动提取并使用这些签名者：

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

  // 使用附加到指令账户的所有签名者进行签名
  const signedTransaction = await signTransactionMessageWithSigners(transactionMessage);

  const sendAndConfirmTx = sendAndConfirmTransactionFactory({ rpc, rpcSubscriptions });
  await sendAndConfirmTx(signedTransaction, { commitment: 'confirmed' });

  return getSignatureFromTransaction(signedTransaction);
}
```

## 创建 NFT

```ts
import { generateKeyPairSigner } from '@solana/kit';
import { createNft } from '@metaplex-foundation/mpl-token-metadata-kit';

// 生成密钥对
const mint = await generateKeyPairSigner();
const authority = await generateKeyPairSigner();

// 创建并铸造 NFT
const [createIx, mintIx] = await createNft({
  mint,
  authority,
  payer: authority,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: 550, // 5.5%
  tokenOwner: authority.address,
});

// 发送交易
const sx = await sendAndConfirm({
  instructions: [createIx, mintIx],
  payer: authority,
});

console.log('NFT created:', mint.address);
console.log('Signature:', sx);
```

## 获取 NFT

```ts
import { fetchDigitalAsset } from '@metaplex-foundation/mpl-token-metadata-kit';

const asset = await fetchDigitalAsset(rpc, mintAddress);

console.log('Name:', asset.metadata.name);
console.log('URI:', asset.metadata.uri);
console.log('Seller Fee:', asset.metadata.sellerFeeBasisPoints);
```

## 有用的链接

- [GitHub 仓库](https://github.com/metaplex-foundation/mpl-token-metadata)
- [NPM 包](https://www.npmjs.com/package/@metaplex-foundation/mpl-token-metadata-kit)
- [Solana Kit 文档](https://github.com/solana-labs/solana-web3.js)
