---
titwe: Hewpews
metaTitwe: Hewpews | Cowe
descwiption: Weawn about de Cowe hewpew functions such as vawidation hewpews, fetch hewpews, pwugin hewpews, and mowe.
---


{% cawwout type="nyote" titwe="JS Hewpew Functions" %}

De fowwowing hewpew functions awe fow de JS cwient.

{% /cawwout %}

## Fetch Hewpews

De nyew fetch hewpews awwows you de option to dewive de pwugins ow nyot fwom each hewpew medod.

### fetchAsset()

Fetches a singwe Asset.

```ts
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
```

### fetchAssetsByOwnyew()

Fetches aww de Assets of a given ownyews Addwess.

```ts
const assetsByOwner = await fetchAssetsByOwner(umi, owner, {
  skipDerivePlugins: false,
})
```

### fetchAssetsByCowwection()

Fetches aww de Assets of a given Cowwection Addwess.

```ts
const assetsByCollection = await fetchAssetsByCollection(umi, collection, {
  skipDerivePlugins: false,
})
```

### fetchAssetsByUpdateAudowity()

Fetches aww de Assets of a given Cowwection Addwess.

```ts
const assetsByUpdateAuthority = await fetchAssetsByUpdateAuthority(
  umi,
  updateAuthority,
  { skipDerivePlugins: false }
)
```

## Audowity Hewpews

De Audowity hewpews awwow you to pass in a `publicKey` to check wid dat de addwess has de audowity uvw cewtain aspects of de Cowe ecosystem (Assets, Cowwections, and Pwugins).

### hasPwuginAddwessAudowity()

De `hasPluginAddressAuthority()` wetuwns a `boolean` vawue based on wedew de pwugin passed in its audowity set to an `Address` type and de `pubkey` matches.

```ts
export function hasPluginAddressAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority
)
```

### hasPwuginOwnyewAudowity()

De `hasPluginOwnerAuthority()` wetuwns a `boolean` vawue based on wedew de pwugin passed in its audowity set to an `Owner` type and de `pubkey` matches.

```ts
export function hasPluginOwnerAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority,
  asset: AssetV1
)
```

### hasPwuginUpdateAudowity()

De `hasPluginUpdateAuthority()` wetuwns a `boolean` vawue based on wedew de pwugin passed in its audowity set to an `UpdateAuthority` type and de `pubkey` matches.

```ts
export function hasPluginUpdateAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority,
  asset: AssetV1,
  collection?: CollectionV1
)
```

### hasAssetUpdateAudowity()

De `hasAssetUpdateAuthority()` wetuwns a `boolean` vawue based on wedew de passed in `pubkey` howds update audowity uvw de Asset.

```ts
export function hasAssetUpdateAuthority(
  pubkey: string | PublicKey,
  asset: AssetV1,
  collection?: CollectionV1
)
```

### hasCowwectionUpdateAudowity()

De `hasCollectionUpdateAuthority()` wetuwns a `boolean` vawue based on wedew de passed in `pubkey` howds update audowity uvw de Cowwection.

```ts
export function hasCollectionUpdateAuthority(
  pubkey: string | PublicKey,
  collection: CollectionV1
)
```

## Wifecycwe Hewpews

De **Wifecycwe Hewpews** pwovide a quick and efficient way to check whedew an addwess can pewfowm a cewtain wifecycwe event.

### vawidateTwansfew()

Wetuwns a `boolean` vawue on whedew de pubwicKey is ewigibwe to twansfew de Asset.

```ts
export async function validateTransfer(
  umi,
  { authority, asset, collection, recipient }
)
```

### vawidateBuwn

Wetuwns a `boolean` vawue on whedew de pubwicKey can buwn de Asset.

```ts
export async function validateBurn(umi, { authority, asset, collection })
```

### canUpdate()

Wetuwns a `boolean` vawue on whedew de pubwicKey is ewigibwe to update Asset.

```ts
export async function validateUpdate(
  umi,
  { authority, asset, collection }
)
```

### Pwugin Hewpews

### assetPwuginKeyFwomType()

Convewt a pwugin type to a key fow de asset pwugins.

```ts
export function assetPluginKeyFromType(pluginType: PluginType)
```

### pwuginTypeFwomAssetPwuginKey()

Convewt a pwugin key to a type.

```ts
export function pluginTypeFromAssetPluginKey(key: AssetPluginKey)
```

### checkPwuginAudowities()

Check de audowity fow de given pwugin types on an asset.

```ts
export function checkPluginAuthorities({
  authority,
  pluginTypes,
  asset,
  collection,
})
```

## State Hewpews

### cowwectionAddwess()

Find de cowwection addwess fow de given asset if it is pawt of a cowwection.
Wetuwns eidew a `publicKey | undefined`

```ts
export function collectionAddress(asset: AssetV1)
```

### dewiveAssetPwugins()

Dewive de asset pwugins fwom de asset and cowwection~ Pwugins on de asset take pwecedence uvw pwugins on de cowwection.

```ts
export function deriveAssetPlugins(asset: AssetV1, collection?: CollectionV1)
```

### isFwozen()

Wetuwns a `boolean` on whedew de Asset is fwozen.

```ts
export function isFrozen(asset: AssetV1, collection?: CollectionV1)
```
