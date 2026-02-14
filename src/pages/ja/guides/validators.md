---
# remember to update dates also in /components/guides/index.js
title: バリデータとステーキング
metaTitle: バリデータとステーキング | ガイド
description: Solanaバリデータとステーキングメカニクスの概要。
created: '04-19-2025'
updated: '04-19-2025'
keywords:
  - Solana validators
  - staking SOL
  - Proof of Stake
  - Solana consensus
  - delegation
about:
  - Solana validators
  - staking
  - Proof of Stake
  - delegation
proficiencyLevel: Beginner
faqs:
  - q: What do Solana validators do?
    a: Validators process transactions, generate new blocks, and validate the blockchain state to ensure accuracy and prevent double-spending. They participate in consensus by staking SOL tokens.
  - q: How do I stake SOL tokens?
    a: You can stake SOL by either running a validator node (direct staking) or delegating your SOL to an existing validator using a compatible wallet like Phantom or Solflare.
  - q: How long does it take for staked SOL to become active?
    a: When you delegate SOL, it takes approximately 2-3 epochs (2-3 days) for your stake to become active and start earning rewards. Deactivation takes the same timeframe.
  - q: What factors should I consider when choosing a validator?
    a: Consider the validator's performance and uptime, commission rate (typically 5-10%), total stake amount, and their contribution to network decentralization.
---
## 概要

バリデータは、トランザクションの処理、新しいブロックの生成、精度を確保し二重支払いを防ぐためのブロックチェーン状態の検証を担当しています。他のバリデータが提案したブロックの正当性に投票することで合意メカニズムに参加し、ネットワークの完全性とセキュリティの維持に貢献します。バリデータはまた、SOLトークンをステーキングすることでネットワークの分散化に貢献し、ネットワークの健全性と安定性に対するインセンティブを一致させます。

バリデータはしばしばガバナンス決定に参加し、ネットワークの将来に影響する提案に対する洞察を提供し投票を行います。多くのバリデータは、教育リソースの提供、コミュニティノードの運営、エコシステムを強化する分散アプリケーション（dApps）やツールの開発サポートを通じてコミュニティに貢献しています。

## Solanaのバリデータネットワーク

### プルーフ・オブ・ステークとプルーフ・オブ・ヒストリー

Solanaは、プルーフ・オブ・ステーク（PoS）とプルーフ・オブ・ヒストリー（PoH）合意メカニズムの独特な組み合わせを使用しています：

- **プルーフ・オブ・ステーク**: バリデータは合意に参加するためにSOLトークンをステーキングする必要があります。ステーキングされた量は投票重みと潜在的報酬に影響します。
- **プルーフ・オブ・ヒストリー**: イベントの歴史的記録を提供する暗号学的時計で、バリデータが通信を必要とすることなくイベントのタイミングに合意することを可能にします。

このハイブリッドアプローチにより、Solanaは高いトランザクション処理能力（最大65,000 TPS）と低遅延（400msブロック時間）を実現できます。

### バリデータエコノミクス

バリデータは以下を通じて報酬を獲得します：

1. **トランザクション手数料**: ユーザーが支払うトランザクション手数料の一部
2. **インフレーション報酬**: バリデータと委任者に配布される新しいSOLトークン
3. **MEV（最大抽出可能価値）**: トランザクション順序に影響することで抽出できる追加価値

## Solanaでのステーキング

### ステーキングメカニクス

Solanaでのステーキングは主に2つの方法で行うことができます：

1. **直接ステーキング（バリデータ）**: バリデータノードを運営し、自分のSOLをステーキング
2. **委任（委任者）**: 自分でノードを運営することなく、既存のバリデータに自分のSOLを委任

### 委任プロセス

バリデータにSOLを委任するには：

1. パフォーマンス、手数料率、信頼性に基づいてバリデータを選択
2. 対応ウォレット（Phantom、Solflareなど）を使用してステークアカウントを作成
3. 選択したバリデータにSOLを委任
4. 自動的に複利されるステーキング報酬を監視

### ステークの有効化と無効化

- **有効化**: SOLを委任すると、ステークが有効になり報酬を獲得し始めるまで約2-3エポック（2-3日）かかります
- **無効化**: 委任を解除することを決定すると、SOLが完全に流動的になるまで約2-3エポックかかります

### バリデータの選択

バリデータを選択する際は以下の要因を考慮してください：
- **パフォーマンス**: アップタイムとブロック生成履歴
- **手数料**: バリデータが保持する報酬の割合（通常5-10%）
- **総ステーク**: より高いステークは信頼を示すかもしれませんが、中央集権化にも寄与します
- **分散化への影響**: ネットワークの分散化を強化するために小規模バリデータをサポートすることを検討

## ツールとリソース

### ステーキングツール
- [Solana Beach](https://solanabeach.io/validators) - エクスプローラとバリデータ統計
- [Validators.app](https://www.validators.app/) - 詳細なバリデータパフォーマンス指標
- [Stakeview.app](https://stakeview.app/) - バリデータランキングと比較

### ステーキングをサポートするウォレット
- Phantom
- Solflare
- Ledger
- Math Wallet

## 一般的な用語

- **エポック**: Solanaの時間期間（約2-3日）で、この期間中にバリデータのパフォーマンスが測定され、報酬が配布されます
- **手数料**: バリデータがサービスに対して委任者に課すステーキング報酬の割合
- **スラッシング**: バリデータの不正行為に対するペナルティで、現在Solanaでは実装されていません
- **投票アカウント**: バリデータがブロックに投票することで合意に参加するために使用するアカウント
- **ステークアカウント**: 委任されたSOLトークンを保持するアカウント
