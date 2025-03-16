---
title: Updating Assets
metaTitle: Updating Assets | Token Metadata
description: Learn how to update Assets on Token Metadata
---

The update authority of an asset can update its **Metadata** account using the **Update** instruction as long as the **Is Mutable** attribute is set to `true`. The **Update** instruction requires the **Update Authority** to sign the transaction and can update the following attributes of the **Metadata** account:

## Updatable Fields

Note that certain delegated authorities can also update the **Metadata** account of assets as discussed in the "[Delegated Authorities](/token-metadata/delegates)" page.

Below is an explanation of all the individual fields available for update in the `UpdateV1` instruction.

### The Data Object

The object that defines the Name, Symbol, URI, Seller Fee Basis Points and the array of Creators of the asset. Note that the update authority can only add and/or remove unverified creators from the Creators array. The only exception is if the creator is the update authority, in which case the added or removed creators can be verified.

{% dialect-switcher title="Data Object" %}
{% dialect title="JavaScript" id="js" %}

```ts
const data = {
  name: 'New Name',
  symbol: 'New Symbol',
  uri: 'https://newuri.com',
  sellerFeeBasisPoints: 500,
  creators: [],
}
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
pub struct DataV2 {
    pub name: String,
    pub symbol: String,
    pub uri: String,
    pub seller_fee_basis_points: u16,
    pub creators: Option<Vec<Creator>>,
    pub collection: Option<Collection>,
    pub uses: Option<Uses>,
}
```

{% /dialect %}

{% /dialect-switcher %}

### Primary Sale Happened

Primary Sale Happened: A boolean that indicates whether the asset has been sold before.

{% dialect-switcher title="Primary Sale Happened" %}
{% dialect title="JavaScript" id="js" %}

```ts
primarySaleHappened: true
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
primary_sale_happened: Option<bool>,
```

{% /dialect %}
{% /dialect-switcher %}

### Is Mutable

A boolean that indicates whether the asset can be updated again. When changing this to false, any future updates will fail.

{% dialect-switcher title="Is Mutable" %}
{% dialect title="JavaScript" id="js" %}

```ts
isMutable: true
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
is_mutable: Option<bool>,
```

{% /dialect %}
{% /dialect-switcher %}

### Collection

This attribute enables us to set or clear the collection of the asset. Note that when setting a new collection, the verified boolean must be set to false and [verified using another instruction](/token-metadata/collections).

#### Setting A Collection

{% dialect-switcher title="Setting A Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
collection: collectionToggle('Set', [
  {
    key: publicKey('11111111111111111111111111111111'),
    verified: false,
  },
])
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
collection: Some( Collection {
  key: PubKey,
  verified: Boolean,
}),
```

{% /dialect %}
{% /dialect-switcher %}

#### Clearing a Collection

{% dialect-switcher title="Clearing a Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
collection: collectionToggle("Clear"),
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
collection: None,
```

{% /dialect %}
{% /dialect-switcher %}

### New Update Authority

A new update authority can be assigned to an Asset by passing in the `newUpdateAuthority` field.

{% dialect-switcher title="New Update Authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
newUpdateAuthority: publicKey('1111111111111111111111111111111')
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
new_update_authority: Option<PubKey>,
```

{% /dialect %}
{% /dialect-switcher %}

### Programable RuleSets

This attribute enables us to set or clear the rule set of the asset. This is only relevant for [Programmable Non-Fungibles](/token-metadata/pnfts).

{% dialect-switcher title="Programable RuleSets" %}
{% dialect title="JavaScript" id="js" %}

```ts
ruleSet: publicKey('1111111111111111111111111111111')
```

{% /dialect %}

{% dialect title="Rust - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
// Not available in Rust anchor-spl SDK
```

{% /dialect %}
{% /dialect-switcher %}

Here is how you can use our SDKs to update an asset on Token Metadata.

## Update As Update Authority

### NFT Asset

This example shows you how to update an NFT Asset as the update Authority of the Asset.

{% dialect-switcher title="Update Assets" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  updateV1,
  fetchMetadataFromSeeds,
} from '@metaplex-foundation/mpl-token-metadata'

const initialMetadata = await fetchMetadataFromSeeds(umi, { mint })
await updateV1(umi, {
  mint,
  authority: updateAuthority,
  data: { ...initialMetadata, name: 'Updated Asset' },
}).sendAndConfirm(umi)
```

If you want to update more than just the **Data** attribute of the **Metadata** account, simply provide these attributes to the `updateV1` method.

```ts
import {
  updateV1,
  fetchMetadataFromSeeds,
} from '@metaplex-foundation/mpl-token-metadata'

const initialMetadata = await fetchMetadataFromSeeds(umi, { mint })
await updateV1(umi, {
  mint,
  authority: updateAuthority,
  data: { ...initialMetadata, name: 'Updated Asset' },
  primarySaleHappened: true,
  isMutable: true,
  // ...
}).sendAndConfirm(umi)
```

    {% /totem %}

{% /dialect %}

{% dialect title="Anchor - mpl-token-metadata" id="rust-anchor-mpl-token-metadata" %}

```rust
use anchor_lang::prelude::*;
use mpl_token_metadata::{
    accounts::Metadata,
    instructions::UpdateAsUpdateAuthorityV2CpiBuilder, types::Data,
};

#[derive(Accounts)]
pub struct NftUpdateMpl<'info> {
    pub mint: AccountInfo<'info>,
    /// CHECK: Handled by CPI
    #[account(mut)]
    pub metadata: AccountInfo<'info>,
    #[account(mut)]
    pub update_authority: Signer<'info>,
    /// CHECK: Handled by CPI
    pub token_metadata_program: AccountInfo<'info>,
}

pub fn update_nft_mpl_instruction<'info>(
    ctx: Context<'_, '_, '_, 'info, NftUpdateMpl<'info>>,
    new_name: Option<String>,
    new_uri: Option<String>,
) -> Result<()> {
    let mint = ctx.accounts.mint.to_account_info();
    let metadata = ctx.accounts.metadata.to_account_info();
    let token_metadata_program = ctx.accounts.token_metadata_program.to_account_info();

    // Get the original metadata values
    let metadata_account = Metadata::try_from(&metadata)?;

    let original_metadata = Data {
        name: metadata_account.name,
        symbol: metadata_account.symbol,
        uri: metadata_account.uri,
        seller_fee_basis_points: metadata_account.seller_fee_basis_points,
        creators: metadata_account.creators,
    };

    let new_metadata = Data {
        name: new_name.unwrap_or(original_metadata.name),
        uri: new_uri.unwrap_or(original_metadata.uri),
        ..original_metadata // Keep the rest of the metadata the same
    };

    UpdateAsUpdateAuthorityV2CpiBuilder::new(&token_metadata_program)
        .mint(&mint)
        .metadata(&metadata)
        .authority(&ctx.accounts.update_authority)
        .data(new_metadata)
        // Add remaining data fields/accounts to be adjusted to the CPI if needed
        // https://docs.rs/mpl-token-metadata/latest/mpl_token_metadata/instructions/struct.UpdateAsUpdateAuthorityV2CpiBuilder.html
        .invoke()?;

    Ok(())
}
```

{% /dialect %}

{% dialect title="Anchor - anchor-spl 0.31.0" id="rust-anchor" %}

```rust
use anchor_lang::prelude::*;
use anchor_spl::{
    metadata::{mpl_token_metadata::types::DataV2, update_metadata_accounts_v2, MetadataAccount, UpdateMetadataAccountsV2},
    token::Mint,
};

#[derive(Accounts)]
pub struct UpdateNft<'info> {
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    /// CHECK: Handled by CPI
    #[account(mut)]
    pub metadata: Account<'info, MetadataAccount>,
    #[account(mut)]
    pub update_authority: Signer<'info>,
    /// CHECK: Handled by CPI
    pub token_metadata_program: AccountInfo<'info>,
}

pub fn update_nft_instruction<'info>(
    ctx: Context<'_, '_, '_, 'info, UpdateNft<'info>>,
    new_name: Option<String>,
    new_uri: Option<String>,
) {
    let cpi_accounts = UpdateMetadataAccountsV2 {
        metadata: ctx.accounts.metadata.to_account_info().clone(),
        update_authority: ctx.accounts.update_authority.to_account_info().clone(),
    };

    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_metadata_program.clone(),
        cpi_accounts,
    );

    let original_metadata = DataV2 {
        name: ctx.accounts.metadata.name.clone(),
        symbol: ctx.accounts.metadata.symbol.clone(),
        uri: ctx.accounts.metadata.uri.clone(),
        seller_fee_basis_points: ctx.accounts.metadata.seller_fee_basis_points,
        creators: ctx.accounts.metadata.creators.clone(),
        collection: ctx.accounts.metadata.collection.clone(),
        uses: ctx.accounts.metadata.uses.clone(),
    };

    let new_metadata = DataV2 {
        name: new_name.clone().unwrap_or(original_metadata.name),
        uri: new_uri.clone().unwrap_or(original_metadata.uri),
        ..original_metadata
    };

    update_metadata_accounts_v2(
        cpi_ctx,
        None, // New update authority
        Some(new_metadata), // Data
        None, // Primary sale happened
        None, // Is mutable
    ).expect("Failed to update NFT metadata");
}
```

{% /dialect %}
{% /dialect-switcher %}

### pNFT Asset

This example shows you how to update a Programable NFT (pNFT) Asset as the update Authority of the Asset.

#### Additional Accounts

`pNFTs` may require additional accounts to be passed in for the instruction to work. These include:

- tokenAccount
- tokenRecord
- authorizationRules
- authorizationRulesProgram

{% dialect-switcher title="pNFT Asset Update" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getMplTokenAuthRulesProgramId } from '@metaplex-foundation/mpl-candy-machine'
import {
  collectionToggle,
  fetchMetadataFromSeeds,
  TokenStandard,
  updateAsUpdateAuthorityV2,
} from '@metaplex-foundation/mpl-token-metadata'
import { publicKey, unwrapOptionRecursively } from '@metaplex-foundation/umi'

// The Mint ID of the pNFT Asset
const mintId = publicKey('1111111111111111111111111111111')

// Fetch the Metadata of the pNFT Asset
const metadata = await fetchMetadataFromSeeds(umi, { mint: mintId })

// Set the new Data of the pNFT Asset
const data = {
  name: 'New Name',
  symbol: 'New Symbol',
  uri: 'https://newuri.com',
  sellerFeeBasisPoints: 500,
  creators: [],
}

// Update the pNFT as the Update Authority
const txRes = await updateAsUpdateAuthorityV2(umi, {
  mint: mintId,
  data: data,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
  collection: collectionToggle('Clear'),
  // Check to see if the pNFT asset as auth rules.
  authorizationRules:
    unwrapOptionRecursively(metadata.programmableConfig)?.ruleSet || undefined,
  // Auth rules program ID
  authorizationRulesProgram: getMplTokenAuthRulesProgramId(umi),
  // You may have to set authorizationData if required by the authorization rules
  authorizationData: undefined,
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}

{% dialect title="Anchor - mpl-token-metadata" id="rust-anchor-mpl-token-metadata" %}

```rust
use anchor_lang::prelude::*;
use mpl_token_metadata::{
    accounts::Metadata,
    instructions::UpdateAsUpdateAuthorityV2CpiBuilder, types::Data,
};

#[derive(Accounts)]
pub struct NftUpdateMpl<'info> {
    pub mint: AccountInfo<'info>,
    /// CHECK: Handled by CPI
    #[account(mut)]
    pub metadata: AccountInfo<'info>,
    #[account(mut)]
    pub update_authority: Signer<'info>,
    /// CHECK: Handled by CPI
    pub token_metadata_program: AccountInfo<'info>,
    // Add additional accounts below if needed
}

pub fn update_nft_mpl_instruction<'info>(
    ctx: Context<'_, '_, '_, 'info, NftUpdateMpl<'info>>,
    new_name: Option<String>,
    new_uri: Option<String>,
) -> Result<()> {
    let mint = ctx.accounts.mint.to_account_info();
    let metadata = ctx.accounts.metadata.to_account_info();
    let token_metadata_program = ctx.accounts.token_metadata_program.to_account_info();

    // Get the original metadata values
    let metadata_account = Metadata::try_from(&metadata)?;

    let original_metadata = Data {
        name: metadata_account.name,
        symbol: metadata_account.symbol,
        uri: metadata_account.uri,
        seller_fee_basis_points: metadata_account.seller_fee_basis_points,
        creators: metadata_account.creators,
    };

    let new_metadata = Data {
        name: new_name.unwrap_or(original_metadata.name),
        uri: new_uri.unwrap_or(original_metadata.uri),
        ..original_metadata // Keep the rest of the metadata the same
    };

    UpdateAsUpdateAuthorityV2CpiBuilder::new(&token_metadata_program)
        .mint(&mint)
        .metadata(&metadata)
        .authority(&ctx.accounts.update_authority)
        .data(new_metadata)
        
        // Add remaining data fields to be adjusted to the CPI if needed
        // https://docs.rs/mpl-token-metadata/latest/mpl_token_metadata/instructions/struct.UpdateAsUpdateAuthorityV2CpiBuilder.html       
        //
        // .authorization_rules(authorization_rules)
        // .authorization_rules_program(authorization_rules_program)
        // .token_record(token_record)
        .invoke()?;

    Ok(())
}

```

{% /dialect %}

{% dialect title="Anchor - anchor-spl 0.31.0" id="rust-anchor-anchor-spl" %}

```rust
use anchor_lang::prelude::*;
use anchor_spl::{
    metadata::{
        mpl_token_metadata::types::DataV2, update_metadata_accounts_v2, MetadataAccount,
        UpdateMetadataAccountsV2,
    },
    token::Mint,
};

#[derive(Accounts)]
pub struct UpdatePnft<'info> {
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    /// CHECK: Handled by CPI
    #[account(mut)]
    pub metadata: Account<'info, MetadataAccount>,
    #[account(mut)]
    pub update_authority: Signer<'info>,
    /// CHECK: Handled by CPI
    pub token_metadata_program: AccountInfo<'info>,
    /// CHECK: Optional collection metadata
    #[account(mut)]
    pub collection_metadata: Option<AccountInfo<'info>>,
}

pub fn update_pnft_instruction<'info>(
    ctx: Context<'_, '_, '_, 'info, UpdatePnft<'info>>,
    new_name: Option<String>,
    new_uri: Option<String>,
) {
    let cpi_accounts = UpdateMetadataAccountsV2 {
        metadata: ctx.accounts.metadata.to_account_info().clone(),
        update_authority: ctx.accounts.update_authority.to_account_info().clone(),
    };

    let remaining_accounts: Vec<AccountInfo> = ctx
        .remaining_accounts
        .iter()
        .map(|a| (*a).clone())
        .collect();

    // Create CPI context
    let cpi_ctx = CpiContext::new(ctx.accounts.token_metadata_program.clone(), cpi_accounts)
        // The two remaining accounts to include (if Token Authorization Rules are used) are:
        // Token Authorization Rules Program
        // Token Authorization Rules account
        .with_remaining_accounts(remaining_accounts);

    let original_metadata = DataV2 {
        name: ctx.accounts.metadata.name.clone(),
        symbol: ctx.accounts.metadata.symbol.clone(),
        uri: ctx.accounts.metadata.uri.clone(),
        seller_fee_basis_points: ctx.accounts.metadata.seller_fee_basis_points,
        creators: ctx.accounts.metadata.creators.clone(),
        collection: ctx.accounts.metadata.collection.clone(),
        uses: ctx.accounts.metadata.uses.clone(),
    };

    let new_metadata = DataV2 {
        name: new_name.clone().unwrap_or(original_metadata.name),
        uri: new_uri.clone().unwrap_or(original_metadata.uri),
        ..original_metadata
    };

    // Update metadata for the NFT - correct parameter order
    update_metadata_accounts_v2(
        cpi_ctx,
        None,               // New update authority
        Some(new_metadata), // Data
        None,               // Primary sale happened
        None,               // Is mutable
    )
    .expect("Failed to update PNFT metadata");
}
```

{% /dialect %}
{% /dialect-switcher %}
