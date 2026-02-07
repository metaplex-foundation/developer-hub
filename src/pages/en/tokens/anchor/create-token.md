---
title: How to Create a Token with Rust and Anchor
metaTitle: Create a Token with Anchor | Solana Tokens
description: Learn how to create an SPL token with metadata on Solana using Rust, the Anchor framework, and Metaplex Token Metadata.
created: '01-18-2026'
updated: null
---

This guide demonstrates how to create a fungible token with metadata on Solana using **Rust**, the **Anchor** framework, and the **Metaplex Token Metadata** program via CPI. {% .lead %}

{% callout title="What You'll Build" %}

A single Anchor instruction that:
- Creates a new SPL token mint
- Creates the associated token account for the payer
- Creates a metadata account with name, symbol, and URI
- Mints an initial token supply to the payer

{% /callout %}

## Summary

Create a **fungible SPL token** on Solana with **Anchor (Rust)**, mint an initial supply, and attach **Metaplex Token Metadata** (name, symbol, URI) via CPI.

- One instruction: init **mint + ATA + metadata**, then mint supply
- Uses: SPL Token + Metaplex Token Metadata CPI
- Tested: Anchor 0.32.1, Solana Agave 3.1.6
- Fungible only; NFTs need Master Edition + `decimals=0` + `supply=1`

## Out of Scope

Token-2022 extensions, confidential transfers, authority revocation, metadata updates, full NFT flow, mainnet deployment.

## Quick Start

**Jump to:** [Program](#the-program) · [Test Client](#the-client) · [Common Errors](#common-errors)

1. `anchor init anchor-spl-token`
2. Add `anchor-spl` with `metadata` feature to `Cargo.toml`
3. Clone Token Metadata program in `Anchor.toml` for localnet
4. Paste the program code and run `anchor test`

## Prerequisites

- **Rust** installed ([rustup.rs](https://rustup.rs))
- **Solana CLI** installed ([docs.solana.com](https://docs.solana.com/cli/install-solana-cli-tools))
- **Anchor CLI** installed (`cargo install --git https://github.com/coral-xyz/anchor anchor-cli`)
- **Node.js** and **Yarn** for running tests
- A Solana wallet with SOL for transaction fees

## Tested Configuration

This guide was tested with the following versions:

| Tool | Version |
|------|---------|
| Anchor CLI | 0.32.1 |
| Solana CLI | 3.1.6 (Agave) |
| Rust | 1.92.0 |
| Node.js | 22.15.1 |
| Yarn | 1.22.x |

## Initial Setup

Start by initializing a new Anchor project:

```bash
anchor init anchor-spl-token
cd anchor-spl-token
```

### Configure Cargo.toml

Update `programs/anchor-spl-token/Cargo.toml`:

```toml {% title="programs/anchor-spl-token/Cargo.toml" showLineNumbers=true highlightLines="22,24-26" %}
[package]
name = "anchor-spl-token"
version = "0.1.0"
description = "Created with Anchor"
edition = "2021"

[lib]
crate-type = ["cdylib", "lib"]
name = "anchor_spl_token"

[lints.rust]
unexpected_cfgs = { level = "warn", check-cfg = [
    'cfg(feature, values("custom-heap", "custom-panic", "anchor-debug"))'
] }

[features]
default = []
cpi = ["no-entrypoint"]
no-entrypoint = []
no-idl = []
no-log-ix-name = []
idl-build = ["anchor-lang/idl-build", "anchor-spl/idl-build"]

[dependencies]
anchor-lang = "0.32.1"
anchor-spl = { version = "0.32.1", features = ["token", "metadata", "associated_token"] }
```

{% callout title="Important" %}

The `idl-build` feature **must** include `anchor-spl/idl-build` or you'll get errors like `no function or associated item named 'create_type' found for struct 'anchor_spl::token::Mint'`.

{% /callout %}

### Configure Anchor.toml

Update `Anchor.toml` to clone the Token Metadata program for local testing:

```toml {% title="Anchor.toml" showLineNumbers=true highlightLines="23,25-26" %}
[toolchain]
package_manager = "yarn"

[features]
resolution = true
skip-lint = false

[programs.localnet]
anchor_spl_token = "YOUR_PROGRAM_ID_HERE"

[registry]
url = "https://api.apr.dev"

[provider]
cluster = "localnet"
wallet = "~/.config/solana/id.json"

[scripts]
test = "yarn run ts-mocha -p ./tsconfig.json -t 1000000 tests/**/*.ts"

[test.validator]
url = "https://api.mainnet-beta.solana.com"
bind_address = "127.0.0.1"

[[test.validator.clone]]
address = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
```

{% callout %}

- `bind_address = "127.0.0.1"` is required for Agave 3.x validators (0.0.0.0 causes a panic)
- The `[[test.validator.clone]]` section clones the Metaplex Token Metadata program from mainnet

{% /callout %}

### Configure package.json

```json {% title="package.json" showLineNumbers=true %}
{
  "license": "ISC",
  "scripts": {
    "lint:fix": "prettier */*.js \"*/**/*{.js,.ts}\" -w",
    "lint": "prettier */*.js \"*/**/*{.js,.ts}\" --check"
  },
  "dependencies": {
    "@coral-xyz/anchor": "^0.32.1",
    "@metaplex-foundation/mpl-token-metadata": "^3.4.0",
    "@solana/spl-token": "^0.4.9"
  },
  "devDependencies": {
    "chai": "^4.3.4",
    "mocha": "^9.0.3",
    "ts-mocha": "^10.0.0",
    "@types/bn.js": "^5.1.0",
    "@types/chai": "^4.3.0",
    "@types/mocha": "^9.0.0",
    "typescript": "^5.7.3",
    "prettier": "^2.6.2"
  }
}
```

## The Program

### Imports and Template

Here we define all the imports and create the template for the Account struct and instruction in `programs/anchor-spl-token/src/lib.rs`:

```rust {% title="programs/anchor-spl-token/src/lib.rs" showLineNumbers=true highlightLines="1-10" %}
use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{
        create_metadata_accounts_v3, mpl_token_metadata::types::DataV2, CreateMetadataAccountsV3,
        Metadata,
    },
    token::{mint_to, Mint, MintTo, Token, TokenAccount},
};

declare_id!("YOUR_PROGRAM_ID_HERE");

#[program]
pub mod anchor_spl_token {
    use super::*;

    pub fn create_token(
        ctx: Context<CreateToken>,
        name: String,
        symbol: String,
        uri: String,
        decimals: u8,
        amount: u64,
    ) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(name: String, symbol: String, uri: String, decimals: u8)]
pub struct CreateToken<'info> {

}
```

### Creating the Account Struct

The `CreateToken` struct defines all accounts required by the instruction and applies the necessary constraints:

```rust {% title="programs/anchor-spl-token/src/lib.rs" showLineNumbers=true highlightLines="2,6-14,16-22,26-34" %}
#[derive(Accounts)]
#[instruction(name: String, symbol: String, uri: String, decimals: u8)]
pub struct CreateToken<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    /// The mint account to be created
    #[account(
        init,
        payer = payer,
        mint::decimals = decimals,
        mint::authority = payer.key(),
        mint::freeze_authority = payer.key(),
    )]
    pub mint: Account<'info, Mint>,

    /// The associated token account to receive minted tokens
    #[account(
        init,
        payer = payer,
        associated_token::mint = mint,
        associated_token::authority = payer,
    )]
    pub token_account: Account<'info, TokenAccount>,

    /// The metadata account to be created
    /// CHECK: Validated by seeds constraint to be the correct PDA
    #[account(
        mut,
        seeds = [
            b"metadata",
            token_metadata_program.key().as_ref(),
            mint.key().as_ref(),
        ],
        bump,
        seeds::program = token_metadata_program.key(),
    )]
    pub metadata_account: UncheckedAccount<'info>,

    pub token_program: Program<'info, Token>,
    pub token_metadata_program: Program<'info, Metadata>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}
```

**Account Types:**
- The `#[instruction(...)]` attribute allows using instruction arguments (like `decimals`) in account constraints
- `mint` uses Anchor's `init` constraint with `mint::decimals = decimals` to create the token mint with the specified decimal places
- `token_account` is initialized as an associated token account using `associated_token::` helpers
- `metadata_account` uses `seeds::program` to validate the PDA belongs to the Token Metadata program

### Creating the Instruction

The `create_token` function creates the metadata account via CPI and mints the initial token supply:

```rust {% title="programs/anchor-spl-token/src/lib.rs" showLineNumbers=true highlightLines="14-40,43-54" %}
pub fn create_token(
    ctx: Context<CreateToken>,
    name: String,
    symbol: String,
    uri: String,
    decimals: u8,
    amount: u64,
) -> Result<()> {
    msg!("Creating token mint...");
    msg!("Mint: {}", ctx.accounts.mint.key());
    msg!("Creating metadata account...");
    msg!("Metadata account address: {}", ctx.accounts.metadata_account.key());

    // Cross Program Invocation (CPI) to token metadata program
    create_metadata_accounts_v3(
        CpiContext::new(
            ctx.accounts.token_metadata_program.to_account_info(),
            CreateMetadataAccountsV3 {
                metadata: ctx.accounts.metadata_account.to_account_info(),
                mint: ctx.accounts.mint.to_account_info(),
                mint_authority: ctx.accounts.payer.to_account_info(),
                update_authority: ctx.accounts.payer.to_account_info(),
                payer: ctx.accounts.payer.to_account_info(),
                system_program: ctx.accounts.system_program.to_account_info(),
                rent: ctx.accounts.rent.to_account_info(),
            },
        ),
        DataV2 {
            name,
            symbol,
            uri,
            seller_fee_basis_points: 0,
            creators: None,
            collection: None,
            uses: None,
        },
        true,  // is_mutable
        true,  // update_authority_is_signer
        None,  // collection_details
    )?;

    // Mint tokens to the payer's associated token account
    msg!("Minting {} tokens to {}", amount, ctx.accounts.token_account.key());

    mint_to(
        CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            MintTo {
                mint: ctx.accounts.mint.to_account_info(),
                to: ctx.accounts.token_account.to_account_info(),
                authority: ctx.accounts.payer.to_account_info(),
            },
        ),
        amount,
    )?;

    msg!("Token created and {} tokens minted successfully.", amount);
    Ok(())
}
```

The function performs two Cross-Program Invocations:
1. `create_metadata_accounts_v3` (lines 14-40) - Creates and initializes the metadata account with name, symbol, and URI
2. `mint_to` (lines 43-54) - Mints the specified amount to the payer's token account

## The Client

Before testing, build the program:

```bash
anchor build
```

Get your program ID and update it in both `lib.rs` and `Anchor.toml`:

```bash
solana address -k target/deploy/anchor_spl_token-keypair.json
```

Then rebuild and deploy:

```bash
anchor build
anchor deploy
```

### Creating the Test

Create the test file at `tests/anchor-spl-token.ts`:

```typescript {% title="tests/anchor-spl-token.ts" showLineNumbers=true highlightLines="17-27,39-53" %}
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { AnchorSplToken } from "../target/types/anchor_spl_token";
import { Keypair, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, ASSOCIATED_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { BN } from "bn.js";

const TOKEN_METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

describe("anchor-spl-token", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.AnchorSplToken as Program<AnchorSplToken>;
  const payer = provider.wallet;

  it("Creates a token with metadata and mints initial supply", async () => {
    const mintKeypair = Keypair.generate();

    const tokenName = "My Token";
    const tokenSymbol = "MYTKN";
    const tokenUri = "https://example.com/token-metadata.json";
    const tokenDecimals = 9;
    const mintAmount = new BN(1_000_000).mul(new BN(10).pow(new BN(tokenDecimals)));

    // Derive the metadata account PDA
    const [metadataAccount] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintKeypair.publicKey.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    );

    // Derive the associated token account
    const tokenAccount = getAssociatedTokenAddressSync(
      mintKeypair.publicKey,
      payer.publicKey
    );

    console.log("Mint address:", mintKeypair.publicKey.toBase58());
    console.log("Metadata address:", metadataAccount.toBase58());
    console.log("Token account:", tokenAccount.toBase58());

    const tx = await program.methods
      .createToken(tokenName, tokenSymbol, tokenUri, tokenDecimals, mintAmount)
      .accountsPartial({
        payer: payer.publicKey,
        mint: mintKeypair.publicKey,
        tokenAccount: tokenAccount,
        metadataAccount: metadataAccount,
        tokenProgram: TOKEN_PROGRAM_ID,
        tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: SYSVAR_RENT_PUBKEY,
      })
      .signers([mintKeypair])
      .rpc();

    console.log("Transaction signature:", tx);
    console.log("Token created and minted successfully!");
  });
});
```

**Key Points:**
- The metadata account PDA is derived using seeds: `["metadata", TOKEN_METADATA_PROGRAM_ID, mint_pubkey]` (lines 29-36)
- The associated token account is derived using `getAssociatedTokenAddressSync` (lines 39-42)
- The mint keypair must be passed as a signer since it's being initialized
- Use `accountsPartial` to specify accounts (Anchor 0.32+ syntax)
- Use `BN` for large numbers (token amounts with decimals)
- `tokenDecimals` is passed to the instruction and used to calculate the mint amount

### Running the Test

```bash
yarn install
anchor test
```

Expected output:

```
  anchor-spl-token
Mint address: GpPyH2FuMcS5PcrKWtrmEkBmW8h8gSwUaxNCQkFXwifV
Metadata address: 6jskfrDAmH9d67iL37CLNBK7Hf6FRwNZbq34q4vGucDq
Token account: J3KCxCfmnK9RJ3onmiUsfBDjvKyuVsAXgWvuypsaFQ2i
Transaction signature: 36v63t5cCsXYM8ny4pgahh...
Token created and minted successfully!
    ✔ Creates a token with metadata and mints initial supply (243ms)

  1 passing (245ms)
```

## Metadata JSON Format

The `uri` field should point to a JSON file containing your token's off-chain metadata:

```json {% title="token-metadata.json" %}
{
  "name": "My Token",
  "symbol": "MYTKN",
  "description": "A description of my token",
  "image": "https://example.com/token-image.png"
}
```

Host this JSON file on a permanent storage solution like Arweave or IPFS.

## Common Errors

### `no function or associated item named 'create_type' found`

Add `"anchor-spl/idl-build"` to the `idl-build` feature in Cargo.toml:

```toml
idl-build = ["anchor-lang/idl-build", "anchor-spl/idl-build"]
```

### `Program account is not executable`

Clone the Token Metadata program in Anchor.toml:

```toml
[[test.validator.clone]]
address = "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
```

### `UnspecifiedIpAddr(0.0.0.0)` / Validator panic

Add `bind_address = "127.0.0.1"` to `[test.validator]` in Anchor.toml.

## Notes

- The `amount` parameter is in **base units** (includes decimals). For 1 million tokens with 9 decimals, pass `1_000_000 * 10^9`.
- This example keeps **mint authority** and **freeze authority** on the payer. Production tokens often revoke or transfer these authorities after initial minting.
- The metadata account is **mutable** (`is_mutable = true`). Set to `false` if you want immutable metadata.

## Next Steps

- **Deploy to Devnet:** Change `cluster = "devnet"` in Anchor.toml and run `anchor deploy`
- **Create an NFT:** Set `decimals = 0` and `supply = 1` for non-fungible tokens
- **Add Token Extensions:** Explore [SPL Token 2022](https://spl.solana.com/token-2022) for transfer fees, interest-bearing tokens, and more
- **Learn more about Token Metadata:** See the [Token Metadata documentation](/smart-contracts/token-metadata)

## Quick Reference

### Key Program IDs

| Program | Address |
|---------|---------|
| Token Program | `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA` |
| Associated Token Program | `ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL` |
| Token Metadata Program | `metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s` |
| System Program | `11111111111111111111111111111111` |

### Metadata PDA Seeds

{% dialect-switcher title="Deriving the Metadata PDA" %}
{% dialect title="TypeScript" id="ts" %}

```typescript {% showLineNumbers=true %}
const [metadataAccount] = PublicKey.findProgramAddressSync(
  [Buffer.from("metadata"), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
  TOKEN_METADATA_PROGRAM_ID
);
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust {% showLineNumbers=true %}
seeds = [b"metadata", token_metadata_program.key().as_ref(), mint.key().as_ref()]
```

{% /dialect %}
{% /dialect-switcher %}

### Minimum Dependencies

```toml {% title="Cargo.toml" %}
anchor-lang = "0.32.1"
anchor-spl = { version = "0.32.1", features = ["token", "metadata", "associated_token"] }
```

## FAQ

{% callout title="Terminology" %}
- **Fungible token:** `decimals >= 0`, unlimited supply potential
- **NFT:** `decimals = 0`, `supply = 1`, plus Master Edition account
- **Token Metadata:** Metaplex program used for both fungible tokens and NFTs
- **SPL:** Solana Program Library, the standard token interface
{% /callout %}

### What is an SPL token?

An SPL token is Solana's equivalent of an ERC-20 token on Ethereum. SPL stands for Solana Program Library. SPL tokens are fungible tokens that can represent currencies, governance tokens, stablecoins, or any other fungible asset on Solana.

### What is the difference between a token mint and a token account?

- **Token Mint:** The factory that creates tokens. It defines the token's properties (decimals, supply, authorities). There is one mint per token type.
- **Token Account:** A wallet that holds tokens. Each user needs their own token account for each token type they want to hold.

### What is an Associated Token Account (ATA)?

An Associated Token Account is a deterministically-derived token account for a given wallet and mint. Instead of creating random token accounts, ATAs use a standard derivation so anyone can calculate the token account address for any wallet. This is the recommended way to handle token accounts.

### What is Metaplex Token Metadata?

Metaplex Token Metadata is a program that attaches metadata (name, symbol, image URI) to SPL tokens. Without it, tokens are just anonymous mints. The metadata is stored in a Program Derived Address (PDA) associated with the mint.

### Why clone the Token Metadata program for local testing?

The local Solana test validator starts with a clean state and doesn't include any programs except the core Solana programs. Metaplex Token Metadata is a separate program deployed on mainnet, so you need to clone it to use it locally.

### Can I use this code to create an NFT?

Yes, with modifications:
- Set `mint::decimals = 0` (NFTs are indivisible)
- Mint exactly 1 token
- Remove mint authority after minting (so no more can be created)
- Add a Master Edition account (for Metaplex NFT standard)

### How much does it cost to create a token on Solana?

Creating a token requires rent for three accounts:
- Mint account: ~0.00145 SOL
- Token account: ~0.00203 SOL
- Metadata account: ~0.01 SOL

Total: approximately 0.015-0.02 SOL (varies with rent prices).

### What's the difference between Anchor and native Solana Rust?

Anchor is a framework that simplifies Solana development by:
- Auto-generating account serialization/deserialization
- Providing declarative account validation with macros
- Generating TypeScript clients automatically
- Handling common patterns like PDAs and CPIs

Native Solana Rust requires manually handling all of these concerns.

## Glossary

| Term | Definition |
|------|------------|
| **SPL Token** | Solana Program Library token standard, equivalent to ERC-20 |
| **Mint** | The account that defines a token and can create new supply |
| **Token Account** | An account that holds a balance of a specific token |
| **ATA** | Associated Token Account - deterministic token account for a wallet |
| **PDA** | Program Derived Address - an address derived from seeds, owned by a program |
| **CPI** | Cross-Program Invocation - calling one Solana program from another |
| **Anchor** | A Rust framework for building Solana programs |
| **Metaplex** | Protocol for NFTs and token metadata on Solana |
| **IDL** | Interface Definition Language - describes a program's interface |
| **Rent** | SOL required to keep an account alive on Solana |
