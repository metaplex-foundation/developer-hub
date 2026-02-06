---
title: プラグインの更新
metaTitle: プラグインの更新 | Core
description: updatePlugin関数を使用してMPL Core AssetsとCollectionsの既存のプラグインを更新する方法を学びます。
updated: '01-31-2026'
keywords:
  - update plugin
  - modify plugin
  - plugin data
  - updatePlugin
about:
  - Plugin modification
  - Data updates
  - Plugin management
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
---
MPL Core AssetsとCollectionsの多くのプラグインは、追加後に更新できます。`updatePlugin`関数を使用して、属性の変更、ロイヤリティの更新、フリーズ状態の変更などのプラグインデータを変更できます。
{% totem %}
{% totem-accordion title="技術的な命令の詳細" %}
**命令アカウントリスト**

| アカウント       | 説明                                     |
| ------------- | ----------------------------------------------- |
| asset         | MPL Core Assetのアドレス。              |
| collection    | Core Assetが属するコレクション。 |
| payer         | ストレージ料金を支払うアカウント。        |
| authority     | 更新権限を持つオーナーまたはデリゲート。  |
| systemProgram | System Programアカウント。                     |
| logWrapper    | SPL Noop Program。                           |
**命令引数**
| 引数   | 説明                            |
| ------ | -------------------------------------- |
| plugin | 更新するプラグインタイプとデータ。 |
一部のアカウント/引数は、使いやすさのためにSDKで抽象化されるか、オプションになる場合があります。
詳細なTypeDocドキュメントについては、以下を参照してください：

- [updatePlugin](https://mpl-core.typedoc.metaplex.com/functions/updatePlugin.html)
- [updateCollectionPlugin](https://mpl-core.typedoc.metaplex.com/functions/updateCollectionPlugin.html)
注意：JavaScript SDKでは、updatePluginはdataラッパーなしでプラグインデータを期待します（例：`{ type: 'FreezeDelegate', frozen: true }`）。対照的に、addPluginはデータを`data`の下にラップします（例：`{ type: 'FreezeDelegate', data: { frozen: true } }`）。これはcreateAsset/createCollectionプラグインリストで使用される形状を反映しています。
{% /totem-accordion %}
{% /totem %}

## Assetsのプラグインの更新

### 基本的なプラグイン更新例

AttributesプラグインをMPL Core Assetでのプラグイン更新の例として、プラグインを更新する方法を示します：
{% dialect-switcher title="Assetのプラグイン更新" %}
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
  // Attributesプラグインを新しいデータで更新
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

### 状態ベースのプラグインの更新

Freeze Delegateプラグインのように、トグルできる単純な状態を保存するプラグインもあります：
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
      frozen: true, // フリーズするにはtrue、解凍するにはfalseに設定
    },
  }).sendAndConfirm(umi)
  // 後で、アセットを解凍
  await updatePlugin(umi, {
    asset: assetAddress,
    plugin: {
      type: 'FreezeDelegate',
      frozen: false, // アセットを解凍
    },
  }).sendAndConfirm(umi)
})();
```

{% /dialect %}
{% /dialect-switcher %}

## Collectionsのプラグインの更新

Collectionプラグインはアセットプラグインと同様に動作しますが、`updateCollectionPlugin`関数を使用します：
{% dialect-switcher title="Collectionのプラグイン更新" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updateCollectionPlugin, ruleSet } from '@metaplex-foundation/mpl-core'
(async () => {
  const collectionAddress = publicKey('11111111111111111111111111111111')
  const creator1 = publicKey('22222222222222222222222222222222')
  const creator2 = publicKey('33333333333333333333333333333333')
  // Collection全体のロイヤリティを更新
  await updateCollectionPlugin(umi, {
    collection: collectionAddress,
    plugin: {
      type: 'Royalties',
      basisPoints: 600, // コレクションの6%ロイヤリティ
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

### プラグイン内のリストの管理

AutographorVerified Creatorsのようなプラグインは、データのリストを維持します。これらのプラグインを更新する場合、維持したい完全なリストを渡す必要があります：
{% dialect-switcher title="リストベースのプラグインの更新" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'
(async () => {
  const assetAddress = publicKey('11111111111111111111111111111111')
  // まず現在のアセットを取得して既存のサインを確認
  const asset = await fetchAsset(umi, assetAddress, {
    skipDerivePlugins: false,
  })
  // 既存のものを保持しながら新しいサインを追加
  const newAutograph = {
    address: umi.identity.publicKey,
    message: "素晴らしいNFT！コレクターが署名。"
  }
  // 既存のサインすべてと新しいものを含める
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
  // 削除したいサインをフィルタリング
  const filteredAutographs = asset.autograph.signatures.filter(
    (autograph) => autograph.address !== autographToRemove
  )
  await updatePlugin(umi, {
    asset: assetAddress,
    plugin: {
      type: 'Autograph',
      signatures: filteredAutographs, // 削除されたアイテムを含まないリスト
    },
    authority: umi.identity,
  }).sendAndConfirm(umi)
})();
```

{% /dialect %}
{% /dialect-switcher %}

## Authority要件

プラグインによって更新に必要なauthorityが異なります：

- **Authority Managedプラグイン**（Royalties、Attributes、Update Delegate）: アセットまたはコレクションの**authority**が必要
- **Owner Managedプラグイン**（Autograph、Freeze Delegate）: アセットの**オーナー**またはプラグインの特定のauthorityが必要
- **Verified Creatorsプラグイン**: クリエイターの追加/削除には**update authority**が必要だが、個々の**クリエイターは自分自身を検証可能**

## エラー処理

プラグイン更新時の一般的なエラー：

- **Authority mismatch**: プラグインタイプに対して正しいauthorityで署名していることを確認
- **Plugin not found**: プラグインは更新前にアセット/コレクションに存在している必要がある
- **Invalid data**: プラグインデータは期待される構造と制約に準拠する必要がある
- **Collection mismatch**: アセットがコレクションの一部である場合、更新にコレクションを含める必要がある場合がある

## ベストプラクティス

1. **更新前に取得**: 常に現在のアセット/コレクション状態を取得して既存のプラグインデータを確認
2. **既存データを保持**: リストベースのプラグインを更新する場合、保持したい既存データを含める
3. **適切なauthorityを使用**: 各プラグインタイプに対して正しい署名authorityを使用していることを確認
4. **更新をバッチ処理**: 複数のプラグインを更新する場合、効率のために操作をバッチ処理することを検討
5. **データを検証**: 更新データがプラグインの要件を満たしていることを確認（例：クリエイターのパーセンテージが100%になる）

## 次のステップ

- 個別のプラグインドキュメントで特定のプラグイン更新について学ぶ
- [プラグイン概要](/smart-contracts/core/plugins)ですべての利用可能なプラグインを探索
- [プラグインの追加](/smart-contracts/core/plugins/adding-plugins)と[プラグインの削除](/smart-contracts/core/plugins/removing-plugins)をチェック
- 詳細なAPIドキュメントについては[MPL Core TypeDoc](https://mpl-core.typedoc.metaplex.com)を参照
