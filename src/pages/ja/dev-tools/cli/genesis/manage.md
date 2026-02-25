---
title: 管理
metaTitle: 管理 | Metaplex CLI
description: Metaplex CLI を使用して Genesis アカウントのファイナライズ、取得、unlocked bucket の管理、権限の取り消しを行います。
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
  - Add unlocked buckets for team or treasury allocations using bucket add-unlocked
  - Finalize the Genesis configuration to lock it and activate the launch
  - Fetch Genesis account and bucket details to verify state
  - Claim tokens or forwarded SOL from unlocked buckets
  - Revoke mint and freeze authorities after the launch
howToTools:
  - Metaplex CLI (mplx)
  - Solana CLI
faqs:
  - q: finalize は何をしますか？
    a: finalize は Genesis の設定を永久にロックします。ファイナライズ後は bucket の追加ができなくなり、ローンチがアクティブになります。
  - q: ファイナライズを元に戻すことはできますか？
    a: いいえ。ファイナライズは不可逆です。genesis finalize を実行する前にすべての bucket 設定を再確認してください。
  - q: unlocked bucket は何に使用しますか？
    a: unlocked bucket を使用すると、指定された受取人が end behavior 経由で転送されたトークンまたは SOL を請求できます。通常、チームまたはトレジャリーの割り当てに使用されます。
  - q: mint 権限の取り消しとは何ですか？
    a: mint 権限を取り消すと、新しいトークンを発行できなくなり、総供給量が永久に固定されます。
---

{% callout title="このページの内容" %}
Genesis アカウントの管理コマンド：
- unlocked（トレジャリー）bucket の追加
- 設定のファイナライズ
- アカウントと bucket の状態の取得
- unlocked bucket からの請求
- mint/freeze 権限の取り消し
{% /callout %}

## 概要

これらのコマンドは Genesis アカウントの管理を行います — unlocked bucket の追加、設定のファイナライズ、状態の取得、unlocked bucket からの請求、bucket の詳細取得、権限の取り消し。

- **Unlocked bucket**: 指定された受取人がトークンまたは転送された quote token を直接請求
- **Finalize**: ローンチを有効化する不可逆なロック
- **Fetch**: Genesis アカウントと個別の bucket の状態を確認
- **Revoke**: mint および/または freeze 権限を永久に削除

## 対象外

Launch Pool の設定、Presale の設定、入金/出金フロー、フロントエンド統合、トークンエコノミクス。

**移動先:** [Unlocked Bucket](#add-unlocked-bucket) · [Finalize](#finalize) · [Fetch](#fetch) · [Fetch Bucket](#fetch-bucket) · [Claim Unlocked](#claim-unlocked) · [Revoke](#revoke) · [一般的なエラー](#common-errors) · [FAQ](#faq)

*Metaplex Foundation によるメンテナンス · 最終確認 2026年2月 · Metaplex CLI（mplx）が必要*

## Unlocked Bucket の追加

`mplx genesis bucket add-unlocked` コマンドは unlocked bucket を追加します。unlocked bucket を使用すると、指定された受取人が end behavior 経由で転送されたトークンまたは SOL を請求できます。

```bash {% title="unlocked bucket の追加" %}
mplx genesis bucket add-unlocked <GENESIS_ADDRESS> \
  --recipient <RECIPIENT_WALLET_ADDRESS> \
  --claimStart 1704153601 \
  --allocation 0
```

### オプション

| フラグ | 短縮形 | 説明 | 必須 |
|-------|--------|------|------|
| `--recipient <string>` | | この bucket から請求できるウォレットアドレス | はい |
| `--claimStart <string>` | | 請求開始の Unix タイムスタンプ | はい |
| `--claimEnd <string>` | | 請求終了の Unix タイムスタンプ（デフォルト: 遠い将来） | いいえ |
| `--allocation <string>` | `-a` | base units での base token 割り当て（デフォルト: 0） | いいえ |
| `--bucketIndex <integer>` | `-b` | bucket インデックス | いいえ |

### 注意事項

- `--allocation 0` は、この bucket が base token を保持しないことを意味します — end behavior 経由で quote token のみを受け取ります
- 通常、Launch Pool の end behavior の宛先として使用され、チーム/トレジャリーが収集された SOL を請求できるようにします

## Finalize

`mplx genesis finalize` コマンドは Genesis の設定をロックします。ファイナライズ後は bucket の追加ができなくなります。

```bash {% title="Genesis のファイナライズ" %}
mplx genesis finalize <GENESIS_ADDRESS>
```

追加のフラグはありません。この操作は不可逆です — このコマンドを実行する前にすべての bucket 設定を再確認してください。

## Fetch

`mplx genesis fetch` コマンドは、bucket 数、総供給量、ファイナライズ状態、base/quote mint を含む Genesis アカウントの詳細を取得します。

```bash {% title="Genesis アカウントの取得" %}
mplx genesis fetch <GENESIS_ADDRESS>
```

追加のフラグはありません。

## Fetch Bucket

`mplx genesis bucket fetch` コマンドは、特定の bucket の詳細を取得します。

```bash {% title="bucket の詳細取得" %}
mplx genesis bucket fetch <GENESIS_ADDRESS> --bucketIndex 0 --type launch-pool
```

### オプション

| フラグ | 短縮形 | 説明 | 必須 |
|-------|--------|------|------|
| `--bucketIndex <integer>` | `-b` | 取得する bucket のインデックス（デフォルト: 0） | いいえ |
| `--type <launch-pool\|presale\|unlocked>` | `-t` | bucket タイプ（デフォルト: `launch-pool`） | いいえ |

### 例

1. Launch Pool bucket の取得：
```bash {% title="Fetch launch pool" %}
mplx genesis bucket fetch <GENESIS_ADDRESS> --bucketIndex 0
```

2. Presale bucket の取得：
```bash {% title="Fetch presale" %}
mplx genesis bucket fetch <GENESIS_ADDRESS> --bucketIndex 0 --type presale
```

3. Unlocked bucket の取得：
```bash {% title="Fetch unlocked" %}
mplx genesis bucket fetch <GENESIS_ADDRESS> --bucketIndex 1 --type unlocked
```

## Claim Unlocked

`mplx genesis claim-unlocked` コマンドは、unlocked bucket からトークンまたは SOL を請求します。通常、end behavior 経由で転送された quote token をチーム/トレジャリーウォレットが請求するために使用します。

```bash {% title="unlocked bucket からの請求" %}
mplx genesis claim-unlocked <GENESIS_ADDRESS> --bucketIndex 1
```

### オプション

| フラグ | 短縮形 | 説明 | 必須 |
|-------|--------|------|------|
| `--bucketIndex <integer>` | `-b` | unlocked bucket のインデックス（デフォルト: 0） | いいえ |
| `--recipient <string>` | | 請求トークンの受取アドレス（デフォルト: 署名者） | いいえ |

## Revoke

`mplx genesis revoke` コマンドは、トークンの mint および/または freeze 権限を取り消します。少なくとも1つのフラグを指定する必要があります。

```bash {% title="mint 権限の取り消し" %}
mplx genesis revoke <GENESIS_ADDRESS> --revokeMint
```

### オプション

| フラグ | 説明 |
|-------|------|
| `--revokeMint` | mint 権限を取り消し（新しいトークンの発行が不可能に） |
| `--revokeFreeze` | freeze 権限を取り消し（トークンのフリーズが不可能に） |

### 例

1. mint 権限のみ取り消し：
```bash {% title="Revoke mint" %}
mplx genesis revoke <GENESIS_ADDRESS> --revokeMint
```

2. 両方の権限を取り消し：
```bash {% title="Revoke both" %}
mplx genesis revoke <GENESIS_ADDRESS> --revokeMint --revokeFreeze
```

### 注意事項

- mint 権限を取り消すと、新しいトークンが発行できなくなります
- これらの操作は不可逆です

## 一般的なエラー

| エラー | 原因 | 対処法 |
|-------|------|--------|
| Genesis already finalized | `finalize` 後に bucket を追加しようとした | ファイナライズは不可逆です — 新しい Genesis アカウントを作成してください |
| Genesis not finalized | ファイナライズ前に入金または請求しようとした | まず `genesis finalize` を実行してください |
| Not the designated recipient | 間違ったウォレットで unlocked bucket から請求しようとした | bucket 作成時に `--recipient` で指定されたウォレットを使用してください |
| No flags specified | `--revokeMint` または `--revokeFreeze` を指定せずに `revoke` を実行した | 少なくとも1つを指定してください: `--revokeMint` および/または `--revokeFreeze` |
| Authority already revoked | 既に取り消された権限を再度取り消そうとした | 操作は不要です — 権限は既に永久に削除されています |
| Claim period not active | `claimStart` 前に unlocked bucket から請求しようとした | 請求開始タイムスタンプまでお待ちください |
| Invalid bucket type | `bucket fetch` で間違った `--type` フラグを使用した | `launch-pool`、`presale`、または `unlocked` を使用してください |

## FAQ

**finalize は何をしますか？**
Finalize は Genesis の設定を永久にロックします。ファイナライズ後は bucket の追加ができなくなり、ローンチがアクティブになります。設定された入金ウィンドウが開くと入金が開始できます。

**ファイナライズを元に戻すことはできますか？**
いいえ。ファイナライズは不可逆です。`genesis finalize` を実行する前にすべての bucket 設定を再確認してください。

**unlocked bucket は何に使用しますか？**
unlocked bucket を使用すると、指定された受取人が end behavior 経由で転送されたトークンまたは SOL を請求できます。一般的な用途: チーム割り当て、トレジャリー、マーケティング予算、Launch Pool の end behavior から収集された SOL の受け取り。

**mint 権限の取り消しとは何ですか？**
mint 権限を取り消すと、新しいトークンを発行できなくなり、総供給量が永久に固定されます。これはトークン保有者にとっての信頼のシグナルです。

**freeze 権限も取り消すべきですか？**
freeze 権限を取り消すと、ユーザーウォレット内のトークンをフリーズできなくなります。取り消すかどうかはプロジェクトの要件によりますが、ほとんどの fair launch では両方を取り消します。

**何も変更せずにローンチの状態を確認できますか？**
はい。`genesis fetch` と `genesis bucket fetch` を使用して、Genesis アカウントと個別の bucket の完全な状態をいつでも確認できます。

## 用語集

| 用語 | 定義 |
|------|------|
| **Unlocked Bucket** | チーム/トレジャリー用の bucket タイプ — 指定された受取人がトークンまたは転送された quote token を直接請求できます |
| **Finalize** | Genesis の設定をロックしてローンチを有効化する不可逆な操作 |
| **Mint Authority** | 新しいトークンを作成する権限 — 取り消すと供給量が永久に固定されます |
| **Freeze Authority** | ユーザーウォレット内のトークンをフリーズする権限 — 取り消すと将来のフリーズが不可能になります |
| **Recipient** | unlocked bucket から請求するために指定されたウォレットアドレス |
| **Bucket Index** | Genesis アカウント内の同じタイプの bucket を識別する数値 |
