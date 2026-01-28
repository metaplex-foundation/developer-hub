// [IMPORTS]
use anchor_lang::prelude::*;
use mpl_core::instructions::CreateV1CpiBuilder;
// [/IMPORTS]

// [MAIN]
// Create asset in a collection via CPI
CreateV1CpiBuilder::new(&ctx.accounts.mpl_core_program)
    .asset(&ctx.accounts.asset)
    .collection(Some(&ctx.accounts.collection))
    .payer(&ctx.accounts.payer)
    .system_program(&ctx.accounts.system_program)
    .name("Collection Item #1".to_string())
    .uri("https://example.com/item1.json".to_string())
    .invoke()?;
// [/MAIN]

// [OUTPUT]
msg!("Asset created in collection: {}", ctx.accounts.asset.key());
// [/OUTPUT]
