// [IMPORTS]
use mpl_core::instructions::CreateCollectionV1Builder;
use solana_sdk::signer::Signer;
// [/IMPORTS]

// [MAIN]
// Create a new Collection
let create_collection_ix = CreateCollectionV1Builder::new()
    .collection(collection.pubkey())
    .payer(payer.pubkey())
    .name("My Collection".to_string())
    .uri("https://example.com/collection.json".to_string())
    .instruction();
// [/MAIN]

// [OUTPUT]
println!("Collection instruction created");
// [/OUTPUT]
