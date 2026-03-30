---
title: MPL Agent Registry
metaTitle: MPL Agent Registry — Solana向けオンチェーンエージェントID | Metaplex
description: MPL Coreアセットを使用してSolana上でエージェントIDの登録と実行委任を行うオンチェーンプログラム。
keywords:
  - MPL Agent Registry
  - agent identity
  - execution delegation
  - MPL Core
  - Solana smart contracts
about:
  - Smart Contracts
  - Solana
  - Metaplex
proficiencyLevel: Intermediate
created: '02-25-2026'
updated: '03-30-2026'
---

**MPL Agent Registry**は、MPL Coreアセットを使用してSolana上でエージェントIDの登録と実行権限の委任を行うオンチェーンプログラムを提供します。{% .lead %}

## 概要

MPL Agent Registryは、検証可能なIDレコードをMPL Coreアセットに紐付け、エグゼクティブプロファイルを通じて実行委任を管理する一対のオンチェーンSolanaプログラムです。

- **Agent Identityプログラム** — IDのPDAを作成し、ライフサイクルフック付きの`AgentIdentity`プラグインをアタッチし、オプションで[Genesis](/smart-contracts/genesis)トークンをリンクします
- **Agent Toolsプログラム** — エグゼクティブプロファイル、実行委任レコード、委任の取り消しを管理します
- **JavaScript/TypeScript SDK** — `@metaplex-foundation/mpl-agent-registry`がインストラクションビルダーとアカウントフェッチャーを提供します
- **MainnetとDevnetで同じアドレス** — 両プログラムはネットワーク間で同一のアドレスにデプロイされています

{% callout title="パスを選択" %}
- **クイックスタート？** インストールと初回登録は[はじめに](/smart-contracts/mpl-agent/getting-started)をご覧ください
- **エージェントを登録？** [エージェントを登録](/agents/register-agent)ガイドに従ってください
- **エージェントデータを読み取る？** [エージェントデータを読み取る](/agents/run-agent)ガイドに従ってください
{% /callout %}

## Agent Registryとは？

Agent Registryは、検証可能なオンチェーンIDレコードをMPL Coreアセットに紐付けます。登録により、エージェントをオンチェーンで検出可能にするPDA（Program Derived Address）が作成され、Transfer、Update、Executeイベントのライフサイクルフックを持つ`AgentIdentity`プラグインがCoreアセットにアタッチされます。

エージェントがIDを持つと、**Agent Tools**プログラムにより、アセットオーナーはエグゼクティブプロファイルに実行権限を委任できます。これにより、指定された権限者がエージェントアセットに代わってアクションを実行できるようになります。

## プログラム

| プログラム | アドレス | 目的 |
|---------|---------|---------|
| **[Agent Identity](/smart-contracts/mpl-agent/identity)** | `1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p` | IDを登録し、Coreアセットにライフサイクルフックをアタッチ |
| **[Agent Tools](/smart-contracts/mpl-agent/tools)** | `TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S` | エグゼクティブプロファイルと実行委任 |

## 仕組み

### ID登録

1. MPL Coreアセットと`agentRegistrationUri`を指定して`RegisterIdentityV1`を呼び出します
2. プログラムがシード`["agent_identity", <asset>]`から派生したPDAを作成します
3. プログラムがMPL CoreにCPIして、URIとTransfer、Update、Executeのライフサイクルチェックを持つ`AgentIdentity`プラグインをアタッチします
4. PDAにアセットの公開鍵が格納され、逆引きが可能になります
5. オプションで、`SetAgentTokenV1`を呼び出してIDに[Genesis](/smart-contracts/genesis)トークンをリンクできます

### 実行委任

1. エグゼクティブが`RegisterExecutiveV1`を通じてプロファイルを登録します
2. アセットオーナーが`DelegateExecutionV1`を呼び出して、エージェントアセットに代わって実行する権限をエグゼクティブに付与します
3. エグゼクティブプロファイルとアセットをリンクする委任レコードPDAが作成されます
4. オーナーまたはエグゼクティブのどちらかが`RevokeExecutionV1`を呼び出して委任を削除できます

## SDK

| 言語 | パッケージ |
|----------|---------|
| JavaScript/TypeScript | `@metaplex-foundation/mpl-agent-registry` |

```shell
npm install @metaplex-foundation/mpl-agent-registry
```

## 次のステップ

1. **[はじめに](/smart-contracts/mpl-agent/getting-started)** — インストール、セットアップ、初回登録
2. **[Agent Identity](/smart-contracts/mpl-agent/identity)** — Identityプログラムの詳細、アカウント、PDA導出
3. **[Agent Tools](/smart-contracts/mpl-agent/tools)** — エグゼクティブプロファイルと実行委任
