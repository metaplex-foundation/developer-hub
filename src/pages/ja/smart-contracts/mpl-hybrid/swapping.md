---
title: スワッピング
metaTitle: スワッピング | MPL-Hybrid
description: MPL-404スワッピング
---

## キャプチャ: 非代替可能アセットへのスワッピング

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

// これはローカルキーペアを使用しています
const parsed_wallet = JSON.parse(fs.readFileSync('<PATH TO KEYPAIR>', 'utf-8'))
const kp_wallet = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(parsed_wallet)
)

umi.use(keypairIdentity(kp_wallet))
umi.use(mplHybrid())
umi.use(mplTokenMetadata())

const COLLECTION = publicKey('<INSERT COLLECTION ACCOUNT/NFT ADDRESS>')
const TOKEN = publicKey('<INSERT TOKEN ADDRESS>') // 配布されるトークン
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
// メタデータリロールでは、どのエスクローアセットも効果的に同じです。最初のアセットを使用できます
// メタデータリロールなしでは、ユーザーは受け取る特定のアセットを選択できます

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

## リリース: 代替可能アセットへのスワッピング

```ts
import { ... releaseV1 } from '@metaplex-foundation/mpl-hybrid'

... (上記のコードを参照)

const ownedAssets = assetsByCollection.filter(a => a.owner === umi.identity.publicKey )
// 通常、ユーザーはトークンにスワップしたい特定のアセットを選択します

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