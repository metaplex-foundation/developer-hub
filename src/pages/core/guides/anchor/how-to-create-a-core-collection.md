---
title: How to Create a Core Collection
metaTitle: How to Create a Core Collection | Core Guides
description: Learn how to create a Core Collection on Solana with Metaplex Core using Anchor!
# remember to update dates also in /components/guides/index.js
created: '08-21-2024'
updated: '08-21-2024'
---

This guide will teach you how to create a **Core Collection** on Solana using the Metaplex `mpl-core` program. 

{% callout title="What is Core?" %}
**Core** use a single account design, reducing minting costs and improving Solana network load compared to alternatives. It also has a flexible plugin system that allows for developers to modify the behavior and functionality of assets.
{% /callout %}

## Prerequisite

- Code Editor of your choice (recommended **Visual Studio Code** with the **Rust Analyzer Plugin**)
- Anchor **0.30.1** or above.

## Initial Setup

In this guide we’re going to use **Anchor**, leveraging a mono-file approach where all the necessary macros can be found in the `lib.rs` file:
- `declare_id`: Specifies the program's on-chain address.
- `#[program]`: Specifies the module containing the program’s instruction logic.
- `#[derive(Accounts)]`: Applied to structs to indicate a list of accounts required for an instruction.
- `#[account]`: Applied to structs to create custom account types specific to the program.

**Note**: You may need to modify and move functions around to suit your needs.

### Initializing the Program

Start by initializing a new project (optional) using `avm` (Anchor Version Manager). To initialize it, run the following command in your terminal

```
anchor init create-core-collection-example
```

### Required Crates

In this guide, we'll use the `mpl_core` crate with the `anchor` feature enabled. To install it, first navigate to the `create-core-collection-example` directory:

```
cd create-core-collection-example
```

Then run the following command:

```
cargo add mpl-core --features anchor
```

## The program

### Imports and Templates

Here we're going to define all the imports for this particular guide and create the template for the Account struct and instruction in our `lib.rs` file. 

```rust
use anchor_lang::prelude::*;

use mpl_core::{
    ID as MPL_CORE_ID,
    instructions::CreateCollectionV2CpiBuilder, 
};

declare_id!("C9PLf3qMCVqtUCJtEBy8NCcseNp3KTZwFJxAtDdN1bto");

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateCollectionArgs {

}

#[program]
pub mod create_core_collection_example {
    use super::*;

    pub fn create_core_collection(ctx: Context<CreateCollection>, args: CreateCollectionArgs) -> Result<()> {

        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateCollection<'info> {

}
```

### Creating the Args Struct

To keep our function organized and avoid clutter from too many parameters, it's standard practice to pass all inputs through a structured format. This is achieved by defining an argument struct (`CreateCollectionArgs`) and deriving `AnchorDeserialize` and `AnchorSerialize`, which allows the struct to be serialized into a binary format using NBOR, and making it readable by **Anchor**.

```rust
#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateCollectionArgs {
    name: String,
    uri: String,
}
```

In this `CreateCollectionArgs` struct, the **name** and **uri** fields are provided as inputs, which will serve as arguments for the `CreateCollectionV2CpiBuilder` instruction used to create the **Core Collection**.

### Creating the Account Struct

The `Account` struct is where we define the accounts the instruction expects, and specify the constraints that these accounts must meet. This is done using two key constructs: **types** and **constraints**.

**Account Types**

Each type serves a specific purpose within your program:
- **Signer**: Ensures that the account has signed the transaction.
- **Option**: Allows for optional accounts that may or may not be provided.
- **Program**: Verifies that the account is a specific program.

**Constraints**

While account types handle basic validations, they aren't sufficient for all the security checks your program might require. This is where constraints come into play.

Constraints add extra validation logic. For example, the `#[account(mut)]` constraint ensures that the `collection` and `payer` accounts are set as mutable, meaning that the data within these accounts can be modified during the instruction.

```rust
#[derive(Accounts)]
pub struct CreateCollection<'info> {
    #[account(mut)]
    pub collection: Signer<'info>,
    /// CHECK: this account will be checked by the mpl_core program
    pub update_authority: Option<UncheckedAccount<'info>>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
    #[account(address = MPL_CORE_ID)]
    /// CHECK: this account is checked by the address constraint
    pub mpl_core_program: UncheckedAccount<'info>,
}
```

Some accounts in the `CreateCollection` struct are marked as `optional`. This is because, in the definition of the `CreateCollectionV2CpiBuilder`, certain accounts can be omitted.

```rust
/// ### Accounts:
///
///   0. `[writable, signer]` collection
///   1. `[optional]` update_authority
///   2. `[writable, signer]` payer
///   3. `[]` system_program
```

To make the example as flexible as possible, every `optional` account in the program instruction is also treated as `optional` in the `create_core_collection` instruction's account struct.

### Creating the Instruction

The `create_core_collection` function utilizes the inputs from the `CreateCollection` account struct and the `CreateCollectionArgs` arg struct that we defined earlier to interact with the `CreateCollectionV2CpiBuilder` program instruction.

```rust
pub fn create_core_collection(ctx: Context<CreateCollection>, args: CreateCollectionArgs) -> Result<()> {
  let update_authority = match &ctx.accounts.update_authority {
      Some(update_authority) => Some(update_authority.to_account_info()),
      None => None,
  };
  
  CreateCollectionV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
      .collection(&ctx.accounts.collection.to_account_info())
      .payer(&ctx.accounts.payer.to_account_info())
      .update_authority(update_authority.as_ref())
      .system_program(&ctx.accounts.system_program.to_account_info())
      .name(args.name)
      .uri(args.uri)
      .invoke()?;

  Ok(())
}
```

In this function, the accounts defined in the `CreateCollection` struct are accessed using `ctx.accounts`. Before passing these accounts to the `CreateCollectionV2CpiBuilder` program instruction, they need to be converted to their raw data form using the `.to_account_info()` method. 

This conversion is necessary because the builder requires the accounts in this format to interact correctly with the Solana runtime.

Some of the accounts in the `CreateAsset` struct are `optional`, meaning their value could be either `Some(account)` or `None`. To handle these optional accounts before passing them to the builder, we use a match statement that allows us to check if an account is present (Some) or absent (None) and based on this check, we bind the account as `Some(account.to_account_info())` if it exists, or as `None` if it doesn't. Like this:

```rust
let update_authority = match &ctx.accounts.update_authority {
    Some(update_authority) => Some(update_authority.to_account_info()),
    None => None,
};
```

After preparing all the necessary accounts, we pass them to the `CreateCollectionV2CpiBuilder` and use `.invoke()` to execute the instruction, or `.invoke_signed()` if we need to use signer seeds.

For more details on how the Metaplex CPI Builder works, you can refer to this [documentation](/guides/rust/how-to-cpi-into-a-metaplex-program#using-metaplex-rust-transaction-cpi-builders)

### Additional Actions

Before moving on, What if we want to create the asset with plugins and/or external plugins, such as the `FreezeDelegate` plugin or the `AppData` external plugin, already included? Here's how we can do it.

First, let's add all the additional necessary imports:

```rust
use mpl_core::types::{
    Plugin, FreezeDelegate, PluginAuthority,
    ExternalPluginAdapterInitInfo, AppDataInitInfo, 
    ExternalPluginAdapterSchema
};
```

Then let's create vectors to hold the plugins and external plugin adapters, so we can easily add the plugin (or more) using the right imports!

**Note**: Refer to the [documentation](/core/plugins) if you're not sure on what to use! 

```rust
let mut plugins: Vec<PluginAuthorityPair> = vec![];

plugins.push(
  PluginAuthorityPair { 
      plugin: Plugin::FreezeDelegate(FreezeDelegate {frozen: true}), 
      authority: Some(PluginAuthority::UpdateAuthority) 
  }
);

let mut external_plugin_adapters: Vec<ExternalPluginAdapterInitInfo> = vec![];
    
external_plugin_adapters.push(
  ExternalPluginAdapterInitInfo::AppData(
    AppDataInitInfo {
      init_plugin_authority: Some(PluginAuthority::UpdateAuthority),
      data_authority: PluginAuthority::Address{ address: data_authority },
      schema: Some(ExternalPluginAdapterSchema::Binary),
    }
  )
);
```

Lastly, let's integrate these plugins into the `CreateCollectionV2CpiBuilder` program instruction like this:

```rust
CreateCollectionV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
  .collection(&ctx.accounts.collection.to_account_info())
  .payer(&ctx.accounts.payer.to_account_info())
  .update_authority(update_authority.as_ref())
  .system_program(&ctx.accounts.system_program.to_account_info())
  .name(args.name)
  .uri(args.uri)
  .plugins(plugins)
  .external_plugin_adapters(external_plugin_adapters)    
  .invoke()?;
```

## Creating the Metadata for the Digital Asset

To display a recognisable image for your collection in the Wallets or on the Explorer, we need to create the URI where we can store the Metadata!

### Uploading the Image

Umi comes with downloadable storage plugins that allow you to upload to storage solutions such `Arweave`, `NftStorage`, `AWS`, and `ShdwDrive`. For this guide we're going to use the `irysUploader()` plugin which stores content on  Arweave.

In this example we're going to use a local approach using Irys to upload to Arweave; if you wish to upload files to a different storage provider or from the browser you will need to take a different approach. Importing and using `fs` won't work in a browser scenario.

```ts
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { irysUploader } from '@metaplex-foundation/umi-uploader-irys'
import fs from 'fs'
import path from 'path'

// Create Umi and tell it to use Irys
const umi = createUmi('https://api.devnet.solana.com')
  .use(irysUploader())

// use `fs` to read file via a string path.
// You will need to understand the concept of pathing from a computing perspective.
const imageFile = fs.readFileSync(
  path.join(__dirname, '..', '/assets/my-image.jpg')
)

// Use `createGenericFile` to transform the file into a `GenericFile` type
// that umi can understand. Make sure you set the mimi tag type correctly
// otherwise Arweave will not know how to display your image.
const umiImageFile = createGenericFile(imageFile, 'my-image.jpeg', {
  tags: [{ name: 'Content-Type', value: 'image/jpeg' }],
})

// Here we upload the image to Arweave via Irys and we get returned a uri
// address where the file is located. You can log this out but as the
// uploader can takes an array of files it also returns an array of uris.
// To get the uri we want we can call index [0] in the array.
const imageUri = await umi.uploader.upload([umiImageFile]).catch((err) => {
  throw new Error(err)
})

console.log(imageUri[0])
```

### Uploading the Metadata

Once we have a valid and working image URI we can start working on the metadata for our Collection.

The standard for offchain metadata for a fungible token is as follows. This should be filled out and writen to either an object `{}` without Javascript or saved to a `metadata.json` file.
We are going to look at the Javascript object approach.

```ts
const metadata = {
  name: 'My Collection',
  description: 'This is a Collection on Solana',
  image: imageUri[0],
  external_url: 'https://example.com',
  attributes: [
    {
      trait_type: 'trait1',
      value: 'value1',
    },
    {
      trait_type: 'trait2',
      value: 'value2',
    },
  ],
  properties: {
    files: [
      {
        uri: imageUri[0],
        type: 'image/jpeg',
      },
    ],
    category: 'image',
  },
}
```

The fields here include:

| field         | description                                                                                                                                                                               |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name          | The name of your Collection.                                                                                                                                                                     |
| description   | The description of your Collection.                                                                                                                                                              |
| image         | This will be set to the `imageUri` (or any online location of the image) that we uploaded previously.                                                                                     |
| animation_url | This will be set to the `animation_ulr` (or any online location of the video/glb) that you've uploaded.                                                                                   |
| external_url  | This would link to an external address of your choice. This is normally the projects website.                                                                                             |
| attributes    | Using an object og `{trait_type: vlue, "value": "value1"}`                                                                                                                                |
| image         | This will be set to the `imageUri` (or any online location of the image) that we uploaded previously.                                                                                     |
| properties    | Contains the `files` field that takes an `[] array` of `{uri: string, type: mimeType}`. Also contains the category field which can be set to `image`, `audio`, `video`, `vfx`, and `html` |

After creating the metadata, we need to Upload that as a Json file, so we can get an Uri to attach to our Collection

```js
// Call upon umi's `uploadJson function to upload our metadata to Arweave via Irys.
const metadataUri = await umi.uploader.uploadJson(metadata).catch((err) => {
  throw new Error(err)
})
```

Now we should finally have the URI of JSON file stored in the `metadataUri` providing it did not throw any errors.

## The Client

We finally arrived to the "testing" part of the guide. But before testing the program we've built, we need to compile the workspace. Use the following command to build everything so it's ready for deployment and testing:

```
anchor build
```

After testing, we should deploy the program so we can access it with our script. We can set the cluster we want to deploy the program to, in the `anchor.toml` file and then use the following command:

```
anchor deploy
```

Finally we're ready to test the program, but before, we need to work on the `create_core_collection_example.ts` in the tests folder.

### Imports and Templates

Here are all the imports and the general template needed for the test. 

```ts
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CreateCoreCollectionExample } from "../target/types/create_core_collection_example";
import { Keypair, SystemProgram } from "@solana/web3.js";
import { MPL_CORE_PROGRAM_ID } from "@metaplex-foundation/mpl-core";

describe("create-core-asset-example", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const wallet = anchor.Wallet.local();
  const program = anchor.workspace.CreateCoreCollectionExample as Program<CreateCoreCollectionExample>;

  let collection = Keypair.generate();

  it("Create Collection", async () => {

  });
});
```

### Creating the Test Function

In the test function, we're going to define the `createCollectionArgs` struct and then pass in all the necessary accounts to the `createCoreCollection` function.

```ts
it("Create Collection", async () => {

  let createCollectionArgs = {
    name: 'My Collection',
    uri: 'https://example.com/my-collection.json',
  };

  const createCollectionTx = await program.methods.createCoreCollection(createCollectionArgs)
    .accountsPartial({
      collection: collection.publicKey,
      payer: wallet.publicKey,
      updateAuthority: null,
      systemProgram: SystemProgram.programId,
      mplCoreProgram: MPL_CORE_PROGRAM_ID
    })
    .signers([collection, wallet.payer])
    .rpc();

  console.log(createCollectionTx);
});
```

We start by calling the `createCoreCollection` method and passing as input the `createCollectionArgs` struct we just created:

```ts
await program.methods.createCoreCollection(createCollectionArgs)
```

Next, we specify all the accounts required by the function. Since some of these accounts are `optional`, we can pass `null` for simplicity where the account isn't needed:

```ts
.accountsPartial({
  collection: collection.publicKey,
  payer: wallet.publicKey,
  updateAuthority: null,
  systemProgram: SystemProgram.programId,
  mplCoreProgram: MPL_CORE_PROGRAM_ID
})
```

Finally, we provide the signers and send the transaction using the `.rpc()` method:

```ts
.signers([collection, wallet.payer])
.rpc();
```