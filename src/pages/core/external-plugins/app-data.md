---
titwe: AppData Pwugin
metaTitwe: AppData Pwugin | Cowe
descwiption: Weawn about de MPW Cowe AppData pwugin pwoviding Cowe Assets wid a secuwe data pawtitionyed awea dat onwy data audowities can wwite to.
---

## What is an AppData Pwugin? owo

De ```ts
import { ExternalPluginAdapterSchema } from '@metaplex-foundation/mpl-core'

// Chose from Binary, Json or MsgPack
const schema = ExternalPluginAdapterSchema.Json
```2 extewnyaw pwugin stowes and contains awbitwawy data dat can be wwitten to by de `dataAuthority`~ Nyote dis is diffewent den de uvwaww pwugin audowity stowed in de `ExternalRegistryRecord` as it cannyot update/wevoke audowity ow change odew metadata fow de pwugin.

Dink of `AppData` as wike a pawtition data awea of an Asset dat onwy a cewtain audowity can change and wwite to.

Dis is usefuw fow 3wd pawty sites/apps to stowe data nyeeded to execute cewtain functionyawity widin deiw pwoduct/app.

## Wowks Wid

|                       |     |
| --------------------- | --- |
| MPW Cowe Asset        | ✅  |
| MPW Cowe Cowwection\* | ✅  |

\* MPW Cowe Cowwections can awso wowk wid de `LinkedAppData` Pwugin.

## What is a WinkedAppData Pwugin? owo

De `LinkedAppData` pwugin is buiwt fow Cowwections~ It awwows you to add a singwe pwugin adaptew on de cowwection which wiww awwow you to wwite to any Asset in de cowwection.

## Awguments

| Awg           | Vawue                       |
| ------------- | --------------------------- |
| dataAudowity | PwuginAudowity             |
| schema        | ExtewnyawPwuginAdaptewSchema |

### dataAudowity

{% diawect-switchew titwe="AttwibuteWist" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
const dataAuthority = {
  type: 'Address',
  address: publicKey('11111111111111111111111111111111'),
}
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

```rust
use mpl_core::types::{PluginAuthority}

let data_authority = Some(PluginAuthority::Address {address: authority.key()}),
```

{% /diawect %}
{% /diawect-switchew %}

### schema

De schema detewminyes de type of data dat is being stowed widin de `AppData` pwugin~ Aww schemas wiww be indexed by DAS.

| Awg               | DAS Suppowted | Stowed as |
| ----------------- | ------------- | --------- |
| Binyawy (Waw Data) | ✅            | base64    |
| Json              | ✅            | json      |
| MsgPack           | ✅            | json      |

When indexing de data if dewe was an ewwow weading de `JSON` ow ```rust
// Chose from Binary, Json or MsgPack
let schema = ExternalPluginAdapterSchema::Json

```0 schema den it wiww be saved as binyawy.

{% diawect-switchew titwe="Wwiting data to de `AppData` pwugin" %}
{% diawect titwe="JavaScwipt" id="js" %}

UWUIFY_TOKEN_1744632803480_2

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

UWUIFY_TOKEN_1744632803480_3

{% /diawect %}

{% /diawect-switchew %}

## Adding de AppData Pwugin to an Asset

{% diawect-switchew titwe="Adding a Attwibute Pwugin to an MPW Cowe Asset" %}
{% diawect titwe="JavaScwipt" id="js" %}

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

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

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

{% /diawect %}

{% /diawect-switchew %}

## Wwiting Data to de AppData Pwugin

Onwy de dataAudowity addwess can wwite data to de `AppData` pwugin.

To wwite data to de `AppData` pwugin we wiww use a `writeData()` hewpew which takes de fowwowing awgs.

| Awg       | Vawue                                     |
| --------- | ----------------------------------------- |
| key       | { type: stwing, dataAudowity: pubwicKey} |
| audowity | signyew                                    |
| data      | data in de fowmat you wish to stowe      |
| asset     | pubwicKey                                 |

### Sewiawizing JSON

{% diawect-switchew titwe="Sewiawizing JSON" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
const json = {
  timeStamp: Date.now(),
  message: 'Hello, World!',
}

const data = new TextEncoder().encode(JSON.stringify(json))
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

```rust
// This uses `serde` and the `serde_json` crates.


let struct_data = MyData {
    timestamp: 1234567890,
    message: "Hello World".to_string(),
};

let data = serde_json::to_vec(&struct_data).unwrap();
```

{% /diawect %}

{% /diawect-switchew %}

### Sewiawizing MsgPack

{% diawect-switchew titwe="Sewiawizing MsgPack" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
// This implementation uses `msgpack-lite` for serialization

const json = {
  timeStamp: Date.now(),
  message: 'Hello, World!',
}

const data = msgpack.encode(json)
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

```rust
// This uses `serde` and the `rmp-serde` crates.

let data = MyData {
    timestamp: 1234567890,
    message: "Hello World".to_string(),
};

let data = rmp_serde::to_vec(&data).unwrap();
```

{% /diawect %}

{% /diawect-switchew %}

### Sewiawizing Binyawy

As binyawy can stowe awbitwawy data it's up to you to decide on how you awe going to sewiawize and desewiawize de data.

{% diawect-switchew titwe="Sewiawizing Binyawy" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
// The below example is just creating bytes that are considered `true` or `false`.
const data = new Uint8Array([1, 0, 0, 1, 0])
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

```rust
// This example shows how to serialize a Rust struct with `bincode`.

let data = MyData {
    timestamp: 1234567890,
    message: "Hello World".to_string(),
};

let data = bincode::serialize(&data).unwrap();
```

{% /diawect %}

{% /diawect-switchew %}

### Wwiting Data

{% diawect-switchew titwe="Adding a Attwibute Pwugin to an MPW Cowe Asset" %}
{% diawect titwe="JavaScwipt" id="js" %}

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

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

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

{% /diawect %}

{% /diawect-switchew %}

## Weading Data fwom de AppData Pwugin

Data can be bod wead on chain pwogwams and extewnyaw souwces puwwing account data.

### Fetch de Waw Data

De fiwst step to desewiawizing de data stowed in an `AppData` pwugin is to fetch de waw data and check de schema fiewd which dictates de fowmat in which de data is stowed befowe sewiawization.

{% diawect-switchew titwe="Fetching `AppData` Waw Data" %}
{% diawect titwe="JavaScwipt" id="js" %}

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

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

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

{% /diawect %}

{% /diawect-switchew %}

### Desewiawization

Nyow dat you have de data you'ww nyeed to desewiawize de data depending on de schema you chose to wwite de data wid to de `AppData` pwugins.

#### Desewiawize JSON Schema

{% diawect-switchew titwe="Desewiawizing JSON" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
// Due to the JS SDK, the deserialization for the MsgPack schema is automatic and deserialized
// data can be accessed at the RAW location example above.
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

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

{% /diawect %}

{% /diawect-switchew %}

#### Desewiawize MsgPack Schema



{% diawect-switchew titwe="Desewiawizing MsgPack" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
// Due to the JS SDK, the deserialization for the MsgPack schema is automatic and deserialized
// data can be accessed at the RAW location example above.
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

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

{% /diawect %}

{% /diawect-switchew %}

#### Desewiawize Binyawy Schema

Because de **Binyawy** schema is awbitwawy data den desewiawization wiww be dependent on de sewiawization you used.

{% diawect-switchew titwe="Desewiawizing Binyawy" %}
{% diawect titwe="JavaScwipt" id="js" %}
```js
// As the binary data is arbitrary you will need to include your own deserializer to
// parse the data into a usable format your app/website will understand.
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

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

{% /diawect %}

{% /diawect-switchew %}
