// [IMPORTS]
use mpl_core::instructions::CreateV1Builder;
use solana_sdk::{pubkey::Pubkey, signer::Signer};
// [/IMPORTS]

// [MAIN]
// Create asset in a collection
let create_ix = CreateV1Builder::new()
    .asset(asset.pubkey())
    .collection(Some(collection_pubkey))
    .payer(payer.pubkey())
    .name("Collection Item #1".to_string())
    .uri("https://example.com/item1.json".to_string())
    .instruction();
// [/MAIN]

// [OUTPUT]
println!("Asset created in collection");
// [/OUTPUT]
