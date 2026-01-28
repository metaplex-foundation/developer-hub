---
title: AddBlockerプラグイン
metaTitle: AddBlockerプラグイン | Metaplex Core
description: Core NFTアセットおよびコレクションへの新規権限管理型プラグインの追加を永続的にブロックします。プラグイン構成をロックダウンできます。
---

**AddBlockerプラグイン**は、アセットまたはコレクションに新規の権限管理型プラグインが追加されることを防止します。オーナー管理型プラグインは引き続き許可されたままで、NFT構成をロックダウンできます。 {% .lead %}

{% callout title="学べること" %}

- 新規権限管理型プラグインをブロックする
- 引き続き許可されるプラグインを理解する
- アセットとコレクションに適用する
- ロック前にプラグイン構成を計画する

{% /callout %}

## 概要

**AddBlocker**プラグインは、新規の権限管理型プラグインの追加を防止する権限管理型プラグインです。オーナー管理型プラグイン（Freeze Delegate、Transfer Delegateなど）は引き続き追加可能です。

- 権限管理型（アップデート権限のみが追加可能）
- 新規権限管理型プラグインを永続的にブロック
- オーナー管理型プラグインはブロックされない
- コレクションプラグインはそのコレクション内のすべてのアセットに影響

## 対象外

オーナー管理型プラグインのブロック（常に許可）、既存プラグインの削除、および既存プラグインの更新のブロック。

## クイックスタート

**ジャンプ:** [アセットへ追加](#アセットへaddblockerプラグインを追加するコード例) · [コレクションへ追加](#コレクションへaddblockerプラグインを追加するコード例)

1. 必要な権限管理型プラグインをすべて追加
2. アップデート権限としてAddBlockerプラグインを追加
3. 新規権限管理型プラグインは追加不可に

{% callout type="note" title="AddBlockerを使用するタイミング" %}

| シナリオ | AddBlockerを使用? |
|----------|-----------------|
| ロイヤリティが変更できないことを保証 | ✅ はい（先にRoyaltiesを追加、その後AddBlocker） |
| 将来のプラグイン追加を防止 | ✅ はい |
| 属性を永続的にロック | ❌ いいえ（Attributesで権限を`None`に設定） |
| マーケットプレイスでの出品を許可 | ✅ 動作可能（オーナー管理型は許可） |
| 将来新しいプラグインが必要 | ❌ AddBlockerを使用しない |

**AddBlockerを使用**すると、NFTの構成が最終版であることをコレクターに保証できます。

{% /callout %}

## 一般的なユースケース

- **ロイヤリティ保護**: 新しいRoyaltiesプラグインの追加をブロックしてロイヤリティの変更を防止
- **構成の確定**: コレクターにNFTのプラグインが変更されないことを保証
- **信頼構築**: 重要な設定がロックされていることを購入者に証明
- **コレクション標準**: コレクション全体で一貫したプラグイン構成を強制

## 対応状況

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## 引数

`AddBlocker`プラグインに引数は不要です。

## アセットへaddBlockerプラグインを追加するコード例

{% dialect-switcher title="MPL CoreアセットへaddBlockerプラグインを追加" %}
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

## コレクションへaddBlockerプラグインを追加するコード例

{% dialect-switcher title="コレクションへaddBlockerプラグインを追加" %}
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

AddBlockerプラグインを追加できるのはアップデート権限のみです。

### `Cannot add plugin - AddBlocker active`

AddBlockerプラグインが新規権限管理型プラグインを防止しています。これは期待される動作です。

## 注意事項

- AddBlockerを追加する前にプラグイン構成を慎重に計画してください
- 一度ブロックすると、将来のMetaplexプラグイン機能は追加できません
- オーナー管理型プラグイン（Freeze、Transfer、Burn Delegates）は常に許可されます
- コレクションへの追加は、すべてのアセットのプラグインもブロックします

## クイックリファレンス

### ブロックされるもの

| プラグインタイプ | ブロック |
|-------------|---------|
| 権限管理型 | ✅ ブロック |
| オーナー管理型 | ❌ 許可継続 |
| 永続型 | ✅ ブロック（作成時に追加必須） |

### 一般的な権限管理型プラグイン（ブロック対象）

- Royalties
- Attributes
- Verified Creators
- ImmutableMetadata
- AddBlocker（自身）

### オーナー管理型プラグイン（許可継続）

- Freeze Delegate
- Transfer Delegate
- Burn Delegate

## FAQ

### AddBlocker後もFreeze Delegateを追加できますか?

はい。Freeze Delegate、Transfer Delegate、Burn Delegateなどのオーナー管理型プラグインは、AddBlockerがアクティブでも常に追加できます。

### AddBlockerを追加後に削除できますか?

はい、不変化されていなければ。権限者がプラグインを削除できます。ただし、これはAddBlockerを使用する目的に反します。

### コレクションにAddBlockerを追加した場合、個々のアセットにプラグインを追加できますか?

いいえ。コレクションレベルのAddBlockerは、コレクションとそのすべてのアセットの両方で権限管理型プラグインの追加を防止します。

### Metaplexが新しいプラグインをリリースした場合どうなりますか?

AddBlockerがアクティブな場合、将来リリースされる新しいものを含め、新規の権限管理型プラグインを追加できません。計画的に対応してください。

### なぜAddBlockerを使用するのですか?

NFTの権限管理型プラグイン構成が最終版であることを保証するためです。これにより、ロイヤリティ、属性、その他の重要な設定が新しいプラグインの追加によって変更されないことをコレクターに保証できます。

## 関連プラグイン

- [ImmutableMetadata](/ja/smart-contracts/core/plugins/immutableMetadata) - 名前とURIを永続的にロック
- [Royalties](/ja/smart-contracts/core/plugins/royalties) - AddBlocker使用前にロイヤリティを設定
- [Attributes](/ja/smart-contracts/core/plugins/attribute) - AddBlocker使用前に属性を追加

## 用語集

| 用語 | 定義 |
|------|------------|
| **AddBlocker** | 新規権限管理型プラグインを防止するプラグイン |
| **権限管理型** | アップデート権限によって制御されるプラグイン |
| **オーナー管理型** | アセットオーナーによって制御されるプラグイン |
| **プラグイン構成** | アセット/コレクションに付与されたプラグインのセット |
| **継承** | アセットがコレクションレベルの制限を取得すること |

---

*Metaplex Foundation により管理 · 最終確認 2026年1月 · @metaplex-foundation/mpl-core に適用*
