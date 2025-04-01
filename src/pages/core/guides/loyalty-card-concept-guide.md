---
title: Loyalty Card Concept Guide
metaTitle: Loyalty Card Concept Guide | Core Guides
description: This Guide describes the how to build out a Loyalty Card program on Solana using MPL Core NFT Assets and the MPL Core plugin system.
---

## Concept Guide: Setting Up Loyalty Cards with Metaplex Core and Plugins

> ⚠️ This is a **concept guide**, not a complete end-to-end tutorial. It is intended for developers with a working understanding of Rust and Solana, particularly using the Anchor framework. While it walks through key architectural decisions and code examples, it assumes familiarity with program structure, CPIs, and deploying Solana smart contracts.

This guide assumes you have some basic knowledge of Solana and Rust using Anchor. It explores one way to implement a loyalty card system using Core NFT Assets on Solana, powered by Metaplex Core. Rather than prescribing a rigid approach, this guide aims to demonstrate a flexible pattern that you can adapt to your own project.

### What is Metaplex Core?
Metaplex Core is a modern NFT Asset standard on Solana that provides a plugin-based architecture. Unlike the legacy Token Metadata program, Core allows developers to attach modular functionality to NFTs, such as custom data storage, ownership controls, and rule enforcement.

In this example, you'll use three components from Metaplex Core:
- **AppData Plugin**: To store custom structured data (like loyalty points).
- **Freeze Delegate Plugin**: To lock NFTs so users cannot transfer or burn them (soulbound behavior).
- **Update Delegate Authority (via PDA)**: To give your program control to update child NFTs minted under a specific collection.

We'll also use **CPI builders** (e.g., `CreateV2CpiBuilder`) to interact with the Metaplex Core program. These builders simplify how you construct and invoke instructions, making code easier to read and maintain.

### Quick Lifecycle Overview
```
[User] → requests loyalty card
    ↓
[Program] → mints NFT + AppData + FreezeDelegate (soulbound)
    ↓
[User] → purchases coffee or redeems points
    ↓
[Program] → updates loyalty data in AppData plugin
```

See the [Metaplex Core documentation](https://developers.metaplex.com/core) for more setup details.

---

## Loyalty System Architecture

This example outlines one potential structure for creating a loyalty card system using Metaplex Core on the Solana blockchain. The loyalty cards are NFTs, each associated with plugins that manage how they behave and store data.

### Why Use Soulbound NFT Assets?

Making loyalty cards soulbound helps ensure that they're tied to a single user and can't be transferred or sold. This can help preserve the integrity of the loyalty program and prevent users from gaming the system by trading or duplicating rewards.

### LoyaltyCardData Structure

Here's one way to define the loyalty card data you'll store with the AppData plugin:

```rust
pub struct LoyaltyCardData {
    pub current_stamps: u8,
    pub lifetime_stamps: u64,
    pub last_used: u64,
    pub issue_date: u64,
}

impl LoyaltyCardData {
    pub fn new_card() -> Self {
        let timestamp = clock::Clock::get().unwrap().unix_timestamp as u64;
        LoyaltyCardData {
            current_stamps: 0,
            lifetime_stamps: 0,
            last_used: 0,
            issue_date: timestamp,
        }
    }
}
```

This structure tracks the number of stamps a user has, how many they've earned overall, and when their card was issued or last used. You could customize this structure to suit different reward logic.

### PDA Collection Delegate

If you're new to PDAs (Program Derived Addresses), think of them as deterministic, program-owned addresses that are generated using a set of seeds and the program ID. These addresses are not controlled by a private key, but instead can only be signed by the program itself using `invoke_signed`. This makes them ideal for assigning authority or roles in your program logic.

In this case, the **collection delegate** is a PDA generated using the seed `[b"collection_delegate"]`. It acts as a trusted authority that your program uses to manage any NFTs in the loyalty card collection. This authority is needed, for example, to update plugin data (like stamps) or freeze/unfreeze NFTs.

This approach helps ensure only your program — not any external wallet — can update loyalty card data.

A Collection Delegate is a Program Derived Address (PDA) that gives your program authority to update all assets in a collection. You can generate this PDA using the seed `[b"collection_delegate"]`. While there are other ways to manage collection-level permissions, this is one commonly used pattern.

```rust
// Seed used to generate the PDA
let seeds = &[b"collection_delegate"];
let (collection_delegate, bump) = Pubkey::find_program_address(seeds, &program_id);

```

### Loyalty Authority PDA (Per-Card Authority)
In addition to the collection delegate, this pattern uses a unique PDA per loyalty card as the plugin authority. This PDA is derived using the card’s public key as a seed:

```rust
// Seed used to derive a PDA based on each individual loyalty card NFT
let seeds = &[loyalty_card.key().as_ref()];
let (loyalty_authority, bump) = Pubkey::find_program_address(seeds, &program_id);

```

This PDA is set as the authority for the AppData and FreezeDelegate plugins during minting. It ensures that only your program — using invoke_signed with the correct seeds — can modify data or manage freeze status for that specific card.

Using per-card authorities is especially useful when you want fine-grained, asset-specific control rather than managing all NFTs under a single centralized authority.

### Step 1: Creating the Loyalty Card Collection

This step can be handled off-chain using tools like the Metaplex JS SDK or CLI. You might create a collection NFT that represents your loyalty program (e.g., "Sol Coffee Loyalty Cards"). This collection can act as a parent to individual loyalty card NFTs, giving your program an efficient way to manage them.

Assigning a PDA as the collection's update authority allows your program to issue and modify cards programmatically. While it isn’t strictly required to implement this as a Solana program instruction, doing so might be useful if you're building functionality for onboarding "manager" accounts or supporting white-labeled loyalty programs for multiple businesses.

You might begin by creating a collection NFT that represents your loyalty program (e.g., "Sol Coffee Loyalty Cards"). This collection can act as a parent to individual loyalty card NFTs, giving your program an efficient way to manage them.

Assigning a PDA as the collection's update authority allows your program to issue and modify cards programmatically. This isn’t strictly required but helps streamline control.

To understand more about minting a Core Collection you could visit (Creating a Core Collection).
[https://developers.metaplex.com/core/collections#creating-a-collection]


### Step 2: Minting a Soulbound Loyalty Card

When a user joins your program, you could mint them a loyalty card NFT with the following traits:

- Belongs to your loyalty collection
- Frozen (soulbound) using the Freeze Delegate plugin
- Stores its state in an AppData plugin

Here’s one way to structure the minting logic:

```rust
CreateV2CpiBuilder::new(&ctx.accounts.core_program)
    .asset(&ctx.accounts.loyalty_card)
    .name("Sol Coffee Loyalty Card".to_owned())
    .collection(Some(&ctx.accounts.loyalty_card_collection))
    .uri("https://arweave.net/...".to_owned())
    .external_plugin_adapters(vec![
        ExternalPluginAdapterInitInfo::AppData(AppDataInitInfo {
            data_authority: PluginAuthority::Address { address: ctx.accounts.loyalty_authority.key() },
            init_plugin_authority: Some(PluginAuthority::Address { address: ctx.accounts.loyalty_authority.key() }),
            schema: Some(ExternalPluginAdapterSchema::Binary),
        }),
    ])
    .plugins(vec![
        PluginAuthorityPair {
            authority: Some(PluginAuthority::Address { address: ctx.accounts.loyalty_authority.key() }),
            plugin: Plugin::FreezeDelegate(FreezeDelegate { frozen: true }),
        },
    ])
    .owner(Some(&ctx.accounts.signer))
    .payer(&ctx.accounts.signer)
    .authority(Some(&ctx.accounts.collection_delegate))
    .invoke_signed(collection_delegate_seeds)?;
```

### Step 3: Updating Loyalty Card Data During Purchases

When a customer makes a purchase or redeems a reward, you'll want to update their loyalty card's data accordingly. In this example, that behavior is controlled by a `redeem` flag passed as an argument to the instruction from the front end or client. This flag determines whether the user is redeeming points for a free item or making a regular purchase. Here’s one approach using a `match` statement based on that `redeem` flag:

- If `redeem = true`, you check if the user has enough points and deduct them.
- If `redeem = false`, you transfer lamports (SOL) and add a stamp.

In both cases, you update the `last_used` timestamp and write the updated struct back to the AppData plugin.

```rust
match redeem {
    true => {
        if loyalty_card_data.current_stamps < COST_OF_COFFEE_IN_POINTS {
            return Err(LoyaltyProgramError::NotEnoughPoints.into());
        }
        loyalty_card_data.current_stamps -= COST_OF_COFFEE_IN_POINTS;
    }
    false => {
        invoke(
            &system_instruction::transfer(
                &ctx.accounts.signer.key(),
                &ctx.accounts.destination_account.key(),
                COST_OF_COFFEE_IN_LAMPORTS,
            ),
            &[ctx.accounts.signer.to_account_info(), ctx.accounts.destination_account.to_account_info()],
        )?;

        if loyalty_card_data.current_stamps < MAX_POINTS {
            loyalty_card_data.current_stamps += 1;
        }
        loyalty_card_data.lifetime_stamps += 1;
    }
}

loyalty_card_data.last_used = clock::Clock::get().unwrap().unix_timestamp as u64;

let binary = bincode::serialize(&loyalty_card_data).unwrap();

WriteExternalPluginAdapterDataV1CpiBuilder::new(&ctx.accounts.core_program)
    .asset(&ctx.accounts.loyalty_card)
    .key(ExternalPluginAdapterKey::AppData(PluginAuthority::Address { address: ctx.accounts.loyalty_authority.key() }))
    .data(binary)
    .invoke_signed(seeds)?;
```

## Summary

This guide has walked through a conceptual implementation of a loyalty card system using Metaplex Core. We explored how to:

- Create a collection NFT for loyalty cards

- Use plugins like AppData and FreezeDelegate to store data and make NFTs soulbound

- Assign PDA authorities to allow your program to control loyalty cards

- Handle user interactions like earning and redeeming points

This structure provides a clean separation of concerns between your program logic, user interactions, and the state of each loyalty card.

## Ideas for Extending Functionality

Once you have the basics in place, here are a few directions you might explore to make your loyalty system more powerful or engaging:

- **Tiered Rewards:** Introduce multiple reward levels (e.g., silver, gold, platinum) based on lifetime stamps.

- **Expiration Logic:** Add expiration windows for stamps or cards, encouraging ongoing engagement.

- **Cross-Store Usage:** Allow loyalty cards to be used across multiple storefronts or merchants within your brand.

- **Custom Badges or Metadata:** Dynamically update the NFT metadata to show a visual representation of progress.

- **Notifications or Hooks:** Integrate off-chain systems that notify users of earned rewards or loyalty milestones.

By combining Metaplex Core's plugin system with your own creativity, you can build a loyalty platform that feels genuinely rewarding and uniquely yours.

This pattern offers a flexible, modular approach to managing on-chain loyalty systems. Feel free to adapt and expand based on your program’s goals and structure!. Feel free to adapt and expand based on your program’s goals and structure!