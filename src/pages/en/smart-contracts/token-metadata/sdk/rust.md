---
title: Rust SDK
metaTitle: Rust SDK | Token Metadata
description: Set up the Metaplex Token Metadata Rust SDK. Install the crate, use instruction builders for off-chain scripts, and perform CPI calls from on-chain programs.
updated: '02-07-2026'
keywords:
  - mpl-token-metadata Rust
  - Token Metadata Rust SDK
  - Solana Rust NFT
  - CPI Token Metadata
  - Rust instruction builder
about:
  - Rust SDK
  - CPI integration
  - On-chain programs
proficiencyLevel: Intermediate
programmingLanguage:
  - Rust
faqs:
  - q: What is the Token Metadata Rust SDK?
    a: The Token Metadata Rust SDK (mpl-token-metadata) is a lightweight Rust crate for interacting with the Token Metadata program from off-chain scripts and on-chain programs via CPI.
  - q: Can I use this SDK for on-chain CPI calls?
    a: Yes. The SDK provides CpiBuilder types for each instruction that accept AccountInfo references and support invoke() and invoke_signed() for cross-program invocations.
  - q: What modules does the crate contain?
    a: The crate is divided into accounts (account structs), instructions (off-chain and CPI builders), types (shared data types), and errors (program error enum).
  - q: How do I find PDA addresses?
    a: Account types representing PDAs (e.g., Metadata) have find_pda() and create_pda() associated functions. Use find_pda() off-chain and create_pda() on-chain to save compute units.
---

The **Token Metadata Rust SDK** (`mpl-token-metadata`) is a lightweight crate for interacting with the Token Metadata program from Rust. It supports both off-chain scripts and on-chain programs via CPI instructions. {% .lead %}

{% callout title="What You'll Learn" %}
- Installing the `mpl-token-metadata` crate
- SDK module structure (accounts, instructions, types, errors)
- Using instruction builders for off-chain scripts
- Using CPI builders for on-chain programs
- PDA helper functions
{% /callout %}

## Prerequisites

- **Rust 1.75+** with Cargo
- **Solana CLI** for deploying and testing

{% quick-links %}
{% quick-link title="crates.io" target="_blank" icon="Rust" href="https://crates.io/crates/mpl-token-metadata" description="The mpl-token-metadata crate on crates.io." /%}
{% quick-link title="docs.rs" target="_blank" icon="Rust" href="https://docs.rs/mpl-token-metadata/latest/mpl_token_metadata/" description="Full API reference on docs.rs." /%}
{% /quick-links %}

## Installation

```bash {% title="Terminal" %}
cargo add mpl-token-metadata
```

{% callout %}
If you are using a `solana-program` version prior to 1.16, first add the `solana-program` dependency to your project and then add `mpl-token-metadata`. This ensures you only have a single copy of the `borsh` crate.
{% /callout %}

## Module Structure

The SDK is organized into four modules:

| Module | Purpose |
|--------|---------|
| `accounts` | Structs representing Token Metadata accounts (Metadata, MasterEdition, etc.) |
| `instructions` | Off-chain and CPI instruction builders |
| `types` | Shared data types (TokenStandard, Collection, Creator, etc.) |
| `errors` | Program error enum |

A full list of instructions is available at [docs.rs/mpl-token-metadata](https://docs.rs/mpl-token-metadata/latest/mpl_token_metadata/instructions/index.html).

## Off-Chain Instruction Builders

For local scripts and client applications, use the `Builder` variants of instructions. These return a Solana `Instruction` that can be added to a transaction.

### Using the Struct Directly

{% totem %}
{% totem-prose %}

`CreateV1` instruction struct with explicit accounts and args:

{% /totem-prose %}

```rust
// instruction args
let args = CreateV1InstructionArgs {
    name: String::from("My pNFT"),
    symbol: String::from("MY"),
    uri: String::from("https://my.pnft"),
    seller_fee_basis_points: 500,
    primary_sale_happened: false,
    is_mutable: true,
    token_standard: TokenStandard::ProgrammableNonFungible,
    collection: None,
    uses: None,
    collection_details: None,
    creators: None,
    rule_set: None,
    decimals: Some(0),
    print_supply: Some(PrintSupply::Zero),
};

// instruction accounts
let create_ix = CreateV1 {
    metadata,
    master_edition: Some(master_edition),
    mint: (mint_pubkey, true),
    authority: payer_pubkey,
    payer: payer_pubkey,
    update_authority: (payer_pubkey, true),
    system_program: system_program::ID,
    sysvar_instructions: solana_program::sysvar::instructions::ID,
    spl_token_program: spl_token::ID,
};

// creates the instruction
let create_ix = create_ix.instruction(args);
```

{% /totem %}

### Using the Builder Pattern

The `*Builder` companion struct provides a more ergonomic API where optional fields can be omitted:

{% totem %}
{% totem-prose %}

`CreateV1Builder` — fluent builder with optional fields:

{% /totem-prose %}

```rust
let create_ix = CreateV1Builder::new()
    .metadata(metadata)
    .master_edition(Some(master_edition))
    .mint(mint_pubkey, true)
    .authority(payer_pubkey)
    .payer(payer_pubkey)
    .update_authority(payer_pubkey, true)
    .is_mutable(true)
    .primary_sale_happened(false)
    .name(String::from("My pNFT"))
    .uri(String::from("https://my.pnft"))
    .seller_fee_basis_points(500)
    .token_standard(TokenStandard::ProgrammableNonFungible)
    .print_supply(PrintSupply::Zero)
    .instruction();
```

{% /totem %}

The resulting `create_ix` is a standard Solana `Instruction` ready to be added to a transaction.

## CPI Builders (On-Chain)

When writing a Solana program that needs to call Token Metadata, use the CPI builders. They accept `AccountInfo` references instead of `Pubkey`s.

### Using the CPI Struct

{% totem %}
{% totem-prose %}

`TransferV1Cpi` with explicit accounts and args:

{% /totem-prose %}

```rust
let cpi_transfer = TransferV1Cpi::new(
    metadata_program_info,
    TransferV1CpiAccounts {
        token: owner_token_info,
        token_owner: owner_info,
        destination_token: destination_token_info,
        destination_owner: destination_info,
        mint: mint_info,
        metadata: metadata_info,
        authority: vault_info,
        payer: payer_info,
        system_program: system_program_info,
        sysvar_instructions: sysvar_instructions_info,
        spl_token_program: spl_token_program_info,
        spl_ata_program: spl_ata_program_info,
        edition: edition_info,
        token_record: None,
        destination_token_record: None,
        authorization_rules: None,
        authorization_rules_program: None,
    },
    TransferV1InstructionArgs {
        amount,
        authorization_data: None,
    },
);

// performs the CPI
cpi_transfer.invoke_signed(&[&signer_seeds])
```

{% /totem %}

### Using the CPI Builder Pattern

{% totem %}
{% totem-prose %}

`TransferV1CpiBuilder` — fluent CPI builder that omits optional fields:

{% /totem-prose %}

```rust
let cpi_transfer = TransferV1CpiBuilder::new(metadata_program_info)
    .token(owner_token_info)
    .token_owner(owner_info)
    .destination_token(destination_token_info)
    .destination_owner(destination_info)
    .mint(mint_info)
    .metadata(metadata_info)
    .edition(edition_info)
    .authority(vault_info)
    .payer(payer_info)
    .system_program(system_program_info)
    .sysvar_instructions(sysvar_instructions_info)
    .spl_token_program(spl_token_program_info)
    .spl_ata_program(spl_ata_program_info)
    .amount(amount);

// performs the CPI
cpi_transfer.invoke_signed(&[&signer_seeds])
```

{% /totem %}

## PDA Helpers

Account types representing PDAs (e.g., `Metadata`, `MasterEdition`) have associated functions to find or create PDA addresses.

{% totem %}
{% totem-prose %}

**Off-chain** — Use `find_pda` to derive the address:

{% /totem-prose %}

```rust
let (metadata_pubkey, _) = Metadata::find_pda(mint);
```

{% totem-prose %}

**On-chain** — Use `create_pda` to save compute units (requires storing the bump):

{% /totem-prose %}

```rust
let metadata_pubkey = Metadata::create_pda(mint, bump)?;
```

{% /totem %}

## Quick Reference

### Core Instructions

| Instruction | Builder | CPI Builder |
|-------------|---------|-------------|
| Create | `CreateV1Builder` | `CreateV1CpiBuilder` |
| Update | `UpdateV1Builder` | `UpdateV1CpiBuilder` |
| Transfer | `TransferV1Builder` | `TransferV1CpiBuilder` |
| Burn | `BurnV1Builder` | `BurnV1CpiBuilder` |
| Verify | `VerifyV1Builder` | `VerifyV1CpiBuilder` |
| Delegate | `DelegateV1Builder` | `DelegateV1CpiBuilder` |
| Lock | `LockV1Builder` | `LockV1CpiBuilder` |
| Unlock | `UnlockV1Builder` | `UnlockV1CpiBuilder` |
| Print | `PrintV1Builder` | `PrintV1CpiBuilder` |

### Program ID

| Network | Address |
|---------|---------|
| Mainnet | `metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s` |
| Devnet | `metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s` |

## Next Steps

- [Creating & Minting](/smart-contracts/token-metadata/mint) — Detailed minting guide for all token types
- [Token Standards](/smart-contracts/token-metadata/token-standard) — Understand the different asset types
- [Programmable NFTs](/smart-contracts/token-metadata/pnfts) — Learn about pNFTs and authorization rules
- [How to CPI into a Metaplex Program](/guides/rust/how-to-cpi-into-a-metaplex-program) — Comprehensive CPI guide
- [Metaplex Rust SDKs Guide](/guides/rust/metaplex-rust-sdks) — General Rust SDK usage
