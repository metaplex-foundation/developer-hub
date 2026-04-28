// [IMPORTS]
use mpl_core::{instructions::UpdateV2Builder, types::UpdateAuthority};
use solana_sdk::{pubkey::Pubkey, signer::Signer};
// [/IMPORTS]

// [MAIN]
let asset = Pubkey::from_str("AssetAddressHere...").unwrap();
let collection = Pubkey::from_str("CollectionAddressHere...").unwrap();

// Signer must be in the Collection's UpdateDelegate additionalDelegates
// AND hold the Asset's update authority (or be in its UpdateDelegate additionalDelegates)
let update_ix = UpdateV2Builder::new()
    .asset(asset)
    .new_collection(Some(collection))
    .payer(delegate.pubkey())
    .authority(Some(delegate.pubkey()))
    .new_update_authority(UpdateAuthority::Collection(collection))
    .instruction();
// [/MAIN]

// [OUTPUT]
println!("Asset added to collection");
// [/OUTPUT]
