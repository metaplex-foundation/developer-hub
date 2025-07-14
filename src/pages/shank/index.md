---
title: Shank
metaTitle: Shank | Metaplex Developer Hub
description: Extract IDLs from Rust Solana program code using attribute macros
---

Shank is a collection of Rust crates designed to extract Interface Definition Language (IDL) from Solana program code annotated with Shank attribute macros. The extracted IDL can then be used to generate TypeScript SDKs and facilitate interaction with Solana programs.

Shank simplifies the development workflow for Solana programs by automating the generation of IDL files, which serve as a bridge between your Rust program code and client-side SDKs.

## Quick Start
1. Install Shank CLI: `cargo install shank-cli`
2. Add Shank to your project: `shank = "0.4"`
3. Annotate your program with `ShankAccount` and `ShankInstruction` macros
4. Extract IDL: `shank idl --out-dir ./target/idl --crate-root ./`

## Key Features

- **Five derive macros** for annotating Solana programs (`ShankAccount`, `ShankInstruction`, `ShankBuilder`, `ShankContext`, `ShankType`)
- **Automatic IDL generation** from annotated Rust code
- **TypeScript SDK generation** via integration with Solita and Kinobi
- **Borsh serialization support** with type overrides and padding fields
- **Comprehensive account metadata** including mutability, signer requirements, and descriptions

## Documentation

- **[Getting Started](/shank/getting-started)** - Installation, setup, detailed usage guide, and comprehensive examples

## Integration

Shank integrates seamlessly with other Metaplex tools:
- **[Kinobi](/umi/kinobi)** - Modern IDL generation and client creation
- **[Solita](/legacy-documentation/developer-tools/solita)** - TypeScript SDK generation

## Resources

- [GitHub Repository](https://github.com/metaplex-foundation/shank)
- [Rust Crate](https://docs.rs/shank)
- [CLI Crate](https://docs.rs/shank-cli)
- [Discord Community](https://discord.gg/metaplex)
