// [IMPORTS]
use mpl_core::{instructions::UpdateV2Builder, types::UpdateAuthority};
use solana_sdk::{pubkey::Pubkey, signer::Signer};
// [/IMPORTS]

// [MAIN]
let asset = Pubkey::from_str("AssetAddressHere...").unwrap();
let collection = Pubkey::from_str("CollectionAddressHere...").unwrap();
let new_authority = Pubkey::from_str("NewAuthorityHere...").unwrap();

// Signer only needs to be in the Collection's UpdateDelegate additionalDelegates
let update_ix = UpdateV2Builder::new()
    .asset(asset)
    .collection(Some(collection))
    .payer(delegate.pubkey())
    .authority(Some(delegate.pubkey()))
    .new_update_authority(UpdateAuthority::Address(new_authority))
    .instruction();
// [/MAIN]

// [OUTPUT]
println!("Asset removed from collection");
// [/OUTPUT]
