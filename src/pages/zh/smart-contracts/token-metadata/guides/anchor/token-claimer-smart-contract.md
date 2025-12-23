---
title: 如何创建利用 Merkle 树的代币领取智能合约
metaTitle: 如何创建代币领取智能合约 | Token Metadata 指南
description: 学习如何在 Solana 上使用 Anchor 创建利用 Merkle 树的代币领取智能合约！
# 记得同时更新 /components/guides/index.js 中的日期
created: '01-13-2025'
updated: '01-13-2025'
---

本指南利用 Merkle 树和压缩技术，使用 Anchor 为 Token Metadata 代币创建低成本的代币领取器。

## 前提条件

在开始学习代币领取器如何工作之前，我们应该先了解压缩和 Merkle 树的工作原理，以真正理解智能合约内部发生了什么。

### Merkle 树

Merkle 树是一种二叉树，用于有效地表示一组数据。树中的每个叶节点都是单个数据（例如地址和代币数量）的哈希。父节点是通过对子节点对进行哈希创建的，一直向上到达根节点，根节点作为整个数据集的紧凑且防篡改的表示。

**示例**：假设我们有四个数据条目：A、B、C 和 D。Merkle 树结构构建如下：

- **叶节点**：每个条目都被哈希：
```
Hash(A), Hash(B), Hash(C), Hash(D)
```

- **父节点**：叶节点对被组合并哈希：
```
Parent1 = Hash(Hash(A) + Hash(B))
Parent2 = Hash(Hash(C) + Hash(D))
```

- **根节点**：从父节点计算最终哈希：
```
Root = Hash(Parent1 + Parent2)
```

{% diagram %}

{% node #root label="根节点" theme="slate" /%}
{% node #root-hash label="哈希" parent="root" x="56" y="40" theme="transparent" /%}
{% node #node-1 label="节点 1" parent="root" y="100" x="-200" theme="blue" /%}
{% node #node-1-hash label="哈希" parent="node-1" x="42" y="40" theme="transparent" /%}
{% node #node-2 label="节点 2" parent="root" y="100" x="200" theme="mint" /%}

{% node #node-3 label="节点 3" parent="node-1" y="100" x="-100" theme="mint" /%}
{% node #node-4 label="节点 4" parent="node-1" y="100" x="100" theme="blue" /%}
{% node #node-4-hash label="哈希" parent="node-4" x="42" y="40" theme="transparent" /%}
{% node #node-5 label="节点 5" parent="node-2" y="100" x="-100" /%}
{% node #node-6 label="节点 6" parent="node-2" y="100" x="100" /%}

{% node #leaf-1 label="叶 1" parent="node-3" y="100" x="-45" /%}
{% node #leaf-2 label="叶 2" parent="node-3" y="100" x="55" /%}
{% node #leaf-3 label="叶 3" parent="node-4" y="100" x="-45" theme="blue" /%}
{% node #leaf-4 label="叶 4" parent="node-4" y="100" x="55" theme="mint" /%}
{% node #leaf-5 label="叶 5" parent="node-5" y="100" x="-45" /%}
{% node #leaf-6 label="叶 6" parent="node-5" y="100" x="55" /%}
{% node #leaf-7 label="叶 7" parent="node-6" y="100" x="-45" /%}
{% node #leaf-8 label="叶 8" parent="node-6" y="100" x="55" /%}
{% node #nft label="NFT 数据" parent="leaf-3" y="100" x="-12" theme="blue" /%}

{% node #proof-1 label="叶 4" parent="nft" x="200" theme="mint" /%}
{% node #proof-2 label="节点 3" parent="proof-1" x="90" theme="mint" /%}
{% node #proof-3 label="节点 2" parent="proof-2" x="97" theme="mint" /%}
{% node #proof-legend label="证明" parent="proof-1" x="-6" y="-20" theme="transparent" /%}

{% edge from="node-1" to="root" fromPosition="top" toPosition="bottom" theme="blue" animated=true /%}
{% edge from="node-2" to="root" fromPosition="top" toPosition="bottom" theme="mint" animated=true /%}

{% edge from="node-3" to="node-1" fromPosition="top" toPosition="bottom" theme="mint" animated=true /%}
{% edge from="node-4" to="node-1" fromPosition="top" toPosition="bottom" theme="blue" animated=true /%}
{% edge from="node-6" to="node-2" fromPosition="top" toPosition="bottom" /%}
{% edge from="node-5" to="node-2" fromPosition="top" toPosition="bottom" /%}

{% edge from="leaf-1" to="node-3" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-2" to="node-3" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-4" to="node-4" fromPosition="top" toPosition="bottom" theme="mint" animated=true /%}
{% edge from="leaf-3" to="node-4" fromPosition="top" toPosition="bottom" theme="blue" animated=true /%}
{% edge from="leaf-5" to="node-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-6" to="node-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-7" to="node-6" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-8" to="node-6" fromPosition="top" toPosition="bottom" /%}
{% edge from="nft" to="leaf-3" fromPosition="top" toPosition="bottom" theme="blue" animated=true label="哈希" /%}

{% /diagram %}

Merkle 树是链上压缩的基石，能够实现高效和安全的数据验证。根据设计，更改数据集的任何部分都会使根无效，这意味着可以通过仅在链上存储 Merkle 根并提供 Merkle 证明（重建根所需的最小兄弟哈希集）来验证特定条目的完整性。

- **主要优势**：成本高效的存储：仅在链上存储 Merkle 根（32 字节），大大降低存储成本。通过将 Merkle 证明作为输入来实现验证。
- **可扩展性**：证明大小随条目数量呈对数增长，使此方法非常适合管理大型数据集。
- **隐私和效率**：整个 Merkle 树可以在链下生成和管理，保持完整数据集的隐私。像压缩 NFT 这样的程序使用这种方法与 Solana 的 noop 程序配合，在保持隐私的同时优化性能。

### 并发 Merkle 树

Solana 的状态压缩采用了一种独特类型的 Merkle 树，允许对树进行多次更改，同时保持其完整性和有效性。

这种专门的树称为并发 Merkle 树，维护一个链上变更日志，允许对同一棵树进行多次快速更新（例如，全部在同一区块内）而不会使证明失效。

此功能在 Solana 上至关重要，因为每个账户每个区块只允许一个写入者。这将更新限制为每个区块一次更改，因此运行时可以确保账户的安全性并防止损坏。由于每个操作都需要写入，并发 Merkle 树为在同一区块内无缝管理多次更新提供了有效的解决方案。

## 设置

- 您选择的代码编辑器（推荐带有 **Rust Analyzer 插件** 的 **Visual Studio Code**）
- Anchor **0.30.1** 或更高版本。

此外，在本指南中，我们将利用 **Anchor** 的单文件方法，所有必要的宏都可以在 `lib.rs` 文件中找到：
- `declare_id`：指定程序的链上地址。
- `#[program]`：指定包含程序指令逻辑的模块。
- `#[derive(Accounts)]`：应用于结构体以指示指令所需的账户列表。
- `#[account]`：应用于结构体以创建特定于程序的自定义账户类型。

**注意**：您可能需要修改和移动函数以适应您的需求。

### 初始化程序

首先使用 `avm`（Anchor Version Manager）初始化一个新项目（可选）。要初始化它，在终端中运行以下命令

```
anchor init token-claimer-example
```

### 所需 Crate

在本指南中，我们将使用 `svm_merkle_tree` crate，这是一个为 SVM 创建和管理 merkle 树的优化版本。要安装它，首先导航到 `token-claimer-example` 目录：

```
cd token-claimer-example
```

然后运行以下命令安装 merkle tree crate：

```
cargo add svm-merkle-tree --git https://github.com/deanmlittle/svm-merkle-tree
```

然后运行以下命令安装 anchor-spl 以与 Token Program 交互：

```
cargo add anchor-spl
```

## 程序

{% callout %}

此示例不是适合生产的完整实现。要使其适合生产，需要几个额外的组件和考虑：

- **事件发射**：使用 `event!()` 宏为重要操作发射事件，例如成功领取或 Merkle 根更新。或者，您可以与 Solana 的 noop 程序集成以记录更新并促进链下应用程序的数据索引。

- **数据库托管**：您需要在链下存储和托管完整的 Merkle 树数据集，并派生叶子和内部节点的哈希，生成和提供 Merkle 证明，以及验证领取的输入一致性。

{% /callout %}

### 导入和模板

在这里，我们将定义本指南所需的所有导入，并在 `lib.rs` 文件中为 Account 结构和指令创建模板。

```rust
use anchor_lang::prelude::*;

use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{mint_to, set_authority, transfer, Mint, MintTo, SetAuthority, Token, TokenAccount, Transfer, spl_token::instruction::AuthorityType}

use svm_merkle_tree::{HashingAlgorithm, MerkleProof};

declare_id!("C9PLf3qMCVqtUCJtEBy8NCcseNp3KTZwFJxAtDdN1bto");

/// 程序的指令和逻辑
#[program]
pub mod merkle_tree_token_claimer {
    use super::*;

    pub fn initialize_airdrop_data(
        ctx: Context<Initialize>,
        merkle_root: [u8; 32],
        amount: u64,
    ) -> Result<()> {

        Ok(())
    }

    pub fn update_tree(
        ctx: Context<Update>,
        new_root: [u8; 32]
    ) -> Result<()> {

        Ok(())
    }

    pub fn claim_airdrop(
        ctx: Context<Claim>,
        amount: u64,
        hashes: Vec<u8>,
        index: u64,
    ) -> Result<()> {

        Ok(())
    }

}

/// 不同指令的账户结构
#[derive(Accounts)]
pub struct Initialize<'info> {

}

#[derive(Accounts)]
pub struct Update<'info> {

}

#[derive(Accounts)]
pub struct Claim<'info> {

}

/// 保存 merkle 树和空投信息的状态账户
#[account]
pub struct AirdropState {

}

/// 程序错误
#[error_code]
pub enum AirdropError {

}
```

这作为链上程序的模板，但是，还有大量的前端开销需要考虑，我们将在本文中详细介绍。

### 初始化 Merkle 树

我们首先使用用户数据初始化 Merkle 树，包括他们可领取的金额。此过程在链下执行，我们计算树的根，然后将其上传到链上，在保持完整性的同时降低计算成本。

在此示例中，我们生成 100 个随机地址和 100 个随机金额，并为每个条目初始化一个 `isClaimed` 标志，将其设置为 false。这些详细信息被序列化为二进制格式，以有效填充 Merkle 树，然后我们对刚创建的数据进行 merklize 以创建根。

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Keypair, PublicKey, SystemProgram, LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js";
import { HashingAlgorithm, MerkleTree } from "svm-merkle-tree";

// 生成 100 个随机地址和金额
let merkleTreeData = Array.from({ length: 100 }, () => ({
  address: Keypair.generate().publicKey,              // 示例随机地址
  amount: Math.floor(Math.random() * 1000),           // 示例随机金额
  isClaimed: false,                                   // isClaimed 的默认值
}));

// 创建 Merkle 树
let merkleTree = new MerkleTree(HashingAlgorithm.Keccak, 32);

merkleTreeData.forEach((entry) => {
  // 以二进制格式序列化地址、金额和 isClaimed
  const entryBytes = Buffer.concat([
    entry.address.toBuffer(),
    Buffer.from(new Uint8Array(new anchor.BN(entry.amount).toArray('le', 8))),
    Buffer.from([entry.isClaimed ? 1 : 0]),
  ]);
  merkleTree.add_leaf(entryBytes);
});

merkleTree.merklize();

const merkleRoot = Array.from(merkleTree.get_merkle_root());
```

在链上，我们定义一个 `AirdropState` 账户来管理和跟踪空投的状态。此账户保存基于 Merkle 树机制安全分发代币所需的关键信息。以下是每个字段的细分：

```rust
#[account]
pub struct AirdropState {
    /// 当前 merkle 根
    pub merkle_root: [u8; 32],
    /// 可以更新 merkle 根的权限
    pub authority: Pubkey,
    /// 正在空投的代币的 mint 地址
    pub mint: Pubkey,
    /// 为空投分配的总金额
    pub airdrop_amount: u64,
    /// 到目前为止已领取的总金额
    pub amount_claimed: u64,
    /// PDA bump 种子
    pub bump: u8,
}
```

`initialize_airdrop_data` 指令将填充 `AirdropState`，并在撤销 `mint_authority` 之前在 `vault` 中铸造足够的代币

```rust
pub fn initialize_airdrop_data(
  ctx: Context<Initialize>,
  merkle_root: [u8; 32],
  amount: u64,
) -> Result<()> {

  ctx.accounts.airdrop_state.set_inner(
    AirdropState {
      merkle_root,
      authority: ctx.accounts.authority.key(),
      mint: ctx.accounts.mint.key(),
      airdrop_amount: amount,
      amount_claimed: 0,
      bump: ctx.bumps.airdrop_state,
    }
  );

  mint_to(
    CpiContext::new(
      ctx.accounts.token_program.to_account_info(),
      MintTo {
          mint: ctx.accounts.mint.to_account_info(),
          to: ctx.accounts.vault.to_account_info(),
          authority: ctx.accounts.authority.to_account_info(),
      }
    ),
    amount
  )?;

  set_authority(
    CpiContext::new(
      ctx.accounts.token_program.to_account_info(),
      SetAuthority {
          current_authority: ctx.accounts.authority.to_account_info(),
          account_or_mint: ctx.accounts.mint.to_account_info(),
      }
    ),
    AuthorityType::MintTokens,
    None
  )?;

  Ok(())
}

#[derive(Accounts)]
pub struct Initialize<'info> {
  #[account(
    init,
    seeds = [b"merkle_tree".as_ref(), mint.key().to_bytes().as_ref()],
    bump,
    payer = authority,
    space = 8 + 32 + 32 + 32 + 8 + 8 + 1
  )]
  pub airdrop_state: Account<'info, AirdropState>,
  #[account(mut)]
  pub mint: Account<'info, Mint>,
  #[account(
    init_if_needed,
    payer = authority,
    associated_token::mint = mint,
    associated_token::authority = airdrop_state,
  )]
  pub vault: Account<'info, TokenAccount>,
  #[account(mut)]
  pub authority: Signer<'info>,
  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token>,
  pub associated_token_program: Program<'info, AssociatedToken>,
}
```

### 如果需要，在链上更新 Merkle 根

我们将创建 `update_tree` 指令，让 `AirdropState` 的 `authority` 在链上更改根。这可用于添加新用户或撤销分配。

对于此示例，我们将为随机地址创建新的随机分配，并将此条目推送到我们在上一个指令中创建的 Merkle 树中，如下所示：

```typescript
const newData = {
  address: Keypair.generate().publicKey,
  amount: Math.floor(Math.random() * 1000),           // 示例随机金额
  isClaimed: false,                                   // isClaimed 的默认值
};

merkleTreeData.push(newData);

const entryBytes = Buffer.concat([
  newData.address.toBuffer(), // PublicKey 作为字节
  Buffer.from(new Uint8Array(new anchor.BN(newData.amount).toArray('le', 8))), // 金额作为小端序
  Buffer.from([newData.isClaimed ? 1 : 0]), // isClaimed 作为 1 字节
]);

merkleTree.add_leaf(entryBytes);

merkleTree.merklize();

const newMerkleRoot = Array.from(merkleTree.get_merkle_root());
```

然后我们可以这样轻松地更新根：

```rust
pub fn update_tree(
  ctx: Context<Update>,
  new_root: [u8; 32]
) -> Result<()> {

  ctx.accounts.airdrop_state.merkle_root = new_root;

  Ok(())
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(
    mut,
    has_one = authority,
    seeds = [b"merkle_tree".as_ref(), airdrop_state.mint.key().to_bytes().as_ref()],
    bump = airdrop_state.bump
  )]
  pub airdrop_state: Account<'info, AirdropState>,
  pub authority: Signer<'info>,
}
```

我们通过使用 `has_one` 约束将提供的权限与 `AirdropState` 中保存的权限进行检查来验证此更改是"安全的"。

### 用户的领取指令

当用户领取代币时，使用存储在链上的 Merkle 树根验证其资格。

**步骤 1：生成 Merkle 证明**：

系统在外部 Merkle 树数据库（从前面的示例生成）中定位用户的数据，并生成 Merkle 证明。此证明包括用户叶子路径上兄弟节点的哈希和索引，启用验证过程，如下所示：

```typescript
const index = merkleTreeData.findIndex(data => data.address.equals(newAddress.publicKey));

if (index === -1) {
  throw new Error("在 Merkle 树数据中未找到地址");
}

const proof = merkleTree.merkle_proof_index(index);
const proofArray = Buffer.from(proof.get_pairing_hashes());
```

**步骤 2：链上验证**

使用用户提交的数据、生成的 Merkle 证明和数据的索引，系统在链上重建 Merkle 根。然后将重建的根与存储的根进行比较，以确保领取有效且 Merkle 树的完整性得到保留。

```rust
pub fn claim_airdrop(
  ctx: Context<Claim>,
  amount: u64,
  hashes: Vec<u8>,
  index: u64,
) -> Result<()> {
  let airdrop_state = &mut ctx.accounts.airdrop_state;

  // 步骤 1：通过计算原始叶子验证签名者和金额是否正确
  let mut original_leaf = Vec::new();
  original_leaf.extend_from_slice(&ctx.accounts.signer.key().to_bytes());
  original_leaf.extend_from_slice(&amount.to_le_bytes());
  original_leaf.push(0u8); // isClaimed = false

  // 步骤 2：根据链上根验证 Merkle 证明
  let merkle_proof = MerkleProof::new(
    HashingAlgorithm::Keccak,
    32,
    index as u32,
    hashes.clone(),
  );

  let computed_root = merkle_proof
    .merklize(&original_leaf)
    .map_err(|_| AirdropError::InvalidProof)?;

  require!(
    computed_root.eq(&airdrop_state.merkle_root),
    AirdropError::InvalidProof
  );

  // 步骤 3：执行转移
  let mint_key = ctx.accounts.mint.key().to_bytes();

  let signer_seeds = &[
    b"merkle_tree".as_ref(),
    mint_key.as_ref(),
    &[airdrop_state.bump],
  ];

  transfer(
    CpiContext::new_with_signer(
      ctx.accounts.token_program.to_account_info(),
      Transfer {
        from: ctx.accounts.vault.to_account_info(),
        to: ctx.accounts.signer_ata.to_account_info(),
        authority: airdrop_state.to_account_info(),
      },
      &[signer_seeds],
    ),
    amount,
  )?;

  Ok(())
}

#[derive(Accounts)]
pub struct Claim<'info> {
    #[account(
        mut,
        has_one = mint,
        seeds = [b"merkle_tree".as_ref(), mint.key().to_bytes().as_ref()],
        bump = airdrop_state.bump
    )]
    pub airdrop_state: Account<'info, AirdropState>,
    pub mint: Account<'info, Mint>,
    #[account(
        mut,
        associated_token::mint = mint,
        associated_token::authority = airdrop_state,
    )]
    pub vault: Account<'info, TokenAccount>,
    #[account(
        init_if_needed,
        payer = signer,
        associated_token::mint = mint,
        associated_token::authority = signer,
    )]
    pub signer_ata: Account<'info, TokenAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}
```

为确保准确性，根从 accounts 结构中提供的输入重建，并与存储在链上的根进行比较以验证它们是否匹配。

**步骤 3：领取**

为了简化此示例，我们不会实现并发。相反，我们提供两种可能的方法来处理领取：

- 将 isClaimed 标志设置为 true 并在链上重新计算 Merkle 根。这种方法的主要缺点是在更新期间账户将被锁定，如[并发 Merkle 树部分](#并发-merkle-树)所述。这将领取限制为每个区块一个用户，可以在转移后在同一指令中实现，如下所示：

{% totem %}

{% totem-accordion title="代码示例" %}

```rust
// 步骤 4：更新叶子中的 `is_claimed` 标志
let mut updated_leaf = Vec::new();
updated_leaf.extend_from_slice(&ctx.accounts.signer.key().to_bytes());
updated_leaf.extend_from_slice(&amount.to_le_bytes());
updated_leaf.push(1u8); // isClaimed = true

let updated_root: [u8; 32] = merkle_proof
  .merklize(&updated_leaf)
  .map_err(|_| AirdropError::InvalidProof)?
  .try_into()
  .map_err(|_| AirdropError::InvalidProof)?;

// 步骤 5：更新空投状态中的 Merkle 根
airdrop_state.merkle_root = updated_root;

// 步骤 6：更新空投状态
airdrop_state.amount_claimed = airdrop_state
  .amount_claimed
  .checked_add(amount)
  .ok_or(AirdropError::OverFlow)?;
```

{% /totem-accordion %}

{% /totem %}

- 在每个用户领取代币后为其创建一个程序派生地址 (PDA)。此方法避免锁定 `AirdropState` 账户，但需要用户支付新 PDA 的租金。这可以在同一指令中实现，我们只需要像这样更改 Account 结构：

{% totem %}

{% totem-accordion title="代码示例" %}

```rust
#[derive(Accounts)]
pub struct Claim<'info> {
  //...
  #[account(
    init,
    payer = signer,
    seeds = [b"user_receipt".as_ref(), signer.key().to_bytes().as_ref()],
    bump,
    space = 8 + 32
  )]
  pub user_receipt: Account<'info, UserReceipt>,
  //...
}

#[account]
pub struct UserReceipt {
  pub user: Pubkey,
}
```

{% /totem-accordion %}

{% /totem %}

**注意**：`user_receipt` 账户可以留空以降低租金成本。要进一步优化，您可以通过将账户分配给程序并将其作为 `UncheckedAccount` 传递来节省鉴别器上的字节。然后可以使用 `require()` 来验证账户的所有权，您需要从系统程序添加 `assign` 指令以将其分配给正确的程序。

## 完整示例代码

这是领取后在链上更新根的智能合约的完整示例：

{% totem %}

{% totem-accordion title="智能合约代码示例" %}

```rust
use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token::{mint_to, set_authority, transfer, Mint, MintTo, SetAuthority, Token, TokenAccount, Transfer, spl_token::instruction::AuthorityType}};
use svm_merkle_tree::{HashingAlgorithm, MerkleProof};

declare_id!("GTCPuHiGookQVSAgGc7CzBiFYPytjVAq6vdCV3NnZoHa");

#[program]
pub mod merkle_tree_token_claimer {
  use super::*;

  pub fn initialize_airdrop_data(
    ctx: Context<Initialize>,
    merkle_root: [u8; 32],
    amount: u64,
  ) -> Result<()> {

    ctx.accounts.airdrop_state.set_inner(
      AirdropState {
        merkle_root,
        authority: ctx.accounts.authority.key(),
        mint: ctx.accounts.mint.key(),
        airdrop_amount: amount,
        amount_claimed: 0,
        bump: ctx.bumps.airdrop_state,
      }
    );

    mint_to(
      CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        MintTo {
          mint: ctx.accounts.mint.to_account_info(),
          to: ctx.accounts.vault.to_account_info(),
          authority: ctx.accounts.authority.to_account_info(),
        }
      ),
      amount
    )?;

    set_authority(
      CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        SetAuthority {
          current_authority: ctx.accounts.authority.to_account_info(),
          account_or_mint: ctx.accounts.mint.to_account_info(),
        }
      ),
      AuthorityType::MintTokens,
      None
    )?;

    Ok(())
  }

  pub fn update_tree(
    ctx: Context<Update>,
    new_root: [u8; 32]
  ) -> Result<()> {

    ctx.accounts.airdrop_state.merkle_root = new_root;

    Ok(())
  }

  pub fn claim_airdrop(
    ctx: Context<Claim>,
    amount: u64,
    hashes: Vec<u8>,
    index: u64,
  ) -> Result<()> {
    let airdrop_state = &mut ctx.accounts.airdrop_state;

    // 步骤 1：通过计算原始叶子验证签名者和金额是否正确
    let mut original_leaf = Vec::new();
    original_leaf.extend_from_slice(&ctx.accounts.signer.key().to_bytes());
    original_leaf.extend_from_slice(&amount.to_le_bytes());
    original_leaf.push(0u8); // isClaimed = false

    // 步骤 2：根据链上根验证 Merkle 证明
    let merkle_proof = MerkleProof::new(
      HashingAlgorithm::Keccak,
      32,
      index as u32,
      hashes.clone(),
    );

    let computed_root = merkle_proof
      .merklize(&original_leaf)
      .map_err(|_| AirdropError::InvalidProof)?;

    require!(
      computed_root.eq(&airdrop_state.merkle_root),
      AirdropError::InvalidProof
    );

    // 步骤 3：执行转移
    let mint_key = ctx.accounts.mint.key().to_bytes();
    let signer_seeds = &[
      b"merkle_tree".as_ref(),
      mint_key.as_ref(),
      &[airdrop_state.bump],
    ];

    transfer(
      CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
          from: ctx.accounts.vault.to_account_info(),
          to: ctx.accounts.signer_ata.to_account_info(),
          authority: airdrop_state.to_account_info(),
        },
        &[signer_seeds],
      ),
      amount,
    )?;

    // 步骤 4：更新叶子中的 `is_claimed` 标志
    let mut updated_leaf = Vec::new();
    updated_leaf.extend_from_slice(&ctx.accounts.signer.key().to_bytes());
    updated_leaf.extend_from_slice(&amount.to_le_bytes());
    updated_leaf.push(1u8); // isClaimed = true

    let updated_root: [u8; 32] = merkle_proof
      .merklize(&updated_leaf)
      .map_err(|_| AirdropError::InvalidProof)?
      .try_into()
      .map_err(|_| AirdropError::InvalidProof)?;

    // 步骤 5：更新空投状态中的 Merkle 根
    airdrop_state.merkle_root = updated_root;

    // 步骤 6：更新空投状态
    airdrop_state.amount_claimed = airdrop_state
      .amount_claimed
      .checked_add(amount)
      .ok_or(AirdropError::OverFlow)?;

      Ok(())
  }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
  #[account(
    init,
    seeds = [b"merkle_tree".as_ref(), mint.key().to_bytes().as_ref()],
    bump,
    payer = authority,
    space = 8 + 32 + 32 + 32 + 8 + 8 + 1
  )]
  pub airdrop_state: Account<'info, AirdropState>,
  #[account(mut)]
  pub mint: Account<'info, Mint>,
  #[account(
    init_if_needed,
    payer = authority,
    associated_token::mint = mint,
    associated_token::authority = airdrop_state,
  )]
  pub vault: Account<'info, TokenAccount>,
  #[account(mut)]
  pub authority: Signer<'info>,
  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token>,
  pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(
    mut,
    has_one = authority,
    seeds = [b"merkle_tree".as_ref(), airdrop_state.mint.key().to_bytes().as_ref()],
    bump = airdrop_state.bump
  )]
  pub airdrop_state: Account<'info, AirdropState>,
  pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct Claim<'info> {
  #[account(
    mut,
    has_one = mint,
    seeds = [b"merkle_tree".as_ref(), mint.key().to_bytes().as_ref()],
    bump = airdrop_state.bump
  )]
  pub airdrop_state: Account<'info, AirdropState>,
  pub mint: Account<'info, Mint>,
  #[account(
    mut,
    associated_token::mint = mint,
    associated_token::authority = airdrop_state,
  )]
  pub vault: Account<'info, TokenAccount>,
  #[account(
    init_if_needed,
    payer = signer,
    associated_token::mint = mint,
    associated_token::authority = signer,
  )]
  pub signer_ata: Account<'info, TokenAccount>,
  #[account(mut)]
  pub signer: Signer<'info>,
  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token>,
  pub associated_token_program: Program<'info, AssociatedToken>,
}

/// 保存 merkle 树和空投信息的状态账户
#[account]
pub struct AirdropState {
  /// 当前 merkle 根
  pub merkle_root: [u8; 32],
  /// 可以更新 merkle 根的权限
  pub authority: Pubkey,
  /// 正在空投的代币的 mint 地址
  pub mint: Pubkey,
  /// 为空投分配的总金额
  pub airdrop_amount: u64,
  /// 到目前为止已领取的总金额
  pub amount_claimed: u64,
  /// PDA bump 种子
  pub bump: u8,
}

#[error_code]
pub enum AirdropError {
  #[msg("无效的 Merkle 证明")]
  InvalidProof,
  #[msg("已经领取")]
  AlreadyClaimed,
  #[msg("金额溢出")]
  OverFlow,
}
```

{% /totem-accordion %}

{% /totem %}

这是相应的 test.ts 文件，包含实现和测试 Merkle 树的代码：

{% totem %}

{% totem-accordion title="Typescript 测试代码示例" %}

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MerkleTreeTokenClaimer } from "../target/types/merkle_tree_token_claimer";
import { expect } from "chai";
import { Keypair, PublicKey, SystemProgram, LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { HashingAlgorithm, MerkleTree } from "svm-merkle-tree";
import { ASSOCIATED_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";


describe("merkle-tree-token-claimer", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = anchor.Wallet.local();

  Keypair.fromSecretKey
  const program = anchor.workspace.MerkleTreeTokenClaimer as Program<MerkleTreeTokenClaimer>;

  let authority = wallet.payer;
  let mint = Keypair.generate();
  let newAddress: Keypair;
  let airdropState: PublicKey;
  let merkleTree: MerkleTree;
  let vault: PublicKey;
  let newData: AirdropTokenData;

  interface AirdropTokenData {
    address: PublicKey;
    amount: number;
    isClaimed: boolean;
  }
  let merkleTreeData: AirdropTokenData[];

  before(async () => {
    airdropState = PublicKey.findProgramAddressSync([Buffer.from("merkle_tree"), mint.publicKey.toBuffer()], program.programId)[0];
    vault = await getAssociatedTokenAddress(mint.publicKey, airdropState, true);

    // 向权限空投 SOL
    await provider.sendAndConfirm(
      new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: provider.publicKey,
          toPubkey: authority.publicKey,
          lamports: 10 * LAMPORTS_PER_SOL,
        })
      ),
      []
    );

    // 生成 100 个随机地址和金额
    merkleTreeData = Array.from({ length: 100 }, () => ({
      address: Keypair.generate().publicKey,
      amount: Math.floor(Math.random() * 1000),           // 示例随机金额
      isClaimed: false,                                   // isClaimed 的默认值
    }));

    // 创建 Merkle 树
    merkleTree = new MerkleTree(HashingAlgorithm.Keccak, 32);
    merkleTreeData.forEach((entry) => {
      // 以二进制格式序列化地址、金额和 isClaimed
      const entryBytes = Buffer.concat([
        entry.address.toBuffer(),
        Buffer.from(new Uint8Array(new anchor.BN(entry.amount).toArray('le', 8))),
        Buffer.from([entry.isClaimed ? 1 : 0]),
      ]);
      merkleTree.add_leaf(entryBytes);
    });
    merkleTree.merklize();

  });

  it("初始化空投数据", async () => {
    const merkleRoot = Array.from(merkleTree.get_merkle_root());
    const totalAirdropAmount = merkleTreeData.reduce((sum, entry) => sum + entry.amount, 0);

    await program.methods.initializeAirdropData(merkleRoot, new anchor.BN(totalAirdropAmount))
      .accountsPartial({
        airdropState,
        mint: mint.publicKey,
        vault,
        authority: authority.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
      })
      .signers([authority, mint])
      .rpc();

    const account = await program.account.airdropState.fetch(airdropState);
    expect(account.merkleRoot).to.deep.equal(merkleRoot);
    expect(account.authority.toString()).to.equal(authority.publicKey.toString());
  });

  it("更新根", async () => {
    const newData = {
      address: Keypair.generate().publicKey,
      amount: Math.floor(Math.random() * 1000),           // 示例随机金额
      isClaimed: false,                                   // isClaimed 的默认值
    };
    merkleTreeData.push(newData);
    const entryBytes = Buffer.concat([
      newData.address.toBuffer(), // PublicKey 作为字节
      Buffer.from(new Uint8Array(new anchor.BN(newData.amount).toArray('le', 8))), // 金额作为小端序
      Buffer.from([newData.isClaimed ? 1 : 0]), // isClaimed 作为 1 字节
    ]);
    merkleTree.add_leaf(entryBytes);
    merkleTree.merklize();

    const newMerkleRoot = Array.from(merkleTree.get_merkle_root());

    await program.methods.updateTree(newMerkleRoot)
      .accountsPartial({
        airdropState: airdropState,
        authority: authority.publicKey,
      })
      .signers([authority])
      .rpc();

    const account = await program.account.airdropState.fetch(airdropState);
    expect(account.merkleRoot).to.deep.equal(newMerkleRoot);
  });

  it("使用白名单地址执行领取", async () => {
    newAddress = Keypair.generate();
    newData = {
      address: newAddress.publicKey,
      amount: Math.floor(Math.random() * 1000),           // 示例随机金额
      isClaimed: false,                                   // isClaimed 的默认值
    }
    merkleTreeData.push(newData);
    const entryBytes = Buffer.concat([
      newData.address.toBuffer(), // PublicKey 作为字节
      Buffer.from(new Uint8Array(new anchor.BN(newData.amount).toArray('le', 8))), // 金额作为小端序
      Buffer.from([newData.isClaimed ? 1 : 0]), // isClaimed 作为 1 字节
    ]);
    merkleTree.add_leaf(entryBytes);
    merkleTree.merklize();

    const newMerkleRoot = Array.from(merkleTree.get_merkle_root());

    await program.methods.updateTree(newMerkleRoot)
      .accountsPartial({
        airdropState: airdropState,
        authority: authority.publicKey,
      })
      .signers([authority])
      .rpc();

    const index = merkleTreeData.findIndex(data => data.address.equals(newAddress.publicKey));
    if (index === -1) {
      throw new Error("在 Merkle 树数据中未找到地址");
    }

    const proof = merkleTree.merkle_proof_index(index);
    const proofArray = Buffer.from(proof.get_pairing_hashes());

    await provider.sendAndConfirm(
      new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: provider.publicKey,
          toPubkey: newAddress.publicKey,
          lamports: 10 * LAMPORTS_PER_SOL,
        })
      ),
      []
    );

    try {
      await program.methods.claimAirdrop(new anchor.BN(newData.amount), proofArray, new anchor.BN(index))
        .accountsPartial({
          airdropState,
          mint: mint.publicKey,
          vault,
          signerAta: await getAssociatedTokenAddress(mint.publicKey, newAddress.publicKey),
          signer: newAddress.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        })
        .signers([newAddress])
        .rpc();
      console.log("白名单地址操作执行成功");
    } catch (error) {
      console.error("执行操作时出错:", error);
      throw error;
    }
  });
};
```

{% /totem-accordion %}

{% /totem %}
