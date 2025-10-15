---
title: Helpers
metaTitle: Helpers | Core
description: 검증 헬퍼, 조회 헬퍼, 플러그인 헬퍼 등과 같은 Core 헬퍼 함수에 대해 알아보세요.
---


{% callout type="note" title="JS 헬퍼 함수" %}

다음 헬퍼 함수는 JS 클라이언트용입니다.

{% /callout %}

## 조회 헬퍼

새로운 조회 헬퍼를 사용하면 각 헬퍼 메서드에서 플러그인을 파생할지 여부를 선택할 수 있습니다.

### fetchAsset()

단일 Asset을 조회합니다.

```ts
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
```

### fetchAssetsByOwner()

주어진 소유자 주소의 모든 Assets을 조회합니다.

```ts
const assetsByOwner = await fetchAssetsByOwner(umi, owner, {
  skipDerivePlugins: false,
})
```

### fetchAssetsByCollection()

주어진 Collection 주소의 모든 Assets을 조회합니다.

```ts
const assetsByCollection = await fetchAssetsByCollection(umi, collection, {
  skipDerivePlugins: false,
})
```

### fetchAssetsByUpdateAuthority()

주어진 Collection 주소의 모든 Assets을 조회합니다.

```ts
const assetsByUpdateAuthority = await fetchAssetsByUpdateAuthority(
  umi,
  updateAuthority,
  { skipDerivePlugins: false }
)
```

## 권한 헬퍼

권한 헬퍼를 사용하면 `publicKey`를 전달하여 해당 주소가 Core 생태계의 특정 측면(Assets, Collections, Plugins)에 대한 권한을 가지고 있는지 확인할 수 있습니다.

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

`hasAssetUpdateAuthority()`는 전달된 `pubkey`가 Asset에 대한 업데이트 권한을 보유하고 있는지 여부에 따라 `boolean` 값을 반환합니다.

```ts
export function hasAssetUpdateAuthority(
  pubkey: string | PublicKey,
  asset: AssetV1,
  collection?: CollectionV1
)
```

### hasCollectionUpdateAuthority()

`hasCollectionUpdateAuthority()`는 전달된 `pubkey`가 Collection에 대한 업데이트 권한을 보유하고 있는지 여부에 따라 `boolean` 값을 반환합니다.

```ts
export function hasCollectionUpdateAuthority(
  pubkey: string | PublicKey,
  collection: CollectionV1
)
```

## 생명 주기 헬퍼

**생명 주기 헬퍼**는 주소가 특정 생명 주기 이벤트를 수행할 수 있는지 빠르고 효율적으로 확인하는 방법을 제공합니다.

### validateTransfer()

publicKey가 Asset을 전송할 자격이 있는지 여부에 대한 `boolean` 값을 반환합니다.

```ts
export async function validateTransfer(
  umi,
  { authority, asset, collection, recipient }
)
```

### validateBurn

publicKey가 Asset을 소각할 수 있는지 여부에 대한 `boolean` 값을 반환합니다.

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

플러그인 타입을 자산 플러그인의 키로 변환합니다.

```ts
export function assetPluginKeyFromType(pluginType: PluginType)
```

### pluginTypeFromAssetPluginKey()

플러그인 키를 타입으로 변환합니다.

```ts
export function pluginTypeFromAssetPluginKey(key: AssetPluginKey)
```

### checkPluginAuthorities()

자산의 주어진 플러그인 타입에 대한 권한을 확인합니다.

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

자산이 컬렉션의 일부인 경우 주어진 자산의 컬렉션 주소를 찾습니다.
`publicKey | undefined`를 반환합니다.

```ts
export function collectionAddress(asset: AssetV1)
```

### deriveAssetPlugins()

자산과 컬렉션에서 자산 플러그인을 파생합니다. 자산의 플러그인이 컬렉션의 플러그인보다 우선합니다.

```ts
export function deriveAssetPlugins(asset: AssetV1, collection?: CollectionV1)
```

### isFrozen()

Asset이 동결되어 있는지 여부에 대한 `boolean` 값을 반환합니다.

```ts
export function isFrozen(asset: AssetV1, collection?: CollectionV1)
```