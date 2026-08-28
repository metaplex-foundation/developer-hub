---
title: 出金
metaTitle: MPL-Distro からの出金 | Metaplex CLI
description: クレーム期間が非アクティブなときに mplx distro withdraw で未クレームの MPL-Distro トークンを出金します。
keywords:
  - mplx distro withdraw
  - recover unclaimed tokens
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
  - 配布が Not Started または Ended であることを確認する
  - 配布権限者として --amount または --basisAmount を渡す
  - 必要なら --recipient で別ウォレットへ送る
howToTools:
  - Metaplex CLI (mplx)
faqs:
  - q: distro withdraw はいつ成功しますか？
    a: 権限者は startTime の前または endTime の後に出金できます。クレーム期間中はプログラムが出金を拒否します。
  - q: 誰が出金できますか？
    a: 配布権限者のみです。CLI の identity はオンチェーンの権限者と一致している必要があります。
---

{% callout title="実行内容" %}
ボールトから [MPL-Distro](/ja/smart-contracts/mpl-distro) トークンを回収します。
- クレーム期間が非アクティブなときに配布権限者として出金
- 権限者または `--recipient` へトークンを送る
{% /callout %}

## 概要

`mplx distro withdraw` コマンドは、未クレームトークンを配布ボールトから受取人の associated token account へ転送します。

- **必須引数**: 配布公開鍵
- **必須フラグ**: `--amount` または `--basisAmount`（排他）
- **署名者**: オンチェーンの配布権限者
- **期間**: クラスタ時刻が `startTime` より前、または `endTime` より後のときだけ成功

利用可能残高は `totalAmount - claimAmount` です。[資金投入と回収](/ja/smart-contracts/mpl-distro/funding-and-recovery) を参照してください。

**ジャンプ先:** [基本的な使用法](#基本的な使用法) · [オプション](#オプション) · [例](#例) · [出力](#出力) · [一般的なエラー](#一般的なエラー) · [FAQ](#faq)

## 基本的な使用法

権限者ウォレットへ出金するか、`--recipient` を渡します。

```bash {% title="権限者へ 0.5 トークンを出金" %}
mplx distro withdraw <DISTRIBUTION> --amount 0.5
```

```bash {% title="最小単位を別ウォレットへ出金" %}
mplx distro withdraw <DISTRIBUTION> \
  --basisAmount 500000 \
  --recipient <WALLET>
```

## オプション

数量フラグはちょうど 1 つ必須です。`--recipient` のデフォルトは権限者です。

| フラグ | 短縮 | 説明 | 必須 |
|------|-------|-------------|----------|
| `--amount <number>` | `-a` | mint decimals を使う人間可読の数量 | いずれか |
| `--basisAmount <integer>` | `-b` | トークン最小単位での数量 | いずれか |
| `--recipient <string>` | `-r` | 送金先ウォレット（デフォルトは権限者） | No |

decimals が 6 の mint では、`--amount 0.5` と `--basisAmount 500000` は同じ数量です。

## 例

期間終了後に余りを回収します。

```bash {% title="残っているボールトトークンを回収" %}
mplx distro withdraw <DISTRIBUTION> --amount 0.5
```

## 出力

成功時、コマンドは出金額と残りの出金可能残高を出力します。

```text {% title="期待される出力" %}
Withdrew 0.5 tokens (500000 basis) from distribution
Distribution: <DISTRIBUTION>
Mint: <TOKEN_MINT>
Amount withdrawn: 0.5 tokens (500000 basis)
Recipient: <WALLET>
Remaining available for withdrawal: 0.5 tokens (500000 basis)

Transaction: <SIGNATURE>
```

## 一般的なエラー

ボールトを引き出せないときに起きる失敗です。

| エラー | 原因 | 対処 |
|-------|-------|-----|
| Only the distribution authority can withdraw | CLI identity が権限者ではない | 権限者のキーペアに切り替える |
| Insufficient available balance for withdrawal | 数量が `totalAmount - claimAmount` を超える | 数量を下げる |
| Distribution does not have a token account | まだ入金していない | 先に入金するか、出金をスキップする |
| Withdrawal rejected during the active window | `startTime <= now <= endTime` | 開始前または終了後まで待つ |
| `InvalidPublicKeyError` | 配布引数が base58 公開鍵ではない | `distro create` が出力した PDA を渡す |

CLI は期間を事前チェックしません。プログラムが拒否を返します。

## 注意事項

withdraw が回収するのはトークンであり、未使用のレシート家賃補助金ではありません。

- CLI に `withdrawSubsidy` コマンドはありません。補助金 SOL は [JavaScript SDK](/ja/smart-contracts/mpl-distro/sdk/javascript) で回収します。
- クレーム開始前に出金を試す場合は、未来の `startTime` で配布を作成します。
- クレーム済みトークンは引き出せません。

## FAQ

**distro withdraw はいつ成功しますか？**
権限者は `startTime` の前または `endTime` の後に出金できます。クレーム期間中はプログラムが出金を拒否します。

**誰が出金できますか？**
配布権限者のみです。CLI の identity はオンチェーンの権限者と一致している必要があります。
