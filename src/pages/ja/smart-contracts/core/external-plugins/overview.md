---
title: 外部プラグイン
metaTitle: 外部プラグイン | Metaplex Core
description: OracleとAppDataプラグインを使用して、Core NFTを外部プログラムで拡張します。Assetsにカスタム検証ロジックを追加し、任意のデータを保存します。
updated: '01-31-2026'
keywords:
  - external plugins
  - Oracle plugin
  - AppData plugin
  - custom validation
about:
  - External integrations
  - Plugin adapters
  - Custom logic
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
  - Rust
faqs:
  - q: 外部プラグインと組み込みプラグインはいつ使い分けるべきですか？
    a: カスタム検証ロジック（Oracle）またはサードパーティのデータストレージ（AppData）が必要な場合は外部プラグインを使用します。フリーズ、ロイヤリティ、属性などの標準的なNFT機能には組み込みプラグインを使用します。
  - q: 外部プラグインは転送を拒否できますか？
    a: はい。Oracleプラグインは、外部アカウントの状態に基づいてライフサイクルイベント（作成、転送、更新、バーン）を拒否できます。これにより、時間ベースの制限、価格ベースのルール、またはその他のカスタムロジックが可能になります。
  - q: AppDataに書き込めるのは誰ですか？
    a: Data Authorityのみがappデータプラグインに書き込めます。これはプラグインauthorityとは別であり、サードパーティアプリケーション向けの安全でパーティション化されたストレージを提供します。
  - q: 1つのAssetに複数の外部プラグインを追加できますか？
    a: はい。1つのAssetに複数のOracleまたはAppDataプラグインを追加でき、それぞれ異なる構成とauthorityを持つことができます。
  - q: 外部プラグインはDASでインデックスされますか？
    a: はい。JSONまたはMsgPackスキーマを持つAppDataは、簡単なクエリのためにDASによって自動的にインデックスされます。
---
**外部プラグイン**は、Core Assetsを外部プログラムに接続して高度な機能を提供します。カスタム検証ロジックにはOracleプラグインを使用し、サードパーティアプリが読み書きできる任意のデータの保存にはAppDataプラグインを使用します。 {% .lead %}
{% callout title="学べること" %}

- 外部プラグインアーキテクチャ（アダプター + プラグイン）の理解
- ライフサイクルチェック（作成、転送、更新、バーン）の設定
- 安全なデータストレージのためのdata authorityの設定
- OracleとAppDataプラグインの選択
{% /callout %}

## 概要

外部プラグインは、外部プログラム機能でCore Assetsを拡張します。これらは2つの部分で構成されています：Asset/Collectionにアタッチされた**プラグインアダプター**と、データと検証を提供する**外部プラグイン**（Oracleアカウントまたはappデータストレージ）。

- Authority Managedプラグイン（update authorityが制御）
- ライフサイクル検証をサポート：承認、拒否、またはリッスン
- Data Authorityがプラグインデータの書き込みを制御
- AssetsとCollectionsで動作

## 対象外

組み込みプラグイン（[プラグイン概要](/smart-contracts/core/plugins)を参照）、Oracleプログラムの作成（[Oracleガイド](/smart-contracts/core/guides/oracle-plugin-example)を参照）、およびToken Metadata拡張機能。

## クイックスタート

**ジャンプ先:** [Oracleプラグイン](/smart-contracts/core/external-plugins/oracle) · [AppDataプラグイン](/smart-contracts/core/external-plugins/app-data) · [外部プラグインの追加](/smart-contracts/core/external-plugins/adding-external-plugins)

1. プラグインタイプを選択：Oracle（検証）またはAppData（データストレージ）
2. 外部アカウント（Oracle）を作成/デプロイするか、data authority（AppData）を設定
3. AssetまたはCollectionにプラグインアダプターを追加

## 外部プラグインとは？

外部プラグインは[Authority Managed](/smart-contracts/core/plugins#authority-managed-plugins)であり、2つの部分で構成されています：**アダプター**と**プラグイン**。**プラグインアダプター**はAssets/Collectionに割り当てられ、外部プラグインからデータと検証を渡すことができます。外部プラグインは**プラグインアダプター**にデータと検証を提供します。

## ライフサイクルチェック

各外部プラグインには、ライフサイクルイベントにライフサイクルチェックを割り当てる機能があり、実行しようとしているライフサイクルイベントの動作に影響を与えます。利用可能なライフサイクルチェックは次のとおりです：

- Create（作成）
- Transfer（転送）
- Update（更新）
- Burn（バーン）
各ライフサイクルイベントには、以下のチェックを割り当てることができます：
- Can Listen
- Can Reject
- Can Approve

### Can Listen

ライフサイクルイベントが発生したことをプラグインに通知するWeb3タイプのウェブフック。これは、発生したイベントに基づいてデータを追跡したり、別のタスクを実行したりするのに役立ちます。

### Can Reject

プラグインはライフサイクルイベントのアクションを拒否する機能を持ちます。

### Can Approve

プラグインはライフサイクルイベントを承認する機能を持ちます。

## Data Authority

外部プラグインには、プロジェクトがその特定のプラグインにデータを安全に保存できるデータ領域がある場合があります。
外部プラグインのData Authorityは、外部プラグインのデータセクションへの書き込みが許可される唯一のauthorityです。プラグインのUpdate Authorityは、Data Authorityでもない限り、書き込み権限を持ちません。

## プラグイン

### Oracleプラグイン

Oracleプラグインは、Web 2.0-3.0ワークフローでのシンプルさのために設計されています。Oracleプラグインは、MPL Core Assetの外部にあるオンチェーンOracleアカウントにアクセスでき、authorityによって設定されたライフサイクルイベントの使用を拒否できます。外部Oracleアカウントはいつでも更新でき、ライフサイクルイベントの承認動作を変更できるため、動的なエクスペリエンスが可能になります。
Oracleプラグインの詳細については[こちら](/smart-contracts/core/external-plugins/oracle)をご覧ください。

### AppDataプラグイン

AppDataプラグインは、Assetsに安全でパーティション化されたデータストレージを提供します。各AppDataプラグインには、そのデータセクションへの書き込みを排他的に制御するData Authorityがあります。ユーザーデータ、ゲーム状態、またはアプリケーション固有のメタデータを保存するサードパーティアプリに役立ちます。
AppDataプラグインの詳細については[こちら](/smart-contracts/core/external-plugins/app-data)をご覧ください。

## 外部プラグイン vs 組み込みプラグイン

| 機能 | 外部プラグイン | 組み込みプラグイン |
|---------|------------------|------------------|
| データストレージ | 外部アカウントまたはアセット上 | アセット上のみ |
| カスタム検証 | ✅ 完全な制御 | ❌ 事前定義された動作 |
| 動的更新 | ✅ 外部アカウントを更新 | ✅ プラグインを更新 |
| 複雑さ | 高い（外部プログラム） | 低い（組み込み） |
| ユースケース | カスタムロジック、サードパーティアプリ | 標準NFT機能 |

## FAQ

### 外部プラグインと組み込みプラグインはいつ使い分けるべきですか？

カスタム検証ロジック（Oracle）またはサードパーティのデータストレージ（AppData）が必要な場合は外部プラグインを使用します。フリーズ、ロイヤリティ、属性などの標準的なNFT機能には組み込みプラグインを使用します。

### 外部プラグインは転送を拒否できますか？

はい。Oracleプラグインは、外部アカウントの状態に基づいてライフサイクルイベント（作成、転送、更新、バーン）を拒否できます。これにより、時間ベースの制限、価格ベースのルール、またはその他のカスタムロジックが可能になります。

### AppDataに書き込めるのは誰ですか？

Data Authorityのみがappデータプラグインに書き込めます。これはプラグインauthorityとは別であり、サードパーティアプリケーション向けの安全でパーティション化されたストレージを提供します。

### 1つのAssetに複数の外部プラグインを追加できますか？

はい。1つのAssetに複数のOracleまたはAppDataプラグインを追加でき、それぞれ異なる構成とauthorityを持つことができます。

### 外部プラグインはDASでインデックスされますか？

はい。JSONまたはMsgPackスキーマを持つAppDataは、簡単なクエリのためにDASによって自動的にインデックスされます。

## 用語集

| 用語 | 定義 |
|------|------------|
| **プラグインアダプター** | 外部プラグインに接続するAssetにアタッチされたオンチェーンコンポーネント |
| **外部プラグイン** | 機能を提供する外部アカウント（Oracle）またはデータストレージ（AppData） |
| **ライフサイクルチェック** | イベントを承認、拒否、またはリッスンできる検証 |
| **Data Authority** | AppDataへの排他的書き込み権限を持つアドレス |
| **Oracleアカウント** | 検証結果を保存する外部アカウント |

## 関連ページ

- [Oracleプラグイン](/smart-contracts/core/external-plugins/oracle) - カスタム検証ロジック
- [AppDataプラグイン](/smart-contracts/core/external-plugins/app-data) - サードパーティデータストレージ
- [外部プラグインの追加](/smart-contracts/core/external-plugins/adding-external-plugins) - コード例
- [組み込みプラグイン](/smart-contracts/core/plugins) - 標準プラグイン機能
