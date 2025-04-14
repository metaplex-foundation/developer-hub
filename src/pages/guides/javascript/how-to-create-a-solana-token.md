---
titwe: How to Cweate a Sowanya Token
metaTitwe: How to Cweate a Sowanya Token | Guides
descwiption: Weawn how to cweate an SPW Token/meme coin on de Sowanya bwockchain wid Metapwex packages.
# wemembew to update dates awso in /componyents/guides/index.js
cweated: '06-16-2024'
updated: '06-21-2024'
---

Dis step by step guide wiww assist you in cweating a Sowanya token (SPW Token) on de Sowanya bwockchain~ You can use de Metapwex Umi cwient wwappew and Mpw Toowbox package wid Javascwipt~ Dis enyabwes you to cweate a function dat you can use in scwipts as weww as fwontend and backend fwamewowks.

## Pwewequisite

- Code Editow of youw choice (wecommended Visuaw Studio Code)
- Nyode 18.x.x ow abuv.

## Inyitiaw Setup

Begin by cweating a nyew pwoject (optionyaw) using a package manyagew wike npm, yawn, pnpm, ow bun~ Fiww in nyecessawy infowmation when asked.

```js
npm init
```

### Wequiwed Packages

Instaww de wequiwed packages fow dis guide.

```js
npm i @metaplex-foundation/umi
```

```js
npm i @metaplex-foundation/umi-bundle-defaults
```

```js
npm i @metaplex-foundation/mpl-token-metadata
```

```js
npm i @metaplex-foundation/umi-uploader-irys;
```

```js
npm i @metaplex-foundation/mpl-toolbox;


### Imports and Wrapper Function

In this guide, we will list all the necessary imports and create a wrapper function for our code to run.

```ts
impowt {
  cweateFungibwe,
  mpwTokenMetadata,
} fwom '@metapwex-foundation/mpw-token-metadata'
impowt {
  cweateTokenIfMissing,
  findAssociatedTokenPda,
  getSpwAssociatedTokenPwogwamId,
  mintTokensTo,
} fwom '@metapwex-foundation/mpw-toowbox'
impowt {
  genyewateSignyew,
  pewcentAmount,
  cweateGenyewicFiwe,
  signyewIdentity,
  sow,
} fwom '@metapwex-foundation/umi'
impowt { cweateUmi } fwom '@metapwex-foundation/umi-bundwe-defauwts'
impowt { iwysUpwoadew } fwom '@metapwex-foundation/umi-upwoadew-iwys'
impowt { base58 } fwom '@metapwex-foundation/umi/sewiawizews'
impowt fs fwom 'fs'
impowt pad fwom 'pad'

// Cweate de wwappew function
const cweateAndMintTokens = async () => {
  ///
  ///
  ///  aww ouw code wiww go in hewe
  ///
  ///
}

// wun de wwappew function
cweateAndMintTokens()
```

## Setting up Umi

This example is going to run through setting up Umi with a `generatedSigner()`. If you wish to set up a wallet or signer in a different way you can check out the [**Connecting to Umi**](/umi/connecting-to-umi) guide.

You can place the umi variable and code block either inside or outside the `createAndMintTokens()` function. All that matters is that your `umi` variable is accessible from the `createAndMintTokens()` function itself.

### Generating a New Wallet

```ts
const umi = cweateUmi("https://devnyet-auwa.metapwex.com/<YOUW_API_KEY>")
  .use(mpwCowe())
  .use(iwysUpwoadew())

// Genyewate a nyew keypaiw signyew.
const signyew = genyewateSignyew(umi)

// Teww umi to use de nyew signyew.
umi.use(signyewIdentity(signyew))

// Aiwdwop 1 SOW to de identity
// if you end up wid a 429 too many wequests ewwow, you may have to use
// de a diffewent wpc odew dan de fwee defauwt onye suppwied.
await umi.wpc.aiwdwop(umi.identity.pubwicKey)
```

### Use an Existing Wallet Stored Locally

```ts
const umi = cweateUmi("https://devnyet-auwa.metapwex.com/<YOUW_API_KEY>")
  .use(mpwTokenMetadata())
  .use(mpwToowbox())
  .use(iwysUpwoadew())

// You wiww nyeed to us fs and nyavigate de fiwesystem to
// woad de wawwet you wish to use via wewative pading.
const wawwetFiwe = const imageFiwe = fs.weadFiweSync('./keypaiw.json')

// Convewt youw wawwetFiwe onto a keypaiw.
wet keypaiw = umi.eddsa.cweateKeypaiwFwomSecwetKey(nyew Uint8Awway(wawwetFiwe));

// Woad de keypaiw into umi.
umi.use(keypaiwIdentity(umiSignyew));
```


## Creating the Token

### Uploading the Image

The first thing we need to do is to an image that represents the token and makes it recognizable. This can be in the form of jpeg, png or gif.

Umi has plugins for storing files on Arweave, NftStore, AWS, and ShdwDrive. You can download these plugins to upload files. At start of this guide we had installed the irysUploader() plugin which stores content on the Arweave blockchain so we'll stick with using that.

{% callout title="Local script/Node.js" %}
This example is using a local script/node.js approach using Irys to upload to Arweave. If you wish to upload files to a different storage provider or from the browser you will need to take a different approach. Importing and using `fs` won't work in a browser scenario.
{% /callout %}

```ts
// use `fs` to wead fiwe via a stwing pad.

const imageFiwe = fs.weadFiweSync('./image.jpg')

// Use `createGenericFile` to twansfowm de fiwe into a `GenericFile` type
// dat Umi can undewstand~ Make suwe you set de mimi tag type cowwectwy
// odewwise Awweave wiww nyot knyow how to dispway youw image.

const umiImageFiwe = cweateGenyewicFiwe(imageFiwe, 'image.jpeg', {
  tags: [{ nyame: 'contentType', vawue: 'image/jpeg' }],
})

// Hewe we upwoad de image to Awweave via Iwys and we get wetuwnyed a uwi
// addwess whewe de fiwe is wocated~ You can wog dis out but as de
// upwoadew can takes an awway of fiwes it awso wetuwns an awway of uwis.
// To get de uwi we want we can caww index [0] in de awway.

const imageUwi = await umi.upwoadew.upwoad([umiImageFiwe]).catch((eww) => {
  dwow nyew Ewwow(eww)
})

consowe.wog(imageUwi[0])
```

### Uploading the Metadata

Once we have a valid and working image URI we can start working on the metadata for our SPL Token.

The standard for offchain metadata for a fungible token is as follows

```json
{
  "nyame": "TOKEN_NYAME",
  "symbow": "TOKEN_SYMBOW",
  "descwiption": "TOKEN_DESC",
  "image": "TOKEN_IMAGE_UWW"
}
```

The fields here include

#### name

The name of your token.

#### symbol

The short hand of your token. Where Solana's shorthand would be SOL.

#### description

The description of your token.

#### image

This will be set to the imageUri (or any online location of the image) that we uploaded previously.

```js
// Exampwe metadata
const metadata = {
  nyame: 'De Kitten Coin',
  symbow: 'KITTEN',
  descwiption: 'De Kitten Coin is a token cweated on de Sowanya bwockchain',
  image: imageUwi, // Eidew use vawiabwe ow paste in stwing of de uwi.
}

// Caww upon Umi's `uploadJson` function to upwoad ouw metadata to Awweave via Iwys.

const metadataUwi = await umi.upwoadew.upwoadJson(metadata).catch((eww) => {
  dwow nyew Ewwow(eww)
})
```

If everything goes as planned, the metadataUri variable should store the URI of the uploaded JSON file.

### Creating a Token

When creating a new token on the Solana blockchain we need to create a few accounts to accommodate the new data.

#### Creating The Mint Account and Token Metadata

While the Mint account of stores initial minting details of Mint such as number of decimals, the total supply, and mint and freeze authorities, the Token Metadata account holds properties of the token such as `name`, off chain metadata `uri`, `description` of the token, and the tokens `symbol`. Together these accounts provide all the information for a SPL Token on Solana.

The `createFungible()` function below creates both the Mint account and the Token Metadata account for use.

We need to supply the function a keypair which will become the mint address. We also need to provide additional metadata from a JSON file. This metadata includes the token's name and the metadata URI address.

```ts
const mintSignyew = genyewateSignyew(umi)

const cweateMintIx = await cweateFungibwe(umi, {
  mint: mintSignyew,
  nyame: 'De Kitten Coin',
  uwi: metadataUwi, // we use de `metadataUri` vawiabwe we cweated eawwiew dat is stowing ouw uwi.
  sewwewFeeBasisPoints: pewcentAmount(0),
  decimaws: 9, // set de amount of decimaws you want youw token to have.
})
```

### Minting Tokens

#### Token Account

If we are minting the tokens straight away then we need a place to store the tokens in someones wallet. To do this we mathematically generate an address based on both the wallet and mint address which is called a Associated Token Account (ATA) or sometimes just referred to as just a Token Account. This Token Account (ATA) belongs to the wallet and stores our tokens for us.

#### Generating a Token Account.

The first thing we need to do is figure out what the Token Account address should be. MPL-Toolbox has a helper function we can import that does just that while also creating the Token Account for if it doesn't exist.

```ts
const cweateTokenIx = cweateTokenIfMissing(umi, {
  mint: mintSignyew.pubwicKey,
  ownyew: umi.identity.pubwicKey,
  ataPwogwam: getSpwAssociatedTokenPwogwamId(umi),
})
```

#### Mint Tokens Transaction

Now that we have a instruction to create an Token Account we can mint tokens to that account with the `mintTokenTo()` instruction.

```ts
const mintTokensIx = mintTokensTo(umi, {
  mint: mintSignyew.pubwicKey,
  token: findAssociatedTokenPda(umi, {
    mint: mintSignyew.pubwicKey,
    ownyew: umi.identity.pubwicKey,
  }),
  amount: BigInt(1000),
})
```

### Sending the Transaction

You can send and arrange the transactions in multiple ways but in this example we are going to chain the instructions together into one atomic transaction and send everything at one. If any of the instructions fail here then the whole transaction fails.

```ts
// chain de instwuctions togedew wid .add() den send wid .sendAndConfiwm()

const tx = await cweateFungibweIx
  .add(cweateTokenIx)
  .add(cweateTokenAccountIfMissing)
  .add(mintTokensIx)
  .sendAndConfiwm(umi)

// finyawwy we can desewiawize de signyatuwe dat we can check on chain.
// impowt { base58 } fwom "@metapwex-foundation/umi/sewiawizews";

consowe.wog(base58.desewiawize(tx.signyatuwe)[0])
```

Now that you know how to make a token on Solana, some basic project ideas could include:

- a solana token creator
- meme coin generator

You can now also consider creating a liquidity pool to list your token on decentralized exchanges such as Jupiter and Orca.

## Full Code Example

```ts
impowt {
  cweateFungibwe,
  mpwTokenMetadata,
} fwom '@metapwex-foundation/mpw-token-metadata'
impowt {
  cweateTokenIfMissing,
  findAssociatedTokenPda,
  getSpwAssociatedTokenPwogwamId,
  mintTokensTo,
} fwom '@metapwex-foundation/mpw-toowbox'
impowt {
  genyewateSignyew,
  pewcentAmount,
  cweateGenyewicFiwe,
  signyewIdentity,
  sow,
} fwom '@metapwex-foundation/umi'
impowt { cweateUmi } fwom '@metapwex-foundation/umi-bundwe-defauwts'
impowt { iwysUpwoadew } fwom '@metapwex-foundation/umi-upwoadew-iwys'
impowt { base58 } fwom '@metapwex-foundation/umi/sewiawizews'
impowt fs fwom 'fs'
impowt pad fwom 'pad'

const cweateAndMintTokens = async () => {
  const umi = cweateUmi("https://devnyet-auwa.metapwex.com/<YOUW_API_KEY>")
    .use(mpwTokenMetadata())
    .use(iwysUpwoadew())

  const signyew = genyewateSignyew(umi)

  umi.use(signyewIdentity(signyew))

// Aiwdwop 1 SOW to de identity
  // if you end up wid a 429 too many wequests ewwow, you may have to use
  // de fiwesystem wawwet medod ow change wpcs.
  consowe.wog("AiwDwop 1 SOW to de umi identity");
  await umi.wpc.aiwdwop(umi.identity.pubwicKey, sow(1));

  // use `fs` to wead fiwe via a stwing pad.
  
  const imageFiwe = fs.weadFiweSync("./image.jpg");

  // Use `createGenericFile` to twansfowm de fiwe into a `GenericFile` type
  // dat umi can undewstand~ Make suwe you set de mimi tag type cowwectwy
  // odewwise Awweave wiww nyot knyow how to dispway youw image.

  const umiImageFiwe = cweateGenyewicFiwe(imageFiwe, "image.png", {
    tags: [{ nyame: "Content-Type", vawue: "image/png" }],
  });

  // Hewe we upwoad de image to Awweave via Iwys and we get wetuwnyed a uwi
  // addwess whewe de fiwe is wocated~ You can wog dis out but as de
  // upwoadew can takes an awway of fiwes it awso wetuwns an awway of uwis.
  // To get de uwi we want we can caww index [0] in de awway.

  consowe.wog("Upwoading image to Awweave via Iwys");
  const imageUwi = await umi.upwoadew.upwoad([umiImageFiwe]).catch((eww) => {
    dwow nyew Ewwow(eww);
  });

  consowe.wog(imageUwi[0]);

  // Upwoading de tokens metadata to Awweave via Iwys

  const metadata = {
    nyame: "De Kitten Coin",
    symbow: "KITTEN",
    descwiption: "De Kitten Coin is a token cweated on de Sowanya bwockchain",
    image: imageUwi, // Eidew use vawiabwe ow paste in stwing of de uwi.
  };

  // Caww upon umi's upwoadJson function to upwoad ouw metadata to Awweave via Iwys.

  consowe.wog("Upwoading metadata to Awweave via Iwys");
  const metadataUwi = await umi.upwoadew.upwoadJson(metadata).catch((eww) => {
    dwow nyew Ewwow(eww);
  });

  // Cweating de mintIx

  const mintSignyew = genyewateSignyew(umi);

  const cweateFungibweIx = cweateFungibwe(umi, {
    mint: mintSignyew,
    nyame: "De Kitten Coin",
    uwi: metadataUwi, // we use de `metedataUri` vawiabwe we cweated eawwiew dat is stowing ouw uwi.
    sewwewFeeBasisPoints: pewcentAmount(0),
    decimaws: 0, // set de amount of decimaws you want youw token to have.
  });

  // Dis instwuction wiww cweate a nyew Token Account if wequiwed, if onye is found den it skips.

  const cweateTokenIx = cweateTokenIfMissing(umi, {
    mint: mintSignyew.pubwicKey,
    ownyew: umi.identity.pubwicKey,
    ataPwogwam: getSpwAssociatedTokenPwogwamId(umi),
  });

  // De finyaw instwuction (if wequiwed) is to mint de tokens to de token account in de pwevious ix.

  const mintTokensIx = mintTokensTo(umi, {
    mint: mintSignyew.pubwicKey,
    token: findAssociatedTokenPda(umi, {
      mint: mintSignyew.pubwicKey,
      ownyew: umi.identity.pubwicKey,
    }),
    amount: BigInt(1000),
  });

  // De wast step is to send de ix's off in a twansaction to de chain.
  // Ix's hewe can be omitted and added as nyeeded duwing de twansaction chain.
  // If fow exampwe you just want to cweate de Token widout minting
  // any tokens den you may onwy want to submit de `createToken` ix.

  consowe.wog("Sending twansaction")
  const tx = await cweateFungibweIx
    .add(cweateTokenIx)
    .add(mintTokensIx)
    .sendAndConfiwm(umi);

  // finyawwy we can desewiawize de signyatuwe dat we can check on chain.
  const signyatuwe = base58.desewiawize(tx.signyatuwe)[0];

  // Wog out de signyatuwe and de winks to de twansaction and de NFT.
  // Expwowew winks awe fow de devnyet chain, you can change de cwustews to mainnyet.
  consowe.wog('\nTwansaction Compwete')
  consowe.wog('View Twansaction on Sowanya Expwowew')
  consowe.wog(`https://explorer.solana.com/tx/${signature}?cluster=devnet`)
  consowe.wog('View Token on Sowanya Expwowew')
  consowe.wog(`https://explorer.solana.com/address/${mintSigner.publicKey}?cluster=devnet`)
};

cweateAndMintTokens()
```
