---
title: 역직렬화
metaTitle: 역직렬화 | Core
description: Metaplex Core 패키지를 사용한 Asset 계정, Collection 계정 및 플러그인의 역직렬화에 대해 알아봅니다.
updated: '01-31-2026'
keywords:
  - deserialize asset
  - read asset data
  - account parsing
  - plugin deserialization
about:
  - Account deserialization
  - Data parsing
  - Plugin reading
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
---
Core의 디지털 자산은 기본 자산 데이터와 플러그인을 모두 포함하는 정확히 **하나의 온체인 계정**으로 구성됩니다.
즉, 해당 데이터를 읽으려면 역직렬화 방법을 배워야 합니다.
Javascript에서는 단일 함수를 사용하여 기본 자산 데이터와 플러그인을 모두 역직렬화할 수 있습니다. Rust에서는 불필요한 계산 사용을 피하고 스택 오버플로우를 방지하기 위해 기본 자산과 필요한 플러그인만 별도로 역직렬화해야 합니다.
## Asset 역직렬화
`Asset` 계정을 역직렬화하면 다음 정보가 반환됩니다:
- **Owner**: 자산의 소유자
- **Update Authority**: 자산에 대한 authority, 또는 컬렉션의 일부인 경우 컬렉션 주소
- **Name**: 자산 이름
- **Uri**: 자산의 오프체인 메타데이터에 대한 uri
{% dialect-switcher title="Asset 역직렬화" %}
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
## Collection 역직렬화
`Collection` 계정을 역직렬화하면 다음 정보가 반환됩니다:
- **Update Authority**: 컬렉션과 그 안의 모든 자산에 대한 authority
- **Name**: 컬렉션 이름
- **Uri**: 컬렉션의 오프체인 메타데이터에 대한 uri
- **Num Minted**: 컬렉션에서 발행된 자산 수
- **Current size**: 현재 컬렉션에 있는 자산 수
{% dialect-switcher title="Collection 역직렬화" %}
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
## 플러그인 역직렬화
앞서 말했듯이,
- **Javascript**를 사용하면 전체 자산을 단일 변수로 역직렬화할 수 있으며, 이 섹션에서는 플러그인과 관련된 특정 데이터에 액세스하는 방법을 살펴봅니다.
- **Rust**를 사용할 때는 계정 크기로 인한 스택 위반을 방지하기 위해 특정 플러그인 데이터를 역직렬화해야 합니다.
{% dialect-switcher title="플러그인 역직렬화" %}
{% dialect title="JavaScript" id="js" %}
```ts
const assetV1 = await fetchAsset(
  umi,
  publicKey('11111111111111111111111111111111')
)
// Attributes 플러그인의 역직렬화된 데이터만 저장하는 예
let attributes_plugin = assetV1.attributes
// Royalties 플러그인의 역직렬화된 데이터만 저장하는 예
let royalties_plugin = assetV1.royalties
```
{% /dialect %}
{% dialect title="Rust" id="rust" %}
```rust
// Core Asset 계정의 AccountInfo를 사용하여 자산에 저장된 Attributes 플러그인을 역직렬화하는 예
let attributes_plugin =
    fetch_plugin::<BaseAssetV1, Attributes>(&account_info, PluginType::Attributes).unwrap();
// Core Collection 계정의 AccountInfo를 사용하여 자산에 저장된 Royalties 플러그인을 역직렬화하는 예
let royalties_plugin =
    fetch_plugin::<BaseCollectionV1, Royalties>(&account_info, PluginType::Royalties).unwrap();
```
{% /dialect %}
{% /dialect-switcher %}
