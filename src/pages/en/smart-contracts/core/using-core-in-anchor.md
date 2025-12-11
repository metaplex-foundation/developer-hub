---
title: Using Metaplex Core in Anchor
metaTitle: Using Metaplex Core in Anchor | Core
description: Learn how to utilize the Metaplex Core crate inside your Anchor programs.
---

## Installation

To start using Core in an Anchor project, first ensure that you have added the latest version of the crate to your project by running:

```rust
cargo add mpl-core
```

Alternatively, you can manually specify the version in your cargo.toml file:

```rust
[dependencies]
mpl-core = "x.x.x"
```

### Feature Flag

With the Core crate you can enable the anchor feature flag in the mpl-core crate to access Anchor-specific features by modifying the dependency entry in your `cargo.toml`:

```rust
[dependencies]
mpl-core = { version = "x.x.x", features = [ "anchor" ] }
```

### Core Rust SDK Modules

The Core Rust SDK is organized into several modules:

- `accounts`: represents the program's accounts.
- `errors`: enumerates the program's errors.
- `instructions`: facilitates the creation of instructions, instruction arguments, and CPI instructions.
- `types`: represents types used by the program.

For more detailed information on how different instructions are called and used, refer to the [mpl-core docs.rs website](https://docs.rs/mpl-core/0.7.2/mpl_core/) or you can use `cmd + left click` (mac) or `ctrl + left click` (windows) on the instruction to expand it.

## Accounts Deserialization

### Deserializable Accounts

The following account structs are available for deserialization within the `mpl-core` crate:

```rust
- BaseAssetV1
- BaseCollectionV1
- HashedAssetV1
- PluginHeaderV1
- PluginRegistryV1
```

There are two ways to deserialize Core accounts within Anchor. 

- Using Anchors Account list struct (recommended in most cases),
- Directly in the instruction functions body using `<Account>::from_bytes()`.

### Anchor Accounts List Method

By activating the `anchor flag` you'll be able to deserialize both the `BaseAssetV1` and `BaseCollectionV1` accounts directly in the Anchor Accounts list struct:

{% dialect-switcher title="Accounts Deserialization" %}

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

### Account from_bytes() Method

Borrow the data inside the asset/collection account using the `try_borrow_data()` function and create the asset/collection struct from those bytes:

{% dialect-switcher title="Accounts Deserialization" %}

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

### Deserializing Plugins

To access individual plugins within an Asset or Collection account, use the `fetch_plugin()` function. This function will either return the plugin data or a `null` response without throwing an hard error, allowing you to check if a plugin exists without having to access its data.

The `fetch_plugin()` function is used for both Assets and Collections accounts and can handle every plugin type by specifying the appropriate typing. If you want to access the data inside a plugin, use the middle value returned by this function.

{% dialect-switcher title="Plugins Deserialization" %}

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

Each instruction from the Core crate comes with a **CpiBuilder** version. The CpiBuilder version is created using `name of the instruction` + `CpiBuilder` and simplifies the code significantly abstracting a lot of boilerplate code away! 

If you want to learn more about all the possible instruction available in Core, you can find them on the [mpl-core docs.rs website](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/index.html)

### CPI Example

Let's take the `CreateCollectionV2CpiBuilder` instruction as an example

Initialize the builder by calling `new` on the `CpiBuilder` and passing in the core program as `AccountInfo`:

```rust
CreateCollectionV2CpiBuilder::new(ctx.accounts.mpl_core_program.to_account_info);
```

Use then Cmd + left click (Ctrl + left click for Windows users) to view all the CPI arguments required for this CPI call:

```rust
CreateCollectionV2CpiBuilder::new(&ctx.accounts.core_program)
    .collection(&ctx.accounts.collection)
    .payer(&ctx.accounts.payer)
    .system_program(&ctx.accounts.system_program)
    .name("Test Collection".to_string())
    .uri("https://test.com".to_string())
    .invoke()?;
```

