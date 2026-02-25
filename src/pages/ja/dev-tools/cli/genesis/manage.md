---
title: 管理
metaTitle: 管理 | Metaplex CLI
description: Metaplex CLIを使用してGenesisアカウントのファイナライズ、取得、unlocked bucketの管理、権限の取り消しを行います。
keywords:
  - genesis finalize
  - genesis fetch
  - genesis revoke
  - unlocked bucket
  - mint authority
about:
  - Genesis account management
  - unlocked buckets
  - finalization
  - authority revocation
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
howToSteps:
  - bucket add-unlockedでチームまたはトレジャリー割り当て用のunlocked bucketを追加
  - genesis finalizeでGenesis設定をロックしてローンチを有効化
  - genesis fetchとbucket fetchでGenesisアカウントとbucketの状態を確認
  - unlocked bucketからトークンまたは転送されたSOLを請求
  - ローンチ後にミント権限とフリーズ権限を取り消し
howToTools:
  - Metaplex CLI (mplx)
  - Solana CLI
faqs:
  - q: What does finalize do?
    a: ファイナライズはGenesis設定を永久にロックします。ファイナライズ後はbucketの追加ができず、ローンチが有効化されます。
  - q: Can I undo finalization?
    a: いいえ。ファイナライズは取り消せません。genesis finalizeを実行する前にすべてのbucket設定を再確認してください。
  - q: What is an unlocked bucket used for?
    a: Unlocked bucketは、指定された受取人がトークンまたはエンドビヘイビアで転送されたSOLを請求できるようにします。通常、チームまたはトレジャリーの割り当てに使用されます。
  - q: What does revoking mint authority mean?
    a: ミント権限の取り消しにより、新しいトークンが二度と作成できなくなり、総供給量が永久に固定されます。
---

{% callout title="このページの内容" %}
Genesisアカウントの管理コマンド:
- unlocked（トレジャリー）bucketの追加
- 設定のファイナライズ
- アカウントとbucketの状態取得
- unlocked bucketからの請求
- ミント/フリーズ権限の取り消し
{% /callout %}

## 概要

これらのコマンドはGenesisアカウントの管理を行います — unlocked bucketの追加、設定のファイナライズ、状態の取得、unlocked bucketからの請求、bucket詳細の取得、権限の取り消し。

- **Unlocked bucket**: 指定された受取人がトークンまたは転送されたクォートトークンを直接請求
- **ファイナライズ**: ローンチを有効化する取り消し不可のロック
- **取得**: Genesisアカウントと個別のbucket状態を確認
- **取り消し**: ミント権限やフリーズ権限を永久に削除

## 対象範囲外

Launch Pool設定、Presale設定、入金/出金フロー、フロントエンド統合、トークンエコノミクス。

**ジャンプ先:** [Unlocked Bucket](#add-unlocked-bucket) · [ファイナライズ](#finalize) · [取得](#fetch) · [Bucket取得](#fetch-bucket) · [Unlocked請求](#claim-unlocked) · [取り消し](#revoke) · [よくあるエラー](#common-errors) · [FAQ](#faq)

*Metaplex Foundationによる管理 · 最終検証 2026年2月 · Metaplex CLI（mplx）が必要*

## Unlocked Bucketの追加

`mplx genesis bucket add-unlocked`コマンドは、unlocked bucketを追加します。Unlocked bucketは、指定された受取人がトークンまたはエンドビヘイビアで転送されたSOLを請求できるようにします。

```bash {% title="Unlocked bucketの追加" %}
mplx genesis bucket add-unlocked <GENESIS_ADDRESS> \
  --recipient <RECIPIENT_WALLET_ADDRESS> \
  --claimStart 1704153601 \
  --allocation 0
```

### オプション

| フラグ | 短縮 | 説明 | 必須 |
|--------|------|------|------|
| `--recipient <string>` | | このbucketから請求できるウォレットアドレス | はい |
| `--claimStart <string>` | | 請求開始のUnixタイムスタンプ | はい |
| `--claimEnd <string>` | | 請求終了のUnixタイムスタンプ（デフォルト: 遠い将来） | いいえ |
| `--allocation <string>` | `-a` | 基本単位でのベーストークン割り当て（デフォルト: 0） | いいえ |
| `--bucketIndex <integer>` | `-b` | Bucketインデックス | いいえ |

### 注意事項

- `--allocation 0`は、このbucketがベーストークンを保持しないことを意味します — エンドビヘイビアを通じてクォートトークンのみ受け取ります
- 通常、Launch Poolのエンドビヘイビアの宛先として使用され、チーム/トレジャリーが収集されたSOLを請求できるようにします

## ファイナライズ

`mplx genesis finalize`コマンドは、Genesis設定をロックします。ファイナライズ後はbucketの追加ができません。

```bash {% title="Genesisのファイナライズ" %}
mplx genesis finalize <GENESIS_ADDRESS>
```

追加のフラグはありません。このアクションは取り消し不可です — このコマンドを実行する前にすべてのbucket設定を再確認してください。

## 取得

`mplx genesis fetch`コマンドは、bucket数、総供給量、ファイナライズ状態、ベース/クォートミントを含むGenesisアカウントの詳細を取得します。

```bash {% title="Genesisアカウントの取得" %}
mplx genesis fetch <GENESIS_ADDRESS>
```

追加のフラグはありません。

## Bucket取得

`mplx genesis bucket fetch`コマンドは、特定のbucketの詳細を取得します。

```bash {% title="Bucket詳細の取得" %}
mplx genesis bucket fetch <GENESIS_ADDRESS> --bucketIndex 0 --type launch-pool
```

### オプション

| フラグ | 短縮 | 説明 | 必須 |
|--------|------|------|------|
| `--bucketIndex <integer>` | `-b` | 取得するbucketのインデックス（デフォルト: 0） | いいえ |
| `--type <launch-pool\|presale\|unlocked>` | `-t` | Bucketタイプ（デフォルト: `launch-pool`） | いいえ |

### 例

1. Launch Pool bucketを取得:
```bash {% title="Launch Poolの取得" %}
mplx genesis bucket fetch <GENESIS_ADDRESS> --bucketIndex 0
```

2. Presale bucketを取得:
```bash {% title="Presaleの取得" %}
mplx genesis bucket fetch <GENESIS_ADDRESS> --bucketIndex 0 --type presale
```

3. Unlocked bucketを取得:
```bash {% title="Unlockedの取得" %}
mplx genesis bucket fetch <GENESIS_ADDRESS> --bucketIndex 1 --type unlocked
```

## Unlocked請求

`mplx genesis claim-unlocked`コマンドは、unlocked bucketからトークンまたはSOLを請求します。通常、チーム/トレジャリーウォレットがエンドビヘイビアで転送されたクォートトークンを請求するために使用します。

```bash {% title="Unlocked bucketからの請求" %}
mplx genesis claim-unlocked <GENESIS_ADDRESS> --bucketIndex 1
```

### オプション

| フラグ | 短縮 | 説明 | 必須 |
|--------|------|------|------|
| `--bucketIndex <integer>` | `-b` | Unlocked bucketのインデックス（デフォルト: 0） | いいえ |
| `--recipient <string>` | | 請求したトークンの受取アドレス（デフォルト: 署名者） | いいえ |

## 取り消し

`mplx genesis revoke`コマンドは、トークンのミント権限やフリーズ権限を取り消します。少なくとも1つのフラグを指定する必要があります。

```bash {% title="ミント権限の取り消し" %}
mplx genesis revoke <GENESIS_ADDRESS> --revokeMint
```

### オプション

| フラグ | 説明 |
|--------|------|
| `--revokeMint` | ミント権限を取り消し（新しいトークンのミントが不可に） |
| `--revokeFreeze` | フリーズ権限を取り消し（トークンのフリーズが不可に） |

### 例

1. ミント権限のみ取り消し:
```bash {% title="ミントの取り消し" %}
mplx genesis revoke <GENESIS_ADDRESS> --revokeMint
```

2. 両方の権限を取り消し:
```bash {% title="両方を取り消し" %}
mplx genesis revoke <GENESIS_ADDRESS> --revokeMint --revokeFreeze
```

### 注意事項

- ミント権限の取り消しにより、新しいトークンが二度と作成できなくなります
- これらのアクションは取り消し不可です

## よくあるエラー

| エラー | 原因 | 修正方法 |
|--------|------|----------|
| Genesis already finalized | `finalize`後にbucketを追加しようとした | ファイナライズは取り消せません — 新しいGenesisアカウントを作成してください |
| Genesis not finalized | ファイナライズ前に入金または請求しようとした | 先に`genesis finalize`を実行してください |
| Not the designated recipient | 間違ったウォレットでunlocked bucketから請求しようとした | bucket作成時に`--recipient`で指定したウォレットを使用してください |
| No flags specified | `--revokeMint`または`--revokeFreeze`なしで`revoke`を実行 | 少なくとも1つ指定してください: `--revokeMint`と`--revokeFreeze`のいずれかまたは両方 |
| Authority already revoked | 既に取り消された権限を再度取り消そうとした | 対応不要です — 権限は既に永久に削除されています |
| Claim period not active | `claimStart`前にunlocked bucketから請求しようとした | 請求開始タイムスタンプまで待ってください |
| Invalid bucket type | `bucket fetch`で間違った`--type`フラグを使用 | `launch-pool`、`presale`、または`unlocked`を使用してください |

## FAQ

**ファイナライズは何をしますか？**
ファイナライズはGenesis設定を永久にロックします。ファイナライズ後はbucketの追加ができず、ローンチが有効化されます。設定された入金ウィンドウが開くと入金が可能になります。

**ファイナライズを取り消せますか？**
いいえ。ファイナライズは取り消せません。`genesis finalize`を実行する前にすべてのbucket設定を再確認してください。

**Unlocked bucketは何に使用しますか？**
Unlocked bucketは、指定された受取人がトークンまたはエンドビヘイビアで転送されたSOLを請求できるようにします。一般的な用途: チーム割り当て、トレジャリー、マーケティング予算、またはLaunch Poolのエンドビヘイビアから収集されたSOLの受け取り。

**ミント権限の取り消しとは何ですか？**
ミント権限の取り消しにより、新しいトークンが二度と作成できなくなり、総供給量が永久に固定されます。これはトークン保有者に対する信頼のシグナルです。

**フリーズ権限も取り消すべきですか？**
フリーズ権限の取り消しは、ユーザーのウォレット内のトークンをフリーズできなくなることを意味します。取り消すかどうかはプロジェクトの要件によります — ほとんどのフェアローンチでは両方取り消します。

**何も変更せずにローンチの状態を確認できますか？**
はい。`genesis fetch`と`genesis bucket fetch`を使用して、Genesisアカウントと個別のbucketの完全な状態をいつでも確認できます。

## 用語集

| 用語 | 定義 |
|------|------|
| **Unlocked Bucket** | チーム/トレジャリー用のbucketタイプ — 指定された受取人がトークンまたは転送されたクォートトークンを直接請求可能 |
| **Finalize** | Genesis設定をロックしてローンチを有効化する取り消し不可のアクション |
| **Mint Authority** | 新しいトークンを作成する権限 — 取り消すと供給量が永久に固定される |
| **Freeze Authority** | ユーザーのウォレット内のトークンをフリーズする権限 — 取り消すと将来のフリーズが不可能になる |
| **Recipient** | Unlocked bucketから請求するために指定されたウォレットアドレス |
| **Bucket Index** | Genesisアカウント内の同じタイプのbucketの数値識別子 |
