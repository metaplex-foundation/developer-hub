---
title: Core JS SDK v1.0
metaTitle: Core JS SDK v1.0 | Core
description: Metaplex Core JS SDK v1.0の新機能は？
---

## V1マイルストーン！

**Core JS SDK v1.0**のリリースにより、JSのmpl-coreパッケージを使う開発者やユーザー向けに、命名と機能の両面で改善が導入されました。

## 主な変更点

### プラグインのコンストラクター関数

コードベースには引き続き存在しますが、新しいラッパーによりコンストラクター関数なしでプラグインを定義できるようになりました。

**Kinobi自動生成関数**

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

### プラグインデータ

プラグインオブジェクトの`data`配下にネストするのではなく、トップレベルに昇格しました。

**Kinobi自動生成関数**

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

### ライフサイクルラッパーはアセットオブジェクト必須に

create/update/transfer/burnは、（外部プラグインアダプターのような）必要に応じて追加アカウントを導出するため、アセット/コレクションの「オブジェクト」自体を受け取るようになりました。

**Kinobi自動生成関数**

```ts
const asset = publicKey('11111111111111111111111111111111')

await updateV1(umi, {
  asset, // publicKeyを渡す
  newName: 'New Asset Name',
  newUri: 'https://example.com/new-uri',
}).sendAndConfirm(umi)
```

**JS SDK v1.0**

```ts
const asset = await fetchAssetV1(umi, asset)

await update(umi, {
  asset, // アセットオブジェクト全体を渡す
  name: 'New Asset Name',
  uri: 'https://example.com/new-uri',
}).sendAndConfirm(umi)
```

`add/removePlugin`と`add/removeCollectionPlugin`は、外部プラグインかどうかに応じて適切なixに自動でルーティングします。

### Oracle外部プラグイン

Oracle外部プラグインへの対応が追加されました。

## 新しいヘルパー

**Core JS SDK v1.0**には、Coreアセット/コレクションとそのデータを扱う際の複雑さを軽減する新しいヘルパーが含まれます。

### Fetchヘルパー

各fetchヘルパーで、プラグインの導出をスキップするかを選べます。

#### fetchAsset()

単一のアセットを取得します。

```ts
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
```

#### fetchAssetsByOwner()

指定オーナーアドレスの全アセットを取得します。

```ts
const assetsByOwner = await fetchAssetsByOwner(umi, owner, {
  skipDerivePlugins: false,
})
```

#### fetchAssetsByCollection()

指定コレクションアドレスの全アセットを取得します。

```ts
const assetsByCollection = await fetchAssetsByCollection(umi, collection, {
  skipDerivePlugins: false,
})
```

#### fetchAssetsByUpdateAuthority()

指定アップデートオーソリティの全アセットを取得します。

```ts
const assetsByUpdateAuthority = await fetchAssetsByUpdateAuthority(
  umi,
  updateAuthority,
  { skipDerivePlugins: false }
)
```

### Authorityヘルパー

与えた`publicKey`がCore（アセット/コレクション/プラグイン）の特定権限を持つかをチェックできます。

#### hasPluginAddressAuthority()

プラグインの権限が`Address`タイプで、`pubkey`が一致する場合に`true`を返します。

```ts
export function hasPluginAddressAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority
)
```

#### hasPluginOwnerAuthority()

プラグインの権限が`Owner`タイプで、`pubkey`が一致する場合に`true`を返します。

```ts
export function hasPluginOwnerAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority,
  asset: AssetV1
)
```

#### hasPluginUpdateAuthority()

プラグインの権限が`UpdateAuthority`タイプで、`pubkey`が一致する場合に`true`を返します。

```ts
export function hasPluginUpdateAuthority(
  pubkey: PublicKey | string,
  authority: BasePluginAuthority,
  asset: AssetV1,
  collection?: CollectionV1
)
```

#### hasAssetUpdateAuthority()

渡した`pubkey`がアセットのアップデート権限を持つかを`boolean`で返します。

```ts
export function hasAssetUpdateAuthority(
  pubkey: string | PublicKey,
  asset: AssetV1,
  collection?: CollectionV1
)
```

#### hasCollectionUpdateAuthority()

渡した`pubkey`がコレクションのアップデート権限を持つかを`boolean`で返します。

```ts
export function hasCollectionUpdateAuthority(
  pubkey: string | PublicKey,
  collection: CollectionV1
)
```

### ライフサイクルヘルパー

特定アドレスがライフサイクルイベントを実行できるかを手早く確認できます。

#### validateTransfer()

そのpublicKeyがアセットを移転可能かを返します。

```ts
export async function validateTransfer(
  umi,
  { authority, asset, collection, recipient }
)
```

#### validateBurn()

そのpublicKeyがアセットをBurn可能かを返します。

```ts
export async function validateBurn(umi, { authority, asset, collection })
```

#### validateUpdate()

そのpublicKeyがアセットを更新可能かを返します。

```ts
export async function validateUpdate(
  umi,
  { authority, asset, collection }
)
```

### プラグインヘルパー

#### assetPluginKeyFromType()

プラグインタイプをアセットプラグインキーへ変換します。

```ts
export function assetPluginKeyFromType(pluginType: PluginType)
```

#### pluginTypeFromAssetPluginKey()

プラグインキーをタイプへ変換します。

```ts
export function pluginTypeFromAssetPluginKey(key: AssetPluginKey)
```

#### checkPluginAuthorities()

アセット上の指定プラグインタイプに対する権限をチェックします。

```ts
export function checkPluginAuthorities({
  authority,
  pluginTypes,
  asset,
  collection,
})
```

### ステートヘルパー

#### collectionAddress()

アセットがコレクションの一部であれば、そのコレクションアドレスを返します。`publicKey | undefined`

```ts
export function collectionAddress(asset: AssetV1)
```

#### deriveAssetPlugins()

アセットとコレクションからアセットのプラグインを導出します。アセット側のプラグインがコレクション側より優先されます。

```ts
export function deriveAssetPlugins(asset: AssetV1, collection?: CollectionV1)
```

#### isFrozen()

アセットが凍結状態かを返します。

```ts
export function isFrozen(asset: AssetV1, collection?: CollectionV1)
```

