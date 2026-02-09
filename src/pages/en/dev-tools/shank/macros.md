---
title: Shank Macros Reference
metaTitle: Shank Macros Reference | Metaplex Developer Hub
description: Complete reference for Shank derive macros and attributes used in Solana programs
---

Shank provides several macros used to annotate Solana Rust programs for IDL extraction:

## ShankAccount

Annotates a *struct* that shank will consider an account containing de/serializable data.

```rust
#[derive(Clone, BorshSerialize, BorshDeserialize, ShankAccount)]
pub struct Metadata {
    pub update_authority: Pubkey,
    pub mint: Pubkey,
    pub primary_sale_happened: bool,
}
```

### Field Attributes

#### `#[idl_type(...)]` Attribute

This attribute allows overriding how Shank interprets a field's type when generating the IDL. Useful for:

1. Fields with wrapper types that should be treated as their inner types
2. Fields storing enum values as primitives
3. Fields with complex types needing simpler representations

Supports two formats:
- String literal: `#[idl_type("TypeName")]`
- Direct type: `#[idl_type(TypeName)]`

```rust
#[derive(Clone, BorshSerialize, BorshDeserialize, ShankAccount)]
pub struct MyAccount {
    // Field stored as u8 but representing an enum
    #[idl_type("MyEnum")]
    pub enum_as_byte: u8,

    // Field with a wrapper type treated as a simpler type
    #[idl_type("u64")]
    pub wrapped_u64: CustomU64Wrapper,
}
```

#### `#[padding]` Attribute

Indicates that a field is used for padding and should be marked as such in the IDL.

```rust
#[derive(Clone, BorshSerialize, BorshDeserialize, ShankAccount)]
pub struct PaddedAccount {
    pub active_field: u64,
    
    #[padding]
    pub unused_space: [u8; 32],
    
    pub another_field: String,
}
```

**Note**: The fields of a *ShankAccount* struct can reference other types as long as they are annotated with `BorshSerialize`, `BorshDeserialize`, or `ShankType`.

## ShankInstruction

Annotates the program *Instruction* `Enum` to include `#[account]` attributes.

```rust
#[derive(Debug, Clone, ShankInstruction, BorshSerialize, BorshDeserialize)]
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

### `#[account]` Attribute

Configures accounts for each instruction variant. The attribute follows this format:

```rust
#[account(index, mutability?, signer?, name="account_name", desc="Account description")]
```

Where:
- `index`: The position of the account in the accounts array (0-based)
- `mutability?`: Optional. Use `writable` if the account will be modified
- `signer?`: Optional. Use `signer` if the account must sign the transaction
- `name="account_name"`: Required. The name of the account
- `desc="Account description"`: Optional. A description of the account's purpose

### Account Attribute Examples

```rust
// Read-only account
#[account(0, name="mint", desc="Mint account")]

// Writable account
#[account(1, writable, name="token_account", desc="Token account to modify")]

// Signer account
#[account(2, signer, name="owner", desc="Account owner")]

// Writable signer account
#[account(3, writable, signer, name="authority", desc="Program authority")]

// Optional account
#[account(4, optional, name="delegate", desc="Optional delegate account")]
```

## ShankType

Marks structs or enums with serializable data that are used as custom types in accounts or instructions.

```rust
#[derive(Clone, BorshSerialize, BorshDeserialize, ShankType)]
pub enum TokenState {
    Uninitialized,
    Initialized,
    Frozen,
}

#[derive(Clone, BorshSerialize, BorshDeserialize, ShankType)]
pub struct Creator {
    pub address: Pubkey,
    pub verified: bool,
    pub share: u8,
}
```

## ShankBuilder

Generates instruction builders for each annotated instruction, creating builder pattern implementations that simplify instruction construction.

```rust
#[derive(Debug, Clone, ShankInstruction, ShankBuilder, BorshSerialize, BorshDeserialize)]
pub enum MyInstruction {
    CreateAccount { name: String, space: u64 },
}
```

This generates builder methods that allow for fluent instruction creation.

## ShankContext

Creates account structs for instructions, generating context structures for program instructions that integrate with Anchor framework patterns.

```rust
#[derive(Debug, Clone, ShankInstruction, ShankContext, BorshSerialize, BorshDeserialize)]
pub enum MyInstruction {
    #[account(0, writable, signer, name="payer")]
    #[account(1, writable, name="account")]
    CreateAccount { name: String },
}
```

This generates context structs that match the account requirements defined in the instruction.

## Best Practices

1. **Always use descriptive names** in `#[account]` attributes
2. **Include descriptions** for better documentation
3. **Use `#[idl_type()]` sparingly** - only when type overrides are necessary
4. **Mark padding fields** appropriately with `#[padding]`
5. **Ensure all referenced types** are properly annotated with Borsh traits
6. **Group related macros** when they work together (e.g., `ShankInstruction` + `ShankBuilder`)

## Common Patterns

### Account with Custom Types

```rust
#[derive(Clone, BorshSerialize, BorshDeserialize, ShankAccount)]
pub struct TokenAccount {
    pub mint: Pubkey,
    pub owner: Pubkey,
    pub amount: u64,
    pub state: TokenState, // References ShankType
}

#[derive(Clone, BorshSerialize, BorshDeserialize, ShankType)]
pub enum TokenState {
    Uninitialized,
    Initialized,
    Frozen,
}
```

### Complete Instruction Definition

```rust
#[derive(Debug, Clone, ShankInstruction, BorshSerialize, BorshDeserialize)]
#[rustfmt::skip]
pub enum TokenInstruction {
    /// Transfer tokens between accounts
    #[account(0, writable, name="source", desc="Source token account")]
    #[account(1, writable, name="destination", desc="Destination token account")]
    #[account(2, signer, name="owner", desc="Owner of source account")]
    Transfer {
        amount: u64,
    },
}
```

This reference covers all the essential Shank macros and their usage patterns for effective IDL generation from Solana programs.
