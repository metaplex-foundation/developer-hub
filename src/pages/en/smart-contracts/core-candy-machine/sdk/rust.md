---
title: Core Candy Machine Rust SDK
metaTitle: Core Candy Machine Rust SDK | Core Candy Machine
description: Get started with the mpl-core-candy-machine-core and mpl-core-candy-guard Rust crates for building and managing Core Candy Machines on Solana.
keywords:
  - core candy machine
  - rust sdk
  - mpl-core-candy-machine-core
  - mpl-core-candy-guard
  - solana programs
  - rust crate
  - candy machine rust
  - onchain programs
  - metaplex rust
  - cargo
  - solana nft
about:
  - Rust SDK
  - Solana programs
proficiencyLevel: Intermediate
programmingLanguage:
  - Rust
created: '03-10-2026'
updated: '03-10-2026'
---

## Summary

The Core Candy Machine Rust SDK provides two crates for interacting with Candy Machines on Solana: `mpl-core-candy-machine-core` for machine initialization and management, and `mpl-core-candy-guard` for creating and configuring guards. {% .lead %}

- Install via Cargo with `cargo add mpl-core-candy-machine-core` and `cargo add mpl-core-candy-guard`
- Usable in scripts, desktop applications, mobile applications, and Solana onchain programs
- The Core crate handles Candy Machine creation, configuration, and asset loading
- The Guard crate handles guard creation and wrapping guards over a Candy Machine

## Core Candy Machine Rust Crate

The `mpl-core-candy-machine-core` crate is the core component of the [Core Candy Machine](/smart-contracts/core-candy-machine) program, providing initialization and management of Candy Machines on Solana.

### Installation

The `mpl-core-candy-machine-core` Rust crate can be used in both scripts/desktop/mobile applications as well as with Solana onchain programs.

```rust
cargo add mpl-core-candy-machine-core
```

{% quick-links %}

{% quick-link title="crates.io" target="_blank" icon="Rust" href="https://crates.io/crates/mpl-core-candy-machine-core" description="Get started with our Rust SDK for MPL Core Candy Machine." /%}

{% quick-link title="docs.rs" target="_blank" icon="Rust" href="https://docs.rs/mpl-core-candy-machine-core/" description="The Rust SDK typedoc platform for Core Candy Machine crate." /%}

{% /quick-links %}

## Core Candy Guard Rust Crate

The `mpl-core-candy-guard` crate enables creating and managing [Core Candy Guards](/smart-contracts/core-candy-machine/guards) that can be wrapped over a Core Candy Machine to enforce minting conditions.

### Installation

The `mpl-core-candy-guard` Rust crate can be used in both scripts/desktop/mobile applications as well as with Solana onchain programs.

```rust
cargo add mpl-core-candy-guard
```

{% quick-links %}

{% quick-link title="crates.io" target="_blank" icon="Rust" href="https://crates.io/crates/mpl-core-candy-guard" description="Get started with our Rust SDK for Core Candy Guards." /%}

{% quick-link title="docs.rs" target="_blank" icon="Rust" href="https://docs.rs/mpl-core-candy-guard" description="The Rust SDK typedoc platform for Core Candy Guards crate." /%}

{% /quick-links %}

## Notes

- Both crates can be used for onchain program development (CPI calls) and for off-chain client scripts.
- The `mpl-core-candy-machine-core` and `mpl-core-candy-guard` crates are separate packages. Install both if you need full Candy Machine and guard functionality.
- Refer to the [docs.rs documentation](https://docs.rs/mpl-core-candy-machine-core/) for detailed type and function signatures.

