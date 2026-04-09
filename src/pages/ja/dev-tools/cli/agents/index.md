---
title: 概要
metaTitle: エージェントコマンド概要 | Metaplex CLI
description: Metaplex CLI（mplx）を使用して、オンチェーンエージェントIDの登録と管理を行うagents CLIコマンドの概要。
keywords:
  - agents CLI
  - mplx agents
  - agent identity
  - agent registration
  - executive delegation
  - Metaplex CLI
  - Solana agents
about:
  - Agent identity registration
  - Executive delegation
  - Metaplex CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
created: '04-09-2026'
updated: '04-09-2026'
faqs:
  - q: mplx agentsコマンドとは何ですか？
    a: mplx agentsコマンドグループを使うと、MPL CoreアセットへのエージェントIDの登録、Genesisトークンのエージェントへのリンク、エグゼクティブ委任の管理をターミナルから行えます。
  - q: エグゼクティブプロファイルとは何ですか？
    a: エグゼクティブプロファイルは、ウォレットが登録済みエージェントから実行委任を受け取るために必要な、一度だけ作成するオンチェーンPDAです。登録後、エグゼクティブは委任されたエージェントに代わってトランザクションに署名できます。
  - q: Irysにアップロードせずにエージェントを登録できますか？
    a: はい。デフォルトでは、registerコマンドはMetaplex Agent APIを使用しており、ストレージを自動的に処理します。Irysが必要なのは、直接オンチェーン登録のために--use-ixフラグを使用する場合のみです。
  - q: エージェントトークンは設定後に変更できますか？
    a: いいえ。エージェントトークンはset-agent-tokenコマンドを使用して、各IDにつき一度しか設定できません。この操作は取り消せません。
---

{% callout title="このページの内容" %}
エージェントID管理のための完全なCLIリファレンス：
- **登録**: MPL CoreアセットへのエージェントIDの作成と登録
- **トークンリンク**: GenesisトークンのローンチとエージェントIDの関連付け
- **エグゼクティブ委任**: 登録済みエージェントの代わりに行動するウォレットの認可
{% /callout %}

## Summary

`mplx agents` コマンドを使うと、[MPL Core](/core)アセットへのエージェントIDの登録、[Genesis](/smart-contracts/genesis)トークンのリンク、エグゼクティブ委任の管理をターミナルから行えます。

- **ツール**: Metaplex CLI（`mplx`）の `agents` コマンドグループ
- **ID**: 各エージェントIDはMPL CoreアセットからPDAとして導出・保存される
- **委任**: エグゼクティブがエージェントに代わってトランザクションに署名できるよう認可可能
- **トークンリンク**: GenesisトークンをエージェントIDに永続的にリンクできる

**ジャンプ:** [前提条件](#前提条件) · [一般的なフロー](#一般的なフロー) · [コマンドリファレンス](#コマンドリファレンス) · [よくあるエラー](#よくあるエラー) · [FAQ](#faq) · [用語集](#用語集)

## 前提条件

- Metaplex CLIがインストールされ、`PATH` に追加されている
- Solanaキーペアファイル（例：`~/.config/solana/id.json`）
- トランザクション手数料用のSOL
- `mplx config rpcs add` または `-r` フラグで設定されたRPCエンドポイント

設定を確認する：

```bash {% title="CLIの確認" %}
mplx agents --help
```

## 一般的なフロー

### エージェントIDの登録

`agents register` を使用すると、1つのコマンドでMPL Coreアセットを作成してエージェントIDを登録できます。デフォルトではMetaplex Agent APIを使用するため、Irysのアップロードは不要です。

```bash {% title="エージェントを登録する（APIモード）" %}
mplx agents register \
  --name "My Agent" \
  --description "An autonomous trading agent" \
  --image "./avatar.png"
```

高度なワークフロー（既存アセット、カスタムドキュメント、インタラクティブウィザード）には、`--use-ix` フラグを使用して `registerIdentityV1` インストラクションを直接送信してください。詳細は[エージェントの登録](/dev-tools/cli/agents/register)を参照してください。

### Genesisトークンのリンク

エージェントを登録してGenesisトークンのローンチを作成したら、`set-agent-token` でリンクします。これによりトークンがエージェントIDに永続的に関連付けられます。

```bash {% title="GenesisトークンをエージェントにリンクSolana" %}
mplx agents set-agent-token <AGENT_ASSET> <GENESIS_ACCOUNT>
```

{% callout type="warning" title="取り消し不可" %}
各エージェントIDが持てるトークンは1つのみです。エージェントトークンは一度しか設定できません。この操作は取り消せません。
{% /callout %}

### エグゼクティブ委任の設定

エグゼクティブ委任により、ウォレットが登録済みエージェントに代わってトランザクションに署名できます：

1. **登録**: エグゼクティブプロファイルを登録する（ウォレットごとに一度）：
```bash {% title="エグゼクティブプロファイルを登録する" %}
mplx agents executive register
```

2. **委任**: エージェントをエグゼクティブに委任する（アセットオーナーが実行）：
```bash {% title="実行を委任する" %}
mplx agents executive delegate <AGENT_ASSET> --executive <EXECUTIVE_WALLET>
```

3. **取り消し**: 委任を取り消す（オーナーまたはエグゼクティブが実行）：
```bash {% title="委任を取り消す" %}
mplx agents executive revoke <AGENT_ASSET>
```

詳細は[エグゼクティブ委任](/dev-tools/cli/agents/executive)を参照してください。

## コマンドリファレンス

| コマンド | 説明 |
|---------|-------------|
| [`agents register`](/dev-tools/cli/agents/register) | MPL CoreアセットにエージェントIDを登録する |
| [`agents fetch`](/dev-tools/cli/agents/fetch) | エージェントIDデータを取得・表示する |
| [`agents set-agent-token`](/dev-tools/cli/agents/set-agent-token) | GenesisトークンをエージェントにリンクSolana |
| [`agents executive register`](/dev-tools/cli/agents/executive) | 現在のウォレットのエグゼクティブプロファイルを作成する |
| [`agents executive delegate`](/dev-tools/cli/agents/executive) | エグゼクティブがエージェントの代わりに行動できるよう認可する |
| [`agents executive revoke`](/dev-tools/cli/agents/executive) | 実行委任を削除する |

## Notes

- エージェントIDは[Agent Registry](/agents)プログラムを通じてMPL CoreアセットからPDAとして保存されます
- デフォルトの登録フローはMetaplex Agent APIを使用します — 直接オンチェーン登録には `--use-ix` を使用してください
- `set-agent-token` はウォレットがasset-signerモードである必要があります — [Asset-Signer Wallets](/dev-tools/cli/config/asset-signer-wallets)を参照してください
- 各コマンドのフルフラグドキュメントは `mplx agents <command> --help` で確認できます
- コンセプト、アーキテクチャ、SDKガイドは[Agent Kitドキュメント](/agents)を参照してください

## よくあるエラー

| エラー | 原因 | 対処法 |
|-------|-------|-----|
| No agent identity found | アセットがエージェントとして登録されていない | 先に `agents register` でアセットを登録してください |
| Agent token already set | 2回目のトークン設定を試みた | エージェントトークンはIDごとに一度しか設定できません — 取り消し不可です |
| Executive profile already exists | 同じウォレットから `executive register` を2回呼び出した | 各ウォレットのエグゼクティブプロファイルは1つのみです — すでに設定済みです |
| Not the asset owner | オーナー以外のウォレットから委任しようとした | 実行を委任できるのはアセットオーナーのみです |
| Delegation not found | 存在しない委任を取り消そうとした | エージェントとエグゼクティブのアドレスが正しいか確認してください |

## FAQ

**mplx agentsコマンドとは何ですか？**
`mplx agents` コマンドグループを使うと、MPL CoreアセットへのエージェントIDの登録、GenesisトークンのエージェントへのリンクSolana、エグゼクティブ委任の管理をターミナルから行えます。

**エグゼクティブプロファイルとは何ですか？**
エグゼクティブプロファイルは、ウォレットが登録済みエージェントから実行委任を受け取るために必要な、一度だけ作成するオンチェーンPDAです。登録後、エグゼクティブは委任されたエージェントに代わってトランザクションに署名できます。

**Irysにアップロードせずにエージェントを登録できますか？**
はい。デフォルトでは `register` コマンドはMetaplex Agent APIを使用しており、ストレージを自動的に処理します。Irysが必要なのは、直接オンチェーン登録のために `--use-ix` フラグを使用する場合のみです。

**エージェントトークンは設定後に変更できますか？**
いいえ。エージェントトークンは `set-agent-token` コマンドを使用して、各IDにつき一度しか設定できません。この操作は取り消せません。

**APIと直接IX登録パスの違いは何ですか？**
APIパス（デフォルト）はIrysのアップロードなしで、1回のAPI呼び出しでCoreアセットの作成とID登録を行います。直接IXパス（`--use-ix`）は `registerIdentityV1` インストラクションを直接送信します。既存アセット、カスタムドキュメントワークフロー、インタラクティブウィザードで必要です。

## 用語集

| 用語 | 定義 |
|------|------------|
| **エージェントID（Agent Identity）** | MPL CoreアセットからPDAとして導出されるオンチェーンデータ。エージェントの登録データ、ライフサイクルフック、トークンの関連付けを保存する |
| **エグゼクティブプロファイル（Executive Profile）** | ウォレットに対して一度だけ作成するオンチェーンPDA。このウォレットが実行委任を受け取るために必要 |
| **実行委任（Execution Delegation）** | 登録済みエージェントとエグゼクティブプロファイルのアセットごとのリンク。エグゼクティブがエージェントに代わってトランザクションに署名できる |
| **Asset Signer PDA** | Coreアセットから派生したPDA。エージェントの組み込みウォレットとして機能。`set-agent-token` に使用される |
| **登録ドキュメント（Registration Document）** | エージェントの名前、説明、画像、サービス、信頼モデルを含むJSONドキュメント。アップロードされてIDのURIとして保存される |
