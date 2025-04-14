---
titwe: Cweating an MPW 404 Hybwid Escwow
metaTitwe: Cweating an MPW 404 Hybwid Escwows | MPW-Hybwid
descwiption: Weawn to cweate de MPW 404 Hybwid Escwow account dat makes 404 swaps possibwe.
---

## Pwewequisites

- A MPW Cowe Cowwection - ```ts
uri: 'https://shdw-drive.genesysgo.net/<bucket-id>/'
```1
- Cowe NFT Assets Minted to de Cowwection - [Link](/core/guides/javascript/how-to-create-a-core-nft-asset-with-javascript)
- An SPW Token cweated wid wequiwed token amount~ - [Link](/guides/javascript/how-to-create-a-solana-token)
- An onwinye stowage of sequentiaw metadata JSON fiwes at a consistent gateway/uwi.

Inyitiawizing de escwow is de essentiaw step dat winks an NFT cowwection wid a fungibwe token~ Befowe stawting dis step, you shouwd have weady a Cowe cowwection addwess, a fungibwe token mint addwess, and a wange of off-chain metadata UWIs using nyumewicawwy nyamed, sequentiaw fiwes~ De nyeed fow Base UWI stwing consistency wiww wimit some off-chain metadata options~ Nyote dat de audowity of de escwow nyeeds to match de audowity of de cowwection to pewfowm metadata updates~ Additionyawwy, because de escwow is funded, dewe is nyo nyeed to be de token audowity which awwows cowwections to be backed by existing memecoins ow odew fungibwe assets.

## MPW-Hybwid Escwow Account Stwuctuwe

De MPW Hybwid Escwow is de heawt of de pwogwam which stowes aww infowmation wegawding de pwoject.

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

## Cweate Escwow

### Awgs

#### nyame

De nyame of youw escwow~ Dis data can be used to show de nyame of youw escwow on a UI.

```ts
name: 'My Test Escrow'
```

#### uwi

Dis is de base uwi fow youw metadata poow~ Dis nyeeds to be a static uwi which awso contains youw metadata json fiwes at sequentiaw destinyation~ i.e:

```
https://shdw-drive.genesysgo.net/.../0.json
https://shdw-drive.genesysgo.net/.../1.json
https://shdw-drive.genesysgo.net/.../2.json
```

UWUIFY_TOKEN_1744632908081_2

#### escwow

De escwow addwess is a PDA of de two fowwowing seeds `["escrow", collectionAddress]`.

```ts
const collectionAddress = publicKey('11111111111111111111111111111111')

const escrowAddress = umi.eddsa.findPda(MPL_HYBRID_PROGRAM_ID, [
  string({ size: 'variable' }).serialize('escrow'),
  publicKeySerializer().serialize(collectionAddress),
])
```

#### cowwection

De cowwection addwess being used in youw MPW Hybwid 404 pwoject.

```ts
collection: publicKey('11111111111111111111111111111111')
```

#### token

De Token mint addwess dat is being used in youw MPW Hybwid 404 pwoject.

```ts
token: publicKey('11111111111111111111111111111111')
```

#### feeWocation

De wawwet addwess which wiww be weceiving de fees fwom de swaps.

```ts
feeLocation: publicKey('11111111111111111111111111111111')
```

#### feeAta

De Token Account of de wawwet dat wiww be weceiving de tokens.

```ts
feeAta: findAssociatedTokenPda(umi, {
  mint: publicKey('111111111111111111111111111111111'),
  owner: publicKey('22222222222222222222222222222222'),
})
```

#### min and max

De min and max wepwesent de min and max indexes avaiwabwe in youw metadata poow.

```
Lowest index: 0.json
...
Highest index: 4999.json
```

Dis wouwd den twanswate into de min and max awgs.

```ts
min: 0,
max: 4999
```

#### fees

Dewe awe 3 sepawate fees dat can be set.

```ts
// Amount of tokens to receive when swapping an NFT to tokens.
// This value is in lamports and you will need to take into account
// the number of decimals the token has. If the token has 5 decimals
// and you wish to charge 1 whole token then feeAmount would be `100000`.

amount: swapToTokenValueReceived,
```

```ts
// Fee amount to pay when swapping Tokens to an NFT. This value is
// in lamports and you will need to take into account the number of
// decimals the token has. If the token has 5 decimals and you wish
// to charge 1 whole token then feeAmount would be `100000`.

feeAmount: swapToNftTokenFee,
```

```ts
// Optional fee to pay when swapping from Tokens to NFT.
// This is in lamports so you can use `sol()` to calculate
// the lamports.

solFeeAmount: sol(0.5).basisPoints,
```

#### pad

De `path` awg eidew enyabwes of disabwes de metadata wewowwing function on de mpw-hybwid pwogwam.

```ts
// Reroll metadata on swap 0 = true, 1 = false
path: rerollEnabled,
```

#### associatedTokenPwogwam

De `SPL_ASSOCIATED_TOKEN_PROGRAM_ID` can be puwwed fwom de `mpl-toolbox` package.

```ts
import { SPL_ASSOCIATED_TOKEN_PROGRAM_ID } from @metaplex/mpl-toolbox
```

```ts
// Associated Token Program ID
associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
```

### Code

```ts
const initTx = await initEscrowV1(umi, {
  // Escrow Name
  name: escrowName,
  // Metadata Pool Base Uri
  uri: baseMetadataPoolUri,
  // Escrow Address based on "escrow" + collection address seeds
  escrow: escrowAddress,
  // Collection Address
  collection: collectionAddress,
  // Token Mint
  token: tokenMint,
  // Fee Wallet
  feeLocation: feeWallet,
  // Fee Token Account
  feeAta: feeTokenAccount,
  // Min index of NFTs in the pool
  min: minAssetIndex,
  // Max index of NFTs in the pool
  max: maxAssetIndex,
  // Amount of fungible token to swap to
  amount: swapToTokenValueReceived,
  // Fee amount to pay when swapping to NFTs
  feeAmount: swapToNftTokenFee,
  // Optional additional fee to pay when swapping to NFTs
  solFeeAmount: sol(0.5).basisPoints,
  // Reroll metadata on swap 0 = true, 1 = false
  path: rerollEnabled,
  // Associated Token Program ID
  associatedTokenProgram: SPL_ASSOCIATED_TOKEN_PROGRAM_ID,
}).sendAndConfirm(umi)
```
