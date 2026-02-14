---
# remember to update dates also in /components/guides/index.js
title: Solana 程序和状态概述
metaTitle: Solana 程序和状态概述 | 指南
description: 了解 Solana 程序以及如何在 Solana 上的账户状态中存储数据。
created: '04-19-2024'
updated: '04-19-2025'
keywords:
  - Solana programs
  - smart contracts
  - Solana accounts
  - Solana state management
  - Solana Rust programs
about:
  - Solana programs
  - accounts
  - instructions
  - state management
proficiencyLevel: Beginner
programmingLanguage:
  - Rust
faqs:
  - q: What are Solana programs?
    a: Solana programs are executable code that runs on the Solana blockchain, similar to smart contracts. They are stateless, typically written in Rust, and invoked by transactions.
  - q: How does state management work on Solana?
    a: State is managed externally from programs and stored in separate accounts. Programs modify state by updating data in accounts through instructions sent via transactions.
  - q: What types of accounts exist on Solana?
    a: Solana has Data Accounts for storing arbitrary data, SPL Token Accounts for managing token balances, and Program Accounts that contain executable program code.
---

## Solana 程序
Solana 程序是在 Solana 区块链上运行的**可执行代码**。它们类似于其他区块链平台上的智能合约，但具有一些 Solana 特定的独特特性和优化。

#### 关键特性：
- **无状态**：Solana 程序不在内部存储状态。相反，状态存储在链上的单独账户中。
- **用 Rust 编写**：程序通常用 Rust 编写。
- **由交易执行**：程序由指定程序 ID 以及所需账户和数据的交易调用。

## 账户
账户**用于存储数据和 SOL**。每个账户都有一个所有者，即可以修改其数据的程序。

#### 账户类型：
- **数据账户**：存储程序使用的任意数据。
- **SPL 代币账户**：管理代币余额（类似于以太坊上的 ERC-20 代币）。
- **程序账户**：包含 Solana 程序的可执行代码。

## 指令
指令是发送到 Solana 程序的**操作**。它们包含在交易中，并指定程序应在哪些账户上操作，以及执行操作所需的任何其他数据。

#### 指令的关键要素：
- **程序 ID**：标识要执行的程序。
- **账户**：指令将读取或写入的账户列表。
- **数据**：执行指令所需的自定义数据。

## 状态管理
在 Solana 中，状态是**从程序外部管理**的，存储在账户中。这种状态和逻辑的分离实现了更高的可扩展性和效率。

#### 状态管理工作流程：
- **账户创建**：创建账户以存储数据。
- **程序执行**：使用指定要读取或写入哪些账户的指令执行程序。
- **状态更新**：程序通过更新账户中的数据来修改状态。

#### 示例工作流程
1. 定义程序：
   - 用 Rust 编写程序以执行特定任务，例如递增计数器。
2. 部署程序：
   - 编译程序并将其部署到 Solana 区块链。
3. 创建账户：
   - 创建账户以存储程序的状态。
4. 发送指令：
   - 发送包含指令的交易以调用程序，指定要使用的账户和数据。

## 示例代码
下面是一个用 Rust 编写的简单 Solana 程序示例，该程序递增存储在账户中的值。

```rust
use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint,
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    msg,
    program_error::ProgramError,
};

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    let accounts_iter = &mut accounts.iter();
    let account = next_account_info(accounts_iter)?;

    // Ensure account is owned by the program
    if account.owner != program_id {
        msg!("Account is not owned by the program");
        return Err(ProgramError::IncorrectProgramId);
    }

    // Deserialize instruction data (increment value)
    let increment_amount = instruction_data[0];

    // Increment the value
    let mut data = account.try_borrow_mut_data()?;
    data[0] = data[0].wrapping_add(increment_amount);

    msg!("Value after increment: {}", data[0]);

    Ok(())
}
```
