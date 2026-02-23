---
title: 使用 Anchor 创建质押程序
metaTitle: 使用 Anchor 创建质押程序 | Core 指南
description: 本指南将向您展示如何利用 FreezeDelegate 和 Attribute Plugin 使用 Metaplex Core 数字资产标准创建质押程序！
updated: '01-31-2026'
keywords:
  - NFT staking
  - Anchor staking
  - staking smart contract
  - freeze delegate staking
about:
  - Staking programs
  - Anchor development
  - On-chain staking
proficiencyLevel: Advanced
programmingLanguage:
  - Rust
howToSteps:
  - 使用 mpl-core 依赖设置 Anchor 项目
  - 创建添加 Freeze 和 Attribute Plugin 的质押指令
  - 创建解冻并计算质押时长的取消质押指令
  - 在 devnet 上部署和测试您的质押程序
howToTools:
  - Anchor framework
  - mpl-core Rust crate
  - Solana CLI
---
本开发者指南演示如何使用 Anchor 为您的 Collection 创建质押程序，利用 `Attribute` 和 `Freeze Delegate` Plugin。这种方法使用智能合约处理质押背后的所有逻辑，如时间计算和 Asset 状态管理（质押/取消质押），但数据不会像 Core 之前的标准那样保存在 PDA 中，而是直接保存在 Asset 本身上。 {% .lead %}
## 入门：理解程序背后的逻辑
本程序使用标准 Anchor 框架运行，采用单文件方式，所有必要的宏都可以在 lib.rs 文件中找到：
- declare_id：指定程序的链上地址。
- #[program]：指定包含程序指令逻辑的模块。
- #[derive(Accounts)]：应用于结构体，表示指令所需的账户列表。
- #[account]：应用于结构体，创建程序特定的自定义账户类型
**要实现此示例，您需要以下组件：**
- **一个 Asset**
- **一个 Collection**（可选，但与本示例相关）
- **FreezeDelegate Plugin**
- **Attribute Plugin**
### Freeze Delegate Plugin
**Freeze Delegate Plugin** 是一个**所有者管理的 Plugin**，这意味着它需要所有者的签名才能应用到 Asset 上。
此 Plugin 允许**委托人冻结和解冻 Asset，防止转移**。Asset 所有者或 Plugin 权限方可以随时撤销此 Plugin，除非 Asset 处于冻结状态（在这种情况下必须先解冻才能撤销）。
**使用此 Plugin 非常轻量**，因为冻结/解冻 Asset 只需更改 Plugin 数据中的布尔值（唯一的参数是 Frozen: bool）。
_在[Freeze Delegate插件页面](/zh/smart-contracts/core/plugins/freeze-delegate)了解更多_
### Attribute Plugin
**Attribute Plugin** 是一个**权限管理的 Plugin**，这意味着它需要权限方的签名才能应用到 Asset 上。对于包含在 Collection 中的 Asset，Collection 权限方作为权限方，因为 Asset 的权限字段被 Collection 地址占用。
此 Plugin 允许**直接在 Asset 上存储数据，作为链上属性或特征**。这些特征可以直接被链上程序访问，因为它们不像 mpl-token-metadata 程序那样存储在链下。
**此 Plugin 接受 AttributeList 字段**，它由键值对数组组成，键和值都是字符串。
_在[Attribute插件页面](/zh/smart-contracts/core/plugins/attribute)了解更多_
### 智能合约逻辑
为简单起见，本示例仅包含两个指令：**stake** 和 **unstake** 函数，因为这些是质押程序正常工作所必需的。虽然可以添加额外的指令，如 **spendPoint** 指令来使用累积的积分，但这留给读者自行实现。
_Stake 和 Unstake 函数都以不同方式使用了前面介绍的 Plugin_。
在深入了解指令之前，让我们花些时间讨论使用的属性，即 `staked` 和 `staked_time` 键。`staked` 键指示 Asset 是否已质押以及何时质押（未质押 = 0，已质押 = 质押时间）。`staked_time` 键跟踪 Asset 的总质押时长，仅在 Asset 取消质押后更新。
**指令**：
- **Stake**：此指令应用 Freeze Delegate Plugin，通过将标志设置为 true 来冻结 Asset。此外，它将 Attribute Plugin 中的 `staked` 键从 0 更新为当前时间。
- **Unstake**：此指令更改 Freeze Delegate Plugin 的标志并撤销它，以防止恶意实体控制 Asset 并要求赎金来解冻。它还将 `staked` 键更新为 0，并将 `staked_time` 设置为当前时间减去质押时间戳。
## 构建智能合约：逐步指南
现在我们理解了智能合约背后的逻辑，**是时候深入代码并将所有内容整合在一起了**！
### 依赖和导入
在编写智能合约之前，让我们看看我们需要什么 crate 以及它们的哪些函数来确保我们的智能合约正常工作！
在本示例中，我们主要使用启用了 [anchor](/zh/smart-contracts/core/using-core-in-anchor) 功能的 mpl_core crate：
```toml
mpl-core = { version = "x.x.x", features = ["anchor"] }
```
该 crate 中的不同函数如下：
```rust
use mpl_core::{
    ID as CORE_PROGRAM_ID,
    fetch_plugin,
    accounts::{BaseAssetV1, BaseCollectionV1},
    instructions::{AddPluginV1CpiBuilder, RemovePluginV1CpiBuilder, UpdatePluginV1CpiBuilder},
    types::{Attribute, Attributes, FreezeDelegate, Plugin, PluginAuthority, PluginType, UpdateAuthority},
};
```
### Anchor 概述
在本指南中，我们将使用 Anchor 框架，但您也可以使用原生程序实现。在这里了解更多关于 Anchor 框架的信息：[Anchor Framework](https://book.anchor-lang.com/introduction/what_is_anchor.html)。
为简单起见和本练习的目的，我们将使用单文件方式，将账户和指令都放在 lib.rs 中，而不是通常的分离方式。
**注意**：您可以跟随并在 Solana Playground 中打开示例，这是一个用于构建和部署 Solana 程序的在线工具：Solana Playground。
在所有指令的账户结构中，我们将 Signer 和 Payer 分开。这是标准做法，因为 PDA 无法支付账户创建费用，所以如果用户希望 PDA 作为指令的权限方，需要有两个不同的字段。虽然这种分离对我们的指令来说并非严格必要，但被认为是良好的实践。
### 账户结构
在本示例中，我们使用 mpl-core crate 的 anchor 标志直接从账户结构中反序列化 Asset 和 Collection 账户，并对其设置一些约束
_在[在Anchor中使用Core指南](/zh/smart-contracts/core/using-core-in-anchor)了解更多_
我们将使用单个账户结构 `Stake` 用于 `stake` 和 `unstake` 指令，因为它们使用相同的账户和相同的约束。
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
作为约束，我们检查了：
- Asset 的 `owner` 与账户结构中的 `owner` 相同。
- Asset 的 `update_authority` 是一个 Collection，且该 Collection 的地址与账户结构中的 `collection` 相同
- Collection 的 `update_authority` 与账户结构中的 `update_authority` 相同，因为这将是 Asset 的 `update_authority`
- `core_program` 与 `mpl_core` crate 中的 `ID`（我将其重命名为 `CORE_PROGRAM_ID`）相同
### 质押指令
我们首先使用 mpl-core crate 中的 `fetch_plugin` 函数来获取 Asset 的 Attribute Plugin 信息。
```rust
match fetch_plugin::<BaseAssetV1, Attributes>(
    &ctx.accounts.asset.to_account_info(),
    mpl_core::types::PluginType::Attributes
)
```
1. **检查 Attribute Plugin**
`fetch_plugin` 函数有 2 种不同的响应：
- `(_, fetched_attribute_list, _)` 如果 Asset 有关联的 Attribute Plugin
- `Err` 如果 Asset 没有关联的 Attribute Plugin
这就是为什么我们使用 `match` 来处理 Plugin 的响应
如果 Asset 没有 Attribute Plugin，我们应该添加它并用 `staked` 和 `stakedTime` 键填充它。
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
2. **检查质押属性**：
如果 Asset 已经有 Attribute Plugin，确保它包含质押指令所需的质押属性。
如果有，检查 Asset 是否已经质押，并用当前时间戳作为字符串更新 `staked` 键：
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
如果没有，将它们添加到现有的属性列表中。
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
3. **更新 Attribute Plugin**：
使用新的或修改后的属性更新 Attribute Plugin。
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
4. **冻结 Asset**
无论 Asset 之前是否有 Attribute Plugin，都冻结 Asset 使其无法交易
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
**以下是完整指令**：
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
### 取消质押指令
取消质押指令会更简单，因为取消质押指令只能在质押指令之后调用，许多检查本质上已被质押指令覆盖。
我们首先使用 mpl-core crate 中的 `fetch_plugin` 函数来获取 Asset 的 Attribute Plugin 信息。
```rust
match fetch_plugin::<BaseAssetV1, Attributes>(&ctx.accounts.asset.to_account_info(), mpl_core::types::PluginType::Attributes)
```
但这次如果我们没有找到 Attribute Plugin，我们会抛出一个硬错误
```rust
Err(_) => {
    return Err(StakingError::AttributesNotInitialized.into());
}
```
1. **运行 Attribute Plugin 的所有检查**
要验证 Asset 是否已经经过质押指令，**指令检查 Attribute Plugin 的以下内容**：
- **Asset 是否有 Staked 键？**
- **Asset 当前是否已质押？**
如果缺少任何这些检查，则 Asset 从未经过质押指令。
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
一旦我们确认 Asset 具有质押属性并检查 Asset 当前是否已质押。如果已质押，我们按如下方式更新质押属性：
- 将 `Staked` 字段设置为零
- 将 `stakedTime` 更新为 `stakedTime` + (currentTimestamp - stakedTimestamp)
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
2. **更新 Attribute Plugin**
使用新的或修改后的属性更新 Attribute Plugin。
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
3. **解冻并移除 FreezeDelegate Plugin**
在指令结束时，解冻 Asset 并移除 FreezeDelegate Plugin，使 Asset "自由"且不受 `update_authority` 控制
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
**以下是完整指令**：
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
## 结论
恭喜！您现在已具备为您的 NFT Collection 创建质押解决方案的能力！如果您想了解更多关于 Core 和 Metaplex 的信息，请查看[开发者中心](/zh/smart-contracts/core/getting-started)。
