---
title: Autographプラグイン
metaTitle: Autographプラグイン | Core
description: Core NFTアセットやコレクションに、署名とメッセージを追加する方法を学びます。
---

`autograph`プラグインは「オーナー管理型（Owner Managed）」プラグインで、アセットやコレクションに署名とメッセージを追加できます。

ミント時は`update authority`がプラグインを追加できます。その後はオーナーのみが追加可能です。追加されたオートグラフ（署名）は、オーナーまたはオートグラフのデリゲートが削除できます。署名者自身は、オーナーまたはオートグラフデリゲートでもない限り、自分の署名を削除できません。

オートグラフを追加するには、以下の条件が必要です。

- 事前にautographプラグインが追加されていること。
- 署名者は自分自身のアドレスのみを追加できること。
- 既存の署名リストに新規署名を加えた配列を、`updatePlugin`関数で渡すこと。
- 同じ署名者による既存のオートグラフがまだ存在しないこと。

{% callout type="note" %}
オーナーがautographプラグインを追加すると、誰でも自分の署名を追加できるようになります。オーナーはいつでもそれらの署名を削除可能です。
{% /callout %}

## 対応状況

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

アセットはコレクションからAutographを継承します。

## 引数

`autograph`プラグインは`signatures`配列に以下の引数を取ります。

| Arg     | Value     |
| ------- | --------- |
| address | publicKey |
| message | string    |

## アセットへautographプラグインを追加（コード例）

{% dialect-switcher title="オーナーとしてMPL Coreアセットへautographプラグインを追加" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { addPlugin } from '@metaplex-foundation/mpl-core'

await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    signatures: [
      {
        address: umi.identity.publicKey,
        message: 'Your Message',
      },
    ],
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## アセットにオートグラフを1件追加（コード例）

{% dialect-switcher title="MPL CoreアセットへAutographを追加" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, assetAddress.publicKey, { skipDerivePlugins: false })

// 追加したい新しいオートグラフ
const newAutograph = {
  address: umi.identity.publicKey,
  message: 'your message',
}

// 既存の配列に新規を追加
const updatedAutographs = [...asset.autograph.signatures, newAutograph]

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    // 残したい全オートグラフを含める
    signatures: updatedAutographs,
  },
  authority: umi.identity,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## アセットからオートグラフを削除（コード例）

{% dialect-switcher title="MPL CoreアセットからAutographを削除" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, assetAddress.publicKey, { skipDerivePlugins: false })

// 削除したいオートグラフのPublicKey
const publicKeyToRemove = publicKey('abc...')

const autographsToKeep = asset.autograph.signatures.filter(
  (autograph) => autograph.address !== publicKeyToRemove
)

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    // 残したい全オートグラフを含める
    signatures: autographsToKeep,
  },
  authority: umi.identity, // アセットのオーナー
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## コレクションへautographプラグインを追加（コード例）

{% dialect-switcher title="コレクションへautographプラグインを追加" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { addCollectionPlugin } from '@metaplex-foundation/mpl-core'

await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'Autograph',
    signatures: [
      {
        address: umi.identity.publicKey,
        message: 'Your Message',
      },
    ],
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

