---
title: AddBlockerプラグイン
metaTitle: AddBlockerプラグイン | Metaplex Core
description: Core AssetsとCollectionsに新しいauthority管理プラグインが追加されるのを防ぎます。プラグイン構成を永続的にロックダウンします。
updated: '01-31-2026'
keywords:
  - add blocker
  - lock plugins
  - prevent plugins
  - plugin restriction
about:
  - Plugin restriction
  - Configuration locking
  - Authority management
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: AddBlocker後もFreeze Delegateを追加できますか？
    a: はい。Freeze Delegate、Transfer Delegate、Burn Delegateなどのオーナー管理プラグインは、AddBlockerがアクティブでも常に追加できます。
  - q: AddBlockerを追加した後に削除できますか？
    a: はい、不変にされていなければ可能です。プラグインはauthorityによって削除できます。ただし、これはAddBlockerを使用する目的を無効にします。
  - q: CollectionにAddBlockerを追加した場合、個々のAssetにプラグインを追加できますか？
    a: いいえ。コレクションレベルのAddBlockerは、コレクションとそのすべてのAssetの両方にauthority管理プラグインを追加することを防ぎます。
  - q: Metaplexが使用したい新しいプラグインをリリースした場合はどうなりますか？
    a: AddBlockerがアクティブな場合、将来リリースされる新しいものを含め、新しいauthority管理プラグインを追加することはできません。計画的に対応してください。
  - q: なぜAddBlockerを使用するのですか？
    a: NFTのauthority管理プラグイン構成が最終的であることを保証するためです。これは、ロイヤリティ、属性、その他の重要な設定が変更できないことをコレクターに保証します。
---
**AddBlockerプラグイン**は、AssetまたはCollectionに新しいauthority管理プラグインが追加されるのを防ぎます。オーナー管理プラグインを許可しながら、NFT構成をロックダウンします。 {% .lead %}
{% callout title="学べること" %}

- 新しいauthority管理プラグインをブロック
- どのプラグインがまだ許可されているかを理解
- AssetsとCollectionsに適用
- ロックする前にプラグイン構成を計画
{% /callout %}

## 概要

**AddBlocker**プラグインは、新しいauthority管理プラグインの追加を防ぐAuthority Managedプラグインです。オーナー管理プラグイン（Freeze Delegate、Transfer Delegateなど）は引き続き追加できます。

- Authority Managed（update authorityのみが追加可能）
- 新しいauthority管理プラグインを永続的にブロック
- オーナー管理プラグインはブロックされない
- Collectionプラグインはそのコレクション内のすべてのAssetに影響

## 対象外

オーナー管理プラグインのブロック（常に許可）、既存のプラグインの削除、既存のプラグインへの更新のブロック。

## クイックスタート

**ジャンプ先:** [Assetに追加](#assetへのaddblockerプラグインの追加コード例) · [Collectionに追加](#collectionへのaddblockerプラグインの追加コード例)

1. 必要なすべてのauthority管理プラグインを追加
2. update authorityとしてAddBlockerプラグインを追加
3. 新しいauthority管理プラグインは追加できなくなる
{% callout type="note" title="AddBlockerを使用するタイミング" %}
| シナリオ | AddBlockerを使用？ |
|----------|-----------------|
| ロイヤリティが変更できないことを保証 | ✅ はい（先にRoyaltiesを追加、次にAddBlocker） |
| 将来のプラグイン追加を防止 | ✅ はい |
| 属性を永続的にロック | ❌ いいえ（Attributesでauthority `None`を使用） |
| マーケットプレイスリスティングを許可 | ✅ 動作する（オーナー管理は許可） |
| 将来新しいプラグインが必要 | ❌ AddBlockerを使用しない |
**AddBlockerを使用**して、NFTの構成が最終的であることをコレクターに信頼させます。
{% /callout %}

## 一般的なユースケース

- **ロイヤリティ保護**: 新しいRoyaltiesプラグインをブロックしてロイヤリティが変更されないことを保証
- **構成の最終性**: コレクターにNFTのプラグインが変更されないことを保証
- **信頼構築**: 重要な設定がロックされていることを購入者に証明
- **コレクション標準**: コレクション全体で一貫したプラグイン構成を強制

## 対応

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## 引数

`AddBlocker`プラグインには引数は必要ありません。

## Assetへのaddplockerプラグインの追加コード例

{% dialect-switcher title="MPL Core AssetへのaddBlockerプラグインの追加" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  addPlugin,
} from '@metaplex-foundation/mpl-core'
await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'addBlocker',
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## CollectionへのaddBlockerプラグインの追加コード例

{% dialect-switcher title="CollectionにaddBlockerプラグインを追加" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  addCollectionPlugin,
} from '@metaplex-foundation/mpl-core'
await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'AddBlocker',
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 一般的なエラー

### `Authority mismatch`

update authorityのみがAddBlockerプラグインを追加できます。

### `Cannot add plugin - AddBlocker active`

AddBlockerプラグインが新しいauthority管理プラグインを防いでいます。これは期待される動作です。

## 注意事項

- AddBlockerを追加する前にプラグイン構成を慎重に計画
- ブロックされると将来のMetaplexプラグイン機能は追加できない
- オーナー管理プラグイン（Freeze、Transfer、Burn Delegates）は常に許可
- Collectionに追加するとすべてのAssetのプラグインもブロック

## クイックリファレンス

### ブロックされるもの

| プラグインタイプ | ブロック |
|-------------|---------|
| Authority Managed | ✅ ブロック |
| Owner Managed | ❌ 引き続き許可 |
| Permanent | ✅ ブロック（作成時に追加が必要） |

### 一般的なAuthority Managedプラグイン（ブロック）

- Royalties
- Attributes
- Verified Creators
- ImmutableMetadata
- AddBlocker（自身）

### Owner Managedプラグイン（引き続き許可）

- Freeze Delegate
- Transfer Delegate
- Burn Delegate

## FAQ

### AddBlocker後もFreeze Delegateを追加できますか？

はい。Freeze Delegate、Transfer Delegate、Burn Delegateなどのオーナー管理プラグインは、AddBlockerがアクティブでも常に追加できます。

### AddBlockerを追加した後に削除できますか？

はい、不変にされていなければ可能です。プラグインはauthorityによって削除できます。ただし、これはAddBlockerを使用する目的を無効にします。

### CollectionにAddBlockerを追加した場合、個々のAssetにプラグインを追加できますか？

いいえ。コレクションレベルのAddBlockerは、コレクションとそのすべてのAssetの両方にauthority管理プラグインを追加することを防ぎます。

### Metaplexが使用したい新しいプラグインをリリースした場合はどうなりますか？

AddBlockerがアクティブな場合、将来リリースされる新しいものを含め、新しいauthority管理プラグインを追加することはできません。計画的に対応してください。

### なぜAddBlockerを使用するのですか？

NFTのauthority管理プラグイン構成が最終的であることを保証するためです。これは、新しいプラグインを追加することでロイヤリティ、属性、その他の重要な設定が変更できないことをコレクターに保証します。

## 関連プラグイン

- [ImmutableMetadata](/smart-contracts/core/plugins/immutableMetadata) - 名前とURIを永続的にロック
- [Royalties](/smart-contracts/core/plugins/royalties) - AddBlockerを使用する前にロイヤリティを設定
- [Attributes](/smart-contracts/core/plugins/attribute) - AddBlockerを使用する前に属性を追加

## 用語集

| 用語 | 定義 |
|------|------------|
| **AddBlocker** | 新しいauthority管理プラグインを防ぐプラグイン |
| **Authority Managed** | update authorityによって制御されるプラグイン |
| **Owner Managed** | Assetオーナーによって制御されるプラグイン |
| **Plugin Configuration** | Asset/Collectionにアタッチされたプラグインのセット |
| **Inheritance** | Assetsがコレクションレベルの制限を取得 |
