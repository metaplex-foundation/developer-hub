---
title: 在Anchor中使用Metaplex Core
metaTitle: 在Anchor中使用Metaplex Core | Metaplex Core
description: 将Metaplex Core集成到Anchor程序中。学习用于链上NFT操作的CPI调用、账户反序列化和插件访问。
updated: '01-31-2026'
keywords:
  - Core Anchor
  - mpl-core CPI
  - Anchor NFT
  - on-chain Core
about:
  - Anchor integration
  - CPI patterns
  - On-chain development
proficiencyLevel: Advanced
programmingLanguage:
  - Rust
faqs:
  - q: 我需要anchor功能标志吗？
    a: 是的，对于Accounts结构体中的直接反序列化需要。没有它，请手动使用from_bytes()。
  - q: 如何检查插件是否存在？
    a: 使用返回Option的fetch_plugin() - 如果插件不存在，它不会抛出错误。
  - q: 我可以访问外部插件（Oracle、AppData）吗？
    a: 可以。使用fetch_external_plugin()而不是fetch_plugin()，并使用适当的key。
  - q: 在哪里可以找到所有可用的指令？
    a: 请参阅mpl-core docs.rs指令模块获取完整的API参考。
---
使用Anchor构建与Core Asset交互的**链上程序**。本指南涵盖安装、账户反序列化、插件访问和CPI模式。{% .lead %}
{% callout title="您将学到什么" %}
- 在Anchor项目中安装和配置mpl-core
- 在程序中反序列化Core Asset和Collection
- 访问插件数据（Attributes、Freeze等）
- 进行CPI调用以创建、转移和管理Asset
{% /callout %}
## 摘要
`mpl-core` Rust crate提供了从Anchor程序与Core交互所需的一切。启用`anchor`功能标志以进行原生Anchor账户反序列化。
- 添加带有`features = ["anchor"]`的`mpl-core`
- 在Accounts结构体中反序列化Asset/Collection
- 使用`fetch_plugin()`读取插件数据
- CPI构建器简化指令调用
## 范围外
客户端JavaScript SDK（参见[JavaScript SDK](/smart-contracts/core/sdk/javascript)）、独立Rust客户端（参见[Rust SDK](/smart-contracts/core/sdk/rust)）以及从客户端创建Core Asset。
## 快速入门
**跳转到：** [安装](#安装) · [账户反序列化](#账户反序列化) · [插件访问](#插件反序列化) · [CPI示例](#cpi指令构建器)
1. 在Cargo.toml中添加`mpl-core = { version = "x.x.x", features = ["anchor"] }`
2. 使用`Account<'info, BaseAssetV1>`反序列化Asset
3. 使用`fetch_plugin::<BaseAssetV1, PluginType>()`访问插件
4. 使用`CreateV2CpiBuilder`、`TransferV1CpiBuilder`等进行CPI调用
## 安装
要在Anchor项目中开始使用Core，首先确保您已通过运行以下命令将最新版本的crate添加到项目中：
```rust
cargo add mpl-core
```
或者，您可以在cargo.toml文件中手动指定版本：
```rust
[dependencies]
mpl-core = "x.x.x"
```
### 功能标志
使用Core crate，您可以通过修改`cargo.toml`中的依赖项条目来启用mpl-core crate中的anchor功能标志以访问Anchor特定功能：
```rust
[dependencies]
mpl-core = { version = "x.x.x", features = [ "anchor" ] }
```
### Core Rust SDK模块
Core Rust SDK组织成几个模块：
- `accounts`：表示程序的账户。
- `errors`：枚举程序的错误。
- `instructions`：促进指令、指令参数和CPI指令的创建。
- `types`：表示程序使用的类型。
有关如何调用和使用不同指令的更多详细信息，请参阅[mpl-core docs.rs网站](https://docs.rs/mpl-core/0.7.2/mpl_core/)，或者您可以在指令上使用`cmd + 左键点击`（mac）或`ctrl + 左键点击`（windows）来展开它。
## 账户反序列化
### 可反序列化的账户
`mpl-core` crate中可用于反序列化的账户结构体如下：
```rust
- BaseAssetV1
- BaseCollectionV1
- HashedAssetV1
- PluginHeaderV1
- PluginRegistryV1
```
在Anchor中有两种反序列化Core账户的方法。
- 使用Anchor的Account列表结构体（大多数情况下推荐），
- 使用`<Account>::from_bytes()`直接在指令函数体中。
### Anchor Accounts列表方法
通过激活`anchor标志`，您将能够直接在Anchor Accounts列表结构体中反序列化`BaseAssetV1`和`BaseCollectionV1`账户：
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
### Account from_bytes()方法
使用`try_borrow_data()`函数借用asset/collection账户内的数据，并从这些字节创建asset/collection结构体：
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
### 插件反序列化
要访问Asset或Collection账户中的单个插件，请使用`fetch_plugin()`函数。此函数将返回插件数据或`null`响应而不抛出硬错误，允许您检查插件是否存在而无需访问其数据。
`fetch_plugin()`函数用于Asset和Collection账户，并且可以通过指定适当的类型来处理每种插件类型。如果要访问插件内的数据，请使用此函数返回的中间值。
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
**注意**：`fetch_plugin()`函数仅用于非外部插件。要读取外部插件，请使用`fetch_external_plugin()`函数，其操作方式与`fetch_plugin()`相同。
## CPI指令构建器
Core crate的每个指令都有一个**CpiBuilder**版本。CpiBuilder版本使用`指令名称` + `CpiBuilder`创建，通过抽象大量样板代码来显著简化代码！
如果您想了解更多关于Core中所有可用指令的信息，可以在[mpl-core docs.rs网站](https://docs.rs/mpl-core/0.7.2/mpl_core/instructions/index.html)上找到它们。
### CPI示例
以`CreateCollectionV2CpiBuilder`指令为例。
通过在`CpiBuilder`上调用`new`并将core程序作为`AccountInfo`传入来初始化构建器：
```rust
CreateCollectionV2CpiBuilder::new(ctx.accounts.mpl_core_program.to_account_info);
```
然后使用Cmd + 左键点击（Windows用户使用Ctrl + 左键点击）查看此CPI调用所需的所有CPI参数：
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
Asset或Collection账户不存在或尚未创建。
### `PluginNotFound`
您尝试获取的插件在Asset上不存在。使用安全返回`None`的`fetch_plugin()`检查。
### `InvalidAuthority`
签名者没有此操作的权限。验证正确的authority正在签名。
## 注意事项
- 始终启用`features = ["anchor"]`以进行原生反序列化
- 对于内置插件使用`fetch_plugin()`，对于外部插件使用`fetch_external_plugin()`
- CPI构建器抽象了账户排序的复杂性
- 查看[docs.rs/mpl-core](https://docs.rs/mpl-core/)获取完整的API参考
## 快速参考
### 常见CPI构建器
| 操作 | CPI构建器 |
|-----------|-------------|
| 创建Asset | `CreateV2CpiBuilder` |
| 创建Collection | `CreateCollectionV2CpiBuilder` |
| 转移Asset | `TransferV1CpiBuilder` |
| 销毁Asset | `BurnV1CpiBuilder` |
| 更新Asset | `UpdateV1CpiBuilder` |
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
### 我需要anchor功能标志吗？
是的，对于Accounts结构体中的直接反序列化需要。没有它，请手动使用`from_bytes()`。
### 如何检查插件是否存在？
使用返回`Option`的`fetch_plugin()` - 如果插件不存在，它不会抛出错误。
### 我可以访问外部插件（Oracle、AppData）吗？
可以。使用`fetch_external_plugin()`而不是`fetch_plugin()`，并使用适当的key。
### 在哪里可以找到所有可用的指令？
请参阅[mpl-core docs.rs指令模块](https://docs.rs/mpl-core/latest/mpl_core/instructions/index.html)。
## 术语表
| 术语 | 定义 |
|------|------------|
| **CPI** | 跨程序调用 - 从一个程序调用另一个程序 |
| **CpiBuilder** | 用于构建CPI调用的辅助结构体 |
| **BaseAssetV1** | 用于反序列化的Core Asset账户结构体 |
| **fetch_plugin()** | 从账户读取插件数据的函数 |
| **anchor feature** | 启用Anchor原生反序列化的Cargo功能 |
## 相关页面
- [Anchor质押示例](/smart-contracts/core/guides/anchor/anchor-staking-example) - 完整的质押程序
- [使用Anchor创建Asset](/smart-contracts/core/guides/anchor/how-to-create-a-core-nft-asset-with-anchor) - 分步指南
- [Rust SDK](/smart-contracts/core/sdk/rust) - 独立Rust客户端使用
- [mpl-core docs.rs](https://docs.rs/mpl-core/) - 完整API参考
