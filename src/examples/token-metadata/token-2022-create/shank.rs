// [IMPORTS]
use mpl_token_metadata::{
    instructions::CreateV1Builder,
    types::{PrintSupply, TokenStandard},
};
use solana_rpc_client::rpc_client::RpcClient;
use solana_sdk::{
     message::Message,
     transaction::Transaction,
};
// [/IMPORTS]

// [MAIN]
// 1. client is a reference to the initialized RpcClient
// 2. every account is specified by their pubkey

let client = ...;

let create_ix = CreateV1Builder::new()
    .metadata(metadata)
    .master_edition(Some(master_edition))
    .mint(mint.pubkey(), true)
    .authority(payer.pubkey())
    .payer(payer.pubkey())
    .update_authority(payer.pubkey(), false)
    .spl_token_program(spl_token_2022::id())
    .name(String::from("My NFT"))
    .uri(uri)
    .seller_fee_basis_points(550)
    .token_standard(TokenStandard::NonFungible)
    .print_supply(PrintSupply::Zero)
    .instruction();

let message = Message::new(
    &[create_ix],
    Some(&payer.pubkey()),
);

let blockhash = client.get_latest_blockhash()?;
let mut tx = Transaction::new(&[mint, payer], message, blockhash);
client.send_and_confirm_transaction(&tx)?;
// [/MAIN]
