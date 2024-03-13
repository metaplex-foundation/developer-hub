---
title: Creating Assets
metaTitle: Core - Creating Assets
description: Learn how to create Assets on Core
---

As discussed in the [Core overview](/core), digital assets on Core are composed of exactly one on-chain account and off-chain data describing the token. On this page, we'll go over the process of minting these assets. {% .lead %}

## The Minting Process

1. **Upload off-chain data.** First, we must ensure our off-chain data is ready. This means we must have a JSON file stored somewhere that describes our asset. It doesn't matter how or where that JSON file is stored, as long as it's accessible via a **URI**. The off chain metadata can look similar to the [old token metadata standard](/token-metadata/token-standard#the-non-fungible-standard).
2. **Create on-chain Asset account.** Then, we must create the on-chain Asset account that will hold our asset's data.

Let's dig into these steps in more detail, whilst providing concrete code examples.

## Uploading off-chain data

You may use any service to upload your off-chain data or simply store it on your own server but it is worth noting that some of our SDKs can help with that. They use a plugin system that allows you to select the uploader of your choice and offer a unified interface for you to upload your data.

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

Now that we have our **URI**, we can move on to the next step.

## Create an Asset

Explain the difference between storing in account state and ledger state.

### Create Asset in Account State

{% dialect-switcher title="Create Asset in Ledger State" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { create, DataState } from '@metaplex-foundation/mpl-core'

const mint = generateSigner(umi)
const result = create(umi, {
  asset: assetAddress,
  name: 'My Nft',
  uri: 'https://example.com/my-nft',
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}
{% totem %}

```rust
// TODO

```

{% /totem %}

{% /dialect %}

{% dialect title="Rust (CPI)" id="rust-cpi" %}

```rust
// TODO

```

{% /dialect %}
{% /dialect-switcher %}

<!-- ### Create Asset in Ledger State

{% dialect-switcher title="Create Asset in Account State" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { create, DataState } from '@metaplex-foundation/mpl-core'

const mint = generateSigner(umi)
const result = create(umi, {
  dataState: DataState.LedgerState,
  asset: assetAddress,
  name: 'Test Bread',
  uri: 'https://example.com/bread',
  logWrapper: publicKey('noopb9bkMVfRPU8AsbpTUg8AQkHtKwMYZiFUjNRtMmV'),
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}
{% totem %}

```rust
// TODO

```

{% totem-prose %}

Note that when setting the `mint` account, it is require to specify a `bool` flag to indicate whether the account will be a signer or not – it need to be a signer if the `mint` account does not exist.

{% /totem-prose %}

{% /totem %}

{% /dialect %}

{% dialect title="Rust (CPI)" id="rust-cpi" %}

```rust
// TODO

```

{% /dialect %}
{% /dialect-switcher %} -->

## Create An Asset with Plugins

MPL Core Assets support the use of plugins at both a Collection and at an Asset level. To create a Core Asset with a plugin you pass in the plugin and it's parameters into the `plugins` array arg during creation. The below example creates a mint with the `Freeze` plugin.

{% dialect-switcher title="Create Asset with Plugin" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { create, DataState, pluginAuthorityPair } from '@metaplex-foundation/mpl-token-metadata'

const mint = generateSigner(umi)
await create(umi, {
  asset: assetAddress,
  name: 'My Nft',
  uri: 'https://example.com/my-nft',
  plugins: [
    pluginAuthorityPair({
      type: 'Freeze',
      data: { frozen: false },
    }),
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

A list of plugins includes:

- [Burn Delegate](/core/plugins/burn-delegate)
- [Freeze Delegate](/core/plugins/freeze-delegate)
- [Royalties Delegate](/core/plugins/royalties-delegate)
- [Transfer Delegate](/core/plugins/transfer-delegate)
- [Update Delegate](/core/plugins/update-delegate)

## Instruction Account List

| Accounts      | Description                                        |
| ------------- | -------------------------------------------------- |
| asset         | The address of the MPL Core Asset.                 |
| collection    | The collection to which the Core Asset belongs to. |
| authority     | The authority of the new asset.                    |
| payer         | The account paying for the storage fees.           |
| new owner     | The new owner to which to transfer the asset to.   |
| systemProgram | The System Program account.                        |
| logWrapper    | The SPL Noop Program.                              |


## Instruction Args

| Args      | Description                                                   |
|------------|---------------------------------------------------------------|
| dataState  | Whether the data is stored in account state or ledger state. |
| name       | The name of your MPL Core Asset.                              |
| uri        | The off-chain JSON metadata URI.                              |
| plugins    | What plugins you would like the asset to have.                |


Some of the accounts/args may be abstracted out and/or optional in our sdks for ease of use.
A full detailed look at the on chain instruction it can be viewed on [Github](https://github.com/metaplex-foundation/mpl-core/blob/main/programs/mpl-core/src/processor/create.rs)
