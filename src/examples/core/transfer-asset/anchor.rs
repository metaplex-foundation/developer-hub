// [IMPORTS]
use anchor_lang::prelude::*;
// [/IMPORTS]

// [MAIN]
declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod transfer_asset {
    use super::*;

    // Transfer an existing NFT asset to a new owner
    pub fn transfer(
        ctx: Context<TransferAsset>
    ) -> Result<()> {
        let asset = &mut ctx.accounts.asset;

        // Verify current owner
        require!(
            asset.owner == ctx.accounts.current_owner.key(),
            ErrorCode::Unauthorized
        );

        // Transfer ownership
        asset.owner = ctx.accounts.new_owner.key();

        msg!("Asset transferred to: {}", asset.owner);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct TransferAsset<'info> {
    #[account(mut)]
    pub asset: Account<'info, Asset>,
    pub current_owner: Signer<'info>,
    /// CHECK: New owner can be any account
    pub new_owner: AccountInfo<'info>,
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
