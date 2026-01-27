// [IMPORTS]
use mpl_token_metadata::{
    accounts::Metadata,
    instructions::CreateV1CpiBuilder,
    types::{PrintSupply, TokenStandard},
};
// [/IMPORTS]

// [MAIN]
// 1. every account is specified by a reference to their AccountInfo

let create_cpi = CreateV1CpiBuilder::new(token_metadata_program_info)
    .metadata(metadata_info)
    .mint(mint_info, true)
    .authority(payer_info)
    .payer(payer_info)
    .update_authority(update_authority_info, false)
    .master_edition(Some(master_edition_info))
    .system_program(system_program_info)
    .sysvar_instructions(sysvar_instructions_info)
    .spl_token_program(spl_token_program_info)
    .token_standard(TokenStandard::NonFungible)
    .name(String::from("My NFT"))
    .uri(uri)
    .seller_fee_basis_points(550)
    .token_standard(TokenStandard::NonFungible)
    .print_supply(PrintSupply::Zero);

create_cpi.invoke();
// [/MAIN]
