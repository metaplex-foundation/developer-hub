---
title: How to use Core in Anchor
metaTitle: Core - Using Core in Anchor
description: Learn how to use Core inside your Anchor Smart Contracts
---

To start using Core in an Anchor project, first make sure that you have added the latest version of the crate to your project. You can do this by running the `cargo add mpl-core` command in your terminal and verifying that the version added in your project's `cargo.toml` file matches the latest version available on the [crates.io website](https://crates.io/crates/mpl-core).

The Core Rust SDK is organized into several modules:

- `accounts`: represents the program's accounts.
- `errors`: enumerates the program's errors.
- `instructions`: facilitates the creation of instructions, instruction arguments, and CPI instructions.
- `types`: represents types used by the program.

For more detailed information on how different instructions are called and used, refer to the [mpl-core docs.rs website](https://docs.rs/mpl-core/0.7.2/mpl_core/) or you can use cmd + left click (Cntrl + left click for window users) on the instruction to expand it.

## Deserializing Core Accounts

There are two ways to deserialize the `Collection` and `Asset` accounts.

One approach is to directly deserialize them using the `Asset` or `Collection` struct to access all the data, including the basic information and all the plugins (normal and external). However, deserializing such a large account can lead to stack overflow errors, so our raccomandation is to deserialize the account as `BaseAssetV1` or `BaseCollectionV1`, which contains the basic data, and then deserialize the plugin data separately.

There are different methods to deserialize a core-specific BaseAccount. One method involves deserializing the raw bytes of the account, while the other uses the Anchor account struct macro:

### Raw bytes method

Start by borrowing the data inside the asset/collection account using the `try_borrow_data()` function. Then, create the asset/collection struct from those bytes, as shown in the example below:

Start by borrowing the data inside the asset/collection account using the `try_borrow_data()` function. Then, create the asset/collection struct from those bytes like the example:

{% dialect-switcher title="Deserialize an Account" %}

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
[dependencies]
...
mpl-core = { version = "x.x.x", features = [ "anchor" ] }
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

### Deserializing Plugins

To access individual plugins within an Asset or Collection account, use the `fetch_plugin()` function. This function will either return the plugin data or a `null` response without throwing an hard error, allowing you to check if a plugin exists without having to access its data.

The `fetch_plugin()` function is used for both Assets and Collections accounts and can handle every plugin type by specifying the appropriate typing. If you want to access the data inside a plugin, use the middle value returned by this function.

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

**Note**: The `fetch_plugin()` function is only used for non-external plugins. To read external plugins, use the `fetch_external_plugin()` function, which operates in the same way as `fetch_plugin()`.

## The CPI Instruction Builders

Each instruction from the Metaplex Rust crate also comes with a **CpiBuilder version**, which you can import. The CpiBuilder is created using `name of the function` + `CpiBuilder` and simplifies the code significantly abstracting a lot of the types away! 

Let's take the `CreateCollectionV2CpiBuilder` instruction as an example

To initialize the builder, call `new` on the CpiBuilder and pass in the program `AccountInfo` of the program address to which the CPI call is being made.

```rust
CreateCollectionV2CpiBuilder::new(ctx.accounts.mpl_core_program.to_account_info);
```

From this point you can use Cmd + left click (Cntrl + left click for window users) into the new function generated from the `CpiBuilder` to see all the CPI arguments (accounts and data) required for this particular CPI call.

For example this are all the accounts and data required by the `CreateCollectionV2` Cpi builder:
```rust
CreateCollectionV2CpiBuilder::new(&ctx.accounts.core_program)
    .collection(&ctx.accounts.collection)
    .payer(&ctx.accounts.payer)
    .system_program(&ctx.accounts.system_program)
    .name("Test Collection".to_string())
    .uri("https://test.com".to_string())
    .invoke()?;
```

