// [IMPORTS]
use mpl_core::{
    instructions::AddPluginV1Builder,
    types::{Plugin, PluginAuthority, Royalties, Creator, RuleSet},
};
use solana_sdk::{pubkey::Pubkey, signer::Signer};
// [/IMPORTS]

// [MAIN]
// Add a Royalties plugin to the asset
let add_plugin_ix = AddPluginV1Builder::new()
    .asset(asset_pubkey)
    .payer(payer.pubkey())
    .plugin(Plugin::Royalties(Royalties {
        basis_points: 500, // 5%
        creators: vec![Creator {
            address: creator_pubkey,
            percentage: 100,
        }],
        rule_set: RuleSet::None,
    }))
    .init_authority(PluginAuthority::UpdateAuthority)
    .instruction();
// [/MAIN]

// [OUTPUT]
println!("Plugin added to asset");
// [/OUTPUT]
