// [IMPORTS]
use anchor_lang::prelude::*;
use mpl_core::{
    instructions::CreateV1CpiBuilder,
    types::{Plugin, PluginAuthority, PluginAuthorityPair, Royalties, Creator, RuleSet},
};
// [/IMPORTS]

// [MAIN]
// Create asset with Royalties plugin via CPI
CreateV1CpiBuilder::new(&ctx.accounts.mpl_core_program)
    .asset(&ctx.accounts.asset)
    .payer(&ctx.accounts.payer)
    .system_program(&ctx.accounts.system_program)
    .name("NFT with Royalties".to_string())
    .uri("https://example.com/metadata.json".to_string())
    .plugins(vec![PluginAuthorityPair {
        plugin: Plugin::Royalties(Royalties {
            basis_points: 500, // 5%
            creators: vec![Creator {
                address: ctx.accounts.creator.key(),
                percentage: 100,
            }],
            rule_set: RuleSet::None,
        }),
        authority: Some(PluginAuthority::None),
    }])
    .invoke()?;
// [/MAIN]

// [OUTPUT]
msg!("Asset created with plugins: {}", ctx.accounts.asset.key());
// [/OUTPUT]
