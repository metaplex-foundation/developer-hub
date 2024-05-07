---
title: Oracle Plugin
metaTitle: Core - Oracle Plugin
description: Learn about the Oracle Plugin
---

The Oracle Plugin is a `External Plugin` that is used with Core Assets and Collections that provides the ability to `reject` the lifecycle events of:

- Create
- Transfer
- Update
- Burn

When adding a Oracle Plugin to an Asset the plugin stores and references an Orcale Account external to the Mpl Core program. This external account will then be referenced and called upon to decide if lifecycle events can take place on the asset at that given point in time.

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## The Orcale Account

### What is an Orcale Account?

An Orcale Account is an onchain account that is created by the project/developer externally from the Mpl Core program. If an Asset or Collection has an Oracle Plugin enabled and an Oracle Account assigned to it the Oracle Account will be loaded by the MPL Core program for validations during lifecycle events.

The Oracle Account stores data relating to 4 lifecycle events of `create`, `transfer`, `burn`, and `update` and can perform a `Reject` validation on the selected lifecycle events.

The ability to update and change the Oracle Account generates and very powerful and interactive lifecycle experiance.

### On Chain Account Structure

The Orcale Account should have the following onchain account structure.

{% callout %}
The account structure will differ slightly between Shank or Anchor accounts due to the discriminator sizes needed for accounts.
{% /callout %}

<!-- |             |     |
| ----------- | --- |
| Discrimator | ❌  |
| Validation  | ✅  | -->

{% dialect-switcher title="On Chain Account Struct of Oracle Account" %}
{% dialect title="Anchor" id="rust-anchor" %}

```rust
#[account]
pub struct Validation {
    pub validation: OracleValidation,
}

impl Validation {
    pub fn size() -> usize {
        8 // anchor discriminator
        + 5 // validation
    }
}

pub enum OracleValidation {
    V1 {
        create: ExternalValidationResult,
        transfer: ExternalValidationResult,
        burn: ExternalValidationResult,
        update: ExternalValidationResult,
    },
}

pub enum ExternalValidationResult {
    Rejected,
}
```

{% /dialect %}

{% dialect title="Shank" id="rust-shank" %}

```rust
#[account]
pub struct Validation {
    pub validation: OracleValidation,
}

impl Validation {
    pub fn size() -> usize {
        1 // shank discriminator
        + 5 // validation
    }
}

pub enum OracleValidation {
    V1 {
        create: ExternalValidationResult,
        transfer: ExternalValidationResult,
        burn: ExternalValidationResult,
        update: ExternalValidationResult,
    },
}

pub enum ExternalValidationResult {
    Approved,
    Rejected,
    Pass,
}
```

{% /dialect %}

{% /dialect-switcher %}

### External Validation Results

|              |                                                       |
| ------------ | ----------------------------------------------------- |
| **Rejected** | Will reject a lifecyle validation                     |

### Updating an Oracle Account

Because the Oracle is an external account created and maintained by the creator/developer the Oracle account `Validation Results` can be updated at anytime making a dynamic Asset experiance for the Asset owners.

## The Orcale Plugin

The Oracle plugin accepts the following arguments and data.

### On Chain Struct

```rust
pub struct Oracle {
    /// The address of the oracle, or if using the `pda` option, 
    /// a program ID from which to derive a PDA.
    pub base_address: Pubkey,

    /// Optional PDA (derived from Pubkey attached to `ExternalPluginKey`).
    pub pda: Option<ExtraAccount>,

    /// Validation results offset in the Oracle account. 
    ///  Default is `ValidationResultsOffset::NoOffset`.
    pub results_offset: ValidationResultsOffset,
}
```

### Declaring PDA Oracle Accounts

The default behaviour of the `Oracle Plugin` is to supply the plugin with a static `base_address` which the Oracle Plugin can then read from and provide the resulting validation results.

If you wish to get more dynamic with the Oracle Plugin you can pass in your `program_id` as the `base_address` and then an `ExtraAccount` which can derive single or multiple PDA addresses depending on the method chosen. This potentially allows you to have multiple Oracle Accounts that can be loaded into the single plugin instance.

#### Static Examples

```rust
Preconfigured Collection
// Will take the collection address of the Asset and use it as a seed with the 
// supplied base_address (program_id) to derive the Oracle Account PDA.
base_address = 11111111111111111111111111111111 // program_id
pda = PreconfiguredCollection {
    is_signer: bool,
    is_writable: bool,
},
```
```rust
Address
// Will take the address supplied and use it as a seed with the 
// supplied base_address (program_id) to derive the Oracle Account PDA.
base_address = 11111111111111111111111111111111 // program_id
pda = Address {
    address: Pubkey,
    is_signer: bool,
    is_writable: bool,
}
```
#### Dynamic Examples
```rust
Preconfigured Owner
// Will take the owner address of the Asset and use it as a seed with the 
// supplied base_address (program_id) to derive the Oracle Account PDA.
// This will produce a different PDA for each different owner address.
base_address = 11111111111111111111111111111111 // program_id
pda = PreconfiguredOwner {
    is_signer: bool,
    is_writable: bool,
},
```

#### List of ExtraAccounts Options
```rust
PreconfiguredProgram {
    is_signer: bool,
    is_writable: bool,
},
PreconfiguredCollection {
    is_signer: bool,
    is_writable: bool,
},
PreconfiguredOwner {
    is_signer: bool,
    is_writable: bool,
},
PreconfiguredRecipient {
    is_signer: bool,
    is_writable: bool,
},
PreconfiguredAsset {
    is_signer: bool,
    is_writable: bool,
},
CustomPda {
    seeds: Vec<Seed>,
    is_signer: bool,
    is_writable: bool,
},
Address {
    address: Pubkey,
    is_signer: bool,
    is_writable: bool,
},
```


### Arguments

{% dialect-switcher title="Args" %}
{% dialect title="Javascript" id="js" %}

| Arg             | Value           |
| --------------- | --------------- |
| baseAddress     | publicKey       |
| lifecycleChecks | lifecycleChecks |
| pda             | publicKey       |
| resultsOffset   | resultsOffset   |
| initAuthority   | initAuthority   |

{% /dialect %}

{% dialect title="Rust" id="rust" %}

| Arg                   | Value                                              |
| --------------------- | -------------------------------------------------- |
| base_address          | Pubkey                                             |
| lifecycle_checks      | Vec<(HookableLifecycleEvent, ExternalCheckResult)> |
| pda                   | Pubkey                                             |
| results_offset        | Option<ValidationResultsOffset>                    |
| init_plugin_authority | lifecycleChecks                                    |

{% /dialect %}

{% /dialect-switcher %}

<!-- **lifecycleChecks / lifecycle_checks** -->

{% seperator h="6" /%}
{% dialect-switcher %}
{% dialect title="JavaScript" id="js" %}
**lifecycleChecks**

lifecycleChecks can be performed on `'create' | 'update' | 'transfer' | 'burn'`.

```js
lifecycleChecks: {
    create: [CheckResult.CAN_REJECT]
    update: [CheckResult.CAN_APPROVE]
    transfer: [CheckResult.CAN_REJECT]
    burn: [CheckResult.CAN_REJECT],
}

enum CheckResult {
  CAN_LISTEN,
  CAN_APPROVE,
  CAN_REJECT,
}
```

**rulesetOffset**

```js
rulesetOffset: ValidationResultsOffset | null

export type ValidationResultsOffset =
  | { type: 'NoOffset' }
  | { type: 'Anchor' }
  | { type: 'Custom', offset: bigint }
```

**initAuthority**

```js
initAuthority: addressPluginAuthority(publicKey) |
  ownerPluginAuthority() |
  updatePluginAuthority() |
  updatePluginAuthority() |
  null
```

{% /dialect  %}
{% dialect title="Rust" id="rust" %}
**lifecycle_checks**

lifecycle_checks takes a `vec![]` of (HookableLifecycleEvent, ExternalCheckResult) types.

```rust
lifecycle_checks: vec![(
    HookableLifecycleEvent::Transfer,
    ExternalCheckResult { flags: 4 },
)]

pub enum HookableLifecycleEvent {
    Create,
    Transfer,
    Burn,
    Update,
}

pub struct ExternalCheckResult {
    pub flags: u32,
}
```

For `ExternalCheckResult` the flag values for the `Oracle Plugin` are as follows:

```rust
4 CanReject
```

{% /dialect  %}
{% /dialect-switcher %}

<!-- **resultsOffset / results_offset** -->

{% seperator h="6" /%}




### Creating an Asset the Oracle Plugin

{% dialect-switcher title="Create a MPL Core Collection with Oracle Plugin" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import {
  createCollectionV1,
  pluginAuthorityPair,
  ruleSet,
} from '@metaplex-foundation/core'

const collectionSigner = generateSigner(umi)

const creator1 = publicKey('11111111111111111111111111111111')
const creator2 = publicKey('22222222222222222222222222222222')

const asset = await createAsset(umi, {
    plugins: [
      {
        type: 'Oracle',
        resultsOffset: {
          type: 'Anchor' || 'Shank', // Choose between Anchor and Shank.
        },
        lifecycleChecks: {
          update: [CheckResult.CAN_REJECT],
        },
        baseAddress: account.publicKey,
      },
    ],
  });.sendAndConfirm(umi)
```

{% /dialect  %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::CreateV2Builder,
    types::{
        ExternalCheckResult, ExternalPluginInitInfo, HookableLifecycleEvent, OracleInitInfo,
        PermanentBurnDelegate, Plugin, PluginAuthority, PluginAuthorityPair,
        ValidationResultsOffset,
    },
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn create_asset_with_oracle_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();

    let onchain_oracle_account = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_oracle_plugin_ix = CreateV2Builder::new()
    .asset(asset.pubkey())
    .payer(payer.pubkey())
    .name("My Asset".into())
    .uri("https://example.com/my-asset.json".into())
    .external_plugins(vec![ExternalPluginInitInfo::Oracle(OracleInitInfo {
        base_address: onchain_oracle_account,
        init_plugin_authority: None,
        lifecycle_checks: vec![
            (
                HookableLifecycleEvent::Transfer,
                ExternalCheckResult { flags: 4 },
            ),
            (
                HookableLifecycleEvent::Burn,
                ExternalCheckResult { flags: 4 },
            ),
        ],
        pda: None,
        results_offset: Some(ValidationResultsOffset::Anchor),
    })])
    .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_with_burn_transfer_delegate_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_burn_transfer_delegate_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_asset_with_burn_transfer_delegate_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /dialect %}

{% /dialect-switcher %}

### Adding an Oracle Plugin to An Asset

// TODO: EASY

### Creating a Collection with an Oracle Plugin

// TODO: EASY

### Adding an Oracle Plugin to a Collection

// TODO: EASY

## Example Usage/Ideas

### Example 1

**Assets to be not transferable during the hours of noon-midnight UTC.**

- Create onchain Oracle Account in a program of your choice.
- Add the Oracle plugin to Asset specifying the lifecycles events you wish to have validation over.
- You write a cron that writes and updates to the Oracle Account at noon and midnight flipping a bit from true/false/true.

### Example 2

**Assets can only be updated if the floor price is above $10 and the asset has attribute “red hat”.**

- Create onchain Oracle Account in a program of your choice.
- Add the Oracle plugin to Asset specifying the lifecycles events you wish to have validation over.

Add oracle plugin to the collection
Check: can deny
Event: update
Specify the base address (custom oracle prorgam)
Specify PDA: extra account: PRECONFIGURED_ASSET
Dev writes anchor program that can write to the oracle accounts that derive the same PRECONFIGURED_ASSET accounts
dev writes web2 thing that watches prices, AND with known list of red hats and writes to the relevant oracle accounts.
