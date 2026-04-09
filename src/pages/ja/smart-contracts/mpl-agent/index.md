---
title: MPLエージェントレジストリ
metaTitle: MPLエージェントレジストリ — Solana上のオンチェーンエージェントアイデンティティ | Metaplex
description: MPL Coreアセットを使用してSolana上でエージェントアイデンティティを登録し、実行権限を委任するためのオンチェーンプログラム。
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
updated: '03-12-2026'
---

**MPLエージェントレジストリ**は、MPL Coreアセットを使用してSolana上でエージェントアイデンティティを登録し、実行権限を委任するためのオンチェーンプログラムを提供します。{% .lead %}

## Summary

MPLエージェントレジストリは、検証可能なアイデンティティレコードをMPL Coreアセットにバインドし、エグゼクティブプロファイルを通じて実行委任を管理する一対のオンチェーンSolanaプログラムです。

- **エージェントアイデンティティプログラム** — アイデンティティPDAを登録し、ライフサイクルフックを持つ`AgentIdentity`プラグインをCoreアセットにアタッチします
- **エージェントツールプログラム** — エグゼクティブプロファイルと実行委任レコードを管理します
- **JavaScript/TypeScript SDK** — `@metaplex-foundation/mpl-agent-registry`はインストラクションビルダーとアカウントフェッチャーを提供します
- **メインネットとデブネットで同一のアドレス** — 両プログラムはネットワーク全体で同一のアドレスにデプロイされています

{% callout title="パスを選択" %}
- **クイックスタート？** インストールと最初の登録については[はじめに](/smart-contracts/mpl-agent/getting-started)を参照してください
- **エージェントを登録？** [エージェントを登録する](/agents/register-agent)ガイドに従ってください
- **エージェントデータを読む？** [エージェントデータを読む](/agents/run-agent)ガイドに従ってください
{% /callout %}

## エージェントレジストリとは何か？

エージェントレジストリは、検証可能なオンチェーンアイデンティティレコードをMPL Coreアセットにバインドします。登録によってエージェントをオンチェーンで検索可能にするPDA（プログラム派生アドレス）が作成され、Transfer、Update、Executeイベントのライフサイクルフックを持つ`AgentIdentity`プラグインがCoreアセットにアタッチされます。

エージェントがアイデンティティを持つと、**エージェントツール**プログラムによって、アセットオーナーはエグゼクティブプロファイルに実行権限を委任できるようになります。これにより、指定された権限者がエージェントアセットの代わりにアクションを実行できます。

## プログラム

| プログラム | アドレス | 目的 |
|-----------|---------|------|
| **[エージェントアイデンティティ](/smart-contracts/mpl-agent/identity)** | `1DREGFgysWYxLnRnKQnwrxnJQeSMk2HmGaC6whw2B2p` | アイデンティティを登録し、ライフサイクルフックをCoreアセットにアタッチします |
| **[エージェントツール](/smart-contracts/mpl-agent/tools)** | `TLREGni9ZEyGC3vnPZtqUh95xQ8oPqJSvNjvB7FGK8S` | エグゼクティブプロファイルと実行委任 |

## 仕組み

### アイデンティティ登録

1. MPL Coreアセットと`agentRegistrationUri`を指定して`RegisterIdentityV1`を呼び出します
2. プログラムはシード`["agent_identity", <asset>]`から派生したPDAを作成します
3. プログラムはMPL CoreにCPIして、URIとTransfer、Update、Executeのライフサイクルチェックを持つ`AgentIdentity`プラグインをアタッチします
4. PDAはリバースルックアップのためにアセットの公開鍵を保存します

### 実行委任

1. エグゼクティブが`RegisterExecutiveV1`を通じてプロファイルを登録します
2. アセットオーナーが`DelegateExecutionV1`を呼び出して、エグゼクティブにエージェントアセットの代わりに実行する権限を付与します
3. エグゼクティブプロファイルとアセットをリンクする委任レコードPDAが作成されます

## SDK

| 言語 | パッケージ |
|------|----------|
| JavaScript/TypeScript | `@metaplex-foundation/mpl-agent-registry` |

```shell
npm install @metaplex-foundation/mpl-agent-registry
```

## 次のステップ

1. **[はじめに](/smart-contracts/mpl-agent/getting-started)** — インストール、セットアップ、最初の登録
2. **[エージェントアイデンティティ](/smart-contracts/mpl-agent/identity)** — アイデンティティプログラムの詳細、アカウント、PDA派生
3. **[エージェントツール](/smart-contracts/mpl-agent/tools)** — エグゼクティブプロファイルと実行委任

*[Metaplex](https://github.com/metaplex-foundation)が管理 · 2026年3月最終確認 · [GitHubでソースを表示](https://github.com/metaplex-foundation/mpl-agent)*
