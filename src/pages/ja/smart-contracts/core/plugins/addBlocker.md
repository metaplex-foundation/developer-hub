---
title: addBlockerプラグイン
metaTitle: addBlockerプラグイン | Core Plugins
description: Metaplex Coreを使って、Core NFTアセットおよびコレクションへの追加プラグインの追加をブロックする方法を学びます。
---

`addBlocker`プラグインは「権限管理型（Authority Managed）」プラグインで、追加の権限管理型プラグインを新たに追加することを禁止します。つまり、将来必要になりうるプラグインは、`addBlocker`を有効にする前にすべて追加しておく必要があります。新機能として登場したプラグインも後からは追加できません。追加できるのはアップデート権限のみです。

ただし、例外として、アセットのユーザー管理型プラグイン（例: Transfer DelegateやFreeze Delegate）は、`addBlocker`追加後も追加可能です。

このプラグインは`MPL Core Asset`と`MPL Core Collection`の両方で使用できます。

[Royalties](/core/plugins/royalties)など他プラグイン同様、コレクションに割り当てるとアセットにも影響します。したがって、コレクションに追加した場合は、そのコレクション内のアセットへも新規プラグインを追加できなくなります。

## 対応状況

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## 引数

`addBlocker`プラグインに引数は不要です。

## アセットへaddBlockerプラグインを追加（コード例）

{% dialect-switcher title="MPL CoreアセットへaddBlockerプラグインを追加" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { addPlugin } from '@metaplex-foundation/mpl-core'

await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'addBlocker',
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## コレクションへaddBlockerプラグインを追加（コード例）

{% dialect-switcher title="コレクションへaddBlockerプラグインを追加" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { addCollectionPlugin } from '@metaplex-foundation/mpl-core'

await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'addBlocker',
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

