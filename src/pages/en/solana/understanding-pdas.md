---
title: Understanding Solana Program Derived Addresses (PDAs)
metaTitle: Understanding Solana Program Derived Addresses | Guides
description: Learn about Solana Program Derived Addresses (PDAs) and their use cases.
# remember to update dates also in /components/products/guides/index.js
created: '04-19-2024'
updated: '09-03-2026'
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

## Overview
**Program Derived Addresses (PDAs)** are special types of account used on Solana that are deterministically derived and look like standard public keys, but have no associated private keys.

Only the program that derived the PDA can sign transactions involving the address/account. This is due to the fact that PDAs do not occur on the Ed25519 curve (elliptic-curve cryptography). Only addresses that appear on the curve can have a matching private key making PDAs a secure way of signing transactions from within a program. This means that no external user can generate a valid signature for the PDA address and sign on behalf of a pda/program.

## Role of PDAs
PDAs are primarily used to:

- **Manage State**: PDAs allow programs to create accounts and store data to a deterministic PDA address which allows read and write access for the program.
- **Authorize Transactions**: Only the program that owns the PDA can authorize transactions involving it, ensuring secure controlled access. For example this allows programs and PDA accounts to store tokens/own NFTs that would require the current owner of the tokens/NFT to sign a transaction to transfer the items to another account.

## How PDAs are Derived
PDAs are derived using a combination of a program ID and a set of seed values. The derivation process involves hashing these values together and ensuring the resulting address is valid.

### Derivation Process
1. **Select Program ID**: The public key of the program for which the PDA is being derived.
2. **Choose Seeds**: One or more seed values that, together with the program ID, will deterministically generate the PDA algorithmically based on the combined values.
3. **Compute PDA**: Use the `Pubkey::find_program_address` function to derive the PDA. This function ensures the derived address is valid and cannot collide with any regular (non-PDA) address.

### Try it live: the Token Metadata PDA

Every token's metadata account is a PDA of the Token Metadata program, derived from three seeds: the string `"metadata"`, the program id `metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s` and the mint. The flow below runs `find_program_address` in your browser. Replace the mint (third input) with any mint and the metadata address updates — this is exactly what `findMetadataPda(umi, { mint })` returns.

{% video src="https://plgrnd.io/embed?theme=dark&ref=metaplex-docs#flow=N4IgbiBcDMA0IDsD2ATApgZygbVASxShAGMBGEeAFwE8AHNIgYQHkBZVgUQDkAVCkWkgx5KeJAiigAHlAAM8alAC0AJgAssgL7wUAQ0q7JISmimUirNAdoAbUwAIeSANZoE9ywb0H7ABQAiAIIAOgihGGhoKBj2ALz22MEgALZWut66SbD2lC5u9qle+rr2tABOSADmZbrJ9gTZyXgIlAC6oeVVNXXxua7uhenFpRXVtaGhHCgiOQAWaAXNlPYAFJSzeGUojhwAGjz2yOgAlPa6CNsA7vrEs3MLgxlnxMRIAK4tZygoZZgxb7RvGgAHSODYxPAxUy6YiUGzUeyXWb6ewAM2aKE8QwMvj0KzeTWywEWn00p1eyVobxMGGBIE02nwhEgxnIVDoDBZPD2fHggmEonERhkkHkIEUou0IAyRhMZiIj2K9MZIAIREoKn4NHoRG5+34-JEYgkkGkcgUUAAnFodErTcZTOYWYMAI4AIykUgAqmgti6VAAOYgAK1IACU3YEAOrOACaAEVktBqG6AF7Bt0ANl0AbdlAArKQA1JSFgGbAmeroFqObqeQahEahfaRWKJUWbdK7aA5U6QBxfMGAGJR775wJvVEugDK05daFYKhdXFIUlTKd0tEYAYA4mpLhwdzvnAAtS7UHj+SikCDlyss2hs4y1lkBQINgXG4VQNQqNtWzsZVNO9VWZaUn21TkQH8ABJadfAAGUCWMPybE0zUgTNM3-SANClICe0dIh8ykaAAwAaVoNRZjAFAkGSHhGAQRgykCBBqDUL1KFYLj8zKeMACEUAEzNaCkFRyNIL08DUfMoxdZUK1AogUE1dkdRZWD4KQlC+UbQV0JAEUsJw0h80A7sHXlFkVHzfNFPvEg1OfDSQBYdhuF5AR9K-FsoBMi1ICUUhSAsgxZSIlksSeGFXg+ZZ0h+P5VlRJAynuewvWnfxGBJShTnObZ1gWYhznEPBSpsew3QJWg6QZVp4CiSpMBwRypGoJRmrQAB9HqNSUXslDKPBKlmSglEfSbRm6GCUCUOxUXMeAMHeMpiCgjV+FWt51rQAAJQq7HVFRBsdYbRvGrVdDKFq+0fa7bqsQ6LmOh9SGmrpajmha0CW+klLVFkOq6lAWr668zrMC6xomqaIiiABiWRfv+la1o29Unx2vaXpQN7WShiaRthx67qIB6qBuu68YJ+HIhQZHUfMFUgaMzruoh06hpJ8bJo+hHGY+xblpAHHMZZLb0d2jbac27nzt50WDCe+6IOp56jqg+mkeFv6WcBsCQc5-roCJmG+Z1xnTpF7aMc26tpdxrWq3NpWyasCn1dVuWvaUQXEZt-WAfajmwd6nqpsBXQLYmlAPuaKkJttp2JYEbH7d997Jr0WOPb7eP86z8ClET6lmZD5TgbD8HI4+mrKVjpRVNLhAk4r1PtYzmWDpd7OG9oPOqdVlTnJVmm++lU6y+T4PNFaTQgA" embed=true /%}

```javascript
import { findMetadataPda } from '@metaplex-foundation/mpl-token-metadata'

const [metadataPda, bump] = findMetadataPda(umi, { mint })
```

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
