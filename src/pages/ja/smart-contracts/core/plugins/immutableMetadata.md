---
title: ImmutableMetadataプラグイン
metaTitle: ImmutableMetadataプラグイン | Metaplex Core
description: Core NFT AssetとCollectionのメタデータを永続的に不変にします。名前とURIをロックして将来の変更を防ぎます。
updated: '01-31-2026'
keywords:
  - immutable metadata
  - lock metadata
  - permanent NFT
  - provenance
about:
  - Metadata immutability
  - Provenance protection
  - Data locking
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: ImmutableMetadataの追加を取り消せますか？
    a: いいえ。一度追加されると、ImmutableMetadataプラグインは削除できません。メタデータは永続的にロックされます。これは来歴保証のための設計です。
  - q: 具体的に何が不変になりますか？
    a: AssetまたはCollectionのnameとuriフィールドです。他のプラグインデータは影響を受けません—それらのデータを不変にするには個別のプラグインでauthority Noneを使用してください。
  - q: Collectionにこれを追加すると、既存のAssetsに影響しますか？
    a: はい。ImmutableMetadataがCollectionにあると、そのCollection内のすべてのAssetsが不変性を継承します。それらのメタデータは変更できなくなります。
  - q: Asset作成時にこれを追加できますか？
    a: はい。create()中にImmutableMetadataを追加して、メタデータが最初からロックされるようにできます。
  - q: なぜ不変メタデータが必要なのですか？
    a: 不変メタデータは永続的な来歴を提供します—コレクターはNFTの名前と関連するメタデータURIが決して変更されないことを知り、アートワークや説明を差し替えるラグプルを防ぎます。
---
**ImmutableMetadataプラグイン**は、AssetsまたはCollectionsの名前とURIを永続的にロックします。一度追加されると、メタデータは誰も変更できなくなり、永続的な来歴を保証します。 {% .lead %}
{% callout title="学べること" %}
- Assetのメタデータを不変にする
- Collectionのメタデータを不変にする
- CollectionsからAssetsへの継承を理解
- NFTの来歴を永続的に保護
{% /callout %}
## 概要
**ImmutableMetadata**プラグインは、AssetまたはCollectionの名前とURIへの変更を防ぐAuthority Managedプラグインです。一度追加されると、この保護は永続的です。
- Authority Managed（update authorityのみが追加可能）
- 名前とURIを永続的に変更不可にする
- 追加後は削除不可
- Collectionプラグインはそのコレクション内のすべてのAssetsに影響
## 対象外
他のプラグインデータを不変にする（それらのプラグインでauthority `None`を使用）、選択的なフィールドの不変性、一時的なロック。
## クイックスタート
**ジャンプ先:** [Assetに追加](#assetへのimmutablemetadataプラグインの追加コード例) · [Collectionに追加](#collectionへのimmutablemetadataプラグインの追加コード例)
1. メタデータ（名前、URI）が最終版であることを確認
2. Update authorityとしてImmutableMetadataプラグインを追加
3. メタデータが永続的にロックされる
{% callout type="note" title="ImmutableMetadataを使用するタイミング" %}
| シナリオ | ImmutableMetadataを使用？ |
|----------|------------------------|
| 永続的なアートワークを持つアートNFT | ✅ はい |
| 進化するステータスを持つゲームアイテム | ❌ いいえ（属性の更新が必要） |
| ラグプルを防止 | ✅ はい |
| 動的/進化するNFT | ❌ いいえ |
| 証明書/資格 | ✅ はい |
**ImmutableMetadataを使用**するのは、永続性が重視されるアート、コレクティブル、証明書の場合です。
**使用しない**のは、更新が必要なゲームアイテムや動的NFTの場合です。
{% /callout %}
## 一般的なユースケース
- **アートコレクティブル**: アートワークとメタデータが決して変更されないことを保証
- **証明書**: 変更できない資格を発行
- **来歴保護**: メタデータをロックしてラグプルを防止
- **歴史的記録**: NFTデータを永続的に保存
- **ブランド保証**: NFTのアイデンティティが固定されていることをコレクターに保証
## 対応
|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |
## 引数
ImmutableMetadataプラグインには引数は必要ありません。
## Assetへのimmutablemetadataプラグインの追加コード例
{% dialect-switcher title="MPL Core AssetへのImmutabilityプラグインの追加" %}
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
## Collectionへのimmutablemetadataプラグインの追加コード例
{% dialect-switcher title="CollectionへのimmutableMetadataプラグインの追加" %}
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
Update authorityのみがImmutableMetadataプラグインを追加できます。
### `Cannot update metadata`
ImmutableMetadataプラグインがアクティブです。名前とURIは変更できません。
## 注意事項
- このアクションは**永続的で不可逆**です
- このプラグインを追加する前に名前とURIを再確認してください
- Collectionに追加すると、そのCollection内のすべてのAssetsが不変になります
- プラグインには引数がありません—追加するだけでメタデータがロックされます
## クイックリファレンス
### 影響を受けるフィールド
| フィールド | ロック |
|-------|--------|
| `name` | ✅ |
| `uri` | ✅ |
| その他のメタデータ | ❌（他の方法を使用） |
### 継承動作
| 追加先 | 効果 |
|----------|--------|
| Asset | そのAssetのメタデータのみがロック |
| Collection | CollectionとすべてのAssetsのメタデータがロック |
## FAQ
### ImmutableMetadataの追加を取り消せますか？
いいえ。一度追加されると、ImmutableMetadataプラグインは削除できません。メタデータは永続的にロックされます。これは来歴保証のための設計です。
### 具体的に何が不変になりますか？
AssetまたはCollectionの`name`と`uri`フィールドです。他のプラグインデータは影響を受けません—それらのデータを不変にするには個別のプラグインでauthority `None`を使用してください。
### Collectionにこれを追加すると、既存のAssetsに影響しますか？
はい。ImmutableMetadataがCollectionにあると、そのCollection内のすべてのAssetsが不変性を継承します。それらのメタデータは変更できなくなります。
### Asset作成時にこれを追加できますか？
はい。`create()`中にImmutableMetadataを追加して、メタデータが最初からロックされるようにできます。
### なぜ不変メタデータが必要なのですか？
不変メタデータは永続的な来歴を提供します—コレクターはNFTの名前と関連するメタデータURIが決して変更されないことを知り、クリエイターがアートワークや説明を差し替えるラグプルを防ぎます。
## 関連プラグイン
- [AddBlocker](/smart-contracts/core/plugins/addBlocker) - 新しいプラグインを防止（ImmutableMetadataを補完）
- [Attributes](/smart-contracts/core/plugins/attribute) - オンチェーンデータ（ImmutableMetadataではロックされない）
- [Royalties](/smart-contracts/core/plugins/royalties) - 不変にする前にロイヤリティを設定
## 用語集
| 用語 | 定義 |
|------|------------|
| **不変** | 変更または修正できない |
| **メタデータ** | Asset/Collectionに関連付けられた名前とURI |
| **来歴** | 真正性と所有権の検証可能な記録 |
| **URI** | オフチェーンJSONメタデータへのリンク |
| **継承** | AssetsがCollectionレベルのプラグイン効果を自動的に取得 |
