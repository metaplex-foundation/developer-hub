---
title: Oracle Plugin
metaTitle: Core - Oracle Plugin
description: Learn about the Oracle Plugin
---

<!-- The Oracle Plugin is a `External Plugin` that is used with Core Assets and Collections that provides the ability to `reject` the lifecycle events of:

- Create
- Transfer
- Update
- Burn

When adding a Oracle Plugin to an Asset or Collection the Oracle Plugin Adapter stores and references an Oracle Account external to the Mpl Core Asset. This external account will then be referenced and called upon to decide if lifecycle events can take place on the asset at that given point in time. -->

## What is an Oracle Plugin?

An Oracle Plugin is an onchain account that is created by the authority externally from the Mpl Core Asset or Collection. If an Asset or Collection has an Oracle Adapter enabled and an Oracle Account assigned to it the Oracle Account will be loaded by the MPL Core program for validations against lifecycle events.

The Oracle Plugin stores data relating to 4 lifecycle events of `create`, `transfer`, `burn`, and `update` and can perform a `Reject` validation on the selected lifecycle events.

The ability to update and change the Oracle Account generates and very powerful and interactive lifecycle experience.

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## Allowed Validations

The following validation results can be returned from the Oracle Account to the Oracle Plugin.

|             |     |
| ----------- | --- |
| Can Approve | ❌  |
| Can Reject  | ✅  |
| Can Pass    | ❌  |

## On Chain Account Structure

The Oracle Account should have the following onchain account structure.

{% callout %}
The account structure will differ slightly between Shank and other account frameworks due to the discriminator sizes needed for accounts.
{% /callout %}

<!-- |             |     |
| ----------- | --- |
| Discriminator | ❌  |
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
    Uninitialized,
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

## Updating an Oracle Plugin

Because the Oracle Account is created and maintained by the creator/developer the Oracle account `Validation Results` can be updated at anytime allowing lifecycles to be dynamic.

## The Oracle Adapter

The Oracle Adapter accepts the following arguments and data.

### On Chain Struct

```rust
pub struct Oracle {
    /// The address of the oracle, or if using the `pda` option,
    /// a program ID from which to derive a PDA.
    pub base_address: Pubkey,
    /// Optional account specification (PDA derived from `base_address` or other
    /// available account specifications).  Note that even when this
    /// configuration is used there is still only one
    /// Oracle account specified by the adapter.
    pub base_address_config: Option<ExtraAccount>,
    /// Validation results offset in the Oracle account.
    /// Default is `ValidationResultsOffset::NoOffset`
    pub results_offset: ValidationResultsOffset,
}
```

### Declaring the PDA of an Oracle Plugin

The default behavior of the `Oracle Plugin Adapter` is to supply the adapter with a static `base_address` which the adapter can then read from and provide the resulting validation results.

If you wish to get more dynamic with the `Oracle Plugin Adapter` you can pass in your `program_id` as the `base_address` and then an `ExtraAccount` which can derive single or multiple PDAs pointing to `Oracle Account` addresses depending on the method chosen. This allows the Oracle Adapter to access data from multiple derived Oracle Accounts.

#### Static Examples

```rust
Preconfigured Collection
// Will take the collection address of the Asset and use it as a seed with the
// supplied base_address (program_id) to derive the Oracle Account PDA.
base_address = 11111111111111111111111111111111 // program_id
base_address_config = PreconfiguredCollection {
    is_signer: bool,
    is_writable: bool,
},
```

```rust
Address
// Will take the address supplied and use it as a seed with the
// supplied base_address (program_id) to derive the Oracle Account PDA.
base_address = 11111111111111111111111111111111 // program_id
base_address_config = Address {
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
base_address_config = PreconfiguredOwner {
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

## Creating and Adding Oracle Plugins

### Creating an Asset with the Oracle Plugin

{% dialect-switcher title="Create a MPL Core Asset with an Oracle Plugin" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import {
  create,
  CheckResult
} from '@metaplex-foundation/core'

const collectionSigner = generateSigner(umi)

const oracleAccount = publicKey('11111111111111111111111111111111')

const asset = await create(umi, {
    ... CreateAssetArgs,
    plugins: [
        {
        type: 'Oracle',
        resultsOffset: {
          type: 'Anchor',
        },
        baseAddress: oracleAccount,
        authority: {
          type: 'UpdateAuthority',
        },
        lifecycleChecks: {
          update: [CheckResult.CAN_REJECT],
        },
        baseAddressConfig: undefined,
      },,
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

    let oracle_plugin = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_oracle_plugin_ix = CreateV2Builder::new()
    .asset(asset.pubkey())
    .payer(payer.pubkey())
    .name("My Asset".into())
    .uri("https://example.com/my-asset.json".into())
    .external_plugins(vec![ExternalPluginInitInfo::Oracle(OracleInitInfo {
        base_address: oracle_plugin,
        init_plugin_authority: None,
        lifecycle_checks: vec![
            (
                HookableLifecycleEvent::Transfer,
                ExternalCheckResult { flags: 4 },
            ),
        ],
        base_address_config: None,
        results_offset: Some(ValidationResultsOffset::Anchor),
    })])
    .instruction();

    let signers = vec![&asset, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_asset_with_oracle_plugin_tx = Transaction::new_signed_with_payer(
        &[create_asset_with_oracle_plugin_ix],
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

{% seperator h="6" /%}

{% dialect-switcher title="resultsOffset / result_offset" %}
{% dialect title="JavaScript" id="js" %}

```js
const resultsOffset: ValidationResultsOffset =
  | { type: 'NoOffset' }
  | { type: 'Anchor' }
  | { type: 'Custom'; offset: bigint };
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
pub enum ValidationResultsOffset {
    NoOffset,
    Anchor,
    Custom(u64),
}

```

{% /dialect %}

{% /dialect-switcher %}

{% seperator h="6" /%}

{% dialect-switcher title="lifecycleChecks / lifecycle_checks" %}
{% dialect title="JavaScript" id="js" %}

```js
const lifecycleChecks: LifecycleChecks =  {
    create: [CheckResult.CAN_REJECT],
    transfer: [CheckResult.CAN_REJECT],
    update: [CheckResult.CAN_REJECT],
    burn: [CheckResult.CAN_REJECT],
},
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
pub lifecycle_checks: Vec<(HookableLifecycleEvent, ExternalCheckResult)>,

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

{% /dialect %}

{% /dialect-switcher %}

{% seperator h="6" /%}

{% dialect-switcher title="pda: ExtraAccount / extra_account" %}
{% dialect title="JavaScript" id="js" %}

```js
const pda: ExtraAccount =  {
    type: {
        "PreconfiguredProgram",
        | "PreconfiguredCollection",
        | "PreconfiguredOwner",
        | "PreconfiguredRecipient",
        | "PreconfiguredAsset",
    }
}

There are two additional ExtraAccount types that take additional properties these are:

const pda: ExtraAccount = {
    type: 'CustomPda',
    seeds: [],
}

const pda: ExtraAccount = {
    type: 'Address',
    address: publickey("33333333333333333333333333333333") ,
}
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
pub pda: Option<ExtraAccount>

pub enum ExtraAccount {
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
}
```

{% /dialect %}

{% /dialect-switcher %}

### Adding an Oracle Plugin to An Asset

{% dialect-switcher title="Adding an Oracle Plugin to a Collection" %}
{% dialect title="Javascript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin, CheckResult } from '@metaplex-foundation/mpl-core'

const asset = publicKey('11111111111111111111111111111111')
const oracleAccount = publicKey('22222222222222222222222222222222')

addPlugin(umi, {
    asset,
    plugin: {
        type: 'Oracle',
        resultsOffset: {
            type: 'Anchor',
        },
        lifecycleChecks: {
            create: [CheckResult.CAN_REJECT],
        },
        baseAddress: oracleAccount,
    },
})
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::AddExternalPluginV1Builder,
    types::{
        ExternalCheckResult, ExternalPluginInitInfo, HookableLifecycleEvent,
        OracleInitInfo, ValidationResultsOffset,
    },
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn add_oracle_plugin_to_asset() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let oracle_plugin = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let add_oracle_plugin_to_asset_ix = AddExternalPluginV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .init_info(ExternalPluginInitInfo::Oracle(OracleInitInfo {
            base_address: oracle_plugin,
            results_offset: Some(ValidationResultsOffset::Anchor),
            lifecycle_checks: vec![(
                HookableLifecycleEvent::Transfer,
                ExternalCheckResult { flags: 4 },
            )],
            base_address_config: None,
            init_plugin_authority: None,
        }))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let add_oracle_plugin_to_asset_tx = Transaction::new_signed_with_payer(
        &[add_oracle_plugin_to_asset_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&add_oracle_plugin_to_asset_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}

{% /dialect-switcher %}

### Creating a Collection with an Oracle Plugin

{% dialect-switcher title="Creating a Collection with an Oracle Plugin" %}
{% dialect title="Javascript" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import {
  create,
  pluginAuthorityPair,
  ruleSet,
} from '@metaplex-foundation/core'

const collectionSigner = generateSigner(umi)

const oracleAccount = publicKey('11111111111111111111111111111111')

const asset = await createCollection(umi, {
    ... CreateAssetArgs,
    plugins: [
        {
        type: 'Oracle',
        resultsOffset: {
          type: 'Anchor',
        },
        baseAddress: oracleAccount,
        authority: {
          type: 'UpdateAuthority',
        },
        lifecycleChecks: {
          update: [CheckResult.CAN_REJECT],
        },
        baseAddressConfig: undefined,
      },,
    ],
  });.sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::CreateCollectionV2Builder,
    types::{
        ExternalCheckResult, ExternalPluginInitInfo, HookableLifecycleEvent, OracleInitInfo,
        ValidationResultsOffset,
    },
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn create_collection_with_oracle_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let collection = Keypair::new();

    let onchain_oracle_plugin = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_collection_with_oracle_plugin_ix = CreateCollectionV2Builder::new()
        .collection(collection.pubkey())
        .payer(payer.pubkey())
        .name("My Collection".into())
        .uri("https://example.com/my-nft.json".into())
        .external_plugins(vec![ExternalPluginInitInfo::Oracle(OracleInitInfo {
            base_address: onchain_oracle_plugin,
            init_plugin_authority: None,
            lifecycle_checks: vec![(
                HookableLifecycleEvent::Transfer,
                ExternalCheckResult { flags: 4 },
            )],
            base_address_config: None,
            results_offset: Some(ValidationResultsOffset::Anchor),
        })])
        .instruction();

    let signers = vec![&collection, &payer];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let create_collection_with_oracle_plugin_tx = Transaction::new_signed_with_payer(
        &[create_collection_with_oracle_plugin_ix],
        Some(&payer.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&create_collection_with_oracle_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /dialect %}
{% /dialect-switcher %}

### Adding an Oracle Plugin to a Collection

{% dialect-switcher title="Adding an Oracle Plugin to a Collection" %}
{% dialect title="Javascript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  addCollectionPlugin,
  CheckResult
} from '@metaplex-foundation/mpl-core'

const collection = publicKey('11111111111111111111111111111111')
const oracleAccount = publicKey('22222222222222222222222222222222')

await addCollectionPlugin(umi, {
  collection: collection,
  plugin: {
      type: 'Oracle',
      resultsOffset: {
        type: 'Anchor',
      },
      lifecycleChecks: {
        update: [CheckResult.CAN_REJECT],
      },
      baseAddress: oracleAccount,
    }
}).sendAndConfirm(umi)
```

{% /dialect %}
{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::AddCollectionExternalPluginV1Builder,
    types::{
        ExternalCheckResult, ExternalPluginInitInfo, HookableLifecycleEvent,
        OracleInitInfo, ValidationResultsOffset,
    },
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn add_oracle_plugin_to_collection() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();
    let oracle_plugin = Pubkey::from_str("22222222222222222222222222222222").unwrap();

    let add_oracle_plugin_to_collection_ix = AddCollectionExternalPluginV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .init_info(ExternalPluginInitInfo::Oracle(OracleInitInfo {
            base_address: oracle_plugin,
            results_offset: Some(ValidationResultsOffset::Anchor),
            lifecycle_checks: vec![(
                HookableLifecycleEvent::Transfer,
                ExternalCheckResult { flags: 4 },
            )],
            base_address_config: None,
            init_plugin_authority: None,
        }))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let add_oracle_plugin_to_collection_tx = Transaction::new_signed_with_payer(
        &[add_oracle_plugin_to_collection_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&add_oracle_plugin_to_collection_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}

{% /dialect-switcher %}

## Example Usage/Ideas

### Example 1

**Assets to be not transferable during the hours of noon-midnight UTC.**

- Create onchain Oracle Plugin in a program of your choice.
- Add the Oracle Plugin Adapter to an Asset or Collection specifying the lifecycle events you wish to have rejection validation over.
- You write a cron that writes and updates to your Oracle Plugin at noon and midnight flipping a bit validation from true/false/true.

### Example 2

**Assets can only be updated if the floor price is above $10 and the asset has attribute “red hat”.**

- Create onchain Oracle Plugin in a program of your choice.
- Add the Oracle Plugin Adapter to Asset specifying the lifecycle events you wish to have rejection validation over.
- Dev writes Anchor program that can write to the Oracle Account that derive the same PRECONFIGURED_ASSET accounts
- Dev writes web2 script that watches prices on a marketplace, AND with known hashlist of Assets with the 'Red Hat' trait red updates and writes to the relevant Oracle Accounts.
