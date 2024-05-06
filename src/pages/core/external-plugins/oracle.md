---
title: Oracle Plugin
metaTitle: Core - Oracle Plugin
description: Learn about the Oracle Plugin
---

The Oracle Plugin is a `External Plugin` that is used with Core Assets that provides the ability to control the lifecycle events of:

- Create
- Transfer
- Update
- Burn

When aadding a Oracle Plugin to an Asset the plugin stores and references an Orcale Account external to the Mpl Core program. This external account will then be referenced and called upon to decide if lifecycle events can take place on the asset at that given time.

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## The Orcale Account

### What is an Orcale Account?

An Orcale Account is an onchain account that is created by the project/developer externally from the Mpl Core program. If an Asset or Collection has an Oracle Plugin enabled and an Oracle Account assigned to it the Oracle Account will be loaded by the MPL Core program for validations during lifecycle events.

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

### External Validation Results

|              |                                                       |
| ------------ | ----------------------------------------------------- |
| **Approved** | Will approve a lifecyle validation                   |
| **Rejected** | Will reject a lifecyle validation                     |
| **Pass**     | Will neither approve or reject a lifescyle validation |

### Updating an Oracle Account

Because the Oracle is an external account created and maintained by the creator/developer the Oracle account `Validation Results` can be updated at anytime making a dynamic Asset experiance for the Asset owners.

## The Orcale Plugin

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
initAuthority: 
    addressPluginAuthority(publicKey) 
    | ownerPluginAuthority() 
    | updatePluginAuthority() 
    | updatePluginAuthority() 
    | null
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
For `ExternalCheckResult` the flag values are as follows u32 values:
```rust
1 is CanListen
2 is CanApprove
4 is CanDeny
```
{% /dialect  %}
{% /dialect-switcher %}

<!-- **resultsOffset / results_offset** -->

{% seperator h="6" /%}


These values can be changed by the Authority at any time. They are purely informational and not enforced.

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

pub async fn create_asset_with_permanent_burn_delegate_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let payer = Keypair::new();
    let asset = Keypair::new();

    let onchain_oracle_account = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let create_asset_with_burn_transfer_delegate_plugin_ix = CreateV2Builder::new()
    .asset(asset.pubkey())
    .payer(payer.pubkey())
    .name("My Nft".into())
    .uri("https://example.com/my-nft.json".into())
    .external_plugins(vec![ExternalPluginInitInfo::Oracle(OracleInitInfo {
        base_address: onchain_oracle_account,
        init_plugin_authority: None,
        lifecycle_checks: vec![(
            HookableLifecycleEvent::Transfer,
            ExternalCheckResult { flags: 4 },
        )],
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

### Creating a Collection with an Oracle Plugin

### Adding an Oracle Plugin to a Collection

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
