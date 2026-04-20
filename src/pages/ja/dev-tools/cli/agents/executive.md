---
title: エグゼクティブ委任
metaTitle: エグゼクティブ委任 | Metaplex CLI
description: Metaplex CLIを使用して、エグゼクティブプロファイルを登録し、エージェントの実行委任を管理します。
keywords:
  - agents executive
  - executive delegation
  - mplx agents executive
  - execution delegate
  - agent execution
  - Metaplex CLI
about:
  - Executive profile registration
  - Execution delegation
  - Metaplex CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
created: '04-09-2026'
updated: '04-09-2026'
howToSteps:
  - Register an executive profile with mplx agents executive register
  - Delegate an agent to the executive with mplx agents executive delegate
  - Optionally revoke a delegation with mplx agents executive revoke
howToTools:
  - Metaplex CLI (mplx)
faqs:
  - q: エグゼクティブプロファイルとは何ですか？
    a: ウォレットに対してオンチェーン上で一度だけ作成されるPDAで、登録済みエージェントから実行委任を受け取ることができます。
  - q: 1つのウォレットに複数のエグゼクティブプロファイルを作成できますか？
    a: いいえ。各ウォレットが持てるエグゼクティブプロファイルは1つだけです。登録は一度限りの操作です。
  - q: 委任を取り消せるのは誰ですか？
    a: アセットオーナーまたはエグゼクティブオーソリティのどちらでも委任を取り消せます。
---

{% callout title="実行内容" %}
登録済みエージェントの実行委任を管理します：
- エグゼクティブプロファイルを登録する（ウォレットごとに一度）
- エージェントの実行をエグゼクティブウォレットに委任する
- 不要になった委任を取り消す
{% /callout %}

## Summary

`mplx agents executive` コマンドは実行委任を管理します。登録済み[エージェント](/agents)に代わってトランザクションに署名できるウォレットを認可します。エグゼクティブはプロファイルを一度だけ登録する必要があり、その後[MPL Core](/core)アセットオーナーが実行を委任できます。

- **Register**: ウォレットごとに一度だけエグゼクティブプロファイルを作成
- **Delegate**: 登録済みエージェントをエグゼクティブにリンクする（オーナーのみ）
- **Revoke**: 委任を削除する（オーナーまたはエグゼクティブが取り消し可能）

**ジャンプ:** [エグゼクティブプロファイルの登録](#エグゼクティブプロファイルの登録) · [実行の委任](#実行の委任) · [委任の取り消し](#委任の取り消し) · [よくあるエラー](#よくあるエラー) · [FAQ](#faq)

## エグゼクティブプロファイルの登録

`agents executive register` コマンドは、現在のウォレットに対してオンチェーン上でエグゼクティブプロファイルPDAを一度だけ作成します。このプロファイルは、このウォレットへのエージェント[委任](/dev-tools/cli/agents/executive#実行の委任)が行われる前に必要です。

```bash {% title="エグゼクティブプロファイルを登録する" %}
mplx agents executive register
```

フラグや引数は不要です。プロファイルは現在の署名者のウォレットから派生します。

### 出力

```text {% title="期待される出力" %}
--------------------------------
  Executive Profile: <profile_pda_address>
  Authority: <wallet_address>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
--------------------------------
```

## 実行の委任

`agents executive delegate` コマンドは、登録済みエージェントをエグゼクティブプロファイルにリンクし、エグゼクティブがエージェントに代わってトランザクションに署名できるようにします。実行を委任できるのはアセットオーナーのみです。

```bash {% title="実行を委任する" %}
mplx agents executive delegate <AGENT_MINT> --executive <EXECUTIVE_WALLET>
```

### オプション

| フラグ | 説明 | 必須 |
|------|-------------|----------|
| `--executive <string>` | エグゼクティブのウォレットアドレス（プロファイルPDAは自動的に派生） | はい |

{% callout type="note" %}
委任の前に、エグゼクティブが `mplx agents executive register` でプロファイルを登録済みである必要があります。
{% /callout %}

### 出力

```text {% title="期待される出力" %}
--------------------------------
  Agent Mint: <agent_mint_address>
  Executive Profile: <profile_pda_address>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
--------------------------------
```

## 委任の取り消し

`agents executive revoke` コマンドは実行委任を削除し、委任レコードをクローズしてレントを返金します。アセットオーナーとエグゼクティブオーソリティのどちらでも取り消せます。

```bash {% title="委任を取り消す（オーナーとして）" %}
mplx agents executive revoke <AGENT_MINT> --executive <EXECUTIVE_WALLET>
```

```bash {% title="自分の委任を取り消す（エグゼクティブとして）" %}
mplx agents executive revoke <AGENT_MINT>
```

### オプション

| フラグ | 説明 | 必須 | デフォルト |
|------|-------------|----------|---------|
| `--executive <string>` | エグゼクティブのウォレットアドレス | いいえ | 現在の署名者 |
| `--destination <string>` | 返金されるレントを受け取るウォレット | いいえ | 現在の署名者 |

### 出力

```text {% title="期待される出力" %}
--------------------------------
  Agent Mint: <agent_mint_address>
  Executive Wallet: <executive_wallet_address>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
--------------------------------
```

## よくあるエラー

| エラー | 原因 | 対処法 |
|-------|-------|-----|
| Executive profile already exists | `register` を2回目に呼び出した | 各ウォレットのプロファイルは1つのみです — すでに登録済みです |
| Not the asset owner | オーナー以外のウォレットから委任しようとした | 実行を委任できるのはアセットオーナーのみです |
| Executive profile not found | プロファイル未登録のウォレットに委任しようとした | エグゼクティブは先に `agents executive register` を実行する必要があります |
| Delegation not found | 存在しない委任を取り消そうとした | エージェントアセットとエグゼクティブのアドレスを確認してください |

## Notes

- エグゼクティブプロファイルはウォレットごとに一度限りです — 再登録しようとすると失敗します
- 各委任はアセットごとです。エグゼクティブは複数のエージェントを委任できますが、それぞれ個別の `delegate` 呼び出しが必要です
- `--executive` なしで取り消す場合、コマンドは現在の署名者をデフォルトとします（エグゼクティブが自分の委任を取り消す場合）
- クローズされた委任レコードのレントは `--destination` ウォレットに返金されます（デフォルトは署名者）

## FAQ

**エグゼクティブプロファイルとは何ですか？**
ウォレットに対してオンチェーン上で一度だけ作成されるPDAで、登録済みエージェントから実行委任を受け取ることができます。

**1つのウォレットに複数のエグゼクティブプロファイルを作成できますか？**
いいえ。各ウォレットが持てるエグゼクティブプロファイルは1つだけです。登録は一度限りの操作です。

**委任を取り消せるのは誰ですか？**
アセットオーナーまたはエグゼクティブオーソリティのどちらでも委任を取り消せます。エグゼクティブが取り消す場合、`--executive` は省略できます（現在の署名者がデフォルト）。
