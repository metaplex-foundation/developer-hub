---
title: Understanding Solana Program Derived Addresses (PDAs)
metaTitle: Understanding Solana Program Derived Addresses (PDAs)
description: Learn about Solana Program Derived Addresses (PDAs) and their use cases.
# remember to update dates also in /components/guides/index.js
created: '06-16-2024'
updated: '06-21-2024'
---

## Overview
**Program Derived Addresses (PDAs)** are special types of account used on Solana that are deterministically derived and look like standard public keys, but have no associated private keys.

## Key Characteristics of PDAs
- **Deterministic**: PDAs are deterministically derived from a combination of a program ID and "seeds" (predefined inputs) values
- **Secure**: no external user can generate a valid signature for the PDA address. Only the program that derived the PDA can sign transactions involving it.
- **Convenient**: They simplify the management of program-specific state and data by providing a consistent way to address accounts.

## Role of PDAs
PDAs are primarily used to:

- **Manage State**: PDAs allow programs to store data in a determinstic address, making reading that state back easy.
- **Authorize Transactions**: Only the program that owns the PDA can authorize transactions involving it, ensuring controlled access.
- **Create Program-Specific Accounts**: Programs can create and interact with accounts that are uniquely associated with them, enabling modular and isolated state management.

## How PDAs are Derived
PDAs are derived using a combination of a program ID and a set of seed values. The derivation process involves hashing these values together and ensuring the resulting address is valid.

### Derivation Process
1. **Select Program ID**: The public key of the program for which the PDA is being derived.
2. **Choose Seeds**: One or more seed values that, together with the program ID, will deterministically generate the PDA algorithmically based on the combined values.
3. **Compute PDA**: Use the `Pubkey::find_program_address` function to derive the PDA. This function ensures the derived address is valid and cannot collide with any regular (non-PDA) address.

## Example in Rust
Here's an example of deriving a PDA in a Solana program written in Rust:

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
**Practical Use Case:** Account Creation
Programs often use PDAs to create and manage program-specific accounts. Here's an example of how a PDA can be used to create an account:

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