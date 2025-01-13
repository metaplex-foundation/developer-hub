---
title: How to Create a Token Claimer Smart Contract leveraging Merkle Tree
metaTitle: How to Create a Token Claimer Smart Contract | Token Metadata Guides
description: Learn how to create a Token Claimer Smart Contract on Solana leveraging Merkle Trees and using Anchor!
# remember to update dates also in /components/guides/index.js
created: '01-13-2025'
updated: '01-13-2025'
---

This guide leverages the use of Merkle Trees and Compression to create a low-cost Token Claimer for Token Metadata Tokens using Anchor.

## Prerequisite

Before starting to learn more about how the Token Claimer works, we should look into how Compression and Merkle Trees work to really understand what is going on inside of the smart contract.

### Merkle Trees

A Merkle tree is a binary tree used to efficiently represent a set of data. Each leaf node in the tree is a hash of individual data (e.g., an address and token amount). Parent nodes are created by hashing pairs of child nodes, continuing up the tree until reaching the root, which serves as a compact and tamper-proof representation of the entire dataset.

**Example**: Suppose we have four data entries: A, B, C, and D. The Merkle tree structure is built as follows:

- **Leaf Nodes**: Each entry is hashed:
```
Hash(A), Hash(B), Hash(C), Hash(D)
```

- **Parent Nodes**: Pairs of leaf nodes are combined and hashed:
```
Parent1 = Hash(Hash(A) + Hash(B))
Parent2 = Hash(Hash(C) + Hash(D))
```

- **Root Node**: The final hash is computed from the parent nodes:
```
Root = Hash(Parent1 + Parent2)
```

Merkle trees are a cornerstone of on-chain compression, enabling efficient and secure data verification. By design, altering any part of the dataset invalidates the root, which means the integrity of a specific entry can be verified by storing only the Merkle root on-chain and providing a Merkle Proof—a minimal set of sibling hashes needed to reconstruct the root.

- **Key Advantages**: Cost-Efficient Storage: Only the Merkle root (32 bytes) is stored on-chain, significantly reducing storage costs. Verification is achieved by passing Merkle proofs as inputs.
- **Scalability**: Proof sizes grow logarithmically with the number of entries, making this method ideal for managing large datasets.
- **Privacy and Efficiency**: Entire Merkle trees can be generated and managed off-chain, keeping the full dataset private. Programs like Compressed NFTs use this approach with Solana’s noop program, optimizing performance while maintaining privacy.

### Concurrent Merkle Tree

Solana's state compression employs a unique type of Merkle tree that enables multiple changes to a tree while preserving its integrity and validity.

This specialized tree, called a concurrent Merkle tree, maintains an on-chain changelog, allowing multiple rapid updates to the same tree (e.g., all within the same block) without invalidating proofs.

This functionality is crucial because, on Solana, only one writer per block is allowed per account, meaning only a single change can be made to an account per block, while multiple readers are permitted. The runtime ensures that the account remains secure and cannot be corrupted. However, since every action involves writing—because the Merkle root must be re-uploaded—the concurrent Merkle tree provides a solution for handling multiple updates seamlessly within the same block.

## Setup 

- Code Editor of your choice (recommended **Visual Studio Code** with the **Rust Analyzer Plugin**)
- Anchor **0.30.1** or above.

Additionally, in this guide we’re going to leverage a mono-file approach to **Anchor** where all the necessary macros can be found in the `lib.rs` file:
- `declare_id`: Specifies the program's on-chain address.
- `#[program]`: Specifies the module containing the program’s instruction logic.
- `#[derive(Accounts)]`: Applied to structs to indicate a list of accounts required for an instruction.
- `#[account]`: Applied to structs to create custom account types specific to the program.

**Note**: You may need to modify and move functions around to suit your needs.

### Initializing the Program

Start by initializing a new project (optional) using `avm` (Anchor Version Manager). To initialize it, run the following command in your terminal

```
anchor init token-claimer-example
```

### Required Crates

In this guide, we'll use the `svm_merkle_tree` crate an optimized version for creating and managing merkle trees for the SVM. To install it, first navigate to the `token-claimer-example` directory:

```
cd token-claimer-example
```

Then run the following command to install the merkle tree crate:

```
cargo add svm_merkle_tree
```

And then we run the following command to install the anchor-spl to interact with the Token Program:

```
cargo add anchor-spl
```

## The program

{% callout title = "Disclaimer" %}

This example is not a full-fledged implementation suitable for production. To make it production-ready, several additional components and considerations are necessary:

- **Event Emission**: Use the `event!()` macro to emit events for important actions, such as successful claims or updates to the Merkle root. Alternatively, you can integrate with Solana's noop program to log updates and facilitate data indexing for off-chain applications.

- **Database Hosting**: You'll need to store and host the complete Merkle tree dataset off-chain and derive hashes for leaves and internal nodes other than generate and serve Merkle proofs dynamically and validate input consistency for claims.

{% /callout %}

### Imports and Templates

Here we're going to define all the imports for this particular guide and create the template for the Account struct and instruction in our `lib.rs` file. 

```rust
use anchor_lang::prelude::*;

use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{mint_to, set_authority, transfer, Mint, MintTo, SetAuthority, Token, TokenAccount, Transfer, spl_token::instruction::AuthorityType}

use svm_merkle_tree::{HashingAlgorithm, MerkleProof};

declare_id!("C9PLf3qMCVqtUCJtEBy8NCcseNp3KTZwFJxAtDdN1bto");

/// Instructions and Logic behind the program
#[program]
pub mod merkle_tree_token_claimer {
    use super::*;

    pub fn initialize_airdrop_data(
        ctx: Context<Initialize>, 
        merkle_root: [u8; 32],
        amount: u64,
    ) -> Result<()> {

        Ok(())
    }

    pub fn update_tree(
        ctx: Context<Update>, 
        new_root: [u8; 32]
    ) -> Result<()> {

        Ok(())
    }

    pub fn claim_airdrop(
        ctx: Context<Claim>,
        amount: u64,
        hashes: Vec<u8>,
        index: u64,
    ) -> Result<()> {  

        Ok(())
    }
    
}

/// Account Struct for the different Instructions
#[derive(Accounts)]
pub struct Initialize<'info> {

}

#[derive(Accounts)]
pub struct Update<'info> {

}

#[derive(Accounts)]
pub struct Claim<'info> {

}

/// State account holding the merkle tree and airdrop information
#[account]
pub struct AirdropState {

}

/// Error for the Program
#[error_code]
pub enum AirdropError {

}
```

This serves as the template for the on-chain program, however, there is also significant frontend overhead to consider which we’ll address in detail in this writeup.

### Initializing the Merkle Tree

We begin by initializing a Merkle tree with user data, including their claimable amounts. This process is performed off-chain, where we calculate the tree's root and later upload it on-chain, reducing computational costs while maintaining integrity.

In this example, we generate 100 random addresses and 100 random amounts, and initialize an `isClaimed` flag for each entry, setting it to false. These details are serialized into binary format to efficiently populate the Merkle tree and we then merklize the data we just created to create the root.

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Keypair, PublicKey, SystemProgram, LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js";
import { HashingAlgorithm, MerkleTree } from "svm-merkle-tree";

// Generate 100 random addresses and amount
let merkleTreeData = Array.from({ length: 100 }, () => ({
  address: Keypair.generate().publicKey,              // Example random address
  amount: Math.floor(Math.random() * 1000),           // Example random amount
  isClaimed: false,                                   // Default value for isClaimed
}));

// Create Merkle Tree
let merkleTree = new MerkleTree(HashingAlgorithm.Keccak, 32);

merkleTreeData.forEach((entry) => {
  // Serialize address, amount, and isClaimed in binary format
  const entryBytes = Buffer.concat([
    entry.address.toBuffer(),
    Buffer.from(new Uint8Array(new anchor.BN(entry.amount).toArray('le', 8))),
    Buffer.from([entry.isClaimed ? 1 : 0]),
  ]);
  merkleTree.add_leaf(entryBytes);
});

merkleTree.merklize();

const merkleRoot = Array.from(merkleTree.get_merkle_root());
```

On-chain, we define an `AirdropState` account to manage and track the state of the airdrop. This account holds key information needed to securely distribute tokens based on the Merkle tree mechanism. Below is the breakdown of each field:

```rust
#[account]
pub struct AirdropState {
    /// The current merkle root
    pub merkle_root: [u8; 32],
    /// The authority who can update the merkle root
    pub authority: Pubkey,
    /// The mint address of the token being airdropped
    pub mint: Pubkey,
    /// Total amount allocated for the airdrop
    pub airdrop_amount: u64,
    /// Total amount claimed so far
    pub amount_claimed: u64,
    /// PDA bump seed
    pub bump: u8,
}
```

The `initialize_airdrop_data` instruction will just populate the `AirdropState` and, before revoking the `mint_authority`, mint enough tokens in the `vault`

```rust
pub fn initialize_airdrop_data(
  ctx: Context<Initialize>, 
  merkle_root: [u8; 32],
  amount: u64,
) -> Result<()> {

  ctx.accounts.airdrop_state.set_inner(
    AirdropState {
      merkle_root,
      authority: ctx.accounts.authority.key(),
      mint: ctx.accounts.mint.key(),
      airdrop_amount: amount,
      amount_claimed: 0,
      bump: ctx.bumps.airdrop_state,
    }
  );

  mint_to(
    CpiContext::new(
      ctx.accounts.token_program.to_account_info(), 
      MintTo {
          mint: ctx.accounts.mint.to_account_info(),
          to: ctx.accounts.vault.to_account_info(),
          authority: ctx.accounts.authority.to_account_info(),
      }
    ),
    amount
  )?;

  set_authority(
    CpiContext::new(
      ctx.accounts.token_program.to_account_info(), 
      SetAuthority {
          current_authority: ctx.accounts.authority.to_account_info(),
          account_or_mint: ctx.accounts.mint.to_account_info(),
      }
    ), 
    AuthorityType::MintTokens,
    None
  )?;

  Ok(())
}

#[derive(Accounts)]
pub struct Initialize<'info> {
  #[account(
    init, 
    seeds = [b"merkle_tree".as_ref(), mint.key().to_bytes().as_ref()],
    bump,
    payer = authority, 
    space = 8 + 32 + 32 + 32 + 8 + 8 + 1
  )]
  pub airdrop_state: Account<'info, AirdropState>,
  #[account(mut)]
  pub mint: Account<'info, Mint>,
  #[account(
    init_if_needed,
    payer = authority,
    associated_token::mint = mint,
    associated_token::authority = airdrop_state,
  )]
  pub vault: Account<'info, TokenAccount>,
  #[account(mut)]
  pub authority: Signer<'info>,
  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token>,
  pub associated_token_program: Program<'info, AssociatedToken>,
}
```

### Update the Merkle Root onchain if needed

We're going to create the `update_tree` instruction that will let the `authority` of the `AirdropState` change the root onchain. This can be used to add a new user or to revoke allocation. 

For this example we're going to create a new random allocation for a random address and push this entry in the Merkle Tree we created in the last instruction, like this:

```typescript
const newData = {
  address: Keypair.generate().publicKey,
  amount: Math.floor(Math.random() * 1000),           // Example random amount
  isClaimed: false,                                   // Default value for isClaimed
};

merkleTreeData.push(newData); 
    
const entryBytes = Buffer.concat([
  newData.address.toBuffer(), // PublicKey as bytes
  Buffer.from(new Uint8Array(new anchor.BN(newData.amount).toArray('le', 8))), // Amount as little-endian
  Buffer.from([newData.isClaimed ? 1 : 0]), // isClaimed as 1 byte
]);

merkleTree.add_leaf(entryBytes);
    
merkleTree.merklize();

const newMerkleRoot = Array.from(merkleTree.get_merkle_root());
```

We can easily update the root this way then:

```rust
pub fn update_tree(
  ctx: Context<Update>, 
  new_root: [u8; 32]
) -> Result<()> {

  ctx.accounts.airdrop_state.merkle_root = new_root;

  Ok(())
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(
    mut, 
    has_one = authority,
    seeds = [b"merkle_tree".as_ref(), airdrop_state.mint.key().to_bytes().as_ref()],
    bump = airdrop_state.bump
  )]
  pub airdrop_state: Account<'info, AirdropState>,
  pub authority: Signer<'info>,
}
```

We verify that this change is "safe" because we check the authority provided against the authority saved in the `AirdropState` using the `has_one` constrain. 

### Claiming instruction for the User

When a user claims tokens, their eligibility is verified using the Merkle Tree Root stored on-chain.

**Step 1: Generate Merkle Proof**: 

The system locates the user’s data in the external Merkle Tree database, generated from the previous examples, and generates the Merkle Proof. This proof includes the hashes of sibling nodes along the path to the user’s leaf and the index, enabling the verification process, like this:

```typescript
const index = merkleTreeData.findIndex(data => data.address.equals(newAddress.publicKey));

if (index === -1) {
  throw new Error("Address not found in Merkle tree data");
}

const proof = merkleTree.merkle_proof_index(index);
const proofArray = Buffer.from(proof.get_pairing_hashes());
```

**Step 2: On-Chain Verification**

Using the user’s submitted data, the generated Merkle Proof, and the data’s index, the system reconstructs the Merkle Root on-chain. The reconstructed root is then compared to the stored root to ensure the claim is valid and the Merkle Tree's integrity is preserved.

```rust
pub fn claim_airdrop(
  ctx: Context<Claim>,
  amount: u64,
  hashes: Vec<u8>,
  index: u64,
) -> Result<()> {    
  let airdrop_state = &mut ctx.accounts.airdrop_state;

  // Step 1: Verify that the Signer and Amount are right by computing the original leaf
  let mut original_leaf = Vec::new();
  original_leaf.extend_from_slice(&ctx.accounts.signer.key().to_bytes());
  original_leaf.extend_from_slice(&amount.to_le_bytes());
  original_leaf.push(0u8); // isClaimed = false

  // Step 2: Verify the Merkle proof against the on-chain root
  let merkle_proof = MerkleProof::new(
    HashingAlgorithm::Keccak,
    32,
    index as u32,
    hashes.clone(),
  );

  let computed_root = merkle_proof
    .merklize(&original_leaf)
    .map_err(|_| AirdropError::InvalidProof)?;

  require!(
    computed_root.eq(&airdrop_state.merkle_root),
    AirdropError::InvalidProof
  );

  // Step 3: Execute the transfer
  let mint_key = ctx.accounts.mint.key().to_bytes();
  
  let signer_seeds = &[
    b"merkle_tree".as_ref(),
    mint_key.as_ref(),
    &[airdrop_state.bump],
  ];

  transfer(
    CpiContext::new_with_signer(
      ctx.accounts.token_program.to_account_info(),
      Transfer {
        from: ctx.accounts.vault.to_account_info(),
        to: ctx.accounts.signer_ata.to_account_info(),
        authority: airdrop_state.to_account_info(),
      },
      &[signer_seeds],
    ),
    amount,
  )?;

  Ok(())
}
```

To ensure accuracy, the root is reconstructed from the input provided in the accounts struct and compared against the stored root on-chain to verify they match.

**Step 3: Claiming**

For simplicity in this example, we won’t implement concurrency. Instead, we present two possible approaches to handle claims:

- Set the isClaimed flag to true and recompute the Merkle Root on-chain. The main drawback of this approach is that the account will be locked during the update, as explained in the[ Concurrent Merkle Tree section](#concurrent-merkle-tree). This limits claims to one user per block and can be implemented in the same instruction like this after the transfer:

{% totem %}

{% totem-accordion title="Code Example" %}

```rust
// Step 4: Update the `is_claimed` flag in the leaf
let mut updated_leaf = Vec::new();
updated_leaf.extend_from_slice(&ctx.accounts.signer.key().to_bytes());
updated_leaf.extend_from_slice(&amount.to_le_bytes());
updated_leaf.push(1u8); // isClaimed = true

let updated_root: [u8; 32] = merkle_proof
  .merklize(&updated_leaf)
  .map_err(|_| AirdropError::InvalidProof)?
  .try_into()
  .map_err(|_| AirdropError::InvalidProof)?;

// Step 5: Update the Merkle root in the airdrop state
airdrop_state.merkle_root = updated_root;

// Step 6: Update the airdrop state
airdrop_state.amount_claimed = airdrop_state
  .amount_claimed
  .checked_add(amount)
  .ok_or(AirdropError::OverFlow)?;
```

{% /totem-accordion %}

{% /totem %}

- Create a Program Derived Address (PDA) for each user after they claim their tokens. This method avoids locking the `AirdropState` account, but it requires users to pay rent for the new PDA. This can be implemented in the same instruction, we will just need to change the Account struct like this:

{% totem %}

{% totem-accordion title="Code Example" %}

```rust
#[derive(Accounts)]
pub struct Claim<'info> {
  //...
  #[account(
    init,
    payer = signer,
    seeds = [b"user_receipt".as_ref(), signer.key().to_bytes().as_ref()],
    bump,
    space = 8 + 32
  )]
  pub user_receipt: Account<'info, UserReceipt>,
  //...
}

#[account]
pub struct UserReceipt {
  pub user: Pubkey,
}
```

{% /totem-accordion %}

{% /totem %}

**Note**: The `user_receipt` account could be left empty to minimize rent costs. However, this makes it harder to check on the frontend if a user has already claimed their tokens. This tradeoff should be considered based on the specific requirements of the program.

## Full Example Code

Here is the complete example of the Smart Contract for updating the root on-chain after a claim:

{% totem %}

{% totem-accordion title="Smart Contract Code Example" %}

```rust
use anchor_lang::prelude::*;
use anchor_spl::{associated_token::AssociatedToken, token::{mint_to, set_authority, transfer, Mint, MintTo, SetAuthority, Token, TokenAccount, Transfer, spl_token::instruction::AuthorityType}};
use svm_merkle_tree::{HashingAlgorithm, MerkleProof};

declare_id!("GTCPuHiGookQVSAgGc7CzBiFYPytjVAq6vdCV3NnZoHa");

#[program]
pub mod merkle_tree_token_claimer {
  use super::*;

  pub fn initialize_airdrop_data(
    ctx: Context<Initialize>, 
    merkle_root: [u8; 32],
    amount: u64,
  ) -> Result<()> {

    ctx.accounts.airdrop_state.set_inner(
      AirdropState {
        merkle_root,
        authority: ctx.accounts.authority.key(),
        mint: ctx.accounts.mint.key(),
        airdrop_amount: amount,
        amount_claimed: 0,
        bump: ctx.bumps.airdrop_state,
      }
    );

    mint_to(
      CpiContext::new(
        ctx.accounts.token_program.to_account_info(), 
        MintTo {
          mint: ctx.accounts.mint.to_account_info(),
          to: ctx.accounts.vault.to_account_info(),
          authority: ctx.accounts.authority.to_account_info(),
        }
      ),
      amount
    )?;

    set_authority(
      CpiContext::new(
        ctx.accounts.token_program.to_account_info(), 
        SetAuthority {
          current_authority: ctx.accounts.authority.to_account_info(),
          account_or_mint: ctx.accounts.mint.to_account_info(),
        }
      ), 
      AuthorityType::MintTokens,
      None
    )?;

    Ok(())
  }

  pub fn update_tree(
    ctx: Context<Update>, 
    new_root: [u8; 32]
  ) -> Result<()> {

    ctx.accounts.airdrop_state.merkle_root = new_root;

    Ok(())
  }

  pub fn claim_airdrop(
    ctx: Context<Claim>,
    amount: u64,
    hashes: Vec<u8>,
    index: u64,
  ) -> Result<()> {    
    let airdrop_state = &mut ctx.accounts.airdrop_state;

    // Step 1: Verify that the Signer and Amount are right by computing the original leaf
    let mut original_leaf = Vec::new();
    original_leaf.extend_from_slice(&ctx.accounts.signer.key().to_bytes());
    original_leaf.extend_from_slice(&amount.to_le_bytes());
    original_leaf.push(0u8); // isClaimed = false

    // Step 2: Verify the Merkle proof against the on-chain root
    let merkle_proof = MerkleProof::new(
      HashingAlgorithm::Keccak,
      32,
      index as u32,
      hashes.clone(),
    );
  
    let computed_root = merkle_proof
      .merklize(&original_leaf)
      .map_err(|_| AirdropError::InvalidProof)?;

    require!(
      computed_root.eq(&airdrop_state.merkle_root),
      AirdropError::InvalidProof
    );

    // Step 3: Execute the transfer
    let mint_key = ctx.accounts.mint.key().to_bytes();
    let signer_seeds = &[
      b"merkle_tree".as_ref(),
      mint_key.as_ref(),
      &[airdrop_state.bump],
    ];

    transfer(
      CpiContext::new_with_signer(
        ctx.accounts.token_program.to_account_info(),
        Transfer {
          from: ctx.accounts.vault.to_account_info(),
          to: ctx.accounts.signer_ata.to_account_info(),
          authority: airdrop_state.to_account_info(),
        },
        &[signer_seeds],
      ),
      amount,
    )?;
  
    // Step 4: Update the `is_claimed` flag in the leaf
    let mut updated_leaf = Vec::new();
    updated_leaf.extend_from_slice(&ctx.accounts.signer.key().to_bytes());
    updated_leaf.extend_from_slice(&amount.to_le_bytes());
    updated_leaf.push(1u8); // isClaimed = true

    let updated_root: [u8; 32] = merkle_proof
      .merklize(&updated_leaf)
      .map_err(|_| AirdropError::InvalidProof)?
      .try_into()
      .map_err(|_| AirdropError::InvalidProof)?;

    // Step 5: Update the Merkle root in the airdrop state
    airdrop_state.merkle_root = updated_root;

    // Step 6: Update the airdrop state
    airdrop_state.amount_claimed = airdrop_state
      .amount_claimed
      .checked_add(amount)
      .ok_or(AirdropError::OverFlow)?;
  
      Ok(())
  }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
  #[account(
    init, 
    seeds = [b"merkle_tree".as_ref(), mint.key().to_bytes().as_ref()],
    bump,
    payer = authority, 
    space = 8 + 32 + 32 + 32 + 8 + 8 + 1
  )]
  pub airdrop_state: Account<'info, AirdropState>,
  #[account(mut)]
  pub mint: Account<'info, Mint>,
  #[account(
    init_if_needed,
    payer = authority,
    associated_token::mint = mint,
    associated_token::authority = airdrop_state,
  )]
  pub vault: Account<'info, TokenAccount>,
  #[account(mut)]
  pub authority: Signer<'info>,
  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token>,
  pub associated_token_program: Program<'info, AssociatedToken>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(
    mut, 
    has_one = authority,
    seeds = [b"merkle_tree".as_ref(), airdrop_state.mint.key().to_bytes().as_ref()],
    bump = airdrop_state.bump
  )]
  pub airdrop_state: Account<'info, AirdropState>,
  pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct Claim<'info> {
  #[account(
    mut,
    has_one = mint,
    seeds = [b"merkle_tree".as_ref(), mint.key().to_bytes().as_ref()],
    bump = airdrop_state.bump
  )]
  pub airdrop_state: Account<'info, AirdropState>,
  pub mint: Account<'info, Mint>,
  #[account(
    mut,
    associated_token::mint = mint,
    associated_token::authority = airdrop_state,
  )]
  pub vault: Account<'info, TokenAccount>,
  #[account(
    init_if_needed,
    payer = signer,
    associated_token::mint = mint,
    associated_token::authority = signer,
  )]
  pub signer_ata: Account<'info, TokenAccount>,
  #[account(mut)]
  pub signer: Signer<'info>,
  pub system_program: Program<'info, System>,
  pub token_program: Program<'info, Token>,
  pub associated_token_program: Program<'info, AssociatedToken>,
}

/// State account holding the merkle tree and airdrop information
#[account]
pub struct AirdropState {
  /// The current merkle root
  pub merkle_root: [u8; 32],
  /// The authority who can update the merkle root
  pub authority: Pubkey,
  /// The mint address of the token being airdropped
  pub mint: Pubkey,
  /// Total amount allocated for the airdrop
  pub airdrop_amount: u64,
  /// Total amount claimed so far
  pub amount_claimed: u64,
  /// PDA bump seed
  pub bump: u8,
}

#[error_code]
pub enum AirdropError {
  #[msg("Invalid Merkle proof")]
  InvalidProof,
  #[msg("Already claimed")]
  AlreadyClaimed,
  #[msg("Amount overflow")]
  OverFlow,
}
```

{% /totem-accordion %}

{% /totem %}

And here is the corresponding test.ts file with code to implement and test the Merkle tree:

{% totem %}

{% totem-accordion title="Typescript Testing Code Example" %}

```typescript
import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MerkleTreeTokenClaimer } from "../target/types/merkle_tree_token_claimer";
import { expect } from "chai";
import { Keypair, PublicKey, SystemProgram, LAMPORTS_PER_SOL, Transaction } from "@solana/web3.js";
import { getAssociatedTokenAddress, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { HashingAlgorithm, MerkleTree } from "svm-merkle-tree";
import { ASSOCIATED_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";


describe("merkle-tree-token-claimer", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const wallet = anchor.Wallet.local();

  Keypair.fromSecretKey
  const program = anchor.workspace.MerkleTreeTokenClaimer as Program<MerkleTreeTokenClaimer>;

  let authority = wallet.payer;
  let mint = Keypair.generate();
  let newAddress: Keypair;
  let airdropState: PublicKey;
  let merkleTree: MerkleTree;
  let vault: PublicKey;
  let newData: AirdropTokenData;

  interface AirdropTokenData {
    address: PublicKey;
    amount: number;
    isClaimed: boolean;
  }
  let merkleTreeData: AirdropTokenData[];

  before(async () => {
    airdropState = PublicKey.findProgramAddressSync([Buffer.from("merkle_tree"), mint.publicKey.toBuffer()], program.programId)[0];
    vault = await getAssociatedTokenAddress(mint.publicKey, airdropState, true);

    // Airdrop SOL to authority
    await provider.sendAndConfirm(
      new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: provider.publicKey,
          toPubkey: authority.publicKey,
          lamports: 10 * LAMPORTS_PER_SOL,
        })
      ), 
      []
    );

    // Generate 100 random addresses and amount
    merkleTreeData = Array.from({ length: 100 }, () => ({
      address: Keypair.generate().publicKey,
      amount: Math.floor(Math.random() * 1000),           // Example random amount
      isClaimed: false,                                   // Default value for isClaimed
    }));
    
    // Create Merkle Tree
    merkleTree = new MerkleTree(HashingAlgorithm.Keccak, 32);
    merkleTreeData.forEach((entry) => {
      // Serialize address, amount, and isClaimed in binary format
      const entryBytes = Buffer.concat([
        entry.address.toBuffer(),
        Buffer.from(new Uint8Array(new anchor.BN(entry.amount).toArray('le', 8))),
        Buffer.from([entry.isClaimed ? 1 : 0]),
      ]);
      merkleTree.add_leaf(entryBytes);
    });
    merkleTree.merklize();
    
  });

  it("Initialize airdrop data", async () => {
    const merkleRoot = Array.from(merkleTree.get_merkle_root());
    const totalAirdropAmount = merkleTreeData.reduce((sum, entry) => sum + entry.amount, 0);

    await program.methods.initializeAirdropData(merkleRoot, new anchor.BN(totalAirdropAmount))
      .accountsPartial({
        airdropState,
        mint: mint.publicKey,
        vault,
        authority: authority.publicKey,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
      })
      .signers([authority, mint])
      .rpc();

    const account = await program.account.airdropState.fetch(airdropState);
    expect(account.merkleRoot).to.deep.equal(merkleRoot);
    expect(account.authority.toString()).to.equal(authority.publicKey.toString());
  });

  it("Update root", async () => {
    const newData = {
      address: Keypair.generate().publicKey,
      amount: Math.floor(Math.random() * 1000),           // Example random amount
      isClaimed: false,                                   // Default value for isClaimed
    };
    merkleTreeData.push(newData); 
    const entryBytes = Buffer.concat([
      newData.address.toBuffer(), // PublicKey as bytes
      Buffer.from(new Uint8Array(new anchor.BN(newData.amount).toArray('le', 8))), // Amount as little-endian
      Buffer.from([newData.isClaimed ? 1 : 0]), // isClaimed as 1 byte
    ]);
    merkleTree.add_leaf(entryBytes);
    merkleTree.merklize();

    const newMerkleRoot = Array.from(merkleTree.get_merkle_root());

    await program.methods.updateTree(newMerkleRoot)
      .accountsPartial({
        airdropState: airdropState,
        authority: authority.publicKey,
      })
      .signers([authority])
      .rpc();

    const account = await program.account.airdropState.fetch(airdropState);
    expect(account.merkleRoot).to.deep.equal(newMerkleRoot);
  });

  it("Perform claim with whitelisted address", async () => {
    newAddress = Keypair.generate();
    newData = {
      address: newAddress.publicKey,
      amount: Math.floor(Math.random() * 1000),           // Example random amount
      isClaimed: false,                                   // Default value for isClaimed
    }
    merkleTreeData.push(newData); 
    const entryBytes = Buffer.concat([
      newData.address.toBuffer(), // PublicKey as bytes
      Buffer.from(new Uint8Array(new anchor.BN(newData.amount).toArray('le', 8))), // Amount as little-endian
      Buffer.from([newData.isClaimed ? 1 : 0]), // isClaimed as 1 byte
    ]);
    merkleTree.add_leaf(entryBytes);
    merkleTree.merklize();
  
    const newMerkleRoot = Array.from(merkleTree.get_merkle_root());
  
    await program.methods.updateTree(newMerkleRoot)
      .accountsPartial({
        airdropState: airdropState,
        authority: authority.publicKey,
      })
      .signers([authority])
      .rpc();
  
    const index = merkleTreeData.findIndex(data => data.address.equals(newAddress.publicKey));
    if (index === -1) {
      throw new Error("Address not found in Merkle tree data");
    }

    const proof = merkleTree.merkle_proof_index(index);
    const proofArray = Buffer.from(proof.get_pairing_hashes());

    await provider.sendAndConfirm(
      new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: provider.publicKey,
          toPubkey: newAddress.publicKey,
          lamports: 10 * LAMPORTS_PER_SOL,
        })
      ), 
      []
    );
  
    try {
      await program.methods.claimAirdrop(new anchor.BN(newData.amount), proofArray, new anchor.BN(index))
        .accountsPartial({
          airdropState,
          mint: mint.publicKey,
          vault,
          signerAta: await getAssociatedTokenAddress(mint.publicKey, newAddress.publicKey),
          signer: newAddress.publicKey,
          systemProgram: SystemProgram.programId,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_PROGRAM_ID,
        })
        .signers([newAddress])
        .rpc();
      console.log("Action performed successfully for whitelisted address");
    } catch (error) {
      console.error("Error performing action:", error);
      throw error;
    }
  });
};
```

{% /totem-accordion %}

{% /totem %}