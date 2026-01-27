// [IMPORTS]
use anchor_lang::prelude::*;
use anchor_spl::token::Mint;
use mpl_token_metadata::instructions::BurnNftCpiBuilder;
// [/IMPORTS]

// [SETUP]
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
// [/SETUP]

// [MAIN]
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
// [/MAIN]
