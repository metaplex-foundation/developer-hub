---
title: Initializing Escrow
metaTitle: Initializing Escrow | MPL-Hybrid
description: Initializing MPL-Hybrid Escrow
---

## MPL-Hybrid Escrow

Initializing the escrow is the essential step that links an NFT collection with a fungible token. Before starting this step, you should have ready a Core collection address, a fungible token mint address, and a range of off-chain metadata URIs using numerically named, sequential files. The need for Base URI string consistency will limit some off-chain metadata options. Note that the authority of the escrow needs to match the authority of the collection to perform metadata updates. Additionally, because the escrow is funded, there is no need to be the token authority which allows collections to be backed by existing memecoins or other fungible assets.

## MPL-Hybrid Escrow Account Structure

{% totem %}
{% totem-accordion title="On Chain MPL-404 Escrow Data Structure" %}

The onchain account structure of an MPL-404 Escrow [on GitHub](https://github.com/metaplex-foundation/mpl-hybrid/blob/main/programs/mpl-hybrid/src/state/escrow.rs)

| Name           | Type   | Size | Description                                      |     |
| -------------- | ------ | ---- | ------------------------------------------------ | --- |
| collection     | Pubkey | 32   | The collection account                           |     |
| authority      | Pubkey | 32   | The authority of the Escrow                      |     |
| token          | Pubkey | 32   | The fungible token to be dispensed               |     |
| fee_location   | Pubkey | 32   | The account to send token fees to                |     |
| name           | String | 4    | The NFT name                                     |     |
| uri            | String | 8    | The base uri for the NFT metadata                |     |
| max            | u64    | 8    | The max index of NFTs that append to the uri     |     |
| min            | u64    | 8    | The minimum index of NFTs that append to the uri |     |
| amount         | u64    | 8    | The token cost to swap                           |     |
| fee_amount     | u64    | 8    | The token fee for capturing the NFT              |     |
| sol_fee_amount | u64    | 8    | The sol fee for capturing the NFT                |     |
| count          | u64    | 8    | The total number of swaps                        |     |
| path           | u16    | 1    | The onchain/off-chain metadata update path       |     |
| bump           | u8     | 1    | The escrow bump                                  |     |

{% /totem-accordion %}
{% /totem %}

## Initializing the MPL-404 Smart Escrow

```ts
import fs from 'fs'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi'
import {
  mplHybrid,
  MPL_HYBRID_PROGRAM_ID,
  initEscrowV1,
} from '@metaplex-foundation/mpl-hybrid'
import { mplTokenMetadata } from '@metaplex-foundation/mpl-token-metadata'
import {
  string,
  publicKey as publicKeySerializer,
} from '@metaplex-foundation/umi/serializers'
import {
  findAssociatedTokenPda,
  SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@metaplex-foundation/mpl-toolbox'

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

const ESCROW_NAME = '<INSERT ESCROW NAME>'
const COLLECTION = publicKey('<INSERT COLLECTION ACCOUNT/NFT ADDRESS>')
const TOKEN = publicKey('<INSERT TOKEN ADDRESS>') // THE TOKEN TO BE DISPENSED

// METADATA POOL INFO
// EX. BASE_URI: https://shdw-drive.genesysgo.net/EjNJ6MKKn3mkVbWJL2NhJTyxne6KKZDTg6EGUtJCnNY3/
const BASE_URI = '<INSERT BASE_URI>' // required to support metadata updating on swap

// MIN & MAX DEFINE THE RANGE OF URI METADATA TO PICK BETWEEN
const MIN = 0 // I.E. https://shdw-drive.genesysgo.net/.../0.json
const MAX = 9999 // I.E. https://shdw-drive.genesysgo.net/.../9999.json

// FEE INFO
const FEE_WALLET = publicKey('<INSERT FEE WALLET>')
const FEE_ATA = findAssociatedTokenPda(umi, { mint: TOKEN, owner: FEE_WALLET })

const TOKEN_SWAP_BASE_AMOUNT = 1 // USERS RECEIVE THIS AMOUNT WHEN SWAPPING TO FUNGIBLE TOKENS
const TOKEN_SWAP_FEE_AMOUNT = 1 // USERS PAY THIS ADDITIONAL AMOUNT WHEN SWAPPING TO NFTS
const TOKEN_SWAP_FEE_DECIMALS = 9 // NUMBER OF DECIMALS IN YOUR TOKEN. DEFAULT ON TOKEN CREATION IS 9.
const SOL_SWAP_FEE_AMOUNT = 0 // OPTIONAL ADDITIONAL SOLANA FEE TO PAY WHEN SWAPPING TO NFTS

// CURRENT PATH OPTIONS:
// 0-- NFT METADATA IS UPDATED ON SWAP
// 1-- NFT METADATA IS NOT UPDATED ON SWAP
const PATH = 0

const ESCROW = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
  string({ size: 'variable' }).serialize('escrow'),
  publicKeySerializer().serialize(COLLECTION),
])

const addZeros = (num: number, numZeros: number) => {
  return num * Math.pow(10, numZeros)
}

const escrowData = {
  escrow: ESCROW,
  collection: COLLECTION,
  token: TOKEN,
  feeLocation: FEE_WALLET,
  name: ESCROW_NAME,
  uri: BASE_URI,
  max: MAX,
  min: MIN,
  amount: addZeros(TOKEN_SWAP_BASE_AMOUNT, TOKEN_SWAP_FEE_DECIMALS),
  feeAmount: addZeros(TOKEN_SWAP_FEE_AMOUNT, TOKEN_SWAP_FEE_DECIMALS),
  solFeeAmount: addZeros(SOL_SWAP_FEE_AMOUNT, 9), // SOL HAS 9 DECIMAL PLACES
  path: PATH,
  feeAta: FEE_ATA,
  associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
}

const initTx = await initEscrowV1(umi, escrowData).sendAndConfirm(umi)

console.log(bs58.encode(initTx.signature))
```

## Funding your Escrow

The next step before the smart-swap is live it to fund the escrow. Typically if a project wants to ensure the escrow always stays funded, they start by releasing all of the NFTs or tokens and then placing all of the other assets in the escrow. This ensures that every outstanding asset is "backed" by the counter-asset in the escrow. Because the Escrow is a PDA, loading it via wallets is not widely supported. You can use the below code to transfer assets into your escrow.

```ts
import { transferV1, TokenStandard } from '@metaplex-foundation/mpl-token-metadata'
import { keypairIdentity, publicKey, createSignerFromKeypair } from '@metaplex-foundation/umi'

... (SEE ABOVE CODE)

// THIS IS USING A LOCAL KEYPAIR
const parsed_wallet = JSON.parse(fs.readFileSync('< PATH TO KEYPAIR >', 'utf-8'))
const kp_wallet = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(parsed_wallet))
const token_owner = createSignerFromKeypair(umi, kp_wallet)

const TOKEN_TRANSFER_AMOUNT = 10000
const TOKEN_DECIMALS = 9

const transferData = {
  mint: TOKEN,
  amount: addZeros(TOKEN_TRANSFER_AMOUNT, TOKEN_DECIMALS),
  authority: token_owner,
  tokenOwner: kp_wallet.publicKey,
  destinationOwner: ESCROW,
  tokenStandard: TokenStandard.NonFungible,
}

const transferIx = await transferV1(umi, transferData).sendAndConfirm(umi)

console.log(bs58.encode(transferIx.signature))

```

## Updating your Escrow

Updating your escrow is easy as it's essentially the same code as initializing it, just with the updateEscrow function instead of the initEscrow function.

```ts
import { mplHybrid, updateEscrowV1 } from '@metaplex-foundation/mpl-hybrid'

... (SEE ABOVE CODE)

const updateTx = await updateEscrowV1(umi, escrowData).sendAndConfirm(umi)

console.log(bs58.encode(updateTx.signature))
```
