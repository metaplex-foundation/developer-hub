---
title: Create a Staking Program in Anchor
metaTitle: Create a Staking Program in Anchor | Core Guides
description: This guide will show you how to leverage the FreezeDelegate and Attribute plugin to create a staking program using the Metaplex Core digital asset standard!
updated: '01-31-2026'
---
This developer guide demonstrates how to create a staking program for your collection using Anchor leveraging the `Attribute` and `Freeze Delegate` plugins. This approach uses a smart contract for all the logic behind staking like time calculation and management of the state of the asset (staking/unstaking), but the data will not be saved in a PDA, like the standard before Core, but it will be saved on the asset itself.
## Starting off: Understanding the Logic behind the program
This program operates with a standard Anchor, leveraging a mono-file approach where all the necessary macros can be found in the lib.rs file:
- declare_id: Specifies the program's on-chain address.
- #[program]: Specifies the module containing the program’s instruction logic.
- #[derive(Accounts)]: Applied to structs to indicate a list of accounts required for an instruction.
- #[account]: Applied to structs to create custom account types specific to the program
**To implement this example, you will need the following components:**
- **An Asset**
- **A Collection** (optional, but relevant for this example)
- **The FreezeDelegate Plugin**
- **The Attribute Plugin**
### The Freeze Delegate Plugin
The **Freeze Delegate Plugin** is an **owner-managed plugin**, that means that it requires the owner's signature to be applied to the asset.
This plugin allows the **delegate to freeze and thaw the asset, preventing transfers**. The asset owner or plugin authority can revoke this plugin at any time, except when the asset is frozen (in which case it must be thawed before revocation).
**Using this plugin is lightweight**, as freezing/thawing the asset involves just changing a boolean value in the plugin data (the only argument being Frozen: bool).
_Learn more about it [here](/smart-contracts/core/plugins/freeze-delegate)_
### The Attribute Plugin
The **Attribute Plugin** is an **authority-managed plugin**, that means that it requires the authority's signature to be applied to the asset. For an asset included in a collection, the collection authority serves as the authority since the asset's authority field is occupied by the collection address.
This plugin allows for **data storage directly on the assets, functioning as on-chain attributes or traits**. These traits can be accessed directly by on-chain programs since they aren’t stored off-chain as it was for the mpl-token-metadata program.
**This plugin accepts an AttributeList field**, which consists of an array of key and value pairs, both of which are strings.
_Learn more about it [here](/smart-contracts/core/plugins/attribute)_
### The Smart Contract Logic
For simplicity, this example includes only two instructions: the **stake** and **unstake** functions since these are essential for a staking program to work as intended. While additional instructions, such as a **spendPoint** instruction, could be added to utilize accumulated points, this is left to the reader to implement. 
_Both the Stake and Unstake functions utilize, differently, the plugins introduced previously_.
Before diving into the instructions, let’s spend some time talking about the attributes used, the `staked` and `staked_time` keys. The `staked` key indicates if the asset is staked and when it was staked if it was (unstaked = 0, staked = time of staked). The `staked_time` key tracks the total staking duration of the asset, updated only after an asset get’s unstaked.
**Instructions**:
- **Stake**: This instruction applies the Freeze Delegate Plugin to freeze the asset by setting the flag to true. Additionally, it updates the`staked` key in the Attribute Plugin from 0 to the current time.
- **Unstake**: This instruction changes the flag of the Freeze Delegate Plugin and revokes it to prevent malicious entities from controlling the asset and demanding ransom to thaw it. It also updates the `staked` key to 0 and sets the `staked_time` to the current time minus the staked timestamp.
## Building the Smart Contract: A Step-by-Step Guide
Now that we understand the logic behind our smart contract, **it’s time to dive into the code and bring everything together**!
### Dependencies and Imports
Before writing our smart contracts, let's look at what crate we need and what function from them to make sure our smart contract works! 
In this example, we primarily use the mpl_core crate with the [anchor](/smart-contracts/core/using-core-in-anchor) feature enabled:
```toml
mpl-core = { version = "x.x.x", features = ["anchor"] } 
```
And the different functions from that crate are as follow:
```rust
use mpl_core::{
    ID as CORE_PROGRAM_ID,
    fetch_plugin,
    accounts::{BaseAssetV1, BaseCollectionV1}, 
    instructions::{AddPluginV1CpiBuilder, RemovePluginV1CpiBuilder, UpdatePluginV1CpiBuilder}, 
    types::{Attribute, Attributes, FreezeDelegate, Plugin, PluginAuthority, PluginType, UpdateAuthority}, 
};
```
### Anchor Overview
In this guide, we’ll use the Anchor framework, but you can also implement it using a native program. Learn more about the Anchor framework here: [Anchor Framework](https://book.anchor-lang.com/introduction/what_is_anchor.html).
For simplicity and the sake of this exercise, we’ll use a mono-file approach with accounts and instructions all in lib.rs instead of the usual separation.
**Note**: You can follow along and open the example in Solana Playground, an online tool to build and deploy Solana programs: Solana Playground.
In the account struct of all instructions, we will separate the Signer and the Payer. This is a standard procedure because PDAs cannot pay for account creation, so if the user wants a PDA to be the authority over the instruction, there need to be two different fields for it. While this separation isn't strictly necessary for our instructions, it's considered good practice.
### The Account Struct
For this example we use the anchor flag from the mpl-core crate to directly deserialize the Asset and Collection account from the account struct and put some constraint on that
_Learn more about it [here](/smart-contracts/core/using-core-in-anchor)_
We're going to use a single account struct, `Stake`, for both the `stake` and `unstake` instructions since they use the same accounts and same constraints.
```rust
#[derive(Accounts)]
pub struct Stake<'info> {
    pub owner: Signer<'info>,
    pub update_authority: Signer<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        mut,
        has_one = owner,
        constraint = asset.update_authority == UpdateAuthority::Collection(collection.key()),
    )]
    pub asset: Account<'info, BaseAssetV1>,
    #[account(
        mut,
        has_one = update_authority,
    )]
    pub collection: Account<'info, BaseCollectionV1>,
    #[account(address = CORE_PROGRAM_ID)]
    /// CHECK: this will be checked by core
    pub core_program: UncheckedAccount<'info>,
    pub system_program: Program<'info, System>,
}
```
As constraints we checked:
- The `owner` of the asset is the same as the `owner` in the accounts struct.
- The `update_authority` of the asset is a Collection and the addess of that collection is the same as the `collection` in the account struct
- The `update_authority` of the collection is the same as the `update_authority` in the account struct, since this is going to be the `update_authority` over the asset
- The `core_program` is the same as `ID` (That I renamed as `CORE_PROGRAM_ID`) present in the `mpl_core` crate 
### The Staking Instruction
We begin by using the `fetch_plugin` function from the mpl-core crate to retrieve information about the attribute plugin of the assets. 
```rust
match fetch_plugin::<BaseAssetV1, Attributes>(
    &ctx.accounts.asset.to_account_info(), 
    mpl_core::types::PluginType::Attributes
)
```
1. **Check for the Attribute Plugin**
The `fetch_plugin` function has 2 different response:
- `(_, fetched_attribute_list, _)` if there is an attribute plugin associated with the Asset
- `Err` if there is no attribute plugin associated with the asset
And that's why we used `match` to act on the response from the plugin
If the asset does not have the attribute plugin, we should add it and populate it with the `staked` and `stakedTime` keys.
```rust
Err(_) => {
    AddPluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.update_authority.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .plugin(Plugin::Attributes(
        Attributes{ 
            attribute_list: vec![
                Attribute { 
                    key: "staked".to_string(), 
                    value: Clock::get()?.unix_timestamp.to_string() 
                },
                Attribute { 
                    key: "staked_time".to_string(), 
                    value: 0.to_string() 
                },
            ] 
        }
    ))
    .init_authority(PluginAuthority::UpdateAuthority)
    .invoke()?;
}
```
2. **Check for Staking Attributes**:
If the asset already has the attribute plugin, ensure it contains the staking attributes necessary for the staking instruction. 
If it does, check if the asset is already staked and update the `staked` key with the current timeStamp as string:
```rust
Ok((_, fetched_attribute_list, _)) => {
    // If yes, check if the asset is already staked, and if the staking attribute are already initialized
    let mut attribute_list: Vec<Attribute> = Vec::new();
    let mut is_initialized: bool = false;
    for attribute in fetched_attribute_list.attribute_list {
        if attribute.key == "staked" {
            require!(attribute.value == "0", StakingError::AlreadyStaked);
            attribute_list.push(Attribute { 
                key: "staked".to_string(), 
                value: Clock::get()?.unix_timestamp.to_string() 
            });
            is_initialized = true;
        } else {
            attribute_list.push(attribute);
        } 
    }
```
If it doesn't, add them to the existing attribute list.
```rust
if !is_initialized {
    attribute_list.push(Attribute { 
        key: "staked".to_string(), 
        value: Clock::get()?.unix_timestamp.to_string() 
    });
    attribute_list.push(Attribute { 
        key: "staked_time".to_string(), 
        value: 0.to_string() 
    });
}
```
3. **Update the Attribute Plugin**:
Update the attribute plugin with the new or modified attributes.
```rust
UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.update_authority.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .plugin(Plugin::Attributes(Attributes{ attribute_list }))
    .invoke()?;
}
```
4. **Freeze the Asset**
Whether the asset already had the attribute plugin or not, freeze the asset in place so it can't be traded
```rust
AddPluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
.asset(&ctx.accounts.asset.to_account_info())
.collection(Some(&ctx.accounts.collection.to_account_info()))
.payer(&ctx.accounts.payer.to_account_info())
.authority(Some(&ctx.accounts.owner.to_account_info()))
.system_program(&ctx.accounts.system_program.to_account_info())
.plugin(Plugin::FreezeDelegate( FreezeDelegate{ frozen: true } ))
.init_authority(PluginAuthority::UpdateAuthority)
.invoke()?;
```
**Here's the full instruction**:
```rust
pub fn stake(ctx: Context<Stake>) -> Result<()> {  
    // Check if the asset has the attribute plugin already on
    match fetch_plugin::<BaseAssetV1, Attributes>(&ctx.accounts.asset.to_account_info(), mpl_core::types::PluginType::Attributes) {
        Ok((_, fetched_attribute_list, _)) => {
            // If yes, check if the asset is already staked, and if the staking attribute are already initialized
            let mut attribute_list: Vec<Attribute> = Vec::new();
            let mut is_initialized: bool = false;
            for attribute in fetched_attribute_list.attribute_list {
                if attribute.key == "staked" {
                    require!(attribute.value == "0", StakingError::AlreadyStaked);
                    attribute_list.push(Attribute { 
                        key: "staked".to_string(), 
                        value: Clock::get()?.unix_timestamp.to_string() 
                    });
                    is_initialized = true;
                } else {
                    attribute_list.push(attribute);
                } 
            }
            if !is_initialized {
                attribute_list.push(Attribute { 
                    key: "staked".to_string(), 
                    value: Clock::get()?.unix_timestamp.to_string() 
                });
                attribute_list.push(Attribute { 
                    key: "staked_time".to_string(), 
                    value: 0.to_string() 
                });
            }
            UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
            .asset(&ctx.accounts.asset.to_account_info())
            .collection(Some(&ctx.accounts.collection.to_account_info()))
            .payer(&ctx.accounts.payer.to_account_info())
            .authority(Some(&ctx.accounts.update_authority.to_account_info()))
            .system_program(&ctx.accounts.system_program.to_account_info())
            .plugin(Plugin::Attributes(Attributes{ attribute_list }))
            .invoke()?;
        }
        Err(_) => {
            // If not, add the attribute plugin to the asset
            AddPluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
            .asset(&ctx.accounts.asset.to_account_info())
            .collection(Some(&ctx.accounts.collection.to_account_info()))
            .payer(&ctx.accounts.payer.to_account_info())
            .authority(Some(&ctx.accounts.update_authority.to_account_info()))
            .system_program(&ctx.accounts.system_program.to_account_info())
            .plugin(Plugin::Attributes(
                Attributes{ 
                    attribute_list: vec![
                        Attribute { 
                            key: "staked".to_string(), 
                            value: Clock::get()?.unix_timestamp.to_string() 
                        },
                        Attribute { 
                            key: "staked_time".to_string(), 
                            value: 0.to_string() 
                        },
                    ] 
                }
            ))
            .init_authority(PluginAuthority::UpdateAuthority)
            .invoke()?;
        }
    }
    // Freeze the asset  
    AddPluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.owner.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .plugin(Plugin::FreezeDelegate( FreezeDelegate{ frozen: true } ))
    .init_authority(PluginAuthority::UpdateAuthority)
    .invoke()?;
    Ok(())
}
```
### The Unstaking Instruction
The unstaking instruction will be even easier simpler because, since the unstaking instruction can be called only after the staking instruction, many of the checks are inherently covered by the staking instruction itself. 
We begin by using the `fetch_plugin` function from the mpl-core crate to retrieve information about the attribute plugin of the assets. 
```rust
match fetch_plugin::<BaseAssetV1, Attributes>(&ctx.accounts.asset.to_account_info(), mpl_core::types::PluginType::Attributes)
```
But this time around we throw an hard error if we don't find the Attribute plugin
```rust
Err(_) => {
    return Err(StakingError::AttributesNotInitialized.into());
}
```
1. **Run all the checks for the attribute plugin**
To verify if an asset has already gone through the staking instruction, **the instruction check the attribute plugin for the following**:
- **Has the asset the Staked key?**
- **Is the asset currently staked?**
If any of these checks are missing, the asset has never gone through the staking instruction.
```rust
for attribute in fetched_attribute_list.attribute_list.iter() {
    if attribute.key == "staked" {
        require!(attribute.value != "0", StakingError::NotStaked);
        [...]
        is_initialized = true;
    } else {
        [...]
    }
}
[...]
require!(is_initialized, StakingError::StakingNotInitialized);
```
Once we confirm that the asset has the staking attributes and we checked that the asset is currently staked. If it is staked, we update the staking attributes as follows:
- Set `Staked` field to zero
- Update `stakedTime` to `stakedTime` + (currentTimestamp - stakedTimestamp)
```rust
Ok((_, fetched_attribute_list, _)) => {
    let mut attribute_list: Vec<Attribute> = Vec::new();
    let mut is_initialized: bool = false;
    let mut staked_time: i64 = 0;
    for attribute in fetched_attribute_list.attribute_list.iter() {
        if attribute.key == "staked" {
            require!(attribute.value != "0", StakingError::NotStaked);
            attribute_list.push(Attribute { 
                key: "staked".to_string(), 
                value: 0.to_string() 
            });
            staked_time = staked_time
                .checked_add(Clock::get()?.unix_timestamp
                .checked_sub(attribute.value.parse::<i64>()
                .map_err(|_| StakingError::InvalidTimestamp)?)
                .ok_or(StakingError::Underflow)?)
                .ok_or(StakingError::Overflow)?;
            is_initialized = true;
        } else if attribute.key == "staked_time" {
            staked_time = staked_time
                .checked_add(attribute.value.parse::<i64>()
                .map_err(|_| StakingError::InvalidTimestamp)?)
                .ok_or(StakingError::Overflow)?;
        } else {
            attribute_list.push(attribute.clone());
        } 
    }
    attribute_list.push(Attribute { 
        key: "staked_time".to_string(), 
        value: staked_time.to_string() 
    });
    require!(is_initialized, StakingError::StakingNotInitialized);
```
2. **Update the Attribute Plugin**
Update the attribute plugin with the new or modified attributes.
```rust
UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
.asset(&ctx.accounts.asset.to_account_info())
.collection(Some(&ctx.accounts.collection.to_account_info()))
.payer(&ctx.accounts.payer.to_account_info())
.authority(Some(&ctx.accounts.update_authority.to_account_info()))
.system_program(&ctx.accounts.system_program.to_account_info())
.plugin(Plugin::Attributes(Attributes{ attribute_list }))
.invoke()?;
```
3. **Thaw and remove the FreezeDelegate Plugin**
At the end of the instruction, thaw the asset and remove the FreezeDelegate plugin so the asset is `free` and not controlled by the `update_authority`
```rust
UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
.asset(&ctx.accounts.asset.to_account_info())
.collection(Some(&ctx.accounts.collection.to_account_info()))
.payer(&ctx.accounts.payer.to_account_info())
.authority(Some(&ctx.accounts.update_authority.to_account_info()))
.system_program(&ctx.accounts.system_program.to_account_info())
.plugin(Plugin::FreezeDelegate( FreezeDelegate{ frozen: false } ))
.invoke()?;
RemovePluginV1CpiBuilder::new(&ctx.accounts.core_program)
.asset(&ctx.accounts.asset.to_account_info())
.collection(Some(&ctx.accounts.collection.to_account_info()))
.payer(&ctx.accounts.payer)
.authority(Some(&ctx.accounts.owner))
.system_program(&ctx.accounts.system_program)
.plugin_type(PluginType::FreezeDelegate)
.invoke()?;
```
**Here's the full instruction**:
```rust
pub fn unstake(ctx: Context<Unstake>) -> Result<()> {
    // Check if the asset has the attribute plugin already on
    match fetch_plugin::<BaseAssetV1, Attributes>(&ctx.accounts.asset.to_account_info(), mpl_core::types::PluginType::Attributes) {
        Ok((_, fetched_attribute_list, _)) => {
            let mut attribute_list: Vec<Attribute> = Vec::new();
            let mut is_initialized: bool = false;
            let mut staked_time: i64 = 0;
            for attribute in fetched_attribute_list.attribute_list.iter() {
                if attribute.key == "staked" {
                    require!(attribute.value != "0", StakingError::NotStaked);
                    attribute_list.push(Attribute { 
                        key: "staked".to_string(), 
                        value: 0.to_string() 
                    });
                    staked_time = staked_time
                        .checked_add(Clock::get()?.unix_timestamp
                        .checked_sub(attribute.value.parse::<i64>()
                        .map_err(|_| StakingError::InvalidTimestamp)?)
                        .ok_or(StakingError::Underflow)?)
                        .ok_or(StakingError::Overflow)?;
                    is_initialized = true;
                } else if attribute.key == "staked_time" {
                    staked_time = staked_time
                        .checked_add(attribute.value.parse::<i64>()
                        .map_err(|_| StakingError::InvalidTimestamp)?)
                        .ok_or(StakingError::Overflow)?;
                } else {
                    attribute_list.push(attribute.clone());
                } 
            }
            attribute_list.push(Attribute { 
                key: "staked_time".to_string(), 
                value: staked_time.to_string() 
            });
            require!(is_initialized, StakingError::StakingNotInitialized);
            UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
            .asset(&ctx.accounts.asset.to_account_info())
            .collection(Some(&ctx.accounts.collection.to_account_info()))
            .payer(&ctx.accounts.payer.to_account_info())
            .authority(Some(&ctx.accounts.update_authority.to_account_info()))
            .system_program(&ctx.accounts.system_program.to_account_info())
            .plugin(Plugin::Attributes(Attributes{ attribute_list }))
            .invoke()?;
        }
        Err(_) => {
            return Err(StakingError::AttributesNotInitialized.into());
        }
    }
    // Thaw the asset
    UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.update_authority.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .plugin(Plugin::FreezeDelegate( FreezeDelegate{ frozen: false } ))
    .invoke()?;
    // Remove the FreezeDelegate Plugin
    RemovePluginV1CpiBuilder::new(&ctx.accounts.core_program)
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer)
    .authority(Some(&ctx.accounts.owner))
    .system_program(&ctx.accounts.system_program)
    .plugin_type(PluginType::FreezeDelegate)
    .invoke()?;
    
    Ok(())
}
```
## Conclusion
Congratulations! You are now equipped to create a staking solution for your NFT collection! If you want to learn more about Core and Metaplex, check out the [developer hub](/smart-contracts/core/getting-started).
