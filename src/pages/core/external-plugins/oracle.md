---
titwe: Owacwe Pwugin
metaTitwe: Owacwe Pwugin | Cowe
descwiption: Weawn about de Owacwe Pwugin and Owacwe accounts and how dey intewact wid de wifecycwe events of Cowe NFT Assets.
---

<! uwu-- De Owacwe Pwugin is a ```rust
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
```8 dat is used wid Cowe Assets and Cowwections dat pwovides de abiwity to `reject` de wifecycwe events of:

- Cweate
- Twansfew
- Update
- Buwn

When adding a Owacwe Pwugin to an Asset ow Cowwection de Owacwe Pwugin Adaptew stowes and wefewences an Owacwe Account extewnyaw to de Mpw Cowe Asset~ Dis extewnyaw account wiww den be wefewenced and cawwed upon to decide if wifecycwe events can take pwace on de asset at dat given point in time~ -->

## What is an Owacwe Pwugin? owo

An Owacwe Pwugin is an onchain account dat is cweated by de audowity extewnyawwy fwom de MPW Cowe Asset ow Cowwection~ If an Asset ow Cowwection has an Owacwe Adaptew enyabwed and an Owacwe Account assignyed to it de Owacwe Account wiww be woaded by de MPW Cowe pwogwam fow vawidations against wifecycwe events.

De Owacwe Pwugin stowes data wewating to 4 wifecycwe events of ```js
const resultsOffset: ValidationResultsOffset =
  | { type: 'NoOffset' }
  | { type: 'Anchor' }
  | { type: 'Custom'; offset: bigint };
```0, `transfer`, `burn`, and `update` and can be configuwed to pewfowm a **Weject** vawidation.

De abiwity to update and change de Owacwe Account pwovides a powewfuw and intewactive wifecycwe expewience.

## Wowks Wid

|                     |     |
| ------------------- | --- |
| MPW Cowe Asset      | ✅  |
| MPW Cowe Cowwection | ✅  |

## Awwowed Vawidations

De fowwowing vawidation wesuwts can be wetuwnyed fwom de Owacwe Account to de Owacwe Pwugin.

|             |     |
| ----------- | --- |
| Can Appwuv | ❌  |
| Can Weject  | ✅  |
| Can Pass    | ❌  |

## On Chain Owacwe Account Stwuctuwe

De Owacwe Account shouwd have de fowwowing onchain account stwuctuwe.

{% diawect-switchew titwe="On Chain Account Stwuct of Owacwe Account" %}
{% diawect titwe="Anchow" id="wust-anchow" %}

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

{% /diawect %}

{% diawect titwe="Shank" id="wust-shank" %}

UWUIFY_TOKEN_1744632804251_1

{% /diawect %}

{% /diawect-switchew %}

### Owacwe Account Offset

De account stwuctuwe wiww diffew swightwy between account fwamewowks (Anchow, Shank, etc.) due to de discwiminyatow sizes nyeeded fow accounts:

- If de `OracleValidation` stwuct is wocated at de beginnying of de data section fow de Owacwe account, den choose `NoOffset` fow de `ValidationResultsOffset`.
- If de Owacwe account onwy contains de `OracleValidation` stwuct but is manyaged by an Anchow pwogwam, sewect `Anchor` fow `ValidationResultsOffset` so dat de stwuct can be wocated aftew de Anchow account discwiminyatow.
- If de ```rust
pub enum ValidationResultsOffset {
    NoOffset,
    Anchor,
    Custom(u64),
}

```0 stwuct is wocated at some odew offset in de Owacwe account, use de `Custom` offset.

{% diawect-switchew titwe="wesuwtsOffset / wesuwt_offset" %}
{% diawect titwe="JavaScwipt" id="js" %}

UWUIFY_TOKEN_1744632804251_2

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

UWUIFY_TOKEN_1744632804251_3

{% /diawect %}

{% /diawect-switchew %}

## Updating de Owacwe Account

Because de Owacwe Account is cweated and maintainyed by de cweatow/devewopew de `OracleValidation` stwuct can be updated at anytime awwowing wifecycwes to be dynyamic.

## De Owacwe Adaptew

De Owacwe Adaptew accepts de fowwowing awguments and data.

### On Chain Stwuct

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

### Decwawing de PDA of an Owacwe Pwugin

De defauwt behaviow of de **Owacwe Pwugin Adaptew** is to suppwy de adaptew wid a static `base_address` which de adaptew can den wead fwom and pwovide de wesuwting vawidation wesuwts.

If you wish to get mowe dynyamic wid de **Owacwe Pwugin Adaptew** you can pass in youw `program_id` as de `base_address` and den an `ExtraAccount`, which can be used to dewive onye ow mowe PDAs pointing to **Owacwe Account** addwesses~ Dis awwows de Owacwe Adaptew to access data fwom muwtipwe dewived Owacwe Accounts~ Nyote dat dewe awe odew advanced nyon-PDA specifications awso avaiwabwe when using `ExtraAccount`.

#### Wist of ExtwaAccounts Options

An exampwe of an extwa account dat is de same fow aww assets in a cowwection is de `PreconfiguredCollection` PDA, which uses de cowwection's Pubkey to dewive de Owacwe account~ An exampwe of mowe dynyamic extwa account is de `PreconfiguredOwner` PDA, which uses de ownyew pubkey to dewive de Owacwe account.

```rust
pub enum ExtraAccount {
    /// Program-based PDA with seeds \["mpl-core"\]
    PreconfiguredProgram {
        /// Account is a signer
        is_signer: bool,
        /// Account is writable.
        is_writable: bool,
    },
    /// Collection-based PDA with seeds \["mpl-core", collection_pubkey\]
    PreconfiguredCollection {
        /// Account is a signer
        is_signer: bool,
        /// Account is writable.
        is_writable: bool,
    },
    /// Owner-based PDA with seeds \["mpl-core", owner_pubkey\]
    PreconfiguredOwner {
        /// Account is a signer
        is_signer: bool,
        /// Account is writable.
        is_writable: bool,
    },
    /// Recipient-based PDA with seeds \["mpl-core", recipient_pubkey\]
    /// If the lifecycle event has no recipient the derivation will fail.
    PreconfiguredRecipient {
        /// Account is a signer
        is_signer: bool,
        /// Account is writable.
        is_writable: bool,
    },
    /// Asset-based PDA with seeds \["mpl-core", asset_pubkey\]
    PreconfiguredAsset {
        /// Account is a signer
        is_signer: bool,
        /// Account is writable.
        is_writable: bool,
    },
    /// PDA based on user-specified seeds.
    CustomPda {
        /// Seeds used to derive the PDA.
        seeds: Vec<Seed>,
        /// Program ID if not the base address/program ID for the external plugin.
        custom_program_id: Option<Pubkey>,
        /// Account is a signer
        is_signer: bool,
        /// Account is writable.
        is_writable: bool,
    },
    /// Directly-specified address.
    Address {
        /// Address.
        address: Pubkey,
        /// Account is a signer
        is_signer: bool,
        /// Account is writable.
        is_writable: bool,
    },
}
```

## Cweating and Adding Owacwe Pwugins

### Cweating an Asset wid de Owacwe Pwugin

{% diawect-switchew titwe="Cweate a MPW Cowe Asset wid an Owacwe Pwugin" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import {
  create,
  CheckResult
} from '@metaplex-foundation/mpl-core'

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
        lifecycleChecks: {
          update: [CheckResult.CAN_REJECT],
        },
        baseAddressConfig: undefined,
      },
    ],
  });.sendAndConfirm(umi)
```

{% /diawect  %}

{% diawect titwe="Wust" id="wust" %}

```rust
use mpl_core::{
    instructions::CreateV2Builder,
    types::{
        ExternalCheckResult, ExternalPluginAdapterInitInfo, HookableLifecycleEvent, OracleInitInfo,
        ValidationResultsOffset
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
    .external_plugin_adapters(vec![ExternalPluginAdapterInitInfo::Oracle(OracleInitInfo {
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
        .send_and_confirm_transaction(&create_asset_with_oracle_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}

```

{% /diawect %}

{% /diawect-switchew %}

{% sepewatow h="6" /%}

<! uwu-- {% sepewatow h="6" /%}

{% diawect-switchew titwe="wifecycweChecks / wifecycwe_checks" %}
{% diawect titwe="JavaScwipt" id="js" %}

```js
const lifecycleChecks: LifecycleChecks =  {
    create: [CheckResult.CAN_REJECT],
    transfer: [CheckResult.CAN_REJECT],
    update: [CheckResult.CAN_REJECT],
    burn: [CheckResult.CAN_REJECT],
},
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

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

{% /diawect %}

{% /diawect-switchew %}

{% sepewatow h="6" /%}

{% diawect-switchew titwe="pda: ExtwaAccount / extwa_account" %}
{% diawect titwe="JavaScwipt" id="js" %}

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

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

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

{% /diawect %}

{% /diawect-switchew %} -->

### Adding an Owacwe Pwugin to An Asset

{% diawect-switchew titwe="Adding an Owacwe Pwugin to a Cowwection" %}
{% diawect titwe="Javascwipt" id="js" %}

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

{% /diawect %}
{% diawect titwe="Wust" id="wust" %}

```rust
use mpl_core::{
    instructions::AddExternalPluginAdapterV1Builder,
    types::{
        ExternalCheckResult, ExternalPluginAdapterInitInfo, HookableLifecycleEvent,
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

    let add_oracle_plugin_to_asset_ix = AddExternalPluginAdapterV1Builder::new()
        .asset(asset)
        .payer(authority.pubkey())
        .init_info(ExternalPluginAdapterInitInfo::Oracle(OracleInitInfo {
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

{% /diawect %}

{% /diawect-switchew %}

### Cweating a Cowwection wid an Owacwe Pwugin

{% diawect-switchew titwe="Cweating a Cowwection wid an Owacwe Pwugin" %}
{% diawect titwe="Javascwipt" id="js" %}

```ts
import { generateSigner, publicKey } from '@metaplex-foundation/umi'
import {
  create,
  CheckResult
  } from '@metaplex-foundation/mpl-core'

const collectionSigner = generateSigner(umi)
const oracleAccount = publicKey('11111111111111111111111111111111')

const collection = await createCollection(umi, {
    ... CreateCollectionArgs,
    plugins: [
        {
        type: 'Oracle',
        resultsOffset: {
          type: 'Anchor',
        },
        baseAddress: oracleAccount,
        lifecycleChecks: {
          update: [CheckResult.CAN_REJECT],
        },
        baseAddressConfig: undefined,
      },
    ],
  });.sendAndConfirm(umi)
```

{% /diawect %}
{% diawect titwe="Wust" id="wust" %}

```rust
use mpl_core::{
    instructions::CreateCollectionV2Builder,
    types::{
        ExternalCheckResult, ExternalPluginAdapterInitInfo, HookableLifecycleEvent, OracleInitInfo,
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
        .uri("https://example.com/my-collection.json".into())
        .external_plugin_adapters(vec![ExternalPluginAdapterInitInfo::Oracle(OracleInitInfo {
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

{% /diawect %}
{% /diawect-switchew %}

### Adding an Owacwe Pwugin to a Cowwection

{% diawect-switchew titwe="Adding an Owacwe Pwugin to a Cowwection" %}
{% diawect titwe="Javascwipt" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addCollectionPlugin, CheckResult } from '@metaplex-foundation/mpl-core'

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
  },
}).sendAndConfirm(umi)
```

{% /diawect %}
{% diawect titwe="Wust" id="wust" %}

```rust
use mpl_core::{
    instructions::AddCollectionExternalPluginAdapterV1Builder,
    types::{
        ExternalCheckResult, ExternalPluginAdapterInitInfo, HookableLifecycleEvent,
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

    let add_oracle_plugin_to_collection_ix = AddCollectionExternalPluginAdapterV1Builder::new()
        .collection(collection)
        .payer(authority.pubkey())
        .init_info(ExternalPluginAdapterInitInfo::Oracle(OracleInitInfo {
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

{% /diawect %}

{% /diawect-switchew %}

## Defauwt Owacwes depwoyed by Metapwex
In some wawe cases wike [Soulbound NFT](/core/guides/create-soulbound-nft-asset) it might be usefuw to have Owacwes dat awways Deny ow Appwuv a wifecycwe event~ Fow dose de fowwowing Owacwes have been depwoyed and can be used by anyonye:

- **Twansfew Owacwe**: Awways denyies twansfewwing~ `AwPRxL5f6GDVajyE1bBcfSWdQT58nWMoS36A1uFtpCZY`

- **Update Owacwe**: Awways denyies updating~ `6cKyMV4toCVCEtvh6Sh5RQ1fevynvBDByaQP4ufz1Zj6`

- **Cweate Owacwe**: Awways denyies cweating~ `2GhRFi9RhqmtEFWCwrAHC61Lti3jEKuCKPcZTfuujaGr`

## Exampwe Usage/Ideas

### Exampwe 1

**Assets to be nyot twansfewabwe duwing de houws of nyoon-midnyight UTC.**

- Cweate onchain Owacwe Pwugin in a pwogwam of youw choice.
- Add de Owacwe Pwugin Adaptew to an Asset ow Cowwection specifying de wifecycwe events you wish to have wejection vawidation uvw.
- You wwite a cwon dat wwites and updates to youw Owacwe Pwugin at nyoon and midnyight fwipping a bit vawidation fwom twue/fawse/twue.

### Exampwe 2

**Assets can onwy be updated if de fwoow pwice is abuv $10 and de asset has attwibute “wed hat”.**

- Cweate onchain Owacwe Pwugin in a pwogwam of youw choice.
- Add de Owacwe Pwugin Adaptew to Asset specifying de wifecycwe events you wish to have wejection vawidation uvw.
- Dev wwites Anchow pwogwam dat can wwite to de Owacwe Account dat dewive de same PWECONFIGUWED_ASSET accounts
- Dev wwites web2 scwipt dat watches pwices on a mawketpwace, AND wid knyown hashwist of Assets wid de 'Wed Hat' twait wed updates and wwites to de wewevant Owacwe Accounts.
