---
title: 技术描述
metaTitle: 技术描述 | 固定价格销售
description: 固定价格销售程序的技术描述
---

## 创作者出售物品需要:

1. 创建商店

    - 这是必要的,因为我们必须以某种方式过滤市场

    - 它将包含名称、管理员密钥、描述

2. 初始化销售资源。它可以是创建的资源,或者我们的平台将创建它。

    - 一旦用户初始化销售资源,我们就有了一个包含我们可以出售的资源的对象

3. 创建市场

    - 创建包含有关销售物品信息的对象,除了最大供应量之外的所有内容,因为我们在销售资源中定义了它

## 用户购买代币需要:

1. 进入商店。

2. 选择代币并点击"购买"

    - 在幕后将发生以下事情:

        - 将创建 TradeHistory 账户,我们在其中跟踪此用户已购买的代币数量

        - 借记和贷记操作

        - 创建新 NFT(创建铸造、铸造代币、创建元数据、创建 MasterEdition)

3. 代币将显示在他们的钱包中

# 账户

## Store

| 字段      | 类型 |描述|
| ----------- | ----------- | ------ |
| admin      | `Pubkey`       | 可以在特定商店中创建销售资源和市场的管理员密钥       |
|  name  |  `String`  |   |
|  description  |  `String`  |   |

## Selling resource

| 字段      | 类型 |描述|
| ----------- | ----------- | ------ |
|  store  |  `Pubkey`  |    |
|  owner  |  `Pubkey`  |  资源的所有者。此账户可以在销售结束后收回资源  |
|  resource  |  `Pubkey`  |  附加了元数据的铸造账户。我们不需要存储元数据密钥,因为它是 PDA,我们可以通过知道铸造密钥来计算它  |
|  vault  |  `Pubkey`  |  持有 MasterEdition 的代币账户  |
|  vault_owner  |  `Pubkey`  |  PDA,种子为 ["mt_vault", resource.key(), store.key()]  |
|  supply  |  `u64`  |  已售出的代币数量  |
|  max_supply  |  `Option<u64>`  |  可以出售的代币最大数量  |
|  state  |  `Enum{Uninitialised, Created, InUse, Exhausted, Stoped,}`  |  资源状态  |

## Market

| 字段      | 类型 |描述|
| ----------- | ----------- | ------ |
|  store  |  `Pubkey`  |    |
|  selling_resource  |  `Pubkey`  |    |
|  treasury_mint  |  `Pubkey`  |  市场将接受作为付款的代币的铸造账户  |
|  treasury_holder  |  `Pubkey`  |  买家将发送代币的代币账户。只有市场所有者可以提取资产  |
|  treasury_owner  |  `Pubkey`  |  PDA["holder", treasury_mint.key(), selling_resource.key()]  |
|  owner  |  `Pubkey`  |  市场所有者  |
|  name  |  `String`  |    |
|  description  |  `String`  |    |
|  mutable  |  `bool`  |    |
|  price  |  `u64`  |    |
|  pieces_in_one_wallet  |  `Option<u64>`  |  我们可以向一个钱包出售多少代币  |
|  start_date  |  `u64`  |    |
|  end_date  |  `Option<u64>`  |    |
|  state  |  `Enum {Uninitialised, Created, Active, Ended,}`  |    |
|  funds_collected  |  `u64`  |    |

## TradeHistory

### PDA ["history", wallet.key(), market.key()]

| 字段      | 类型 |描述|
| ----------- | ----------- | ------ |
|  market  |  `Pubkey`  |    |
|  wallet  |  `Pubkey`  |    |
|  already_bought  |  `u64`  |  用户已从特定市场购买的代币数量  |

## PrimaryMetadataCreators

### PDA ["primary_creators", metadata.key()]

| 字段      | 类型 |描述|
| ----------- | ----------- | ------ |
|  creators  |  `Vec<mpl_token_metadata::state::Creator>`  |  接收主要销售版税的创作者列表  |

# 指令

## CreateStore

创建新的 Store 账户。

| 参数      | 类型 |描述|
| ----------- | ----------- | ------ |
|  admin  |  Key, Signer, Writable  |    |
|  store  |  Key, Signer, Writable  |  未初始化的账户  |
|  name  |  `String`  |    |
|  description  |  `String`  |    |

## InitSellingResource

初始化将由 Market 使用的 SellingResource 账户。

| 参数      | 类型 |描述|
| ----------- | ----------- | ------ |
|  store  |  Key  |    |
|  store_admin  |  Key, Signer, Writable  |  持有 resource_token 并支付创建 selling_resource 账户的费用  |
|  selling_resource  |  Key, Signer, Writable  |  未初始化的账户  |
|  selling_resource_owner  |  Key  |  可以在销售结束后提取 MasterEdition 的密钥  |
|  resource_mint  |  Key  |  附加了元数据的铸造账户  |
|  master_edition  |  Key  |  PDA,种子为 ["metadata", tokenMetadataProgramID, resource_mint, "edition"]  |
|  metadata  |  Key  |  主版的元数据  |
|  vault  |  Key, Writable  |  持有资源的代币账户  |
|  vault_owner  |  PDA ["mt_vault", resource_mint.key(), store.key()]  |  保险库代币账户的所有者  |
|  resource_token  |  Key, Writable  |  持有来自 resource_mint 的代币的用户代币账户  |
|  max_supply  |  `Option<u64>`  |  要出售的代币最大数量  |

## CreateMarket

初始化 Market 账户。将状态设置为 Created,这意味着所有者可以在激活之前更改一些数据,当然如果 Market 标记为可变的话。

:::warning

如果用户想以原生 SOL 出售艺术品,应将 `treasury_mint` 设置为 `11111111111111111111111111111111`,并且 treasury_holder 和 treasury_owner 应该是相同的账户 PDA。出于安全原因,这是必要的,因此只有程序才能花费该 SOL。

:::

| 参数      | 类型 |描述|
| ----------- | ----------- | ------ |
|  market  |  Key, Signer, Writable  |  未初始化的账户  |
|  store  |  Key  |    |
|  selling_resource_owner  |  Key, Signer, Writable  |    |
|  selling_resource  |  Key, Writable  |    |
|  treasury_mint  |  Key  |  我们将作为付款接受的资产的铸造  |
|  treasury_holder  |  Key  |  代币账户  |
|  treasury_owner  |  PDA ["holder", treasury_mint.key(), selling_resource.key()]  |    |
|  name  |  `String`  |    |
|  description  |  `String`  |    |
|  mutable  |  `bool`  |    |
|  price  |  `u64`  |    |
|  pieces_in_one_wallet  |  `Option<u64>`  |    |
|  start_date  |  `u64`  |    |
|  end_date  |  `Option<u64>`  |    |
|  gating_config  |  `Option<GatingConfig{collection: Pubkey, expire_on_use: bool, gating_time: Option<u64>}>`  |  控制代币。如果设置此值,只有来自指定集合的 NFT 用户才能从市场购买新 NFT。  |

## ChangeMarket

仅在 Market::mutable == true 时可用。可以更改: name、description、mutable、price、pieces_in_one_wallet。

| 参数      | 类型 |描述|
| ----------- | ----------- | ------ |
|  market  |  Key, Writable  |    |
|  market_owner  |  Key, Signer  |    |
|  new_name  |  `Option<String>`  |    |
|  new_description  |  `Option<String>`  |    |
|  mutable  |  `Option<bool>`  |    |
|  new_price  |  `Option<u64>`  |    |
|  new_pieces_in_one_wallet  |  `Option<u64>`  |    |

## Buy

用户只能在当前日期 > Market::start_date 时调用。

:::warning

如果用户以原生 SOL 购买艺术品,user_token_acc 和 user_wallet 账户应该相同。

:::

| 参数      | 类型 |描述|
| ----------- | ----------- | ------ |
|  market  |  Key, Writable  |    |
|  selling_resource  |  Key, Writable  |    |
|  user_token_acc  |  Key, Writable  |  用于支付会员代币的代币账户。此代币账户的铸造应该 == treasury_mint  |
|  user_wallet  |  Key, Signer, Writable  |    |
|  trade_history  |  Key, Writable  |  用于跟踪用户已购买多少 NFT 的账户  |
|  treasury_holder  |  Key, Writable  |    |
|  new_metadata_acc  |  Key, Writable  |    |
|  new_edition_acc  |  Key, Writable  |    |
|  master_edition_acc  |  Key, Writable  |    |
|  new_mint  |  Key, Writable  |    |
|  edition_marker  |  Key, Writable  |  PDA,种子可以在 token-metadata 程序中找到  |
|  vault  |  Key  |    |
|  vault_owner  |  PDA ["mt_vault", resource.key(), store.key()]  |    |
|  master_edition_metadata  |  Key  |    |
|    |  以下账户是可选的,仅在启用控制功能时才应传递 ↓  |    |
|  user_collection_token_account  |  Key, Writable  |  用户来自集合的代币账户  |
|  token_account_mint  |  Key, Writable  |  代币的铸造账户  |
|  metadata_account  |  Key  |  上述铸造的元数据账户  |

## SuspendMarket

暂停市场,使没有人可以购买物品,市场所有者可以更改数据。仅当 Market::mutable == true 时,指令才应可用,因为在其他情况下没有理由暂停它。

| 参数      | 类型 |描述|
| ----------- | ----------- | ------ |
|  market  |  Key, Writable  |    |
|  market_owner  |  Key, Signer  |    |
|  clock  |  Key  |    |

## ResumeMarket

在市场被暂停后恢复市场的指令。只能在市场处于暂停状态时调用。

| 参数      | 类型 |描述|
| ----------- | ----------- | ------ |
|  market  |  Key, Writable  |    |
|  market_owner  |  Key, Signer  |    |
|  clock  |  Key  |    |

## CloseMarket

仅当 Market 以无限持续时间创建时才能调用此指令。

| 参数      | 类型 |描述|
| ----------- | ----------- | ------ |
|  market  |  Key, Writable  |    |
|  market_owner  |  Key, Signer  |    |
|  clock  |  Key  |    |

## Withdraw

由 Market 所有者调用以提取收集的金库资金。仅在 Market::state == Ended 时可用。

| 参数      | 类型 |描述|
| ----------- | ----------- | ------ |
|  market  |  Key  |    |
|  selling_resource  |  Key  |    |
|  metadata  |  Key  |    |
|  treasury_holder  |  Key, Writable  |  Market::treasury_holder。持有销售期间从用户收到的所有代币的代币账户  |
|  treasury_mint  |  Key  |    |
|  funder  |  Key  |    |
|  payer  |  Key, Signer  |    |
|  payout_ticket  |  Key, Writable  |  PDA["payout_ticket", market.key(), funder.key()]  |
|  treasury_owner  |  Key  |  PDA["holder", treasury_mint.key(), selling_resource.key()]  |
|  destination  |  Key, Writable  |  转移代币到的代币账户  |
|    |  以下账户是可选的,仅在主要销售期间才应传递 ↓  |    |
|  primary_metadata_creators_data  |  Key  |  应从主要销售中获得版税的创作者列表  |

## ClaimResource

由 Resource 所有者调用。仅在 SellingResource::state == Exhausted 或 Market::state == Ended 时可用。

| 参数      | 类型 |描述|
| ----------- | ----------- | ------ |
|  market  |  Key  |    |
|  treasury_holder  |  Key  |    |
|  selling_resource  |  Key  |    |
|  selling_resource_owner  |  Key, Signer  |    |
|  source  |  Key, Writable  |  SellingResource::vault。持有主版的代币账户  |
|  metadata  |  Key  |  已出售代币的元数据  |
|  vault_owner  |  Key  |  PDA,种子为 ["mt_vault", resource.key(), store.key()]  |
|  secondary_metadata_creators  |  Key  |    |
|  destination  |  Key, Writable  |  转移主版到的代币账户  |

## SavePrimaryMetadataCreators

在创建市场之前调用。此创作者列表将在提取指令中用于分配版税。请注意,如果您要从 `primary_sale_happen = true` 的主版出售 NFT,则不需要调用此指令。

| 参数      | 类型 |描述|
| ----------- | ----------- | ------ |
|  admin  |  Key, Signer, Writable  |  元数据的更新权限  |
|  metadata  |  Key, Writable  |    |
|  primary_metadata_creators  |  Key, Writable  |  PDA,种子为 ["primary_creators", metadata.key()]  |
|  system_program  |  Key  |    |
|  primary_metadata_creators  |  `u8`  |  primary_metadata_creators 密钥 bump  |
|  creators  |  `Vec<mpl_token_metadata::state::Creator>`  |  将获得主要版税的创作者列表  |
