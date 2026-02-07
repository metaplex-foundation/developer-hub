// [IMPORTS]
use mpl_core::{
    instructions::CreateV1Builder,
    types::{Plugin, PluginAuthority, PluginAuthorityPair, Royalties, Creator, RuleSet},
};
use solana_sdk::{pubkey::Pubkey, signer::Signer};
// [/IMPORTS]

// [MAIN]
// Create asset with Royalties plugin
let create_ix = CreateV1Builder::new()
    .asset(asset.pubkey())
    .payer(payer.pubkey())
    .name("NFT with Royalties".to_string())
    .uri("https://example.com/metadata.json".to_string())
    .plugins(vec![PluginAuthorityPair {
        plugin: Plugin::Royalties(Royalties {
            basis_points: 500, // 5%
            creators: vec![Creator {
                address: creator_pubkey,
                percentage: 100,
            }],
            rule_set: RuleSet::None,
        }),
        authority: Some(PluginAuthority::None),
    }])
    .instruction();
// [/MAIN]

// [OUTPUT]
println!("Asset created with plugins");
// [/OUTPUT]
