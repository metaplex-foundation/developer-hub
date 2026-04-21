---
title: エージェントトークン
metaTitle: エージェントトークン | Metaplex CLI
description: Metaplex CLIを使用して、登録済みエージェントのトークンを作成し、エージェントIDにリンクします。
keywords:
  - agent token
  - agents set-agent-token
  - mplx agents set-agent-token
  - genesis launch agent
  - agent bonding curve
  - Metaplex CLI
about:
  - Agent token creation
  - Agent token linking
  - Genesis integration
  - Metaplex CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
created: '04-09-2026'
updated: '04-09-2026'
howToSteps:
  - Create a token launch linked to the agent using genesis launch create with --agentAsset and --agentSetToken to permanently link the token
  - Or create a launch without --agentSetToken, then link it manually with agents set-agent-token
howToTools:
  - Metaplex CLI (mplx)
faqs:
  - q: 設定後にエージェントトークンを変更できますか？
    a: いいえ。各エージェントIDが持てるトークンは1つのみで、一度しか設定できません。この操作は取り消せません。
  - q: --agentSetTokenとset-agent-tokenの違いは何ですか？
    a: 両方とも同じことをします。--agentSetTokenはローンチ作成時にトークンを1ステップでリンクします。set-agent-tokenはローンチ後に個別にリンクし、asset-signerモードが必要です。
  - q: set-agent-tokenにasset-signerモードが必要なのはなぜですか？
    a: set-agent-tokenインストラクションにはオーソリティとしてAsset Signer PDAが必要です。asset-signerモードはCLIがこのPDAを自動的に派生・使用するよう設定します。
---

{% callout title="実行内容" %}
登録済みエージェントのトークンを作成してエージェントIDにリンクします：
- **1ステップ**: `--agentAsset` と `--agentSetToken` を使ってエージェントにリンクされたボンディングカーブのローンチを作成する
- **2ステップ**: 個別にトークンローンチを作成し、その後 `agents set-agent-token` でリンクする
{% /callout %}

## Summary

エージェントトークンは、登録済み[エージェントID](/agents)に永続的にリンクされた[Genesis](/smart-contracts/genesis)トークンです。エージェントトークンを作成してリンクする方法は2つあります — ローンチ作成時の1ステップフロー、または2ステップの手動フローです。

- **1ステップ**（推奨）: `genesis launch create --agentAsset <ASSET> --agentSetToken`
- **2ステップ**: ローンチを作成してから `agents set-agent-token` でリンクする
- **取り消し不可**: 各エージェントIDが持てるトークンは1つのみで、一度しか設定できない

## クイックスタート

**ジャンプ:** [1ステップ：エージェントでローンチ](#1ステップエージェントでローンチ) · [2ステップ：手動リンク](#2ステップ手動リンク) · [よくあるエラー](#よくあるエラー) · [FAQ](#faq)

## 1ステップ：エージェントでローンチ

エージェントトークンを作成する最もシンプルな方法は、ローンチ作成時に `--agentAsset` を渡すことです。これはエージェントの[Asset Signer PDA](/dev-tools/cli/config/asset-signer-wallets)からクリエイター手数料ウォレットを自動導出し、オプションで同じトランザクションでトークンをリンクします。

```bash {% title="エージェントトークンでボンディングカーブを作成する" %}
mplx genesis launch create --launchType bonding-curve \
  --name "Agent Token" \
  --symbol "AGT" \
  --image "https://gateway.irys.xyz/abc123" \
  --agentAsset <AGENT_ASSET> \
  --agentSetToken
```

{% callout type="warning" title="--agentSetTokenは取り消し不可" %}
`--agentSetToken` はローンチされたトークンをエージェントに永続的にリンクします。リンクせずにローンチする場合は省略し、後で `agents set-agent-token` でリンクしてください。
{% /callout %}

ローンチプールのローンチでも使用できます：

```bash {% title="エージェントでローンチプール" %}
mplx genesis launch create \
  --name "Agent Token" \
  --symbol "AGT" \
  --image "https://gateway.irys.xyz/abc123" \
  --agentAsset <AGENT_ASSET> \
  --agentSetToken \
  --tokenAllocation 500000000 \
  --depositStartTime 2025-03-01T00:00:00Z \
  --raiseGoal 250 \
  --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS>
```

詳細は[ローンチ（API）— エージェントローンチ](/dev-tools/cli/genesis/launch#agent-launches)を参照してください。

## 2ステップ：手動リンク

`--agentSetToken` なしでトークンローンチを作成した場合、`agents set-agent-token` を使って後からリンクできます。これには[asset-signerウォレットモード](/dev-tools/cli/config/asset-signer-wallets)が必要です。

### ステップ1：Asset-Signerウォレットの設定

```bash {% title="asset-signerウォレットをセットアップする" %}
mplx config wallets add --name my-agent --agent <AGENT_ASSET>
mplx config wallets set my-agent
```

### ステップ2：トークンのリンク

```bash {% title="GenesisトークンをエージェントにリンクSolana" %}
mplx agents set-agent-token <AGENT_ASSET> <GENESIS_ACCOUNT>
```

{% callout type="warning" title="取り消し不可" %}
各エージェントIDが持てるトークンは1つのみで、一度しか設定できません。このコマンドを実行する前に両方のアドレスを十分に確認してください。
{% /callout %}

### 出力

```text {% title="期待される出力" %}
--------------------------------
  Agent Asset: <agent_asset_address>
  Genesis Account: <genesis_account_address>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
--------------------------------
```

## エンドツーエンドの例

```bash {% title="エージェントを登録してトークンをローンチする" %}
# 1. 新しいエージェントを登録する
mplx agents register --name "My Agent" \
  --description "An autonomous trading agent" \
  --image "./avatar.png"
# 出力からアセットアドレスをメモする

# 2. エージェントにリンクされたボンディングカーブトークンをローンチする
mplx genesis launch create --launchType bonding-curve \
  --name "Agent Token" --symbol "AGT" \
  --image "https://gateway.irys.xyz/abc123" \
  --agentAsset <AGENT_ASSET> --agentSetToken

# 3. エージェントにトークンがリンクされているか確認する
mplx agents fetch <AGENT_ASSET>
```

## よくあるエラー

| エラー | 原因 | 対処法 |
|-------|-------|-----|
| Agent token already set | 2回目のトークン設定を試みた | 各エージェントIDが持てるトークンは1つのみです — 取り消し不可です |
| Agent is not owned by the connected wallet | APIが新しく登録されたエージェントをまだインデックスしていない | 約30秒待ってから再試行するか、`agents fetch` で確認してください — ローンチは成功している可能性があります |
| Not in asset-signer mode | ウォレットを設定せずに `set-agent-token` を実行した | 先にasset-signerウォレットをセットアップしてください（[前提条件](#ステップ1asset-signerウォレットの設定)を参照）|

## Notes

- 1ステップフロー（`--agentAsset --agentSetToken`）が推奨です — 1つのトランザクションですべて処理します
- 2ステップフローでは `set-agent-token` インストラクションがオーソリティとしてAsset Signer PDAを使用するため、asset-signerモードが必要です
- `set-agent-token` を実行する前に、Genesisアカウントがすでに存在している必要があります
- `--agentAsset` を使用すると、クリエイター手数料ウォレットはエージェントのAsset Signer PDAから自動的に派生されます

## FAQ

**設定後にエージェントトークンを変更できますか？**
いいえ。各エージェントIDが持てるトークンは1つのみで、一度しか設定できません。この操作は取り消せません。

**`--agentSetToken` と `set-agent-token` の違いは何ですか？**
両方とも同じことをします。`--agentSetToken` はローンチ作成時にトークンを1ステップでリンクします。`set-agent-token` はローンチ後に個別にリンクし、asset-signerモードが必要です。

**`set-agent-token` にasset-signerモードが必要なのはなぜですか？**
`set-agent-token` インストラクションにはオーソリティとしてAsset Signer PDAが必要です。asset-signerモードはCLIがこのPDAを自動的に派生・使用するよう設定します。
