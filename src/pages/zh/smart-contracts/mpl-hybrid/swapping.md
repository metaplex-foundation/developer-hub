---
title: 交换
metaTitle: 交换 | MPL-Hybrid
description: MPL-404交换
---

## 捕获：交换为非同质化资产

```ts
import fs from 'fs'
import bs58 from 'bs58'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi'
import {
  mplHybrid,
  MPL_HYBRID_PROGRAM_ID,
  captureV1,
} from '@metaplex-foundation/mpl-hybrid'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import {
  string,
  publicKey as publicKeySerializer,
} from '@metaplex-foundation/umi/serializers'
import { fetchAssetsByCollection } from '@metaplex-foundation/mpl-core'

const RPC = '<INSERT RPC>'
const umi = createUmi(RPC)

// 这使用本地密钥对
const parsed_wallet = JSON.parse(fs.readFileSync('<PATH TO KEYPAIR>', 'utf-8'))
const kp_wallet = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(parsed_wallet)
)

umi.use(keypairIdentity(kp_wallet))
umi.use(mplHybrid())
umi.use(mplTokenMetadata())

const COLLECTION = publicKey('<INSERT COLLECTION ACCOUNT/NFT ADDRESS>')
const TOKEN = publicKey('<INSERT TOKEN ADDRESS>') // 要分发的代币
const FEE_WALLET = publicKey('<INSERT FEE WALLET>')

const ESCROW = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
  string({ size: 'variable' }).serialize('escrow'),
  publicKeySerializer().serialize(COLLECTION),
])

const assetsByCollection = await fetchAssetsByCollection(umi, COLLECTION, {
  skipDerivePlugins: false,
})
const escrowAssets = assetsByCollection.filter(
  (a) => a.owner === publicKey(ESCROW)
)
// 使用元数据重掷，任何托管资产实际上都是相同的。我们可以只使用第一个
// 没有元数据重掷，用户可以选择接收特定资产

const captureData = {
  owner: umi.identity,
  payer: umi.identity,
  escrow: ESCROW,
  asset: escrowAssets[0].publicKey,
  collection: COLLECTION,
  feeProjectAccount: FEE_WALLET,
  token: TOKEN,
}

const captureTx = await captureV1(umi, captureData).sendAndConfirm(umi)

console.log(bs58.encode(captureTx.signature))
```

## 释放：交换为同质化资产

```ts
import { ... releaseV1 } from '@metaplex-foundation/mpl-hybrid'

... (参见上面的代码)

const ownedAssets = assetsByCollection.filter(a => a.owner === umi.identity.publicKey )
// 通常用户会选择他们想要交换为代币的特定资产

const releaseData = {
  owner: umi.identity,
  escrow: ESCROW,
  asset: ownedAssets[0].publicKey,
  collection: COLLECTION,
  feeProjectAccount: FEE_WALLET,
  token: TOKEN
}

const releaseTx = await releaseV1(umi, releaseData).sendAndConfirm(umi)

console.log(bs58.encode(releaseTx.signature))
```
