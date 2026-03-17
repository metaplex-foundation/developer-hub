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
about:
  - Agent Skills
  - AI-assisted development
  - Metaplex
proficiencyLevel: Beginner
created: '02-23-2026'
updated: '03-04-2026'
---

Metaplex Skillは[Agent Skill](https://agentskills.io)です。AIコーディングエージェントにMetaplexプログラム、CLIコマンド、SDKパターンの正確で最新の知識を提供するナレッジベースです。{% .lead %}

## 概要

Metaplex Skillは、すべてのMetaplexプログラム、CLIコマンド、SDKパターンの正確な知識をAIコーディングエージェントに提供します。

- Core、Token Metadata、Bubblegum、Candy Machine、Genesisの5つのプログラムをカバー
- CLI、Umi SDK、Kit SDKの3つのアプローチをサポート
- Claude Code、Cursor、Copilot、Windsurf、その他の互換エージェントで動作
- プログレッシブディスクロージャーによりトークン使用量を最小限に抑えながら完全なカバレッジを提供

誤ったAPIやフラグに頼る代わりに、AIエージェントはスキルを参照して初回から正確なコマンドとコードを取得できます。

{% quick-links %}

{% quick-link title="インストール" icon="InboxArrowDown" href="/agents/skill/installation" description="Claude Code、Cursor、Copilot、またはAgent Skillsフォーマットをサポートするエージェントにスキルをインストールします。" /%}

{% quick-link title="仕組み" icon="CodeBracketSquare" href="/agents/skill/how-it-works" description="プログレッシブディスクロージャーがコンテキストを軽量に保ちながら完全なカバレッジを提供する仕組みを学びます。" /%}

{% /quick-links %}

## カバーするプログラム

スキルは5つのMetaplexプログラムとその完全なオペレーションセットをカバーします：

| プログラム | 用途 | CLI | Umi SDK | Kit SDK |
|---------|---------|-----|---------|---------|
| **[Core](/smart-contracts/core)** | プラグインとロイヤリティ強制を備えた次世代NFT | Yes | Yes | — |
| **[Token Metadata](/smart-contracts/token-metadata)** | ファンジブルトークン、NFT、pNFT、エディション | Yes | Yes | Yes |
| **[Bubblegum](/smart-contracts/bubblegum-v2)** | Merkleツリーによる圧縮NFT | Yes | Yes | — |
| **[Core Candy Machine](/smart-contracts/core-candy-machine)** | 設定可能なガードを持つNFTドロップ | Yes | Yes | — |
| **[Genesis](/smart-contracts/genesis)** | 公平な配布によるトークンローンチ | Yes | Yes | — |

## サポートされるオペレーション

スキルはMetaplex開発の3つのアプローチに対するリファレンス資料を提供します：

- **CLI (`mplx`)** — ターミナルからのMetaplexオペレーションの直接実行。アセット作成、アップロード、Candy Machineデプロイ、ツリー作成、転送など。
- **Umi SDK** — すべてのプログラムをカバーする完全なプログラムアクセス。オーナー/コレクション/クリエイターによる取得、DAS APIクエリ、デリゲート管理、プラグイン設定。
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

## 注意事項

- スキルは[Agent Skills](https://agentskills.io)フォーマットをサポートするAIコーディングエージェントが必要です
- スキルファイルはプロジェクトにバンドルされる静的リファレンスです。更新するにはインストールコマンドを再実行してください
- `npx skills add`コマンドにはNode.jsとnpm/npxが必要です
