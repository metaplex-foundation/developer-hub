---
title: プログラムとオペレーション
metaTitle: プログラムとオペレーション | Metaplex スキル
description: Metaplex Skillがカバーするプログラムとオペレーションの詳細な内訳。
created: '02-23-2026'
updated: '04-08-2026'
keywords:
  - Agent Registry
  - Core
  - Token Metadata
  - Bubblegum
  - Candy Machine
  - Genesis
  - bonding curve
  - mplx CLI
  - Umi SDK
  - Kit SDK
about:
  - Metaplex programs
  - CLI operations
  - SDK operations
proficiencyLevel: Beginner
---

Metaplex SkillはCLI、Umi SDK、Kit SDKにまたがる6つのプログラムをカバーします。このページでは、各プログラムがサポートする内容と使い分けの詳細を提供します。{% .lead %}

## 概要

Metaplex Skillは、CLI、Umi SDK、Kit SDKにまたがる6つのMetaplexプログラムとそのツーリングに関する知識をAIエージェントに提供します。

- 6つのプログラム（[Agent Registry](/agents)、[Genesis](/smart-contracts/genesis)、[Core](/core)、[Token Metadata](/token-metadata)、[Bubblegum](/smart-contracts/bubblegum-v2)、[Candy Machine](/smart-contracts/core-candy-machine)）すべてがCLIとUmi SDKをサポート
- Kit SDKはToken Metadataのみ対応
- `mplx` CLIはコード不要でほとんどのオペレーションを処理
- このページでタスクに合ったプログラムとツーリングアプローチを判断

## プログラムカバレッジ

以下の表は、各プログラムで利用可能なツーリングアプローチを示しています。

| プログラム | CLI | Umi SDK | Kit SDK |
|---------|-----|---------|---------|
| **Agent Registry** | Yes | Yes | — |
| **Genesis** | Yes | Yes | — |
| **Core** | Yes | Yes | — |
| **Token Metadata** | Yes | Yes | Yes |
| **Bubblegum** | Yes | Yes | — |
| **Candy Machine** | Yes | Yes | — |

## Agent Registry

[Agent Registry](/agents)は、MPL Coreアセットのオンチェーンエージェントアイデンティティ、ウォレット、実行委任を提供します。

**CLI** (`mplx agents`)：エージェントアイデンティティの登録、実行の委任と取り消し、エージェントデータの取得、Genesisトークンのエージェントへのリンク。完全なエージェントトークン作成フローには、`mplx genesis launch create --agentMint --agentSetToken`を使用してローンチとリンクを一括で実行。

**Umi SDK**：Mint Agent API（`mintAndSubmitAgent`）を含む完全なプログラムアクセス。Coreアセットの作成とアイデンティティ登録を1つのトランザクションで実行。既存アセットには`registerIdentityV1`をサポート。実行委任と完全な[エージェントトークン作成](/agents/create-agent-token)フロー（Genesisでトークンをローンチし`setAgentTokenV1`でリンク）にも対応。

{% callout type="note" %}
すべてのCoreアセットは、CoreのExecuteフックを通じてビルトインウォレット（Asset Signer PDA）を持っています。Agent Registryは発見可能なアイデンティティレコードを追加し、オーナーがオフチェーンエグゼクティブにエージェントの操作を委任できるようにします。
{% /callout %}

## Core

Solanaの次世代NFT標準。Core NFTはToken Metadata NFTよりも大幅に安価で、ロイヤリティ強制、フリーズデリゲート、属性などのプラグインシステムをサポートします。

**CLI** (`mplx core`)：コレクションとアセットの作成・更新、プラグイン管理。

**Umi SDK**：オーナー/コレクション/クリエイターによる取得、プラグイン設定、デリゲート管理を含む完全なプログラムアクセス。

## Token Metadata

オリジナルのMetaplex NFT標準。ファンジブルトークン、NFT、プログラマブルNFT（pNFT）、エディションをサポートします。

**CLI** (`mplx tm`)：NFTとpNFTの作成。アセットの転送と更新。ファンジブルトークンには`mplx toolbox token`を使用。

**Umi SDK**：すべてのToken Metadataオペレーションへの完全なプログラムアクセス。

**Kit SDK**：最小限の依存関係で`@solana/kit`を使用したToken Metadataオペレーション。Umiフレームワークを避けたい場合に便利です。

## Bubblegum（圧縮NFT）

[Bubblegum](/smart-contracts/bubblegum-v2)は状態圧縮のためのMerkleツリーを使用して大規模にNFTを作成できます。圧縮NFTは初回のツリー作成後、従来のNFTのほんの一部のコストで済みます。

**CLI** (`mplx bg`)：Merkleツリーの作成、cNFTのミント（バッチ上限約100）、取得、更新、転送、バーン。

**Umi SDK**：完全なプログラムアクセス。約100を超えるバッチやDAS APIクエリにはSDKを使用。

{% callout type="note" %}
圧縮NFTオペレーションにはDAS対応RPCエンドポイントが必要です。標準のSolana RPCエンドポイントはcNFTオペレーションに必要なDigital Asset Standard APIをサポートしていません。
{% /callout %}

## Candy Machine

[Core Candy Machine](/smart-contracts/core-candy-machine)は設定可能なミントルール（ガード）でNFTドロップをデプロイします。ガードは誰がミントできるか、いつ、いくらで、何個までかを制御します。

**CLI** (`mplx cm`)：Candy Machineの設定、アイテム挿入、デプロイ。ミントにはSDKが必要。

**Umi SDK**：ミントオペレーションとガード設定を含む完全なプログラムアクセス。

## Genesis

[Genesis](/smart-contracts/genesis)は公平な配布とRaydiumへの自動流動性グラデュエーションを備えたトークンローンチプロトコルです。2つのローンチタイプをサポート：**launchpool**（設定可能なアロケーションと48時間のデポジットウィンドウ、オプションのチームベスティング）と**bonding curve**（即時のコンスタントプロダクトAMMで取引がすぐに開始、売り切れ時にRaydium CPMMへ自動グラデュエーション）。

**CLI** (`mplx genesis`)：launchpoolまたはbonding curveによるトークンローンチの作成と管理。bonding curveローンチのクリエイター手数料、ファーストバイ、エージェントモードをサポート。

**Umi SDK**：Launch API（`createAndRegisterLaunch`）による完全なプログラムアクセス。状態取得、ライフサイクルヘルパー、スリッページ付きクォート計算、スワップ実行を含むbonding curveスワップ統合。GenesisトークンをAgent Registryアイデンティティにリンクするエージェントローンチフローもサポート。

## CLI機能

`mplx` CLIはコード不要でほとんどのMetaplexオペレーションを直接処理できます：

| タスク | CLIサポート |
|------|-------------|
| エージェントアイデンティティ登録 | Yes (`mplx agents register`) |
| エグゼクティブプロファイル登録 | Yes (`mplx agents executive register`) |
| 実行の委任/取り消し | Yes (`mplx agents executive delegate` / `revoke`) |
| エージェントデータ取得 | Yes (`mplx agents fetch`) |
| エージェントトークン設定（Genesisリンク） | Yes (`mplx agents set-agent-token`、asset-signerモードが必要) |
| ファンジブルトークン作成 | Yes (`mplx toolbox token create`) |
| Core NFT/コレクション作成 | Yes (`mplx core`) |
| TM NFT/pNFT作成 | Yes (`mplx tm create`) |
| TM NFT転送 | Yes (`mplx tm transfer`) |
| ファンジブルトークン転送 | Yes (`mplx toolbox token transfer`) |
| Core NFT転送 | Yes (`mplx core asset transfer`) |
| Core NFTバーン | Yes |
| Core NFTメタデータ更新 | Yes |
| ストレージへのアップロード | Yes (`mplx toolbox storage upload`) |
| Candy Machineドロップ | Yes（セットアップ/設定/挿入 — ミントにはSDKが必要） |
| 圧縮NFT（cNFT） | Yes（バッチ上限約100、大量の場合はSDKを使用） |
| Execute（asset-signerウォレット） | Yes (`mplx core asset execute`) |
| SOL残高確認/エアドロップ | Yes (`mplx toolbox sol`) |
| オーナー/コレクションでアセットクエリ | SDKのみ（DAS API） |
| トークンローンチ — launchpool (Genesis) | Yes (`mplx genesis launch create`) |
| トークンローンチ — bonding curve (Genesis) | Yes (`mplx genesis launch create --launchType bonding-curve`) |
| エージェントトークンローンチ（Genesis + リンク） | Yes (`mplx genesis launch create --agentMint --agentSetToken`) |

## 選択ガイド

タスクに適したプログラムとツーリングを選択するためのガイダンスです。

### 自律エージェント

MPL Coreアセットのオンチェーンアイデンティティと実行委任の登録には**[Agent Registry](/agents)**を使用します。Mint Agent API（`mintAndSubmitAgent`）はCoreアセットの作成とアイデンティティ登録を1つのトランザクションで実行します。既存アセットには`mplx agents register <asset> --use-ix`（CLI）または`registerIdentityV1`（SDK）を使用。エージェントはGenesisでローンチし`setAgentTokenV1`でリンクすることで[エージェントトークンを作成・リンク](/agents/create-agent-token)できます。

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

公平な配布と自動Raydium流動性グラデュエーションを備えたトークン生成イベントには**[Genesis](/smart-contracts/genesis)**を使用。2つのローンチタイプが利用可能：

- **Launchpool**（デフォルト） — 設定可能なアロケーションと48時間のデポジットウィンドウ、オプションのチームベスティングサポート。
- **Bonding curve** — 即時のコンスタントプロダクトAMMで取引がすぐに開始。クリエイター手数料、ファーストバイ、エージェントモードをサポート。売り切れ時にRaydium CPMMへ自動グラデュエーション。

### アセットをエージェント/ボールト/ウォレットとして使用（Execute）

アセット（NFT、エージェント、ボールト）がSOLやトークンを保持、資金を転送、トランザクションに署名、または他のアセットを所有する必要がある場合は**Core Execute**を使用。すべてのCoreアセットには自律ウォレットとして機能するsigner PDAがあります。

### CLI vs SDK

| 選択 | 条件 |
|--------|------|
| **CLI** | デフォルトの選択 — 直接実行、コード不要 |
| **Umi SDK** | コードが必要、またはCLIでサポートされていないオペレーション |
| **Kit SDK** | `@solana/kit`を使用し最小限の依存関係を求める場合（Token Metadataのみ） |

## クイックリファレンス

各プログラムにはSDKアクセス用のnpmパッケージがあり、CLIはすべてのプログラムを1つのツールにバンドルしています。

| ツール | パッケージ |
|------|---------|
| CLI | [`@metaplex-foundation/cli`](https://github.com/metaplex-foundation/cli) (`mplx`) |
| Umi SDK | [`@metaplex-foundation/umi`](https://github.com/metaplex-foundation/umi) |
| Agent Registry SDK | [`@metaplex-foundation/mpl-agent-registry`](https://github.com/metaplex-foundation/mpl-agent-registry) |
| Core SDK | [`@metaplex-foundation/mpl-core`](https://github.com/metaplex-foundation/mpl-core) |
| Token Metadata SDK | [`@metaplex-foundation/mpl-token-metadata`](https://github.com/metaplex-foundation/mpl-token-metadata) |
| Bubblegum SDK | [`@metaplex-foundation/mpl-bubblegum`](https://github.com/metaplex-foundation/mpl-bubblegum) |
| Candy Machine SDK | [`@metaplex-foundation/mpl-core-candy-machine`](https://github.com/metaplex-foundation/mpl-core-candy-machine) |
| Genesis SDK | [`@metaplex-foundation/genesis`](https://github.com/metaplex-foundation/genesis) |
| Kit SDK（TMのみ） | [`@metaplex-foundation/mpl-token-metadata-kit`](https://github.com/metaplex-foundation/mpl-token-metadata/tree/main/clients/js-kit) |

## 注意事項

- 圧縮NFT（Bubblegum）オペレーションにはDAS対応RPCエンドポイントが必要です。標準のSolana RPCはDigital Asset Standard APIをサポートしていません
- Candy MachineのミントにはSDKが必要です。CLIはセットアップ、設定、アイテム挿入のみを処理
- オーナーまたはコレクションによるアセットクエリにはDAS API（SDKのみ）が必要
- Kit SDKのサポートはToken Metadataに限定されています。他のすべてのプログラムはUmiを使用
- エージェントトークンの設定（`setAgentTokenV1`）にはCoreアセットのasset-signerモードが必要
- Bonding curveローンチはすべてのトークンが売り切れるとRaydium CPMMへ自動グラデュエーション
