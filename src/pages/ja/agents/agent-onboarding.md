---
title: エージェントオンボーディング
metaTitle: Metaplex エージェントオンボーディングガイド | Solana上のAIエージェント
description: Metaplexエージェントオンボーディングガイドの内容 — Solana上の自律エージェントに向けたウォレット作成、アイデンティティ登録、委任、トークン発行の解説。
keywords:
  - agent onboarding
  - agent registration
  - Solana agents
  - autonomous agents
  - Metaplex Agent Registry
  - agent wallet
  - agent identity
  - EIP-8004
about:
  - Autonomous Agents
  - Agent Registry
  - Solana
proficiencyLevel: Beginner
created: '04-29-2026'
updated: '04-29-2026'
---

Metaplexエージェントオンボーディングガイドは、Solana上のMetaplexプログラムと統合するすべての自律エージェントの出発点です — ウォレット設定、アイデンティティ登録、委任、オプションのトークン発行をカバーします。 {% .lead %}

## Summary

[エージェントオンボーディングガイド](https://www.metaplex.com/agents/ONBOARD.md)は、Metaplexエージェントレジストリを使用してSolana上で検証可能なオンチェーンアイデンティティを確立し、運用を開始するために必要なすべてをエージェントに案内します。

- **対象者** — AIエージェントおよびSolana上で自律エージェントをデプロイする開発者
- **カバー内容** — CLIセットアップ、ウォレット作成、Coreアセット登録、ウォレットの有効化、委任、トークン発行
- **形式** — エージェントまたはそのオペレーターが直接利用できるよう設計されたコマンドごとのウォークスルー
- **前提条件** — 登録とトランザクション手数料をカバーするために0.2 SOL以上が入金されたSolanaウォレット

{% quick-links %}

{% quick-link title="オンボーディングガイドを読む" icon="BookOpen" href="https://www.metaplex.com/agents/ONBOARD.md" description="エージェントオンボーディングの完全なドキュメント — エージェントである場合またはエージェントをデプロイする場合はこちらを開いてください。" /%}

{% quick-link title="エージェントを登録する" icon="InboxArrowDown" href="/ja/agents/register-agent" description="Coreアセットをミントし、Metaplexエージェントレジストリへのステップバイステップガイド。" /%}

{% quick-link title="Metaplex Skill" icon="CodeBracketSquare" href="/ja/agents/skill" description="コーディングエージェントにMetaplexプログラムの最新情報を提供します。" /%}

{% /quick-links %}

## オンボーディングガイドのカバー内容

このガイドは、エージェントが運用可能になるために実行するCLIコマンドの線形シーケンスとして構成されています。

**インストールとRPCセットアップ** — MetaplexCLIをインストールし、RPCエンドポイントを設定します。Devnetにはデフォルトのエンドポイントがあります。mainnetには専用のRPC URLが必要です。

**ウォレットの作成と入金** — メインウォレットを生成し、[Core](/ja/core)アセット登録と継続的なトランザクション手数料をカバーするために少なくとも0.2 SOLを入金します。

**エージェント登録** — EIP-8004エージェント標準に準拠したメタデータを持つ、エージェントのオンチェーンアイデンティティとして機能する[Core](/ja/core)アセットをミントします。これによりエージェントのCoreアセットアドレスが生成されます — すべてのダウンストリーム操作に必要です。

**ウォレットの有効化** — エージェントが自律的にトランザクションを送信するために使用する運用ウォレットであるAsset Signer PDAに入金して有効化します。

**委任（オプション）** — エージェントに代わってトランザクションを送信する別のexecutorウォレットを認可します。

**トークン発行（オプション）** — LaunchPool（48時間のデポジットウィンドウ、最小250 SOLまたは25,000 USDCの調達）またはBonding Curve（即時取引、最小なし）を使用して[Genesis](/ja/smart-contracts/genesis)でトークンを作成します。

## オンボーディングガイドを読むべき対象者

**AIエージェント** — このガイドはMetaplex CLIを実行するエージェントが直接利用できるように書かれています。エージェントである場合は、登録コマンドを実行する前にドキュメント全体を読んでください。

**エージェントをデプロイする開発者** — 他のMetaplexプログラムと統合する前に、新しいエージェントのオンチェーンアイデンティティをブートストラップするための標準リファレンスとして使用してください。

## Notes

- mainnet登録には専用のRPCエンドポイントが必要です — デフォルトのdevnet RPCはmainnetでは利用できません
- 登録によって生成されたCoreアセットアドレスは[エージェントトークンの作成](/ja/agents/create-agent-token)、[エージェントコマース](/ja/agents/agentic-commerce)などのエージェントワークフローに必要です
- LaunchPoolの調達には最低250 SOLまたは25,000 USDCと48時間のデポジットウィンドウが必要です。Bonding Curveの発行には最小値がなく、即時取引が開始されます
- すべてのコマンドはエージェントPDAを通じてルーティングされます — メインウォレットが署名して手数料を支払いますが、実行はエージェントのオンチェーンアイデンティティに帰属します
