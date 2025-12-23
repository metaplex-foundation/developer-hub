---
title: 会员卡概念指南
metaTitle: 会员卡概念指南 | Core 指南
description: 本指南描述如何使用 MPL Core NFT Assets 和 MPL Core 插件系统在 Solana 上构建会员卡程序。
---

## 概念指南：使用 Metaplex Core 和插件设置会员卡

{% callout %}

⚠️ 这是一个**概念指南**，不是完整的端到端教程。它适用于对 Rust 和 Solana 有工作理解的开发者，特别是使用 Anchor 框架的开发者。虽然它介绍了关键的架构决策和代码示例，但它假设您熟悉程序结构、CPI 和部署 Solana 智能合约。

{% /callout %}

本指南假设您对使用 Anchor 的 Solana 和 Rust 有一些基本了解。它探索了使用 Solana 上的 Core NFT Assets 实现会员卡系统的一种方式，由 Metaplex Core 提供支持。本指南旨在展示一种灵活的模式，您可以根据自己的项目进行调整，而不是规定一种僵化的方法。

### 什么是 Metaplex Core？
Metaplex Core 是 Solana 上的现代 NFT Asset 标准，提供基于插件的架构。与传统的 Token Metadata 程序不同，Core 允许开发者将模块化功能附加到 NFT 上，例如自定义数据存储、所有权控制和规则执行。

在这个示例中，您将使用 Metaplex Core 的三个组件：
- **AppData 插件**：用于存储自定义结构化数据（如会员积分）。
- **Freeze Delegate 插件**：用于锁定 NFT，使用户无法转移或销毁它们（灵魂绑定行为）。
- **Update Delegate Authority（通过 PDA）**：让您的程序有权更新在特定集合下铸造的子 NFT。

我们还将使用 **CPI builders**（例如 `CreateV2CpiBuilder`）与 Metaplex Core 程序交互。这些构建器简化了您构建和调用指令的方式，使代码更易于阅读和维护。

### 快速生命周期概述
```
[用户] → 请求会员卡
    ↓
[程序] → 铸造 NFT + AppData + FreezeDelegate（灵魂绑定）
    ↓
[用户] → 购买咖啡或兑换积分
    ↓
[程序] → 更新 AppData 插件中的会员数据
```

有关更多设置详情，请参阅 [Metaplex Core 文档](https://developers.metaplex.com/core)。

---

## 会员系统架构

这个示例概述了使用 Solana 区块链上的 Metaplex Core 创建会员卡系统的一种潜在结构。会员卡是 NFT，每个都与管理其行为和存储数据的插件相关联。

### 为什么使用灵魂绑定 NFT Assets？

使会员卡成为灵魂绑定有助于确保它们与单个用户绑定，不能被转移或出售。这有助于保持会员计划的完整性，并防止用户通过交易或复制奖励来作弊。

### LoyaltyCardData 结构

每张会员卡都需要跟踪用户特定的数据，例如他们购买或兑换了多少咖啡。由于 Core NFT 被设计为轻量级和可扩展的，我们使用 AppData 插件以二进制格式直接在 NFT 上存储这些结构化的会员数据。

此插件附加到 NFT 上，只能由铸造期间设置的权限写入——在这种情况下，是每张会员卡派生的 PDA（下面解释）。您的 Solana 程序将在每次获得或兑换印章时写入此插件。

以下是您可能存储的数据结构示例：

```rust
pub struct LoyaltyCardData {
    pub current_stamps: u8,
    pub lifetime_stamps: u64,
    pub last_used: u64,
    pub issue_date: u64,
}

impl LoyaltyCardData {
    pub fn new_card() -> Self {
        let timestamp = clock::Clock::get().unwrap().unix_timestamp as u64;
        LoyaltyCardData {
            current_stamps: 0,
            lifetime_stamps: 0,
            last_used: 0,
            issue_date: timestamp,
        }
    }
}
```

此结构跟踪用户拥有的印章数量、他们总共获得了多少，以及他们的卡何时发行或最后使用。您可以自定义此结构以适应不同的奖励逻辑。

### PDA Collection Delegate

如果您不熟悉 PDA（程序派生地址），可以将它们视为使用一组种子和程序 ID 生成的确定性、程序拥有的地址。这些地址不受私钥控制，而只能由程序本身使用 `invoke_signed` 签名。这使它们非常适合在您的程序逻辑中分配权限或角色。

在这种情况下，**collection delegate** 是使用种子 `[b"collection_delegate"]` 生成的 PDA。它作为您的程序用来管理会员卡集合中任何 NFT 的受信任权限。例如，需要此权限来更新插件数据（如印章）或冻结/解冻 NFT。

这种方法有助于确保只有您的程序——而不是任何外部钱包——可以更新会员卡数据。

Collection Delegate 是一个程序派生地址（PDA），它使您的程序有权更新集合中的所有资产。您可以使用种子 `[b"collection_delegate"]` 生成此 PDA。虽然有其他方法可以管理集合级别的权限，但这是一种常用的模式。

```rust
// 用于生成 PDA 的种子
let seeds = &[b"collection_delegate"];
let (collection_delegate, bump) = Pubkey::find_program_address(seeds, &program_id);

```

### Loyalty Authority PDA（每卡权限）
除了 collection delegate 之外，此模式还为每张会员卡使用唯一的 PDA 作为插件权限。此 PDA 使用卡的公钥作为种子派生：

```rust
// 用于根据每个单独的会员卡 NFT 派生 PDA 的种子
let seeds = &[loyalty_card.key().as_ref()];
let (loyalty_authority, bump) = Pubkey::find_program_address(seeds, &program_id);

```

此 PDA 在铸造期间被设置为 AppData 和 FreezeDelegate 插件的权限。它确保只有您的程序——使用带有正确种子的 invoke_signed——可以修改该特定卡的数据或管理冻结状态。

当您想要细粒度的、特定于资产的控制而不是在单个集中权限下管理所有 NFT 时，使用每卡权限特别有用。

### 步骤 1：创建会员卡集合

此步骤可以使用 Metaplex JS SDK 或 CLI 等工具在链下处理。您可以创建一个代表您的会员计划的集合 NFT（例如，"Sol Coffee 会员卡"）。此集合可以作为单个会员卡 NFT 的父级，为您的程序提供一种高效的管理方式。

将 PDA 分配为集合的更新权限允许您的程序以编程方式发行和修改卡。虽然将此作为 Solana 程序指令实现不是严格必需的，但如果您正在构建用于入职"manager"账户或为多个企业支持白标会员计划的功能，这可能会很有用。

将 PDA 分配为集合的更新权限允许您的程序以编程方式发行和修改卡。这不是严格必需的，但有助于简化控制。

要了解更多关于铸造 Core Collection 的信息，您可以访问[创建 Core Collection](https://developers.metaplex.com/core/collections#creating-a-collection)。


### 步骤 2：铸造灵魂绑定会员卡

当用户加入您的计划时，您可以为他们铸造具有以下特征的会员卡 NFT：

- 属于您的会员集合
- 使用 Freeze Delegate 插件冻结（灵魂绑定）
- 将其状态存储在 AppData 插件中

以下是构建铸造逻辑的一种方式：

```rust
CreateV2CpiBuilder::new(&ctx.accounts.core_program)
    .asset(&ctx.accounts.loyalty_card)
    .name("Sol Coffee Loyalty Card".to_owned())
    .collection(Some(&ctx.accounts.loyalty_card_collection))
    .uri("https://arweave.net/...".to_owned())
    .external_plugin_adapters(vec![
        ExternalPluginAdapterInitInfo::AppData(AppDataInitInfo {
            data_authority: PluginAuthority::Address { address: ctx.accounts.loyalty_authority.key() },
            init_plugin_authority: Some(PluginAuthority::Address { address: ctx.accounts.loyalty_authority.key() }),
            schema: Some(ExternalPluginAdapterSchema::Binary),
        }),
    ])
    .plugins(vec![
        PluginAuthorityPair {
            authority: Some(PluginAuthority::Address { address: ctx.accounts.loyalty_authority.key() }),
            plugin: Plugin::FreezeDelegate(FreezeDelegate { frozen: true }),
        },
    ])
    .owner(Some(&ctx.accounts.signer))
    .payer(&ctx.accounts.signer)
    .authority(Some(&ctx.accounts.collection_delegate))
    .invoke_signed(collection_delegate_seeds)?;
```

### 步骤 3：在购买期间更新会员卡数据

当客户进行购买或兑换奖励时，您需要相应地更新他们会员卡的数据。在这个示例中，该行为由从前端或客户端作为参数传递给指令的 `redeem` 标志控制。此标志确定用户是兑换积分换取免费物品还是进行常规购买。以下是基于该 `redeem` 标志使用 `match` 语句的一种方法：

- 如果 `redeem = true`，您检查用户是否有足够的积分并扣除它们。
- 如果 `redeem = false`，您转移 lamports（SOL）并添加一个印章。

在两种情况下，您都更新 `last_used` 时间戳并将更新的结构写回 AppData 插件。

```rust
match redeem {
    true => {
        if loyalty_card_data.current_stamps < COST_OF_COFFEE_IN_POINTS {
            return Err(LoyaltyProgramError::NotEnoughPoints.into());
        }
        loyalty_card_data.current_stamps -= COST_OF_COFFEE_IN_POINTS;
    }
    false => {
        invoke(
            &system_instruction::transfer(
                &ctx.accounts.signer.key(),
                &ctx.accounts.destination_account.key(),
                COST_OF_COFFEE_IN_LAMPORTS,
            ),
            &[ctx.accounts.signer.to_account_info(), ctx.accounts.destination_account.to_account_info()],
        )?;

        if loyalty_card_data.current_stamps < MAX_POINTS {
            loyalty_card_data.current_stamps += 1;
        }
        loyalty_card_data.lifetime_stamps += 1;
    }
}

loyalty_card_data.last_used = clock::Clock::get().unwrap().unix_timestamp as u64;

let binary = bincode::serialize(&loyalty_card_data).unwrap();

WriteExternalPluginAdapterDataV1CpiBuilder::new(&ctx.accounts.core_program)
    .asset(&ctx.accounts.loyalty_card)
    .key(ExternalPluginAdapterKey::AppData(PluginAuthority::Address { address: ctx.accounts.loyalty_authority.key() }))
    .data(binary)
    .invoke_signed(seeds)?;
```

## 总结

本指南介绍了使用 Metaplex Core 的会员卡系统的概念实现。我们探讨了如何：

- 为会员卡创建集合 NFT

- 使用 AppData 和 FreezeDelegate 等插件来存储数据并使 NFT 成为灵魂绑定

- 分配 PDA 权限以允许您的程序控制会员卡

- 处理用户交互，如获得和兑换积分

此结构在您的程序逻辑、用户交互和每张会员卡的状态之间提供了清晰的关注点分离。

## 扩展功能的想法

一旦您有了基础，以下是一些您可能探索的方向，使您的会员系统更强大或更具吸引力：

- **分层奖励**：根据终身印章引入多个奖励级别（例如，银、金、铂金）。

- **过期逻辑**：为印章或卡添加过期窗口，鼓励持续参与。

- **跨店使用**：允许会员卡在您品牌内的多个店铺或商家使用。

- **自定义徽章或元数据**：动态更新 NFT 元数据以显示进度的可视化表示。

- **通知或钩子**：集成链下系统，通知用户获得的奖励或会员里程碑。

通过将 Metaplex Core 的插件系统与您自己的创造力相结合，您可以构建一个真正有价值且独特的会员平台。

此模式提供了一种灵活、模块化的方法来管理链上会员系统。您可以自定义和扩展此方法以符合您程序的特定目标。
