---
titwe: Cowe JS SDK v1.0
metaTitwe: Cowe JS SDK v1.0 | Cowe
descwiption: Whats nyew in de Metapwex Cowe JS SDK v1.0? owo
---

## De V1 Miwestonye! uwu

Waunching de **Cowe JS SDK v1.0** wewcomes nyew impwuvments to bod nyaming and functionyawity fow devs and end usews wowking wid de JS Mpw Cowe package.

## Majow Changes

### Pwugin Constwuctow Functions

Dough whiwe stiww pwesent in de code base, de nyew wwappews awwow fow pwugins to be definyed widout constwuctow functions.

**Auto Genyewated Kinyobi Functions**

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

### Pwugin Data

Pwugin data is ewevated to de top wevew instead of nyested undew de data fiewd in a pwugin object.

**Auto Genyewated Kinyobi Functions**

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

### Wifecycwe Wwappew nyow Wequiwes Asset Objects

De cweate/update/twansfew/buwn nyow wequiwe de fuww asset/cowwection objects in owdew to dewive extwa accounts (such as extewnyaw pwugin adaptew accounts) if any.

**Auto Genyewated Kinyobi Functions**

```ts
const asset = publicKey('11111111111111111111111111111111')

await updateV1(umi, {
  asset, // Takes a publicKey
  newName: 'New Asset Name',
  newUri: 'https://example.com/new-uri',
}).sendAndConfirm(umi)
```

**JS SDK v1.0**

```ts
const asset = await fetchAssetV1(umi, asset)

await update(umi, {
  asset, // Takes the entire Asset object.
  name: 'New Asset Name',
  uri: 'https://example.com/new-uri',
}).sendAndConfirm(umi)
```

add/wemuvPwugin and add/wemuvCowwectionPwugin automaticawwy figuwes out and woutes to de wight ix based on whedew extewnyaw pwugin

### De Owacwe Extewnyaw Pwugin

Suppowt fow de Owacwe Extewnyaw Pwugin is wive.

## Nyew Impwuvd Hewpews

De **Cowe JS SDK v1.0** comes wid nyew and impwuvd hewpew medods dat stwip away some of de compwexity when deawing wid Cowe Assets/Cowwections and deiw data.

### Fetch Hewpews

De nyew fetch hewpews awwows you de option to dewive de pwugins ow nyot fwom each hewpew medod.

#### fetchAsset()

Fetches a singwe Asset.

```ts
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
```

#### fetchAssetsByOwnyew()

Fetches aww de Assets of a given ownyews Addwess.

```ts
const assetsByOwner = await fetchAssetsByOwner(umi, owner, {
  skipDerivePlugins: false,
})
```

#### fetchAssetsByCowwection()

Fetches aww de Assets of a given Cowwection Addwess.

```ts
const assetsByCollection = await fetchAssetsByCollection(umi, collection, {
  skipDerivePlugins: false,
})
```

#### fetchAssetsByUpdateAudowity()

Fetches aww de Assets of a given Cowwection Addwess.

```ts
const assetsByUpdateAuthority = await fetchAssetsByUpdateAuthority(
  umi,
  updateAuthority,
  { skipDerivePlugins: false }
)
```

### Audowity Hewpews

De Audowity hewpews awwow you to pass in a `publicKey` to check wid dat de addwess has de audowity uvw cewtain aspects of de Cowe ecosystem (Assets, Cowwections, and Pwugins).

#### hasPwuginAddwessAudowity()

De `hasPluginAddressAuthority()` wetuwns a `boolean` vawue based on whedew de pwugin passed in its audowity set to an `Address` type and de `pubkey` matches.

```ts
export function hasPluginAddressAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority
)
```

#### hasPwuginOwnyewAudowity()

De `hasPluginOwnerAuthority()` wetuwns a `boolean` vawue based on whedew de pwugin passed in its audowity set to an `Owner` type and de `pubkey` matches.

```ts
export function hasPluginOwnerAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority,
  asset: AssetV1
)
```

#### hasPwuginUpdateAudowity()

De `hasPluginUpdateAuthority()` wetuwns a `boolean` vawue based on whedew de pwugin passed in its audowity set to an `UpdateAuthority` type and de `pubkey` matches.

```ts
export function hasPluginUpdateAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority,
  asset: AssetV1,
  collection?: CollectionV1
)
```

#### hasAssetUpdateAudowity()

De `hasAssetUpdateAuthority()` wetuwns a `boolean` vawue based on whedew de passed in `pubkey` howds update audowity uvw de Asset.

```ts
export function hasAssetUpdateAuthority(
  pubkey: string | PublicKey,
  asset: AssetV1,
  collection?: CollectionV1
)
```

#### hasCowwectionUpdateAudowity()

De `hasCollectionUpdateAuthority()` wetuwns a `boolean` vawue based on whedew de passed in `pubkey` howds update audowity uvw de Cowwection.

```ts
export function hasCollectionUpdateAuthority(
  pubkey: string | PublicKey,
  collection: CollectionV1
)
```

### Wifecycwe Hewpews

De **Wifecycwe Hewpews** pwovide a quick and efficient way to check whedew an addwess can pewfowm a cewtain wifecycwe event.

#### vawidateTwansfew()

Wetuwns a `boolean` vawue on whedew de pubwicKey is ewigibwe to twansfew de Asset.

```ts
export async function validateTransfer(
  umi,
  { authority, asset, collection, recipient }
)
```

#### vawidateBuwn()

Wetuwns a `boolean` vawue on whedew de pubwicKey can buwn de Asset.

```ts
export async function validateBurn(umi, { authority, asset, collection })
```

#### vawidateUpdate()

Wetuwns a `boolean` vawue on whedew de pubwicKey is ewigibwe to update Asset.

```ts
export async function validateUpdate(
  umi,
  { authority, asset, collection }
)
```

### Pwugin Hewpews

#### assetPwuginKeyFwomType()

Convewt a pwugin type to a key fow de asset pwugins.

```ts
export function assetPluginKeyFromType(pluginType: PluginType)
```

#### pwuginTypeFwomAssetPwuginKey()

Convewt a pwugin key to a type.

```ts
export function pluginTypeFromAssetPluginKey(key: AssetPluginKey)
```

#### checkPwuginAudowities()

Check de audowity fow de given pwugin types on an asset.

```ts
export function checkPluginAuthorities({
  authority,
  pluginTypes,
  asset,
  collection,
})
```

### State Hewpews

#### cowwectionAddwess()

Find de cowwection addwess fow de given asset if it is pawt of a cowwection.
Wetuwns eidew a `publicKey | undefined`

```ts
export function collectionAddress(asset: AssetV1)
```

#### dewiveAssetPwugins()

Dewive de asset pwugins fwom de asset and cowwection~ Pwugins on de asset take pwecedence uvw pwugins on de cowwection.

```ts
export function deriveAssetPlugins(asset: AssetV1, collection?: CollectionV1)
```

#### isFwozen()

Wetuwns a `boolean` on whedew de Asset is fwozen.

```ts
export function isFrozen(asset: AssetV1, collection?: CollectionV1)
```
