---
title: 入金
metaTitle: MPL-Distro への入金 | Metaplex CLI
description: mplx distro deposit で SPL トークンを MPL-Distro ボールトへ入金します。
keywords:
  - mplx distro deposit
  - fund token distribution
  - MPL-Distro CLI
  - Metaplex CLI
about:
  - MPL-Distro
  - Metaplex CLI
  - token distribution
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
created: '08-27-2026'
updated: '08-27-2026'
howToSteps:
  - distro create が出力した配布アドレスを渡す
  - mint decimals の --amount か最小単位の --basisAmount を選ぶ
  - コマンド出力で新しいボールト合計を確認する
howToTools:
  - Metaplex CLI (mplx)
faqs:
  - q: 入金するにはクレーム期間がアクティブである必要がありますか？
    a: いいえ。入金はクレーム期間の前、最中、後のいずれでも可能です。
  - q: --amount と --basisAmount の違いは何ですか？
    a: --amount は mint の decimals を使う小数（1.0 は 1 トークン）です。--basisAmount は生の最小単位です（decimals が 6 のとき 1_000_000 が 1 トークン）。
---

{% callout title="実行内容" %}
ウォレットから [MPL-Distro](/ja/smart-contracts/mpl-distro) ボールトへ SPL トークンを移します。
- 人間可読の数量または生の最小単位で入金
- 配布上の新しい `totalAmount` を確認
{% /callout %}

## 概要

`mplx distro deposit` コマンドは、現在の identity の associated token account から配布ボールトへトークンを転送します。

- **必須引数**: 配布公開鍵
- **必須フラグ**: `--amount` または `--basisAmount`（排他）
- **入金に時間制限はない**: クレーム期間がアクティブである必要はありません

identity は十分なトークンを持っている必要があります。コマンドは `--amount` の変換のために mint decimals を取得します。

**ジャンプ先:** [基本的な使用法](#基本的な使用法) · [オプション](#オプション) · [例](#例) · [出力](#出力) · [一般的なエラー](#一般的なエラー) · [FAQ](#faq)

## 基本的な使用法

配布アドレスと数量フラグを 1 つ渡します。

```bash {% title="1.0 トークンを入金" %}
mplx distro deposit <DISTRIBUTION> --amount 1.0
```

```bash {% title="1,000,000 最小単位を入金" %}
mplx distro deposit <DISTRIBUTION> --basisAmount 1000000
```

## オプション

`--amount` または `--basisAmount` のどちらか一方だけを設定します。

| フラグ | 短縮 | 説明 | 必須 |
|------|-------|-------------|----------|
| `--amount <number>` | `-a` | mint decimals を使う人間可読の数量 | いずれか |
| `--basisAmount <integer>` | `-b` | トークン最小単位での数量 | いずれか |

decimals が 6 の mint では、`--amount 1.0` と `--basisAmount 1000000` は同じ数量です。

## 例

[`distro create`](/ja/dev-tools/cli/distro/create) の後に入金します。

```bash {% title="新しい配布に資金を入れる" %}
mplx distro deposit <DISTRIBUTION> --amount 1.0
```

## 出力

成功時、コマンドは小数と最小単位の数量を出力します。

```text {% title="期待される出力" %}
Deposited 1 tokens (1000000 basis) to distribution
Distribution: <DISTRIBUTION>
Mint: <TOKEN_MINT>
Amount deposited: 1 tokens (1000000 basis)
New total deposited: 1 tokens (1000000 basis)

Transaction: <SIGNATURE>
```

decimals を反映した合計にはこの出力を使います。mint を取得できる場合、[`distro fetch`](/ja/dev-tools/cli/distro/fetch) も同じトークン数量を出力します。

## 一般的なエラー

ボールトに資金を入れられないときに起きる失敗です。

| エラー | 原因 | 対処 |
|-------|-------|-----|
| Either `--amount` or `--basisAmount` must be provided | 数量フラグがどちらも未設定 | 2 つのフラグのどちらかを渡す |
| Insufficient balance | identity の ATA のトークンが要求より少ない | 先にミントまたは送金する |
| You do not have a token account for this mint | この mint の ATA がない | 先にトークンを受け取るかミントする |
| `InvalidPublicKeyError` | 配布引数が base58 公開鍵ではない | `distro create` が出力した PDA を渡す |
| Distribution not found | PDA またはクラスタが違う | 同じ RPC で `distro fetch` を実行する |

## 注意事項

deposit はボールトが Merkle 割り当ての合計をカバーするか検証しません。

- クレーム開始前に、ツリー内のすべての `amount` の合計以上を入金してください。[資金投入と回収](/ja/smart-contracts/mpl-distro/funding-and-recovery) を参照してください。
- 入金はクレーム期間の前、最中、後のいずれでも可能です。
- トークン mint は [`toolbox token create`](/ja/dev-tools/cli/toolbox/token-create) で作成し、供給は [`toolbox token mint`](/ja/dev-tools/cli/toolbox/token-mint) で追加します（`mint` の数量は生の最小単位）。

## FAQ

**入金するにはクレーム期間がアクティブである必要がありますか？**
いいえ。入金はクレーム期間の前、最中、後のいずれでも可能です。

**--amount と --basisAmount の違いは何ですか？**
`--amount` は mint の decimals を使う小数です（`1.0` は 1 トークン）。`--basisAmount` は生の最小単位です（decimals が 6 のとき `1000000` が 1 トークン）。
