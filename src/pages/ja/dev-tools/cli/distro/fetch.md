---
title: 取得
metaTitle: MPL-Distro 配布の取得 | Metaplex CLI
description: mplx distro fetch でオンチェーンの MPL-Distro 詳細を取得します。
keywords:
  - mplx distro fetch
  - inspect token distribution
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
  - distro create が出力した配布公開鍵を渡す
  - ステータス、mint、Merkle ルート、クレーム期間を確認する
howToTools:
  - Metaplex CLI (mplx)
---

{% callout title="実行内容" %}
ターミナルから [MPL-Distro](/ja/smart-contracts/mpl-distro) アカウントを読み取ります。
- mint、Merkle ルート、クレーム期間、アクセスモードを確認
- 配布が未開始、アクティブ、終了済みかを確認
{% /callout %}

## 概要

`mplx distro fetch` コマンドは配布アカウントを読み込み、設定を出力します。

- **必須引数**: 配布公開鍵
- **任意フラグ**: 機械可読出力の `--json`
- **ステータス**: ローカル時計と `startTime` / `endTime` から `Not Started`、`Active`、`Ended`

**ジャンプ先:** [クイックリファレンス](#クイックリファレンス) · [使用方法](#使用方法) · [出力](#出力) · [注意事項](#注意事項)

## クイックリファレンス

| 項目 | 値 |
|------|-------|
| **コマンド** | `mplx distro fetch <DISTRIBUTION>` |
| **必須引数** | base58 公開鍵としての配布 PDA |
| **任意フラグ** | `--json` |

## 使用方法

配布アドレスだけを渡します。

```bash {% title="配布の取得" %}
mplx distro fetch <DISTRIBUTION>
```

```bash {% title="JSON 出力" %}
mplx distro fetch <DISTRIBUTION> --json
```

## 出力

人間可読出力は identity、数量、期間、ルートを列挙します。

```text {% title="期待されるフィールド" %}
Distribution: <DISTRIBUTION>

Distribution Details:
  Name: Community Airdrop
  Authority: <WALLET>
  Mint: <TOKEN_MINT>
  Total Claimants: <n>
  Tree Height: <n>
  Distribution Type: Wallet | Legacy NFT
  Allowed Distributor: Permissionless | Recipient | Permissioned
  Total Amount: 1 tokens (1000000 basis)
  Claim Amount: 0 tokens (0 basis)
  Claim Count: <n>
  Subsidize Receipts: true | false
  Start Time: <ISO-8601>
  End Time: <ISO-8601>
  Status: Not Started | Active | Ended
  Merkle Root: <base58>
```

`Name` はオンチェーンに保存された UTF-8 文字列です（末尾の null は除去）。数量は mint を取得できた場合に mint decimals を使い、取得できない場合は `<n> basis` と表示します。オンチェーンでそのモードが設定されていると `Allowed Distributor` は `Permissioned` を出力し、fetch は `Permissioned Distributor` も出力します。CLI は `Permissioned` 配布を作成できないため、これらのフィールドは SDK で作成したアカウントにだけ現れます。

## 注意事項

fetch は読み取り専用コマンドです。オンチェーン状態は変更しません。

- ステータスはローカル時計を使い、Solana クラスタ時刻ではありません。
- mint アカウントを取得できない場合、`Total Amount` と `Claim Amount` は生の basis 単位にフォールバックします。
- [`distro create`](/ja/dev-tools/cli/distro/create) が出力した PDA を渡します。不正なアドレスは `InvalidPublicKeyError` になります。
