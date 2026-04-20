---
title: エージェントの取得
metaTitle: エージェントの取得 | Metaplex CLI
description: Metaplex CLIを使用して、登録済みのMPL CoreアセットのエージェントIDデータを取得・表示します。
keywords:
  - agents fetch
  - mplx agents fetch
  - agent identity
  - agent data
  - Metaplex CLI
about:
  - Agent identity lookup
  - Metaplex CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
created: '04-09-2026'
updated: '04-09-2026'
howToSteps:
  - Run mplx agents fetch with the Core asset address
  - Review the identity PDA, wallet PDA, registration URI, and lifecycle hooks
howToTools:
  - Metaplex CLI (mplx)
---

{% callout title="実行内容" %}
登録済みエージェントのオンチェーンIDデータを取得・確認します：
- エージェントIDのPDAとアセット署名者ウォレットを表示
- 登録URIとライフサイクルフックを確認
- アセットに登録済みエージェントIDがあるかどうかを検証
{% /callout %}

## Summary

`mplx agents fetch` コマンドは、[MPL Core](/core)アセットのオンチェーン[エージェントID](/agents) PDAを読み取り、登録情報、ライフサイクルフック、エージェントの組み込みウォレット（[Asset Signer PDA](/dev-tools/cli/config/asset-signer-wallets)）を表示します。

- **入力**: MPL CoreアセットのアドレスSolana（[`agents register`](/dev-tools/cli/agents/register)から取得）
- **出力**: IDのPDA、ウォレットPDA、登録URI、ライフサイクルフック
- **必須フラグなし**: アセットアドレスのみ必須。`--json` はオプション

**ジャンプ:** [クイックリファレンス](#クイックリファレンス) · [使い方](#使い方) · [出力](#出力) · [Notes](#notes)

## クイックリファレンス

| 項目 | 値 |
|------|-------|
| **コマンド** | `mplx agents fetch <AGENT_MINT>` |
| **必須引数** | `ASSET_ADDRESS` — 検索するMPL Coreアセット |
| **オプションフラグ** | `--json` — 機械可読形式の出力 |

## 使い方

```bash {% title="エージェントIDを取得する" %}
mplx agents fetch <AGENT_MINT>
```

## 出力

```text {% title="期待される出力（登録済みエージェント）" %}
{
  registered: true,
  agentMint: '<agent_mint_address>',
  owner: '<owner_address>',
  identityPda: '<identity_pda_address>',
  agentWallet: '<asset_signer_pda_address>',
  registrationUri: 'https://...',
  lifecycleChecks: { ... }
}
```

アセットに登録済みエージェントIDがない場合：

```text {% title="期待される出力（未登録）" %}
No agent identity found for this asset. The asset may not be registered.
```

## Notes

- `wallet` フィールドはAsset Signer PDAです — トランザクションへの署名と資金の保持に使用される、エージェントの組み込みウォレット
- `registrationUri` は登録時にアップロードされたJSONドキュメントを指します。エージェントの名前、説明、サービス、信頼モデルが含まれます
- 機械可読形式の出力には `--json` を使用してください
