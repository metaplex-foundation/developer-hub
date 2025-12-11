// [IMPORTS]
use anchor_lang::prelude::*;
// [/IMPORTS]

// [MAIN]
declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod create_asset {
    use super::*;

    // Create a new NFT asset
    pub fn create(
        ctx: Context<CreateAsset>,
        name: String,
        uri: String
    ) -> Result<()> {
        let asset = &mut ctx.accounts.asset;
        asset.name = name;
        asset.uri = uri;
        asset.owner = ctx.accounts.owner.key();

        msg!("Asset created: {}", asset.key());
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateAsset<'info> {
    #[account(init, payer = owner, space = 8 + 200)]
    pub asset: Account<'info, Asset>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Asset {
    pub name: String,
    pub uri: String,
    pub owner: Pubkey,
}
// [/MAIN]
