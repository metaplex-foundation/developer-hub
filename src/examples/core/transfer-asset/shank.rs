// [IMPORTS]
use mpl_core::instructions::TransferV1;
use solana_sdk::{pubkey::Pubkey, signer::Signer};
// [/IMPORTS]

// [MAIN]
// Asset and recipient addresses
let asset = Pubkey::from_str("AssetAddressHere...").unwrap();
let new_owner = Pubkey::from_str("RecipientAddressHere...").unwrap();

// Transfer an existing NFT asset to a new owner
let transfer_ix = TransferV1 {
    asset,
    new_owner,
    ..Default::default()
};

let instruction = transfer_ix.instruction();
// [/MAIN]

// [OUTPUT]
println!("Transfer instruction created");
// [/OUTPUT]
