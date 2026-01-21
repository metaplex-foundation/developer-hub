// [IMPORTS]
use mpl_token_metadata::instructions::MintV1CpiBuilder;
// [/IMPORTS]

// [MAIN]
// 1. every account is specified by a reference to their AccountInfo

let mint_cpi = MintV1CpiBuilder::new(token_metadata_program_info)
    .token(token_info)
    .token_owner(Some(token_owner_info))
    .metadata(metadata_info)
    .master_edition(Some(master_edition_info))
    .mint(mint_info)
    .payer(payer_info)
    .authority(update_authority_info)
    .system_program(system_program_info)
    .sysvar_instructions(sysvar_instructions_info)
    .spl_token_program(spl_token_program_info)
    .spl_ata_program(spl_ata_program_info)
    .amount(1);

mint_cpi.invoke();
// [/MAIN]
