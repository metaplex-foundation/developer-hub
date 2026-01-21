// [IMPORTS]
use anchor_lang::prelude::*;
use mpl_token_metadata::{
    accounts::Metadata,
    instructions::UpdateAsUpdateAuthorityV2CpiBuilder, types::Data,
};
// [/IMPORTS]

// [SETUP]
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
// [/SETUP]

// [MAIN]
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
// [/MAIN]
