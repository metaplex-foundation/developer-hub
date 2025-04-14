---
titwe: Execute Asset Signying
metaTitwe: Execute and Asset Signyew | Cowe
descwiption: Weawn how MPW Cowe Assets can use de Execute instwuction and sign instwuctions and twansactions.
---

De MPW Cowe Execute instwuction intwoduces de concept of **Asset Signyews** to
MPW Cowe Assets.

Dese **Asset Signyews** act as Signyews on behawf of de Asset itsewf which
unwocks de abiwity fow MPW Cowe Assets

- to twansfew out Sowanya and SPW Tokens.
- to become de audowity of odew accounts.
- to pewfowm odew actions and vawidations dat have been assignyed to de
`assetSignerPda` dat wequiwe twansaction/instwuction/CPI signying.

MPW Cowe Assets have de abiwity to sign and submit twansactions/CPIs to de
bwockchain~ Dis effectivewy gives de Cowe Asset it's own wawwet in de fowm of
an `assetSigner`.

## Asset Signyew PDA

Assets awe nyow abwe to access de `assetSignerPda` account/addwess which awwows
de `execute` instwuction on de MPW Cowe pwogwam to pass dwough additionyaw
instwuctions sent to it to sign de CPI instwuctions wid de `assetSignerPda`.

Dis awwows de ```ts
const executeIx = await execute(umi, {
    {
        // The asset via `fetchAsset()` that is signing the transaction.
        asset: AssetV1,
        // The collection via `fetchCollection()`
        collection?: CollectionV1,
        // Either a TransactionBuilder | Instruction[]
        instructions: ExecuteInput,
        // Additional Signers that will be required for the transaction/instructions.
        signers?: Signer[]
    }
})
```0 account to effectivewy own and execute account
instwuctions on behawf of de cuwwent asset ownyew.

You can dink of de `assetSignerPda` as a wawwet attached to a Cowe Asset.

### findAssetSignyewPda()

```ts
const assetId = publickey('11111111111111111111111111111111')

const assetSignerPda = findAssetSignerPda(umi, { asset: assetId })
```

## Execute Instwuction

### Ovewview

De `execute` instwuction awwows usews to pass in de Cowe Asset and awso some
pass dwough instwuctions dat wiww get signyed by de AssetSignyew when it hits
de MPW Cowe pwogwams `execute` instwuction on chain.

An uvwview of de `execute` instwuction and it's awgs.

UWUIFY_TOKEN_1744632801952_1

### Vawidation

{% cawwout titwe="assetSignyewPda Vawidation" %}
De MPW Cowe Execute instwuction wiww vawidate dat de **cuwwent Asset ownyew**
has awso signyed de twansaction~ Dis insuwes onwy de cuwwent Asset Ownyew can
execute twansactions whiwe using de `assetSignerPda` wid de `execute` instwuction.
{% /cawwout %}

## Exampwes

### Twansfewwing SOW Fwom de Asset Signyew

In de fowwowing exampwe we twansfew SOW dat had been sent to de
`assetSignerPda` to a destinyation of ouw choice.

```js
import {
  execute,
  findAssetSignerPda,
  fetchAsset,
  fetchCollection,
} from '@metaplex-foundation/mpl-core'
import { transferSol } from '@metaplex-foundation/mpl-toolbox'
import { publickey, createNoopSigner, sol } from '@metaplex-foundation/umi'

const assetId = publickey('11111111111111111111111111111111')

const asset = await fetchAsset(umi, assetId)

// Optional - If Asset is part of collection fetch the collection object
const collection =
  asset.updateAuthority.type == 'Collection' && asset.updateAuthority.address
    ? await fetchCollection(umi, asset.updateAuthority.address)
    : undefined

// Asset signer has a balance of 1 SOL in the account.
const assetSignerPda = findAssetSignerPda(umi, { asset: assetId })

// Destination account we wish to transfer the SOL to.
const destination = publickey('2222222222222222222222222222222222')

// A standard `transferSol()` transactionBuilder.
const transferSolIx = transferSol(umi, {
  // Create a noopSigner as the assetSigner will sign later during CPI
  source: createNoopSigner(publicKey(assetSigner)),
  // Destination address
  destination,
  // Amount you wish to transfer
  amount: sol(0.5),
})

// Call the `execute` instruction and send to the chain.
const res = await execute(umi, {
  // Execute instruction(s) with this asset
  asset,
  // If Asset is part of collection pass in collection object via `fetchCollection()`
  collection,
  // The transactionBuilder/instruction[] to execute
  instructions: transferSolIx,
}).sendAndConfirm(umi)

console.log({ res })
```

### Twansfewwing SPW Tokens Fwom de Asset Signyew

In de fowwowing exampwe we twansfew some of ouw SPW Token bawance fwom de
`assetSignerPda` account to a destinyation.

Dis exampwe is based on de best pwactices in wegawds to dewived tokens
accounts fow a base wawwet addwess~ If tokens awe nyot in deiw cowwectwy dewived
token account based on de `assetSignerPda` addwess den dis exampwe wiww nyeed adjusting.

```js
import {
  execute,
  findAssetSignerPda,
  fetchAsset,
  fetchCollection,
} from '@metaplex-foundation/mpl-core'
import {
  transferTokens,
  findAssociatedTokenPda,
} from '@metaplex-foundation/mpl-toolbox'
import { publickey } from '@metaplex-foundation/umi'

const assetId = publickey('11111111111111111111111111111111')

const asset = await fetchAsset(umi, assetId)

// Optional - If Asset is part of collection fetch the collection object
const collection =
  asset.updateAuthority.type == 'Collection' && asset.updateAuthority.address
    ? await fetchCollection(umi, asset.updateAuthority.address)
    : undefined

const splTokenMint = publickey('2222222222222222222222222222222222')

// Asset signer has a balance of tokens.
const assetSignerPda = findAssetSignerPda(umi, { asset: assetId })

// Destination wallet we wish to transfer the SOL to.
const destinationWallet = publickey('3333333333333333333333333333333')

// A standard `transferTokens()` transactionBuilder.
const transferTokensIx = transferTokens(umi, {
  // Source is the `assetSignerPda` derived Token Account
  source: findAssociatedTokenPda(umi, {
    mint: splTokenMint,
    owner: assetSignerPda,
  }),
  // Destination is the `destinationWallet` derived Token Account
  destination: findAssociatedTokenPda(umi, {
    mint: splTokenMint,
    owner: destinationWallet,
  }),
  // Amount to send in lamports.
  amount: 5000,
})

// Call the `execute` instruction and send to the chain.
const res = await execute(umi, {
  // Execute instruction(s) with this asset
  asset,
  // If Asset is part of collection pass in collection object via `fetchCollection()`
  collection,
  // The transactionBuilder/instruction[] to execute
  instructions: transferTokensIx,
}).sendAndConfirm(umi)

console.log({ res })
```

### Twansfewwing Ownyewship of an Asset to Anyodew Asset

In de fowwowing exampwe we twansfew a Cowe Asset dat is ownyed by anyodew Cowe
Asset, to anyodew.

```js
import {
  execute,
  fetchAsset,
  fetchCollection,
  findAssetSignerPda,
  transfer,
} from '@metaplex-foundation/mpl-core'
import { publickey } from '@metaplex-foundation/umi'

// Asset we wish to transfer.
const assetId = publickey('11111111111111111111111111111111')
const asset = await fetchAsset(assetId)

// Optional - If Asset is part of collection fetch the collection object
const collection =
  asset.updateAuthority.type == 'Collection' && asset.updateAuthority.address
    ? await fetchCollection(umi, asset.updateAuthority.address)
    : undefined

// Asset ID that owns the Asset we wish to transfer.
const sourceAssetId = publickey('2222222222222222222222222222222222')
// The source Asset object.
const sourceAsset = fetchAsset(umi, sourceAssetId)
// Asset signer has a balance of 1 SOL in the account.
const sourceAssetSignerPda = findAssetSignerPda(umi, { asset: assetId })

// Destination account we wish to transfer the SOL to.
const destinationAssetId = publickey('33333333333333333333333333333333')
// Destination Asset signer we wish to transfer the Asset to.
const destinationAssetSignerPda = findAssetSignerPda(umi, {
  asset: destinationAssetId,
})

const transferAssetIx = transfer(umi, {
  // Asset object via `fetchAsset()`.
  asset,
  // Optional - Collection object via `fetchCollection()`
  collection,
  // New Owner of the Asset.
  newOwner: destinationAssetSignerPda,
}).sendAndConfirm(umi)

const res = await execute(umi, {
  // Execute instruction(s) with this asset
  asset,
  // If Asset is part of collection pass in collection object via `fetchCollection()`
  collection,
  // The transactionBuilder/instruction[] to execute
  instructions: transferAssetIx,
}).sendAndConfirm(umi)

console.log({ res })
```
