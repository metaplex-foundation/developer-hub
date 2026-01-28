---
title: 外部プラグイン
metaTitle: 外部プラグイン | Metaplex Core
description: OracleとAppDataプラグインを使用してCore NFTを外部プログラムで拡張します。カスタム検証ロジックの追加とアセットへの任意データ保存が可能です。
---

**外部プラグイン**は、高度な機能のためにCore Assetsを外部プログラムに接続します。カスタム検証ロジックにはOracleプラグインを、サードパーティアプリが読み書きできる任意データの保存にはAppDataプラグインを使用します。 {% .lead %}

{% callout title="学習内容" %}

- 外部プラグインアーキテクチャを理解（アダプター + プラグイン）
- ライフサイクルチェックを設定（create、transfer、update、burn）
- 安全なデータ保存のためのData Authorityを設定
- OracleとAppDataプラグインの選択

{% /callout %}

## 概要

外部プラグインは、Core Assetsを外部プログラム機能で拡張します。アセット/コレクションに付与される**プラグインアダプター**と、データと検証を提供する**外部プラグイン**（Oracleアカウントまたはappdata保存）の2つの部分で構成されます。

- 権限管理プラグイン（更新権限が制御）
- ライフサイクル検証をサポート：承認、拒否、またはリッスン
- Data Authorityがプラグインデータの書き込みを制御
- アセットとコレクションで動作

## 対象外

内蔵プラグイン（[プラグイン概要](/ja/smart-contracts/core/plugins)を参照）、Oracleプログラムの作成（[Oracleガイド](/ja/smart-contracts/core/guides/oracle-plugin-example)を参照）、およびToken Metadata拡張。

## クイックスタート

**ジャンプ先:** [Oracleプラグイン](/ja/smart-contracts/core/external-plugins/oracle) · [AppDataプラグイン](/ja/smart-contracts/core/external-plugins/app-data) · [外部プラグインの追加](/ja/smart-contracts/core/external-plugins/adding-external-plugins)

1. プラグインタイプを選択：Oracle（検証）またはAppData（データ保存）
2. 外部アカウント（Oracle）を作成/デプロイまたはData Authority（AppData）を設定
3. アセットまたはコレクションにプラグインアダプターを追加

## 外部プラグインとは？

外部プラグインは[権限管理型](/ja/smart-contracts/core/plugins#authority-managed-plugins)で、**アダプター**と**プラグイン**の2要素で構成されます。**プラグインアダプター**はアセット/コレクションに割り当てられ、外部プラグインからデータと検証を受け取れます。外部プラグインは、**プラグインアダプター**にデータと検証を提供します。

## ライフサイクルチェック

各外部プラグインには、ライフサイクルイベントにチェックを割り当てる機能があり、実行中のライフサイクルイベントの動作に影響を与えます。利用可能なライフサイクルチェックは以下です：

- Create
- Transfer
- Update
- Burn

各ライフサイクルイベントには、以下のチェックを割り当てられます：

- Can Listen
- Can Reject
- Can Approve

### Can Listen

ライフサイクルイベントが発生したことをプラグインに通知するweb3タイプのwebhookです。データ追跡や発生したイベントに基づく別タスクの実行に役立ちます。

### Can Reject

プラグインがライフサイクルイベントのアクションを拒否できます。

### Can Approve

プラグインがライフサイクルイベントを承認できます。

## Data Authority

外部プラグインには、プロジェクトがそのプラグインにデータを安全に保存できるデータ領域がある場合があります。

外部プラグインのData Authorityのみが、外部プラグインのデータセクションへの書き込みを許可されます。プラグインの更新権限は、Data Authorityでもない限り権限を持ちません。

## プラグイン

### Oracleプラグイン

Oracleプラグインは、Web 2.0-3.0ワークフローのシンプルさを目的に設計されています。OracleプラグインはMPL Core Asset外部のオンチェーンOracleアカウントにアクセスでき、権限によって設定されたライフサイクルイベントの使用を拒否できます。外部Oracleアカウントはいつでも更新してライフサイクルイベントの認可動作を変更でき、動的な体験を実現します。

Oracleプラグインの詳細は[こちら](/ja/smart-contracts/core/external-plugins/oracle)をご覧ください。

### AppDataプラグイン

AppDataプラグインは、アセット上に安全でパーティション化されたデータストレージを提供します。各AppDataプラグインには、そのデータセクションへの書き込みを独占的に制御するData Authorityがあります。ユーザーデータ、ゲーム状態、またはアプリケーション固有のメタデータを保存するサードパーティアプリに便利です。

AppDataプラグインの詳細は[こちら](/ja/smart-contracts/core/external-plugins/app-data)をご覧ください。

## 外部プラグイン vs 内蔵プラグイン

| 機能 | 外部プラグイン | 内蔵プラグイン |
|---------|------------------|------------------|
| データ保存 | 外部アカウントまたはアセット上 | アセット上のみ |
| カスタム検証 | ✅ 完全制御 | ❌ 事前定義された動作 |
| 動的更新 | ✅ 外部アカウント更新 | ✅ プラグイン更新 |
| 複雑さ | 高い（外部プログラム） | 低い（内蔵） |
| ユースケース | カスタムロジック、サードパーティアプリ | 標準NFT機能 |

## FAQ

### 外部プラグイン vs 内蔵プラグインはいつ使うべき？

カスタム検証ロジック（Oracle）またはサードパーティデータ保存（AppData）が必要な場合は外部プラグインを使用します。フリーズ、ロイヤリティ、属性などの標準NFT機能には内蔵プラグインを使用します。

### 外部プラグインは転送を拒否できますか？

はい。Oracleプラグインは、外部アカウントの状態に基づいてライフサイクルイベント（create、transfer、update、burn）を拒否できます。これにより、時間ベースの制限、価格ベースのルール、またはカスタムロジックが可能になります。

### AppDataに書き込めるのは誰？

Data Authorityのみが AppDataプラグインに書き込めます。これはプラグイン権限とは別であり、サードパーティアプリケーションに安全でパーティション化されたストレージを提供します。

### 1つのアセットに複数の外部プラグインを持てますか？

はい。単一のアセットに複数のOracleまたはAppDataプラグインを追加でき、それぞれ異なる設定と権限を持つことができます。

### 外部プラグインはDASでインデックスされますか？

はい。JSONまたはMsgPackスキーマのAppDataは、簡単なクエリのためにDASによって自動的にインデックスされます。

## 用語集

| 用語 | 定義 |
|------|------------|
| **Plugin Adapter** | アセットに付与され外部プラグインに接続するオンチェーンコンポーネント |
| **External Plugin** | 機能を提供する外部アカウント（Oracle）またはデータストレージ（AppData） |
| **Lifecycle Check** | イベントを承認、拒否、またはリッスンできる検証 |
| **Data Authority** | AppDataへの排他的書き込み権限を持つアドレス |
| **Oracle Account** | 検証結果を保存する外部アカウント |

## 関連ページ

- [Oracleプラグイン](/ja/smart-contracts/core/external-plugins/oracle) - カスタム検証ロジック
- [AppDataプラグイン](/ja/smart-contracts/core/external-plugins/app-data) - サードパーティデータ保存
- [外部プラグインの追加](/ja/smart-contracts/core/external-plugins/adding-external-plugins) - コード例
- [内蔵プラグイン](/ja/smart-contracts/core/plugins) - 標準プラグイン機能

---

*Metaplex Foundation管理 · 2026年1月最終確認 · @metaplex-foundation/mpl-core対応*
