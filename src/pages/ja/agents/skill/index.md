---
title: Metaplex スキル
metaTitle: Metaplex スキル | エージェント
description: AIコーディングエージェントにMetaplexプログラム、CLIコマンド、SDKパターンの完全な知識を提供するエージェントスキル。
keywords:
  - agent skill
  - AI coding agent
  - Claude Code
  - Cursor
  - Copilot
  - Metaplex
  - Solana
  - NFT
  - agent registry
  - bonding curve
  - Genesis
about:
  - Agent Skills
  - AI-assisted development
  - Metaplex
proficiencyLevel: Beginner
created: '02-23-2026'
updated: '04-08-2026'
---

Metaplex Skillは[Agent Skill](https://agentskills.io)です — AIコーディングエージェントにMetaplexプログラム、CLIコマンド、SDKパターンの正確で最新の知識を提供するナレッジベースです。{% .lead %}

## 概要

Metaplex Skillは、すべてのMetaplexプログラム、CLIコマンド、SDKパターンの正確な知識をAIコーディングエージェントに提供します。

- 6つのプログラムをカバー：[Agent Registry](/agents)、[Genesis](/smart-contracts/genesis)、[Core](/smart-contracts/core)、[Token Metadata](/smart-contracts/token-metadata)、[Bubblegum](/smart-contracts/bubblegum-v2)、[Candy Machine](/smart-contracts/core-candy-machine)
- CLI、Umi SDK、Kit SDKの3つのアプローチをサポート
- Claude Code、Cursor、Copilot、Codex、Windsurf、その他の互換エージェントで動作
- プログレッシブディスクロージャーによりトークン使用量を最小限に抑えながら完全なカバレッジを提供

誤ったAPIやフラグに頼る代わりに、AIエージェントはスキルを参照して初回から正確なコマンドとコードを取得できます。

{% quick-links %}

{% quick-link title="インストール" icon="InboxArrowDown" href="/agents/skill/installation" description="Claude Code、Cursor、Copilot、またはAgent Skillsフォーマットをサポートするエージェントにスキルをインストールします。" /%}

{% quick-link title="仕組み" icon="CodeBracketSquare" href="/agents/skill/how-it-works" description="プログレッシブディスクロージャーがコンテキストを軽量に保ちながら完全なカバレッジを提供する仕組みを学びます。" /%}

{% /quick-links %}

## カバーするプログラム

スキルは6つのMetaplexプログラムとその完全なオペレーションセットをカバーします：

| プログラム | 用途 | CLI | Umi SDK | Kit SDK |
|---------|---------|-----|---------|---------|
| **[Agent Registry](/agents)** | オンチェーンエージェントアイデンティティ、ウォレット、実行委任 | Yes | Yes | — |
| **[Genesis](/smart-contracts/genesis)** | launchpoolまたはbonding curveによるトークンローンチとRaydiumグラデュエーション | Yes | Yes | — |
| **[Core](/smart-contracts/core)** | プラグインとロイヤリティ強制を備えた次世代NFT | Yes | Yes | — |
| **[Token Metadata](/smart-contracts/token-metadata)** | ファンジブルトークン、NFT、pNFT、エディション | Yes | Yes | Yes |
| **[Bubblegum](/smart-contracts/bubblegum-v2)** | Merkleツリーによる圧縮NFT | Yes | Yes | — |
| **[Core Candy Machine](/smart-contracts/core-candy-machine)** | 設定可能なガードを持つNFTドロップ | Yes | Yes | — |

## サポートされるオペレーション

スキルはMetaplex開発の3つのアプローチに対するリファレンス資料を提供します：

- **CLI (`mplx`)** — ターミナルからのMetaplexオペレーションの直接実行。エージェント登録（`mplx agents`）、トークンローンチとbonding curve作成（`mplx genesis`）、アセット作成、アップロード、Candy Machineデプロイ、ツリー作成、転送など。
- **Umi SDK** — すべてのプログラムをカバーする完全なプログラムアクセス。エージェントアイデンティティと委任、Genesisローンチとbonding curveスワップ、オーナー/コレクション/クリエイターによる取得、DAS APIクエリ、デリゲート管理、プラグイン設定。
- **Kit SDK** — 最小限の依存関係で`@solana/kit`を使用したToken Metadataオペレーション。

## 互換性のあるエージェント

スキルは[Agent Skills](https://agentskills.io)フォーマットをサポートするすべてのAIコーディングエージェントで動作します：

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code)
- [Cursor](https://www.cursor.com/)
- [GitHub Copilot](https://github.com/features/copilot)
- [Codex](https://openai.com/index/codex/)
- [Windsurf](https://windsurf.com/)

## 次のステップ

- **[スキルをインストール](/agents/skill/installation)** して始めましょう
- **[仕組み](/agents/skill/how-it-works)** でアーキテクチャを理解
- **[プログラムとオペレーション](/agents/skill/programs-and-operations)** で詳細なカバレッジを確認

## クイックリファレンス

| 項目 | 値 |
|------|-------|
| インストールコマンド | `npx skills add metaplex` |
| スキルフォーマット | [Agent Skills](https://agentskills.io) |
| CLIパッケージ | [`@metaplex-foundation/cli`](https://github.com/metaplex-foundation/cli) (`mplx`) |
| カバーするプログラム | 6（Agent Registry、Genesis、Core、Token Metadata、Bubblegum、Candy Machine） |
| SDKアプローチ | Umi SDK（全プログラム）、Kit SDK（Token Metadataのみ） |

## 用語集

| 用語 | 定義 |
|------|-----------|
| Agent Skill | AIコーディングエージェントに特定ドメインの正確なコンテキストを提供する構造化されたナレッジベース |
| プログレッシブディスクロージャー | エージェントが最初に軽量ルーターを読み、現在のタスクに必要なリファレンスファイルのみをロードするアーキテクチャ |
| SKILL.md | タスクを特定のリファレンスファイルにマッピングするルーターファイル |
| `mplx` | すべてのサポートプログラムへの直接ターミナルアクセスを提供するMetaplex CLIツール |
| Umi SDK | すべてのプログラムへのプログラムアクセスを提供するMetaplexの主要TypeScript SDKフレームワーク |
| Kit SDK | `@solana/kit`を使用した軽量な代替SDK。現在Token Metadataのみサポート |

## 注意事項

- スキルは[Agent Skills](https://agentskills.io)フォーマットをサポートするAIコーディングエージェントが必要です
- スキルファイルはプロジェクトにバンドルされる静的リファレンスです。更新するにはインストールコマンドを再実行してください
- `npx skills add`コマンドにはNode.jsとnpm/npxが必要です
