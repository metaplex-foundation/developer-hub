// [IMPORTS]
use mpl_core::instructions::CreateV1;
use solana_sdk::signer::Signer;
// [/IMPORTS]

// [MAIN]
// Create a new NFT asset
let create_ix = CreateV1 {
    name: "My NFT".to_string(),
    uri: "https://example.com/metadata.json".to_string(),
    ..Default::default()
};

let instruction = create_ix.instruction();
// [/MAIN]

// [OUTPUT]
println!("Asset instruction created");
// [/OUTPUT]
