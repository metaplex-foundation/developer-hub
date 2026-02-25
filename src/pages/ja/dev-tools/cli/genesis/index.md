---
title: 概要
metaTitle: Genesis 概要 | Metaplex CLI
description: Metaplex CLI（mplx）を使用したGenesisトークンローンチのCLIコマンドの概要。
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
  - q: What is the mplx genesis command?
    a: mplx genesisコマンドグループを使用すると、ターミナルからGenesisトークンローンチの全工程を実行できます — アカウントの作成、bucketの設定、入金、請求、権限の取り消しが含まれます。
  - q: What are the different bucket types in Genesis?
    a: Genesisには3種類のbucketがあります — Launch Pool（入金額に基づく比例配分）、Presale（固定価格トークン販売）、unlocked（チーム/トレジャリー割り当て、直接請求可能）。
  - q: Do I need to wrap SOL before depositing?
    a: はい。SOLをクォートトークンとして使用する場合は、bucketに入金する前にmplx toolbox sol wrapでラップする必要があります。
  - q: Can I undo finalization?
    a: いいえ。ファイナライズは取り消せません。ファイナライズ後はbucketの追加ができず、設定はロックされます。
  - q: How are token amounts specified?
    a: すべての金額は基本単位で指定します。小数点以下9桁の場合、1,000,000トークン = 1000000000000000基本単位です。入金額はクォートトークンの基本単位（SOLの場合はlamports）を使用します。
---

{% callout title="このページの内容" %}
Genesisトークンローンチの完全なCLIリファレンス:
- **APIフロー**: Genesis APIを使用して単一のコマンドでローンチを作成・登録
- **手動フロー**: Genesisアカウントの作成、bucketの設定、入金、請求、権限の取り消し
{% /callout %}

## 概要

`mplx genesis`コマンドを使用すると、ターミナルからGenesisトークンローンチの全工程を実行できます — アカウントの作成、bucketの設定、入金、請求、権限の取り消しが含まれます。

- **ツール**: Metaplex CLI（`mplx`）の`genesis`コマンドグループ
- **Bucket種類**: Launch Pool（比例配分）、Presale（固定価格）、unlocked（トレジャリー）
- **クォートトークン（手動フロー）**: デフォルトはWrapped SOL、任意のSPLトークンミントアドレスに対応
- **クォートトークン（APIフロー）**: 現在SOLまたはUSDCのみ対応
- **取り消し不可のアクション**: `finalize`と`revoke`は元に戻せません

## 対象範囲外

Genesisスマートコントラクトの内部構造、SDK/TypeScript統合、フロントエンド開発、トークンエコノミクス設計、ローンチ後の流動性プールのセットアップ。

**ジャンプ先:** [前提条件](#prerequisites) · [一般的なフロー](#general-flow) · [コマンドリファレンス](#command-reference) · [よくあるエラー](#common-errors) · [FAQ](#faq) · [用語集](#glossary)

*Metaplex Foundationによる管理 · 最終検証 2026年2月 · Metaplex CLI（mplx）が必要*

## 前提条件

- Metaplex CLIがインストールされ、`PATH`に設定されていること
- Solanaキーペアファイル（例: `~/.config/solana/id.json`）
- トランザクション手数料用のSOL
- `mplx config rpc add`で設定済み、または`-r`で指定するRPCエンドポイント

セットアップを確認:

```bash {% title="CLIの確認" %}
mplx genesis --help
```

## 一般的なフロー

Genesis CLIでトークンをローンチするには2つの方法があります:

### APIフロー（推奨）

`genesis launch create`を使用して、Genesis APIの呼び出し、トランザクションの構築・署名、Metaplexプラットフォームへのローンチ登録をすべて単一のコマンドで実行するオールインワンフローです。APIを通じて作成されたローンチは[metaplex.com](https://metaplex.com)と互換性があり、公開ローンチページ付きでプラットフォームに表示されます。

```bash {% title="ワンコマンドローンチ" %}
mplx genesis launch create \
  --name "My Token" --symbol "MTK" \
  --image "https://gateway.irys.xyz/abc123" \
  --tokenAllocation 500000000 \
  --depositStartTime 2025-03-01T00:00:00Z \
  --raiseGoal 200 --raydiumLiquidityBps 5000 \
  --fundsRecipient <WALLET_ADDRESS>
```

詳細は[Launch (API)](/dev-tools/cli/genesis/launch)を参照してください。

### 手動フロー

各ステップを完全に制御する場合:

1. **作成** — `genesis create`でGenesisアカウントとトークンミントをセットアップします。
2. **Bucketの追加** — 1つ以上のbucketを追加してトークンの配布方法を定義します。比例配分には`bucket add-launch-pool`、固定価格販売には`bucket add-presale`、チーム/トレジャリー割り当てには`bucket add-unlocked`を使用します。
3. **ファイナライズ** — `genesis finalize`で設定をロックします。このステップ以降、bucketの追加はできません。
4. **入金** — ユーザーは入金期間中に`genesis deposit`または`genesis presale deposit`を使用して、クォートトークン（例: Wrapped SOL）をbucketに入金します。
5. **出金**（任意） — ユーザーは入金期間中に`genesis withdraw`でLaunch Poolから出金できます。
6. **トランジション**（任意） — Launch Poolにエンドビヘイビアがある場合、入金終了後に`genesis transition`を呼び出して、収集されたトークンを宛先bucketに転送します。
7. **請求** — 請求期間が開始したら、`genesis claim`または`genesis presale claim`でベーストークンを請求します。トレジャリーウォレットは`genesis claim-unlocked`を使用します。
8. **取り消し**（任意） — `genesis revoke`でトークンのミント権限やフリーズ権限を永久に取り消します。

手動フローを使用して公開ローンチページが必要な場合は、`genesis launch register`を使用してGenesisアカウントをMetaplexプラットフォームに登録します。

`genesis fetch`と`genesis bucket fetch`で、いつでもローンチの状態を確認できます。

## コマンドリファレンス

| コマンド | 説明 |
|---------|------|
| `genesis launch create` | Genesis APIを使用してローンチを作成・登録（オールインワン） |
| `genesis launch register` | 既存のGenesisアカウントをMetaplexプラットフォームに登録 |
| `genesis create` | 新しいGenesisアカウントとトークンを作成 |
| `genesis finalize` | 設定をロックしてローンチを有効化 |
| `genesis fetch` | Genesisアカウントの詳細を取得 |
| `genesis revoke` | ミント/フリーズ権限を取り消し |
| `genesis bucket add-launch-pool` | Launch Pool bucketを追加 |
| `genesis bucket add-presale` | Presale bucketを追加 |
| `genesis bucket add-unlocked` | unlocked（トレジャリー）bucketを追加 |
| `genesis bucket fetch` | タイプ別にbucketの詳細を取得 |
| `genesis deposit` | Launch Poolに入金 |
| `genesis withdraw` | Launch Poolから出金 |
| `genesis transition` | 入金期間後にエンドビヘイビアを実行 |
| `genesis claim` | Launch Poolからトークンを請求 |
| `genesis claim-unlocked` | unlocked bucketから請求 |
| `genesis presale deposit` | Presale bucketに入金 |
| `genesis presale claim` | Presale bucketからトークンを請求 |

## 注意事項

- `totalSupply`と`allocation`は基本単位で指定します — 小数点以下9桁の場合、`1000000000000000` = 1,000,000トークン
- 入金額と出金額はクォートトークンの基本単位で指定します（SOLの場合はlamports、1 SOL = 1,000,000,000 lamports）
- SOLをクォートトークンとして使用する場合は、先に`mplx toolbox sol wrap <amount>`でラップしてください
- ファイナライズは取り消せません — `genesis finalize`を実行する前にすべてのbucket設定を再確認してください
- 各コマンドの完全なフラグドキュメントは`mplx genesis <command> --help`で確認できます
- コンセプト、ライフサイクルの詳細、SDKガイドについては[Genesisドキュメント](/smart-contracts/genesis)を参照してください

## よくあるエラー

| エラー | 原因 | 修正方法 |
|--------|------|----------|
| Account not found | Genesisアドレスが間違っているか、ネットワークが異なる | アドレスを確認し、`mplx config rpc list`でRPCエンドポイントを確認してください |
| Genesis already finalized | `finalize`後にbucketを追加しようとした | ファイナライズは取り消せません — 設定が間違っている場合は新しいGenesisアカウントを作成してください |
| Allocation exceeds total supply | bucketの割り当て合計が`totalSupply`を超えている | 割り当ての合計が`totalSupply`以下になるよう減らしてください |
| Deposit period not active | 入金期間外に入金しようとした | `genesis bucket fetch`でタイムスタンプを確認してください — 入金は`depositStart`から`depositEnd`の間のみ可能です |
| Claim period not active | 請求期間開始前に請求しようとした | `claimStart`のタイムスタンプまで待ってください |
| Insufficient funds | ウォレットのSOLまたはクォートトークンが不足 | ウォレットに資金を追加し、必要に応じて`mplx toolbox sol wrap`でSOLをラップしてください |
| No wrapped SOL | ラップされていないSOLを入金しようとした | 先にSOLをラップしてください: `mplx toolbox sol wrap <amount>` |

## FAQ

**mplx genesisコマンドとは何ですか？**
`mplx genesis`コマンドグループを使用すると、ターミナルからGenesisトークンローンチの全工程を実行できます — アカウントの作成、bucketの設定、入金、請求、権限の取り消しが含まれます。

**Genesisのbucketタイプにはどのようなものがありますか？**
Genesisには3種類のbucketがあります: **Launch Pool**（入金額に基づく比例配分）、**Presale**（固定価格トークン販売）、**unlocked**（チーム/トレジャリー割り当て、直接請求可能）。

**入金前にSOLをラップする必要がありますか？**
はい。SOLをクォートトークンとして使用する場合は、bucketに入金する前に`mplx toolbox sol wrap <amount>`でラップしてください。

**ファイナライズを取り消せますか？**
いいえ。ファイナライズは取り消せません。ファイナライズ後はbucketの追加ができず、設定はロックされます。`genesis finalize`を実行する前にすべてを再確認してください。

**トークン量はどのように指定しますか？**
すべての金額は基本単位で指定します。小数点以下9桁の場合、1,000,000トークン = `1000000000000000`基本単位です。入金額はクォートトークンの基本単位（SOLの場合はlamports、1 SOL = 1,000,000,000 lamports）を使用します。

**同じタイプのbucketを複数持てますか？**
はい。`--bucketIndex`フラグを使用して、同じタイプの各bucketに異なるインデックスを指定してください。

## 用語集

| 用語 | 定義 |
|------|------|
| **Genesis Account** | トークンローンチ全体を管理するPDA — 設定、bucket参照、ミント権限を保持 |
| **Bucket** | Genesisローンチ内の配布チャネル。トークンの一部がどのように割り当てられ配布されるかを定義 |
| **Launch Pool** | 入金期間中に入金を集め、入金者に比例してトークンを配布するbucketタイプ |
| **Presale** | `quoteCap / allocation`で決定される固定価格でトークンを販売するbucketタイプ |
| **Unlocked Bucket** | チーム/トレジャリー用のbucketタイプ — 指定された受取人がトークンまたは転送されたクォートトークンを直接請求可能 |
| **Quote Token** | ベーストークンと引き換えにユーザーが入金するトークン（通常はWrapped SOL） |
| **Base Token** | ローンチされ、入金者に配布されるトークン |
| **Base Units** | トークンの最小単位 — 小数点以下9桁の場合、1トークン = 1,000,000,000基本単位 |
| **End Behavior** | 入金期間後にLaunch Poolから収集されたクォートトークンを宛先bucketに転送するルール |
| **Finalize** | Genesis設定をロックしてローンチを有効化する取り消し不可のアクション |
| **Claim Schedule** | 請求期間開始後にトークンが時間をかけてリリースされるベスティングルール |
| **Allocation** | 特定のbucketに割り当てられたベーストークンの量（基本単位で指定） |
