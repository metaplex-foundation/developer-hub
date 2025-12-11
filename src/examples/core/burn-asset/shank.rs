// [IMPORTS]
use mpl_core::instructions::BurnV1;
use solana_sdk::{pubkey::Pubkey, signer::Signer};
// [/IMPORTS]

// [MAIN]
// Asset address to burn
let asset = Pubkey::from_str("AssetAddressHere...").unwrap();

// Permanently destroy/burn an NFT asset
let burn_ix = BurnV1 {
    asset,
    ..Default::default()
};

let instruction = burn_ix.instruction();
// [/MAIN]

// [OUTPUT]
println!("Burn instruction created");
// [/OUTPUT]
