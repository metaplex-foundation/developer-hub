// [IMPORTS]
use mpl_core::instructions::UpdateV1;
use solana_sdk::{pubkey::Pubkey, signer::Signer};
// [/IMPORTS]

// [MAIN]
// Asset address to update
let asset = Pubkey::from_str("AssetAddressHere...").unwrap();

// Update an existing NFT asset's metadata
let update_ix = UpdateV1 {
    asset,
    new_name: Some("Updated NFT Name".to_string()),
    new_uri: Some("https://updated-example.com/metadata.json".to_string()),
    ..Default::default()
};

let instruction = update_ix.instruction();
// [/MAIN]

// [OUTPUT]
println!("Update instruction created");
// [/OUTPUT]
