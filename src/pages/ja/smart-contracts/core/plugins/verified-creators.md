---
title: Verified Creatorプラグイン
metaTitle: Verified Creatorプラグイン | Metaplex Core
description: Core NFTアセットとコレクションに検証済みクリエイター署名を追加します。ロイヤリティ分配に影響を与えずに作成者であることを証明します。
---

**Verified Creatorsプラグイン**は、アセットまたはコレクションに検証済みクリエイター署名のリストを保存します。ロイヤリティ分配に影響を与えずに、公開的に作成者であることを証明します。 {% .lead %}

{% callout title="学習内容" %}

- アセットとコレクションに検証済みクリエイターを追加
- クリエイター署名を検証
- リストからクリエイターを削除
- 検証ワークフローを理解

{% /callout %}

## 概要

**Verified Creators**プラグインは、クリエイターアドレスと検証ステータスを保存する権限管理プラグインです。Token Metadataとは異なり、これらのクリエイターはロイヤリティ分配には使用されません（そのためにはRoyaltiesプラグインを使用）。

- 更新権限が未検証クリエイターを追加
- クリエイターは署名して自己検証
- 検証済みクリエイターは削除前に検証解除が必要
- アセットはコレクションからクリエイターを継承

## 対象外

ロイヤリティ分配（[Royaltiesプラグイン](/ja/smart-contracts/core/plugins/royalties)を使用）、Token Metadataクリエイター配列、および自動検証。

## クイックスタート

**ジャンプ先:** [アセットに追加](#adding-the-autograph-plugin-to-an-asset-code-example) · [クリエイター追加](#adding-a-different-creator-to-an-asset-code-example) · [クリエイター削除](#removing-a-creator-from-an-asset-code-example)

1. 初期クリエイターとともにVerified Creatorsプラグインを追加
2. クリエイターは`updatePlugin`を使用して自己検証
3. 削除するには：クリエイターが検証解除、その後更新権限が削除

{% callout type="note" title="Verified Creators vs Autograph" %}

| 機能 | Verified Creators | Autograph |
|---------|-------------------|-----------|
| 追加できる人 | 更新権限のみ | 誰でも（有効化後） |
| 目的 | 作成者であることの証明 | コレクタブル署名 |
| 検証 | クリエイターが自己検証 | 検証不要 |
| 削除 | 先に検証解除が必要 | オーナーがいつでも削除可能 |
| ロイヤリティに使用 | ❌ いいえ | ❌ いいえ |

**Verified Creatorsを使用** - 本物の作成者であることを証明するため。
**[Autograph](/ja/smart-contracts/core/plugins/autograph)を使用** - ファンや有名人からのコレクタブル署名のため。

{% /callout %}

## 一般的なユースケース

- **チーム帰属**: デザイナー、開発者、創設者がそれぞれ関与を検証
- **共同制作者証明**: 複数のアーティストが作品への協力を検証
- **ブランド検証**: 公式ブランドアカウントがパートナーシップを検証
- **真正性証明**: オリジナルクリエイターがアセット作成を検証
- **履歴記録**: コレクション作成に関与した人を文書化

`update authority`が可能な操作:
- プラグインを追加
- クリエイター配列に未検証クリエイターを追加
- 未検証クリエイターを削除可能。検証済みクリエイターを削除するには、先に自己検証解除が必要
- 自己検証が可能

クリエイターを検証するには、更新権限によりクリエイター配列に追加された公開鍵が`updatePlugin`命令に署名する必要があります。

## 対応

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## 引数

`verifiedCreator`プラグインは`VerifiedCreatorsSignature`配列で以下の引数を必要とします：

| 引数    | 値        |
| ------- | --------- |
| address | publicKey |
| message | string    |

アセットはコレクションからCreators配列を継承します。

## アセットへAutographプラグインを追加するコード例

{% dialect-switcher title="MPL CoreアセットへVerified Creatorsプラグインを追加" %}
{% dialect title="JavaScript" id="js" %}

このスニペットは、umi identityがアセットの更新権限であると仮定しています。

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

## 別のクリエイターをアセットに追加するコード例

{% dialect-switcher title="MPL Coreアセットに別のクリエイターを追加" %}
{% dialect title="JavaScript" id="js" %}

このスニペットは、umi identityがアセットの更新権限で、未検証クリエイターを追加すると仮定しています。

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'


const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

const publicKeyToAdd = publicKey("abc...")

// 追加したい新しいAutograph
const newCreator = {
  address: publicKeyToAdd,
  verified: false,
}

// 既存の署名配列に新しいAutographを追加
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

未検証クリエイターを追加した後、`updatePlugin`関数を再度使用して自己検証できます。
このスニペットは、umi identityがクリエイターであると仮定しています。

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'


const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

const publicKeyToVerify = publicKey("abc...")

// 検証したいクリエイター
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

## アセットからクリエイターを削除するコード例

{% dialect-switcher title="MPL Coreアセットからクリエイターを削除" %}
{% dialect title="JavaScript" id="js" %}

クリエイターを削除できるのは更新権限のみです。クリエイターを削除するには、`verified:false`であるか、更新権限自身である必要があります。したがって、更新は2段階で行われます。更新権限とクリエイターの両方で同時に署名できる場合、両方の命令を組み合わせて1つのトランザクションで行えます。

1. `verified:false`に設定
このスニペットは、`umi.identity`が削除したいクリエイターであると仮定しています

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

// 削除したいクリエイターの公開鍵
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
  authority: umi.identity, // クリエイターである必要があります
}).sendAndConfirm(umi)
```

2. クリエイターを削除
このスニペットは、`umi.identity`が更新権限であると仮定しています

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

// 削除したいクリエイターの公開鍵
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
  authority: umi.identity, // 更新権限である必要があります
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## コレクションへVerified Creatorsプラグインを追加するコード例

{% dialect-switcher title="コレクションにVerified Creatorsプラグインを追加" %}
{% dialect title="JavaScript" id="js" %}
このスニペットは、`umi.identity`が更新権限であると仮定しています

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

## 一般的なエラー

### `Authority mismatch`

プラグインの追加または新しいクリエイターの追加は更新権限のみが行えます。クリエイター自身のみが自分の署名を検証できます。

### `Creator already verified`

クリエイターはすでに自己検証済みです。アクションは不要です。

### `Cannot remove verified creator`

検証済みクリエイターは、更新権限が削除する前に自己検証解除が必要です。

## 注意事項

- Verified Creatorsはロイヤリティ分配には使用されません（Royaltiesプラグインを使用）
- クリエイターは自己検証が必要—更新権限は代わりに検証できません
- クリエイターは削除前に検証解除が必要
- アセットはコレクションからクリエイター配列を継承

## クイックリファレンス

### 検証ワークフロー

| ステップ | アクション | 実行者 |
|------|--------|-----|
| 1 | 未検証クリエイターを追加 | 更新権限 |
| 2 | クリエイターを検証 | クリエイターが署名 |
| 3 | 検証解除（オプション） | クリエイターが署名 |
| 4 | 削除（オプション） | 更新権限 |

### 権限マトリックス

| アクション | 更新権限 | クリエイター |
|--------|------------------|---------|
| プラグイン追加 | ✅ | ❌ |
| 未検証クリエイター追加 | ✅ | ❌ |
| クリエイター検証 | ❌ | ✅（自分のみ） |
| クリエイター検証解除 | ❌ | ✅（自分のみ） |
| 未検証クリエイター削除 | ✅ | ❌ |

## FAQ

### Token Metadataクリエイター配列との違いは？

Token Metadataでは、クリエイター配列はロイヤリティ分配に使用されていました。Coreでは、Verified Creatorsは純粋に作成者であることの証明用です—ロイヤリティ分配にはRoyaltiesプラグインを使用してください。

### 更新権限がクリエイターを検証できますか？

いいえ。各クリエイターはトランザクションに署名して自己検証する必要があります。これにより本物の作成者証明が保証されます。

### 検証済みクリエイターを削除できないのはなぜ？

検証済みクリエイターを削除するには、先に自己検証解除が必要です。これにより検証済みクリエイターの不正削除を防ぎます。

### アセットは自動的にコレクションの検証済みクリエイターを取得しますか？

はい。アセットはコレクションからクリエイター配列を継承します。個々のアセットは異なるクリエイターを持つ独自のVerified Creatorsプラグインを持つこともできます。

### 共同制作者帰属に使用できますか？

はい。これは一般的なユースケースです—複数のクリエイター（デザイナー、開発者、アーティスト）がすべてアセットまたはコレクションの作成への関与を検証できます。

## 用語集

| 用語 | 定義 |
|------|------------|
| **Verified Creator** | 署名して関与を確認したクリエイター |
| **Unverified Creator** | 更新権限によって追加されたが、まだ確認されていないクリエイター |
| **Verification** | 本物の作成者であることを証明するためのクリエイター署名 |
| **Royalties Plugin** | ロイヤリティ分配用の別プラグイン（このプラグインではない） |
| **Creator Array** | アセット/コレクションに関連付けられたアドレスのリスト |

## 関連プラグイン

- [Autograph](/ja/smart-contracts/core/plugins/autograph) - 誰からでも（ファン、有名人）のコレクタブル署名
- [Royalties](/ja/smart-contracts/core/plugins/royalties) - ロイヤリティ分配の設定（検証済みクリエイターとは別）
- [ImmutableMetadata](/ja/smart-contracts/core/plugins/immutableMetadata) - メタデータを永久にロック

---

*Metaplex Foundation管理 · 2026年1月最終確認 · @metaplex-foundation/mpl-core対応*
