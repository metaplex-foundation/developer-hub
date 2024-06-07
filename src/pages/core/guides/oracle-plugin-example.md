---
title: Create a US Market Trading Experience for Your Collection!
metaTitle: Core - Oracle Plugin Example
description: This guide shows how to limit your collection to trade only during US market hours.
---

This developer guide leverages the new Oracle Plugin to **create an NFT collection that can only be traded during US market hours**.

## Introduction

### External Plugin

An **External Plugin** is a plugin whose behavior is controlled by an *external* source. The core program will provide an adapter for these plugins, but developers decide the behavior by pointing this adapter to an external data source.

Each External Adapter has the ability to assign lifecycle checks to Lifecycle Events, influencing the behavior of the lifecycle event taking place. This means we can assign the following checks to lifecycle events like create, transfer, update, and burn:
- **Listen**: A “web3” webhook that alerts the plugin when a lifecycle event occurs. This is particularly useful for tracking data or performing actions.
- **Reject**: The plugin can reject a lifecycle event.
- **Approve**: The plugin can approve a lifecycle event.

If you want to learn more about External Plugins, read more about them [here](/core/external-plugins/overview).

### Oracle Plugin

The **Oracle Plugin** leverages the capability of external plugins to save data that an external authority can update by accessing **on-chain data** accounts external to the Core asset, allowing assets to dynamically reject lifecycle events set by the asset authority. The external Oracle account can also be updated at any time to change the authorization behavior of the lifecycle events, providing a flexible and dynamic experience.

If you want to learn more about the Oracle Plugin, read more about it [here](/core/external-plugins/oracle).

## Starting off: Understanding the Protocol behind the Idea

To create an NFT collection that can only be traded during US market hours, we need a reliable way of updating on-chain data based on the time of day. This is how the protocol design will look like:

### Program Overview

The program will have two main instructions (one to create the Oracle and the other to update its value) and two helper functions to facilitate implementation.

**Main Instructions**
- **Initialize Oracle Instruction**: This instruction creates the oracle account so any user wanting to employ this time-gated feature for their collection will redirect the NFT Oracle Plugin to this on-chain account address.
- **Crank Oracle Instruction**: This instruction updates the oracle state data to ensure it always has the right and most up-to-date data.

**Helper functions**
- **isUsMarketOpen**: Checks if the US market is open.
- **isWithin15mOfMarketOpenOrClose**: Checks if the current time is within 15 minutes of market opening or closing.

**Note**: The `crank_oracle_instruction` ensure that the protocol is updated with accurate data providing incentives to those maintaining up-to-date information. But we'll talk about this in the next section.

### The Incentives mechanism

Every collection using this oracle as a source of trust should run its own crank to ensure that the oracle is always up-to-date. However, to enhance resilience, protocol developers should consider creating incentives for multiple people to crank the protocol, ensuring a safety net that keeps the oracle data accurate if the in-house crank fails to update the data.

The current program design rewards crankers for maintaining the oracle with 0.001 SOL. This amount is manageable while still providing a sufficient incentive for crankers to keep the oracle state account up-to-date.

**Note**: These incetives are paid out only if the crank is executed the first 15 minute of market opening or closing and are funded from a vault present in the smart contract. The vault needs to be refilled by sending SOL to the oracle vault address.

## Let's Get Our Hands Dirty: Building out the Program

Now that the logic behind our protocol is clear, it’s time to dive into the code and bring it all together!

### Anchor Overview

In this guide, we'll use the Anchor framework, but you can also implement it using a native program. Learn more about the Anchor framework [here](https://www.anchor-lang.com/).

For simplicity, we'll use a mono-file approach, with helpers, state, accounts, and instructions all in lib.rs instead of the usual separation.

*Note: You can follow along and open the example in Solana Playground, an online tool to build and deploy Solana programs: [Solana Playground](https://solanaplayground.io/).*

### Helpers & Constants

Instead of declaring some inputs repeatedly, it’s a good idea to create constants that we can easily reference in our instructions/functions. 

**Here are the constants used in this oracle protocol:**
```rust
// Constants
const SECONDS_IN_AN_HOUR: i64 = 3600;
const SECONDS_IN_A_MINUTE: i64 = 60;
const SECONDS_IN_A_DAY: i64 = 86400;

const MARKET_OPEN_TIME: i64 = 14 * SECONDS_IN_AN_HOUR + 30 * SECONDS_IN_A_MINUTE; // 14:30 UTC == 9:30 EST
const MARKET_CLOSE_TIME: i64 = 21 * SECONDS_IN_AN_HOUR; // 21:00 UTC == 16:00 EST
const MARKET_OPEN_CLOSE_MARGIN: i64 = 15 * SECONDS_IN_A_MINUTE; // 15 minutes in seconds
const REWARD_IN_LAMPORTS: u64 = 10000000; // 0.001 SOL
```

Creating helpers to check some of the logic of our smart contract makes sense, such as checking if the US market is open and if it’s within 15 minutes of opening or closing.

**is_us_market_open helper:**
```rust
fn is_us_market_open(unix_timestamp: i64) -> bool {
    let seconds_since_midnight = unix_timestamp % SECONDS_IN_A_DAY;
    let weekday = (unix_timestamp / SECONDS_IN_A_DAY + 4) % 7;

    // Check if it's a weekday (Monday = 0, ..., Friday = 4)
    if weekday >= 5 {
        return false;
    }

    // Check if current time is within market hours
    seconds_since_midnight >= MARKET_OPEN_TIME && seconds_since_midnight < MARKET_CLOSE_TIME
}
```
This helper checks if the US market is open based on the given Unix timestamp by calculating the seconds since midnight and the day of the week. If the current time is a weekday and is within market hours, it returns true.

**Note**: This is just an example, particular occasion (like banking holiday) will not be taken in consideration.

**is_within_15_minutes_of_market_open_or_close helper:**
```rust
fn is_within_15_minutes_of_market_open_or_close(unix_timestamp: i64) -> bool {
    let seconds_since_midnight = unix_timestamp % SECONDS_IN_A_DAY;

    // Check if current time is within 15 minutes after market open or within 15 minutes after market close
    (seconds_since_midnight >= MARKET_OPEN_TIME && seconds_since_midnight < MARKET_OPEN_TIME + MARKET_OPEN_CLOSE_MARGIN) ||
    (seconds_since_midnight >= MARKET_CLOSE_TIME && seconds_since_midnight < MARKET_CLOSE_TIME + MARKET_OPEN_CLOSE_MARGIN)
}
```

This helper checks if the current time is within 15 minutes of the market opening or closing by calculating the seconds since midnight and comparing it with the market open and close times, adding a 15-minute margin.

### State

On Solana, to store data on the chain, we need to create a struct that will represent this data once deserialized.

So here's the struct we're going to use for our Oracle Account.
```rust
#[account]
pub struct Oracle {
    pub validation: OracleValidation,
    pub bump: u8,
    pub vault_bump: u8,
}

impl Space for Oracle {
    const INIT_SPACE: usize = 8 + 5 + 1;
}
```
Let's discuss some of the choices made in creating this struct:
- There is no admin field because once initialized, it’s going to be permissionless, allowing anyone to interact with it.
- The validation field is positioned first to leverage the native way of setting up the offset to search for on the NFT with just the discriminator size (8 bytes), avoiding the need for a custom offset on the Oracle Plugin config.
- We save the bump for both the Oracle PDA and the Oracle Vault PDA to avoid deriving bumps every time we include this accounts in the instruction. This is a standard in Solana Development and it helps saving Compute Usage. Read more about it [here](https://solana.stackexchange.com/questions/12200/why-do-i-need-to-store-the-bump-inside-the-pda)

Regarding space calculation, we use the Space implementation for Anchor directly, creating a constant called `INIT_SPACE` to reference when creating the PDA and storing enough SOL for rent exemption.  
The only unusual aspect is that the OracleValidation struct from mpl-core needs to have a size of 5 bytes. The rest of the space calculation is standard. Learn more about calculating space [here](https://book.anchor-lang.com/anchor_references/space.html).

### Accounts

Accounts on anchor are a structure of validated accounts that can be deserialized from the input to a Solana program.

For our program, the account structure used for both instructions is very similar. However, in one we initialize the Oracle account, and in the other, we just reference it.

Let's explore the `CreateOracle` Account:
```rust
#[derive(Accounts)]
pub struct CreateOracle<'info> {
    pub signer: Signer<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        init,
        payer = payer,
        space = Oracle::INIT_SPACE,
        seeds = [b"oracle"],
        bump
    )]
    pub oracle: Account<'info, Oracle>,
    #[account(
        seeds = [b"reward_vault", oracle.key().as_ref()],
        bump,
    )]
    pub reward_vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}
```

The struct presents two separate accounts for the signer and the payer of this instruction. This is standard for most instructions, even if not strictly necessary here, as it ensures that if a PDA signs the transaction, we still have an account to pay the fees. Both need to be signers of the transaction.

Other details:
- The Oracle account is initialized and has `[b"oracle"]` as seeds to ensure there is no possibility of creating more than one oracle account. The space allocated is defined by the `INIT_SPACE` constant. 
- The `reward_vault` account is included in this instruction to save the bumps for use in the next instruction. 
- The System program is necessary for creating new accounts on Solana since the init macro will use the `create_account` instruction from the system program.

Now let's see the `CrankOracle` Account:
```rust
#[derive(Accounts)]
pub struct CrankOracle<'info> {
    pub signer: Signer<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(
        mut,
        seeds = [b"oracle"],
        bump = oracle.bump,
    )]
    pub oracle: Account<'info, Oracle>,
    #[account(
        mut, 
        seeds = [b"reward_vault", oracle.key().as_ref()],
        bump = oracle.vault_bump,
    )]
    pub reward_vault: SystemAccount<'info>,
    pub system_program: Program<'info, System>,
}
```
This structure is similar to the CreateOracle account but with oracle and reward_vault set as mutable. This is because the oracle will need to update its validation input, and the reward_vault will need to adjust the lamports to pay the cranker. The bump fields are explicitly defined from the oracle account to avoid recalculating them everytime.

### Instructions

Finally, we are at the most important part: the instructions, where the magic happens!

`Create Oracle` Instruction:
```rust
pub fn create_oracle(ctx: Context<CreateOracle>) -> Result<()> {
    // Set the Oracle validation based on the time and if the US market is open
    match is_us_market_open(Clock::get()?.unix_timestamp) {
        true => {
            ctx.accounts.oracle.set_inner(
                Oracle {
                    validation: OracleValidation::V1 {
                        transfer: ExternalValidationResult::Approved,
                        create: ExternalValidationResult::Pass,
                        update: ExternalValidationResult::Pass,
                        burn: ExternalValidationResult::Pass,
                    },
                    bump: ctx.bumps.oracle,
                    vault_bump: ctx.bumps.reward_vault,
                }
            );
        }
        false => {
            ctx.accounts.oracle.set_inner(
                Oracle {
                    validation: OracleValidation::V1 {
                        transfer: ExternalValidationResult::Rejected,
                        create: ExternalValidationResult::Pass,
                        update: ExternalValidationResult::Pass,
                        burn: ExternalValidationResult::Pass,
                    },
                    bump: ctx.bumps.oracle,
                    vault_bump: ctx.bumps.reward_vault,
                }
            );
        }
    }

    Ok(())
}
```
This instruction initializes the oracle account using set_inner to populate the Oracle State Struct correctly. Based on the result of the is_us_market_open function, it will either approve or reject the transfer for NFTs pointing to that account. Additionally, it saves the bumps using ctx.bumps.

`Crank Oracle` Instruction:
```rust
pub fn crank_oracle(ctx: Context<CrankOracle>) -> Result<()> {
    match is_us_market_open(Clock::get()?.unix_timestamp) {
        true => {
            require!(
                ctx.accounts.oracle.validation == OracleValidation::V1 {
                    transfer: ExternalValidationResult::Rejected,
                    create: ExternalValidationResult::Pass,
                    burn: ExternalValidationResult::Pass,
                    update: ExternalValidationResult::Pass
                },
                Errors::AlreadyUpdated
            );
            ctx.accounts.oracle.validation = OracleValidation::V1 {
                transfer: ExternalValidationResult::Approved,
                create: ExternalValidationResult::Pass,
                burn: ExternalValidationResult::Pass,
                update: ExternalValidationResult::Pass,
            };
        }
        false => {
            require!(
                ctx.accounts.oracle.validation == OracleValidation::V1 {
                    transfer: ExternalValidationResult::Approved,
                    create: ExternalValidationResult::Pass,
                    burn: ExternalValidationResult::Pass,
                    update: ExternalValidationResult::Pass
                },
                Errors::AlreadyUpdated
            );
            ctx.accounts.oracle.validation = OracleValidation::V1 {
                transfer: ExternalValidationResult::Rejected,
                create: ExternalValidationResult::Pass,
                burn: ExternalValidationResult::Pass,
                update: ExternalValidationResult::Pass,
            };
        }
    }

    let reward_vault_lamports = ctx.accounts.reward_vault.lamports();
    let oracle_key = ctx.accounts.oracle.key().clone();
    let signer_seeds = &[b"reward_vault", oracle_key.as_ref(), &[ctx.accounts.oracle.bump]];
    
    if is_within_15_minutes_of_market_open_or_close(Clock::get()?.unix_timestamp) && reward_vault_lamports > REWARD_IN_LAMPORTS {
        // Reward cranker for updating Oracle within 15 minutes of market open or close
        transfer(
            CpiContext::new_with_signer(
                ctx.accounts.system_program.to_account_info(), 
                Transfer {
                    from: ctx.accounts.reward_vault.to_account_info(),
                    to: ctx.accounts.signer.to_account_info(),
                }, 
                &[signer_seeds]
            ),
            REWARD_IN_LAMPORTS
        )?
    }

    Ok(())
}
```

This instruction functions similarly to the create_oracle instruction but with added checks. Based on the response from the is_us_market_open function, it verifies if the state was already updated. If not, it updates the state.

The second part of the instruction checks if is_within_15_minutes_of_market_open_or_close is true and if there are enough lamports in the reward vault to pay the cranker. If both conditions are met, it transfers the reward to the cranker; otherwise, it does nothing.

### Create the NFT

Last part of this journey will be to create a collection and point it to the Oracle account so every asset we include in that collection will follow the custom Oracle rule!  

Let's start by setting up your environment to use Umi. (Umi is a modular framework for building and using JavaScript clients for Solana programs. Learn more [here](../../umi/getting-started))

```ts
import { createSignerFromKeypair, signerIdentity } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'

// SecretKey for the wallet you're going to use 
import wallet from "../wallet.json";

const umi = createUmi("https://api.devnet.solana.com", "finalized")

let keyair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keyair);
umi.use(signerIdentity(myKeypairSigner));
```

Next, we create the collection including the Oracle Plugin using the `CreateCollection` instruction:

```ts
// Generate the Collection PublicKey
const collection = generateSigner(umi)
console.log("Collection Address: \n", collection.publicKey.toString())

const oracleAccount = publicKey("...")

// Generate the collection
const collectionTx = await createCollection(umi, {  
    collection: collection,
    name: 'My Collection',
    uri: 'https://example.com/my-collection.json',
    plugins: [
        {
            type: "Oracle",
            resultsOffset: {
                type: 'Anchor',
            },
            baseAddress: oracleAccount,
            authority: {
                type: 'UpdateAuthority',
            },
            lifecycleChecks: {
                transfer: [CheckResult.CAN_REJECT],
            },
            baseAddressConfig: undefined,
        }
    ]
}).sendAndConfirm(umi)

// Deserialize the Signature from the Transaction
let signature = base58.deserialize(collectinTx.signature)[0];  
console.log(signature);  
```

## Conclusion

Congratulations! You are now equipped to create an NFT collection that trades only during US market hours using the Oracle Plugin. If you want to learn more about Core and Metaplex, check out the [developer hub](/core/getting-started).  

<!-- Follow my journey and stay updated with my next tutorial on [Twitter](https://twitter.com/L0STE_)! -->
