---
title: 스와핑
metaTitle: 스와핑 | MPL-Hybrid
description: MPL-404 스와핑
---

## Capture: 대체 불가능한 자산으로 스왑

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

// THIS IS USING A LOCAL KEYPAIR
const parsed_wallet = JSON.parse(fs.readFileSync('<PATH TO KEYPAIR>', 'utf-8'))
const kp_wallet = umi.eddsa.createKeypairFromSecretKey(
  new Uint8Array(parsed_wallet)
)

umi.use(keypairIdentity(kp_wallet))
umi.use(mplHybrid())
umi.use(mplTokenMetadata())

const COLLECTION = publicKey('<INSERT COLLECTION ACCOUNT/NFT ADDRESS>')
const TOKEN = publicKey('<INSERT TOKEN ADDRESS>') // THE TOKEN TO BE DISPENSED
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
// WITH METADATA REROLLING, ANY ESCROW ASSET IS EFFECTIVELY THE SAME. WE CAN JUST USE THE FIRST ONE
// WITHOUT METADATA REROLLING A USER COULD CHOOSE TO RECEIVE A SPECIFIC ASSET

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

## Release: 대체 가능한 자산으로 스왑

```ts
import { ... releaseV1 } from '@metaplex-foundation/mpl-hybrid'

... (see above code)

const ownedAssets = assetsByCollection.filter(a => a.owner === umi.identity.publicKey )
// TYPICALLY A USER WOULD CHOOSE A SPECIFIC ASSET THE WOULD LIKE TO SWAP TO TOKENS

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
