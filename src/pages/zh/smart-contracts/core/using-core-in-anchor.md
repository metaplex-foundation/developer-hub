---
title: 在 Anchor 中使用 Metaplex Core
metaTitle: 在 Anchor 中使用 Metaplex Core | Metaplex Core
description: 将 Metaplex Core 集成到 Anchor 程序中。学习用于链上 NFT 操作的 CPI 调用、账户反序列化和插件访问。
---

使用 Anchor 构建与 Core Assets 交互的**链上程序**。本指南涵盖安装、账户反序列化、插件访问和 CPI 模式。 {% .lead %}

{% callout title="您将学到" %}

- 在 Anchor 项目中安装和配置 mpl-core
- 在程序中反序列化 Core Assets 和 Collections
- 访问插件数据（Attributes、Freeze 等）
- 进行 CPI 调用以创建、转移和管理 Assets

{% /callout %}

## 摘要

`mpl-core` Rust crate 提供了从 Anchor 程序与 Core 交互所需的一切。启用 `anchor` feature flag 以获得原生 Anchor 账户反序列化。

- 使用 `features = ["anchor"]` 添加 `mpl-core`
- 在 Accounts 结构体中反序列化 Assets/Collections
- 使用 `fetch_plugin()` 读取插件数据
- CPI 构建器简化指令调用

## 范围外

客户端 JavaScript SDK（参见 [JavaScript SDK](/zh/smart-contracts/core/sdk/javascript)）、独立 Rust 客户端（参见 [Rust SDK](/zh/smart-contracts/core/sdk/rust)）、从客户端创建 Core Assets。

## 快速开始

**跳转至：** [安装](#安装) · [账户反序列化](#账户反序列化) · [插件访问](#反序列化插件) · [CPI 示例](#cpi-指令构建器)

1. 在 Cargo.toml 中添加 `mpl-core = { version = "x.x.x", features = ["anchor"] }`
2. 使用 `Account<'info, BaseAssetV1>` 反序列化 Assets
3. 使用 `fetch_plugin::<BaseAssetV1, PluginType>()` 访问插件
4. 使用 `CreateV2CpiBuilder`、`TransferV1CpiBuilder` 等进行 CPI 调用

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

- `accounts`：表示程序的账户
- `errors`：枚举程序的错误
- `instructions`：简化指令、指令参数和 CPI 指令的创建
- `types`：表示程序使用的类型

有关如何调用和使用不同指令的更多详细信息，请参阅 [mpl-core docs.rs 网站](https://docs.rs/mpl-core/0.7.2/mpl_core/)，或者您可以使用 `Cmd + 左键点击`（Mac）或 `Ctrl + 左键点击`（Windows）展开指令。

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

- 使用 Anchor 的 Account 列表结构（大多数情况下推荐）
- 直接在指令函数体中使用 `<Account>::from_bytes()`

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

## 常见错误

### `AccountNotInitialized`

Asset 或 Collection 账户不存在或尚未创建。

### `PluginNotFound`

您尝试获取的插件在 Asset 上不存在。使用 `fetch_plugin()` 检查，它会安全地返回 `None`。

### `InvalidAuthority`

签名者没有此操作的权限。验证正确的权限正在签名。

## 注意事项

- 始终启用 `features = ["anchor"]` 以获得原生反序列化
- 对内置插件使用 `fetch_plugin()`，对外部插件使用 `fetch_external_plugin()`
- CPI 构建器抽象了账户排序的复杂性
- 查看 [docs.rs/mpl-core](https://docs.rs/mpl-core/) 获取完整的 API 参考

## 快速参考

### 常见 CPI 构建器

| 操作 | CPI 构建器 |
|-----------|-------------|
| 创建 Asset | `CreateV2CpiBuilder` |
| 创建 Collection | `CreateCollectionV2CpiBuilder` |
| 转移 Asset | `TransferV1CpiBuilder` |
| 销毁 Asset | `BurnV1CpiBuilder` |
| 更新 Asset | `UpdateV1CpiBuilder` |
| 添加插件 | `AddPluginV1CpiBuilder` |
| 更新插件 | `UpdatePluginV1CpiBuilder` |

### 账户类型

| 账户 | 结构体 |
|---------|--------|
| Asset | `BaseAssetV1` |
| Collection | `BaseCollectionV1` |
| Hashed Asset | `HashedAssetV1` |
| Plugin Header | `PluginHeaderV1` |
| Plugin Registry | `PluginRegistryV1` |

## 常见问题

### 需要 anchor feature flag 吗？

是的，在 Accounts 结构体中直接反序列化需要它。没有它，需要手动使用 `from_bytes()`。

### 如何检查插件是否存在？

使用 `fetch_plugin()`，它返回 `Option` - 如果插件不存在不会抛出错误。

### 可以访问外部插件（Oracle、AppData）吗？

可以。使用 `fetch_external_plugin()` 代替 `fetch_plugin()`，并使用适当的键。

### 在哪里可以找到所有可用的指令？

参见 [mpl-core docs.rs instructions 模块](https://docs.rs/mpl-core/latest/mpl_core/instructions/index.html)。

## 术语表

| 术语 | 定义 |
|------|------------|
| **CPI** | Cross-Program Invocation - 从一个程序调用另一个程序 |
| **CpiBuilder** | 用于构造 CPI 调用的帮助结构体 |
| **BaseAssetV1** | 用于反序列化的 Core Asset 账户结构体 |
| **fetch_plugin()** | 从账户读取插件数据的函数 |
| **anchor feature** | 启用 Anchor 原生反序列化的 Cargo feature |

## 相关页面

- [Anchor 质押示例](/zh/smart-contracts/core/guides/anchor/anchor-staking-example) - 完整的质押程序
- [使用 Anchor 创建 Core Asset](/zh/smart-contracts/core/guides/anchor/how-to-create-a-core-nft-asset-with-anchor) - 分步指南
- [Rust SDK](/zh/smart-contracts/core/sdk/rust) - 独立 Rust 客户端使用
- [mpl-core docs.rs](https://docs.rs/mpl-core/) - 完整 API 参考

---

*由 Metaplex Foundation 维护 · 2026年1月最后验证 · 适用于 @metaplex-foundation/mpl-core*
