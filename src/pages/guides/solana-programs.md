---
title: Solana Programs and State Overview
metaTitle: Solana Programs and State Overview | Guides
description: Learn about Solana Programs and how data is stored in account state on Solana.
# remember to update dates also in /components/guides/index.js
created: '06-16-2024'
updated: '06-21-2024'
---

## Solana Programs
Solana programs are **executable code** that runs on the Solana blockchain. They are similar to smart contracts on other blockchain platforms, but with some distinct characteristics and optimizations specific to Solana.

#### Key Characteristics:
- **Stateless**: Solana programs do not store state internally. Instead, state is stored in seperate accounts on the chain.
- **Written in Rust**: Programs are typically written in Rust.
- **Executed by Transactions**: Programs are invoked by transactions that specify the program ID and the required accounts and date.

## Accounts
Accounts **used to store both data and SOL**. Each account has an owner, which is a program that can modify its data.

#### Types of Accounts:
- **Data Accounts**: Store arbitrary data used by programs.
- **SPL Token Accounts**: Manage token balances (similar to ERC-20 tokens on Ethereum).
- **Program Accounts**: Contain the executable code of a Solana program.

## Instructions
Instructions are **operations** sent to Solana programs. They are included in transactions and specify which accounts the program should operate on, as well as any additional data needed to perform the operation.

#### Key Elements of Instructions:
- **Program ID**: Identifies the program to be executed.
- **Accounts**: A list of accounts that the instruction will read from or write to.
- **Data**: Custom data required to perform the instruction.

## State Management
In Solana, the state is **managed externally** from the programs, stored in accounts. This separation of state and logic enables higher scalability and efficiency.

#### State Management Workflow:
- **Account Creation**: Create accounts to store data.
- **Program Execution**: Execute a program with instructions specifying which accounts to read from or write to.
- **State Update**: Programs modify the state by updating the data in accounts.

#### Example Workflow
1. Define a Program:
   - Write a program in Rust to perform a specific task, such as incrementing a counter.
2. Deploy the Program:
   - Compile and deploy the program to the Solana blockchain.
3. Create Accounts:
   - Create accounts to store the program's state.
4. Send Instructions:
   - Send transactions containing instructions to invoke the program, specifying the accounts and data to use.

## Example Code
Below is a simple example of a Solana program written in Rust that increments a value stored in an account.

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