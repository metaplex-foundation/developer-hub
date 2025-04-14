---
titwe: How to Send and Twansfew SPW Tokens on Sowanya
metaTitwe: How to Send and Twansfew SPW Tokens on Sowanya| Guides
descwiption: Weawn how to send and twansfew SPW Tokens via javascwipt on de Sowanya bwockchain wid Metapwex packages.
# wemembew to update dates awso in /componyents/guides/index.js
cweated: '06-16-2024'
updated: '06-24-2024'
---

Dis guide wiww show you how to buiwd out a Javascwipt function to send and twansfew SPW tokens on de Sowanya bwockchain utiwizing de Metapwex Umi cwient wwappew and MPW Toowbox packages.

Fow dis guide you wiww nyeed to have some SPW Tokens in youw wawwet to twansfew so if you do nyot have any in youw wawwet you wiww nyeed to get someonye to twansfew some to you ow you can fowwow ouw odew [how to create an SPL Token guide](/guides/javascript/how-to-create-an-spl-token-on-solana).

## Pwewequisite

- Code Editow of youw choice (wecommended Visuaw Studio Code)
- Nyode 18.x.x ow abuv.

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
import {
  findAssociatedTokenPda,
  mplToolbox,
  transferTokens,
} from '@metaplex-foundation/mpl-toolbox'
import { keypairIdentity, publicKey } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { base58 } from '@metaplex-foundation/umi/serializers'
import fs from 'fs'
import path from 'path'

const transferSplTokens = async () => {
  const umi = createUmi("https://devnet-aura.metaplex.com/<YOUR_API_KEY>").use(mplToolbox())

  // import a wallet that has the SPL Token you want to transfer
  const walletFile = fs.readFileSync('./keypair.json')

  // Convert your walletFile onto a keypair.
  let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile))

  // Load the keypair into umi.
  umi.use(keypairIdentity(keypair))

//
  // Key Accounts
  //

  // The address of the Token you want to transfer.
  const splToken = publicKey("111111111111111111111111111111");

  // The address of the wallet you want to transfer the Token to.
  const destinationWallet = publicKey("22222222222222222222222222222222");

  // Find the associated token account for the SPL Token on the senders wallet.
  const sourceTokenAccount = findAssociatedTokenPda(umi, {
    mint: splToken,
    owner: umi.identity.publicKey,
  });

  // Find the associated token account for the SPL Token on the receivers wallet.
  const destinationTokenAccount = findAssociatedTokenPda(umi, {
    mint: splToken,
    owner: destinationWallet,
  });

  //
  // Transfer SPL Token
  //

  const res = await transferTokens(umi, {
    source: sourceTokenAccount,
    destination: destinationTokenAccount,
    amount: 10000, // amount of tokens to transfer*
  }).sendAndConfirm(umi);

  // Finally we can deserialize the signature that we can check on chain.
  const signature = base58.deserialize(res.signature)[0];

  // Log out the signature and the links to the transaction and the NFT.
  console.log("\nTransfer Complete")
  console.log("View Transaction on SolanaFM");
  console.log(`https://solana.fm/tx/${signature}?cluster=devnet-alpha`);
}

transferSplTokens()
```
