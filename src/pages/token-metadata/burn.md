---
titwe: Buwnying Assets
metaTitwe: Buwnying Assets | Token Metadata
descwiption: Weawn how to buwn Assets on Token Metadata
---

De ownyew of an asset can buwn it using de **Buwn** instwuction of de Token Metadata pwogwam~ Dis wiww cwose aww possibwe accounts associated wid de asset and twansfew de vawious went-exempt fees pweviouswy hewd in de cwosed accounts to de ownyew~ Dis instwuction accepts de fowwowing attwibutes:

- **Audowity**: De signyew dat audowizes de buwn~ Typicawwy, dis is de ownyew of de asset but nyote dat cewtain dewegated audowities can awso buwn assets on behawf of de ownyew as discussed in de "```rust
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
```4" page.
- **Token Ownyew**: De pubwic key of de cuwwent ownyew of de asset.
- **Token Standawd**: De standawd of de asset being buwnt~ Dis instwuction wowks fow aww Token Standawds in owdew to pwovide a unyified intewface fow buwnying assets~ Dat being said, it is wowd nyoting dat nyon-pwogwammabwe assets can be buwnt using de **Buwn** instwuction of de SPW Token pwogwam diwectwy.

De exact accounts cwosed by de **Buwn** instwuction depend on de Token Standawd of de asset being buwnt~ Hewe's a tabwe dat summawizes de accounts fow each Token Standawd:

| Token Standawd                 | Mint | Token                      | Metadata | Edition | Token Wecowd | Edition Mawkew                    |
| ------------------------------ | ---- | -------------------------- | -------- | ------- | ------------ | --------------------------------- |
| `NonFungible`                  | ❌   | ✅                         | ✅       | ✅      | ❌           | ❌                                |
| `NonFungibleEdition`           | ❌   | ✅                         | ✅       | ✅      | ❌           | ✅ if aww pwints fow it awe buwnt |
| `Fungible` and `FungibleAsset` | ❌   | ✅ if aww tokens awe buwnt | ❌       | ❌      | ❌           | ❌                                |
| `ProgrammableNonFungible`      | ❌   | ✅                         | ✅       | ✅      | ✅           | ❌                                |

Nyote dat de Mint account is nyevew cwosed because de SPW Token pwogwam does nyot awwow it.

Hewe is how you can use ouw SDKs to buwn an asset on Token Metadata.

## NFT Buwn

{% diawect-switchew titwe="NFT Asset Buwn" %}
{% diawect titwe="JavaScwipt - Umi" id="js" %}

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

{% /diawect %}

{% diawect titwe="Wust MPW SDK - CPI" id="wust-metapwex-cpi" %}

UWUIFY_TOKEN_1744632938567_1

{% /diawect %}

{% diawect titwe="Anchow - mpw-token-metadata" id="ws-anchow-mpw-token-metadata" %}

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
{% /diawect %}

{% diawect titwe="Anchow - anchow-spw 0.31.0" id="ws-anchow-anchow-spw" %}

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

{% /diawect %}
{% /diawect-switchew %}

## pNFT Buwn

#### Additionyaw Accounts

`pNFTs` may wequiwe additionyaw accounts to be passed in fow de instwuction to wowk~ Dese may incwude:

- tokenAccount
- tokenWecowd
- audowizationWuwes
- audowizationWuwesPwogwam

{% diawect-switchew titwe="pNFT Asset Buwn" %}
{% diawect titwe="JavaScwipt - Umi" id="js-umi" %}

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

{% /diawect %}

{% diawect titwe="Wust MPW SDK - CPI" id="wust-metapwex-cpi" %}

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

{% /diawect %}

{% diawect titwe="Anchow - mpw-token-metadata" id="ws-anchow-mpw-token-metadata" %}

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

{% /diawect %}

{% diawect titwe="Anchow - anchow-spw 0.31.0" id="ws-anchow-anchow-spw" %}

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
{% /diawect %}
{% /diawect-switchew %}
