---
title: 概要
metaTitle: Metaplex Core | Solana向け次世代NFT標準
description: Metaplex Coreは、シングルアカウント設計、強制ロイヤリティ、柔軟なプラグインシステムを備えたSolana上の次世代NFT標準です。低コスト、低コンピュート、高パフォーマンス。
---

Metaplex Core（「Core」）は、Solana上の**次世代NFT標準**です。**シングルアカウント設計**を使用し、代替手段と比較してミント費用を80%以上削減しながら、**強制ロイヤリティ**、**コレクションレベル操作**、およびカスタム動作のための**柔軟なプラグインシステム**を提供します。 {% .lead %}

{% callout title="このページで学ぶこと" %}

この概要では以下を説明します：
- Metaplex Coreとは何か、なぜ存在するのか
- Token Metadataやその他の標準に対する主な利点
- 核心概念：アセット、コレクション、プラグイン
- Coreでの開発を始める方法

{% /callout %}

## 概要

**Metaplex Core**は、ほとんどの新規プロジェクトでToken Metadataに代わるSolana NFT標準です。最低のミント費用、強制ロイヤリティ、およびカスタム機能のためのプラグインアーキテクチャを提供します。

- シングルアカウント設計：ミントあたり約0.0029 SOL（Token Metadataの0.022 SOLに対して）
- デフォルトで強制ロイヤリティ、許可リスト/拒否リスト制御付き
- ステーキング、属性、デリゲート、カスタム動作のためのプラグインシステム
- コレクションレベル操作：すべてのアセットを一度にフリーズ、ロイヤリティ更新、または変更

## 対象外

この概要では、ファンジブルトークン（SPL Tokenを使用）、Token Metadata移行パス、または詳細なプラグイン実装は扱いません。それらのトピックについては特定のページを参照してください。

## クイックスタート

**ジャンプ先:** [はじめに](#次のステップ) · [主な利点](#紹介) · [FAQ](#faq) · [用語集](#用語集)

1. SDKをインストール: `npm install @metaplex-foundation/mpl-core`
2. アセットを作成: [アセット作成ガイド](/ja/smart-contracts/core/create-asset)
3. プラグインを追加: [プラグイン概要](/ja/smart-contracts/core/plugins)
4. DASでクエリ: [アセットの取得](/ja/smart-contracts/core/fetch)

{% quick-links %}

{% quick-link title="はじめに" icon="InboxArrowDown" href="/ja/smart-contracts/core/sdk" description="お好みの言語またはライブラリを選択し、Solana上のデジタルアセットを始めましょう。" /%}

{% quick-link title="APIリファレンス" icon="CodeBracketSquare" href="https://mpl-core.typedoc.metaplex.com/" target="_blank" description="特定の内容をお探しですか？APIリファレンスをご覧ください。" /%}

{% quick-link title="Token Metadataとの違い" icon="AcademicCap" href="/ja/smart-contracts/core/tm-differences" description="Token Metadataからの移行ですか？変更点と新機能を確認してください。" /%}

{% quick-link title="UIでCoreを試す" icon="Beaker" href="https://core.metaplex.com/" target="_blank" description="Webインターフェースを使用してCore Assetを自分でミントしてみましょう。" /%}

{% /quick-links %}

## 紹介

Metaplex Coreは、Solana上の新規プロジェクトに推奨されるNFT標準です。Token Metadataやその他の標準と比較して、Coreは以下を提供します：

### 費用効率

| 標準 | ミント費用 | コンピュートユニット |
|----------|-----------|---------------|
| **Metaplex Core** | 約0.0029 SOL | 約17,000 CU |
| Token Metadata | 約0.022 SOL | 約205,000 CU |
| Token Extensions | 約0.0046 SOL | 約85,000 CU |

### 主な利点

- **シングルアカウント設計**: Coreは複数のアカウント（ミント + メタデータ + トークンアカウント）の代わりに、アセットごとに1つのアカウントを使用します。これにより費用が削減され、開発が簡素化されます。

- **強制ロイヤリティ**: [ロイヤリティプラグイン](/ja/smart-contracts/core/plugins/royalties)は、許可リスト/拒否リスト制御付きでクリエイターロイヤリティをデフォルトで強制します。

- **コレクションレベル操作**: 単一のトランザクションでコレクション全体のロイヤリティを更新、アセットをフリーズ、またはメタデータを変更できます。

- **プラグインアーキテクチャ**: プラグインを介してアセットにカスタム動作を追加できます：
  - [フリーズデリゲート](/ja/smart-contracts/core/plugins/freeze-delegate) - 他者がフリーズ/解除を許可
  - [バーンデリゲート](/ja/smart-contracts/core/plugins/burn-delegate) - 他者がバーンを許可
  - [属性](/ja/smart-contracts/core/plugins/attribute) - オンチェーンキー/バリューデータ（DASにより自動インデックス）
  - [転送デリゲート](/ja/smart-contracts/core/plugins/transfer-delegate) - 他者が転送を許可
  - その他多数は[プラグインセクション](/ja/smart-contracts/core/plugins)をご覧ください

- **DASインデックス**: [DASをサポートするRPCプロバイダー](/ja/rpc-providers)はすべてCore Assetをインデックスしています。

## 核心概念

### アセット

**アセット**はNFTを表す単一のオンチェーンアカウントです。Token Metadata（3つ以上のアカウントを使用）とは異なり、Core Assetは所有権、メタデータURI、プラグインデータを1つのアカウントに含みます。

参照: [アセットとは？](/ja/smart-contracts/core/what-is-an-asset)

### コレクション

**コレクション**は関連するアセットをグループ化するCoreアカウントです。コレクションは、すべてのメンバーアセットに適用される独自のプラグインを持つことができます。例えば、コレクションレベルのロイヤリティは、オーバーライドされない限り、コレクション内のすべてのアセットに適用されます。

参照: [コレクション](/ja/smart-contracts/core/collections)

### プラグイン

**プラグイン**はアセットまたはコレクションに動作を追加するモジュラー拡張機能です。ライフサイクルイベント（作成、転送、バーン）にフックして、ルールを強制したりデータを保存したりします。

参照: [プラグイン概要](/ja/smart-contracts/core/plugins)

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

1. **SDKを選択**: [はじめに](/ja/smart-contracts/core/sdk)にアクセスしてJavaScriptまたはRust SDKをインストール
2. **最初のアセットを作成**: [アセット作成](/ja/smart-contracts/core/create-asset)ガイドに従う
3. **プラグインを探索**: [プラグイン](/ja/smart-contracts/core/plugins)で利用可能な動作を確認
4. **Token Metadataからの移行**: [Token Metadataとの違い](/ja/smart-contracts/core/tm-differences)を確認

{% callout %}
特定のCore命令にはプロトコル手数料が必要な場合があります。現在の情報については[プロトコル手数料](/ja/protocol-fees)ページを確認してください。
{% /callout %}

## FAQ

### Metaplex Coreとは何ですか？

Metaplex Coreは、シングルアカウント設計による低コスト、強制ロイヤリティ、柔軟なプラグインシステムを備えたSolana上の次世代NFT標準です。新しいNFTプロジェクトに推奨される標準です。

### CoreはToken Metadataとどう違いますか？

Coreはアセットごとに1つのアカウントを使用（Token Metadataの3つ以上に対して）、ミント費用が約80%安く、コンピュート使用量が少なく、組み込みのロイヤリティ強制があります。Token Metadataは新規プロジェクトではレガシーと見なされています。

### Token MetadataからCoreに移行できますか？

Core AssetとToken Metadata NFTは別々の標準です。自動移行はありません。新しいプロジェクトはCoreを使用し、既存のToken Metadataコレクションは引き続き機能します。

### Coreはロイヤリティをサポートしていますか？

はい。Coreにはデフォルトでロイヤリティを強制する[ロイヤリティプラグイン](/ja/smart-contracts/core/plugins/royalties)があります。基本ポイント、クリエイター分配、マーケットプレイス用の許可リスト/拒否リストルールを設定できます。

### プラグインとは何ですか？

プラグインはCore Assetまたはコレクションに動作を追加するモジュラー拡張機能です。例として、フリーズデリゲート（フリーズを許可）、属性（オンチェーンデータ）、ロイヤリティ（クリエイター支払い）があります。

### Core Assetをミントするのにいくらかかりますか？

アセットあたり約0.0029 SOL、Token Metadataの約0.022 SOLと比較して。これによりCoreはミントが約80%安くなります。

### どのRPCプロバイダーがCoreをサポートしていますか？

DAS（Digital Asset Standard）をサポートするすべての主要RPCプロバイダーがCore Assetをインデックスしています。現在のリストは[RPCプロバイダー](/ja/rpc-providers)を参照してください。

### Coreをゲームアセットに使用できますか？

はい。Coreのプラグインシステムはゲームに最適です：オンチェーンステータスには属性を、アイテムのロックにはフリーズデリゲートを、マーケットプレイス統合には転送デリゲートを使用できます。

## 用語集

| 用語 | 定義 |
|------|------------|
| **アセット** | 所有権、メタデータ、プラグインを持つNFTを表す単一のCoreオンチェーンアカウント |
| **コレクション** | 関連するアセットをグループ化し、コレクション全体のプラグインを適用できるCoreアカウント |
| **プラグイン** | アセットまたはコレクションに動作を追加するモジュラー拡張（ロイヤリティ、フリーズ、属性） |
| **DAS** | Digital Asset Standard - インデックスされたNFTデータをクエリするためのAPI仕様 |
| **基本ポイント** | パーセントの100分の1単位のロイヤリティパーセンテージ（500 = 5%） |
| **デリゲート** | 所有せずにアセットに対して特定のアクションを実行する権限を持つアカウント |
| **CPI** | Cross-Program Invocation - 別のSolanaプログラムからCoreプログラムを呼び出すこと |
| **URI** | 名前、画像、属性を含むJSONファイルを指すオフチェーンメタデータURL |

---

*Metaplex Foundation管理 · 最終確認: 2026年1月 · mpl-core 0.x対応*
