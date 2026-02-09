---
title: Creating & Minting
metaTitle: Creating & Minting | Token Metadata
description: Mint NFTs, fungible tokens, semi-fungible tokens, and Programmable NFTs on Solana using the Token Metadata program. Covers CreateV1, account setup, and all token standards.
updated: '02-07-2026'
keywords:
  - mint NFT Solana
  - create token metadata
  - CreateV1 instruction
  - mint programmable NFT
  - SPL token creation
about:
  - creating and minting
  - token creation
  - NFT minting
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
howToSteps:
  - Set up your SDK (Umi, Kit, or Rust)
  - Configure mint and metadata parameters
  - Call CreateV1 to create accounts
  - Confirm the transaction on-chain
howToTools:
  - Umi SDK
  - Kit SDK
  - Rust SDK
faqs:
  - q: How do I mint an NFT with Token Metadata?
    a: Use the CreateV1 instruction (or createNft helper) which creates the Mint, Metadata, and Master Edition accounts in a single transaction.
  - q: What is the difference between creating an NFT and a fungible token?
    a: NFTs use zero decimals, supply of 1, and a Master Edition account. Fungible tokens use one or more decimals with no Master Edition. The token standard is set automatically.
  - q: How much does it cost to mint an NFT?
    a: Approximately 0.01 SOL in protocol fees plus Solana rent (~0.015 SOL total on devnet).
  - q: Can I mint directly into another wallet?
    a: Yes. Specify a different token owner when minting. The payer still pays transaction and account fees.
---

As we discussed in the [Token Metadata overview](/smart-contracts/token-metadata), digital assets on Solana are composed of several onchain accounts and off-chain data describing the token. On this page, we'll go over the process of minting these assets. {% .lead %}

## The minting process

Whether we want to mint a Fungible, Semi-Fungible or Non-Fungible asset, the overall process is the same:

1. **Upload off-chain data.** First, we must ensure our off-chain data is ready. This means we must have a JSON file stored somewhere that describes our asset. It doesn't matter how or where that JSON file is stored, as long as it's accessible via a **URI**.
2. **Create onchain accounts.** Then, we must create the onchain accounts that will hold our asset's data. Which exact accounts will be created depends on the **Token Standard** of our asset, but in all cases, a **Metadata** account will be created and will store the **URI** of our off-chain data.
3. **Mint tokens.** Finally, we must mint the tokens associated with all these accounts. For Non-Fungible assets, that simply means minting from 0 to 1, since Non-Fungibility forbids us to have a supply greater than 1. For Fungible or Semi-Fungible assets, we may mint however many tokens we want.

Let's dig into these steps in more detail, whilst providing concrete code examples.

## Uploading off-chain data

You may use any service to upload your off-chain data or simply store it on your own server but it is worth noting that the Umi SDK can help with that. It uses a plugin system that allows you to select the uploader of your choice and offers a unified interface for you to upload your data.

{% dialect-switcher title="Upload assets and JSON data" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
const [imageUri] = await umi.uploader.upload([imageFile])
const uri = await umi.uploader.uploadJson({
  name: 'My NFT',
  description: 'This is my NFT',
  image: imageUri,
  // ...
})
```

{% totem-accordion title="Select an uploader" %}

To select the Uploader of your choice using Umi, simply install the plugin provided by the Uploader.

For instance, here is how we can install the irysUploader plugin for interacting with the Arweave network:

```ts
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'

umi.use(irysUploader())
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

Now that we have our **URI**, we can move on to the next step.

{% callout %}
The next steps show how to create accounts and mint the tokens in two steps. At the [bottom of the page](#create-helpers) there are **code examples** for helpers that combine those steps and make creating different token types easier.
{% /callout %}

## Creating Mint and Metadata accounts

To create all the onchain accounts required by the Token Standard of your choice, you may simply use the **Create V1** instruction. It will adapt to the requested Token Standard and create the right accounts accordingly.

For instance, `NonFungible` assets will have a `Metadata` account and a `MasterEdition` account created, whereas `Fungible` assets will only have a `Metadata` account created.

{% diagram height="h-64 md:h-[500px]" %}
{% node %}
{% node #mint-1 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Mint Authority = Edition" /%}
{% node label="Supply = 1" /%}
{% node label="Decimals = 0" /%}
{% node label="Freeze Authority = Edition" /%}
{% /node %}
{% node parent="mint-1" y="-20" x="-10" label="NonFungible (incl. editions and pNFTs)" theme="transparent" /%}

{% node parent="mint-1" x="220" #metadata-1-pda label="PDA" theme="crimson" /%}
{% node parent="metadata-1-pda" x="140" %}
{% node #metadata-1 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Token Standard = NonFungible" /%}
{% /node %}

{% node parent="mint-1" x="220" y="100" #master-edition-pda label="PDA" theme="crimson" /%}
{% node parent="master-edition-pda" x="140" %}
{% node #master-edition label="Master Edition Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}
{% node parent="master-edition" y="80" %}
{% node #edition label="Edition Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% /node %}

{% node parent="mint-1" y="260" %}
{% node #mint-2 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Decimals = 0" /%}
{% /node %}
{% node parent="mint-2" y="-20" x="-10" label="FungibleAsset" theme="transparent" /%}

{% node parent="mint-2" x="220" #metadata-2-pda label="PDA" theme="crimson" /%}
{% node parent="metadata-2-pda" x="140" %}
{% node #metadata-2 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Token Standard = FungibleAsset" /%}
{% /node %}

{% node parent="mint-2" y="120" %}
{% node #mint-3 label="Mint Account" theme="blue" /%}
{% node label="Owner: Token Program" theme="dimmed" /%}
{% node label="Decimals > 0" /%}
{% /node %}
{% node parent="mint-3" y="-20" x="-10" label="Fungible" theme="transparent" /%}

{% node parent="mint-3" x="220" #metadata-3-pda label="PDA" theme="crimson" /%}
{% node parent="metadata-3-pda" x="140" %}
{% node #metadata-3 label="Metadata Account" theme="crimson" /%}
{% node label="Owner: Token Metadata Program" theme="dimmed" /%}
{% node label="Token Standard = Fungible" /%}
{% /node %}

{% edge from="mint-1" to="metadata-1-pda" path="straight" /%}
{% edge from="metadata-1-pda" to="metadata-1" path="straight" /%}
{% edge from="mint-1" to="master-edition-pda" /%}
{% edge from="master-edition-pda" to="master-edition" path="straight" /%}
{% edge from="master-edition-pda" to="edition" label="OR" /%}

{% edge from="mint-2" to="metadata-2-pda" path="straight" /%}
{% edge from="metadata-2-pda" to="metadata-2" path="straight" /%}
{% edge from="mint-3" to="metadata-3-pda" path="straight" /%}
{% edge from="metadata-3-pda" to="metadata-3" path="straight" /%}
{% /diagram %}

Additionally, if the provided **Mint** account does not exist, it will be created for us. That way, we don't even need to call the underlying Token program to prepare our token before adding metadata to it.

This instruction accepts a variety of parameters and our SDKs do their best to provide default values to them so you don't need to fill all of them every single time. That being said, here is a list of parameters that you may be interested in:

- **Mint**: The Mint account of the asset. If it doesn't exist, it must be provided as a Signer as it will be initialized. Typically, we generate a new keypair for this purpose.
- **Authority**: The authority of the Mint account. This is the account that is or will be allowed to mint tokens from the Mint account. This will default to the "Identity" wallet — i.e. the connected wallet — if supported by the SDK.
- **Name**, **URI**, **Seller Fee Basis Points**, **Creators**, etc.: The data of the asset to store on the **Metadata** account.
- **Token Standard**: The Token Standard of the asset.

{% callout %}
`createV1` is a helper function that can initialize the Mint Account and create the Metadata Account. If the mint exists already it will only create the metadata Account. If you are looking for how to use [`createMetadataAccountV3`](https://mpl-token-metadata-js-docs.vercel.app/functions/createMetadataAccountV3.html) you should be using this function instead.
{% /callout %}

{% code-tabs-imported from="token-metadata/create-accounts" frameworks="umi,kit,shank" /%}

{% callout type="note" %}
Note that when setting the `mint` account in Rust, it is required to specify a `bool` flag to indicate whether the account will be a signer or not – it needs to be a signer if the `mint` account does not exist.
{% /callout %}

## Minting Tokens

Once all onchain accounts are created for our asset, we can mint tokens for it. If the asset is Non-Fungible we will simply mint its one and only token, otherwise we can mint as many tokens as we want. Note that a Non-Fungible asset is only valid once its unique token has been minted so it is a mandatory step for that Token Standard.

We can use the **Mint V1** instruction of the Token Metadata program to achieve this. It requires the following parameters:

- **Mint**: The address of the asset's Mint account.
- **Authority**: The authority that can authorize this instruction. For Non-Fungible assets, this is the update authority of the **Metadata** account, otherwise, this refers to the **Mint Authority** of the Mint account.
- **Token Owner**: The address of the wallet to receive the token(s).
- **Amount**: The number of tokens to mint. For Non-Fungible assets, this may only be 1.
- **Token Standard**: The Token Standard of the asset (**required for our JavaScript SDK**). The program does not require this argument but our SDK do so they can provide adequate default values for most of the other parameters.

{% code-tabs-imported from="token-metadata/mint-tokens" frameworks="umi,kit,shank" /%}

{% callout type="note" %}
We are setting the `master_edition` since it is required to mint a `NonFungible`; the `token_owner` is required if the `token` account does not exist and one will be initialized.
{% /callout %}

## Create Helpers

Since creating digital assets is such an important part of Token Metadata, our SDKs provide helper methods to make the process easier. Namely, these helper methods combine the **Create V1** and **Mint V1** instructions together in different ways, depending on the Token Standard we want to create.

{% dialect-switcher title="Create helpers" %}
{% dialect title="Umi SDK" id="umi" %}

{% totem-accordion title="Create a NonFungible" %}

```ts
import { percentAmount, generateSigner } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

const mint = generateSigner(umi)
await createNft(umi, {
  mint,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: percentAmount(5.5),
}).sendAndConfirm(umi)
```

{% /totem-accordion  %}

{% totem-accordion title="Create a Fungible" %}

```ts
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { createFungible } from '@metaplex-foundation/mpl-token-metadata'

const mint = generateSigner(umi)
await createFungible(umi, {
  mint,
  name: 'My Fungible',
  uri: 'https://example.com/my-fungible.json',
  sellerFeeBasisPoints: percentAmount(5.5),
  decimals: some(9),
}).sendAndConfirm(umi)
```

{% /totem-accordion  %}

{% totem-accordion title="Create a FungibleAsset" %}

```ts
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { createFungibleAsset } from '@metaplex-foundation/mpl-token-metadata'

const mint = generateSigner(umi)
await createFungibleAsset(umi, {
  mint,
  name: 'My Fungible Asset',
  uri: 'https://example.com/my-fungible-asset.json',
  sellerFeeBasisPoints: percentAmount(5.5),
  decimals: some(0),
}).sendAndConfirm(umi)
```

{% /totem-accordion  %}

{% totem-accordion title="Create a ProgrammableNonFungible" %}

```ts
import { percentAmount, generateSigner } from '@metaplex-foundation/umi'
import { createProgrammableNft } from '@metaplex-foundation/mpl-token-metadata'

const mint = generateSigner(umi)
await createProgrammableNft(umi, {
  mint,
  name: 'My Programmable NFT',
  uri: 'https://example.com/my-programmable-nft.json',
  sellerFeeBasisPoints: percentAmount(5.5),
}).sendAndConfirm(umi)
```

{% /totem-accordion  %}

{% /dialect %}

{% dialect title="Kit SDK" id="kit" %}

{% totem-accordion title="Create a NonFungible" %}

```ts
import { generateKeyPairSigner } from '@solana/kit'
import { createNft } from '@metaplex-foundation/mpl-token-metadata-kit'

const mint = await generateKeyPairSigner()
const [createIx, mintIx] = await createNft({
  mint,
  authority,
  payer: authority,
  name: 'My NFT',
  uri: 'https://example.com/my-nft.json',
  sellerFeeBasisPoints: 550, // 5.5%
  tokenOwner: authority.address,
})

await sendAndConfirm({
  instructions: [createIx, mintIx],
  payer: authority,
})
```

{% /totem-accordion  %}

{% totem-accordion title="Create a Fungible" %}

```ts
import { generateKeyPairSigner } from '@solana/kit'
import { createFungible } from '@metaplex-foundation/mpl-token-metadata-kit'

const mint = await generateKeyPairSigner()
const createAndMintIx = await createFungible({
  mint,
  authority,
  payer: authority,
  name: 'My Fungible',
  uri: 'https://example.com/my-fungible.json',
  sellerFeeBasisPoints: 0,
  decimals: 9,
  tokenOwner: authority.address,
  amount: 1_000_000_000n, // initial supply
})

await sendAndConfirm({
  instructions: [createAndMintIx],
  payer: authority,
})
```

{% /totem-accordion  %}

{% totem-accordion title="Create a FungibleAsset" %}

```ts
import { generateKeyPairSigner } from '@solana/kit'
import { createFungibleAsset } from '@metaplex-foundation/mpl-token-metadata-kit'

const mint = await generateKeyPairSigner()
const createAndMintIx = await createFungibleAsset({
  mint,
  authority,
  payer: authority,
  name: 'My Fungible Asset',
  uri: 'https://example.com/my-fungible-asset.json',
  sellerFeeBasisPoints: 0,
  decimals: 0,
  tokenOwner: authority.address,
  amount: 1000n, // initial supply
})

await sendAndConfirm({
  instructions: [createAndMintIx],
  payer: authority,
})
```

{% /totem-accordion  %}

{% totem-accordion title="Create a ProgrammableNonFungible" %}

```ts
import { generateKeyPairSigner } from '@solana/kit'
import { createProgrammableNft } from '@metaplex-foundation/mpl-token-metadata-kit'

const mint = await generateKeyPairSigner()
const [createIx, mintIx] = await createProgrammableNft({
  mint,
  authority,
  payer: authority,
  name: 'My Programmable NFT',
  uri: 'https://example.com/my-programmable-nft.json',
  sellerFeeBasisPoints: 550, // 5.5%
  tokenOwner: authority.address,
})

await sendAndConfirm({
  instructions: [createIx, mintIx],
  payer: authority,
})
```

{% /totem-accordion  %}

{% /dialect %}
{% /dialect-switcher %}
