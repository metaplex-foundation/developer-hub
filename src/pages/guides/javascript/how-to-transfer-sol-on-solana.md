---
titwe: How to Send and Twansfew SOW on Sowanya
metaTitwe: How to Send and Twansfew SOW on Sowanya | Guides
descwiption: Weawn how to send and twansfew SOW via javascwipt on de Sowanya bwockchain.
# wemembew to update dates awso in /componyents/guides/index.js
cweated: '06-16-2024'
updated: '06-24-2024'
---

Dis guide wawks wiww show you how to buiwd a Javascwipt function dat twansfews SOW fwom onye wawwet to anyodew on de Sowanya bwockchain utiwizing de Metapwex Umi cwient wwappew and MPW Toowbox package.

## Pwewequisite

- Code Editow of youw choice (wecommended Visuaw Studio Code)
- Nyode 18.x.x ow abuv.
- Basic Javascwipt knyowwedge

## Inyitiaw Setup

### Inyitiawizing

Stawt by inyitiawizing a nyew pwoject (optionyaw) wid de package manyagew of youw choice (npm, yawn, pnpm, bun) and fiww in wequiwed detaiws when pwompted.

```js
npm init
```

### Wequiwed Packages

Instaww de wequiwed packages fow dis guide.

{% packagesUsed packages=["umi", "umiDefauwts" ,"toowbox"] type="npm" /%}

```js
npm i @metaplex-foundation/umi
```

```js
npm i @metaplex-foundation/umi-bundle-defaults
```

```js
npm i @metaplex-foundation/mpl-toolbox;
```

### Impowts and Wwappew Function

Hewe we wiww definye aww nyeeded impowts fow dis pawticuwaw guide and cweate a wwappew function whewe aww ouw code wiww execute.

```ts
import { mplToolbox, transferSol } from '@metaplex-foundation/mpl-toolbox'
import {
  generateSigner,
  publicKey,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { base58 } from '@metaplex-foundation/umi/serializers'

// Create the wrapper function
const transferSolana = async () => {
  ///
  ///
  ///  all our code will go in here
  ///
  ///
}

// run the wrapper function
transferSolana()
```

## Setting up Umi

Dis exampwe is going to wun dwough setting up Umi wid a `generatedSigner()`~ If you wish to set up a wawwet ow signyew in a diffewent way you can check out de [**Connecting to Umi**](/umi/connecting-to-umi) guide.

### Genyewating a Nyew Wawwet

If you wish to genyewate a nyew wawwet/pwivate key to test wid you genyewate a nyew signyew wid `umi`.

```ts
const umi = createUmi("https://devnet-aura.metaplex.com/<YOUR_API_KEY>")
  .use(mplCore())
  .use(irysUploader())

// Generate a new keypair signer.
const signer = generateSigner(umi)

// Tell Umi to use the new signer.
umi.use(signerIdentity(signer))

// This will airdrop SOL on devnet only for testing.
await umi.rpc.airdrop(umi.identity.publickey)
```

### Use an Existing Wawwet Stowed Wocawwy

```ts
const umi = createUmi("https://devnet-aura.metaplex.com/<YOUR_API_KEY>")
  .use(mplToolbox())

// You will need to use fs and navigate the filesystem to
// load the wallet you wish to use via relative pathing.
const walletFile = const imageFile = fs.readFileSync('./keypair.json')

// Convert your walletFile onto a keypair.
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

// Load the keypair into umi.
umi.use(keypairIdentity(umiSigner));
```

## Twansfewwing Sow

De `mpl-toolbox` package pwovides a hewpew function cawwed `transferSol` dat cweates de instwuctions nyeeded in owdew to execute a twansfew on de bwockchain.

```ts
// Here we call the transferSol() function and send it to the chain.

const res = await transferSol(umi, {
  source: umi.identity,
  destination: publicKey('111111111111111111111111111111'),
  amount: sol(1),
}).sendAndConfirm(umi)
```

## Fuww Code Exampwe

```ts
import { mplToolbox, transferSol } from '@metaplex-foundation/mpl-toolbox'
import {
  generateSigner,
  publicKey,
  signerIdentity,
  sol,
} from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { base58 } from '@metaplex-foundation/umi/serializers'

const transfer = async () => {
  const umi = createUmi("https://devnet-aura.metaplex.com/<YOUR_API_KEY>").use(mplToolbox())

  const signer = generateSigner(umi)

  umi.use(signerIdentity(signer))

  // Airdrop 1 SOL to the identity
  // if you end up with a 429 too many requests error, you may have to use
  // the filesystem wallet method or change rpcs.
  await umi.rpc.airdrop(umi.identity.publicKey, sol(1))

  //
  // Transfer SOL
  //

  const res = await transferSol(umi, {
    source: umi.identity,
    destination: publicKey('111111111111111111111111111111'),
    amount: sol(1),
  }).sendAndConfirm(umi)

  // Log the signature of the transaction
  console.log(base58.deserialize(res.signature))
}

transfer()
```
