---
title: ImmutableMetadataプラグイン
metaTitle: ImmutableMetadataプラグイン | Metaplex Core
description: Core NFTアセットおよびコレクションのメタデータを永久に不変にします。将来の変更を防ぐためにnameとURIをロックします。
---

**ImmutableMetadataプラグイン**は、アセットまたはコレクションのnameとURIを永久にロックします。追加すると、誰もメタデータを変更できなくなり、永続的な来歴を保証します。 {% .lead %}

{% callout title="学習内容" %}

- アセットのメタデータを不変にする
- コレクションのメタデータを不変にする
- コレクションからアセットへの継承を理解する
- NFTの来歴を永久に保護する

{% /callout %}

## 概要

**ImmutableMetadata**プラグインは、アセットまたはコレクションのnameとURIの変更を防止する権限管理型プラグインです。追加すると、この保護は永続的になります。

- 権限管理型（update authorityのみが追加可能）
- nameとURIを永久に変更不可にする
- 追加後は削除できない
- コレクションのプラグインはそのコレクション内のすべてのアセットに影響

## 対象外

他のプラグインデータを不変にする（それらのプラグインに権限`None`を使用）、選択的なフィールドの不変性、一時的なロック。

## クイックスタート

**ジャンプ:** [アセットに追加](#アセットへimmutablemetadataプラグインを追加コード例) · [コレクションに追加](#コレクションへimmutablemetadataプラグインを追加コード例)

1. メタデータ（name、URI）が最終版であることを確認
2. update authorityとしてImmutableMetadataプラグインを追加
3. メタデータが永久にロックされる

{% callout type="note" title="ImmutableMetadataを使用する場面" %}

| シナリオ | ImmutableMetadataを使用？ |
|----------|-------------------------|
| 永久的なアートワークを持つアートNFT | ✅ はい |
| 進化するステータスを持つゲームアイテム | ❌ いいえ（属性の更新が必要） |
| ラグプル防止 | ✅ はい |
| ダイナミック/進化するNFT | ❌ いいえ |
| 証明書/資格証明 | ✅ はい |

**ImmutableMetadataを使用**：永続性が重視されるアート、コレクタブル、証明書に。
**使用しない**：更新が必要なゲームアイテムやダイナミックNFTには。

{% /callout %}

## 一般的なユースケース

- **アートコレクタブル**: アートワークとメタデータが決して変更されないことを保証
- **証明書**: 改ざんできない資格証明を発行
- **来歴保護**: メタデータをロックしてラグプルを防止
- **歴史的記録**: NFTデータを永久に保存
- **ブランド保証**: NFTのアイデンティティが固定されていることをコレクターに保証

## 対応状況

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## 引数

ImmutableMetadataプラグインに引数は必要ありません。

## アセットへimmutableMetadataプラグインを追加（コード例）

{% dialect-switcher title="MPL CoreアセットにImmutabilityプラグインを追加" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  addPlugin,
} from '@metaplex-foundation/mpl-core'

await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'ImmutableMetadata',
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## コレクションへimmutableMetadataプラグインを追加（コード例）

{% dialect-switcher title="コレクションにimmutableMetadataプラグインを追加" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  addCollectionPlugin,
} from '@metaplex-foundation/mpl-core'

await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'ImmutableMetadata',
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 一般的なエラー

### `Authority mismatch`

update authorityのみがImmutableMetadataプラグインを追加できます。

### `Cannot update metadata`

ImmutableMetadataプラグインがアクティブです。nameとURIは変更できません。

## 注意事項

- このアクションは**永久的で取り消し不可能**です
- このプラグインを追加する前にnameとURIを再確認してください
- コレクションに追加すると、そのコレクション内のすべてのアセットが不変になります
- プラグインに引数はありません—追加するだけでメタデータがロックされます

## クイックリファレンス

### 影響を受けるフィールド

| フィールド | ロック |
|-----------|--------|
| `name` | ✅ |
| `uri` | ✅ |
| その他のメタデータ | ❌（他の方法を使用） |

### 継承動作

| 追加先 | 効果 |
|--------|------|
| アセット | そのアセットのメタデータのみロック |
| コレクション | コレクションおよびすべてのアセットのメタデータがロック |

## FAQ

### ImmutableMetadataの追加を取り消せますか？

いいえ。追加すると、ImmutableMetadataプラグインは削除できません。メタデータは永久にロックされます。これは来歴保証のための設計です。

### 具体的に何が不変になりますか？

アセットまたはコレクションの`name`と`uri`フィールドです。他のプラグインデータは影響を受けません—個々のプラグインのデータを不変にするには、そのプラグインに権限`None`を使用してください。

### コレクションにこれを追加すると、既存のアセットに影響しますか？

はい。ImmutableMetadataがコレクションにある場合、そのコレクション内のすべてのアセットが不変性を継承します。それらのメタデータは変更できません。

### アセット作成時にこれを追加できますか？

はい。`create()`時にImmutableMetadataを追加して、最初からメタデータがロックされていることを確保できます。

### なぜ不変メタデータが必要なのですか？

不変メタデータは永続的な来歴を提供します—コレクターはNFTの名前と関連するメタデータURIが決して変更されないことを知り、クリエイターがアートワークや説明を差し替えるラグプルを防ぎます。

## 関連プラグイン

- [AddBlocker](/ja/smart-contracts/core/plugins/addBlocker) - 新しいプラグインの追加を防止（ImmutableMetadataと補完的）
- [Attributes](/ja/smart-contracts/core/plugins/attribute) - オンチェーンデータ（ImmutableMetadataではロックされない）
- [Royalties](/ja/smart-contracts/core/plugins/royalties) - 不変にする前にロイヤリティを設定

## 用語集

| 用語 | 定義 |
|------|------|
| **Immutable** | 変更または修正できない |
| **Metadata** | アセット/コレクションに関連付けられたnameとURI |
| **Provenance** | 真正性と所有権の検証可能な記録 |
| **URI** | オフチェーンJSONメタデータへのリンク |
| **Inheritance** | アセットがコレクションレベルのプラグイン効果を自動的に取得すること |

---

*Metaplex Foundation管理 · 最終確認 2026年1月 · @metaplex-foundation/mpl-core対応*
