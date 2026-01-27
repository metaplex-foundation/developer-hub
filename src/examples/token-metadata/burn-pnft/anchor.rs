// [IMPORTS]
use anchor_lang::prelude::*;
use anchor_spl::token::Mint;
use mpl_token_metadata::instructions::BurnV1CpiBuilder;
// [/IMPORTS]

// [SETUP]
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
// [/SETUP]

// [MAIN]
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
// [/MAIN]
