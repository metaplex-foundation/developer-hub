---
title: Autographプラグイン
metaTitle: Autographプラグイン | Metaplex Core
description: Core NFTアセットに署名とメッセージを追加する方法を学びます。アーティスト、有名人、コミュニティメンバーからのコレクタブルな署名を作成できます。
---

**Autographプラグイン**は、アセットやコレクションに署名とメッセージを追加できるようにします。アーティスト、有名人、コミュニティメンバーからのコレクタブルな署名に最適です。 {% .lead %}

{% callout title="学習内容" %}

- アセットとコレクションでオートグラフを有効にする
- アセットに署名を追加する
- オーナーとしてオートグラフを削除する
- オートグラフの権限を理解する

{% /callout %}

## 概要

**Autograph**プラグインは、署名とメッセージを保存するオーナー管理型プラグインです。有効にすると、誰でも自分の署名を追加できます。オーナーは任意のオートグラフを削除できます。

- オーナーがプラグインを追加（またはミント時にupdate authorityが追加）
- 誰でも自分の署名を追加可能
- オーナー/デリゲートのみがオートグラフを削除可能
- 署名者は自分の署名を削除できない
- アセットはコレクションからオートグラフを継承

## 対象外

クリエイター検証（[Verified Creators](/ja/smart-contracts/core/plugins/verified-creators)を使用）、ロイヤリティ、自動署名検証。

## クイックスタート

**ジャンプ:** [プラグイン追加](#アセットへautographプラグインを追加コード例) · [オートグラフ追加](#アセットにオートグラフを追加コード例) · [オートグラフ削除](#アセットからオートグラフを削除コード例)

1. オーナーがAutographプラグインを追加して署名を有効化
2. 誰でも`updatePlugin`で自分の署名を追加可能
3. オーナーは任意のオートグラフを削除可能

{% callout type="note" title="Autograph vs Verified Creators" %}

| 機能 | Autograph | Verified Creators |
|------|-----------|-------------------|
| 署名できる人 | 誰でも | リストされたクリエイターのみ |
| 有効化の権限 | オーナー | Update authority |
| 自己削除 | 不可 | 自分の検証を解除可能 |
| 目的 | コレクタブルな署名 | クリエイターシップの証明 |
| 最適な用途 | ファンエンゲージメント、イベント | チーム帰属表示 |

**Autograph**はコレクタブルな署名（サイン入りの記念品のような）に使用。
**[Verified Creators](/ja/smart-contracts/core/plugins/verified-creators)**はアセットの作成者を証明するために使用。

{% /callout %}

## 一般的なユースケース

- **有名人のサイン**: アーティストがイベントでNFTに署名
- **ファンエンゲージメント**: コミュニティメンバーが限定版に署名
- **認証**: 実物アイテムの作成者がデジタルツインに署名
- **イベント記念品**: カンファレンスのスピーカーがイベントNFTに署名
- **チャリティオークション**: 複数の有名人がチャリティNFTに署名

オートグラフを追加するには、いくつかの条件を満たす必要があります：

- autographプラグインが既に追加されていること
- 署名者は自分のアドレスのみ追加可能
- 既存のリストに追加した署名を`updatePlugin`関数で渡す必要がある
- その署名者による既存のオートグラフがまだ存在しないこと

{% callout type="note" %}
オーナーがautographプラグインを追加すると、誰でも自分の署名を追加できるようになります。オーナーはいつでもそれを削除できます。
{% /callout %}

## 対応状況

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

アセットはコレクションからAutographを継承します。

## 引数

`autograph`プラグインは`signatures`配列に以下の引数を必要とします：

| 引数     | 値        |
| ------- | --------- |
| address | publicKey |
| message | string    |

## アセットへautographプラグインを追加（コード例）

{% dialect-switcher title="オーナーとしてMPL CoreアセットにAutographプラグインを追加" %}
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

## アセットにオートグラフを追加（コード例）

{% dialect-switcher title="MPL CoreアセットにAutographを追加" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

// 追加したい新しいオートグラフ
const newAutograph = {
  address: umi.identity.publicKey,
  message: "your message"
}

// 既存のsignatures配列に新しいオートグラフを追加
const updatedAutographs = [...asset.autograph.signatures, newAutograph]

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    // 削除しないすべてのオートグラフを含める
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

const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

// 削除したいオートグラフのPublicKey
const publicKeyToRemove = publicKey("abc...")

const autographsToKeep = asset.autograph.signatures.filter(
  (autograph) => autograph.address !== publicKeyToRemove
);

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    // 削除しないすべてのAutographを含める
    signatures: autographsToKeep,
  },
  authority: umi.identity, // アセットのオーナーである必要があります
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## コレクションへautographプラグインを追加（コード例）

{% dialect-switcher title="コレクションにautographプラグインを追加" %}
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

オーナーが先にAutographプラグインを追加する必要があります。

### `Autograph already exists`

このアドレスは既にこのアセットに署名しています。各アドレスは1つのオートグラフのみ追加できます。

### `Cannot remove own autograph`

署名者は自分の署名を削除できません（オーナーまたはautographデリゲートでもある場合を除く）。

## 注意事項

- プラグインが有効になると誰でも自分の署名を追加できる
- オーナーまたはautographデリゲートのみがオートグラフを削除できる
- 署名者は自分の署名を削除できない
- アセットはコレクションからオートグラフを継承する
- 各アドレスはアセットごとに1回のみ署名可能

## クイックリファレンス

### 権限マトリックス

| アクション | オーナー | 誰でも | 署名者 |
|----------|--------|--------|--------|
| プラグイン追加 | ✅ | ❌ | ❌ |
| 自分のオートグラフ追加 | ✅ | ✅ | ✅ |
| 任意のオートグラフ削除 | ✅ | ❌ | ❌ |
| 自分のオートグラフ削除 | ✅（オーナーとして） | ❌ | ❌ |

### オートグラフのライフサイクル

| ステップ | アクション | 実行者 |
|---------|----------|--------|
| 1 | Autographプラグインを追加 | オーナー |
| 2 | オートグラフを追加 | 誰でも |
| 3 | オートグラフを削除（任意） | オーナーのみ |

## FAQ

### Verified Creatorsとの違いは何ですか？

Verified Creatorsはクリエイターシップの証明用で、update authorityが管理します。Autographは誰からでもコレクタブルな署名を集めるためのものです（イベントでサインをもらうようなもの）。

### 複数のオートグラフを追加できますか？

いいえ。各アドレスはアセットごとに1つのオートグラフのみ追加できます。同じアドレスから2番目のオートグラフを追加しようとすると失敗します。

### 自分のオートグラフを削除できますか？

いいえ。オーナーまたはautographデリゲートのみがオートグラフを削除できます。これは、署名してすぐに削除することを防ぐためです。

### オートグラフを追加するのにオーナーの許可が必要ですか？

いいえ。オーナーがAutographプラグインを有効にすると、誰でも自分の署名を追加できます。オーナーは個々のオートグラフを承認する必要はありません。

### アセットが転送されるとオートグラフはどうなりますか？

オートグラフはアセットに残ります。所有権の変更に関係なく、誰が署名したかの永続的な記録です。

## 用語集

| 用語 | 定義 |
|------|------|
| **Autograph** | アセットに追加されたオプションのメッセージ付き署名 |
| **Autographer** | 自分の署名を追加したアドレス |
| **Autograph Delegate** | オートグラフを削除する権限を持つアドレス |
| **Signatures Array** | アセット上のすべてのオートグラフのリスト |
| **Owner Managed** | オーナーが追加を制御するプラグインタイプ |

## 関連プラグイン

- [Verified Creators](/ja/smart-contracts/core/plugins/verified-creators) - クリエイターシップの証明（authority管理）
- [Attributes](/ja/smart-contracts/core/plugins/attribute) - オンチェーンデータの保存
- [ImmutableMetadata](/ja/smart-contracts/core/plugins/immutableMetadata) - メタデータを永久にロック

---

*Metaplex Foundation管理 · 最終確認 2026年1月 · @metaplex-foundation/mpl-core対応*
