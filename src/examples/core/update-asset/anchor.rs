// [IMPORTS]
use anchor_lang::prelude::*;
// [/IMPORTS]

// [MAIN]
declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod update_asset {
    use super::*;

    // Update an existing NFT asset's metadata
    pub fn update(
        ctx: Context<UpdateAsset>,
        new_name: String,
        new_uri: String,
    ) -> Result<()> {
        let asset = &mut ctx.accounts.asset;

        // Verify owner
        require!(
            asset.owner == ctx.accounts.owner.key(),
            ErrorCode::Unauthorized
        );

        // Update metadata
        asset.name = new_name;
        asset.uri = new_uri;

        msg!("Asset updated: {}", asset.key());
        Ok(())
    }
}

#[derive(Accounts)]
pub struct UpdateAsset<'info> {
    #[account(mut)]
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
