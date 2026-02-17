---
title: Genesis - Solanaトークンローンチパッド＆ローンチプラットフォーム
metaTitle: Genesis | Solanaトークンローンチパッド | ICO、IDO、Presale＆フェアローンチプラットフォーム | Metaplex
description: GenesisはICO、IDO、Presale、フェアローンチ、トークン生成イベント（TGE）に対応したSolanaトークンローンチパッドです。オンチェーンでのSPLトークン作成、クラウドセール、トークン配布プラットフォーム。
created: '01-15-2025'
updated: '01-31-2026'
keywords:
  - token launch
  - token launchpad
  - TGE
  - token generation event
  - fair launch
  - ICO
  - IDO
  - token sale
  - crowdsale
  - launch pool
  - presale
  - token sale platform
  - Solana token
  - SPL token
  - token distribution
  - token offering
about:
  - Token launches
  - Genesis protocol
  - Fair distribution
proficiencyLevel: Beginner
faqs:
  - q: Genesis とは何ですか？
    a: Genesis は Solana 上のトークン生成イベント（TGE）のための Metaplex スマートコントラクトです。Presale、Launch Pool、オークションのためのオンチェーンインフラを提供します。
  - q: Genesis はどのようなローンチメカニズムに対応していますか？
    a: Genesis は3つのメカニズムに対応しています。Presale（固定価格）、Launch Pool（価格発見を伴う比例配分）、Uniform Price Auction（入札ベースのクリアリング価格）です。
  - q: Genesis の利用にかかる費用はいくらですか？
    a: Genesis は入金に対して {% fee product="genesis" config="launchPool" fee="deposit" /%} のプロトコル手数料を徴収します。初期費用はかかりません。Solana のトランザクション手数料と調達資金に対するプロトコル手数料のみです。
  - q: ローンチ後にトークン権限を取り消すことはできますか？
    a: はい。Genesis はミント権限とフリーズ権限を取り消す命令を提供しており、追加のトークンが発行されないことを保有者に示すことができます。
  - q: Launch Pool と Presale の違いは何ですか？
    a: Presale は事前に固定価格が設定されます。Launch Pool は預入総額に基づいて価格が自然に決定されます。預入額が多いほど、トークンあたりの暗示価格が高くなります。
---

**Genesis** は、Solana トークンローンチパッドであり、**トークン生成イベント（TGE）**のためのスマートコントラクトです。ICO、IDO、プレセール、フェアローンチ、クラウドセールを、SPL トークンの作成、トークン配布、資金収集のためのオンチェーン調整機能で実行できます。 {% .lead %}

{% callout title="あなたに合ったパスを選択" %}
- **ノーコードでローンチしたい方は？** [Metaplex トークンローンチパッド](https://www.metaplex.com)を使えば、コーディング不要でトークンをローンチできます
- **独自のローンチパッドを構築したい方は？** Genesis SDK を使って、カスタムトークンローンチプラットフォームの構築や、独自のウェブサイトでのトークンセールの開催が可能です
- **Genesis が初めての方は？** [はじめに](/ja/smart-contracts/genesis/getting-started)から全体の流れを理解しましょう
- **構築する準備ができた方は？** [Launch Pool](/ja/smart-contracts/genesis/launch-pool) または [Presale](/ja/smart-contracts/genesis/presale) へ進みましょう
{% /callout %}

## Genesis とは？

Genesis は、Solana 上で SPL トークンをローンチするための分散型トークンローンチプラットフォームです。ICO、IDO、トークンプレセール、フェアローンチなど、Genesis は以下を処理します：

- **トークン作成** - メタデータ（名前、シンボル、画像）付き
- **資金収集** - 参加者からの入金（SOL の預入）
- **配布** - 選択したメカニズムに基づく分配
- **時間調整** - 預入期間と請求期間のウィンドウ管理

Genesis は、あなた（ローンチ主催者）と参加者の間に位置するトークンローンチパッドスマートコントラクトであり、公平で透明性のある自動化されたトークン配布を保証します。従来の ICO や IDO プラットフォームに代わる、モダンなオンチェーンソリューションです。

## ローンチメカニズム

Genesis は組み合わせ可能な3つのメカニズムに対応しています：

| メカニズム | 価格 | 配布方法 | 最適な用途 |
|-----------|------|---------|-----------|
| **[Launch Pool](/ja/smart-contracts/genesis/launch-pool)** | 終了時に決定 | 預入額に比例 | フェアローンチ、コミュニティトークン、クラウドセール |
| **[Presale](/ja/smart-contracts/genesis/presale)** | 事前に固定 | 先着順 | ICO、トークンセール、既知のバリュエーション |
| **[Uniform Price Auction](/ja/smart-contracts/genesis/uniform-price-auction)** | クリアリング価格 | 最高入札者が獲得 | IDO、大規模調達、機関投資家の関心 |

### どれを使うべきですか？

**Launch Pool** - 自然な価格発見と公平なトークン配布を求める場合。クラウドセールと同様に、預入した全員がシェアに応じてトークンを受け取ります。先行者に奪われることはありません。

**Presale** - バリュエーションが確定しており、予測可能な価格設定を求める場合。従来の ICO やトークンセールのように、固定価格を設定し、上限に達するまで参加者が購入できます。

**Auction** - 大口参加者による競争入札を求める場合。IDO スタイルのアプローチで、機関投資家の関心がある確立されたプロジェクトに最適です。

## 主要コンセプト

### Genesis Account

ローンチの中心的なコーディネーターです。Genesis Account を初期化すると、以下が行われます：

- メタデータ付きの SPL token を作成
- 総供給量をエスクローにミント
- 配布用 bucket を追加するための基盤を提供

### Bucket

トークンと資金の流れを定義するモジュラーコンポーネントです：

| タイプ | 目的 | 例 |
|-------|------|-----|
| **Inflow** | ユーザーから SOL を収集 | Launch Pool、Presale |
| **Outflow** | チーム/トレジャリーへの資金受取 | Unlocked Bucket |

### 時間条件

すべての bucket にはアクションを制御する時間ウィンドウがあります：

- **預入ウィンドウ** - ユーザーが SOL を預入できる期間
- **請求ウィンドウ** - ユーザーがトークンを請求できる期間

## プロトコル手数料

| アクション | 手数料 |
|-----------|--------|
| 預入 | 預入額の {% fee product="genesis" config="launchPool" fee="deposit" /%} |
| 引出 | 引出額の {% fee product="genesis" config="launchPool" fee="withdraw" /%} |
| 請求 | トランザクション手数料のみ |

初期費用はかかりません。調達資金に対する手数料のみをお支払いいただきます。

## プログラム情報

| ネットワーク | プログラム ID |
|-------------|--------------|
| Mainnet | `GENSkbxvLc7iBQvEAJv3Y5wVMHGD3RjfCNwWgU8Tqgkc` |
| Devnet | `GENSkbxvLc7iBQvEAJv3Y5wVMHGD3RjfCNwWgU8Tqgkc` |

## セキュリティ

ローンチ完了後、トークン権限を取り消して追加のトークンが発行されないことを示しましょう：

- **ミント権限** - 取り消すことで新規トークンの発行を防止
- **フリーズ権限** - 取り消すことでトークンの凍結を防止

権限管理の詳細については[はじめに](/ja/smart-contracts/genesis/getting-started)をご覧ください。

## FAQ

### Genesis とは何ですか？
Genesis は Solana 上のトークン生成イベント（TGE）のための Metaplex スマートコントラクトです。トークンの作成と配布を調整する Presale、Launch Pool、オークションのためのオンチェーンインフラを提供します。

### Genesis はどのようなローンチメカニズムに対応していますか？
Genesis は3つのメカニズムに対応しています：**Launch Pool**（価格発見を伴う比例配分）、**Presale**（固定価格）、**Uniform Price Auction**（入札ベースのクリアリング価格）。

### Genesis の利用にかかる費用はいくらですか？
Genesis は入金に対して {% fee product="genesis" config="launchPool" fee="deposit" /%} のプロトコル手数料を徴収します。初期費用はかかりません。Solana のトランザクション手数料と調達資金に対するプロトコル手数料のみです。

### ローンチ後にトークン権限を取り消すことはできますか？
はい。Genesis は `revokeMintAuthorityV2` および `revokeFreezeAuthorityV2` 命令を提供しており、権限を恒久的に取り消すことができます。

### Launch Pool と Presale の違いは何ですか？
**Presale** は事前に固定価格が設定されます。**Launch Pool** は価格が自然に決定されます。預入額が多いほどトークンあたりの暗示価格が高くなり、全参加者への比例配分が行われます。

### 複数のローンチメカニズムを組み合わせることはできますか？
はい。Genesis は bucket システムを採用しており、複数の Inflow bucket を追加し、トレジャリーやベスティング用の Outflow bucket を設定できます。

## 用語集

| 用語 | 定義 |
|------|------|
| **Genesis Account** | トークンを作成し、すべての bucket を管理する中心的なコーディネーター |
| **Bucket** | トークン/SOL の流れを定義するモジュラーコンポーネント |
| **Inflow Bucket** | ユーザーから SOL を収集する bucket |
| **Outflow Bucket** | エンドビヘイビアを通じて資金を受け取る bucket |
| **Launch Pool** | 終了時に価格が決定される預入ベースの配布方式 |
| **Presale** | 事前に決定された価格での固定価格販売 |
| **Quote Token** | ユーザーが預入するトークン（通常は wSOL） |
| **Base Token** | ローンチされ配布されるトークン |

## 次のステップ

1. **[はじめに](/ja/smart-contracts/genesis/getting-started)** - Genesis の全体フローを理解する
2. **[JavaScript SDK](/ja/smart-contracts/genesis/sdk/javascript)** - インストールとセットアップ
3. **[Launch Pool](/ja/smart-contracts/genesis/launch-pool)** - 比例配分ローンチを構築する
4. **[Presale](/ja/smart-contracts/genesis/presale)** - 固定価格販売を構築する
