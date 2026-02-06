---
title: CoreとToken Metadataの違い
metaTitle: Core vs Token Metadata | Metaplex Core
description: Metaplex CoreとToken Metadata NFT標準を比較します。何が変わったか、何が新しいか、TMからCoreへのメンタルモデルの移行方法を学びます。
updated: '01-31-2026'
keywords:
  - Core vs Token Metadata
  - NFT standard comparison
  - migrate from Token Metadata
  - mpl-core differences
  - NFT migration
about:
  - NFT standards comparison
  - Token Metadata migration
  - Core advantages
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 新規プロジェクトにはCoreとToken Metadataのどちらを使うべきですか？
    a: すべての新規プロジェクトにはCoreを使用してください。より安価で、シンプルで、機能が優れています。NFT用のToken Metadataはレガシーです。
  - q: 既存のTM NFTをCoreに移行できますか？
    a: 自動的にはできません。Core Assetは異なるオンチェーンアカウントです。移行にはTM NFTのバーンと新しいCore Assetのミントが必要です。
  - q: pNFTはどうなりましたか？
    a: Coreのロイヤリティ強制は、許可リスト/拒否リストをサポートするRoyaltiesプラグインを通じて組み込まれています。別のプログラマブルバリアントは必要ありません。
  - q: Associated Token Accountはまだ必要ですか？
    a: いいえ。Core AssetはATAを使用しません。所有権はAssetアカウントに直接保存されます。
  - q: Coreでクリエイターを検証するにはどうすればいいですか？
    a: Verified Creatorsプラグインを使用します。TMのcreator配列と同様に機能しますが、オプトインです。
---
**Token Metadata**から来ましたか？このガイドでは、Coreの違い、なぜ優れているか、TMの知識をCoreの概念に変換する方法を説明します。 {% .lead %}
{% callout title="主な違い" %}

- **シングルアカウント** vs 3以上のアカウント（mint、metadata、token account）
- **80%低コスト**: ミントあたり約0.0037 SOL vs 0.022 SOL
- デリゲートとフリーズ権限の代わりに**プラグイン**
- コレクションレベルの操作を持つ**ファーストクラスのCollection**
- **Associated Token Account不要**
{% /callout %}

## 概要

CoreはToken Metadataのマルチアカウントモデルをシングルアカウント設計に置き換えます。すべてがシンプルになりました：作成、フリーズ、デリゲート、コレクション管理。プラグインシステムは、TMの散在したデリゲートタイプを統一された拡張可能なアーキテクチャに置き換えます。

| 機能 | Token Metadata | Core |
|---------|---------------|------|
| NFTあたりのアカウント数 | 3以上（mint、metadata、ATA） | 1 |
| ミントコスト | 約0.022 SOL | 約0.0037 SOL |
| フリーズメカニズム | デリゲート + フリーズ権限 | Freeze Delegateプラグイン |
| ロイヤリティ | 資産ごとの更新 | 柔軟：コレクションまたは資産レベル |
| オンチェーン属性 | ❌ | ✅ Attributesプラグイン |

## 範囲外

pNFT固有の機能と代替可能トークンの処理（SPL Tokenを使用）。

## クイックスタート

**ジャンプ先：** [コスト比較](#difference-overview) · [Collections](#collections) · [Freeze/Lock](#freeze--lock) · [ライフサイクルイベント](#lifecycle-events-and-plugins)
新しく始める場合はCoreを使用してください。移行する場合、主要なメンタルシフトは：

1. 3つではなく1つのアカウント
2. デリゲートではなくプラグイン
3. コレクションレベルの操作がネイティブ

## 違いの概要

- **前例のないコスト効率**: Metaplex Coreは、利用可能な代替手段と比較して最も低いミントコストを提供します。例えば、Token Metadataで0.022 SOLかかるNFTは、Coreで0.0037 SOLでミントできます。
- **改善された開発者体験**: ほとんどのデジタル資産は代替可能トークンプログラム全体を維持するために必要なデータを継承しますが、CoreはNFT用に最適化されており、すべての重要なデータを単一のSolanaアカウントに保存できます。これにより開発者の複雑さが劇的に減少し、Solana全体のネットワークパフォーマンスの向上にも貢献します。
- **強化されたコレクション管理**: コレクションのファーストクラスサポートにより、開発者とクリエイターはロイヤリティやプラグインなどのコレクションレベルの設定を簡単に管理でき、個々のNFTに対して独自にオーバーライドできます。これは単一のトランザクションで行え、コレクション管理コストとSolanaトランザクション手数料を削減します。
- **高度なプラグインサポート**: 組み込みのステーキングから資産ベースのポイントシステムまで、Metaplex Coreのプラグインアーキテクチャは広大なユーティリティとカスタマイズの可能性を開きます。プラグインにより、開発者は作成、転送、バーンなどの任意の資産ライフサイクルイベントにフックしてカスタム動作を追加できます。
- **互換性とサポート**: Metaplex Developer Platformで完全にサポートされており、CoreはSDKスイートと今後のプログラムとシームレスに統合され、Metaplexエコシステムを豊かにします。
- **すぐに使えるインデックス**: Metaplex Digital Asset Standard API（DAS API）を拡張し、Core資産は自動的にインデックス化され、すべてのSolana NFTに使用される共通インターフェースを通じてアプリケーション開発者に提供されます。しかし、独自の改善点として、Coreのattributeプラグインにより、開発者はオンチェーンデータを追加でき、それも自動的にインデックス化されるようになりました。

## 技術概要

### 作成

Core Assetを作成するには、単一のcreate命令のみが必要です。Token Metadataで必要だったように、後でミントしてメタデータを添付する必要はありません。これにより複雑さとトランザクションサイズが削減されます。
{% totem %}
{% totem-accordion title="作成" %}
以下のスニペットは、資産データを既にアップロードしていることを前提としています。

```js
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { create } from '@metaplex-foundation/mpl-core'
const assetAddress = generateSigner(umi)
const result = createV1(umi, {
  asset: assetAddress,
  name: 'My Nft',
  uri: 'https://example.com/my-nft',
}).sendAndConfirm(umi)
```

{% /totem-accordion %}
{% /totem %}

### Collections

Core Collectionsには複数の新機能が含まれています。Collectionsは独自のアカウントタイプになり、通常のAssetとは区別されます。これは、Token Metadataが同じアカウントと状態を使用してNFTとCollectionの両方を表現し、両者を区別しにくくしていたアプローチからの歓迎すべき追加です。
Coreでは、Collectionsは追加機能を可能にする**ファーストクラスの資産**です。例えば、CoreはCollectionにRoyalties Pluginを追加することでコレクションレベルのロイヤリティ調整を提供します。開発者とクリエイターは、各資産を個別に更新するのではなく、コレクション内のすべての資産を一度に更新できるようになりました。コレクション内の一部の資産に異なるロイヤリティ設定が必要な場合はどうしますか？問題ありません。同じプラグインを資産に追加するだけで、コレクションレベルのロイヤリティプラグインが上書きされます。
TMでは不可能だったコレクション機能の例として、コレクションレベルのロイヤリティがあります。ロイヤリティやクリエイターを変更する際に各資産を更新する必要がなくなり、コレクションで定義できます。これはCollectionに[Royalties Plugin](/ja/smart-contracts/core/plugins/royalties)を追加することで行えます。一部の資産に異なるロイヤリティ設定が必要ですか？同じプラグインを資産に追加するだけで、コレクションレベルのロイヤリティプラグインが上書きされます。
コレクションレベルでのフリーズも可能です。
コレクションの作成や更新などの処理に関する詳細は、[Managing Collections](/ja/smart-contracts/core/collections)ページで確認できます。

### ライフサイクルイベントとプラグイン

Assetのライフサイクル中に複数のイベントがトリガーされます：

- 作成
- 転送
- 更新
- バーン
- プラグインの追加
- 権限プラグインの承認
- 権限プラグインの削除
TMでは、これらのライフサイクルイベントは所有者またはデリゲートによって実行されます。すべてのTM Asset（nfts/pNfts）には、すべてのライフサイクルイベント用の関数が含まれています。Coreでは、これらのイベントはAssetまたはCollection全体のレベルで[Plugins](/ja/smart-contracts/core/plugins)によって処理されます。
AssetレベルまたはCollectionレベルの両方に添付されたプラグインは、これらのライフサイクルイベント中に検証プロセスを経て、実行を`approve`、`reject`、または`force approve`します。

### Freeze / Lock

TMで資産をフリーズするには、通常最初にフリーズ権限を別のウォレットにデリゲートし、そのウォレットがNFTをフリーズします。Coreでは、2つのプラグインのいずれかを使用する必要があります：`Freeze Delegate`または`Permanent Freeze Delegate`。後者はAsset作成時にのみ追加でき、`Freeze Delegate`プラグインは現在の所有者がトランザクションに署名する限り、いつでも[追加](/ja/smart-contracts/core/plugins/adding-plugins)できます。
Coreではデリゲートも簡単です。Delegate Recordアカウントを廃止し、デリゲート権限をプラグイン自体に直接保存し、Asset作成時または`addPluginV1`関数を介してAssetにプラグインを追加する時点で割り当て可能です。
資産にまだフリーズプラグインがない場合に所有者がフリーズ権限を別のアカウントに割り当てるには、その権限でプラグインを追加してフリーズする必要があります。
以下は、`Freeze Delegate`プラグインをAssetに追加しながら、デリゲート権限に割り当てる簡単な例です。
{% totem %}
{% totem-accordion title="Freezeプラグインの追加、権限の割り当て、フリーズ" %}

```js
await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: createPlugin('FreezeDelegate', { frozen: true }),
  initAuthority: pluginAuthority('Address', { address: delegate.publicKey }),
}).sendAndConfirm(umi)
```

{% /totem-accordion %}
{% /totem %}
さらにCoreでは、**コレクションレベル**でのフリーズが可能です。コレクション全体を1つのトランザクションでフリーズまたは解凍できます。

### Asset状態

TMでは、Assetの現在の状態（フリーズ、ロック、または転送可能な状態かどうか）を確認するために複数のアカウントをチェックする必要があることがよくあります。Coreでは、この状態はAssetアカウントに保存されますが、Collectionアカウントの影響も受ける可能性があります。
物事を簡単にするために、`@metaplex-foundation/mpl-core`パッケージに含まれる`canBurn`、`canTransfer`、`canUpdate`などのライフサイクルヘルパーを導入しました。これらのヘルパーは、渡されたアドレスがこれらのライフサイクルイベントを実行する権限を持っているかどうかを知らせる`boolean`値を返します。

```js
const burningAllowed = canBurn(authority, asset, collection)
```

## クイックリファレンス

### TM概念 → Core同等物

| Token Metadata | Core同等物 |
|----------------|-----------------|
| Mintアカウント | Assetアカウント |
| Metadataアカウント | Assetアカウント（統合） |
| Associated Token Account | 不要 |
| フリーズ権限 | Freeze Delegateプラグイン |
| Update authority | Update authority（同じ） |
| デリゲート | Transfer/Burn/Update Delegateプラグイン |
| Collection verified | Collectionメンバーシップ（自動） |
| Creators配列 | Verified Creatorsプラグイン |
| Uses/utility | プラグイン（カスタムロジック） |

### 一般的な操作

| 操作 | Token Metadata | Core |
|-----------|---------------|------|
| NFT作成 | `createV1()`（複数アカウント） | `create()`（単一アカウント） |
| フリーズ | デリゲートしてからフリーズ | Freeze Delegateプラグインを追加 |
| メタデータ更新 | `updateV1()` | `update()` |
| 転送 | SPL Token転送 | `transfer()` |
| バーン | `burnV1()` | `burn()` |

## FAQ

### 新規プロジェクトにはCoreとToken Metadataのどちらを使うべきですか？

すべての新規プロジェクトにはCoreを使用してください。より安価で、シンプルで、機能が優れています。NFT用のToken Metadataはレガシーです。

### 既存のTM NFTをCoreに移行できますか？

自動的にはできません。Core Assetは異なるオンチェーンアカウントです。移行にはTM NFTのバーンと新しいCore Assetのミントが必要です。

### pNFTはどうなりましたか？

Coreのロイヤリティ強制は、許可リスト/拒否リストをサポートするRoyaltiesプラグインを通じて組み込まれています。別の「プログラマブル」バリアントは必要ありません。

### Associated Token Accountはまだ必要ですか？

いいえ。Core AssetはATAを使用しません。所有権はAssetアカウントに直接保存されます。

### Coreでクリエイターを検証するにはどうすればいいですか？

[Verified Creatorsプラグイン](/ja/smart-contracts/core/plugins/verified-creators)を使用します。TMのcreator配列と同様に機能しますが、オプトインです。

## 関連ドキュメント

上記の機能は氷山の一角にすぎません。追加の興味深いトピックには以下が含まれます：

- [コレクション管理](/ja/smart-contracts/core/collections)
- [プラグイン概要](/ja/smart-contracts/core/plugins)
- [Attributes Plugin](/ja/smart-contracts/core/plugins/attribute)を使用したオンチェーンデータの追加
- [Assetの作成](/ja/smart-contracts/core/create-asset)

## 用語集

| 用語 | 定義 |
|------|------------|
| **Token Metadata (TM)** | 複数のアカウントを使用するレガシーMetaplex NFT標準 |
| **Core** | シングルアカウント設計の新しいMetaplex NFT標準 |
| **Plugin** | Core Assetに追加されるモジュラー機能 |
| **ATA** | Associated Token Account（Coreでは不要） |
| **pNFT** | TMのプログラマブルNFT（ロイヤリティ強制はCoreに組み込み） |
