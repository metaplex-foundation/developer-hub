---
title: Verified Creatorプラグイン
metaTitle: Verified Creatorプラグイン | Core
description: アセット/コレクションに関与したクリエイターのリスト（検証状態付き）を保存するプラグイン。
---

`Verified Creator`プラグインは「権限管理型（Authority Managed）」プラグインで、アセットやコレクションへ検証済みクリエイターを追加できます。Metaplex Token MetadataのVerified Creator配列に似ていますが、MPL Coreではロイヤリティ分配には使用しません。

このプラグインは、クリエイターが制作に関与した事実を公開的に証明する用途に使えます。たとえば、デザイナー、デベロッパー、ファウンダーがクリエイターとして署名する等です。

`update authority`が可能な操作:
- プラグインを追加
- 未検証クリエイター（verified: false）の追加
- 未検証クリエイターの削除（検証済みを削除するには、当人が先に未検証へ戻す必要あり）
- 自分自身の検証

クリエイターを検証するには、`update authority`により配列へ追加された公開鍵本人が`updatePlugin`命令へ署名する必要があります。

## 対応状況

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## 引数

`verifiedCreator`プラグインは`VerifiedCreatorsSignature`配列で以下の引数を取ります。

| Arg     | Value     |
| ------- | --------- |
| address | publicKey |
| verified | boolean  |

アセットはコレクションのCreators配列を継承します。

## アセットへVerified Creatorsプラグインを追加（コード例）

{% dialect-switcher title="MPL CoreアセットへVerified Creatorsプラグインを追加" %}
{% dialect title="JavaScript" id="js" %}

以下は、`umi.identity`がアセットのupdate authorityである前提です。

```ts
import { addPlugin } from '@metaplex-foundation/mpl-core'

await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: [
      {
        address: umi.identity.publicKey,
        verified: true,
      },
    ],
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 別のクリエイターをアセットへ追加（コード例）

{% dialect-switcher title="未検証クリエイターをMPL Coreアセットへ追加" %}
{% dialect title="JavaScript" id="js" %}

以下は、`umi.identity`がアセットのupdate authorityであり、未検証のクリエイターを追加する例です。

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, assetAddress.publicKey, { skipDerivePlugins: false })

const publicKeyToAdd = publicKey('abc...')

// 追加したいクリエイター
const newCreator = {
  address: publicKeyToAdd,
  verified: false,
}

// 既存の配列に追加
const updatedCreators = [...asset.verifiedCreators.signatures, newCreator]

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: updatedCreators,
  },
  authority: umi.identity,
}).sendAndConfirm(umi)
```

未検証クリエイターの追加後、当人は`updatePlugin`を自署名して自分を検証（verified: true）できます。以下は`umi.identity`がそのクリエイターである前提です。

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, assetAddress.publicKey, { skipDerivePlugins: false })

const publicKeyToVerify = publicKey('abc...')

// 検証フラグをtrueへ
const updatedCreators = asset.verifiedCreators.signatures.map((creator) => {
  if (creator.address === publicKeyToVerify) {
    return { ...creator, verified: true }
  }
  return creator
})

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: updatedCreators,
  },
  authority: umi.identity,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## アセットからクリエイターを削除（コード例）

{% dialect-switcher title="MPL Coreアセットからクリエイターを削除" %}
{% dialect title="JavaScript" id="js" %}

クリエイターの削除はupdate authorityのみ可能です。削除対象が`verified: false`であるか、もしくはupdate authority自身である必要があります。したがって、通常は2段階で実施します。もしupdate authorityとクリエイターの両方で同時署名できるなら、1トランザクションにまとめることも可能です。

1. `verified: false`へ変更（このスニペットでは`umi.identity`が削除対象のクリエイター）

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, assetAddress.publicKey, { skipDerivePlugins: false })

const publicKeyToRemove = publicKey('abc...')

const modifiedCreators = asset.verifiedCreators.signatures.map((sig) =>
  sig.address === publicKeyToRemove ? { ...sig, verified: false } : sig
)

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: modifiedCreators,
  },
  authority: umi.identity, // クリエイター本人
}).sendAndConfirm(umi)
```

2. クリエイターを削除（このスニペットでは`umi.identity`がupdate authority）

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, assetAddress.publicKey, { skipDerivePlugins: false })

const publicKeyToRemove = publicKey('abc...')

const creatorsToKeep = asset.verifiedCreators.signatures.filter(
  (creator) => creator.address !== publicKeyToRemove
)

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: creatorsToKeep,
  },
  authority: umi.identity, // update authority
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## コレクションへVerified Creatorsプラグインを追加（コード例）

{% dialect-switcher title="コレクションへVerified Creatorsプラグインを追加" %}
{% dialect title="JavaScript" id="js" %}

この例では、`umi.identity`がupdate authorityです。

```ts
import { addCollectionPlugin } from '@metaplex-foundation/mpl-core'

await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: [
      {
        address: umi.identity.publicKey,
        verified: true,
      },
    ],
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

