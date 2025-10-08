---
title: ImmutableMetadataプラグイン
metaTitle: ImmutableMetadata | Core
description: ImmutableMetadataプラグインは、Core NFTアセットおよびコレクションのメタデータを不変化します。
---

immutableMetadataプラグインは「権限管理型（Authority Managed）」プラグインで、メタデータ（NameとURI）を不変化（変更不可）にします。追加できるのはアップデート権限のみです。

このプラグインは`MPL Core Asset`と`MPL Core Collection`の両方で使用できます。

[Royalties](/core/plugins/royalties)など他プラグイン同様、コレクションに割り当てるとアセットにも影響します。したがって、コレクションへ追加すると、アセットのメタデータも不変になります。

## 対応状況

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## 引数

immutableMetadataプラグインに引数は不要です。

## アセットへimmutableMetadataを追加（コード例）

{% dialect-switcher title="MPL CoreアセットへImmutabilityプラグインを追加" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { addPlugin } from '@metaplex-foundation/mpl-core'

await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'ImmutableMetadata',
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## コレクションへimmutableMetadataを追加（コード例）

{% dialect-switcher title="コレクションへimmutableMetadataプラグインを追加" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { addCollectionPlugin } from '@metaplex-foundation/mpl-core'

await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'ImmutableMetadata',
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

