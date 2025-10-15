---
title: Core JS SDK v1.0
metaTitle: Core JS SDK v1.0 | Core
description: Metaplex Core JS SDK v1.0의 새로운 기능은 무엇인가요?
---

## V1 마일스톤!

**Core JS SDK v1.0** 출시는 JS Mpl Core 패키지를 사용하는 개발자와 최종 사용자를 위한 이름 지정 및 기능 면에서 새로운 개선 사항을 제공합니다.

## 주요 변경 사항

### 플러그인 생성자 함수

코드베이스에는 여전히 존재하지만, 새로운 래퍼를 통해 생성자 함수 없이 플러그인을 정의할 수 있습니다.

**자동 생성된 Kinobi 함수**

```ts
await createV1(umi, {
  asset: assetSigner,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  plugins: [
    {
      plugin: createPluginV2({
        type: 'Attributes',
        attributeList: [{ key: 'key', value: 'value' }],
      }),
      authority: pluginAuthority('UpdateAuthority'),
    },
  ],
}).sendAndConfirm(umi)
```

**JS SDK v1.0**

```ts
await create(umi, {
  asset: assetSigner,
  name: 'My Asset',
  uri: 'https://example.com/my-asset.json',
  plugins: [
    { type: 'Attributes', attributeList: [{ key: 'key', value: 'value' }] },
  ],
}).sendAndConfirm(umi)
```

### 플러그인 데이터

플러그인 데이터는 플러그인 객체의 데이터 필드 하위에 중첩되는 대신 최상위 레벨로 끌어올려집니다.

**자동 생성된 Kinobi 함수**

```ts
await addPluginV1(umi, {
  asset: asset.publicKey,
  plugin: createPlugin({ type: 'FreezeDelegate', data: { frozen: true } }),
  initAuthority: addressPluginAuthority(delegate),
}).sendAndConfirm(umi)
```

**JS SDK v1.0**

```ts
await addPlugin(umi, {
  asset: assetId,
  plugin: {
    type: 'Attributes',
    attributeList: [{ key: 'key', value: 'value' }],
  },
}).sendAndConfirm(umi)
```

### 라이프사이클 래퍼가 이제 자산 객체를 요구함

create/update/transfer/burn은 이제 외부 플러그인 어댑터 계정과 같은 추가 계정을 파생시키기 위해 전체 자산/컬렉션 객체를 요구합니다.

**자동 생성된 Kinobi 함수**

```ts
const asset = publicKey('11111111111111111111111111111111')

await updateV1(umi, {
  asset, // publicKey를 받음
  newName: 'New Asset Name',
  newUri: 'https://example.com/new-uri',
}).sendAndConfirm(umi)
```

**JS SDK v1.0**

```ts
const asset = await fetchAssetV1(umi, asset)

await update(umi, {
  asset, // 전체 자산 객체를 받음.
  name: 'New Asset Name',
  uri: 'https://example.com/new-uri',
}).sendAndConfirm(umi)
```

add/removePlugin과 add/removeCollectionPlugin은 외부 플러그인 여부에 따라 자동으로 올바른 명령어를 찾아 라우팅합니다.

### Oracle 외부 플러그인

Oracle 외부 플러그인 지원이 활성화되었습니다.

## 새롭고 향상된 헬퍼

**Core JS SDK v1.0**은 Core 자산/컬렉션과 해당 데이터를 다룰 때의 복잡성을 줄여주는 새롭고 향상된 헬퍼 메서드들을 제공합니다.

### Fetch 헬퍼

새로운 fetch 헬퍼를 통해 각 헬퍼 메서드에서 플러그인을 파생시킬지 여부를 선택할 수 있습니다.

#### fetchAsset()

단일 자산을 가져옵니다.

```ts
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
```

#### fetchAssetsByOwner()

주어진 소유자 주소의 모든 자산을 가져옵니다.

```ts
const assetsByOwner = await fetchAssetsByOwner(umi, owner, {
  skipDerivePlugins: false,
})
```

#### fetchAssetsByCollection()

주어진 컬렉션 주소의 모든 자산을 가져옵니다.

```ts
const assetsByCollection = await fetchAssetsByCollection(umi, collection, {
  skipDerivePlugins: false,
})
```

#### fetchAssetsByUpdateAuthority()

주어진 컬렉션 주소의 모든 자산을 가져옵니다.

```ts
const assetsByUpdateAuthority = await fetchAssetsByUpdateAuthority(
  umi,
  updateAuthority,
  { skipDerivePlugins: false }
)
```

### 권한 헬퍼

권한 헬퍼를 사용하면 `publicKey`를 전달하여 해당 주소가 Core 생태계(자산, 컬렉션 및 플러그인)의 특정 측면에 대한 권한을 가지고 있는지 확인할 수 있습니다.

#### hasPluginAddressAuthority()

`hasPluginAddressAuthority()`는 전달된 플러그인의 권한이 `Address` 타입으로 설정되어 있고 `pubkey`가 일치하는지 여부에 따라 `boolean` 값을 반환합니다.

```ts
export function hasPluginAddressAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority
)
```

#### hasPluginOwnerAuthority()

`hasPluginOwnerAuthority()`는 전달된 플러그인의 권한이 `Owner` 타입으로 설정되어 있고 `pubkey`가 일치하는지 여부에 따라 `boolean` 값을 반환합니다.

```ts
export function hasPluginOwnerAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority,
  asset: AssetV1
)
```

#### hasPluginUpdateAuthority()

`hasPluginUpdateAuthority()`는 전달된 플러그인의 권한이 `UpdateAuthority` 타입으로 설정되어 있고 `pubkey`가 일치하는지 여부에 따라 `boolean` 값을 반환합니다.

```ts
export function hasPluginUpdateAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority,
  asset: AssetV1,
  collection?: CollectionV1
)
```

#### hasAssetUpdateAuthority()

`hasAssetUpdateAuthority()`는 전달된 `pubkey`가 자산에 대한 업데이트 권한을 보유하고 있는지 여부에 따라 `boolean` 값을 반환합니다.

```ts
export function hasAssetUpdateAuthority(
  pubkey: string | PublicKey,
  asset: AssetV1,
  collection?: CollectionV1
)
```

#### hasCollectionUpdateAuthority()

`hasCollectionUpdateAuthority()`는 전달된 `pubkey`가 컬렉션에 대한 업데이트 권한을 보유하고 있는지 여부에 따라 `boolean` 값을 반환합니다.

```ts
export function hasCollectionUpdateAuthority(
  pubkey: string | PublicKey,
  collection: CollectionV1
)
```

### 라이프사이클 헬퍼

**라이프사이클 헬퍼**는 주소가 특정 라이프사이클 이벤트를 수행할 수 있는지 확인하는 빠르고 효율적인 방법을 제공합니다.

#### validateTransfer()

publicKey가 자산을 전송할 수 있는지 여부에 대한 `boolean` 값을 반환합니다.

```ts
export async function validateTransfer(
  umi,
  { authority, asset, collection, recipient }
)
```

#### validateBurn()

publicKey가 자산을 소각할 수 있는지 여부에 대한 `boolean` 값을 반환합니다.

```ts
export async function validateBurn(umi, { authority, asset, collection })
```

#### validateUpdate()

publicKey가 자산을 업데이트할 수 있는지 여부에 대한 `boolean` 값을 반환합니다.

```ts
export async function validateUpdate(
  umi,
  { authority, asset, collection }
)
```

### 플러그인 헬퍼

#### assetPluginKeyFromType()

플러그인 타입을 자산 플러그인용 키로 변환합니다.

```ts
export function assetPluginKeyFromType(pluginType: PluginType)
```

#### pluginTypeFromAssetPluginKey()

플러그인 키를 타입으로 변환합니다.

```ts
export function pluginTypeFromAssetPluginKey(key: AssetPluginKey)
```

#### checkPluginAuthorities()

자산의 주어진 플러그인 타입에 대한 권한을 확인합니다.

```ts
export function checkPluginAuthorities({
  authority,
  pluginTypes,
  asset,
  collection,
})
```

### 상태 헬퍼

#### collectionAddress()

자산이 컬렉션의 일부인 경우 해당 자산의 컬렉션 주소를 찾습니다.
`publicKey | undefined`를 반환합니다.

```ts
export function collectionAddress(asset: AssetV1)
```

#### deriveAssetPlugins()

자산과 컬렉션에서 자산 플러그인을 파생시킵니다. 자산의 플러그인이 컬렉션의 플러그인보다 우선합니다.

```ts
export function deriveAssetPlugins(asset: AssetV1, collection?: CollectionV1)
```

#### isFrozen()

자산이 동결되어 있는지 여부에 대한 `boolean`을 반환합니다.

```ts
export function isFrozen(asset: AssetV1, collection?: CollectionV1)
```