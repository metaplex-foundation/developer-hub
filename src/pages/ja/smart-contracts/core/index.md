---
title: 概要
metaTitle: Metaplex Core | Solana向け次世代NFT標準
description: Metaplex Coreは、シングルアカウント設計、強制ロイヤリティ、柔軟なプラグインシステムを備えたSolana上の次世代NFT標準です。低コスト、低コンピュート、高パフォーマンス。
updated: '01-31-2026'
keywords:
  - Metaplex Core
  - Solana NFT
  - NFT standard
  - single-account NFT
  - enforced royalties
  - mpl-core
about:
  - NFT standards
  - Solana blockchain
  - Digital assets
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
faqs:
  - q: Metaplex Coreとは何ですか？
    a: Metaplex Coreは、シングルアカウント設計による低コスト、強制ロイヤリティ、柔軟なプラグインシステムを特徴とするSolana上の次世代NFT標準です。新規NFTプロジェクトに推奨される標準です。
  - q: CoreはToken Metadataとどう違いますか？
    a: Coreはアセットごとに1アカウント（Token Metadataは3つ以上）を使用し、ミントコストが約80%削減され、コンピュート使用量が少なく、ロイヤリティ強制が組み込まれています。
  - q: Token MetadataからCoreに移行できますか？
    a: Core AssetとToken Metadata NFTは別々の標準です。自動移行はありません。新規プロジェクトはCoreを使用すべきで、既存のToken Metadataコレクションは引き続き機能します。
  - q: Coreはロイヤリティをサポートしていますか？
    a: はい。Coreにはデフォルトでロイヤリティを強制するRoyaltiesプラグインがあります。ベーシスポイント、クリエイター分配、マーケットプレイス向けの許可リスト/拒否リストルールを設定できます。
  - q: プラグインとは何ですか？
    a: プラグインは、Core AssetまたはCollectionに動作を追加するモジュラー拡張機能です。例としてFreeze Delegate、Attributes、Royaltiesがあります。
  - q: Core Assetのミントにはいくらかかりますか？
    a: アセットあたり約0.0029 SOLで、Token Metadataの約0.022 SOLと比較できます。これによりCoreはミントが約80%安くなります。
  - q: どのRPCプロバイダーがCoreをサポートしていますか？
    a: DAS（Digital Asset Standard）をサポートするすべての主要RPCプロバイダーがCore assetをインデックスしています。
  - q: ゲームアセットにCoreを使用できますか？
    a: はい。Coreのプラグインシステムは、オンチェーンステータス用のAttributes、アイテムロック用のFreeze Delegate、マーケットプレイス統合用のTransfer Delegateにより、ゲームに最適です。
---
Metaplex Core（「Core」）は、Solana上の**次世代NFT標準**です。**シングルアカウント設計**を使用し、代替手段と比較してミントコストを80%以上削減しながら、**強制ロイヤリティ**、**コレクションレベル操作**、およびカスタム動作のための**柔軟なプラグインシステム**を提供します。 {% .lead %}
{% callout title="学習内容" %}
この概要では以下を説明します：
- Metaplex Coreとは何か、なぜ存在するのか
- Token Metadataやその他の標準に対する主な利点
- コア概念：Asset、Collection、Plugin
- Coreでの開発を始める方法
{% /callout %}
## 概要
**Metaplex Core**は、ほとんどの新規プロジェクトでToken Metadataに代わるSolana NFT標準です。最低のミントコスト、強制ロイヤリティ、およびカスタム機能のためのプラグインアーキテクチャを提供します。
- シングルアカウント設計：ミントあたり約0.0029 SOL（Token Metadataの0.022 SOLに対して）
- デフォルトで強制ロイヤリティ、許可リスト/拒否リスト制御付き
- ステーキング、属性、デリゲート、カスタム動作のためのプラグインシステム
- コレクションレベル操作：すべてのアセットを一度にフリーズ、ロイヤリティ更新、または変更
## 対象外
この概要では、ファンジブルトークン（SPL Tokenを使用）、Token Metadata移行パス、または詳細なプラグイン実装は扱いません。それらのトピックについては特定のページを参照してください。
## クイックスタート
**ジャンプ先：** [はじめに](#次のステップ) · [主な利点](#紹介) · [FAQ](#faq) · [用語集](#用語集)
1. SDKをインストール: `npm install @metaplex-foundation/mpl-core`
2. Assetを作成: [Assetの作成ガイド](/ja/smart-contracts/core/create-asset)
3. プラグインを追加: [プラグイン概要](/ja/smart-contracts/core/plugins)
4. DASでクエリ: [Assetの取得](/ja/smart-contracts/core/fetch)
{% quick-links %}
{% quick-link title="はじめに" icon="InboxArrowDown" href="/ja/smart-contracts/core/sdk" description="お好みの言語またはライブラリを選択し、Solana上のデジタルアセットを始めましょう。" /%}
{% quick-link title="APIリファレンス" icon="CodeBracketSquare" href="https://mpl-core.typedoc.metaplex.com/" target="_blank" description="特定の内容をお探しですか？APIリファレンスをご覧ください。" /%}
{% quick-link title="Token Metadataとの違い" icon="AcademicCap" href="/ja/smart-contracts/core/tm-differences" description="Token Metadataからの移行ですか？変更点と新機能を確認してください。" /%}
{% quick-link title="UIでCoreを試す" icon="Beaker" href="https://core.metaplex.com/" target="_blank" description="Webインターフェースを使用してCore Assetをミントしてみましょう。" /%}
{% /quick-links %}
## 紹介
Metaplex Coreは、Solanaでの新規プロジェクトに推奨されるNFT標準です。Token Metadataやその他の標準と比較して、Coreは以下を提供します：
### コスト効率
| 標準 | ミントコスト | コンピュートユニット |
|----------|-----------|---------------|
| **Metaplex Core** | 約0.0029 SOL | 約17,000 CU |
| Token Metadata | 約0.022 SOL | 約205,000 CU |
| Token Extensions | 約0.0046 SOL | 約85,000 CU |
### 主な利点
- **シングルアカウント設計**：Coreは複数のアカウント（mint + metadata + token account）の代わりに、アセットごとに1つのアカウントを使用します。これによりコストが削減され、開発が簡素化されます。
- **強制ロイヤリティ**：[Royaltiesプラグイン](/ja/smart-contracts/core/plugins/royalties)は、許可リスト/拒否リスト制御付きでデフォルトでクリエイターロイヤリティを強制します。
- **コレクションレベル操作**：1つのトランザクションでコレクション全体のロイヤリティ更新、アセットのフリーズ、またはメタデータの変更が可能です。
- **プラグインアーキテクチャ**：プラグインを介してアセットにカスタム動作を追加：
  - [Freeze Delegate](/ja/smart-contracts/core/plugins/freeze-delegate) - 他者がフリーズ/解除可能
  - [Burn Delegate](/ja/smart-contracts/core/plugins/burn-delegate) - 他者がバーン可能
  - [Attributes](/ja/smart-contracts/core/plugins/attribute) - オンチェーンキー/バリューデータ（DASで自動インデックス）
  - [Transfer Delegate](/ja/smart-contracts/core/plugins/transfer-delegate) - 他者が転送可能
  - その他多数は[プラグインセクション](/ja/smart-contracts/core/plugins)をご覧ください
- **DASインデックス**：[DASをサポートする](/solana/rpcs-and-das)すべての主要RPCプロバイダーは、すでにCore assetをインデックスしています。
## コア概念
### Asset
**Asset**は、NFTを表す単一のオンチェーンアカウントです。Token Metadata（3つ以上のアカウントを使用）とは異なり、Core Assetは所有権、メタデータURI、およびプラグインデータを1つのアカウントに含みます。
参照：[Assetとは？](/ja/smart-contracts/core/what-is-an-asset)
### Collection
**Collection**は、関連するAssetをグループ化するCoreアカウントです。Collectionは、すべてのメンバーAssetに適用される独自のプラグインを持つことができます。例えば、コレクションレベルのロイヤリティは、オーバーライドされない限り、コレクション内のすべてのAssetに適用されます。
参照：[Collection](/ja/smart-contracts/core/collections)
### Plugin
**Plugin**は、AssetまたはCollectionに動作を追加するモジュラー拡張機能です。ライフサイクルイベント（作成、転送、バーン）にフックして、ルールを強制したりデータを保存したりします。
参照：[プラグイン概要](/ja/smart-contracts/core/plugins)
## クイックリファレンス
### プログラムID
| プログラム | アドレス |
|---------|---------|
| MPL Core | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
| MPL Core (Devnet) | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
### SDKパッケージ
| 言語 | パッケージ |
|----------|---------|
| JavaScript/TypeScript | `@metaplex-foundation/mpl-core` |
| Rust | `mpl-core` |
## 次のステップ
1. **SDKを選択**：[はじめに](/ja/smart-contracts/core/sdk)でJavaScriptまたはRust SDKをインストール
2. **最初のAssetを作成**：[Assetの作成](/ja/smart-contracts/core/create-asset)ガイドに従う
3. **プラグインを探索**：[プラグイン](/ja/smart-contracts/core/plugins)で利用可能な動作を確認
4. **Token Metadataから移行**：[Token Metadataとの違い](/ja/smart-contracts/core/tm-differences)を確認
{% callout %}
特定のCore命令にはプロトコル手数料が必要です。現在の情報については[プロトコル手数料](/protocol-fees)ページをご確認ください。
{% /callout %}
## FAQ
### Metaplex Coreとは何ですか？
Metaplex Coreは、シングルアカウント設計による低コスト、強制ロイヤリティ、柔軟なプラグインシステムを特徴とするSolana上の次世代NFT標準です。新規NFTプロジェクトに推奨される標準です。
### CoreはToken Metadataとどう違いますか？
Coreはアセットごとに1アカウント（Token Metadataは3つ以上）を使用し、ミントコストが約80%削減され、コンピュート使用量が少なく、ロイヤリティ強制が組み込まれています。Token Metadataは新規プロジェクトではレガシーと見なされています。詳細な比較については[Token Metadataとの違い](/ja/smart-contracts/core/tm-differences)をご覧ください。
### Token MetadataからCoreに移行できますか？
Core AssetとToken Metadata NFTは別々の標準です。自動移行はありません。新規プロジェクトはCoreを使用すべきで、既存のToken Metadataコレクションは引き続き機能します。
### Coreはロイヤリティをサポートしていますか？
はい。Coreにはデフォルトでロイヤリティを強制する[Royaltiesプラグイン](/ja/smart-contracts/core/plugins/royalties)があります。ベーシスポイント、クリエイター分配、マーケットプレイス向けの許可リスト/拒否リストルールを設定できます。
### プラグインとは何ですか？
プラグインは、Core AssetまたはCollectionに動作を追加するモジュラー拡張機能です。例としてFreeze Delegate（フリーズ許可）、Attributes（オンチェーンデータ）、Royalties（クリエイター支払い）があります。
### Core Assetのミントにはいくらかかりますか？
ベースアセットあたり約0.0029 SOLで、Token Metadataの約0.022 SOLと比較できます。これによりCoreはミントが約80%安くなります。詳細については[Token Metadataとの違い](/ja/smart-contracts/core/tm-differences)をご覧ください。
### どのRPCプロバイダーがCoreをサポートしていますか？
DAS（Digital Asset Standard）をサポートするすべての主要RPCプロバイダーがCore assetをインデックスしています。現在のリストについては[RPCプロバイダー](/solana/rpcs-and-das)をご覧ください。
### ゲームアセットにCoreを使用できますか？
はい。Coreのプラグインシステムは、オンチェーンステータス用のAttributes、アイテムロック用のFreeze Delegate、マーケットプレイス統合用のTransfer Delegateにより、ゲームに最適です。
## 用語集
| 用語 | 定義 |
|------|------------|
| **Asset** | 所有権、メタデータ、プラグインを持つNFTを表す単一のCoreオンチェーンアカウント |
| **Collection** | 関連するAssetをグループ化し、コレクション全体のプラグインを適用できるCoreアカウント |
| **Plugin** | AssetまたはCollectionに動作を追加するモジュラー拡張機能（ロイヤリティ、フリーズ、属性） |
| **DAS** | Digital Asset Standard - インデックスされたNFTデータをクエリするためのAPI仕様 |
| **ベーシスポイント** | パーセントの100分の1単位のロイヤリティ割合（500 = 5%） |
| **Delegate** | 所有せずにAssetに対して特定のアクションを実行する権限を持つアカウント |
| **CPI** | Cross-Program Invocation - 別のSolanaプログラムからCoreプログラムを呼び出すこと |
| **URI** | 名前、画像、属性を含むJSONファイルを指すオフチェーンメタデータURL |
