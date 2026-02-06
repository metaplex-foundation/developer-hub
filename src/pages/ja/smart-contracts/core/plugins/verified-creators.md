---
title: Verified Creator Plugin
metaTitle: Verified Creator Plugin | Metaplex Core
description: Core NFT AssetやCollectionに検証済みクリエイター署名を追加します。ロイヤリティ配分に影響を与えずにクリエイターであることを証明できます。
updated: '01-31-2026'
keywords:
  - verified creator
  - creator signature
  - prove authorship
  - creator verification
about:
  - Creator verification
  - Signature proof
  - Authorship
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: Token Metadataのcreator配列との違いは何ですか？
    a: Token Metadataでは、creator配列はロイヤリティ配分に使用されていました。Coreでは、Verified Creatorsは純粋にクリエイターであることの証明用です。ロイヤリティ配分にはRoyalties Pluginを使用してください。
  - q: Update authorityがクリエイターを検証できますか？
    a: いいえ。各クリエイターはトランザクションに署名して自分自身を検証する必要があります。これにより本物のクリエイターであることの証明が保証されます。
  - q: 検証済みクリエイターを削除できないのはなぜですか？
    a: 検証済みクリエイターを削除するには、まず自分自身の検証を解除する必要があります。これにより、検証済みクリエイターの不正な削除を防止します。
  - q: AssetはCollectionの検証済みクリエイターを自動的に取得しますか？
    a: はい。AssetはCollectionからcreators配列を継承します。個別のAssetは異なるクリエイターを持つ独自のVerified Creators Pluginを持つこともできます。
  - q: 共同クリエイターの帰属表示に使用できますか？
    a: はい。これは一般的なユースケースです。複数のクリエイターが全員、AssetやCollectionの作成への関与を検証できます。
---
**Verified Creators Plugin**は、AssetまたはCollectionに検証済みクリエイター署名のリストを保存します。ロイヤリティ配分に影響を与えずに、クリエイターであることを公に証明できます。{% .lead %}
{% callout title="学習内容" %}

- AssetとCollectionに検証済みクリエイターを追加する
- クリエイター署名を検証する
- リストからクリエイターを削除する
- 検証ワークフローを理解する
{% /callout %}

## 概要

**Verified Creators** Pluginは、検証ステータス付きのクリエイターアドレスを保存するAuthority Managedプラグインです。Token Metadataとは異なり、これらのクリエイターはロイヤリティ配分には使用されません（それにはRoyalties Pluginを使用してください）。

- Update authorityが未検証のクリエイターを追加
- クリエイターは署名して自分自身を検証
- 検証済みクリエイターは削除前に検証解除が必要
- AssetはCollectionからクリエイターを継承

## 対象外

ロイヤリティ配分（[Royalties Plugin](/ja/smart-contracts/core/plugins/royalties)を使用）、Token Metadataのcreator配列、自動検証。

## クイックスタート

**ジャンプ先:** [Assetに追加](#adding-the-autograph-plugin-to-an-asset-code-example) · [クリエイターを追加](#adding-a-different-creator-to-an-asset-code-example) · [クリエイターを削除](#removing-a-creator-from-an-asset-code-example)

1. 初期クリエイターでVerified Creators Pluginを追加
2. クリエイターは`updatePlugin`を使用して自分自身を検証
3. 削除するには: クリエイターが検証解除、その後update authorityが削除
{% callout type="note" title="Verified Creators vs Autograph" %}
| 機能 | Verified Creators | Autograph |
|---------|-------------------|-----------|
| 追加できる人 | Update authorityのみ | 誰でも（有効化後） |
| 目的 | クリエイターであることの証明 | コレクタブル署名 |
| 検証 | クリエイターが自分で検証 | 検証不要 |
| 削除 | まず検証解除が必要 | オーナーがいつでも削除可能 |
| ロイヤリティに使用 | いいえ | いいえ |
**Verified Creators**は本物のクリエイターであることを証明するために使用します。
**[Autograph](/ja/smart-contracts/core/plugins/autograph)**はファンや有名人からのコレクタブル署名に使用します。
{% /callout %}

## 一般的なユースケース

- **チーム帰属**: デザイナー、開発者、創設者がそれぞれ関与を検証
- **共同クリエイターの証明**: 複数のアーティストが作品へのコラボレーションを検証
- **ブランド検証**: 公式ブランドアカウントがパートナーシップを検証
- **真正性の証明**: オリジナルクリエイターがAssetを作成したことを検証
- **履歴記録**: Collectionの作成に関わった人を文書化
`update authority`ができること:
- Pluginを追加する
- creators配列に未検証のクリエイターを追加する
- 未検証のクリエイターを削除できる。検証済みクリエイターを削除するには、まず自分自身の検証を解除する必要がある
- 自分自身を検証できる
クリエイターを検証するには、`updatePlugin`インストラクションにupdate authorityによってcreators配列に追加された公開鍵で署名する必要があります。

## 対応

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## 引数

`verifiedCreator` Pluginは`VerifiedCreatorsSignature`配列で以下の引数を必要とします:

| 引数    | 値        |
| ------- | ------    |
| address | publicKey |
| message | string    |
AssetはCollectionからCreators配列を継承します。

## Assetへのautograph Plugin追加のコード例

{% dialect-switcher title="Adding a verified Creators Plugin to an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}
このスニペットは、umiのidentityがassetのupdate authorityであることを前提としています。

```ts
import {
  addPlugin,
} from '@metaplex-foundation/mpl-core'
await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: [
      {
        address: umi.identity.publicKey,
        verified: true,
      },
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Assetに別のCreatorを追加するコード例

{% dialect-switcher title="Adding a different Creator to an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}
このスニペットは、umiのidentityがassetのupdate authorityであり、未検証のCreatorを追加することを前提としています。

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
const publicKeyToAdd = publicKey("abc...")
// The new autograph that you want to add
const newCreator = {
  address: publicKeyToAdd,
  verified: false,
}
// Add the new autograph to the existing signatures array
const updatedCreators = [...asset.verifiedCreators.signatures, newCreator]
await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: updatedCreators,
  },
  authority: umi.identity,
}).sendAndConfirm(umi)
```

未検証のCreatorを追加した後、`updatePlugin`関数を再度使用して自分自身を検証できます。
このスニペットは、umiのidentityがCreatorであることを前提としています。

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
const publicKeyToVerify = publicKey("abc...")
// The creator that you want to verify
const updatedCreators = asset.verifiedCreators.signatures.map(creator => {
  if (creator.address === publicKeyToVerify) {
    return { ...creator, verified: true };
  }
  return creator;
});
await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: updatedCreators,
  },
  authority: umi.identity,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## AssetからCreatorを削除するコード例

{% dialect-switcher title="Removing a Creator from an MPL Core Asset" %}
{% dialect title="JavaScript" id="js" %}
update authorityのみがクリエイターを削除できます。クリエイターを削除するには、`verified:false`であるか、update authority自身である必要があります。そのため、更新は2つのステップで行われます。update authorityとクリエイターの両方で同時に署名できる場合、両方のインストラクションを組み合わせて1つのトランザクションで実行できます。

1. `verified:false`を設定
このスニペットは、`umi.identity`が削除したいクリエイターであることを前提としています

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
// The Publickey of the creator that you want to remove
const publicKeyToRemove = publicKey("abc...")
const modifiedCreators = signatures.map(signature =>
  signature.address === creator.publicKey
    ? { ...signature, verified: false }
    : signature
);
await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: modifiedCreators,
  },
  authority: umi.identity, // Should be the creator
}).sendAndConfirm(umi)
```
1. クリエイターを削除
このスニペットは、`umi.identity`がupdate authorityであることを前提としています

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'
const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})
// The Publickey of the creator that you want to remove
const publicKeyToRemove = publicKey("abc...")
const creatorsToKeep = asset.verifiedCreators.signatures.filter(
  (creator) => creator.address !== publicKeyToRemove
);
await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: creatorsToKeep,
  },
  authority: umi.identity, // Should be the update authority
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Collectionにverified Creators Pluginを追加するコード例

{% dialect-switcher title="Add verified Creators Plugin to Collection" %}
{% dialect title="JavaScript" id="js" %}
このスニペットは、`umi.identity`がupdate authorityであることを前提としています

```ts
import { addCollectionPlugin } from '@metaplex-foundation/mpl-core'
await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'VerifiedCreators',
        signatures: [
      {
        address: umi.identity.publicKey,
        verified: true,
      },
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## よくあるエラー

### `Authority mismatch`

update authorityのみがPluginを追加したり、新しいクリエイターを追加したりできます。クリエイター自身のみが自分の署名を検証できます。

### `Creator already verified`

クリエイターは既に自分自身を検証しています。アクションは不要です。

### `Cannot remove verified creator`

検証済みクリエイターは、update authorityが削除する前に自分自身の検証を解除する必要があります。

## 注意事項

- Verified Creatorsはロイヤリティ配分には使用されません（Royalties Pluginを使用）
- クリエイターは自分自身を検証する必要があります。update authorityは代わりに検証できません
- クリエイターは削除される前に検証を解除する必要があります
- AssetはCollectionからcreators配列を継承します

## クイックリファレンス

### 検証ワークフロー

| ステップ | アクション | 実行者 |
|------|--------|-----|
| 1 | 未検証クリエイターを追加 | Update Authority |
| 2 | クリエイターを検証 | クリエイターが署名 |
| 3 | 検証解除（オプション） | クリエイターが署名 |
| 4 | 削除（オプション） | Update Authority |

### 権限マトリックス

| アクション | Update Authority | Creator |
|--------|------------------|---------|
| Pluginを追加 | ✅ | ❌ |
| 未検証クリエイターを追加 | ✅ | ❌ |
| クリエイターを検証 | ❌ | ✅（自分のみ） |
| クリエイターの検証解除 | ❌ | ✅（自分のみ） |
| 未検証クリエイターを削除 | ✅ | ❌ |

## FAQ

### Token Metadataのcreator配列との違いは何ですか？

Token Metadataでは、creator配列はロイヤリティ配分に使用されていました。Coreでは、Verified Creatorsは純粋にクリエイターであることの証明用です。ロイヤリティ配分にはRoyalties Pluginを使用してください。

### Update authorityがクリエイターを検証できますか？

いいえ。各クリエイターはトランザクションに署名して自分自身を検証する必要があります。これにより本物のクリエイターであることの証明が保証されます。

### 検証済みクリエイターを削除できないのはなぜですか？

検証済みクリエイターを削除するには、まず自分自身の検証を解除する必要があります。これにより、検証済みクリエイターの不正な削除を防止します。

### AssetはCollectionの検証済みクリエイターを自動的に取得しますか？

はい。AssetはCollectionからcreators配列を継承します。個別のAssetは異なるクリエイターを持つ独自のVerified Creators Pluginを持つこともできます。

### 共同クリエイターの帰属表示に使用できますか？

はい。これは一般的なユースケースです。複数のクリエイター（デザイナー、開発者、アーティスト）が全員、AssetやCollectionの作成への関与を検証できます。

## 用語集

| 用語 | 定義 |
|------|------------|
| **Verified Creator** | 関与を確認するために署名したクリエイター |
| **Unverified Creator** | update authorityによって追加されたがまだ確認されていないクリエイター |
| **Verification** | 本物のクリエイターであることを証明するためのクリエイターの署名 |
| **Royalties Plugin** | ロイヤリティ配分用の別のPlugin（これではない） |
| **Creator Array** | Asset/Collectionに関連付けられたアドレスのリスト |

## 関連Plugin

- [Autograph](/ja/smart-contracts/core/plugins/autograph) - 誰でも（ファン、有名人）からのコレクタブル署名
- [Royalties](/ja/smart-contracts/core/plugins/royalties) - ロイヤリティ配分の設定（検証済みクリエイターとは別）
- [ImmutableMetadata](/ja/smart-contracts/core/plugins/immutableMetadata) - メタデータを永久にロック
