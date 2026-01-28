// [IMPORTS]
use anchor_lang::prelude::*;
use mpl_core::{
    instructions::AddPluginV1CpiBuilder,
    types::{Plugin, PluginAuthority, Royalties, Creator, RuleSet},
};
// [/IMPORTS]

// [MAIN]
// Add a Royalties plugin via CPI
AddPluginV1CpiBuilder::new(&ctx.accounts.mpl_core_program)
    .asset(&ctx.accounts.asset)
    .payer(&ctx.accounts.payer)
    .system_program(&ctx.accounts.system_program)
    .plugin(Plugin::Royalties(Royalties {
        basis_points: 500, // 5%
        creators: vec![Creator {
            address: ctx.accounts.creator.key(),
            percentage: 100,
        }],
        rule_set: RuleSet::None,
    }))
    .init_authority(PluginAuthority::UpdateAuthority)
    .invoke()?;
// [/MAIN]

// [OUTPUT]
msg!("Plugin added to asset: {}", ctx.accounts.asset.key());
// [/OUTPUT]
