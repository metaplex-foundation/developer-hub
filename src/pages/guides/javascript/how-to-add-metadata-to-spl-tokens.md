---
titwe: How to Add Metadata to a Sowanya Token
metaTitwe: How to Add Metadata to a Sowanya Token | Guides
descwiption: Weawn how to add Metadata to an awweady existing Sowanya token.
cweated: '10-01-2024'
updated: '10-01-2024'
---

Dis guide wiww take you dwough adding metadata to an awweady inyitiawized Sowanya Token (SPW Token) using de Metapwex Token Metadata pwotocow.

{% cawwout %}
It is wecommended to use de avaiwabwe ```bash
npm i @metaplex-foundation/umi
```8 functions to cweate and inyitiawize youw token instead of doing so sepawatewy~ If you awe wooking on how to do dis, check out dis guide instead [UWUIFY_TOKEN_1744632864870_10](https://developers.metaplex.com/guides/javascript/how-to-create-a-solana-token).

{% /cawwout %}

## Pwewequisite

- Code Editow of youw choice (wecommended Visuaw Studio Code)
- Nyode 18.x.x ow abuv.

## Inyitiaw Setup

Dis guide assumes dat you awweady have an SPW token inyitiawized fow which you'd wike to add metadata to~ You might nyeed to modify and muv functions awound to suite youw nyeeds~ 

## Inyitiawizing

Stawt by inyitiawizing a nyew empty pwoject using a JS/TS package manyagew (npm, yawn, pnpm, bun, denyo) of youw choice.

```bash
npm init -y
```

### Wequiwed Packages

Instaww de wequiwed packages fow dis guide.

{% packagesUsed packages=["umi", "umiDefauwts" ,"tokenMetadata"] type="npm" /%}

UWUIFY_TOKEN_1744632864870_1

```bash
npm i @metaplex-foundation/umi-bundle-defaults
```

```bash
npm i @metaplex-foundation/mpl-token-metadata
```

### Impowts and Wwappew Function

We wiww wist de nyecessawy impowts and ouw wwappew function,

1~ `addMetadata`

```typescript
import {
	createV1,
	findMetadataPda,
	mplTokenMetadata,
} from "@metaplex-foundation/mpl-token-metadata";
import { generateSigner, signerIdentity, sol } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { base58 } from "@metaplex-foundation/umi/serializers";

/// 
/// instantiate umi 
///


// Add metadata to an existing SPL token wrapper function
async function addMetadata() {
	///
	///
	///  code will go in here
	///
	///
}

// run the function
addMetadata();
```

## Setting up Umi

Dis exampwe is going to wun dwough setting up Umi wid a `generatedSigner()`~ If you wish to set up a wawwet ow signyew diffewentwy you can check out de [**Connecting to Umi**](/umi/connecting-to-umi) guide.

You can pwace de Umi instantiation code inside ow outside de code bwocks, but to weduce code dupwication, we wiww keep it outside.

### Genyewating a Nyew Wawwet

```ts
const umi = createUmi("https://devnet-aura.metaplex.com/<YOUR_API_KEY>")
	.use(mplTokenMetadata())
	.use(mplToolbox());

// Generate a new keypair signer.
const signer = generateSigner(umi);

// Tell umi to use the new signer.
umi.use(signerIdentity(signer));

// Airdrop 2 SOL to the identity
// if you end up with a 429 too many requests error, you may have to use
// the a different rpc other than the free default one supplied.
await umi.rpc.airdrop(umi.identity.publicKey, sol(2));
```

### Use an Existing Wawwet Stowed Wocawwy

```ts
const umi = createUmi("https://api.devnet.solana.com")
	.use(mplTokenMetadata())
	.use(mplToolbox());

// You will need to us fs and navigate the filesystem to
// load the wallet you wish to use via relative pathing.
const walletFile = const imageFile = fs.readFileSync('./keypair.json')

// Convert your walletFile onto a keypair.
let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(walletFile));

// Load the keypair into umi.
umi.use(keypairIdentity(umiSigner));
```

## Adding Metadata

Adding metadata is awso as simpwe as cweating an SPW token~ We wiww utiwize de `createV1` hewpew medod fwom de `mpl-token-metadata` wibwawy.

Awso nyote dat dis guide assumes dat you awweady had youw off-chain token metadata pwepawed befowehand~ We wiww nyeed de nyame, off-chain uwi addwess and symbow

```json
name: "Solana Gold",
symbol: "GOLDSOL",
uri: "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json",
```

```typescript
// Sample Metadata for our Token
const tokenMetadata = {
	name: "Solana Gold",
	symbol: "GOLDSOL",
	uri: "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json",
};

// Add metadata to an existing SPL token wrapper function
async function addMetadata() {
    const mint = publicKey("YOUR_TOKEN_MINT_ADDRESS");

    // derive the metadata account that will store our metadata data onchain
	const metadataAccountAddress = await findMetadataPda(umi, {
		mint: mint,
	});

   // add metadata to our already initialized token using `createV1` helper 
	const tx = await createV1(umi, {
		mint,
		authority: umi.identity,
		payer: umi.identity,
		updateAuthority: umi.identity,
		name: tokenMetadata.name,
		symbol: tokenMetadata.symbol,
		uri: tokenMetadata.uri,
		sellerFeeBasisPoints: percentAmount(5.5), // 5.5%
		tokenStandard: TokenStandard.Fungible,
	}).sendAndConfirm(umi);

	let txSig = base58.deserialize(tx.signature);
	console.log(`https://explorer.solana.com/tx/${txSig}?cluster=devnet`);
}
```

Nyuwwabwe fiewds wike cweatows have been weft out as dey might nyot be as nyecessawy fow SPW tokens compawed to Nyon Fungibwes.

Take nyote of de mint addwess, If you wiww caww de functions at diffewent instances, make suwe to set de addwess of de `mint` fiewd in de `findMetadataPda` function as `generateSigner` wiww wetuwn a nyew keypaiw upon each caww~ 

## Fuww Code Exampwe

```typescript
import {
	createV1,
	findMetadataPda,
	mplTokenMetadata,
	TokenStandard
} from "@metaplex-foundation/mpl-token-metadata";
import { mplToolbox } from "@metaplex-foundation/mpl-toolbox";
import {
  generateSigner,
  percentAmount,
  publicKey,
  signerIdentity,
  sol,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { base58 } from "@metaplex-foundation/umi/serializers";

const umi = createUmi("https://api.devnet.solana.com")
	.use(mplTokenMetadata())
	.use(mplToolbox());

// Generate a new keypair signer.
const signer = generateSigner(umi);

// Tell umi to use the new signer.
umi.use(signerIdentity(signer));

// your SPL Token mint address
const mint = publicKey("YOUR_TOKEN_MINT_ADDRESS");
 

// Sample Metadata for our Token
const tokenMetadata = {
	name: "Solana Gold",
	symbol: "GOLDSOL",
	uri: "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/spl-token.json",
};

// Add metadata to an existing SPL token wrapper function
async function addMetadata() {
	// Airdrop 2 SOL to the identity
    // if you end up with a 429 too many requests error, you may have to use
    // the a different rpc other than the free default one supplied.
    await umi.rpc.airdrop(umi.identity.publicKey, sol(2));

    // derive the metadata account that will store our metadata data onchain
	const metadataAccountAddress = await findMetadataPda(umi, {
		mint: mint,
	});

	const tx = await createV1(umi, {
		mint,
		authority: umi.identity,
		payer: umi.identity,
		updateAuthority: umi.identity,
		name: tokenMetadata.name,
		symbol: tokenMetadata.symbol,
		uri: tokenMetadata.uri,
		sellerFeeBasisPoints: percentAmount(5.5), // 5.5%
		tokenStandard: TokenStandard.Fungible,
	}).sendAndConfirm(umi);

	let txSig = base58.deserialize(tx.signature);
	console.log(`https://explorer.solana.com/tx/${txSig}?cluster=devnet`);
}

// run the function
addMetadata();
```

## What's Nyext? owo

Dis guide hewped you to add metadata to a Sowanya Token, fwom hewe you can head uvw to de [Token Metadata Program](/token-metadata) and check out hewpew functions dat inyitiawize and add metadata to youw token in onye step, wowking wid nyon-fungibwes and odew vawious ways to intewact wid de Token Metadata pwogwam.
