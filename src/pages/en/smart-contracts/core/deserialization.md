---
title: Deserialization
metaTitle: Deserialization | Core
description: Learn about the deserialization of Asset accounts, Collection accounts and plugins using the Metaplex Core packages.
---

Digital assets on Core are composed of exactly **one onchain account** that contains both the base asset data and the plugin.

That means that if we want to read that data we need to learn how to deserialize it.

In Javascript we can deserialize both the base asset data and the plugin using a single function. In Rust we should deserialize the base asset and only the required plugins separately to avoid unnecessary compute usage and to prevent overflowing the stack.

## Deserializing Assets

Deserializing the `Asset` account will return information about:

- **Owner**: The owner of the asset
- **Update Authority**: The authority over the asset, or the collection Address if it's part of one 
- **Name**: The Asset Name
- **Uri**: The uri to the asset off-chain metadata. -->

{% dialect-switcher title="Deserialize an Asset" %}

{% dialect title="JavaScript" id="js" %}
```ts
const accountData = await umi.rpc.getAccount(
  publicKey('11111111111111111111111111111111')
)

if (!accountData.exists) throw 'Account does not exist'

const assetV1 = deserializeAssetV1(accountData)

console.log({ assetData })
```
{% /dialect %}

{% dialect title="Rust" id="rust" %}
```rust
let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

let account = rpc_client.get_account(&asset).await.unwrap();

let asset_v1 = BaseAssetV1::from_bytes(&account.data).unwrap();

println!("assetV1: {:?}", asset_v1);
```
{% /dialect %}

{% dialect title="Anchor" id="anchor" %}
```rust
let asset = ctx.accounts.asset;

let data = asset.try_borrow_data()?;

let asset_v1 = BaseAssetV1::from_bytes(&data.as_ref())?;

println!("assetV1: {:?}", asset_v1);
```
{% /dialect %}

{% /dialect-switcher %}

## Deserializing Collections

Deserializing the `Collection` account will return information about:

- **Update** Authority:	The authority over the collection and all the asset inside of it
- **Name**:	The collection name.
- **Uri**:	The uri to the collections off-chain metadata.
- **Num Minted**: The number of assets minted in the collection.
- **Current size**:	The number of assets currently in the collection.

{% dialect-switcher title="Deserialize a Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
const accountData = await umi.rpc.getAccount(
  publicKey('11111111111111111111111111111111')
)

if (!accountData.exists) throw 'Account does not exist'

const collectionV1 = deserializeCollectionV1(accountData)

console.log({ assetData })
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();

let account = rpc_client.get_account(&collection).await.unwrap();

let collection_v1 = CollectionV1::from_bytes(&account.data).unwrap();

println!("collection_V1: {:?}", collection_v1);
```

{% /dialect %}

{% dialect title="Anchor" id="anchor" %}

```rust
let collection = ctx.accounts.collection;

let data = collection.try_borrow_data()?;

let collection_v1 = BaseCollectionV1::from_bytes(&data.as_ref())?;

println!("collection_V1: {:?}", collection_v1);
```

{% /dialect %}

{% /dialect-switcher %}

## Deserializing Plugins

As said before, 
- Using **Javascript** we can deserialize the whole asset into a single variable, in this section we're going to see how we can access the specific data associated with the plugins.
- Using **Rust** we need to deserialize specific plugin data to avoid stack violation because of the size of the account.

{% dialect-switcher title="Deserialize Plugins" %}
{% dialect title="JavaScript" id="js" %}

```ts
const assetV1 = await fetchAsset(
  umi,
  publicKey('11111111111111111111111111111111')
)

// Example of saving just the deserialized data of the Attributes Plugin
let attributes_plugin = assetV1.attributes

// Example of saving just the deserialized data of the Royalties Plugin
let royalties_plugin = assetV1.royalties
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
// Example of using the AccountInfo of Core Asset account to deserialize an Attributes plugin stored on the asset.
let attributes_plugin =
    fetch_plugin::<BaseAssetV1, Attributes>(&account_info, PluginType::Attributes).unwrap();

// // Example of using the AccountInfo of Core Collection account to deserialize an Attributes plugin stored on the asset.
let royalties_plugin =
    fetch_plugin::<BaseCollectionV1, Royalties>(&account_info, PluginType::Royalties).unwrap();
```

{% /dialect %}
{% /dialect-switcher %}
