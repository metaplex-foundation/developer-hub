---
title: エージェントの登録
metaTitle: エージェントの登録 | Metaplex CLI
description: Metaplex CLIを使用して、MPL CoreアセットにエージェントIDを登録します。
keywords:
  - agents register
  - agent identity
  - mplx agents register
  - agent registration
  - Metaplex CLI
about:
  - Agent identity registration
  - MPL Core assets
  - Metaplex CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
created: '04-09-2026'
updated: '04-09-2026'
howToSteps:
  - Run mplx agents register with --name, --description, and --image to register via the API
  - Optionally use --use-ix for direct on-chain registration or --wizard for interactive mode
  - Save the Asset address from the output for subsequent commands
howToTools:
  - Metaplex CLI (mplx)
faqs:
  - q: mplx agents registerは何をしますか？
    a: MPL CoreアセットをSolana作成し、そこにエージェントIDを登録します。IDはアセットアドレスから派生したPDAとして保存されます。
  - q: APIと直接IX登録の違いは何ですか？
    a: APIパス（デフォルト）はIrysのアップロードなしで、1回のAPI呼び出しでアセット作成とID登録を行います。直接IXパス（--use-ix）はregisterIdentityV1インストラクションを直接送信します。既存アセット、カスタムドキュメント、ウィザードで必要です。
  - q: 既存のCoreアセットにエージェントを登録できますか？
    a: はい。最初の引数としてアセットアドレスを渡して --use-ix を使用してください。アセットにはすでにエージェントIDが登録されていない必要があります。
---

{% callout title="実行内容" %}
MPL CoreアセットにエージェントIDを登録します：
- 新しいCoreアセットをSolana作成してエージェントIDを登録する（または既存アセットに登録する）
- エージェントの名前、説明、画像、サービス、信頼モデルを設定する
- APIモード（デフォルト）または直接オンチェーン登録を選択する
{% /callout %}

## Summary

`mplx agents register` コマンドは[MPL Core](/core)アセットをSolana作成し、そこに[エージェントID](/agents)を登録します。デフォルトではMetaplex Agent APIを使用した1ステップフローで、Irysのアップロードは不要です。

- **デフォルトモード**: API — 1回の呼び出しでアセット作成とID登録を行う
- **直接IXモード**: `--use-ix` — `registerIdentityV1` をオンチェーンに送信（既存アセット、ウィザード、カスタムドキュメントに必要）
- **出力**: その後のエージェントコマンド（[`agents fetch`](/dev-tools/cli/agents/fetch)、[`set-agent-token`](/dev-tools/cli/agents/set-agent-token) など）で使用するアセットアドレス

**ジャンプ:** [基本的な使い方](#基本的な使い方) · [オプション](#オプション) · [登録ワークフロー](#登録ワークフロー) · [使用例](#使用例) · [出力](#出力) · [よくあるエラー](#よくあるエラー) · [FAQ](#faq)

## 基本的な使い方

デフォルトのAPIモードは必須フラグを最小限にしてエージェントを登録します：

```bash {% title="エージェントを登録する（APIモード）" %}
mplx agents register \
  --name "My Agent" \
  --description "An autonomous trading agent" \
  --image "./avatar.png"
```

## オプション

| フラグ | Short | 説明 | 必須 | デフォルト |
|------|-------|-------------|----------|---------|
| `--name <string>` | | エージェント名 | はい（`--wizard` または `--from-file` 以外の場合） | |
| `--description <string>` | | エージェントの説明 | いいえ | |
| `--image <string>` | | エージェント画像のファイルパス（アップロード）または既存のURI | いいえ | |
| `--use-ix` | | APIの代わりに `registerIdentityV1` インストラクションを直接送信する | いいえ | `false` |
| `--new` | | 新しいCoreアセットを作成して登録する（`--use-ix` と一緒にのみ使用） | いいえ | `false` |
| `--owner <string>` | | 新しいアセットのオーナー公開鍵（`--new` と一緒にのみ使用） | いいえ | 署名者 |
| `--collection <string>` | | アセットが属するコレクションアドレス | いいえ | |
| `--wizard` | | 登録ドキュメントを構築するためのステップバイステップのガイド付き登録（`--use-ix` を含意） | いいえ | |
| `--from-file <path>` | | アップロードするローカルのエージェント登録JSONファイルへのパス（`--use-ix` を含意） | いいえ | |
| `--active` | | 登録ドキュメントでエージェントをアクティブとして設定する | いいえ | `true` |
| `--services <json>` | | JSONアレイとしてのサービスエンドポイント | いいえ | |
| `--supported-trust <json>` | | JSONアレイとしてのサポートされる信頼モデル | いいえ | |
| `--save-document <path>` | | 生成されたドキュメントのJSONをローカルファイルに保存する | いいえ | |

{% callout type="note" title="相互に排他的なフラグ" %}
`--wizard`、`--from-file`、`--name` は相互に排他的です — 登録ドキュメントのソースを指定するために、いずれか1つのみを使用してください。
{% /callout %}

## 登録ワークフロー

### APIモード（デフォルト）

最もシンプルなパスです — 1回のAPI呼び出しでCoreアセットを作成してIDを登録します。Irysのアップロードや `--use-ix` フラグは不要です。

```bash {% title="API登録" %}
mplx agents register \
  --name "My Agent" \
  --description "An autonomous trading agent" \
  --image "./avatar.png"
```

### 新しいアセットでの直接IX

`--new` と `--use-ix` フラグを使うと、新しいCoreアセットを作成して `registerIdentityV1` インストラクションを直接送信します。登録ドキュメントはIrysにアップロードされます。

```bash {% title="直接IX — 新しいアセット" %}
mplx agents register --new --use-ix \
  --name "My Agent" \
  --description "An AI agent" \
  --image "./avatar.png"
```

### 既存のアセットでの直接IX

最初の引数として渡されたアセットアドレスで、既存のCoreアセットにIDを登録します。

```bash {% title="直接IX — 既存のアセット" %}
mplx agents register <ASSET_ADDRESS> --use-ix \
  --from-file "./agent-doc.json"
```

### インタラクティブウィザード

`--wizard` フラグはステップバイステップのガイド付き登録を提供し、自動的に `--use-ix` を有効にします。

```bash {% title="ウィザードモード" %}
mplx agents register --new --wizard
```

## 使用例

サービスエンドポイントを指定して登録する：

```bash {% title="MCPサービスエンドポイントを指定" %}
mplx agents register \
  --name "My Agent" \
  --description "An AI agent with MCP" \
  --image "./avatar.png" \
  --services '[{"name":"MCP","endpoint":"https://myagent.com/mcp"}]'
```

信頼モデルを指定して登録する：

```bash {% title="信頼モデルを指定" %}
mplx agents register \
  --name "My Agent" \
  --description "A trusted agent" \
  --image "./avatar.png" \
  --supported-trust '["reputation","tee-attestation"]'
```

登録せずに登録ドキュメントをローカルに保存する：

```bash {% title="ドキュメントをファイルに保存する" %}
mplx agents register \
  --name "My Agent" \
  --description "An AI agent" \
  --save-document "./my-agent-doc.json"
```

## 出力

```text {% title="期待される出力" %}
--------------------------------
  Asset: <asset_address>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
--------------------------------
```

`Asset` アドレスを保存してください — `agents fetch`、`agents set-agent-token`、`agents executive delegate` で使用します。

## よくあるエラー

| エラー | 原因 | 対処法 |
|-------|-------|-----|
| Provide --wizard, --from-file, or --name | ドキュメントソースが指定されていない | `--name`、`--wizard`、`--from-file` のいずれかを追加してください |
| --services must be a valid JSON array | `--services` のJSONが不正 | `'[{"name":"MCP","endpoint":"https://..."}]'` の形式を使用してください |
| --supported-trust must be a valid JSON array | JSONが不正 | `'["reputation","tee-attestation"]'` の形式を使用してください |
| API does not support localnet | ローカルバリデーターに対して実行している | ローカルネット登録には `--use-ix` を使用してください |
| Validation error on field | APIがフィールド値を拒否した | エラーメッセージ内のフィールド名を確認して値を修正してください |

## Notes

- APIパスはIrysを必要としません — APIがドキュメントストレージを自動的に処理します
- 直接IXパス（`--use-ix`）は、オンチェーンインストラクションを送信する前にドキュメントをIrysにアップロードします
- `--wizard` と `--from-file` はどちらも `--use-ix` を含意します — 常に直接オンチェーンパスを使用します
- `--use-ix` を `--name`、`--from-file`、`--wizard` と一緒に使用すると、ドキュメントがIrysにアップロードされ、URIがオンチェーンに保存されます
- `--services` と `--supported-trust` は `--name` が必要です — `--wizard` や `--from-file` とは使用できません

## FAQ

**mplx agents registerは何をしますか？**
MPL CoreアセットをSolana作成し、そこにエージェントIDを登録します。IDはアセットアドレスから派生したPDAとして保存されます。

**APIと直接IX登録の違いは何ですか？**
APIパス（デフォルト）はIrysのアップロードなしで、1回のAPI呼び出しでアセット作成とID登録を行います。直接IXパス（`--use-ix`）は `registerIdentityV1` インストラクションを直接送信します。既存アセット、カスタムドキュメント、ウィザードで必要です。

**既存のCoreアセットにエージェントを登録できますか？**
はい。最初の引数としてアセットアドレスを渡して `--use-ix` を使用してください。アセットにはすでにエージェントIDが登録されていない必要があります。
