---
title: How to integrate Core in Anchor
metaTitle: Core - Using Core in Anchor
description: This guide will show you how to use the mpl-core crate inside of your anchor Smart Contracts
---

This guide will teach you how to integrate the mpl-Core program within Anchor. We'll cover how to use CPI, instruction builders, and how to properly deserialize Collections and Assets using the Rust SDK.

## Introduction

### Preparation for the guide

We'll be using the Anchor framework in this guide. If you're unfamiliar with it but want to learn more, here's a link to the [Anchor framework page](https://www.anchor-lang.com/).

Before starting, make sure to:
- Use the latest crate available. Check the [crates.io website](https://crates.io/crates/mpl-core) if you're not sure about what's the latest version.
- Include the mpl-core create in the cargo.toml of your Anchor program. For this example i'm using anchor 0.30.1 and mpl-core 0.7.2 and my cargo.toml looks like this: 

```toml
...
[dependencies]
anchor-lang = "0.30.1"
mpl-core = "0.7.2" 

```

**Note** For more details on how different instructions are called and used, refer to the [mpl-core docs.rs website](https://docs.rs/mpl-core/0.7.2/mpl_core/). Or you can use cmd + left click (Cntrl + left click for windoes users) on the instruction to expand it.

### The client SDK

The client SDK is divided into several modules:

- `accounts`: represents the program's accounts.
- `errors`: enumerates the program's errors.
- `instructions`: facilitates the creation of instructions, instruction arguments, and CPI instructions.
- `types`: represents types used by the program.

## Instruction Builders

The `instructions`module contains two types of instruction builders, both supporting passing accounts by name and optionally by position.

### Client Instruction Builder

These builders are usually used for off-chain instruction calling but can also be used in on-chain smart contracts. Each instruction is represented by a struct named after the instruction, e.g., `CreateCollectionV2` and they act as the typical Solana instructions with an `invoke` or `invoke_signed` method to call the instruction and an accounts struct.

`CreateCollectionV2` Example:
```rust
let create_collection_v2_args = CreateCollectionV2InstructionArgs {
    name: "Test Collection".to_string(),
    uri: "https://test.com".to_string(),
    plugins: None,
    external_plugin_adapters: None
};

let create_collection_v2_ix = CreateCollectionV2 {
    collection: ctx.accounts.collection.key(),
    payer: ctx.accounts.payer.key(),
    update_authority: ctx.update_authority.key(),
    system_program: ctx.accounts.system_program.key(),
}.instruction(create_collection_v2_args);

invoke(
    &create_collection_v2_ix,
    &[
        ctx.accounts.collection.to_account_info(),
        ctx.accounts.payer.to_account_info(),
        ctx.update_authority.to_account_info(),
        ctx.accounts.system_program.to_account_info(),
    ],
)?;
```

### CPI instruction builders

These builders are typically used for on-chain code and will just CPI into the mpl-core program. Similar to "off-chain" builders, each instruction has a struct to invoke CPI instructions – e.g., `CreateCollectionV2CpiBuilder`:

`CreateCollectionV2` Example:
```rust
CreateCollectionV2CpiBuilder::new(&ctx.accounts.core_program)
    .collection(&ctx.accounts.collection)
    .payer(&ctx.accounts.payer)
    .system_program(&ctx.accounts.system_program)
    .name("Test Collection".to_string())
    .uri("https://test.com".to_string())
    .invoke()?;
```

For a more "opinionated" instruction that specifies what should be in each struct, you can use `CreateCollectionV2Cpi`:

```rust
let cpi_program = &ctx.accounts.core_program.to_account_info();

let cpi_accounts = CreateCollectionV2CpiAccounts {
    collection: &ctx.accounts.collection,
    update_authority: None,
    payer: &ctx.accounts.payer.to_account_info(),
    system_program: &ctx.accounts.system_program.to_account_info()
}; 

let cpi_args = CreateCollectionV2InstructionArgs {
    name: "Test Collection".to_string(),
    uri: "https://test.com".to_string(),
    plugins: None,
    external_plugin_adapters: None
};

CreateCollectionV2Cpi::new(cpi_program, cpi_accounts, cpi_args);
```

## Deserializing Core Accounts

The `Asset`struct in the Rust SDK can access all data of assets and plugins (normal and external). However, deserializing an account this large can lead to stack overflow errors. So the best way to access that data is to deserialize the `BaseAssetV1` and the plugins separately.

There are different ways to deserialize a core-specific account. One method involves deserializing the raw bytes of the account, while the other uses the Anchor account struct macro.

Let's start with the raw bytes method:

### Raw bytes method

Start by borrowing the data inside the asset/collection account using the `try_borrow_data()` function. Then, create the asset/collection struct from those bytes. Like the example:

{% dialect-switcher title="Deserialize an Asset" %}

{% dialect title="Asset" id="asset" %}

```rust
let data = ctx.accounts.asset.try_borrow_data()?;
let base_asset: BaseAssetV1 = BaseAssetV1::from_bytes(&data.as_ref())?;
```

{% /dialect %}

{% dialect title="Collection" id="collection" %}

```rust
let data = ctx.accounts.collectino.try_borrow_data()?;
let base_collection: BaseCollectionV1 = BaseCollectionV1::from_bytes(&data.as_ref())?;
```

{% /dialect %}

{% /dialect-switcher %}

### Anchor Struct Method

To deserialize assets in the account struct, enable the `anchor` feature in the mpl-core crate by modifying the cargo.toml like this:

```toml
...
[dependencies]
anchor-lang = "0.30.1"
mpl-core = { version = "0.7.2", features = [ "anchor" ] }
```

By activating this feature, you'll be able to deserialize both the `Asset` and `Collection` accounts directly in the Anchor account struct:

{% dialect-switcher title="Deserialize an Asset" %}

{% dialect title="Asset" id="asset" %}

```rust
#[derive(Accounts)]
pub struct ExampleAccountStruct<'info> {
    ...
    pub asset: Account<'info, BaseAssetV1>,
}
```

{% /dialect %}

{% dialect title="Collection" id="collection" %}

```rust
#[derive(Accounts)]
pub struct ExampleAccountStruct<'info> {
    ...
    pub collection: Account<'info, BaseCollectionV1>,
}
```

{% /dialect %}

{% /dialect-switcher %}

## Deserializing Plugins

To access individual plugins within the Asset/Collection, use the `fetch_plugin()` function. This function will either return the plugin data or a `null` response without throwing an error, allowing you to check if a plugin exists without accessing its data.

**Note** is that the `fetch_plugin()` function is used for both Assets and Collections, and for every plugin available by just declaring the right macro typiping. Plus if you want to access the data inside of it, it's going to be the middle one.

{% dialect-switcher title="Deserialize an Asset" %}

{% dialect title="Asset" id="asset" %}

```rust
let (_, attribute_list, _) = fetch_plugin::<BaseAssetV1, Attributes>(&ctx.accounts.asset.to_account_info(), mpl_core::types::PluginType::Attributes)?;
```

{% /dialect %}

{% dialect title="Collection" id="collection" %}

```rust
let (_, attribute_list, _) = fetch_plugin::<BaseCollectionV1, Attributes>(&ctx.accounts.asset.to_account_info(), mpl_core::types::PluginType::Attributes)?;
```

{% /dialect %}

{% /dialect-switcher %}

The `fetch_external_plugin()` function works the same but it's needed to access external plugins! 

## Conclusion

Congratulations! You are now equipped to use Core in your smart contracts! If you want to learn more about Core and Metaplex, check out the [developer hub](/core/getting-started).



