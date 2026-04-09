---
title: プログラムとオペレーション
metaTitle: プログラムとオペレーション | Metaplex スキル
description: Metaplex Skillがカバーするプログラムとオペレーションの詳細な内訳。
created: '02-23-2026'
updated: '04-08-2026'
keywords:
  - Core
  - Token Metadata
  - Bubblegum
  - Candy Machine
  - Genesis
  - mplx CLI
  - Umi SDK
  - Kit SDK
about:
  - Metaplex programs
  - CLI operations
  - SDK operations
proficiencyLevel: Beginner
---

Metaplex SkillはCLI、Umi SDK、Kit SDKにまたがる5つのプログラムをカバーします。このページでは、各プログラムがサポートする内容と使い分けの詳細を提供します。{% .lead %}

## 概要

Metaplex Skillは、CLI、Umi SDK、Kit SDKにまたがる5つのMetaplexプログラムとそのツーリングに関する知識をAIエージェントに提供します。

- 5つのプログラム（Core、Token Metadata、Bubblegum、Candy Machine、Genesis）すべてがCLIとUmi SDKをサポート
- Kit SDKはToken Metadataのみ対応
- `mplx` CLIはコード不要でほとんどのオペレーションを処理
- このページでタスクに合ったプログラムとツーリングアプローチを判断

## プログラムカバレッジ

| プログラム | CLI | Umi SDK | Kit SDK |
|---------|-----|---------|---------|
| **Core** | Yes | Yes | — |
| **Token Metadata** | Yes | Yes | Yes |
| **Bubblegum** | Yes | Yes | — |
| **Candy Machine** | Yes | Yes | — |
| **Genesis** | Yes | Yes | — |

## Core

Solanaの次世代NFT標準。Core NFTはToken Metadata NFTよりも大幅に安価で、ロイヤリティ強制、フリーズデリゲート、属性などのプラグインシステムをサポートします。

**CLI** (`mplx core`)：コレクションとアセットの作成・更新、プラグイン管理。

**Umi SDK**：オーナー/コレクション/クリエイターによる取得、プラグイン設定、デリゲート管理を含む完全なプログラムアクセス。

## Token Metadata

オリジナルのMetaplex NFT標準。ファンジブルトークン、NFT、プログラマブルNFT（pNFT）、エディションをサポートします。

**CLI** (`mplx tm`)：ファンジブルトークン、NFT、pNFT、エディションの作成。アセットの転送とバーン。

**Umi SDK**：すべてのToken Metadataオペレーションへの完全なプログラムアクセス。

**Kit SDK**：最小限の依存関係で`@solana/kit`を使用したToken Metadataオペレーション。Umiフレームワークを避けたい場合に便利です。

## Bubblegum（圧縮NFT）

状態圧縮のためのMerkleツリーを使用して大規模にNFTを作成。圧縮NFTは初回のツリー作成後、従来のNFTのほんの一部のコストで済みます。

**CLI** (`mplx bg`)：Merkleツリーの作成、cNFTのミント（バッチ上限約100）、取得、更新、転送、バーン。

**Umi SDK**：完全なプログラムアクセス。約100を超えるバッチやDAS APIクエリにはSDKを使用。

{% callout type="note" %}
圧縮NFTオペレーションにはDAS対応RPCエンドポイントが必要です。標準のSolana RPCエンドポイントはcNFTオペレーションに必要なDigital Asset Standard APIをサポートしていません。
{% /callout %}

## Candy Machine

設定可能なミントルール（ガード）でNFTドロップをデプロイ。ガードは誰がミントできるか、いつ、いくらで、何個までかを制御します。

**CLI** (`mplx cm`)：Candy Machineの設定、アイテム挿入、デプロイ。ミントにはSDKが必要。

**Umi SDK**：ミントオペレーションとガード設定を含む完全なプログラムアクセス。

## Genesis

公平な配布とRaydiumへの自動流動性グラデュエーションを備えたトークンローンチプロトコル。2つのローンチタイプをサポート：**ローンチプール**（48時間のデポジットウィンドウと比例配分）と**ボンディングカーブ**（即時取引とRaydium CPMM自動グラデュエーション）。

**CLI** (`mplx genesis`)：トークンローンチの作成と管理。`genesis launch create`コマンドはローンチプールとボンディングカーブの両方に対応したオールインワンAPIフローを提供します — `--agentMint`による[エージェント統合](/agents/mint-agent)もオプションで利用可能。

**Umi SDK**：ボンディングカーブ設定とエージェントトークンリンクを含む、トークンローンチの作成と管理のための完全なプログラムアクセス。

## CLI機能

`mplx` CLIはコード不要でほとんどのMetaplexオペレーションを直接処理できます：

| タスク | CLIサポート |
|------|-------------|
| ファンジブルトークン作成 | Yes |
| Core NFT/コレクション作成 | Yes |
| TM NFT/pNFT作成 | Yes |
| TM NFT転送 | Yes |
| ファンジブルトークン転送 | Yes |
| Core NFT転送 | Yes |
| Irysへのアップロード | Yes |
| Candy Machineドロップ | Yes（セットアップ/設定/挿入 — ミントにはSDKが必要） |
| 圧縮NFT（cNFT） | Yes（バッチ上限約100、大量の場合はSDKを使用） |
| SOL残高確認/エアドロップ | Yes |
| オーナー/コレクションでアセットクエリ | SDKのみ（DAS API） |
| トークンローンチ（Genesis） | Yes（ローンチプールとボンディングカーブ） |
| エージェントトークンローンチ | Yes（`--agentMint`フラグ） |
| Core NFTバーン | Yes |
| Core NFTメタデータ更新 | Yes |

## 選択ガイド

タスクに適したプログラムとツーリングを選択するためのガイダンスです。

### NFT: Core vs Token Metadata

| 選択 | 条件 |
|--------|------|
| **Core** | 新しいNFTプロジェクト、低コスト、プラグイン、ロイヤリティ強制 |
| **Token Metadata** | 既存のTMコレクション、エディションが必要、レガシー互換性のためのpNFT |

### 圧縮NFTを使う場合

最小限のコストで数千以上のNFTをミントする場合は**Bubblegum**を使用。初期コストはMerkleツリーの作成で、その後の各ミントはトランザクション手数料のみです。

### Candy Machineを使う場合

ミントルール（許可リスト、開始/終了日、ミント上限、支払いトークンなど）を制御する必要があるNFTドロップには**Core Candy Machine**を使用。

### ファンジブルトークン

ファンジブルトークンには常に**Token Metadata**を使用。

### トークンローンチ

公平な配布メカニズムと自動Raydium流動性グラデュエーションを備えたトークン生成イベントには**Genesis**を使用。

### CLI vs SDK

| 選択 | 条件 |
|--------|------|
| **CLI** | デフォルトの選択 — 直接実行、コード不要 |
| **Umi SDK** | コードが必要、またはCLIでサポートされていないオペレーション |
| **Kit SDK** | `@solana/kit`を使用し最小限の依存関係を求める場合（Token Metadataのみ） |

## 注意事項

- 圧縮NFT（Bubblegum）オペレーションにはDAS対応RPCエンドポイントが必要です。標準のSolana RPCはDigital Asset Standard APIをサポートしていません
- Candy MachineのミントにはSDKが必要です。CLIはセットアップ、設定、アイテム挿入のみを処理
- オーナーまたはコレクションによるアセットクエリにはDAS API（SDKのみ）が必要
- Kit SDKのサポートはToken Metadataに限定されています。他のすべてのプログラムはUmiを使用
