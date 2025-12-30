---
title: Burning Assets
metaTitle: Burning Assets | Token Metadata
description: Learn how to burn Assets on Token Metadata
---

The owner of an asset can burn it using the **Burn** instruction of the Token Metadata program. This will close all possible accounts associated with the asset and transfer the various rent-exempt fees previously held in the closed accounts to the owner. This instruction accepts the following attributes:

- **Authority**: The signer that authorizes the burn. Typically, this is the owner of the asset but note that certain delegated authorities can also burn assets on behalf of the owner as discussed in the "[Delegated Authorities](/smart-contracts/token-metadata/delegates)" page.
- **Token Owner**: The public key of the current owner of the asset.
- **Token Standard**: The standard of the asset being burnt. This instruction works for all Token Standards in order to provide a unified interface for burning assets. That being said, it is worth noting that non-programmable assets can be burnt using the **Burn** instruction of the SPL Token program directly.

The exact accounts closed by the **Burn** instruction depend on the Token Standard of the asset being burnt. Here's a table that summarizes the accounts for each Token Standard:

| Token Standard                 | Mint | Token                      | Metadata | Edition | Token Record | Edition Marker                    |
| ------------------------------ | ---- | -------------------------- | -------- | ------- | ------------ | --------------------------------- |
| `NonFungible`                  | ❌   | ✅                         | ✅       | ✅      | ❌           | ❌                                |
| `NonFungibleEdition`           | ❌   | ✅                         | ✅       | ✅      | ❌           | ✅ if all prints for it are burnt |
| `Fungible` and `FungibleAsset` | ❌   | ✅ if all tokens are burnt | ❌       | ❌      | ❌           | ❌                                |
| `ProgrammableNonFungible`      | ❌   | ✅                         | ✅       | ✅      | ✅           | ❌                                |

Note that the Mint account is never closed because the SPL Token program does not allow it.

Here is how you can use our SDKs to burn an asset on Token Metadata.

## NFT Burn

{% dialect-switcher title="NFT Asset Burn" %}
{% dialect title="JavaScript - Umi" id="js" %}

```ts
import { burnV1 } from '@metaplex-foundation/mpl-token-metadata'

await burnV1(umi, {
  mint,
  authority: owner,
  tokenOwner: owner.publicKey,
  tokenStandard: TokenStandard.NonFungible,
  // if your NFT is part of a collection you will also need to pass in the collection metadata address.
  collectionMetadata: findMetadataPda( umi, { mint: collectionMintAddress })
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust MPL SDK - CPI" id="rust-metaplex-cpi" %}

```rust
use mpl_token_metadata::instructions::BurnNftCpiBuilder;

 BurnNftCpiBuilder::new(&metadata_program_id)
    .metadata(&metadata)
    // if your NFT is part of a collection you will need to pass in the collection metadata address.
    .collection_metadata(collection_metadata.as_ref())
    .owner(&owner)
    .mint(&mint)
    .token_account(&token)
    .master_edition_account(&edition)
    .spl_token_program(&spl_token)
    .invoke()?;
```

{% /dialect %}

{% dialect title="Anchor - mpl-token-metadata" id="rs-anchor-mpl-token-metadata" %}

```rust
use anchor_lang::prelude::*;
use anchor_spl::token::Mint;
use mpl_token_metadata::instructions::BurnNftCpiBuilder;

#[derive(Accounts)]
pub struct NftBurnMpl<'info> {
    #[account(mut)]
    owner: Signer<'info>,
    #[account(mut)]
    mint: Account<'info, Mint>,
    #[account(mut)]
    metadata: AccountInfo<'info>,
    #[account(mut)]
    token: AccountInfo<'info>,
    #[account(mut)]
    edition: AccountInfo<'info>,
    collection_metadata: Option<AccountInfo<'info>>,
    spl_token: AccountInfo<'info>,
    metadata_program_id: AccountInfo<'info>,
}

pub fn burn_nft_mpl_instruction<'info>(
    ctx: Context<'_, '_, '_, 'info, NftBurnMpl<'info>>,
) -> Result<()> {
    let owner = ctx.accounts.owner.to_account_info();
    let metadata = ctx.accounts.metadata.to_account_info();
    let collection_metadata = ctx.accounts.collection_metadata.as_ref().map(|a| a.to_account_info());
    let mint = ctx.accounts.mint.to_account_info();
    let token = ctx.accounts.token.to_account_info();
    let edition = ctx.accounts.edition.to_account_info();
    let spl_token = ctx.accounts.spl_token.to_account_info();
    let metadata_program_id = ctx.accounts.metadata_program_id.to_account_info();

    BurnNftCpiBuilder::new(&metadata_program_id)
        .metadata(&metadata)
        // if your NFT is part of a collection you will also need to pass in the collection metadata address.
        .collection_metadata(collection_metadata.as_ref())
        .owner(&owner)
        .mint(&mint)
        .token_account(&token)
        .master_edition_account(&edition)
        .spl_token_program(&spl_token)
        .invoke()?;

    Ok(())
}
```
{% /dialect %}

{% dialect title="Anchor - anchor-spl 0.31.0" id="rs-anchor-anchor-spl" %}

```rust
use anchor_lang::prelude::*;
use anchor_spl::{metadata::BurnNft, token::Mint};


#[derive(Accounts)]
pub struct NftBurn<'info> {
    #[account(mut)]
    owner: Signer<'info>,
    #[account(mut)]
    mint: Account<'info, Mint>,
    #[account(mut)]
    metadata: AccountInfo<'info>,
    #[account(mut)]
    token: AccountInfo<'info>,
    #[account(mut)]
    edition: AccountInfo<'info>,
    spl_token: AccountInfo<'info>,
    metadata_program_id: AccountInfo<'info>,
}

pub fn burn_nft_instruction(ctx: Context<NftBurn>) {

        let owner = ctx.accounts.owner.to_account_info();
        let metadata = ctx.accounts.metadata.to_account_info();
        let mint = ctx.accounts.mint.to_account_info();
        let token = ctx.accounts.token.to_account_info();
        let edition = ctx.accounts.edition.to_account_info();
        let spl_token = ctx.accounts.spl_token.to_account_info();
        let metadata_program_id = ctx.accounts.metadata_program_id.to_account_info();

        CpiContext::new(
            metadata_program_id,
            BurnNft {
                metadata,
                owner,
                mint,
                token,
                edition,
                spl_token,
            },
        );

}
```

{% /dialect %}
{% /dialect-switcher %}

## pNFT Burn

#### Additional Accounts

`pNFTs` may require additional accounts to be passed in for the instruction to work. These may include:

- tokenAccount
- tokenRecord
- authorizationRules
- authorizationRulesProgram

{% dialect-switcher title="pNFT Asset Burn" %}
{% dialect title="JavaScript - Umi" id="js-umi" %}

```ts
import {
  burnV1,
  fetchDigitalAssetWithAssociatedToken,
  findMetadataPda,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata'
import { publicKey, unwrapOption } from '@metaplex-foundation/umi'
import { base58 } from '@metaplex-foundation/umi/serializers'

// The pNFT mint ID
const mintId = publicKey('11111111111111111111111111111111')

// Fetch the pNFT Asset with the Token Account
const assetWithToken = await fetchDigitalAssetWithAssociatedToken(
  umi,
  mintId,
  umi.identity.publicKey
)

// Determine if the pNFT Asset is in a collection
const collectionMint = unwrapOption(assetWithToken.metadata.collection)

// If there's a collection find the collection metadata PDAs
const collectionMetadata = collectionMint
  ? findMetadataPda(umi, { mint: collectionMint.key })
  : null

// Burn the pNFT Asset
const res = await burnV1(umi, {
  mint: mintId,
  collectionMetadata: collectionMetadata || undefined,
  token: assetWithToken.token.publicKey,
  tokenRecord: assetWithToken.tokenRecord?.publicKey,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)

const signature = base58.deserialize(tx.signature)[0]
console.log('Transaction Signature: ' + signature)
```

{% /dialect %}

{% dialect title="Rust MPL SDK - CPI" id="rust-metaplex-cpi" %}

```rust
use mpl_token_metadata::instructions::BurnNftCpiBuilder;

BurnNftCpiBuilder::new(metadata_program_id.account_info())
        .metadata(metadata.account_info())
        .collection_metadata(Some(collection_metadata.account_info()))
        .owner(owner.account_info())
        .mint(mint.account_info())
        .token_account(token.account_info())
        .master_edition_account(edition.account_info())
        .spl_token_program(spl_token.account_info())
        .invoke()?;
```

{% /dialect %}

{% dialect title="Anchor - mpl-token-metadata" id="rs-anchor-mpl-token-metadata" %}

```rust
use anchor_lang::prelude::*;
use anchor_spl::token::Mint;
use mpl_token_metadata::instructions::BurnV1CpiBuilder;

#[derive(Accounts)]
pub struct PnftBurnMpl<'info> {
    #[account(mut)]
    owner: Signer<'info>,
    #[account(mut)]
    mint: Account<'info, Mint>,
    #[account(mut)]
    metadata: AccountInfo<'info>,
    #[account(mut)]
    token: AccountInfo<'info>,
    #[account(mut)]
    master_edition: AccountInfo<'info>,
    #[account(mut)]
    token_record: AccountInfo<'info>,
    collection_metadata: Option<AccountInfo<'info>>,
    spl_token: AccountInfo<'info>,
    metadata_program_id: AccountInfo<'info>,
}

pub fn burn_pnft_mpl_instruction<'info>(
    ctx: Context<'_, '_, '_, 'info, PnftBurnMpl<'info>>,
) -> Result<()> {
let owner = ctx.accounts.owner.to_account_info();
let metadata = ctx.accounts.metadata.to_account_info();
let mint = ctx.accounts.mint.to_account_info();
let token = ctx.accounts.token.to_account_info();
let master_edition = ctx.accounts.master_edition.to_account_info();
let collection_metadata = ctx
    .accounts
    .collection_metadata
    .as_ref()
    .map(|a| a.to_account_info());
let spl_token = ctx.accounts.spl_token.to_account_info();
let token_record = ctx.accounts.token_record.to_account_info();
let metadata_program_id = ctx.accounts.metadata_program_id.to_account_info();

BurnV1CpiBuilder::new(&metadata_program_id)
    .metadata(&metadata)
    .collection_metadata(collection_metadata.as_ref())
    .authority(&owner)
    .mint(&mint)
    .token(&token)
    .spl_token_program(&spl_token)
    .token_record(Some(&token_record))
    .master_edition(Some(&master_edition)) 
    .invoke()?;

Ok(())
}
```

{% /dialect %}

{% dialect title="Anchor - anchor-spl 0.31.0" id="rs-anchor-anchor-spl" %}

```rust
use anchor_lang::prelude::*;
use anchor_spl::{metadata::{BurnNft, burn_nft}, token::Mint};

#[derive(Accounts)]
pub struct PnftBurn<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(mut)]
    pub mint: Account<'info, Mint>,
    #[account(mut)]
    pub metadata: AccountInfo<'info>,
    #[account(mut)]
    pub token: AccountInfo<'info>,
    #[account(mut)]
    pub edition: AccountInfo<'info>,
    pub spl_token: AccountInfo<'info>,
    pub metadata_program_id: AccountInfo<'info>,
    /// CHECK: Optional collection metadata
    #[account(mut)]
    pub collection_metadata: Option<AccountInfo<'info>>,
}

pub fn burn_pnft_instruction<'info>(
    ctx: Context<'_, '_, '_, 'info, PnftBurn<'info>>,
) {
    // Create the accounts struct
    let cpi_accounts = BurnNft {
        metadata: ctx.accounts.metadata.clone(),
        owner: ctx.accounts.owner.to_account_info().clone(),
        mint: ctx.accounts.mint.to_account_info().clone(),
        token: ctx.accounts.token.clone(),
        edition: ctx.accounts.edition.clone(),
        spl_token: ctx.accounts.spl_token.clone(),
    };
    
    // Create CPI context
    let cpi_ctx = CpiContext::new(
        ctx.accounts.metadata_program_id.clone(),
        cpi_accounts,
    ).with_remaining_accounts(ctx.remaining_accounts.to_vec());
    
    // Get collection metadata pubkey if it exists
    let collection_metadata = ctx.accounts.collection_metadata.as_ref().map(|a| a.key());
    
    // Execute the CPI
    burn_nft(cpi_ctx, collection_metadata).expect("Failed to burn PNFT");
}
```
{% /dialect %}
{% /dialect-switcher %}
