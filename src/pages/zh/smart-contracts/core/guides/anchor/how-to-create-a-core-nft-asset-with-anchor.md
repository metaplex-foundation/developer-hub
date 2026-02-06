---
title: 如何使用Anchor创建Core NFT Asset
metaTitle: 如何使用Anchor创建Core NFT Asset | Core指南
description: 学习如何使用Anchor在Solana上通过Metaplex Core创建Core NFT Asset！
created: '06-16-2024'
updated: '01-31-2026'
keywords:
  - Anchor NFT
  - create NFT Rust
  - CPI mpl-core
  - Solana program NFT
about:
  - Anchor framework
  - CPI integration
  - On-chain minting
proficiencyLevel: Intermediate
programmingLanguage:
  - Rust
howToSteps:
  - 设置Anchor项目并添加mpl-core依赖
  - 定义创建Asset的指令账户
  - 构建对Core程序的CPI调用
  - 在devnet上部署和测试您的程序
howToTools:
  - Anchor framework
  - mpl-core Rust crate
  - Solana CLI
---
本指南将演示如何使用`mpl-core` Rust SDK crate在**Solana**程序中通过**Anchor**框架以CPI方式创建**Core NFT Asset**。
{% callout title="什么是Core？" %}
**Core**使用单账户设计，与替代方案相比降低了铸造成本并改善了Solana网络负载。它还具有灵活的插件系统，允许开发者修改Asset的行为和功能。
{% /callout %}
在开始之前，让我们先了解Asset：
{% callout title="什么是Asset？" %}
与现有的Asset程序（如Solana的Token程序）不同，Metaplex Core和Core NFT Asset（有时称为Core NFT Asset）不依赖于多个账户，如Associated Token Account。相反，Core NFT Asset将钱包与"mint"账户之间的关系存储在Asset本身中。
{% /callout %}
## 前提条件
- 您选择的代码编辑器（推荐使用带有**Rust Analyzer插件**的**Visual Studio Code**）
- Anchor **0.30.1**或更高版本。
## 初始设置
在本指南中，我们将使用**Anchor**，采用单文件方法，其中所有必要的宏都可以在`lib.rs`文件中找到：
- `declare_id`：指定程序的链上地址。
- `#[program]`：指定包含程序指令逻辑的模块。
- `#[derive(Accounts)]`：应用于结构体，表示指令所需的账户列表。
- `#[account]`：应用于结构体，创建特定于程序的自定义账户类型。
**注意**：您可能需要根据自己的需要修改和移动函数。
### 初始化程序
首先使用`avm`（Anchor版本管理器）初始化一个新项目（可选）。要初始化它，请在终端中运行以下命令：
```
anchor init create-core-asset-example
```
### 所需Crate
在本指南中，我们将使用启用了`anchor`功能的`mpl_core` crate。要安装它，首先导航到`create-core-asset-example`目录：
```
cd create-core-asset-example
```
然后运行以下命令：
```
cargo add mpl-core --features anchor
```
## 程序
### 导入和模板
这里我们将定义本指南的所有导入，并在`lib.rs`文件中创建Account结构体和指令的模板。
```rust
use anchor_lang::prelude::*;
use mpl_core::{
    ID as MPL_CORE_ID,
    accounts::BaseCollectionV1,
    instructions::CreateV2CpiBuilder,
};
declare_id!("C9PLf3qMCVqtUCJtEBy8NCcseNp3KTZwFJxAtDdN1bto");
#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateAssetArgs {
}
#[program]
pub mod create_core_asset_example {
    use super::*;
    pub fn create_core_asset(ctx: Context<CreateAsset>, args: CreateAssetArgs) -> Result<()> {
        Ok(())
    }
}
#[derive(Accounts)]
pub struct CreateAsset<'info> {
}
```
### 创建Args结构体
为了保持函数的组织性并避免过多参数造成的混乱，标准做法是通过结构化格式传递所有输入。这通过定义参数结构体（`CreateAssetArgs`）并派生`AnchorDeserialize`和`AnchorSerialize`来实现，这允许结构体使用NBOR序列化为二进制格式，使其可被**Anchor**读取。
```rust
#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateAssetArgs {
    name: String,
    uri: String,
}
```
在这个`CreateAssetArgs`结构体中，**name**和**uri**字段作为输入提供，它们将作为用于创建**Core NFT Asset**的`CreateV2CpiBuilder`指令的参数。
**注意**：由于这是一个专注于Anchor的指南，我们不会在这里介绍如何创建Uri。如果您不确定如何操作，请参考[此示例](/smart-contracts/core/guides/javascript/how-to-create-a-core-nft-asset-with-javascript#creating-the-metadata-for-the-asset)
### 创建Account结构体
`Account`结构体是我们定义指令期望的账户以及指定这些账户必须满足的约束的地方。这通过两个关键构造来完成：**类型**和**约束**。
**账户类型**
每种类型在您的程序中都有特定的用途：
- **Signer**：确保账户已签署交易。
- **Option**：允许可能提供或不提供的可选账户。
- **Program**：验证账户是特定程序。
**约束**
虽然账户类型处理基本验证，但它们不足以满足程序可能需要的所有安全检查。这就是约束发挥作用的地方。
约束添加了额外的验证逻辑。例如，`#[account(mut)]`约束确保`asset`和`payer`账户被设置为可变的，这意味着在指令执行期间可以修改这些账户中的数据。
```rust
#[derive(Accounts)]
pub struct CreateAsset<'info> {
    #[account(mut)]
    pub asset: Signer<'info>,
    #[account(mut)]
    pub collection: Option<Account<'info, BaseCollectionV1>>,
    pub authority: Option<Signer<'info>>,
    #[account(mut)]
    pub payer: Signer<'info>,
    /// CHECK: this account will be checked by the mpl_core program
    pub owner: Option<UncheckedAccount<'info>>,
    /// CHECK: this account will be checked by the mpl_core program
    pub update_authority: Option<UncheckedAccount<'info>>,
    pub system_program: Program<'info, System>,
    #[account(address = MPL_CORE_ID)]
    /// CHECK: this account is checked by the address constraint
    pub mpl_core_program: UncheckedAccount<'info>,
}
```
`CreateAsset`结构体中的某些账户被标记为`optional`。这是因为在`CreateV2CpiBuilder`的定义中，某些账户可以省略。
```rust
/// ### Accounts:
///
///   0. `[writable, signer]` asset
///   1. `[writable, optional]` collection
///   2. `[signer, optional]` authority
///   3. `[writable, signer]` payer
///   4. `[optional]` owner
///   5. `[optional]` update_authority
///   6. `[]` system_program
```
为了使示例尽可能灵活，程序指令中的每个`optional`账户在`create_core_asset`指令的账户结构体中也被视为`optional`。
### 创建指令
`create_core_asset`函数利用我们之前定义的`CreateAsset`账户结构体和`CreateAssetArgs`参数结构体的输入来与`CreateV2CpiBuilder`程序指令交互。
```rust
pub fn create_core_asset(ctx: Context<CreateAsset>, args: CreateAssetArgs) -> Result<()> {
  let collection = match &ctx.accounts.collection {
    Some(collection) => Some(collection.to_account_info()),
    None => None,
  };
  let authority = match &ctx.accounts.authority {
    Some(authority) => Some(authority.to_account_info()),
    None => None,
  };
  let owner = match &ctx.accounts.owner {
    Some(owner) => Some(owner.to_account_info()),
    None => None,
  };
  let update_authority = match &ctx.accounts.update_authority {
    Some(update_authority) => Some(update_authority.to_account_info()),
    None => None,
  };

  CreateV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
    .asset(&ctx.accounts.asset.to_account_info())
    .collection(collection.as_ref())
    .authority(authority.as_ref())
    .payer(&ctx.accounts.payer.to_account_info())
    .owner(owner.as_ref())
    .update_authority(update_authority.as_ref())
    .system_program(&ctx.accounts.system_program.to_account_info())
    .name(args.name)
    .uri(args.uri)
    .invoke()?;
  Ok(())
    }
```
在这个函数中，`CreateAsset`结构体中定义的账户通过`ctx.accounts`访问。在将这些账户传递给`CreateV2CpiBuilder`程序指令之前，需要使用`.to_account_info()`方法将它们转换为原始数据形式。
这种转换是必要的，因为构建器需要以这种格式的账户来正确与Solana运行时交互。
`CreateAsset`结构体中的某些账户是`optional`的，意味着它们的值可能是`Some(account)`或`None`。为了在将这些可选账户传递给构建器之前处理它们，我们使用match语句来检查账户是存在（Some）还是不存在（None），并根据此检查，如果存在则绑定为`Some(account.to_account_info())`，如果不存在则绑定为`None`。如下所示：
```rust
let collection = match &ctx.accounts.collection {
  Some(collection) => Some(collection.to_account_info()),
  None => None,
};
```
**注意**：如您所见，这种方法对于其他可选账户如`authority`、`owner`和`update_authority`也是重复的。
准备好所有必要的账户后，我们将它们传递给`CreateV2CpiBuilder`并使用`.invoke()`来执行指令，如果需要使用签名者种子则使用`.invoke_signed()`。
有关Metaplex CPI Builder工作原理的更多详细信息，您可以参考此[文档](/guides/rust/how-to-cpi-into-a-metaplex-program#using-metaplex-rust-transaction-cpi-builders)
### 附加操作
在继续之前，如果我们想在创建Asset时就包含插件和/或外部插件，例如`FreezeDelegate`插件或`AppData`外部插件呢？以下是我们如何实现。
首先，让我们添加所有必要的额外导入：
```rust
use mpl_core::types::{
    Plugin, FreezeDelegate, PluginAuthority,
    ExternalPluginAdapterInitInfo, AppDataInitInfo,
    ExternalPluginAdapterSchema
};
```
然后让我们创建向量来保存插件和外部插件适配器，这样我们可以使用正确的导入轻松添加插件（或更多）：
```rust
let mut plugins: Vec<PluginAuthorityPair> = vec![];
plugins.push(
  PluginAuthorityPair {
      plugin: Plugin::FreezeDelegate(FreezeDelegate {frozen: true}),
      authority: Some(PluginAuthority::UpdateAuthority)
  }
);
let mut external_plugin_adapters: Vec<ExternalPluginAdapterInitInfo> = vec![];

external_plugin_adapters.push(
  ExternalPluginAdapterInitInfo::AppData(
    AppDataInitInfo {
      init_plugin_authority: Some(PluginAuthority::UpdateAuthority),
      data_authority: PluginAuthority::Address{ address: data_authority },
      schema: Some(ExternalPluginAdapterSchema::Binary),
    }
  )
);
```
最后，让我们将这些插件集成到`CreateV2CpiBuilder`程序指令中，如下所示：
```rust
CreateV2CpiBuilder::new(&ctx.accounts.mpl_core_program.to_account_info())
  .asset(&ctx.accounts.asset.to_account_info())
  .collection(collection.as_ref())
  .authority(authority.as_ref())
  .payer(&ctx.accounts.payer.to_account_info())
  .owner(owner.as_ref())
  .update_authority(update_authority.as_ref())
  .system_program(&ctx.accounts.system_program.to_account_info())
  .name(args.name)
  .uri(args.uri)
  .plugins(plugins)
  .external_plugin_adapters(external_plugin_adapters)
  .invoke()?;
```
**注意**：如果您不确定应该使用哪些字段和插件，请参考[文档](/smart-contracts/core/plugins)！
## 客户端
我们现在已经到达创建Core Collection指南的"测试"部分。但在测试我们构建的程序之前，我们需要编译工作区。使用以下命令构建所有内容，使其准备好进行部署和测试：
```
anchor build
```
构建完成后，我们应该部署程序，以便我们可以通过脚本访问它。我们可以在`anchor.toml`文件中设置要部署程序的集群，然后使用以下命令：
```
anchor deploy
```
最后我们准备好测试程序了，但在此之前，我们需要处理tests文件夹中的`create-core-asset-example.ts`。
### 导入和模板
以下是测试所需的所有导入和通用模板。
```ts
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { CreateCoreAssetExample } from "../target/types/create_core_asset_example";
import { Keypair, SystemProgram } from "@solana/web3.js";
import { MPL_CORE_PROGRAM_ID } from "@metaplex-foundation/mpl-core";
describe("create-core-asset-example", () => {
  anchor.setProvider(anchor.AnchorProvider.env());
  const wallet = anchor.Wallet.local();
  const program = anchor.workspace.CreateCoreAssetExample as Program<CreateCoreAssetExample>;
  let asset = Keypair.generate();
  it("Create Asset", async () => {
  });
});
```
### 创建测试函数
在测试函数中，我们将定义`createAssetArgs`结构体，然后将所有必要的账户传递给`createCoreAsset`函数。
```ts
it("Create Asset", async () => {
  let createAssetArgs = {
    name: 'My Asset',
    uri: 'https://example.com/my-asset.json',
  };
  const createAssetTx = await program.methods.createCoreAsset(createAssetArgs)
    .accountsPartial({
      asset: asset.publicKey,
      collection: null,
      authority: null,
      payer: wallet.publicKey,
      owner: null,
      updateAuthority: null,
      systemProgram: SystemProgram.programId,
      mplCoreProgram: MPL_CORE_PROGRAM_ID
    })
    .signers([asset, wallet.payer])
    .rpc();
  console.log(createAssetTx);
});
```
我们首先调用`createCoreAsset`方法并传入我们刚创建的`createAssetArgs`结构体作为输入：
```ts
await program.methods.createCoreAsset(createAssetArgs)
```
接下来，我们指定函数所需的所有账户。由于其中一些账户是`optional`的，为了简单起见，我们可以在不需要该账户的地方传入`null`：
```ts
.accountsPartial({
  asset: asset.publicKey,
  collection: null,
  authority: null,
  payer: wallet.publicKey,
  owner: null,
  updateAuthority: null,
  systemProgram: SystemProgram.programId,
  mplCoreProgram: MPL_CORE_PROGRAM_ID
})
```
最后，我们提供签名者并使用`.rpc()`方法发送交易：
```ts
.signers([asset, wallet.payer])
.rpc();
```
