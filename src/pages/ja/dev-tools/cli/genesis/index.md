---
title: 概要
metaTitle: Genesis 概要 | Metaplex CLI
description: Metaplex CLI（mplx）を使用したトークンローンチのための Genesis CLI コマンドの概要。
keywords:
  - Genesis CLI
  - token launch CLI
  - mplx genesis
  - Solana token launch
  - Metaplex CLI
about:
  - Genesis token launches
  - Metaplex CLI
  - token distribution
  - launch pools
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
faqs:
  - q: mplx genesis コマンドとは何ですか？
    a: mplx genesis コマンドグループを使用すると、ターミナルから Genesis トークンローンチの全工程を実行できます。アカウントの作成、bucket の設定、入金、請求、権限の取り消しが含まれます。
  - q: Genesis の bucket タイプにはどのような種類がありますか？
    a: Genesis には3つの bucket タイプがあります。Launch Pool（入金額に基づく比例配分）、Presale（固定価格のトークン販売）、unlocked（直接請求できるチーム/トレジャリー割り当て）です。
  - q: 入金前に SOL をラップする必要がありますか？
    a: はい。SOL を quote token として使用する場合、bucket に入金する前に mplx toolbox sol wrap でラップしてください。
  - q: ファイナライズを元に戻すことはできますか？
    a: いいえ。ファイナライズは不可逆です。ファイナライズ後は bucket の追加ができなくなり、設定がロックされます。
  - q: トークン量はどのように指定しますか？
    a: すべての金額は base units で指定します。小数点以下9桁の場合、1,000,000 トークン = 1000000000000000 base units です。入金額は quote token の base units（SOL の場合は lamports）を使用します。
---

{% callout title="このページの内容" %}
Genesis トークンローンチの完全な CLI リファレンス：
- **API フロー**: Genesis API を使用して単一コマンドでローンチを作成・登録
- **手動フロー**: Genesis アカウントの作成、bucket の設定、入金、請求、権限の取り消し
{% /callout %}

## 概要

`mplx genesis` コマンドを使用すると、ターミナルから Genesis トークンローンチの全工程を実行できます。アカウントの作成、bucket の設定、入金、請求、権限の取り消しが含まれます。

- **ツール**: Metaplex CLI（`mplx`）の `genesis` コマンドグループ
- **bucket タイプ**: Launch Pool（比例配分）、Presale（固定価格）、unlocked（トレジャリー）
- **Quote token（手動フロー）**: デフォルトは Wrapped SOL、任意の SPL token mint アドレスに対応
- **Quote token（API フロー）**: 現在 SOL または USDC のみ対応
- **不可逆な操作**: `finalize` と `revoke` は元に戻すことができません

## 対象外

Genesis スマートコントラクトの内部構造、SDK/TypeScript 統合、フロントエンド開発、トークンエコノミクスの設計、ローンチ後の流動性プールのセットアップ。

**移動先:** [前提条件](#prerequisites) · [一般的なフロー](#general-flow) · [コマンドリファレンス](#command-reference) · [一般的なエラー](#common-errors) · [FAQ](#faq) · [用語集](#glossary)

*Metaplex Foundation によるメンテナンス · 最終確認 2026年2月 · Metaplex CLI（mplx）が必要*

## 前提条件

- Metaplex CLI がインストールされ、`PATH` に設定されていること
- Solana キーペアファイル（例: `~/.config/solana/id.json`）
- トランザクション手数料用の SOL
- `mplx config rpc add` で設定された RPC エンドポイント、または `-r` で渡すこと

セットアップを確認：

```bash {% title="CLI の確認" %}
mplx genesis --help
```

## 一般的なフロー

Genesis CLI でトークンをローンチするには2つの方法があります：

### API フロー（推奨）

`genesis launch create` を使用すると、Genesis API を呼び出してトランザクションを構築・署名し、Metaplex プラットフォームにローンチを登録する、オールインワンのフローを実行できます。API を通じて作成されたローンチは [metaplex.com](https://metaplex.com) と互換性があり、公開ローンチページとしてプラットフォームに表示されます。

```bash {% title="ワンコマンドローンチ" %}
mplx genesis launch create \
  --name "My Token" --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --tokenAllocation 500000000 \
  --depositStartTime 2025-03-01T00:00:00Z \
  --raiseGoal 200 --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS>
```

詳細は [Launch（API）](/dev-tools/cli/genesis/launch) を参照してください。

### 手動フロー

すべてのステップを完全にコントロールする場合：

1. **作成** — `genesis create` で Genesis アカウントとトークン mint をセットアップします。
2. **bucket の追加** — トークンの配布方法を定義するために1つ以上の bucket を追加します。比例配分には `bucket add-launch-pool`、固定価格販売には `bucket add-presale`、チーム/トレジャリー割り当てには `bucket add-unlocked` を使用します。
3. **ファイナライズ** — `genesis finalize` で設定をロックします。このステップ以降は bucket を追加できません。
4. **入金** — ユーザーは入金ウィンドウ中に `genesis deposit` または `genesis presale deposit` を使用して quote token（例: Wrapped SOL）を bucket に入金します。
5. **出金**（オプション） — ユーザーは入金期間中に `genesis withdraw` で Launch Pool から出金できます。
6. **トランジション**（オプション） — Launch Pool に終了動作がある場合、入金終了後に `genesis transition` を呼び出して収集されたトークンを宛先 bucket に転送します。
7. **請求** — 請求期間が開始した後、ユーザーは `genesis claim` または `genesis presale claim` で base token を請求します。トレジャリーウォレットは `genesis claim-unlocked` を使用します。
8. **取り消し**（オプション） — `genesis revoke` でトークンの mint 権限および/または freeze 権限を永久に取り消します。

手動フローを使用し、公開ローンチページが必要な場合は、`genesis launch register` を使用して genesis アカウントを Metaplex プラットフォームに登録してください。

`genesis fetch` と `genesis bucket fetch` を使用して、いつでもローンチの状態を確認できます。

## コマンドリファレンス

| コマンド | 説明 |
|---------|------|
| `genesis launch create` | Genesis API を使用してローンチを作成・登録（オールインワン） |
| `genesis launch register` | 既存の genesis アカウントを Metaplex プラットフォームに登録 |
| `genesis create` | 新しい Genesis アカウントとトークンを作成 |
| `genesis finalize` | 設定をロックしてローンチを有効化 |
| `genesis fetch` | Genesis アカウントの詳細を取得 |
| `genesis revoke` | mint/freeze 権限を取り消し |
| `genesis bucket add-launch-pool` | Launch Pool bucket を追加 |
| `genesis bucket add-presale` | Presale bucket を追加 |
| `genesis bucket add-unlocked` | unlocked（トレジャリー）bucket を追加 |
| `genesis bucket fetch` | タイプ別に bucket の詳細を取得 |
| `genesis deposit` | Launch Pool に入金 |
| `genesis withdraw` | Launch Pool から出金 |
| `genesis transition` | 入金期間後に終了動作を実行 |
| `genesis claim` | Launch Pool からトークンを請求 |
| `genesis claim-unlocked` | unlocked bucket から請求 |
| `genesis presale deposit` | Presale bucket に入金 |
| `genesis presale claim` | Presale bucket からトークンを請求 |

## 注意事項

- `totalSupply` と `allocation` は base units で指定します — 小数点以下9桁の場合、`1000000000000000` = 1,000,000 トークン
- 入金額と出金額は quote token の base units で指定します（SOL の場合は lamports、1 SOL = 1,000,000,000 lamports）
- SOL を quote token として使用する場合、まず `mplx toolbox sol wrap <amount>` でラップしてください
- ファイナライズは不可逆です — `genesis finalize` を実行する前にすべての bucket 設定を再確認してください
- 任意のコマンドの完全なフラグドキュメントは `mplx genesis <command> --help` で確認できます
- コンセプト、ライフサイクルの詳細、SDK ガイドについては [Genesis ドキュメント](/smart-contracts/genesis) を参照してください

## 一般的なエラー

| エラー | 原因 | 対処法 |
|-------|------|--------|
| Account not found | Genesis アドレスが間違っているか、ネットワークが異なる | アドレスを確認し、`mplx config rpc list` で RPC エンドポイントを確認してください |
| Genesis already finalized | `finalize` 後に bucket を追加しようとした | ファイナライズは不可逆です — 設定が間違っている場合は新しい Genesis アカウントを作成してください |
| Allocation exceeds total supply | bucket の割り当ての合計が `totalSupply` を超えている | 割り当てを減らして合計が `totalSupply` 以下になるようにしてください |
| Deposit period not active | 入金ウィンドウ外で入金しようとした | `genesis bucket fetch` でタイムスタンプを確認してください — 入金は `depositStart` と `depositEnd` の間のみ可能です |
| Claim period not active | 請求ウィンドウが開く前に請求しようとした | `claimStart` タイムスタンプまでお待ちください |
| Insufficient funds | ウォレットに十分な SOL または quote token がない | ウォレットに資金を追加し、必要に応じて `mplx toolbox sol wrap` で SOL をラップしてください |
| No wrapped SOL | ラップされていない SOL を入金しようとした | まず SOL をラップしてください: `mplx toolbox sol wrap <amount>` |

## FAQ

**mplx genesis コマンドとは何ですか？**
`mplx genesis` コマンドグループを使用すると、ターミナルから Genesis トークンローンチの全工程を実行できます。アカウントの作成、bucket の設定、入金、請求、権限の取り消しが含まれます。

**Genesis の bucket タイプにはどのような種類がありますか？**
Genesis には3つの bucket タイプがあります：**Launch Pool**（入金額に基づく比例配分）、**Presale**（固定価格のトークン販売）、**unlocked**（直接請求できるチーム/トレジャリー割り当て）。

**入金前に SOL をラップする必要がありますか？**
はい。SOL を quote token として使用する場合、bucket に入金する前に `mplx toolbox sol wrap <amount>` でラップしてください。

**ファイナライズを元に戻すことはできますか？**
いいえ。ファイナライズは不可逆です。ファイナライズ後は bucket の追加ができなくなり、設定がロックされます。`genesis finalize` を実行する前にすべてを再確認してください。

**トークン量はどのように指定しますか？**
すべての金額は base units で指定します。小数点以下9桁の場合、1,000,000 トークン = `1000000000000000` base units です。入金額は quote token の base units（SOL の場合は lamports、1 SOL = 1,000,000,000 lamports）を使用します。

**同じタイプの bucket を複数持つことはできますか？**
はい。`--bucketIndex` フラグを使用して、同じタイプの各 bucket に異なるインデックスを指定してください。

## 用語集

| 用語 | 定義 |
|------|------|
| **Genesis Account** | トークンローンチ全体を管理する PDA — 設定、bucket の参照、mint 権限を保持します |
| **bucket** | Genesis ローンチ内の配布チャネルで、トークンの一部がどのように割り当てられ配布されるかを定義します |
| **Launch Pool** | 入金ウィンドウ中に入金を収集し、入金者に比例してトークンを配布する bucket タイプ |
| **Presale** | `quoteCap / allocation` で決定される固定価格でトークンを販売する bucket タイプ |
| **Unlocked Bucket** | チーム/トレジャリー用の bucket タイプ — 指定された受取人がトークンまたは転送された quote token を直接請求できます |
| **Quote Token** | base token と引き換えにユーザーが入金するトークン（通常は Wrapped SOL） |
| **Base Token** | ローンチされ、入金者に配布されるトークン |
| **Base Units** | トークンの最小単位 — 小数点以下9桁の場合、1 トークン = 1,000,000,000 base units |
| **End Behavior** | 入金期間後に Launch Pool から収集された quote token を宛先 bucket に転送するルール |
| **Finalize** | Genesis の設定をロックしてローンチを有効化する不可逆な操作 |
| **Claim Schedule** | 請求期間開始後にトークンがどのように段階的にリリースされるかを制御するべスティングルール |
| **Allocation** | 特定の bucket に割り当てられた base token の量（base units で指定） |
