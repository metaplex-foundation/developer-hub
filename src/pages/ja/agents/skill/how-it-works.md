---
title: 仕組み
metaTitle: 仕組み | Metaplex スキル
description: Metaplexスキルのプログレッシブディスクロージャーアーキテクチャを理解します。
created: '02-23-2026'
updated: '03-04-2026'
keywords:
  - progressive disclosure
  - agent skill architecture
  - task router
  - SKILL.md
  - reference files
about:
  - Progressive disclosure
  - Agent Skill architecture
  - Context management
proficiencyLevel: Intermediate
---

Metaplex Skillは**プログレッシブディスクロージャー**を使用して、AIエージェントに必要なコンテキストだけを提供します。トークン使用量を低く抑えながら、すべてのMetaplexプログラムの包括的なカバレッジを提供します。{% .lead %}

## 概要

Metaplex Skillは2層のプログレッシブディスクロージャーアーキテクチャを使用して、トークン使用量を最小限に抑えながらAIエージェントに正確なMetaplex知識を提供します。

- 軽量なルーターファイル（`SKILL.md`）がタスクを特定のリファレンスファイルにマッピング
- エージェントは現在のタスクに関連するファイルのみを読み取り
- リファレンスファイルはCLIコマンド、SDKパターン、概念的基盤をカバー
- アーキテクチャはすべてのMetaplexプログラムをカバーしながらコンテキストを小さく保持

## アーキテクチャ

スキルには2つのレイヤーがあります：

1. **`SKILL.md`** — エージェントが最初に読む軽量なルーターファイル。すべてのプログラムの概要、ツール選択ガイド、タスクを特定のリファレンスファイルにマッピングするタスクルーターテーブルが含まれています。

2. **リファレンスファイル** — CLIセットアップ、プログラム固有のCLIコマンド、SDKパターン、概念的基盤をカバーする詳細ファイル。エージェントは現在のタスクに関連するファイルのみを読み取ります。

## エージェントがMetaplex Skillを使用する方法

エージェントにMetaplexタスクを実行するよう依頼すると：

1. エージェントが`SKILL.md`を読み、タスクタイプを識別
2. タスクルーターテーブルがエージェントを関連するリファレンスファイルに誘導
3. エージェントはそれらのファイルのみを読み、正確なコマンドとコードでタスクを実行

例えば、*「devnetでCore NFTを作成して」*と依頼すると、エージェントは`SKILL.md`を読み、これをCLI Coreタスクとして識別し、`cli.md`（共通セットアップ）と`cli-core.md`（Core固有コマンド）を読みます。

## リファレンスファイル

スキルにはアプローチとプログラム別に整理されたリファレンスファイルが含まれています：

### CLIリファレンス

これらのファイルは各プログラムの`mplx` CLIコマンドをカバーします。

| ファイル | 内容 |
|------|----------|
| `cli.md` | 共通CLIセットアップ、設定、ツールボックスコマンド |
| `cli-core.md` | Core NFTとコレクションのCLIコマンド |
| `cli-token-metadata.md` | Token Metadata NFT/pNFTのCLIコマンド |
| `cli-bubblegum.md` | 圧縮NFT（cNFT）のCLIコマンド |
| `cli-candy-machine.md` | Candy MachineセットアップとデプロイのCLIコマンド |
| `cli-genesis.md` | Genesisトークンローンチのcliコマンド |

### SDKリファレンス

これらのファイルは各プログラムのUmiとKit SDKオペレーションをカバーします。

| ファイル | 内容 |
|------|----------|
| `sdk-umi.md` | Umi SDKセットアップと共通パターン |
| `sdk-core.md` | Umi経由のCore NFTオペレーション |
| `sdk-token-metadata.md` | Umi経由のToken Metadataオペレーション |
| `sdk-bubblegum.md` | Umi経由の圧縮NFTオペレーション |
| `sdk-genesis.md` | Umi経由のGenesisトークンローンチオペレーション |
| `sdk-token-metadata-kit.md` | Kit SDK経由のToken Metadataオペレーション |

### コンセプト

これらのファイルはアカウント構造やプログラムIDなどの共有知識をカバーします。

| ファイル | 内容 |
|------|----------|
| `concepts.md` | アカウント構造、PDA、プログラムID |

## タスクルーター

`SKILL.md`のタスクルーターは、各タスクタイプをエージェントが読むべきファイルにマッピングします：

| タスクタイプ | 読み込まれるファイル |
|-----------|-------------|
| CLIオペレーション（共通セットアップ） | `cli.md` |
| CLI: Core NFT/コレクション | `cli.md` + `cli-core.md` |
| CLI: Token Metadata NFT | `cli.md` + `cli-token-metadata.md` |
| CLI: 圧縮NFT（Bubblegum） | `cli.md` + `cli-bubblegum.md` |
| CLI: Candy Machine（NFTドロップ） | `cli.md` + `cli-candy-machine.md` |
| CLI: トークンローンチ（Genesis） | `cli.md` + `cli-genesis.md` |
| CLI: ファンジブルトークン | `cli.md`（ツールボックスセクション） |
| SDKセットアップ（Umi） | `sdk-umi.md` |
| SDK: Core NFT | `sdk-umi.md` + `sdk-core.md` |
| SDK: Token Metadata | `sdk-umi.md` + `sdk-token-metadata.md` |
| SDK: 圧縮NFT（Bubblegum） | `sdk-umi.md` + `sdk-bubblegum.md` |
| SDK: Candy Machine（ミント/ガード） | `sdk-umi.md` |
| SDK: Kit使用のToken Metadata | `sdk-token-metadata-kit.md` |
| SDK: トークンローンチ（Genesis） | `sdk-umi.md` + `sdk-genesis.md` |
| アカウント構造、PDA、コンセプト | `concepts.md` |

## 注意事項

- スキルはAIコーディングエージェント向けに設計されており、人間が読むドキュメントとしてレンダリングされない場合があります
- リファレンスファイルは[Skillリポジトリ](https://github.com/metaplex-foundation/skill)と並行してメンテナンスされ、デベロッパーハブとは独立して更新される場合があります
- [Agent Skills](https://agentskills.io)フォーマットをサポートしないエージェントでも、手動インストールによりスキルを使用できます
