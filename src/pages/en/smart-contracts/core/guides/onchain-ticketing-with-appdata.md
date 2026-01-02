---
title: Create an Event Ticketing Platform leveraging the Appdata Plugin
metaTitle: Core - Appdata Plugin Example
description: This guide shows how to create a ticketing platform leveraging the Appdata Plugin.
---

This developer guide leverages the new Appdata Plugin to **create a ticketing solution that could be used to generate tickets as digital assets and verified by an external source of trust other  than the issuer, like for example a venue manager**. 

## Introduction

### External Plugin

An **External Plugin** is a plugin whose behavior is controlled by an *external* source. The core program will provide an adapter for these plugins, but developers decide the behavior by pointing this adapter to an external data source.

Each External Adapter has the ability to assign lifecycle checks to Lifecycle Events, influencing the behavior of the lifecycle event taking place. This means we can assign the following checks to lifecycle events like create, transfer, update, and burn:
- **Listen**: A “web3” webhook that alerts the plugin when a lifecycle event occurs. This is particularly useful for tracking data or performing actions.
- **Reject**: The plugin can reject a lifecycle event.
- **Approve**: The plugin can approve a lifecycle event.

If you want to learn more about External Plugins, read more about them [here](/smart-contracts/core/external-plugins/overview).

### Appdata Plugin

The **AppData Plugin** allows asset/collection authorities to save arbitrary data that can be written and changed by the `data_authority`, an external source of trust and can be assigned to anyone the asset/collection authority decides to. With the AppData Plugin, collection/asset authorities can delegate the task of adding data to their assets to trusted third parties.

If you’re not familiar with the new Appdata Plugin, read more about it [here](/smart-contracts/core/external-plugins/app-data).

## General Overview: Program Design

In this example, we will develop a ticketing solution that comes with four basic operations:

- **Setting up the Manager**: Establish the authority responsible for the creation and issuance of tickets.
- **Creating an Event**: Generate an event as a collection asset.
- **Creating Individual Tickets**: Produce individual tickets that are part of the event collection.
- **Handling Venue Operations**: Manage operations for the venue operator, such as scanning tickets when they are used.

**Note**: While these operations provide a foundational start for a ticketing solution, a full-scale implementation would require additional features like an external database for indexing the event collection. However, this example serves as a good starting point for those interested in developing a ticketing solution.

### The importance of having an external source of trust to handle scanning tickets

Until the introduction of the **AppData plugin** and the **Core standard**, managing attribute changes for assets was limited due to off-chain storage constraints. It was also impossible to delegate authority over specific parts of an asset. 

This advancement is a game changer for regulated use cases, such as ticketing systems since it allows venue authorities to **add data to the asset without granting them complete control over attribute changes and other data aspects**. 

This setup reduces the risk of fraudulent activities and shifts the responsibility for errors away from the venue so the issuing company retains immutable records of the assets, while specific data updates, like marking tickets as used, are securely managed through the `AppData plugin`.

### Using Digital Assets to store data instead of PDAs 

Instead of relying on generic external Program Derived Addresses ([PDAs](/guides/understanding-pdas)) for event-related data, **you can create the event itself as a collection asset**. This approach allow all tickets for the event to be included in the "event" collection, making general event data easily accessible and easily link event details with the ticket assets itself. You can then apply the same method for individual ticket-related data, including ticket number, hall, section, row, seat, and price directly on the Asset. 

Using Core accounts like `Collection` or `Asset` accounts to save relevant data when dealing with digital assets, rather than relying on external PDAs, let ticket purchasers view all relevant event information directly from their wallet without needing to deserialize data. In addition, storing data directly on the asset itself allows you to leverage the Digital Asset Standard (DAS) to fetch and display it on your website with a single instruction, as shown below:

```typescript
const ticketData = await fetchAsset(umi, ticket);
console.log("\nThis are all the ticket-related data: ", ticketData.attributes);
```

## Getting our hands dirty: The program

### Prerequisite and Setup
For simplicity, we’ll use Anchor, leveraging a mono-file approach where all the necessary macros can be found in the `lib.rs` file:

- `declare_id`: Specifies the program's on-chain address.
- `#[program]`: Specifies the module containing the program’s instruction logic.
- `#[derive(Accounts)]`: Applied to structs to indicate a list of accounts required for an instruction.
- `#[account]`: Applied to structs to create custom account types specific to the program.

**Note**: You can follow along and open the following example in Solana Playground, an online tool to build and deploy Solana programs: [Solana Playground](https://beta.solpg.io/669fef20cffcf4b13384d277).

As a stylistic choice, in the account struct of all instructions, we will separate the `Signer` and the `Payer`. Quite often the same account is used for both but this is a standard procedure in case the `Signer` is a PDAs since it cannot pay for account creation, therefore, there need to be two different fields for it. While this separation isn't strictly necessary for our instructions, it's considered good practice.

**Note**: Both the Signer and the Payer must still be signers of the transaction.

### Dependencies and Imports

In this example, we primarily use the `mpl_core` crate with the anchor feature enabled:

```toml
mpl-core = { version = "x.x.x", features = ["anchor"] } 
```

The dependencies used are as follows:

```rust
use anchor_lang::prelude::*;

use mpl_core::{
    ID as MPL_CORE_ID,
    fetch_external_plugin_adapter_data_info, 
    fetch_plugin, 
    instructions::{
        CreateCollectionV2CpiBuilder, 
        CreateV2CpiBuilder, 
        WriteExternalPluginAdapterDataV1CpiBuilder, 
        UpdatePluginV1CpiBuilder
    }, 
    accounts::{BaseAssetV1, BaseCollectionV1}, 
    types::{
        AppDataInitInfo, Attribute, Attributes, 
        ExternalPluginAdapterInitInfo, ExternalPluginAdapterKey, 
        ExternalPluginAdapterSchema, PermanentBurnDelegate, UpdateAuthority,
        PermanentFreezeDelegate, PermanentTransferDelegate, Plugin, 
        PluginAuthority, PluginAuthorityPair, PluginType
    }, 
};
```

### The Setup Manager Instruction

The setup manager instruction is a one-off process needed to initialize the `manager` PDA and save the bumps inside the manager account.

Most of the action happens in the `Account` struct:
```rust
#[derive(Accounts)]
pub struct SetupManager<'info> {
   pub signer: Signer<'info>,
   #[account(mut)]
   pub payer: Signer<'info>,
   #[account(
       init,
       payer = payer,
       space = Manager::INIT_SPACE,
       seeds = [MANAGER_SEEDS.as_bytes()],
       bump,
   )]
   pub manager: Account<'info, Manager>,
   pub system_program: Program<'info, System>,
}
```

Here, we initialize the `Manager` account using the `init` macro, with the payer transferring enough lamports for rent and the `INIT_SPACE` variable to reserve the appropriate number of bytes.

```rust
#[account]
pub struct Manager {
    pub bump: u8,
}

impl Space for Manager {
    const INIT_SPACE: usize = 8 + 1;
}
```

In the instruction itself, we just declare and save the bumps for future reference when using signer seeds. This avoids wasting compute units on refinding them everytime we use the manager account.

```rust
pub fn setup_manager(ctx: Context<SetupManager>) -> Result<()> {
    ctx.accounts.manager.bump = ctx.bumps.manager;

    Ok(())
}
```

### The Create Event Instruction

The Create Event Instruction sets up an event as a digital asset in the form of a collection asset, allowing you to include all related tickets and event data in a seamless and organized manner. 

The account struct for this instruction, closely resembles the Setup Manager instruction:

```rust
#[derive(Accounts)]
pub struct CreateEvent<'info> {
   pub signer: Signer<'info>,
   #[account(mut)]
   pub payer: Signer<'info>,
   #[account(
       seeds = [MANAGER_SEEDS.as_bytes()],
       bump = manager.bump
   )]
   pub manager: Account<'info, Manager>,
   #[account(mut)]
   pub event: Signer<'info>,
   pub system_program: Program<'info, System>,
   #[account(address = MPL_CORE_ID)]
   /// CHECK: This is checked by the address constraint
   pub mpl_core_program: UncheckedAccount<'info>
}
```

The main differences are
- The `Manager` account is already initialized and will be used as the update authority for the event account. 
- The event account, set as mutable and a signer, will be transformed into a Core Collection Account during this instruction.

Since we need to save a lot of data within the collection account, we pass all the inputs via a structured format to avoid cluttering the function with numerous parameters.


```rust
#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateEventArgs {
   pub name: String,
   pub uri: String,
   pub city: String,
   pub venue: String,
   pub artist: String,
   pub date: String,
   pub time: String,
   pub capacity: u64,
}
```

The main function, `create_event`, just then utilizes the above inputs to create the event collection and add attributes containing all event details.

```rust
pub fn create_event(ctx: Context<CreateEvent>, args: CreateEventArgs) -> Result<()> {
    // Add an Attribute Plugin that will hold the event details
    let mut collection_plugin: Vec<PluginAuthorityPair> = vec![];

    let attribute_list: Vec<Attribute> = vec![
        Attribute { 
            key: "City".to_string(), 
            value: args.city 
        },
        Attribute { 
            key: "Venue".to_string(), 
            value: args.venue 
        },
        Attribute { 
            key: "Artist".to_string(), 
            value: args.artist 
        },
        Attribute { 
            key: "Date".to_string(), 
            value: args.date 
        },
        Attribute { 
            key: "Time".to_string(), 
            value: args.time 
        },
        Attribute { 
            key: "Capacity".to_string(), 
            value: args.capacity.to_string() 
        }
    ];
    
    collection_plugin.push(
        PluginAuthorityPair { 
            plugin: Plugin::Attributes(Attributes { attribute_list }), 
            authority: Some(PluginAuthority::UpdateAuthority) 
        }
    );
    
    // Create the Collection that will hold the tickets
    CreateCollectionV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
    .collection(&ctx.accounts.event.to_account_info())
    .update_authority(Some(&ctx.accounts.manager.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .system_program(&ctx.accounts.system_program.to_account_info())
    .name(args.name)
    .uri(args.uri)
    .plugins(collection_plugin)
    .invoke()?;

    Ok(())
}
```

### The Create Ticket Instruction
The Create Event Instruction sets up an event as a digital asset in the form of a collection asset, allowing you to include all related tickets and event data in a seamless and organized manner. 

The whole instruction closely resemble the `create_event` one since the goal are very similar, but this time instead of creating the event asset, we’re going to create the ticket asset that will be contained inside of the `event collection`

```rust
#[derive(Accounts)]
pub struct CreateTicket<'info> {
   pub signer: Signer<'info>,
   #[account(mut)]
   pub payer: Signer<'info>,
   #[account(
       seeds = [MANAGER_SEEDS.as_bytes()],
       bump = manager.bump
   )]
   pub manager: Account<'info, Manager>,
   #[account(
       mut,
       constraint = event.update_authority == manager.key(),
   )]
   pub event: Account<'info, BaseCollectionV1>,
   #[account(mut)]
   pub ticket: Signer<'info>,
   pub system_program: Program<'info, System>,
   #[account(address = MPL_CORE_ID)]
   /// CHECK: This is checked by the address constraint
   pub mpl_core_program: UncheckedAccount<'info>
}
```

The main differences in the account struct are:
- The event account is already initialized so we can deserialize it as a `BaseCollectionV1` asset where we can check that the `update_authority` is the manager PDA. 
- The ticket account, set as mutable and a signer, will be transformed into a Core Collection Account during this instruction.

Since we need to save extensive data in this function too, we pass these inputs via a structured format as done already in the `create_event` instruction.

```rust
#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateTicketArgs {
   pub name: String,
   pub uri: String,
   pub hall: String,
   pub section: String,
   pub row: String,
   pub seat: String,
   pub price: u64,
   pub venue_authority: Pubkey,
}
```

When we talk about the instruction, the main differences are:
- Incorporates additional plugins like the `PermanentFreeze`, `PermanentBurn`, and `PermanentTransfer`in order to add a security layer in case something goes wrong. 
- Use the new `AppData` external plugin to store binary data inside of it managed by the `venue_authority` that we pass in as input in the instruction. 
- It has a sanity check at the start to see if the total number of ticket issued doesn’t go beyond capacity limit

```rust
pub fn create_ticket(ctx: Context<CreateTicket>, args: CreateTicketArgs) -> Result<()> {
    // Check that the maximum number of tickets has not been reached yet
    let (_, collection_attribute_list, _) = fetch_plugin::<BaseCollectionV1, Attributes>(
            &ctx.accounts.event.to_account_info(), 
            PluginType::Attributes
        )?;

    // Search for the Capacity attribute
    let capacity_attribute = collection_attribute_list
        .attribute_list
        .iter()
        .find(|attr| attr.key == "Capacity")
        .ok_or(TicketError::MissingAttribute)?;

    // Unwrap the Capacity attribute value
    let capacity = capacity_attribute
        .value
        .parse::<u32>()
        .map_err(|_| TicketError::NumericalOverflow)?;

    require!(
        ctx.accounts.event.num_minted < capacity, 
        TicketError::MaximumTicketsReached
    );

    // Add an Attribute Plugin that will hold the ticket details
    let mut ticket_plugin: Vec<PluginAuthorityPair> = vec![];
    
    let attribute_list: Vec<Attribute> = vec![
    Attribute { 
        key: "Ticket Number".to_string(), 
        value: ctx.accounts.event.num_minted.checked_add(1).ok_or(TicketError::NumericalOverflow)?.to_string()
    },
    Attribute { 
        key: "Hall".to_string(), 
        value: args.hall 
    },
    Attribute { 
        key: "Section".to_string(), 
        value: args.section 
    },
    Attribute { 
        key: "Row".to_string(), 
        value: args.row 
    },
    Attribute { 
        key: "Seat".to_string(), 
        value: args.seat 
    },
    Attribute { 
        key: "Price".to_string(), 
        value: args.price.to_string() 
    }
    ];
    
    ticket_plugin.push(
        PluginAuthorityPair { 
            plugin: Plugin::Attributes(Attributes { attribute_list }), 
            authority: Some(PluginAuthority::UpdateAuthority) 
        }
    );
    
    ticket_plugin.push(
        PluginAuthorityPair { 
            plugin: Plugin::PermanentFreezeDelegate(PermanentFreezeDelegate { frozen: false }), 
            authority: Some(PluginAuthority::UpdateAuthority) 
        }
    );
    
    ticket_plugin.push(
        PluginAuthorityPair { 
            plugin: Plugin::PermanentBurnDelegate(PermanentBurnDelegate {}), 
            authority: Some(PluginAuthority::UpdateAuthority) 
        }
    );
    
    ticket_plugin.push(
        PluginAuthorityPair { 
            plugin: Plugin::PermanentTransferDelegate(PermanentTransferDelegate {}), 
            authority: Some(PluginAuthority::UpdateAuthority) 
        }
    );

    let mut ticket_external_plugin: Vec<ExternalPluginAdapterInitInfo> = vec![];
    
    ticket_external_plugin.push(ExternalPluginAdapterInitInfo::AppData(
        AppDataInitInfo {
            init_plugin_authority: Some(PluginAuthority::UpdateAuthority),
            data_authority: PluginAuthority::Address{ address: args.venue_authority },
            schema: Some(ExternalPluginAdapterSchema::Binary),
        }
    ));

    let signer_seeds = &[b"manager".as_ref(), &[ctx.accounts.manager.bump]];

    // Create the Ticket
    CreateV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
    .asset(&ctx.accounts.ticket.to_account_info())
    .collection(Some(&ctx.accounts.event.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.manager.to_account_info()))
    .owner(Some(&ctx.accounts.signer.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .name(args.name)
    .uri(args.uri)
    .plugins(ticket_plugin)
    .external_plugin_adapters(ticket_external_plugin)
    .invoke_signed(&[signer_seeds])?;

    Ok(())
}
```

**Note**: To use external plugins, we need to use the V2 of the create function, which allows setting the .external_plugin_adapter input. 

### The Scan Ticket Instruction
The Scan Ticket Instruction finalizes the process by verifying and updating the status of the ticket when scanned.

```rust
#[derive(Accounts)]
pub struct ScanTicket<'info> {
   pub owner: Signer<'info>,
   pub signer: Signer<'info>,
   #[account(mut)]
   pub payer: Signer<'info>,
   #[account(
       seeds = [MANAGER_SEEDS.as_bytes()],
       bump = manager.bump
   )]
   pub manager: Account<'info, Manager>,
   #[account(
       mut,
       constraint = ticket.owner == owner.key(),
       constraint = ticket.update_authority == UpdateAuthority::Collection(event.key()),
   )]
   pub ticket: Account<'info, BaseAssetV1>,
   #[account(
       mut,
       constraint = event.update_authority == manager.key(),
   )]
   pub event: Account<'info, BaseCollectionV1>,
   pub system_program: Program<'info, System>,
   #[account(address = MPL_CORE_ID)]
   /// CHECK: This is checked by the address constraint
   pub mpl_core_program: UncheckedAccount<'info>,
}
```

The main differences in the account struct are:
- The ticket account is already initialized so we can deserialize it as a `BaseAssetV1` asset where we can check that the `update_authority` is the event collection and that the owner of the asset is the `owner` account. 
- We require for both the `owner` and the `venue_authority` to be signer to ensure the scan is authenticated by both party and error-free. The application will create a transaction, partially signed by the `venue_authority` and broadcast it so the `owner` of the ticket can sign it and send it

In the instruction we start with a sanity check to see if there is any data inside of the Appdata plugin because if there is, the ticket would’ve been already scanned.

After that, we create a `data` variable that consist of a vector of u8 that says “Scanned” that we’ll later write inside the Appdata plugin 

We finish the instruction by making the digital asset soulbounded so it can’t be traded or transferred after validation. Making it just a memorabilia of the event.

```rust 
pub fn scan_ticket(ctx: Context<ScanTicket>) -> Result<()> {

    let (_, app_data_length) = fetch_external_plugin_adapter_data_info::<BaseAssetV1>(
            &ctx.accounts.ticket.to_account_info(), 
            None, 
            &ExternalPluginAdapterKey::AppData(
                PluginAuthority::Address { address: ctx.accounts.signer.key() }
            )
        )?;

    require!(app_data_length == 0, TicketError::AlreadyScanned);

    let data: Vec<u8> = "Scanned".as_bytes().to_vec();

    WriteExternalPluginAdapterDataV1CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
    .asset(&ctx.accounts.ticket.to_account_info())
    .collection(Some(&ctx.accounts.event.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .system_program(&ctx.accounts.system_program.to_account_info())
    .key(ExternalPluginAdapterKey::AppData(PluginAuthority::Address { address: ctx.accounts.signer.key() }))
    .data(data)
    .invoke()?;

    let signer_seeds = &[b"manager".as_ref(), &[ctx.accounts.manager.bump]];

    UpdatePluginV1CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
    .asset(&ctx.accounts.ticket.to_account_info())
    .collection(Some(&ctx.accounts.event.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.manager.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .plugin(Plugin::PermanentFreezeDelegate(PermanentFreezeDelegate { frozen: true }))
    .invoke_signed(&[signer_seeds])?;

    Ok(())
}
```

## Conclusion

Congratulations! You are now equipped to create a Ticketing Solution using the Appdata Plugin. If you want to learn more about Core and Metaplex, check out the [developer hub](/smart-contracts/core/getting-started).
