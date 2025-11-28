// [IMPORTS]
use anchor_lang::prelude::*;
// [/IMPORTS]

// [MAIN]
declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod burn_asset {
    use super::*;

    // Permanently destroy/burn an NFT asset
    pub fn burn(ctx: Context<BurnAsset>) -> Result<()> {
        let asset = &mut ctx.accounts.asset;

        // Verify owner
        require!(
            asset.owner == ctx.accounts.owner.key(),
            ErrorCode::Unauthorized
        );

        // Close the account to burn the asset
        msg!("Asset burned: {}", asset.key());
        Ok(())
    }
}

#[derive(Accounts)]
pub struct BurnAsset<'info> {
    #[account(mut, close = owner)]
    pub asset: Account<'info, Asset>,
    pub owner: Signer<'info>,
}

#[account]
pub struct Asset {
    pub name: String,
    pub uri: String,
    pub owner: Pubkey,
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized: You are not the owner of this asset")]
    Unauthorized,
}
// [/MAIN]
