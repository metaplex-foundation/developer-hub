---
title: Autographプラグイン
metaTitle: Autographプラグイン | Metaplex Core
description: 誰でもCore NFT Assetsに署名とメッセージを追加できるようにします。クリエイター、アーティスト、コミュニティメンバーからの収集可能なサインを作成します。
updated: '01-31-2026'
keywords:
  - autograph NFT
  - NFT signature
  - collectible autograph
  - artist signature
about:
  - Digital autographs
  - Signature collection
  - Community interaction
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Verified Creatorsとの違いは何ですか？
    a: Verified Creatorsは作成者であることを証明するためのもので、update authorityによって管理されます。Autographは誰からでも収集可能な署名用で、イベントでサインをもらうようなものです。
  - q: 複数のサインを追加できますか？
    a: いいえ。各アドレスはAssetごとに1つのサインのみ追加できます。同じアドレスから2番目のサインを追加しようとすると失敗します。
  - q: 自分のサインを削除できますか？
    a: いいえ。オーナーまたはautographデリゲートのみがサインを削除できます。これにより、誰かが署名してすぐに削除することを防ぎます。
  - q: サインを追加するにはオーナーの許可が必要ですか？
    a: いいえ。オーナーがAutographプラグインを有効にすると、誰でも自分の署名を追加できます。オーナーは個々のサインを承認する必要はありません。
  - q: Assetが転送されるとサインはどうなりますか？
    a: サインはAssetに残ります。所有権の変更に関係なく、誰が署名したかの永続的な記録です。
---
**Autographプラグイン**により、誰でもAssetまたはCollectionに署名とメッセージを追加できます。アーティスト、有名人、コミュニティメンバーからの収集可能な署名に最適です。 {% .lead %}
{% callout title="学べること" %}

- AssetsとCollectionsでサインを有効化
- Assetに署名を追加
- オーナーとしてサインを削除
- サインの権限を理解
{% /callout %}

## 概要

**Autograph**プラグインは、メッセージ付きの署名を保存するOwner Managedプラグインです。有効にすると、誰でも自分の署名を追加できます。オーナーは任意のサインを削除できます。

- オーナーがプラグインを追加（またはミント時にupdate authority）
- 誰でも自分の署名を追加可能
- オーナー/デリゲートのみがサインを削除可能
- 署名者は自分の署名を削除できない
- AssetsはCollectionからサインを継承

## 対象外

作成者の検証（[Verified Creators](/smart-contracts/core/plugins/verified-creators)を使用）、ロイヤリティ、自動署名検証。

## クイックスタート

**ジャンプ先:** [プラグインを追加](#assetへのautographプラグインの追加コード例) · [サインを追加](#assetへのサインの追加コード例) · [サインを削除](#assetからのサインの削除コード例)

1. オーナーがAutographプラグインを追加して署名を有効化
2. 誰でも`updatePlugin`で自分の署名を追加可能
3. オーナーは任意のサインを削除可能
{% callout type="note" title="Autograph vs Verified Creators" %}
| 機能 | Autograph | Verified Creators |
|---------|-----------|-------------------|
| 署名できる人 | 誰でも | リストされた作成者のみ |
| 有効化の権限 | オーナー | Update authority |
| 自己削除 | ❌ 自分のものを削除不可 | ✅ 自分の検証を解除可能 |
| 目的 | 収集可能な署名 | 作成者であることを証明 |
| 最適な用途 | ファンエンゲージメント、イベント | チーム帰属 |
**Autographを使用**するのは、収集可能な署名（サイン入り記念品のような）の場合です。
**[Verified Creators](/smart-contracts/core/plugins/verified-creators)を使用**するのは、誰がAssetを作成したかを証明する場合です。
{% /callout %}

## 一般的なユースケース

- **有名人のサイン**: アーティストがイベントでNFTに署名
- **ファンエンゲージメント**: コミュニティメンバーが限定版作品に署名
- **認証**: 実世界のアイテム作成者がデジタルツインに署名
- **イベント記念品**: カンファレンススピーカーがイベントNFTに署名
- **チャリティオークション**: 複数の有名人がチャリティNFTに署名
サインを追加するにはいくつかの条件を満たす必要があります：
- autographプラグインがすでに追加されている必要があります。
- 署名者は自分のアドレスのみ追加できます。
- 既存のリストを追加する署名と一緒に`updatePlugin`関数を使用して渡す必要があります。
- その署名者による既存のサインがまだないこと。
{% callout type="note" %}
autographプラグインがオーナーによって追加されると、誰でも自分の署名を追加できます。オーナーはいつでも削除できます。
{% /callout %}

## 対応

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |
AssetsはCollectionからサインを継承します。

## 引数

`autograph`プラグインは`signatures`配列に以下の引数が必要です：

| 引数     | 値     |
| ------- | ------    |
| address | publicKey |
| message | string    |

## Assetへのautographプラグインの追加コード例

{% dialect-switcher title="オーナーとしてMPL Core AssetにautographプラグインをhA追加" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  addPlugin,
} from '@metaplex-foundation/mpl-core'
await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    signatures: [
      {
        address: umi.identity.publicKey,
        message: 'Your Message',
      },
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Assetへのサインの追加コード例

{% dialect-switcher title="MPL Core Assetにサインを追加" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
// 追加したい新しいサイン
const newAutograph = {
  address: umi.identity.publicKey,
  message: "your message"
}
// 既存のsignatures配列に新しいサインを追加
const updatedAutographs = [...asset.autograph.signatures, newAutograph]
await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    // 削除したくないすべてのサインを含める必要があります
    signatures: updatedAutographs,
  },
  authority: umi.identity,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Assetからのサインの削除コード例

{% dialect-switcher title="MPL Core Assetからサインを削除" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
// 削除したいサインのPublickey
const publicKeyToRemove = publicKey("abc...")
const autographsToKeep = asset.autograph.signatures.filter(
  (autograph) => autograph.address !== publicKeyToRemove
);
await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    // 削除したくないすべてのサインを含める必要があります
    signatures: autographsToKeep,
  },
  authority: umi.identity, // アセットのオーナーである必要があります
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Collectionへのautographプラグインの追加コード例

{% dialect-switcher title="Collectionにautographプラグインを追加" %}
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
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 一般的なエラー

### `Plugin not added`

Autographプラグインは、誰かがサインを追加する前にオーナーによって追加される必要があります。

### `Autograph already exists`

このアドレスはすでにこのAssetに署名しています。各アドレスは1つのサインのみ追加できます。

### `Cannot remove own autograph`

署名者は自分の署名を削除できません（オーナーまたはautographデリゲートでもない限り）。

## 注意事項

- プラグインが有効になると誰でも自分の署名を追加可能
- オーナーまたはautographデリゲートのみがサインを削除可能
- 署名者は自分の署名を削除できない
- AssetsはCollectionからサインを継承
- 各アドレスはAssetごとに1回のみ署名可能

## クイックリファレンス

### 権限マトリックス

| アクション | オーナー | 誰でも | 署名者 |
|--------|-------|--------|-------------|
| プラグインを追加 | ✅ | ❌ | ❌ |
| 自分のサインを追加 | ✅ | ✅ | ✅ |
| 任意のサインを削除 | ✅ | ❌ | ❌ |
| 自分のサインを削除 | ✅（オーナーとして） | ❌ | ❌ |

### サインのライフサイクル

| ステップ | アクション | 誰が |
|------|--------|-----|
| 1 | Autographプラグインを追加 | オーナー |
| 2 | サインを追加 | 誰でも |
| 3 | サインを削除（オプション） | オーナーのみ |

## FAQ

### Verified Creatorsとの違いは何ですか？

Verified Creatorsは作成者であることを証明するためのもので、update authorityによって管理されます。Autographは誰からでも収集可能な署名用です（イベントでサインをもらうようなもの）。

### 複数のサインを追加できますか？

いいえ。各アドレスはAssetごとに1つのサインのみ追加できます。同じアドレスから2番目のサインを追加しようとすると失敗します。

### 自分のサインを削除できますか？

いいえ。オーナーまたはautographデリゲートのみがサインを削除できます。これにより、誰かが署名してすぐに削除することを防ぎます。

### サインを追加するにはオーナーの許可が必要ですか？

いいえ。オーナーがAutographプラグインを有効にすると、誰でも自分の署名を追加できます。オーナーは個々のサインを承認する必要はありません。

### Assetが転送されるとサインはどうなりますか？

サインはAssetに残ります。所有権の変更に関係なく、誰が署名したかの永続的な記録です。

## 用語集

| 用語 | 定義 |
|------|------------|
| **Autograph** | Assetに追加されたオプションのメッセージ付き署名 |
| **Autographer** | 自分の署名を追加したアドレス |
| **Autograph Delegate** | サインを削除する権限を持つアドレス |
| **Signatures Array** | Asset上のすべてのサインのリスト |
| **Owner Managed** | オーナーが追加を制御するプラグインタイプ |

## 関連プラグイン

- [Verified Creators](/smart-contracts/core/plugins/verified-creators) - 作成者であることを証明（authority管理）
- [Attributes](/smart-contracts/core/plugins/attribute) - オンチェーンデータを保存
- [ImmutableMetadata](/smart-contracts/core/plugins/immutableMetadata) - メタデータを永続的にロック
