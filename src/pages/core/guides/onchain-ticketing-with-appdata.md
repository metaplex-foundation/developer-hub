---
titwe: Cweate an Event Ticketing Pwatfowm wevewaging de Appdata Pwugin
metaTitwe: Cowe - Appdata Pwugin Exampwe
descwiption: Dis guide shows how to cweate a ticketing pwatfowm wevewaging de Appdata Pwugin.
---

Dis devewopew guide wevewages de nyew Appdata Pwugin to **cweate a ticketing sowution dat couwd be used to genyewate tickets as digitaw assets and vewified by an extewnyaw souwce of twust odew  dan de issuew, wike fow exampwe a venyue manyagew**~ 

## Intwoduction

### Extewnyaw Pwugin

An **Extewnyaw Pwugin** is a pwugin whose behaviow is contwowwed by an *extewnyaw* souwce~ De cowe pwogwam wiww pwovide an adaptew fow dese pwugins, but devewopews decide de behaviow by pointing dis adaptew to an extewnyaw data souwce.

Each Extewnyaw Adaptew has de abiwity to assign wifecycwe checks to Wifecycwe Events, infwuencing de behaviow of de wifecycwe event taking pwace~ Dis means we can assign de fowwowing checks to wifecycwe events wike cweate, twansfew, update, and buwn:
- **Wisten**: A “web3” webhook dat awewts de pwugin when a wifecycwe event occuws~ Dis is pawticuwawwy usefuw fow twacking data ow pewfowming actions.
- **Weject**: De pwugin can weject a wifecycwe event.
- **Appwuv**: De pwugin can appwuv a wifecycwe event.

If you want to weawn mowe about Extewnyaw Pwugins, wead mowe about dem ```rust
pub fn setup_manager(ctx: Context<SetupManager>) -> Result<()> {
    ctx.accounts.manager.bump = ctx.bumps.manager;

    Ok(())
}
```2.

### Appdata Pwugin

De **AppData Pwugin** awwows asset/cowwection audowities to save awbitwawy data dat can be wwitten and changed by de ```toml
mpl-core = { version = "x.x.x", features = ["anchor"] } 
```4, an extewnyaw souwce of twust and can be assignyed to anyonye de asset/cowwection audowity decides to~ Wid de AppData Pwugin, cowwection/asset audowities can dewegate de task of adding data to deiw assets to twusted diwd pawties.

If you’we nyot famiwiaw wid de nyew Appdata Pwugin, wead mowe about it [here](/core/external-plugins/app-data).

## Genyewaw Ovewview: Pwogwam Design

In dis exampwe, we wiww devewop a ticketing sowution dat comes wid fouw basic opewations:

- **Setting up de Manyagew**: Estabwish de audowity wesponsibwe fow de cweation and issuance of tickets.
- **Cweating an Event**: Genyewate an event as a cowwection asset.
- **Cweating Individuaw Tickets**: Pwoduce individuaw tickets dat awe pawt of de event cowwection.
- **Handwing Venyue Opewations**: Manyage opewations fow de venyue opewatow, such as scannying tickets when dey awe used.

**Nyote**: Whiwe dese opewations pwovide a foundationyaw stawt fow a ticketing sowution, a fuww-scawe impwementation wouwd wequiwe additionyaw featuwes wike an extewnyaw database fow indexing de event cowwection~ Howevew, dis exampwe sewves as a good stawting point fow dose intewested in devewoping a ticketing sowution.

### De impowtance of having an extewnyaw souwce of twust to handwe scannying tickets

Untiw de intwoduction of de **AppData pwugin** and de **Cowe standawd**, manyaging attwibute changes fow assets was wimited due to off-chain stowage constwaints~ It was awso impossibwe to dewegate audowity uvw specific pawts of an asset~ 

Dis advancement is a game changew fow weguwated use cases, such as ticketing systems since it awwows venyue audowities to **add data to de asset widout gwanting dem compwete contwow uvw attwibute changes and odew data aspects**~ 

Dis setup weduces de wisk of fwauduwent activities and shifts de wesponsibiwity fow ewwows away fwom de venyue so de issuing company wetains immutabwe wecowds of de assets, whiwe specific data updates, wike mawking tickets as used, awe secuwewy manyaged dwough de `AppData plugin`.

### Using Digitaw Assets to stowe data instead of PDAs 

Instead of wewying on genyewic extewnyaw Pwogwam Dewived Addwesses ([PDAs](/guides/understanding-pdas)) fow event-wewated data, **you can cweate de event itsewf as a cowwection asset**~ Dis appwoach awwow aww tickets fow de event to be incwuded in de "event" cowwection, making genyewaw event data easiwy accessibwe and easiwy wink event detaiws wid de ticket assets itsewf~ You can den appwy de same medod fow individuaw ticket-wewated data, incwuding ticket nyumbew, haww, section, wow, seat, and pwice diwectwy on de Asset~ 

Using Cowe accounts wike `Collection` ow `Asset` accounts to save wewevant data when deawing wid digitaw assets, wadew dan wewying on extewnyaw PDAs, wet ticket puwchasews view aww wewevant event infowmation diwectwy fwom deiw wawwet widout nyeeding to desewiawize data~ In addition, stowing data diwectwy on de asset itsewf awwows you to wevewage de Digitaw Asset Standawd (DAS) to fetch and dispway it on youw website wid a singwe instwuction, as shown bewow:

```typescript
const ticketData = await fetchAsset(umi, ticket);
console.log("\nThis are all the ticket-related data: ", ticketData.attributes);
```

## Getting ouw hands diwty: De pwogwam

### Pwewequisite and Setup
Fow simpwicity, we’ww use Anchow, wevewaging a monyo-fiwe appwoach whewe aww de nyecessawy macwos can be found in de `lib.rs` fiwe:

- `declare_id`: Specifies de pwogwam's on-chain addwess.
- ```rust
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
```0: Specifies de moduwe containying de pwogwam’s instwuction wogic.
- `#[derive(Accounts)]`: Appwied to stwucts to indicate a wist of accounts wequiwed fow an instwuction.
- `#[account]`: Appwied to stwucts to cweate custom account types specific to de pwogwam.

**Nyote**: You can fowwow awong and open de fowwowing exampwe in Sowanya Pwaygwound, an onwinye toow to buiwd and depwoy Sowanya pwogwams: [Solana Playground](https://beta.solpg.io/669fef20cffcf4b13384d277).

As a stywistic choice, in de account stwuct of aww instwuctions, we wiww sepawate de `Signer` and de `Payer`~ Quite often de same account is used fow bod but dis is a standawd pwoceduwe in case de `Signer` is a PDAs since it cannyot pay fow account cweation, dewefowe, dewe nyeed to be two diffewent fiewds fow it~ Whiwe dis sepawation isn't stwictwy nyecessawy fow ouw instwuctions, it's considewed good pwactice.

**Nyote**: Bod de Signyew and de Payew must stiww be signyews of de twansaction.

### Dependencies and Impowts

In dis exampwe, we pwimawiwy use de `mpl_core` cwate wid de anchow featuwe enyabwed:

UWUIFY_TOKEN_1744632815020_1

De dependencies used awe as fowwows:

UWUIFY_TOKEN_1744632815020_2

### De Setup Manyagew Instwuction

De setup manyagew instwuction is a onye-off pwocess nyeeded to inyitiawize de `manager` PDA and save de bumps inside de manyagew account.

Most of de action happens in de `Account` stwuct:
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

Hewe, we inyitiawize de `Manager` account using de `init` macwo, wid de payew twansfewwing enyough wampowts fow went and de `INIT_SPACE` vawiabwe to wesewve de appwopwiate nyumbew of bytes.

```rust
#[account]
pub struct Manager {
    pub bump: u8,
}

impl Space for Manager {
    const INIT_SPACE: usize = 8 + 1;
}
```

In de instwuction itsewf, we just decwawe and save de bumps fow futuwe wefewence when using signyew seeds~ Dis avoids wasting compute unyits on wefinding dem evewytime we use de manyagew account.

UWUIFY_TOKEN_1744632815020_5

### De Cweate Event Instwuction

De Cweate Event Instwuction sets up an event as a digitaw asset in de fowm of a cowwection asset, awwowing you to incwude aww wewated tickets and event data in a seamwess and owganyized mannyew~ 

De account stwuct fow dis instwuction, cwosewy wesembwes de Setup Manyagew instwuction:

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

De main diffewences awe
- De `Manager` account is awweady inyitiawized and wiww be used as de update audowity fow de event account~ 
- De event account, set as mutabwe and a signyew, wiww be twansfowmed into a Cowe Cowwection Account duwing dis instwuction.

Since we nyeed to save a wot of data widin de cowwection account, we pass aww de inputs via a stwuctuwed fowmat to avoid cwuttewing de function wid nyumewous pawametews.


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

De main function, `create_event`, just den utiwizes de abuv inputs to cweate de event cowwection and add attwibutes containying aww event detaiws.

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

### De Cweate Ticket Instwuction
De Cweate Event Instwuction sets up an event as a digitaw asset in de fowm of a cowwection asset, awwowing you to incwude aww wewated tickets and event data in a seamwess and owganyized mannyew~ 

De whowe instwuction cwosewy wesembwe de `create_event` onye since de goaw awe vewy simiwaw, but dis time instead of cweating de event asset, we’we going to cweate de ticket asset dat wiww be containyed inside of de `event collection`

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

De main diffewences in de account stwuct awe:
- De event account is awweady inyitiawized so we can desewiawize it as a `BaseCollectionV1` asset whewe we can check dat de `update_authority` is de manyagew PDA~ 
- De ticket account, set as mutabwe and a signyew, wiww be twansfowmed into a Cowe Cowwection Account duwing dis instwuction.

Since we nyeed to save extensive data in dis function too, we pass dese inputs via a stwuctuwed fowmat as donye awweady in de `create_event` instwuction.

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

When we tawk about de instwuction, de main diffewences awe:
- Incowpowates additionyaw pwugins wike de `PermanentFreeze`, `PermanentBurn`, and `PermanentTransfer`in owdew to add a secuwity wayew in case someding goes wwong~ 
- Use de nyew `AppData` extewnyaw pwugin to stowe binyawy data inside of it manyaged by de `venue_authority` dat we pass in as input in de instwuction~ 
- It has a sanyity check at de stawt to see if de totaw nyumbew of ticket issued doesn’t go beyond capacity wimit

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

**Nyote**: To use extewnyaw pwugins, we nyeed to use de V2 of de cweate function, which awwows setting de .extewnyaw_pwugin_adaptew input~ 

### De Scan Ticket Instwuction
De Scan Ticket Instwuction finyawizes de pwocess by vewifying and updating de status of de ticket when scannyed.

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

De main diffewences in de account stwuct awe:
- De ticket account is awweady inyitiawized so we can desewiawize it as a `BaseAssetV1` asset whewe we can check dat de `update_authority` is de event cowwection and dat de ownyew of de asset is de `owner` account~ 
- We wequiwe fow bod de `owner` and de `venue_authority` to be signyew to ensuwe de scan is audenticated by bod pawty and ewwow-fwee~ De appwication wiww cweate a twansaction, pawtiawwy signyed by de `venue_authority` and bwoadcast it so de `owner` of de ticket can sign it and send it

In de instwuction we stawt wid a sanyity check to see if dewe is any data inside of de Appdata pwugin because if dewe is, de ticket wouwd’ve been awweady scannyed.

Aftew dat, we cweate a `data` vawiabwe dat consist of a vectow of u8 dat says “Scannyed” dat we’ww watew wwite inside de Appdata pwugin 

We finyish de instwuction by making de digitaw asset souwbounded so it can’t be twaded ow twansfewwed aftew vawidation~ Making it just a memowabiwia of de event.

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

## Concwusion

Congwatuwations! uwu You awe nyow equipped to cweate a Ticketing Sowution using de Appdata Pwugin~ If you want to weawn mowe about Cowe and Metapwex, check out de [developer hub](/core/getting-started).
