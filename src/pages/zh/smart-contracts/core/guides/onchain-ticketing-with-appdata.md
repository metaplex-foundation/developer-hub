---
title: 利用 AppData 插件创建活动票务平台
metaTitle: Core - AppData 插件示例
description: 本指南展示如何利用 AppData 插件创建票务平台。
---

本开发者指南利用新的 AppData 插件来**创建一个票务解决方案，可用于生成作为数字资产的门票，并由发行者以外的外部信任来源（如场馆经理）进行验证**。

## 简介

### 外部插件

**外部插件**是一种由*外部*来源控制行为的插件。Core 程序将为这些插件提供适配器，但开发者通过将此适配器指向外部数据源来决定行为。

每个外部适配器都能够将生命周期检查分配给生命周期事件，影响正在发生的生命周期事件的行为。这意味着我们可以将以下检查分配给创建、转移、更新和销毁等生命周期事件：
- **Listen**：一个"web3"webhook，在生命周期事件发生时提醒插件。这对于跟踪数据或执行操作特别有用。
- **Reject**：插件可以拒绝生命周期事件。
- **Approve**：插件可以批准生命周期事件。

如果您想了解更多关于外部插件的信息，请在[这里](/zh/smart-contracts/core/external-plugins/overview)阅读更多内容。

### AppData 插件

**AppData 插件**允许资产/集合权限保存可由 `data_authority`（外部信任来源）写入和更改的任意数据，可以分配给资产/集合权限决定的任何人。通过 AppData 插件，集合/资产权限可以将向其资产添加数据的任务委托给受信任的第三方。

如果您不熟悉新的 AppData 插件，请在[这里](/zh/smart-contracts/core/external-plugins/app-data)阅读更多内容。

## 总体概述：程序设计

在这个示例中，我们将开发一个包含四个基本操作的票务解决方案：

- **设置管理器**：建立负责创建和发行门票的权限。
- **创建活动**：生成作为集合资产的活动。
- **创建单独门票**：生成属于活动集合的单独门票。
- **处理场馆操作**：管理场馆运营商的操作，如在使用门票时扫描门票。

**注意**：虽然这些操作为票务解决方案提供了基础起点，但完整规模的实现需要额外的功能，如用于索引活动集合的外部数据库。然而，这个示例对于那些有兴趣开发票务解决方案的人来说是一个很好的起点。

### 拥有外部信任来源处理扫描门票的重要性

在引入 **AppData 插件**和 **Core 标准**之前，由于链下存储的限制，管理资产的属性更改是有限的。也不可能将资产特定部分的权限委托给他人。

这一进步对于受监管的用例（如票务系统）是一个游戏规则改变者，因为它允许场馆权限**在不授予他们对属性更改和其他数据方面的完全控制的情况下向资产添加数据**。

这种设置降低了欺诈活动的风险，并将错误的责任从场馆转移出去，因此发行公司保留了资产的不可变记录，而特定的数据更新（如将门票标记为已使用）通过 `AppData 插件`安全地管理。

### 使用数字资产存储数据而不是 PDA

与其依赖通用的外部程序派生地址（[PDAs](/zh/guides/understanding-pdas)）来存储活动相关数据，**您可以将活动本身创建为集合资产**。这种方法允许将活动的所有门票包含在"活动"集合中，使一般活动数据易于访问，并轻松将活动详情与门票资产本身链接。然后您可以对单个门票相关数据使用相同的方法，包括门票号码、大厅、区域、排、座位和价格，直接存储在 Asset 上。

使用 Core 账户（如 `Collection` 或 `Asset` 账户）在处理数字资产时保存相关数据，而不是依赖外部 PDA，可以让门票购买者直接从他们的钱包查看所有相关活动信息，而无需反序列化数据。此外，直接在资产本身上存储数据允许您利用数字资产标准（DAS）通过单个指令在您的网站上获取和显示它，如下所示：

```typescript
const ticketData = await fetchAsset(umi, ticket);
console.log("\nThis are all the ticket-related data: ", ticketData.attributes);
```

## 开始实践：程序

### 前提条件和设置
为了简单起见，我们将使用 Anchor，采用单文件方法，所有必要的宏都可以在 `lib.rs` 文件中找到：

- `declare_id`：指定程序的链上地址。
- `#[program]`：指定包含程序指令逻辑的模块。
- `#[derive(Accounts)]`：应用于结构体以指示指令所需的账户列表。
- `#[account]`：应用于结构体以创建特定于程序的自定义账户类型。

**注意**：您可以跟随并在 Solana Playground（一个用于构建和部署 Solana 程序的在线工具）中打开以下示例：[Solana Playground](https://beta.solpg.io/669fef20cffcf4b13384d277)。

作为风格选择，在所有指令的账户结构中，我们将分离 `Signer` 和 `Payer`。通常两者使用相同的账户，但这是一个标准程序，以防 `Signer` 是 PDA，因为它无法支付账户创建费用，因此需要两个不同的字段。虽然这种分离对我们的指令不是严格必要的，但这被认为是良好的实践。

**注意**：Signer 和 Payer 都必须仍然是交易的签名者。

### 依赖项和导入

在这个示例中，我们主要使用启用了 anchor 功能的 `mpl_core` crate：

```toml
mpl-core = { version = "x.x.x", features = ["anchor"] }
```

使用的依赖项如下：

```rust
use anchor_lang::prelude::*;

use mpl_core::{
    ID as MPL_CORE_ID,
    fetch_external_plugin_adapter_data_info,
    fetch_plugin,
    instructions::{
        CreateCollectionV2CpiBuilder,
        CreateV2CpiBuilder,
        WriteExternalPluginAdapterDataV1CpiBuilder,
        UpdatePluginV1CpiBuilder
    },
    accounts::{BaseAssetV1, BaseCollectionV1},
    types::{
        AppDataInitInfo, Attribute, Attributes,
        ExternalPluginAdapterInitInfo, ExternalPluginAdapterKey,
        ExternalPluginAdapterSchema, PermanentBurnDelegate, UpdateAuthority,
        PermanentFreezeDelegate, PermanentTransferDelegate, Plugin,
        PluginAuthority, PluginAuthorityPair, PluginType
    },
};
```

### 设置管理器指令

设置管理器指令是一个一次性过程，用于初始化 `manager` PDA 并在 manager 账户中保存 bumps。

大部分操作发生在 `Account` 结构中：
```rust
#[derive(Accounts)]
pub struct SetupManager<'info> {
   pub signer: Signer<'info>,
   #[account(mut)]
   pub payer: Signer<'info>,
   #[account(
       init,
       payer = payer,
       space = Manager::INIT_SPACE,
       seeds = [MANAGER_SEEDS.as_bytes()],
       bump,
   )]
   pub manager: Account<'info, Manager>,
   pub system_program: Program<'info, System>,
}
```

这里，我们使用 `init` 宏初始化 `Manager` 账户，payer 转移足够的 lamports 用于租金，`INIT_SPACE` 变量保留适当数量的字节。

```rust
#[account]
pub struct Manager {
    pub bump: u8,
}

impl Space for Manager {
    const INIT_SPACE: usize = 8 + 1;
}
```

在指令本身中，我们只是声明并保存 bumps 以供将来使用签名者种子时引用。这避免了每次使用 manager 账户时浪费计算单元来重新查找它们。

```rust
pub fn setup_manager(ctx: Context<SetupManager>) -> Result<()> {
    ctx.accounts.manager.bump = ctx.bumps.manager;

    Ok(())
}
```

### 创建活动指令

创建活动指令将活动设置为集合资产形式的数字资产，允许您以无缝和有组织的方式包含所有相关门票和活动数据。

此指令的账户结构与设置管理器指令非常相似：

```rust
#[derive(Accounts)]
pub struct CreateEvent<'info> {
   pub signer: Signer<'info>,
   #[account(mut)]
   pub payer: Signer<'info>,
   #[account(
       seeds = [MANAGER_SEEDS.as_bytes()],
       bump = manager.bump
   )]
   pub manager: Account<'info, Manager>,
   #[account(mut)]
   pub event: Signer<'info>,
   pub system_program: Program<'info, System>,
   #[account(address = MPL_CORE_ID)]
   /// CHECK: This is checked by the address constraint
   pub mpl_core_program: UncheckedAccount<'info>
}
```

主要区别是：
- `Manager` 账户已经初始化，将用作活动账户的更新权限。
- 活动账户设置为可变和签名者，将在此指令期间转换为 Core Collection 账户。

由于我们需要在集合账户中保存大量数据，我们通过结构化格式传递所有输入，以避免用大量参数使函数混乱。

```rust
#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateEventArgs {
   pub name: String,
   pub uri: String,
   pub city: String,
   pub venue: String,
   pub artist: String,
   pub date: String,
   pub time: String,
   pub capacity: u64,
}
```

主函数 `create_event` 然后利用上述输入创建活动集合并添加包含所有活动详情的属性。

```rust
pub fn create_event(ctx: Context<CreateEvent>, args: CreateEventArgs) -> Result<()> {
    // 添加一个 Attribute 插件来保存活动详情
    let mut collection_plugin: Vec<PluginAuthorityPair> = vec![];

    let attribute_list: Vec<Attribute> = vec![
        Attribute {
            key: "City".to_string(),
            value: args.city
        },
        Attribute {
            key: "Venue".to_string(),
            value: args.venue
        },
        Attribute {
            key: "Artist".to_string(),
            value: args.artist
        },
        Attribute {
            key: "Date".to_string(),
            value: args.date
        },
        Attribute {
            key: "Time".to_string(),
            value: args.time
        },
        Attribute {
            key: "Capacity".to_string(),
            value: args.capacity.to_string()
        }
    ];

    collection_plugin.push(
        PluginAuthorityPair {
            plugin: Plugin::Attributes(Attributes { attribute_list }),
            authority: Some(PluginAuthority::UpdateAuthority)
        }
    );

    // 创建将保存门票的 Collection
    CreateCollectionV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
    .collection(&ctx.accounts.event.to_account_info())
    .update_authority(Some(&ctx.accounts.manager.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .system_program(&ctx.accounts.system_program.to_account_info())
    .name(args.name)
    .uri(args.uri)
    .plugins(collection_plugin)
    .invoke()?;

    Ok(())
}
```

### 创建门票指令
创建活动指令将活动设置为集合资产形式的数字资产，允许您以无缝和有组织的方式包含所有相关门票和活动数据。

整个指令与 `create_event` 非常相似，因为目标非常相似，但这次我们不是创建活动资产，而是创建将包含在 `活动集合` 中的门票资产。

```rust
#[derive(Accounts)]
pub struct CreateTicket<'info> {
   pub signer: Signer<'info>,
   #[account(mut)]
   pub payer: Signer<'info>,
   #[account(
       seeds = [MANAGER_SEEDS.as_bytes()],
       bump = manager.bump
   )]
   pub manager: Account<'info, Manager>,
   #[account(
       mut,
       constraint = event.update_authority == manager.key(),
   )]
   pub event: Account<'info, BaseCollectionV1>,
   #[account(mut)]
   pub ticket: Signer<'info>,
   pub system_program: Program<'info, System>,
   #[account(address = MPL_CORE_ID)]
   /// CHECK: This is checked by the address constraint
   pub mpl_core_program: UncheckedAccount<'info>
}
```

账户结构中的主要区别是：
- 活动账户已经初始化，所以我们可以将其反序列化为 `BaseCollectionV1` 资产，在这里我们可以检查 `update_authority` 是 manager PDA。
- 门票账户设置为可变和签名者，将在此指令期间转换为 Core Collection 账户。

由于我们在这个函数中也需要保存大量数据，我们通过结构化格式传递这些输入，就像在 `create_event` 指令中已经做的那样。

```rust
#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateTicketArgs {
   pub name: String,
   pub uri: String,
   pub hall: String,
   pub section: String,
   pub row: String,
   pub seat: String,
   pub price: u64,
   pub venue_authority: Pubkey,
}
```

当我们谈到指令时，主要区别是：
- 合并了额外的插件，如 `PermanentFreeze`、`PermanentBurn` 和 `PermanentTransfer`，以便在出现问题时添加安全层。
- 使用新的 `AppData` 外部插件在其中存储由我们在指令中作为输入传递的 `venue_authority` 管理的二进制数据。
- 在开始时有一个健全性检查，以查看发行的门票总数是否超过容量限制。

```rust
pub fn create_ticket(ctx: Context<CreateTicket>, args: CreateTicketArgs) -> Result<()> {
    // 检查是否尚未达到最大门票数量
    let (_, collection_attribute_list, _) = fetch_plugin::<BaseCollectionV1, Attributes>(
            &ctx.accounts.event.to_account_info(),
            PluginType::Attributes
        )?;

    // 搜索 Capacity 属性
    let capacity_attribute = collection_attribute_list
        .attribute_list
        .iter()
        .find(|attr| attr.key == "Capacity")
        .ok_or(TicketError::MissingAttribute)?;

    // 解包 Capacity 属性值
    let capacity = capacity_attribute
        .value
        .parse::<u32>()
        .map_err(|_| TicketError::NumericalOverflow)?;

    require!(
        ctx.accounts.event.num_minted < capacity,
        TicketError::MaximumTicketsReached
    );

    // 添加一个 Attribute 插件来保存门票详情
    let mut ticket_plugin: Vec<PluginAuthorityPair> = vec![];

    let attribute_list: Vec<Attribute> = vec![
    Attribute {
        key: "Ticket Number".to_string(),
        value: ctx.accounts.event.num_minted.checked_add(1).ok_or(TicketError::NumericalOverflow)?.to_string()
    },
    Attribute {
        key: "Hall".to_string(),
        value: args.hall
    },
    Attribute {
        key: "Section".to_string(),
        value: args.section
    },
    Attribute {
        key: "Row".to_string(),
        value: args.row
    },
    Attribute {
        key: "Seat".to_string(),
        value: args.seat
    },
    Attribute {
        key: "Price".to_string(),
        value: args.price.to_string()
    }
    ];

    ticket_plugin.push(
        PluginAuthorityPair {
            plugin: Plugin::Attributes(Attributes { attribute_list }),
            authority: Some(PluginAuthority::UpdateAuthority)
        }
    );

    ticket_plugin.push(
        PluginAuthorityPair {
            plugin: Plugin::PermanentFreezeDelegate(PermanentFreezeDelegate { frozen: false }),
            authority: Some(PluginAuthority::UpdateAuthority)
        }
    );

    ticket_plugin.push(
        PluginAuthorityPair {
            plugin: Plugin::PermanentBurnDelegate(PermanentBurnDelegate {}),
            authority: Some(PluginAuthority::UpdateAuthority)
        }
    );

    ticket_plugin.push(
        PluginAuthorityPair {
            plugin: Plugin::PermanentTransferDelegate(PermanentTransferDelegate {}),
            authority: Some(PluginAuthority::UpdateAuthority)
        }
    );

    let mut ticket_external_plugin: Vec<ExternalPluginAdapterInitInfo> = vec![];

    ticket_external_plugin.push(ExternalPluginAdapterInitInfo::AppData(
        AppDataInitInfo {
            init_plugin_authority: Some(PluginAuthority::UpdateAuthority),
            data_authority: PluginAuthority::Address{ address: args.venue_authority },
            schema: Some(ExternalPluginAdapterSchema::Binary),
        }
    ));

    let signer_seeds = &[b"manager".as_ref(), &[ctx.accounts.manager.bump]];

    // 创建门票
    CreateV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
    .asset(&ctx.accounts.ticket.to_account_info())
    .collection(Some(&ctx.accounts.event.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.manager.to_account_info()))
    .owner(Some(&ctx.accounts.signer.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .name(args.name)
    .uri(args.uri)
    .plugins(ticket_plugin)
    .external_plugin_adapters(ticket_external_plugin)
    .invoke_signed(&[signer_seeds])?;

    Ok(())
}
```

**注意**：要使用外部插件，我们需要使用 create 函数的 V2 版本，它允许设置 .external_plugin_adapter 输入。

### 扫描门票指令
扫描门票指令通过在扫描时验证和更新门票状态来完成该过程。

```rust
#[derive(Accounts)]
pub struct ScanTicket<'info> {
   pub owner: Signer<'info>,
   pub signer: Signer<'info>,
   #[account(mut)]
   pub payer: Signer<'info>,
   #[account(
       seeds = [MANAGER_SEEDS.as_bytes()],
       bump = manager.bump
   )]
   pub manager: Account<'info, Manager>,
   #[account(
       mut,
       constraint = ticket.owner == owner.key(),
       constraint = ticket.update_authority == UpdateAuthority::Collection(event.key()),
   )]
   pub ticket: Account<'info, BaseAssetV1>,
   #[account(
       mut,
       constraint = event.update_authority == manager.key(),
   )]
   pub event: Account<'info, BaseCollectionV1>,
   pub system_program: Program<'info, System>,
   #[account(address = MPL_CORE_ID)]
   /// CHECK: This is checked by the address constraint
   pub mpl_core_program: UncheckedAccount<'info>,
}
```

账户结构中的主要区别是：
- 门票账户已经初始化，所以我们可以将其反序列化为 `BaseAssetV1` 资产，在这里我们可以检查 `update_authority` 是活动集合，并且资产的所有者是 `owner` 账户。
- 我们要求 `owner` 和 `venue_authority` 都是签名者，以确保扫描由双方认证且无错误。应用程序将创建一个由 `venue_authority` 部分签名的交易并广播它，以便门票的 `owner` 可以签名并发送它。

在指令中，我们首先进行健全性检查，查看 AppData 插件中是否有任何数据，因为如果有，门票就已经被扫描过了。

之后，我们创建一个 `data` 变量，它由一个表示"Scanned"的 u8 向量组成，我们稍后将其写入 AppData 插件。

我们通过使数字资产成为灵魂绑定来完成指令，这样它在验证后就不能被交易或转移。使其仅成为活动的纪念品。

```rust
pub fn scan_ticket(ctx: Context<ScanTicket>) -> Result<()> {

    let (_, app_data_length) = fetch_external_plugin_adapter_data_info::<BaseAssetV1>(
            &ctx.accounts.ticket.to_account_info(),
            None,
            &ExternalPluginAdapterKey::AppData(
                PluginAuthority::Address { address: ctx.accounts.signer.key() }
            )
        )?;

    require!(app_data_length == 0, TicketError::AlreadyScanned);

    let data: Vec<u8> = "Scanned".as_bytes().to_vec();

    WriteExternalPluginAdapterDataV1CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
    .asset(&ctx.accounts.ticket.to_account_info())
    .collection(Some(&ctx.accounts.event.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .system_program(&ctx.accounts.system_program.to_account_info())
    .key(ExternalPluginAdapterKey::AppData(PluginAuthority::Address { address: ctx.accounts.signer.key() }))
    .data(data)
    .invoke()?;

    let signer_seeds = &[b"manager".as_ref(), &[ctx.accounts.manager.bump]];

    UpdatePluginV1CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
    .asset(&ctx.accounts.ticket.to_account_info())
    .collection(Some(&ctx.accounts.event.to_account_info()))
    .payer(&ctx.accounts.payer.to_account_info())
    .authority(Some(&ctx.accounts.manager.to_account_info()))
    .system_program(&ctx.accounts.system_program.to_account_info())
    .plugin(Plugin::PermanentFreezeDelegate(PermanentFreezeDelegate { frozen: true }))
    .invoke_signed(&[signer_seeds])?;

    Ok(())
}
```

## 结论

恭喜！您现在已经具备使用 AppData 插件创建票务解决方案的能力。如果您想了解更多关于 Core 和 Metaplex 的信息，请查看[开发者中心](/zh/smart-contracts/core/sdk)。
