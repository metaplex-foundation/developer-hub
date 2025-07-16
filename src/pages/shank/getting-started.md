---
title: Getting Started with Shank
metaTitle: Getting Started | Shank
description: Learn how to install and set up Shank for IDL extraction from Rust Solana programs
---

This guide will walk you through setting up Shank and extracting your first IDL from a Rust Solana program.

## Prerequisites

Before getting started with Shank, ensure you have:

- Rust toolchain installed (1.56.0 or later)
- Cargo package manager
- A Solana program written in Rust
- Basic familiarity with Solana program development

## Installation

### Installing Shank CLI

Install the Shank command-line tool using Cargo:

```bash
cargo install shank-cli
```

Verify the installation:

```bash
shank --version
```

### Adding Shank to Your Project

Add Shank as a dependency in your `Cargo.toml`:

```toml
[dependencies]
shank = "0.4"

[build-dependencies]
shank-cli = "0.4"
```

## Your First Shank Project

### 1. Annotate Your Program

Start by adding Shank derive macros to your existing Solana program:

```rust
use shank::ShankInstruction;

#[derive(ShankInstruction)]
#[rustfmt::skip]
pub enum MyProgramInstruction {
    /// Creates a new account with the given name
    #[account(0, writable, signer, name="user", desc="User account")]
    #[account(1, writable, name="account", desc="Account to create")]
    #[account(2, name="system_program", desc="System program")]
    CreateAccount {
        name: String,
        space: u64,
    },
    
    /// Updates an existing account
    #[account(0, writable, signer, name="authority", desc="Account authority")]
    #[account(1, writable, name="account", desc="Account to update")]
    UpdateAccount {
        new_name: String,
    },
}
```

### 2. Annotate Account Structures

Add `ShankAccount` to your account structs:

```rust
use shank::ShankAccount;

#[derive(ShankAccount)]
pub struct UserAccount {
    pub name: String,
    pub created_at: i64,
    pub authority: Pubkey,
}
```

### 3. Extract IDL

Run the Shank CLI to extract the IDL:

```bash
shank idl --out-dir ./target/idl --crate-root ./
```

This will generate an IDL file (e.g., `my_program.json`) in the `./target/idl` directory.

### 4. Verify the Output

Check the generated IDL file:

```bash
cat ./target/idl/my_program.json
```

You should see a JSON structure containing your program's instructions, accounts, and types.

## Project Structure

A typical Shank-enabled project structure looks like:

```
my-solana-program/
├── Cargo.toml
├── src/
│   ├── lib.rs
│   ├── instruction.rs    # Contains ShankInstruction enums
│   ├── state.rs         # Contains ShankAccount structs
│   └── processor.rs     # Program logic
├── target/
│   └── idl/
│       └── my_program.json  # Generated IDL
└── sdk/                 # Generated TypeScript SDK (optional)
    └── ...
```

## Core Components

Shank consists of several interconnected crates:

- **shank**: Top-level crate providing macro annotations
- **shank-cli**: Command-line tool for IDL extraction
- **shank-macro**: Derive macros for code generation
- **shank-idl**: Processes files and converts annotations to IDL
- **shank-render**: Generates Rust implementation blocks

## Key Features

### Derive Macros

Shank provides five essential derive macros for annotating your Solana program code:

1. **`ShankAccount`**: Annotates structs representing accounts with serializable data
   - Supports `#[idl_type()]` for type overrides
   - Supports `#[padding]` for padding fields
   - Works with Borsh serialization

2. **`ShankBuilder`**: Generates instruction builders for each annotated instruction
   - Creates builder pattern implementations
   - Simplifies instruction construction

3. **`ShankContext`**: Creates account structs for instructions
   - Generates context structures for program instructions
   - Integrates with Anchor framework patterns

4. **`ShankInstruction`**: Annotates the program's instruction enum
   - Uses `#[account()]` attributes to specify account requirements
   - Supports account mutability, signer requirements, and descriptions
   - Generates comprehensive instruction metadata

5. **`ShankType`**: Marks structs or enums with serializable data
   - Used for custom types referenced in accounts or instructions
   - Ensures proper IDL generation for complex data structures

### Integration with Metaplex Ecosystem

Shank integrates seamlessly with other Metaplex tools:

- **[Kinobi](/umi/kinobi)**: Uses Shank JS library for IDL generation and client creation
- **[Solita](/legacy-documentation/developer-tools/solita)**: Generates TypeScript SDKs from Shank-extracted IDLs

## CLI Usage

Once you have Shank installed and your program annotated, extract IDL with:

```bash
# Basic IDL extraction
shank idl --out-dir ./target/idl --crate-root ./

# Extract IDL for a specific crate
shank idl --out-dir ./idl --crate-root ./my-program

# Generate IDL with custom program ID
shank idl --out-dir ./idl --crate-root ./ --program-id MyProgram111111111111111111111111111111
```

## Next Steps

Now that you have Shank set up and generating IDL files, you can:

1. **[Macros Reference](/shank/macros)**: Complete reference for all Shank macros and attributes
2. **[Integration with Kinobi](/umi/kinobi)**: Generate modern TypeScript SDKs compatible with Umi (recommended)
3. **[Solita](https://github.com/metaplex-foundation/solita)**: Generate legacy TypeScript SDKs compatible with web3.js

## Troubleshooting

### Common Issues

**IDL generation fails with parsing errors:**
- Ensure your Rust code compiles successfully
- Check that all derive macros are properly imported
- Verify account annotations are correctly formatted

**Missing accounts in generated IDL:**
- Make sure structs are annotated with `#[derive(ShankAccount)]`
- Check that the struct is public and accessible

**Build script errors:**
- Ensure `shank-cli` is installed and available in PATH
- Verify build script permissions and execution rights

For more help, visit our [GitHub repository](https://github.com/metaplex-foundation/shank) or join the [Metaplex Discord](https://discord.gg/metaplex).