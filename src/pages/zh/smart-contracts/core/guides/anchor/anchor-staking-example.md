---
title: 使用 Anchor 创建质押程序
metaTitle: 使用 Anchor 创建质押程序 | Core 指南
description: 本指南将向您展示如何利用 FreezeDelegate 和 Attribute 插件使用 Metaplex Core 数字资产标准创建质押程序！
---

本开发者指南演示如何使用 Anchor 利用 `Attribute` 和 `Freeze Delegate` 插件为您的集合创建质押程序。这种方法使用智能合约来处理质押背后的所有逻辑，如时间计算和资产状态管理（质押/取消质押），但数据不会像 Core 之前的标准那样保存在 PDA 中，而是保存在资产本身上。

## 起步：理解程序背后的逻辑

该程序使用标准 Anchor 操作，采用单文件方法，所有必要的宏都可以在 lib.rs 文件中找到：
- declare_id：指定程序的链上地址。
- #[program]：指定包含程序指令逻辑的模块。
- #[derive(Accounts)]：应用于结构体以指示指令所需的账户列表。
- #[account]：应用于结构体以创建特定于程序的自定义账户类型。

**要实现此示例，您需要以下组件：**
- **一个 Asset**
- **一个 Collection**（可选，但与此示例相关）
- **FreezeDelegate 插件**
- **Attribute 插件**

### Freeze Delegate 插件

**Freeze Delegate 插件**是一个**所有者管理的插件**，这意味着它需要所有者的签名才能应用于资产。

此插件允许**委托者冻结和解冻资产，防止转移**。资产所有者或插件权限可以随时撤销此插件，除非资产被冻结（在这种情况下必须先解冻才能撤销）。

**使用此插件是轻量级的**，因为冻结/解冻资产只涉及更改插件数据中的布尔值（唯一的参数是 Frozen: bool）。

_在[这里](/zh/smart-contracts/core/plugins/freeze-delegate)了解更多_

### Attribute 插件

**Attribute 插件**是一个**权限管理的插件**，这意味着它需要权限的签名才能应用于资产。对于包含在集合中的资产，集合权限充当权限，因为资产的权限字段被集合地址占用。

此插件允许**直接在资产上存储数据，作为链上属性或特征**。这些特征可以直接被链上程序访问，因为它们不像 mpl-token-metadata 程序那样存储在链下。

**此插件接受 AttributeList 字段**，它由键值对数组组成，键和值都是字符串。

_在[这里](/zh/smart-contracts/core/plugins/attribute)了解更多_

### 智能合约逻辑

为简单起见，此示例只包含两个指令：**stake** 和 **unstake** 函数，因为这些是质押程序正常工作所必需的。虽然可以添加额外的指令，如 **spendPoint** 指令来使用累积的积分，但这留给读者自己实现。

_Stake 和 Unstake 函数都以不同方式使用之前介绍的插件_。

在深入指令之前，让我们花一些时间讨论使用的属性，`staked` 和 `staked_time` 键。`staked` 键表示资产是否已质押以及何时质押（取消质押 = 0，质押 = 质押时间）。`staked_time` 键跟踪资产的总质押持续时间，仅在资产取消质押后更新。

**指令**：
- **Stake**：此指令应用 Freeze Delegate 插件，通过将标志设置为 true 来冻结资产。此外，它将 Attribute 插件中的 `staked` 键从 0 更新为当前时间。
- **Unstake**：此指令更改 Freeze Delegate 插件的标志并撤销它，以防止恶意实体控制资产并要求赎金才能解冻。它还将 `staked` 键更新为 0，并将 `staked_time` 设置为当前时间减去质押时间戳。

## 构建智能合约：逐步指南

现在我们理解了智能合约背后的逻辑，**是时候深入代码并将一切整合在一起了**！

### 依赖项和导入

在编写智能合约之前，让我们看看我们需要什么 crate 以及从它们中需要什么函数来确保我们的智能合约工作！

在这个示例中，我们主要使用启用了 [anchor](/zh/smart-contracts/core/using-core-in-anchor) 功能的 mpl_core crate：

```toml
mpl-core = { version = "x.x.x", features = ["anchor"] }
```

该 crate 中不同的函数如下：

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

在本指南中，我们将使用 Anchor 框架，但您也可以使用原生程序来实现。在这里了解更多关于 Anchor 框架的信息：[Anchor 框架](https://book.anchor-lang.com/introduction/what_is_anchor.html)。

为了简单起见和本练习的目的，我们将使用单文件方法，将账户和指令都放在 lib.rs 中，而不是通常的分离方式。

**注意**：您可以跟随并在 Solana Playground（一个用于构建和部署 Solana 程序的在线工具）中打开示例：Solana Playground。

在所有指令的账户结构中，我们将分离 Signer 和 Payer。这是一个标准程序，因为 PDA 无法支付账户创建费用，所以如果用户希望 PDA 成为指令的权限，需要两个不同的字段。虽然这种分离对我们的指令不是严格必要的，但这被认为是良好的实践。

### Account 结构

对于此示例，我们使用 mpl-core crate 的 anchor 标志直接从账户结构反序列化 Asset 和 Collection 账户，并对其添加一些约束。

_在[这里](/zh/smart-contracts/core/using-core-in-anchor)了解更多_

我们将对 `stake` 和 `unstake` 指令使用单个账户结构 `Stake`，因为它们使用相同的账户和相同的约束。

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

作为约束我们检查了：
- 资产的 `owner` 与账户结构中的 `owner` 相同。
- 资产的 `update_authority` 是一个 Collection，该集合的地址与账户结构中的 `collection` 相同。
- 集合的 `update_authority` 与账户结构中的 `update_authority` 相同，因为这将成为资产的 `update_authority`。
- `core_program` 与 `mpl_core` crate 中的 `ID`（我将其重命名为 `CORE_PROGRAM_ID`）相同。

### 质押指令

我们首先使用 mpl-core crate 的 `fetch_plugin` 函数检索有关资产 attribute 插件的信息。

```rust
match fetch_plugin::<BaseAssetV1, Attributes>(
    &ctx.accounts.asset.to_account_info(),
    mpl_core::types::PluginType::Attributes
)
```

1. **检查 Attribute 插件**

`fetch_plugin` 函数有 2 种不同的响应：
- `(_, fetched_attribute_list, _)` 如果资产有关联的 attribute 插件
- `Err` 如果资产没有关联的 attribute 插件

这就是为什么我们使用 `match` 来处理插件的响应。

如果资产没有 attribute 插件，我们应该添加它并用 `staked` 和 `stakedTime` 键填充它。

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
如果资产已经有 attribute 插件，确保它包含质押指令所需的质押属性。

如果有，检查资产是否已经质押，并用当前时间戳作为字符串更新 `staked` 键：

```rust
Ok((_, fetched_attribute_list, _)) => {
    // 如果是，检查资产是否已经质押，以及质押属性是否已经初始化
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

如果没有，将它们添加到现有属性列表中。

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

3. **更新 Attribute 插件**：
用新的或修改的属性更新 attribute 插件。

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

4. **冻结资产**
无论资产之前是否已有 attribute 插件，都冻结资产使其无法交易。

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

**这是完整的指令**：
```rust
pub fn stake(ctx: Context<Stake>) -> Result<()> {
    // 检查资产是否已经有 attribute 插件
    match fetch_plugin::<BaseAssetV1, Attributes>(&ctx.accounts.asset.to_account_info(), mpl_core::types::PluginType::Attributes) {
        Ok((_, fetched_attribute_list, _)) => {
            // 如果有，检查资产是否已经质押，以及质押属性是否已经初始化
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
            // 如果没有，向资产添加 attribute 插件
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

    // 冻结资产
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

取消质押指令会更简单，因为取消质押指令只能在质押指令之后调用，所以许多检查本质上已经被质押指令覆盖了。

我们首先使用 mpl-core crate 的 `fetch_plugin` 函数检索有关资产 attribute 插件的信息。

```rust
match fetch_plugin::<BaseAssetV1, Attributes>(&ctx.accounts.asset.to_account_info(), mpl_core::types::PluginType::Attributes)
```
但这次如果我们找不到 Attribute 插件，我们会抛出一个硬错误。

```rust
Err(_) => {
    return Err(StakingError::AttributesNotInitialized.into());
}
```

1. **对 attribute 插件运行所有检查**

为了验证资产是否已经通过质押指令，**指令检查 attribute 插件的以下内容**：
- **资产是否有 Staked 键？**
- **资产当前是否已质押？**

如果这些检查中的任何一个缺失，资产从未通过质押指令。

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

一旦我们确认资产有质押属性并检查资产当前已质押。如果已质押，我们按如下方式更新质押属性：
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

2. **更新 Attribute 插件**
用新的或修改的属性更新 attribute 插件。

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

3. **解冻并移除 FreezeDelegate 插件**
在指令结束时，解冻资产并移除 FreezeDelegate 插件，使资产"自由"且不受 `update_authority` 控制。

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

**这是完整的指令**：
```rust
pub fn unstake(ctx: Context<Unstake>) -> Result<()> {
    // 检查资产是否已经有 attribute 插件
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

    // 解冻资产
    UpdatePluginV1CpiBuilder::new(&ctx.accounts.core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(Some(&ctx.accounts.collection.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.update_authority.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .plugin(Plugin::FreezeDelegate( FreezeDelegate{ frozen: false } ))
    .invoke()?;

    // 移除 FreezeDelegate 插件
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

恭喜！您现在已经具备为您的 NFT 集合创建质押解决方案的能力！如果您想了解更多关于 Core 和 Metaplex 的信息，请查看[开发者中心](/zh/smart-contracts/core/sdk)。
