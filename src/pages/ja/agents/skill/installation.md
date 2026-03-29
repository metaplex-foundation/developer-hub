---
title: インストール
metaTitle: インストール | Metaplex スキル
description: Claude Code、Cursor、Copilot、またはAIコーディングエージェントにMetaplex Skillをインストールします。
created: '02-23-2026'
updated: '03-04-2026'
keywords:
  - agent skill installation
  - Claude Code skills
  - Cursor skills
  - Copilot skills
  - npx skills add
about:
  - Agent Skills
  - AI coding agent configuration
proficiencyLevel: Beginner
howToSteps:
  - Run npx skills add metaplex-foundation/skill in your project directory
  - Verify installation by asking your agent to perform a Metaplex operation
howToTools:
  - npx
  - Claude Code
  - Cursor
  - GitHub Copilot
---

AIコーディングエージェントがすべてのMetaplexプログラム、CLIコマンド、SDKパターンの正確な知識を持つように、Metaplex Skillをインストールします。{% .lead %}

## 概要

Metaplex Skillは`npx skills` CLIまたはエージェントのスキルディレクトリへのファイルの手動コピーでインストールできます。

- `npx skills add`によるワンコマンドインストール（互換エージェント対応）
- Claude Code向け手動インストール対応（プロジェクトスコープまたはグローバル）
- Claude Code、Cursor、Copilot、Windsurf、その他のエージェントで動作
- エージェントにMetaplexオペレーションの実行を依頼して確認

## skills.sh経由（推奨）

最も手早いインストール方法です。プロジェクトディレクトリで以下を実行：

```bash
npx skills add metaplex-foundation/skill
```

これはClaude Code、Cursor、Copilot、Windsurf、および[Agent Skills](https://agentskills.io)フォーマットをサポートするすべてのエージェントで動作します。コマンドはスキルファイルをプロジェクトにダウンロードし、エージェントが自動的に参照できるようにします。

## Claude Code手動インストール

`npx skills`を使用したくない場合は、スキルファイルを手動でコピーできます。

### プロジェクトスコープ

プロジェクトのClaudeスキルディレクトリにスキルファイルをコピーします：

```bash
mkdir -p .claude/skills/metaplex
```

次に、[GitHubリポジトリ](https://github.com/metaplex-foundation/skill)の`skills/metaplex/`の内容を`.claude/skills/metaplex/`にコピーします。

### グローバル

すべてのプロジェクトでスキルを利用可能にするには：

```bash
mkdir -p ~/.claude/skills/metaplex
```

次に、[GitHubリポジトリ](https://github.com/metaplex-foundation/skill)の`skills/metaplex/`の内容を`~/.claude/skills/metaplex/`にコピーします。

## インストールの確認

インストール後、エージェントにMetaplexオペレーションの実行を依頼します。例えば：

- *「GenesisでトークンをLaunchして」*
- *「devnetでCore NFTコレクションを作成して」*
- *「ツリーに圧縮NFTをミントして」*

スキルが正しく読み込まれていれば、エージェントは誤ったフラグやAPIを使わずに正しいCLIコマンドまたはSDKコードを参照します。

## 注意事項

- `npx skills add`コマンドにはNode.jsとnpm/npxのインストールが必要です
- 手動インストールパスはプロジェクトスコープ（`.claude/skills/`）とグローバル（`~/.claude/skills/`）のセットアップで異なります
- スキルファイルは静的リファレンスです。最新バージョンに更新するにはインストールコマンドを再実行してください
