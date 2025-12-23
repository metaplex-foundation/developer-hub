---
title: 在 Anchor 中使用 Metaplex Core
metaTitle: 在 Anchor 中使用 Metaplex Core | Core
description: 了解如何在您的 Anchor 程序中使用 Metaplex Core crate。
---

## 安装

要在 Anchor 项目中开始使用 Core，首先确保您已通过运行以下命令将最新版本的 crate 添加到您的项目中：

```rust
cargo add mpl-core
```

或者，您可以在 cargo.toml 文件中手动指定版本：

```rust
[dependencies]
mpl-core = "x.x.x"
```

### Feature Flag

使用 Core crate，您可以通过修改 `cargo.toml` 中的依赖项条目来启用 mpl-core crate 中的 anchor feature flag 以访问 Anchor 特定功能：

```rust
[dependencies]
mpl-core = { version = "x.x.x", features = [ "anchor" ] }
```

### Core Rust SDK 模块

Core Rust SDK 被组织成几个模块：

- `accounts`：表示程序的账户。
- `errors`：枚举程序的错误。
- `instructions`：简化指令、指令参数和 CPI 指令的创建。
- `types`：表示程序使用的类型。

有关如何调用和使用不同指令的更多详细信息，请参阅 [mpl-core docs.rs 网站](https://docs.rs/mpl-core/0.7.2/mpl_core/)，或者您可以使用 `cmd + 左键点击`（mac）或 `ctrl + 左键点击`（windows）展开指令。

## 账户反序列化

### 可反序列化的账户

以下账户结构可在 `mpl-core` crate 中进行反序列化：

```rust
- BaseAssetV1
- BaseCollectionV1
- HashedAssetV1
- PluginHeaderV1
- PluginRegistryV1
```

在 Anchor 中反序列化 Core 账户有两种方式：

- 使用 Anchor 的 Account 列表结构（大多数情况下推荐），
- 直接在指令函数体中使用 `<Account>::from_bytes()`。

### Anchor Accounts List 方法

通过激活 `anchor flag`，您将能够直接在 Anchor Accounts 列表结构中反序列化 `BaseAssetV1` 和 `BaseCollectionV1` 账户：

{% dialect-switcher title="账户反序列化" %}

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

### Account from_bytes() 方法

使用 `try_borrow_data()` 函数借用 asset/collection 账户内的数据，并从这些字节创建 asset/collection 结构：

{% dialect-switcher title="账户反序列化" %}

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

### 反序列化插件

要访问 Asset 或 Collection 账户中的单个插件，请使用 `fetch_plugin()` 函数。此函数将返回插件数据或 `null` 响应而不会抛出硬错误，允许您检查插件是否存在而无需访问其数据。

`fetch_plugin()` 函数用于 Assets 和 Collections 账户，并可以通过指定适当的类型来处理每种插件类型。如果您想访问插件内的数据，请使用此函数返回的中间值。

{% dialect-switcher title="插件反序列化" %}

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

**注意**：`fetch_plugin()` 函数仅用于非外部插件。要读取外部插件，请使用 `fetch_external_plugin()` 函数，其操作方式与 `fetch_plugin()` 相同。

## CPI 指令构建器

Core crate 中的每个指令都有一个 **CpiBuilder** 版本。CpiBuilder 版本使用 `指令名称` + `CpiBuilder` 创建，并显著简化代码，抽象掉大量样板代码！

如果您想了解更多关于 Core 中所有可用指令的信息，可以在 [mpl-core docs.rs 网站](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/index.html)找到它们。

### CPI 示例

让我们以 `CreateCollectionV2CpiBuilder` 指令为例。

通过在 `CpiBuilder` 上调用 `new` 并传入 core 程序作为 `AccountInfo` 来初始化构建器：

```rust
CreateCollectionV2CpiBuilder::new(ctx.accounts.mpl_core_program.to_account_info);
```

然后使用 Cmd + 左键点击（Windows 用户使用 Ctrl + 左键点击）查看此 CPI 调用所需的所有 CPI 参数：

```rust
CreateCollectionV2CpiBuilder::new(&ctx.accounts.core_program)
    .collection(&ctx.accounts.collection)
    .payer(&ctx.accounts.payer)
    .system_program(&ctx.accounts.system_program)
    .name("Test Collection".to_string())
    .uri("https://test.com".to_string())
    .invoke()?;
```
