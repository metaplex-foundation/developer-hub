// [IMPORTS]
use mpl_token_metadata::instructions::BurnNftCpiBuilder;
// [/IMPORTS]

// [MAIN]
BurnNftCpiBuilder::new(metadata_program_id.account_info())
        .metadata(metadata.account_info())
        .collection_metadata(Some(collection_metadata.account_info()))
        .owner(owner.account_info())
        .mint(mint.account_info())
        .token_account(token.account_info())
        .master_edition_account(edition.account_info())
        .spl_token_program(spl_token.account_info())
        .invoke()?;
// [/MAIN]
