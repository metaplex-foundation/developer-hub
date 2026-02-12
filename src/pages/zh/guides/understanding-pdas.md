---
# remember to update dates also in /components/guides/index.js
title: 理解 Solana 程序派生地址（PDA）
metaTitle: 理解 Solana 程序派生地址 | 指南
description: 了解 Solana 程序派生地址（PDA）及其用例。
created: '04-19-2024'
updated: '04-19-2025'
keywords:
  - Program Derived Addresses
  - PDA
  - Solana PDAs
  - Ed25519 curve
  - Solana PDA tutorial
  - deterministic addresses
about:
  - Program Derived Addresses
  - Solana account management
  - deterministic key derivation
proficiencyLevel: Intermediate
programmingLanguage:
  - Rust
faqs:
  - q: What are Program Derived Addresses (PDAs) on Solana?
    a: PDAs are special account addresses deterministically derived from a program ID and seed values. They have no associated private keys, meaning only the owning program can sign transactions involving them.
  - q: Why can't PDAs have private keys?
    a: PDAs are derived to fall off the Ed25519 elliptic curve, which means no valid private key exists for these addresses. This ensures only the program that derived the PDA can authorize transactions for it.
  - q: How are PDAs derived?
    a: PDAs are derived using Pubkey::find_program_address with a program ID and seed values. The function hashes these together and ensures the resulting address is not on the Ed25519 curve.
  - q: What are common use cases for PDAs?
    a: PDAs are used to manage program state by creating deterministic accounts for data storage, and to authorize transactions where only the owning program can sign on behalf of the PDA.
---

## 概述
**程序派生地址（PDA）** 是 Solana 上使用的特殊类型账户，它们是确定性派生的，看起来像标准公钥，但没有关联的私钥。

只有派生 PDA 的程序才能签署涉及该地址/账户的交易。这是因为 PDA 不在 Ed25519 曲线（椭圆曲线密码学）上。只有出现在曲线上的地址才能具有匹配的私钥，这使得 PDA 成为从程序内签署交易的安全方式。这意味着没有外部用户可以为 PDA 地址生成有效签名并代表 pda/程序签名。

## PDA 的作用
PDA 主要用于：

- **管理状态**：PDA 允许程序创建账户并将数据存储到确定性 PDA 地址，从而允许程序进行读写访问。
- **授权交易**：只有拥有 PDA 的程序才能授权涉及它的交易，确保安全的受控访问。例如，这允许程序和 PDA 账户存储代币/拥有 NFT，这将需要代币/NFT 的当前所有者签署交易以将项目转移到另一个账户。

## PDA 如何派生
PDA 是使用程序 ID 和一组种子值的组合派生的。派生过程涉及将这些值一起哈希并确保生成的地址有效。

### 派生过程
1. **选择程序 ID**：正在派生 PDA 的程序的公钥。
2. **选择种子**：一个或多个种子值，与程序 ID 一起，将根据组合值通过算法确定性地生成 PDA。
3. **计算 PDA**：使用 `Pubkey::find_program_address` 函数派生 PDA。此函数确保派生的地址有效且不会与任何常规（非 PDA）地址冲突。

## Rust 示例
以下是在用 Rust 编写的 Solana 程序中派生 PDA 的示例：

```rust
use solana_program::{
    pubkey::Pubkey,
    system_instruction,
    system_program,
    sysvar::rent::Rent,
    program::invoke_signed,
};

// Function to derive a PDA
fn derive_pda(program_id: &Pubkey, seeds: &[&[u8]]) -> (Pubkey, u8) {
    Pubkey::find_program_address(seeds, program_id)
}

// Example usage
fn example_usage(program_id: &Pubkey) {
    // Define seeds
    let seed1 = b"seed1";
    let seed2 = b"seed2";

    // Derive PDA
    let (pda, bump_seed) = derive_pda(program_id, &[seed1, seed2]);

    // Print PDA
    println!("Derived PDA: {}", pda);
}
```
**实际用例：** 账户创建
程序经常使用 PDA 来创建和管理程序特定的账户。以下是如何使用 PDA 创建账户的示例：

```rust

use solana_program::{
    pubkey::Pubkey,
    system_instruction,
    system_program,
    sysvar::rent::Rent,
    program::invoke_signed,
};

fn create_account_with_pda(
    program_id: &Pubkey,
    payer: &Pubkey,
    seeds: &[&[u8]],
    lamports: u64,
    space: u64,
) -> Result<(), ProgramError> {
    let (pda, bump_seed) = Pubkey::find_program_address(seeds, program_id);

    let create_account_ix = system_instruction::create_account(
        payer,
        &pda,
        lamports,
        space,
        program_id,
    );

    // Sign the instruction with the PDA
    let signers_seeds = &[&seeds[..], &[bump_seed]];

    invoke_signed(
        &create_account_ix,
        &[payer_account_info, pda_account_info],
        signers_seeds,
    )?;

    Ok(())
}
```
