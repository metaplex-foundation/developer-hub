---
title: プラグインの更新
metaTitle: プラグインの更新 | Core
description: updatePlugin関数を使用して、MPL CoreアセットとコレクションのプラグインのUMを更新する方法を学びます。
---

MPL CoreアセットとコレクションのプラグインのUMは、追加後に更新できます。`updatePlugin`関数を使用すると、属性の変更、ロイヤリティの更新、フリーズ状態の変更など、プラグインデータを修正できます。

{% totem %}
{% totem-accordion title="技術的なインストラクションの詳細" %}

**インストラクションアカウント一覧**

| アカウント    | 説明                                            |
| ------------- | ----------------------------------------------- |
| asset         | MPL Coreアセットのアドレス。                    |
| collection    | Coreアセットが属するコレクション。              |
| payer         | ストレージ手数料を支払うアカウント。            |
| authority     | 更新権限を持つオーナーまたはデリゲート。        |
| systemProgram | システムプログラムアカウント。                  |
| logWrapper    | SPL Noopプログラム。                            |

**インストラクション引数**

| 引数   | 説明                                |
| ------ | ----------------------------------- |
| plugin | 更新するプラグインのタイプとデータ。 |

一部のアカウント/引数は、使いやすさのためにSDKで抽象化されるか、オプションになる場合があります。
詳細なTypeDocドキュメントは以下を参照してください：
- [updatePlugin](https://mpl-core.typedoc.metaplex.com/functions/updatePlugin.html)
- [updateCollectionPlugin](https://mpl-core.typedoc.metaplex.com/functions/updateCollectionPlugin.html)

注意：JavaScript SDKでは、updatePluginはdataラッパーなしでプラグインデータを受け取ります（例：`{ type: 'FreezeDelegate', frozen: true }`）。一方、addPluginはdataの下にデータをラップします（例：`{ type: 'FreezeDelegate', data: { frozen: true } }`）。これはcreateAsset/createCollectionのプラグインリストで使用される形式と同じです。

{% /totem-accordion %}
{% /totem %}

## アセットのプラグイン更新

### 基本的なプラグイン更新の例

Attributesプラグインを例として、MPL Coreアセットのプラグインを更新する方法を示します：

{% dialect-switcher title="アセットのプラグイン更新" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

(async () => {
  const assetAddress = publicKey('11111111111111111111111111111111')

  // 現在のアセットを取得して既存のプラグインデータを確認
  const asset = await fetchAsset(umi, assetAddress, {
    skipDerivePlugins: false,
  })

  // 新しいデータでAttributesプラグインを更新
  await updatePlugin(umi, {
    asset: assetAddress,
    plugin: {
      type: 'Attributes',
      attributeList: [
        { key: 'level', value: '5' },        // 更新された値
        { key: 'rarity', value: 'legendary' }, // 新しい属性
        { key: 'power', value: '150' },      // 新しい属性
      ],
    },
  }).sendAndConfirm(umi)
})();
```

{% /dialect %}
{% /dialect-switcher %}

### Royaltiesプラグインの更新

{% dialect-switcher title="Royaltiesプラグインの更新" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, ruleSet } from '@metaplex-foundation/mpl-core'

(async () => {
  const assetAddress = publicKey('11111111111111111111111111111111')
  const creator1 = publicKey('22222222222222222222222222222222')
  const creator2 = publicKey('33333333333333333333333333333333')

  await updatePlugin(umi, {
    asset: assetAddress,
    plugin: {
      type: 'Royalties',
      basisPoints: 750, // 500から750に更新（7.5%）
      creators: [
        { address: creator1, percentage: 70 }, // 更新された分配
        { address: creator2, percentage: 30 },
      ],
      ruleSet: ruleSet('ProgramAllowList', [
        [
          publicKey('44444444444444444444444444444444'),
          publicKey('55555555555555555555555555555555'),
        ],
      ]),
    },
  }).sendAndConfirm(umi)
})();
```

{% /dialect %}
{% /dialect-switcher %}

### 状態ベースのプラグイン更新

Freeze Delegateプラグインのように、トグル可能なシンプルな状態を保存するプラグインもあります：

{% dialect-switcher title="フリーズ状態の更新" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin } from '@metaplex-foundation/mpl-core'

(async () => {
  const assetAddress = publicKey('11111111111111111111111111111111')

  // アセットをフリーズ
  await updatePlugin(umi, {
    asset: assetAddress,
    plugin: {
      type: 'FreezeDelegate',
      frozen: true, // trueでフリーズ、falseで解除
    },
  }).sendAndConfirm(umi)

  // 後でアセットのフリーズを解除
  await updatePlugin(umi, {
    asset: assetAddress,
    plugin: {
      type: 'FreezeDelegate',
      frozen: false, // アセットのフリーズ解除
    },
  }).sendAndConfirm(umi)
})();
```

{% /dialect %}
{% /dialect-switcher %}

## コレクションのプラグイン更新

コレクションプラグインはアセットプラグインと同様に動作しますが、`updateCollectionPlugin`関数を使用します：

{% dialect-switcher title="コレクションのプラグイン更新" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updateCollectionPlugin, ruleSet } from '@metaplex-foundation/mpl-core'

(async () => {
  const collectionAddress = publicKey('11111111111111111111111111111111')
  const creator1 = publicKey('22222222222222222222222222222222')
  const creator2 = publicKey('33333333333333333333333333333333')

  // コレクション全体のロイヤリティを更新
  await updateCollectionPlugin(umi, {
    collection: collectionAddress,
    plugin: {
      type: 'Royalties',
      basisPoints: 600, // コレクションに6%のロイヤリティ
      creators: [
        { address: creator1, percentage: 80 },
        { address: creator2, percentage: 20 },
      ],
      ruleSet: ruleSet('None'),
    },
  }).sendAndConfirm(umi)
})();
```

{% /dialect %}
{% /dialect-switcher %}

## 複雑なプラグインデータの操作

### プラグインのリスト管理

AutographやVerified Creatorsのような一部のプラグインはデータのリストを保持します。これらのプラグインを更新する際は、維持したい完全なリストを渡す必要があります：

{% dialect-switcher title="リストベースのプラグイン更新" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

(async () => {
  const assetAddress = publicKey('11111111111111111111111111111111')

  // まず現在のアセットを取得して既存の署名を確認
  const asset = await fetchAsset(umi, assetAddress, {
    skipDerivePlugins: false,
  })

  // 既存の署名を保持しながら新しい署名を追加
  const newAutograph = {
    address: umi.identity.publicKey,
    message: "素晴らしいNFT！コレクターの署名。"
  }

  // 既存の署名と新しい署名をすべて含める
  const updatedAutographs = [...asset.autograph.signatures, newAutograph]

  await updatePlugin(umi, {
    asset: assetAddress,
    plugin: {
      type: 'Autograph',
      signatures: updatedAutographs, // 新しい追加を含む完全なリスト
    },
    authority: umi.identity,
  }).sendAndConfirm(umi)
})();
```

{% /dialect %}
{% /dialect-switcher %}

### リストからアイテムを削除

{% dialect-switcher title="プラグインリストからアイテムを削除" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

(async () => {
  const assetAddress = publicKey('11111111111111111111111111111111')
  const autographToRemove = publicKey('44444444444444444444444444444444')

  // 現在のアセットデータを取得
  const asset = await fetchAsset(umi, assetAddress, {
    skipDerivePlugins: false,
  })

  // 削除したい署名をフィルタリング
  const filteredAutographs = asset.autograph.signatures.filter(
    (autograph) => autograph.address !== autographToRemove
  )

  await updatePlugin(umi, {
    asset: assetAddress,
    plugin: {
      type: 'Autograph',
      signatures: filteredAutographs, // 削除されたアイテムなしのリスト
    },
    authority: umi.identity,
  }).sendAndConfirm(umi)
})();
```

{% /dialect %}
{% /dialect-switcher %}

## 権限要件

プラグインによって更新に必要な権限が異なります：

- **Authority Managedプラグイン**（Royalties、Attributes、Update Delegate）：アセットまたはコレクションの**authority**が必要
- **Owner Managedプラグイン**（Autograph、Freeze Delegate）：アセットの**owner**またはプラグイン固有のauthorityが必要
- **Verified Creatorsプラグイン**：クリエイターの追加/削除には**update authority**が必要、ただし個々の**クリエイターは自身を検証可能**

## エラー処理

プラグイン更新時の一般的なエラー：

- **Authority不一致**：プラグインタイプに適した正しいauthorityで署名していることを確認
- **プラグインが見つからない**：更新する前にアセット/コレクションにプラグインが存在している必要がある
- **無効なデータ**：プラグインデータは期待される構造と制約に準拠する必要がある
- **コレクション不一致**：アセットがコレクションの一部である場合、更新にコレクションを含める必要がある場合がある

## ベストプラクティス

1. **更新前に取得**：常に現在のアセット/コレクション状態を取得して既存のプラグインデータを確認
2. **既存データの保持**：リストベースのプラグイン更新時、維持したい既存データを含める
3. **適切なauthorityの使用**：各プラグインタイプに適した正しい署名authorityを使用
4. **バッチ更新**：複数のプラグインを更新する場合、効率のために操作のバッチ処理を検討
5. **データ検証**：更新データがプラグインの要件を満たしていることを確認（例：クリエイターのパーセンテージの合計が100%）

## 次のステップ

- 個別のプラグインドキュメントで特定のプラグイン更新について学ぶ
- 利用可能なすべてのプラグインは[プラグイン概要](/ja/smart-contracts/core/plugins)を参照
- [プラグインの追加](/ja/smart-contracts/core/plugins/adding-plugins)と[プラグインの削除](/ja/smart-contracts/core/plugins/removing-plugins)を確認
- 詳細なAPIドキュメントは[MPL Core TypeDoc](https://mpl-core.typedoc.metaplex.com)をご覧ください
