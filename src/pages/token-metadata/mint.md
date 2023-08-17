---
title: Minting Assets
metaTitle: Token Metadata - Minting Assets
description: Learn how to mint NFTs, SFTs and Programmable NFTs (a.k.a. Assets) on Token Metadata
---

As we discussed on the [Token Metadata overview](/token-metadata), digital assets on Solana are composed of several on-chain accounts and off-chain data describing the token. In this page, we'll go over the process of minting these assets. {% .lead %}

## The minting process

Whether we want to mint a Fungible, Semi-Fungible or Non-Fungible asset, the overall process is the same:

1. **Upload off-chain data.** First, we must ensure our off-chain data is ready. This means, we must have a JSON file stored somewhere that describes our asset. It doesn't matter how or where that JSON file is stored, as long as it's accessible via a **URI**.
2. **Create on-chain accounts.** Then, we must create the on-chain accounts that will hold our asset's data. Which exact accounts will be created depend on the **Token Standard** of our asset, but in all cases, a **Metadata** account will be created and will store the **URI** of our off-chain data.
3. **Mint tokens.** Finally, we must mint the tokens associated with all these accounts. For Non-Fungible assets, that simply means minting from 0 to 1, since Non-Fungibility forbids us to have a supply greater than 1. For Fungible or Semi-Fungible assets, we may mint however many tokens we want to however many wallets we want.

Let's dig into these steps in more detail, whilst providing concrete code examples.

## Uploading off-chain data

_Coming soon..._

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

For instance, here is how we can install the NFT.Storage plugin:

```ts
import { nftStorageUploader } from '@metaplex-foundation/umi-uploader-nft-storage'

umi.use(nftStorageUploader({ token: 'YOUR_API_TOKEN' }))
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Creating accounts

_Coming soon..._

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

_Coming soon..._

{% dialect-switcher title="Create on-chain Accounts" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import {
  createV1,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata'

const mint = generateSigner(umi)
await createV1(umi, {
  mint,
  authority,
  name: 'My NFT',
  uri,
  sellerFeeBasisPoints: percentAmount(5.5),
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Minting Tokens

_Coming soon..._

{% dialect-switcher title="Mint Tokens" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { mintV1, TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

await mintV1(umi, {
  mint: mint.publicKey,
  authority,
  amount: 1,
  tokenOwner,
  tokenStandard: TokenStandard.NonFungible,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Create Helpers

_Coming soon..._

{% dialect-switcher title="Create helpers" %}
{% dialect title="JavaScript" id="js" %}

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
import { percentAmount, generateSigner } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

const mint = generateSigner(umi)
await createFungible(umi, {
  mint,
  name: 'My Fungible',
  uri: 'https://example.com/my-fungible.json',
  sellerFeeBasisPoints: percentAmount(5.5),
}).sendAndConfirm(umi)
```

{% /totem-accordion  %}

{% totem-accordion title="Create a FungibleAsset" %}

```ts
import { percentAmount, generateSigner } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

const mint = generateSigner(umi)
await createFungibleAsset(umi, {
  mint,
  name: 'My Fungible Asset',
  uri: 'https://example.com/my-fungible-asset.json',
  sellerFeeBasisPoints: percentAmount(5.5),
}).sendAndConfirm(umi)
```

{% /totem-accordion  %}

{% totem-accordion title="Create a ProgrammableNonFungible" %}

```ts
import { percentAmount, generateSigner } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

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
{% /dialect-switcher %}
