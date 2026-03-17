---
title: エージェントとは？
metaTitle: Solanaのエージェントとは？ | Metaplex Agent Registry
description: Solana上の自律型エージェントは、内蔵ウォレットとオンチェーンIDレコードを持つMPL Coreアセットです。エージェントID、ウォレット、実行委任の仕組みについて学びます。
keywords:
  - Solana agents
  - autonomous agents
  - agent identity
  - MPL Core
  - execution delegation
  - Asset Signer
about:
  - Autonomous Agents
  - Solana
  - Metaplex
proficiencyLevel: Beginner
created: '03-12-2026'
updated: '03-12-2026'
---

Solana上の自律型エージェントは、[Metaplex Agent Registry](/smart-contracts/mpl-agent)によって管理される内蔵ウォレットとオンチェーンIDレコードを持つ[MPL Core](/smart-contracts/core)アセットです。{% .lead %}

## 概要

エージェントとは、オンチェーンIDに登録され、独自のPDA派生ウォレットで資金を保持できるMPL Coreアセットです。オフチェーンオペレーターに実行が委任されるため、オーナーがすべてのトランザクションを承認する必要なく、エージェントは自律的に行動できます。

- **ID** — PDAレコードと`AgentIdentity`プラグインがCoreアセットに検証可能なIDを紐付けます
- **ウォレット** — アセットの内蔵PDAウォレット（Asset Signer）はSOL、トークン、その他のアセットを秘密鍵なしで保持します
- **委任** — オフチェーンのエグゼクティブがCoreのExecuteライフサイクルフックを通じてエージェントに代わってトランザクションに署名します
- **オーナー制御** — オーナーはエージェントのIDやウォレットを変更することなく、いつでも委任を取り消したり切り替えたりできます

## エージェントアセットの仕組み

すべての[MPL Core](/smart-contracts/core)アセットには内蔵ウォレットがあります。これはアセットの公開鍵から派生したPDAです。秘密鍵は存在しないため、ウォレットが盗まれることはありません。Coreの[Execute](/smart-contracts/core/execute-asset-signing)ライフサイクルフックを通じて、アセット自身のみが自分のウォレットに対して署名できます。

これにより、Coreアセットは自律型エージェントに最適です：

- **アセットがエージェントのIDとなる** — [AgentIdentity](/agents/register-agent)プラグインでオンチェーンに登録されます
- **アセットのPDAウォレットがエージェントの資金を保持する** — エージェントのみが制御するSOL、トークン、その他のアセット
- **エグゼクティブがエージェントに代わって行動する** — Solanaにはバックグラウンドタスクやオンチェーン推論がないため、委任された[エグゼクティブ](/agents/run-an-agent)がエージェントに代わってトランザクションに署名します。オーナーはすべてのアクションを承認する必要はありません。

オーナーは完全な制御を保持します。どのエグゼクティブに委任するかを選択し、エージェントのIDやウォレットを変更することなく、いつでも委任を取り消したり切り替えたりできます。

## 次のステップ

- **[スキル](/agents/skill)** — AIコーディングエージェントにMetaplexプログラムの完全な知識を付与
- **[エージェントを登録](/agents/register-agent)** — MPL CoreアセットにIDレコードを紐付け
- **[エージェントデータを読み取る](/agents/run-agent)** — 登録を確認し、オンチェーンでエージェントIDを検査
- **[エージェントを実行](/agents/run-an-agent)** — エグゼクティブプロファイルを設定し、実行を委任

*Metaplexが管理 · 2026年3月検証済み*
