---
title: Deserialization
metaTitle: Deserialization
description: Learn about the deserialization of Asset accounts, Collection accounts and plugins.
---

## Deserialization

### Assests

{% dialect-switcher title="Deserialize an Asset" %}
{% dialect title="JavaScript" id="js" %}

```ts
const accountData = await umi.rpc.getAccount(
  publicKey('11111111111111111111111111111111')
)

if (!accountData.exists) throw 'Account does not exist'

const assetData = getAssetV1AccountDataSerializer().deserialize(
  accountData.data
)

console.log({ assetData })
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```ts
let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

let account = rpc_client.get_account(&asset).await.unwrap();

let asset_v1 = BaseAssetV1::from_bytes(&account.data).unwrap();

println!("assetV1: {:?}", asset_v1);
```

{% /dialect %}
{% /dialect-switcher %}

### Collections

{% dialect-switcher title="Deserialize an Collection" %}
{% dialect title="JavaScript" id="js" %}

```ts
const accountData = await umi.rpc.getAccount(
  publicKey('11111111111111111111111111111111')
)

if (!accountData.exists) throw 'Account does not exist'

const assetData = getCollectionV1AccountDataSerializer().deserialize(
  accountData.data
)

console.log({ assetData })
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```ts
let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

let account = rpc_client.get_account(&asset).await.unwrap();

let asset_v1 = BaseAssetV1::from_bytes(&account.data).unwrap();

println!("assetV1: {:?}", asset_v1);
```

{% /dialect %}
{% /dialect-switcher %}

### Plugins

{% dialect-switcher title="Deserialize Plugins" %}
{% dialect title="JavaScript" id="js" %}

```ts
const accountData = await umi.rpc.getAccount(
  publicKey('11111111111111111111111111111111')
)

if (!accountData.exists) throw 'Account does not exist'

const assetData = getCollectionV1AccountDataSerializer().deserialize(
  accountData.data
)

console.log({ assetData })
```

{% /dialect %}

{% dialect title="Rust" id="rust" %}

```rust
// Example of using the AccountInfo of Core Asset account to deserialize an Attributes plugin stored on the asset.
let attributes_plugin =
    fetch_plugin::<BaseAssetV1, Attributes>(&account_info, PluginType::Attributes).unwrap();

// // Example of using the AccountInfo of Core Collection account to deserialize an Attributes plugin stored on the asset.
let attributes_plugin =
    fetch_plugin::<BaseCollectionV1, Royalties>(&account_info, PluginType::Royalties).unwrap();
```

{% /dialect %}
{% /dialect-switcher %}

## Serialization

### Assests

### Collections

### Plugins
