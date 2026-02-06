// [IMPORTS]
use anchor_lang::prelude::*;
use mpl_core::instructions::CreateCollectionV1CpiBuilder;
// [/IMPORTS]

// [MAIN]
// Create a new Collection via CPI
CreateCollectionV1CpiBuilder::new(&ctx.accounts.mpl_core_program)
    .collection(&ctx.accounts.collection)
    .payer(&ctx.accounts.payer)
    .system_program(&ctx.accounts.system_program)
    .name("My Collection".to_string())
    .uri("https://example.com/collection.json".to_string())
    .invoke()?;
// [/MAIN]

// [OUTPUT]
msg!("Collection created: {}", ctx.accounts.collection.key());
// [/OUTPUT]
