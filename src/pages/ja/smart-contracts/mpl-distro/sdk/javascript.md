---
title: JavaScript SDK
metaTitle: MPL-Distro JavaScript SDK リファレンス
description: MPL-Distro Umi クライアント、命令ビルダー、アカウント取得、Merkle ヘルパー、PDA ユーティリティをインストールして使います。
keywords:
  - MPL-Distro SDK
  - '@metaplex-foundation/mpl-distro'
  - Umi token distribution
  - MPL-Distro API
about:
  - MPL-Distro
  - JavaScript SDK
  - Umi
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '08-25-2026'
updated: '08-27-2026'
---

`@metaplex-foundation/mpl-distro` パッケージは Umi 命令ビルダー、アカウントシリアライザ、[PDA](/ja/solana/understanding-pdas) ヘルパー、互換 Merkle ツリーユーティリティを提供します。 {% .lead %}

## 概要

MPL-Distro JavaScript SDK は、配布の作成、資金投入、クレーム、更新、確認のためのサポート対象 TypeScript インターフェイスです。

- 命令を構築する前に Umi クライアントへ `mplDistro()` を登録します。
- `prepareDistribution` でルートと証明を生成します。
- 運用プログラム命令には生成済みビルダーを使います。
- エクスポートされたヘルパーで決定的な配布とクレームレシートアカウントを取得します。

## MPL-Distro JavaScript SDK のインストール

MPL-Distro 0.4.x を Umi と Toolbox のピア依存と一緒にインストールします。

```shell {% title="Terminal" %}
npm install @metaplex-foundation/mpl-distro@^0.4 \
  @metaplex-foundation/mpl-core@^1.3 \
  @metaplex-foundation/umi@^1.1 \
  @metaplex-foundation/umi-bundle-defaults \
  @metaplex-foundation/mpl-toolbox@^0.10
```

`@metaplex-foundation/mpl-core` は宣言されたピア依存であり、[Core アセットサイナーヘルパーフロー](/ja/smart-contracts/core/execute-asset-signing) をサポートします。

## MPL-Distro Umi プラグインを登録する

アプリケーションの [Umi](/ja/dev-tools/umi) インスタンスに `mplDistro()` を一度登録します。

{% code-tabs-imported from="mpl-distro/setup_umi" frameworks="umi" filename="setupUmi" /%}

プラグインはプログラム名 `mplDistro` を `D1STRoZTUiEa6r8TLg2aAbG4nSRT5cDBmgG7jDqCZvU8` に登録します。

## MPL-Distro 命令ビルダー

SDK は各運用プログラム命令に対するトランザクションビルダーを公開します。

| ビルダー | 目的 | 主な引数 |
|---|---|---|
| `createDistribution` | 配布 PDA を作成 | ルート、高さ、期間、claimant 数、名前、タイプ、アクセスモード |
| `updateDistribution` | 任意の設定フィールドを変更 | 配布と置き換えるフィールド |
| `deposit` | 配布トークンボールトに資金を入れる | 配布、mint、amount |
| `withdraw` | 非アクティブ時にトークンを回収 | 配布、mint、amount |
| `distribute` | ウォレット割り当てをクレーム | 配布、mint、受取人、amount、証明、nonce |
| `distributeToLegacyNft` | NFT mint 割り当てをクレーム | 配布、報酬 mint、NFT mint、所有者、amount、証明、nonce |
| `withdrawSubsidy` | 未使用レシート補助金を回収 | 配布、受取人、lamports の amount |

各ビルダーは Umi `TransactionBuilder` を返し、`.sendAndConfirm(umi)` で合成または送信できます。

## MPL-Distro Merkle ヘルパー

SDK は受取人レコードから割り当て互換のルートと証明を生成します。

| エクスポート | 目的 |
|---|---|
| `prepareDistribution(recipients)` | `root`、`proofs`、`treeHeight` を返す |
| `hashDistroLeaf(recipient)` | ハッシュ用に 1 つのアドレス、amount、nonce をシリアライズ |
| `computeTreeHeight(leavesCount)` | リーフ数に対する最小内部高を返す |
| `distributeToAssetAndClaim` | Core [アセットサイナー](/ja/smart-contracts/core/execute-asset-signing) へクレームし、Core Execute でトークンを転送 |
| `Recipient` | `address`、`amount`、任意の `nonce` を含む型 |
| `LegacyNft` | アドレスが NFT mint のときの `Recipient` エイリアス |

{% code-tabs-imported from="mpl-distro/prepare_distribution" frameworks="umi" filename="prepareDistribution" /%}

証明はその割り当てと同じ配列インデックスで使います。その証明と一緒に amount と nonce を保存します。

## MPL-Distro アカウント取得

アカウントヘルパーは配布状態と個々のクレームレシートをデシリアライズします。

| エクスポート | 結果 |
|---|---|
| `fetchDistribution(umi, address)` | デコード済み配布 1 件 |
| `safeFetchDistribution(umi, address)` | 配布または `null` |
| `fetchAllDistribution(umi, addresses)` | 複数のデコード済み配布 |
| `fetchClaimReceipt(umi, address)` | デコード済みレシート 1 件 |
| `safeFetchClaimReceipt(umi, address)` | レシートまたは `null` |
| `fetchAllClaimReceipt(umi, addresses)` | 複数のデコード済みレシート |
| `getDistributionSize()` | 現行の配布アカウントサイズ |
| `getClaimReceiptSize()` | クレームレシートアカウントサイズ |

SDK は権限者または mint ごとの全配布インデックスクエリを提供しません。アプリケーションは既知の PDA 入力、インデックス済みトランザクションデータ、または外部アカウントインデックスが必要です。

## MPL-Distro 配布アカウント

配布アカウントは、1 つの mint と Merkle ルートの設定と集計帳簿を保存します。

| フィールド | 型 | 意味 |
|---|---|---|
| `distributionType` | `DistributionType` | `Wallet` または `LegacyNft` |
| `subsidizeReceipts` | boolean | クレームにレシート家賃補填が必要か |
| `allowedDistributor` | `AllowedDistributor` | 送信認可モード |
| `treeHeight` | number | 受け付ける最大証明長 |
| `authority` | public key | 管理署名者 |
| `mint` | public key | 配布する SPL トークン mint |
| `merkleRoot` | 32 bytes | 割り当てのコミットメント |
| `startTime`, `endTime` | bigint | 包含的な Unix クレーム期間 |
| `totalClaimants` | bigint | 宣言された割り当て数メタデータ |
| `totalAmount` | bigint | 入金マイナス出金。クレームでは減らない |
| `claimCount` | bigint | 記録されたクレーム数 |
| `claimAmount` | bigint | クレーム済みトークン最小単位の合計 |
| `seed` | public key | 配布 PDA が使う seed 署名者 |
| `name` | 32 bytes | パディング済み UTF-8 配布名 |
| `permissionedDistributor` | public key | permissioned モードの必須署名者 |

## MPL-Distro 列挙値

配布と認可の列挙は、クレーム identity と署名者規則を選びます。

| 列挙 | 値 | 意味 |
|---|---:|---|
| `DistributionType.Wallet` | 0 | 割り当て identity はウォレットまたは公開鍵 |
| `DistributionType.LegacyNft` | 1 | 割り当て identity はレガシー NFT mint |
| `AllowedDistributor.Permissionless` | 0 | 任意の支払者が送信できる |
| `AllowedDistributor.Recipient` | 1 | 受取人または NFT 所有者が署名する必要がある |
| `AllowedDistributor.Permissioned` | 2 | 設定された distributor が署名する必要がある |

## MPL-Distro PDA ヘルパー

PDA ヘルパーは、プログラムの決定的な配布アドレスとレシートアドレスを導出します。

{% code-tabs-imported from="mpl-distro/derive_distro_pdas" frameworks="umi" filename="deriveDistroPdas" /%}

| PDA | Seeds |
|---|---|
| Distribution | `["distribution", mint, seed]` |
| Claim receipt | `["claim_receipt", distribution, recipient, amount_le, nonce_le]` |

`LegacyNft` では、レシート導出時に NFT mint を `recipient` として渡します。

## MPL-Distro エラーヘルパー

登録済み Umi プログラムはカスタムエラーコードを生成済み JavaScript エラークラスへマップします。

| エラー | 典型的な原因 |
|---|---|
| `DistributionNotStarted` | 開始タイムスタンプより前にクレームを送信した |
| `DistributionEnded` | 終了タイムスタンプより後にクレームを送信した |
| `InvalidClaimProof` | 割り当てフィールドまたは証明がルートと一致しない |
| `AlreadyClaimed` | レシートがすでに存在する |
| `CannotWithdrawDuringActiveDistribution` | アクティブ中にトークン回収を試みた |
| `CannotWithdrawWhileActive` | アクティブ中にレシート補助金回収を試みた |
| `InsufficientFunds` | 記録トークン残高がクレームより少ない |
| `InsufficientFundsToSubsidizeReceipts` | 配布 SOL がレシート家賃を補填できない |
| `RecipientMustSign` | Recipient モードで受取人署名者が欠けている |
| `InvalidDistributionType` | クレームビルダーが設定タイプと一致しない |
| `InvalidDistributor` | Permissioned クレームが誤った署名者を使った |

シミュレーションと確認失敗のデコードには `getMplDistroErrorFromCode` または登録プログラムのエラーマップを使います。

## MPL-Distro JavaScript クイックリファレンス

JavaScript クライアントとデプロイ済みプログラムは次の安定識別子を使います。

| 項目 | 値 |
|---|---|
| Package | `@metaplex-foundation/mpl-distro` |
| Tested package range | 0.4.x |
| Umi peer dependency | 1.1.1 以降 |
| Program ID | `D1STRoZTUiEa6r8TLg2aAbG4nSRT5cDBmgG7jDqCZvU8` |
| Fee wallet | `9kFjQsxtpBsaw8s7aUyiY3wazYDNgFP4Lj5rsBVVF8tb` |
| Source | [metaplex-foundation/mpl-distro](https://github.com/metaplex-foundation/mpl-distro) |

## 注意事項

生成クライアントは低レベルの命令ビルダーを公開し、オフチェーン証明配信は管理しません。

- `prepareDistribution` は 1,000 リーフ以上でメモリ最適化実装を使います。
- 両方のクレームビルダーで `nonce` のデフォルトは 0 です。
- 任意アカウントのデフォルトは Umi 支払者に依存するため、スポンサー付きフローでは明示的に渡してください。
- SDK パッケージバージョン、Rust crate バージョン、内部プログラム crate バージョンは独立にリリースされます。
- 権限者の作成、入金、取得、出金は [Metaplex CLI](/ja/dev-tools/cli/distro) からも実行できます。クレームは SDK 側です。
