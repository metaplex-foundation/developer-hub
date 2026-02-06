---
title: 헬퍼
metaTitle: 헬퍼 | Core
description: 유효성 검사 헬퍼, 페치 헬퍼, 플러그인 헬퍼 등 Core 헬퍼 함수에 대해 알아봅니다.
updated: '01-31-2026'
keywords:
  - Core helpers
  - fetch helpers
  - plugin helpers
  - validation helpers
  - mpl-core utilities
about:
  - Helper functions
  - SDK utilities
  - Validation
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---
{% callout type="note" title="JS 헬퍼 함수" %}
다음 헬퍼 함수들은 JS 클라이언트용입니다.
{% /callout %}
## 페치 헬퍼
새로운 페치 헬퍼를 사용하면 각 헬퍼 메서드에서 플러그인을 상속할지 여부를 선택할 수 있습니다.
### fetchAsset()
단일 Asset을 가져옵니다.
```ts
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
```
### fetchAssetsByOwner()
지정된 소유자 주소의 모든 Asset을 가져옵니다.
```ts
const assetsByOwner = await fetchAssetsByOwner(umi, owner, {
  skipDerivePlugins: false,
})
```
### fetchAssetsByCollection()
지정된 Collection 주소의 모든 Asset을 가져옵니다.
```ts
const assetsByCollection = await fetchAssetsByCollection(umi, collection, {
  skipDerivePlugins: false,
})
```
### fetchAssetsByUpdateAuthority()
지정된 Collection 주소의 모든 Asset을 가져옵니다.
```ts
const assetsByUpdateAuthority = await fetchAssetsByUpdateAuthority(
  umi,
  updateAuthority,
  { skipDerivePlugins: false }
)
```
## Authority 헬퍼
Authority 헬퍼를 사용하면 `publicKey`를 전달하여 해당 주소가 Core 생태계의 특정 측면(Asset, Collection, 플러그인)에 대한 권한을 가지고 있는지 확인할 수 있습니다.
### hasPluginAddressAuthority()
`hasPluginAddressAuthority()`는 전달된 플러그인의 권한이 `Address` 타입으로 설정되어 있고 `pubkey`가 일치하는지 여부에 따라 `boolean` 값을 반환합니다.
```ts
export function hasPluginAddressAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority
)
```
### hasPluginOwnerAuthority()
`hasPluginOwnerAuthority()`는 전달된 플러그인의 권한이 `Owner` 타입으로 설정되어 있고 `pubkey`가 일치하는지 여부에 따라 `boolean` 값을 반환합니다.
```ts
export function hasPluginOwnerAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority,
  asset: AssetV1
)
```
### hasPluginUpdateAuthority()
`hasPluginUpdateAuthority()`는 전달된 플러그인의 권한이 `UpdateAuthority` 타입으로 설정되어 있고 `pubkey`가 일치하는지 여부에 따라 `boolean` 값을 반환합니다.
```ts
export function hasPluginUpdateAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority,
  asset: AssetV1,
  collection?: CollectionV1
)
```
### hasAssetUpdateAuthority()
`hasAssetUpdateAuthority()`는 전달된 `pubkey`가 Asset에 대한 Update Authority를 가지고 있는지 여부에 따라 `boolean` 값을 반환합니다.
```ts
export function hasAssetUpdateAuthority(
  pubkey: string | PublicKey,
  asset: AssetV1,
  collection?: CollectionV1
)
```
### hasCollectionUpdateAuthority()
`hasCollectionUpdateAuthority()`는 전달된 `pubkey`가 Collection에 대한 Update Authority를 가지고 있는지 여부에 따라 `boolean` 값을 반환합니다.
```ts
export function hasCollectionUpdateAuthority(
  pubkey: string | PublicKey,
  collection: CollectionV1
)
```
## 라이프사이클 헬퍼
**라이프사이클 헬퍼**는 주소가 특정 라이프사이클 이벤트를 수행할 수 있는지 빠르고 효율적으로 확인하는 방법을 제공합니다.
### validateTransfer()
publicKey가 Asset을 전송할 자격이 있는지 여부에 대한 `boolean` 값을 반환합니다.
```ts
export async function validateTransfer(
  umi,
  { authority, asset, collection, recipient }
)
```
### validateBurn
publicKey가 Asset을 번할 수 있는지 여부에 대한 `boolean` 값을 반환합니다.
```ts
export async function validateBurn(umi, { authority, asset, collection })
```
### canUpdate()
publicKey가 Asset을 업데이트할 자격이 있는지 여부에 대한 `boolean` 값을 반환합니다.
```ts
export async function validateUpdate(
  umi,
  { authority, asset, collection }
)
```
### 플러그인 헬퍼
### assetPluginKeyFromType()
플러그인 타입을 Asset 플러그인용 키로 변환합니다.
```ts
export function assetPluginKeyFromType(pluginType: PluginType)
```
### pluginTypeFromAssetPluginKey()
플러그인 키를 타입으로 변환합니다.
```ts
export function pluginTypeFromAssetPluginKey(key: AssetPluginKey)
```
### checkPluginAuthorities()
Asset의 지정된 플러그인 타입에 대한 권한을 확인합니다.
```ts
export function checkPluginAuthorities({
  authority,
  pluginTypes,
  asset,
  collection,
})
```
## 상태 헬퍼
### collectionAddress()
Asset이 Collection의 일부인 경우 해당 Collection 주소를 찾습니다.
`publicKey | undefined`를 반환합니다.
```ts
export function collectionAddress(asset: AssetV1)
```
### deriveAssetPlugins()
Asset과 Collection에서 Asset 플러그인을 상속합니다. Asset의 플러그인이 Collection의 플러그인보다 우선합니다.
```ts
export function deriveAssetPlugins(asset: AssetV1, collection?: CollectionV1)
```
### isFrozen()
Asset이 동결되어 있는지 여부에 대한 `boolean`을 반환합니다.
```ts
export function isFrozen(asset: AssetV1, collection?: CollectionV1)
```
