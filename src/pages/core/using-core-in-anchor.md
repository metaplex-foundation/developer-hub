---
title: How to use Core in Anchor
metaTitle: Core - Using Core in Anchor
description: Learn how to use Core inside your Anchor Smart Contracts
---

## Intallation

To start using Core in an Anchor project, first make sure that you have added the latest version of the crate to your project.

```rust
cargo add mpl-core
```

Alternatively you can manually write into the dependencies list what version you want.

```rust
[dependencies]
mpl-core = "x.x.x"
```

#### Feature Flag

With the `mpl-core` crate enable the anchor feature flag by using `features = ["anchor]"` on the dependcy entry to gain access to anchor specific features within the crate.

```rust
[dependencies]
mpl-core = { version = "x.x.x", features = [ "anchor" ] }
```

The Core Rust SDK is organized into several modules:

- `accounts`: represents the program's accounts.
- `errors`: enumerates the program's errors.
- `instructions`: facilitates the creation of instructions, instruction arguments, and CPI instructions.
- `types`: represents types used by the program.

For more detailed information on how different instructions are called and used, refer to the [mpl-core docs.rs website](https://docs.rs/mpl-core/0.7.2/mpl_core/) or you can use cmd + left click (Cntrl + left click for window users) on the instruction to expand it.

## Accounts

#### Deserializable Accounts
```rust
- BaseAssetV1
- BaseCollectionV1
- HashedAssetV1
- PluginHeaderV1
- PluginRegistryV1
```

There are two ways to deserialize accounts while using the Anchor framework.

One approach to directly deserialize the Asset or Collection account is to use the `Asset` or `Collection` struct to access all the data, including the basic information and all the plugins (normal and external). However, deserializing such a large account can lead to stack overflow errors, so our raccomandation is to deserialize these accounts as `BaseAssetV1` or `BaseCollectionV1`, which contains the basic data, and then deserialize the plugin data separately.

There are different methods to deserialize a core-specific BaseAccount. One method involves using the Anchor account struct macro, while the other one involves deserializing the raw bytes of the account:

#### Anchor Accounts List Method

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

#### Account from_bytes()

Start by borrowing the data inside the asset/collection account using the `try_borrow_data()` function. Then, create the asset/collection struct from those bytes, as shown in the example below:

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

Each instruction from the Metaplex Rust `mpl-core` crate comes with a **CpiBuilder** version of each transaction (listed above) which you can be imported. The CpiBuilder is created using `name of the instruction` + `CpiBuilder` and simplifies the code significantly abstracting a lot of boilerplate code away! 

<!-- #### CpiBuilder List

- [AddCollectionExternalPluginAdapterV1CpiBuilder](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/struct.AddCollectionExternalPluginAdapterV1CpiBuilder.html)
- [AddCollectionPluginV1CpiBuilder](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/struct.AddCollectionPluginV1CpiBuilder.html)
- [AddExternalPluginAdapterV1CpiBuilder](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/struct.AddExternalPluginAdapterV1CpiBuilder.html)
- [AddPluginV1CpiBuilder](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/struct.AddPluginV1CpiBuilder.html)
- [ApproveCollectionPluginAuthorityV1CpiBuilder](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/struct.ApproveCollectionPluginAuthorityV1CpiBuilder.html)
- [ApprovePluginAuthorityV1CpiBuilder](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/struct.ApprovePluginAuthorityV1CpiBuilder.html)
- [BurnCollectionV1CpiBuilder](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/struct.BurnCollectionV1CpiBuilder.html)
- [BurnV1CpiBuilder](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/struct.BurnV1CpiBuilder.html)
- [CollectCpiBuilder](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/struct.CollectCpiBuilder.html)
- [CreateCollectionV1CpiBuilder](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/struct.CreateCollectionV1CpiBuilder.html)
- [CreateCollectionV2CpiBuilder](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/struct.CreateCollectionV2CpiBuilder.html)
- [CreateV1CpiBuilder](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/struct.CreateV1CpiBuilder.html)
- [CreateV2CpiBuilder](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/struct.CreateV2CpiBuilder.html)
- [RemoveCollectionExternalPluginAdapterV1CpiBuilder](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/struct.RemoveCollectionExternalPluginAdapterV1CpiBuilder.html)
- [RemoveCollectionPluginV1CpiBuilder](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/struct.RemoveCollectionPluginV1CpiBuilder.html)
- [RemoveExternalPluginAdapterV1CpiBuilder](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/struct.RemoveExternalPluginAdapterV1CpiBuilder.html)
- [RemovePluginV1CpiBuilder](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/struct.RemovePluginV1CpiBuilder.html)
- [RevokeCollectionPluginAuthorityV1CpiBuilder](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/struct.RevokeCollectionPluginAuthorityV1CpiBuilder.html)
- [RevokePluginAuthorityV1CpiBuilder](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/struct.RevokePluginAuthorityV1CpiBuilder.html)
- [TransferV1CpiBuilder](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/struct.TransferV1CpiBuilder.html)
- [UpdateCollectionExternalPluginAdapterV1CpiBuilder](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/struct.UpdateCollectionExternalPluginAdapterV1CpiBuilder.html)
- [UpdateCollectionPluginV1CpiBuilder](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/struct.UpdateCollectionPluginV1CpiBuilder.html)
- [UpdateCollectionV1CpiBuilder](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/struct.UpdateCollectionV1CpiBuilder.html)
- [UpdateExternalPluginAdapterV1CpiBuilder](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/struct.UpdateExternalPluginAdapterV1CpiBuilder.html)
- [UpdatePluginV1CpiBuilder](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/struct.UpdatePluginV1CpiBuilder.html)
- [UpdateV1CpiBuilder](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/struct.UpdateV1CpiBuilder.html)
- [WriteCollectionExternalPluginAdapterDataV1CpiBuilder](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/struct.WriteCollectionExternalPluginAdapterDataV1CpiBuilder.html)
- [WriteExternalPluginAdapterDataV1CpiBuilder](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/struct.WriteExternalPluginAdapterDataV1CpiBuilder.html) -->


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

