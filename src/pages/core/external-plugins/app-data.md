---
title: AppData Plugin
metaTitle: Core - AppData Plugin
description: Learn about the MPL Core AppData Plugin
---

## What is an AppData Plugin?

The `AppData` external plugin stores and contains arbitrary data that can be written to by the `dataAuthority`. Note this is different then the overall plugin authority stored in the `ExternalRegistryRecord` as it cannot update/revoke authority or change other metadata for the plugin.

Think of `AppData` as like a partition data area of an Asset that only a certain authority can change and write to.

This is useful for 3rd party sites/apps to store data needed to execute certain functionality within their product/app.

## Works With

|                       |     |
| --------------------- | --- |
| MPL Core Asset        | ✅  |
| MPL Core Collection\* | ✅  |

\* MPL Core Collections can also work with the `LinkedAppData` Plugin.

## What is a LinkedAppData Plugin?

The `LinkedAppData` plugin is built for Collections. It allows you to add a single plugin adapter on the collection which will allow you to write to any Asset in the collection.

## Arguments

| Arg           | Value                       |
| ------------- | --------------------------- |
| dataAuthority | PluginAuthority             |
| schema        | ExternalPluginAdapterSchema |

### dataAuthority

{% dialect-switcher title="AttributeList" %}
{% dialect title="JavaScript" id="js" %}

```ts
const dataAuthority = {
  type: 'Address',
  address: publicKey('11111111111111111111111111111111'),
}
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::types::{PluginAuthority}

let data_authority = Some(PluginAuthority::Address {address: authority.key()}),
```

{% /dialect %}
{% /dialect-switcher %}

### schema

The schema determines the type of data that is being stored within the `AppData` plugin. All schemas will be indexed by DAS.

| Arg               | DAS Supported | Stored as |
| ----------------- | ------------- | --------- |
| Binary (Raw Data) | ✅            | base64    |
| Json              | ✅            | json      |
| MsgPack           | ✅            | json      |

When indexing the data if there was an error reading the `JSON` or `MsgPack` schema then it will be saved as binary.

{% dialect-switcher title="Writing data to the `AppData` plugin" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { ExternalPluginAdapterSchema } from '@metaplex-foundation/mpl-core'

// Chose from Binary, Json or MsgPack
const schema = ExternalPluginAdapterSchema.Json
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
// Chose from Binary, Json or MsgPack
let schema = ExternalPluginAdapterSchema::Json

```

{% /dialect %}

{% /dialect-switcher %}

## Adding the AppData Plugin to an Asset

{% dialect-switcher title="Adding a Attribute Plugin to an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { addPlugin, ExternalPluginAdapterSchema } from '@metaplex-foundation/mpl-core'

const assetSigner = generateSigner(umi);
const dataAuthority = publicKey('11111111111111111111111111111111')

await create(umi, {
  asset: asset.publicKey,
  name: "My Asset",
  uri: "https://example.com/my-assets.json"
  plugins: [
        {
            type: 'AppData',
            dataAuthority,
            schema: ExternalPluginAdapterSchema.Json,
        },
    ],
}).sendAndConfirm(umi)

// Alternatively you could add the plugin to an existing Asset

await addPlugin(umi, {
  asset,
  plugin: {
        type: 'AppData',
        dataAuthority,
        schema: ExternalPluginAdapterSchema.Json,
    },
})
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
use mpl_core::{
    instructions::AddExternalPluginAdapterV1Builder,
    types::{Attribute, Attributes, Plugin,
    ExternalPluginAdapterInitInfo, AppDataInitInfo,
    PluginAuthority},
};
use solana_client::nonblocking::rpc_client;
use solana_sdk::{pubkey::Pubkey, signature::Keypair, signer::Signer, transaction::Transaction};
use std::str::FromStr;

pub async fn add_app_data_plugin() {
    let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

    let authority = Keypair::new();
    let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

    let add_external_plugin_app_data_ix = AddExternalPluginAdapterV1Builder::new()
        .asset(asset)
        .payer(authority.publicKey())
        .init_info(ExternalPluginAdapterInitInfo::AppData(AppDataInitInfo {
            init_plugin_authority: Some(PluginAuthority::UpdateAuthority),
            data_authority: PluginAuthority::Address {address: app_data_authority.key()},
            schema: None,
        }))
        .instruction();

    let signers = vec![&authority];

    let last_blockhash = rpc_client.get_latest_blockhash().await.unwrap();

    let add_data_plugin_tx = Transaction::new_signed_with_payer(
        &[add_external_plugin_app_data_ix],
        Some(&authority.pubkey()),
        &signers,
        last_blockhash,
    );

    let res = rpc_client
        .send_and_confirm_transaction(&add_data_plugin_tx)
        .await
        .unwrap();

    println!("Signature: {:?}", res)
}
```

{% /dialect %}

{% /dialect-switcher %}

## Writing Data to the AppData Plugin

Only the dataAuthority address can write data to the `AppData` plugin.

To write data to the `AppData` plugin we will use a `writeData()` helper which takes the following args.

| Arg       | Value                                     |
| --------- | ----------------------------------------- |
| key       | { type: string, dataAuthority: publicKey} |
| authority | signer                                    |
| data      | data in the format you wish to store      |
| asset     | publicKey                                 |

### Serializing JSON

{% dialect-switcher title="Serializing JSON" %}
{% dialect title="JavaScript" id="js" %}

```ts
const json = {
  timeStamp: Date.now(),
  message: 'Hello, World!',
}

const data = new TextEncoder().encode(JSON.stringify(json))
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
// This uses `serde` and the `serde_json` crates.


let struct_data = MyData {
    timestamp: 1234567890,
    message: "Hello World".to_string(),
};

let data = serde_json::to_vec(&struct_data).unwrap();
```

{% /dialect %}

{% /dialect-switcher %}

### Serializing MsgPack

{% dialect-switcher title="Serializing MsgPack" %}
{% dialect title="JavaScript" id="js" %}

```ts
// This implementation uses `msgpack-lite` for serialization

const json = {
  timeStamp: Date.now(),
  message: 'Hello, World!',
}

const data = msgpack.encode(json)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
// This uses `serde` and the `rmp-serde` crates.

let data = MyData {
    timestamp: 1234567890,
    message: "Hello World".to_string(),
};

let data = rmp_serde::to_vec(&data).unwrap();
```

{% /dialect %}

{% /dialect-switcher %}

### Serializing Binary

As binary can store arbitrary data it's up to you to decide on how you are going to serialize and deserialize the data.

{% dialect-switcher title="Serializing Binary" %}
{% dialect title="JavaScript" id="js" %}

```ts
// The below example is just creating bytes that are considered `true` or `false`.
const data = new Uint8Array([1, 0, 0, 1, 0])
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
// This example shows how to serialize a Rust struct with `bincode`.

let data = MyData {
    timestamp: 1234567890,
    message: "Hello World".to_string(),
};

let data = bincode::serialize(&data).unwrap();
```

{% /dialect %}

{% /dialect-switcher %}

### Writing Data

{% dialect-switcher title="Adding a Attribute Plugin to an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
await writeData(umi, {
  key: {
    type: 'AppData',
    dataAuthority,
  },
  authority: dataAuthoritySigner,
  data: data,
  asset: asset.publicKey,
}).sendAndConfirm(umi)
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
/// ### Accounts:
///
///   0. `[writable]` asset
///   1. `[writable, optional]` collection
///   2. `[writable, signer]` payer
///   3. `[signer, optional]` authority
///   4. `[optional]` buffer
///   5. `[]` system_program
///   6. `[optional]` log_wrapper

// You need to convert your data (Binary, Json, MsgPack) to bytes for storage.
// This can be achieved in a few ways depending on your schema chosen.

let write_to_app_data_plugin_ix = WriteExternalPluginAdapterDataV1CpiBuilder::new()
    .asset(asset)
    .collection(collection)
    .payer(payer)
    .authority(authority)
    .buffer(None)
    .system_program(system_program)
    .log_wrapper(None)
    .key(ExternalPluginAdapterKey::AppData(PluginAuthority::Address {address: plugin_authority.key()}))
    .data(data)
    .instruction()
```

{% /dialect %}

{% /dialect-switcher %}

## Reading Data from the AppData Plugin

Data can be both read on chain programs and external sources pulling account data.

### Fetch the Raw Data

The first step to deserializing the data stored in an `AppData` plugin is to fetch the raw data and check the schema field which dictates the format in which the data is stored before serialization.

{% dialect-switcher title="Fetching `AppData` Raw Data" %}
{% dialect title="JavaScript" id="js" %}

```ts
const assetId = publicKey('11111111111111111111111111111111')
const dataAuthority = publicKey('33333333333333333333333333333333')

const asset = await fetchAsset(umi, assetId)

let appDataPlugin = asset.appDatas?.filter(
  (appData) => (appData.authority.address = dataAuthority)
)

let data
let schema

// Check if `AppData` plugin with the given authority exists
if (appDataPlugin && appDataPlugin.length > 0) {
  // Save plugin data to `data`
  data = appDataPlugin[0].data

  // Save plugin schema to `schema`
  schema = appDataPlugin[0].schema
}
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
let plugin_authority = ctx.accounts.authority.key();

let asset = BaseAssetV1::from_bytes(&data).unwrap();

// Fetches the `AppData` plugin based on the Authority of the plugin.
let plugin_key = ExternalPluginAdapterKey::AppData(PluginAuthority::Address {
    address: plugin_authority });

let app_data_plugin = fetch_external_plugin_adapter::<BaseAssetV1, AppData>(
        &account_info,
        Some(&base_asset),
        &plugin_key,
    )
    .unwrap();

let (data_offset, data_length) =
        fetch_external_plugin_adapter_data_info(&account_info, Some(&asset), &plugin_key)
            .unwrap();

// grab app_data data from account_info
let data = account_info.data.borrow()[data_offset..data_offset + data_length].to_vec();

```

{% /dialect %}

{% /dialect-switcher %}

### Deserialization

Now that you have the data you'll need to deserialize the data depending on the schema you chose to write the data with to the `AppData` plugins.

#### Deserialize JSON Schema

{% dialect-switcher title="Deserializing JSON" %}
{% dialect title="JavaScript" id="js" %}

```ts
// Due to the JS SDK, the deserialization for the MsgPack schema is automatic and deserialized
// data can be accessed at the RAW location example above.
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
// For the `JSON` schema you will need to use the `serde` and `serde_json` crates.

// You will need to add `Serialize` and `Deserialize` to your `derive` macro
// on your struct.
#[derive(Debug, Serialize, Deserialize)]
pub struct MyData {
    pub timestamp: u64,
    pub message: String,
}

let my_data: MyData = serde_json::from_slice(&data).unwrap();
println!("{:?}", my_data);
```

{% /dialect %}

{% /dialect-switcher %}

#### Deserialize MsgPack Schema



{% dialect-switcher title="Deserializing MsgPack" %}
{% dialect title="JavaScript" id="js" %}

```ts
// Due to the JS SDK, the deserialization for the MsgPack schema is automatic and deserialized
// data can be accessed at the RAW location example above.
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
// For the `MsgPack` schema you will need to use the `serde` and `rmp_serde` crates.

// You will need to add `Serialize` and `Deserialize` to your `derive` macro
// on your struct.
#[derive(Debug, Serialize, Deserialize)]
pub struct MyData {
    pub timestamp: u64,
    pub message: String,
}


let my_data: MyData = rmp_serde::decode::from_slice(&data).unwrap();
println!("{:?}", my_data);
```

{% /dialect %}

{% /dialect-switcher %}

#### Deserialize Binary Schema

Because the **Binary** schema is arbitrary data then deserialization will be dependent on the serialization you used.

{% dialect-switcher title="Deserializing Binary" %}
{% dialect title="JavaScript" id="js" %}
```js
// As the binary data is arbitrary you will need to include your own deserializer to
// parse the data into a usable format your app/website will understand.
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
#[derive(Debug, Serialize, Deserialize)]
pub struct MyData {
    pub timestamp: u64,
    pub message: String,
}

// In the below example we'll look at deserialization 
// using the `bincode` crate to a struct.
let my_data: MyData = bincode::deserialize(&data).unwrap();
println!("{:?}", my_data);
```

{% /dialect %}

{% /dialect-switcher %}
