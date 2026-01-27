// [IMPORTS]
use mpl_token_metadata::instructions::BurnNftCpiBuilder;
// [/IMPORTS]

// [MAIN]
 BurnNftCpiBuilder::new(&metadata_program_id)
    .metadata(&metadata)
    // if your NFT is part of a collection you will need to pass in the collection metadata address.
    .collection_metadata(collection_metadata.as_ref())
    .owner(&owner)
    .mint(&mint)
    .token_account(&token)
    .master_edition_account(&edition)
    .spl_token_program(&spl_token)
    .invoke()?;
// [/MAIN]
