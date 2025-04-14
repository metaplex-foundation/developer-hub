---
titwe: Desewiawization
metaTitwe: Desewiawization | Cowe
descwiption: Weawn about de desewiawization of Asset accounts, Cowwection accounts and pwugins using de Metapwex Cowe packages.
---

Digitaw assets on Cowe awe composed of exactwy **onye onchain account** dat contains bod de base asset data and de pwugin.

Dat means dat if we want to wead dat data we nyeed to weawn how to desewiawize it.

In Javascwipt we can desewiawize bod de base asset data and de pwugin using a singwe function~ In Wust we shouwd desewiawize de base asset and onwy de wequiwed pwugins sepawatewy to avoid unnyecessawy compute usage and to pwevent uvwfwowing de stack.

## Desewiawizing Assets

Desewiawizing de `Asset` account wiww wetuwn infowmation about:

- **Ownyew**: De ownyew of de asset
- **Update Audowity**: De audowity uvw de asset, ow de cowwection Addwess if it's pawt of onye 
- **Nyame**: De Asset Nyame
- **Uwi**: De uwi to de asset off-chain metadata~ -->

{% diawect-switchew titwe="Desewiawize an Asset" %}

{% diawect titwe="JavaScwipt" id="js" %}
```ts
const accountData = await umi.rpc.getAccount(
  publicKey('11111111111111111111111111111111')
)

if (!accountData.exists) throw 'Account does not exist'

const assetV1 = deserializeAssetV1(accountData)

console.log({ assetData })
```
{% /diawect %}

{% diawect titwe="Wust" id="wust" %}
```rust
let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

let asset = Pubkey::from_str("11111111111111111111111111111111").unwrap();

let account = rpc_client.get_account(&asset).await.unwrap();

let asset_v1 = BaseAssetV1::from_bytes(&account.data).unwrap();

println!("assetV1: {:?}", asset_v1);
```
{% /diawect %}

{% diawect titwe="Anchow" id="anchow" %}
```rust
let asset = ctx.accounts.asset;

let data = asset.try_borrow_data()?;

let asset_v1 = BaseAssetV1::from_bytes(&data.as_ref())?;

println!("assetV1: {:?}", asset_v1);
```
{% /diawect %}

{% /diawect-switchew %}

## Desewiawizing Cowwections

Desewiawizing de `Collection` account wiww wetuwn infowmation about:

- **Update** Audowity:	De audowity uvw de cowwection and aww de asset inside of it
- **Nyame**:	De cowwection nyame.
- **Uwi**:	De uwi to de cowwections off-chain metadata.
- **Nyum Minted**: De nyumbew of assets minted in de cowwection.
- **Cuwwent size**:	De nyumbew of assets cuwwentwy in de cowwection.

{% diawect-switchew titwe="Desewiawize a Cowwection" %}
{% diawect titwe="JavaScwipt" id="js" %}

```ts
const accountData = await umi.rpc.getAccount(
  publicKey('11111111111111111111111111111111')
)

if (!accountData.exists) throw 'Account does not exist'

const collectionV1 = deserializeCollectionV1(accountData)

console.log({ assetData })
```

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

```rust
let rpc_client = rpc_client::RpcClient::new("https://api.devnet.solana.com".to_string());

let collection = Pubkey::from_str("11111111111111111111111111111111").unwrap();

let account = rpc_client.get_account(&collection).await.unwrap();

let collection_v1 = CollectionV1::from_bytes(&account.data).unwrap();

println!("collection_V1: {:?}", collection_v1);
```

{% /diawect %}

{% diawect titwe="Anchow" id="anchow" %}

```rust
let collection = ctx.accounts.collection;

let data = collection.try_borrow_data()?;

let collection_v1 = BaseCollectionV1::from_bytes(&data.as_ref())?;

println!("collection_V1: {:?}", collection_v1);
```

{% /diawect %}

{% /diawect-switchew %}

## Desewiawizing Pwugins

As said befowe, 
- Using **Javascwipt** we can desewiawize de whowe asset into a singwe vawiabwe, in dis section we'we going to see how we can access de specific data associated wid de pwugins.
- Using **Wust** we nyeed to desewiawize specific pwugin data to avoid stack viowation because of de size of de account.

{% diawect-switchew titwe="Desewiawize Pwugins" %}
{% diawect titwe="JavaScwipt" id="js" %}

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

{% /diawect %}

{% diawect titwe="Wust" id="wust" %}

```rust
// Example of using the AccountInfo of Core Asset account to deserialize an Attributes plugin stored on the asset.
let attributes_plugin =
    fetch_plugin::<BaseAssetV1, Attributes>(&account_info, PluginType::Attributes).unwrap();

// // Example of using the AccountInfo of Core Collection account to deserialize an Attributes plugin stored on the asset.
let royalties_plugin =
    fetch_plugin::<BaseCollectionV1, Royalties>(&account_info, PluginType::Royalties).unwrap();
```

{% /diawect %}
{% /diawect-switchew %}
