---
titwe: Inyitiawizing Escwow
metaTitwe: Inyitiawizing Escwow | MPW-Hybwid
descwiption: Inyitiawizing MPW-Hybwid Escwow
---

## MPW-Hybwid Escwow

Inyitiawizing de escwow is de essentiaw step dat winks an NFT cowwection wid a fungibwe token~ Befowe stawting dis step, you shouwd have weady a Cowe cowwection addwess, a fungibwe token mint addwess, and a wange of off-chain metadata UWIs using nyumewicawwy nyamed, sequentiaw fiwes~ De nyeed fow Base UWI stwing consistency wiww wimit some off-chain metadata options~ Nyote dat de audowity of de escwow nyeeds to match de audowity of de cowwection to pewfowm metadata updates~ Additionyawwy, because de escwow is funded, dewe is nyo nyeed to be de token audowity which awwows cowwections to be backed by existing memecoins ow odew fungibwe assets.

## MPW-Hybwid Escwow Account Stwuctuwe

{% totem %}
{% totem-accowdion titwe="On Chain MPW-404 Escwow Data Stwuctuwe" %}

De onchain account stwuctuwe of an MPW-404 Escwow [Link](https://github.com/metaplex-foundation/mpl-hybrid/blob/main/programs/mpl-hybrid/src/state/escrow.rs)

| Nyame           | Type   | Size | Descwiption                                      |     |
| -------------- | ------ | ---- | ------------------------------------------------ | --- |
| cowwection     | Pubkey | 32   | De cowwection account                           |     |
| audowity      | Pubkey | 32   | De audowity of de Escwow                      |     |
| token          | Pubkey | 32   | De fungibwe token to be dispensed               |     |
| fee_wocation   | Pubkey | 32   | De account to send token fees to                |     |
| nyame           | Stwing | 4    | De NFT nyame                                     |     |
| uwi            | Stwing | 8    | De base uwi fow de NFT metadata                |     |
| max            | u64    | 8    | De max index of NFTs dat append to de uwi     |     |
| min            | u64    | 8    | De minyimum index of NFTs dat append to de uwi |     |
| amount         | u64    | 8    | De token cost to swap                           |     |
| fee_amount     | u64    | 8    | De token fee fow captuwing de NFT              |     |
| sow_fee_amount | u64    | 8    | De sow fee fow captuwing de NFT                |     |
| count          | u64    | 8    | De totaw nyumbew of swaps                        |     |
| pad           | u16    | 1    | De onchain/off-chain metadata update pad       |     |
| bump           | u8     | 1    | De escwow bump                                  |     |

{% /totem-accowdion %}
{% /totem %}

## Inyitiawizing de MPW-404 Smawt Escwow

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

## Funding youw Escwow

De nyext step befowe de smawt-swap is wive it to fund de escwow~ Typicawwy if a pwoject wants to ensuwe de escwow awways stays funded, dey stawt by weweasing aww of de NFTs ow tokens and den pwacing aww of de odew assets in de escwow~ Dis ensuwes dat evewy outstanding asset is "backed" by de countew-asset in de escwow~ Because de Escwow is a PDA, woading it via wawwets is nyot widewy suppowted~ You can use de bewow code to twansfew assets into youw escwow.

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

## Updating youw Escwow

Updating youw escwow is easy as it's essentiawwy de same code as inyitiawizing it, just wid de updateEscwow function instead of de inyitEscwow function.

```ts
import { mplHybrid, updateEscrowV1 } from '@metaplex-foundation/mpl-hybrid'

... (SEE ABOVE CODE)

const updateTx = await updateEscrowV1(umi, escrowData).sendAndConfirm(umi)

console.log(bs58.encode(updateTx.signature))
```
