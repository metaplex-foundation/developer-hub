---
title: はじめに
metaTitle: Solana で MPL-Distro トークン配布を作成する
description: Merkle 割り当てを作成し、MPL-Distro ボールトに資金を入れ、JavaScript SDK でウォレットクレームを送信します。
keywords:
  - MPL-Distro tutorial
  - create token distribution
  - Solana Merkle claim
  - SPL token airdrop
about:
  - MPL-Distro
  - JavaScript SDK
  - Wallet Distribution
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '08-25-2026'
updated: '08-27-2026'
howToSteps:
  - MPL-Distro と Umi の JavaScript パッケージをインストールする
  - Merkle 割り当てデータを構築して保存する
  - オンチェーン配布を作成して資金投入する
  - 受取人クレームを送信して検証する
howToTools:
  - Node.js 20 or newer
  - Umi
  - MPL-Distro JavaScript SDK 0.4.x
faqs:
  - q: MPL-Distro はトークン mint を作成しますか？
    a: いいえ。配布を作成する前に SPL トークン mint を作成して資金を入れてください。
  - q: Merkle 証明はどこに保存すべきですか？
    a: プログラムが保存するのはルートだけなので、各アドレス、amount、nonce、証明を耐久性のあるデータベースまたはクレームファイルに保存してください。本番デリバリーを参照してください。
  - q: 1 つのウォレットが複数の割り当てを受け取れますか？
    a: はい。それ以外は同一のウォレットと amount の割り当てごとに異なる nonce を割り当てます。
---

このガイドは、[MPL-Distro](/ja/smart-contracts/mpl-distro) と [Umi フレームワーク](/ja/dev-tools/umi) で既存トークンを 2 つのウォレットへ送ります。 {% .lead %}

## 概要

MPL-Distro のローンチには、既存の SPL トークン mint、保存済みのオフチェーン Merkle 割り当て、配布ボールト内の十分なトークンが必要です。

- `prepareDistribution` でルートと証明を構築します。
- 7 日間の `Wallet` 配布を permissionless 送信で作成します。
- クレーム開始前にすべての割り当ての合計を入金します。
- ツリーにコミットした exact な amount、nonce、証明を送信します。

{% callout title="構築するもの" %}
2 人の受取人の配布を作成し、`350,000` トークン最小単位を入金し、最初の受取人の `100,000` 単位クレームを送信します。
{% /callout %}

{% callout title="CLI から作成と資金投入" type="note" %}
[Metaplex CLI](/ja/dev-tools/cli/distro) で配布の作成とトークンの入金・出金ができます。Merkle 証明の生成とクレーム送信はこの SDK ウォークスルーで行います。
{% /callout %}

**ジャンプ先:** [前提条件](#前提条件) · [インストール](#mpl-distro-sdk-のインストール) · [作成](#ウォレット配布の作成) · [資金投入](#ウォレット配布への資金投入) · [クレーム](#ウォレット割り当てのクレーム) · [エラー](#よくある-mpl-distro-エラー)

## クイックスタート

MPL-Distro のクイックスタートには 4 つの必須フェーズがあります。

1. MPL-Distro クライアントをインストールし、Umi に `mplDistro()` を登録します。
2. 割り当てのルート、証明、amount、nonce を生成して保存します。
3. 配布を作成し、トークン割り当て全体を入金します。
4. `distribute` で証明を送信し、クレームレシートを検証します。

## 前提条件

MPL-Distro には資金のある Solana 署名者と、オリジナル SPL Token プログラム所有の既存 mint が必要です。

- Node.js 20 以降
- 家賃、トランザクション手数料、{% fee product="mpl-distro" config="claim" fee="protocolFee" /%} クレームプロトコル手数料用の SOL を持つ [Umi](/ja/dev-tools/umi) identity
- 既存の [SPL トークン](/ja/solana/spl-tokens-and-token-programs) mint と、その権限者の資金のある associated token account
- トークン最小単位で表した受取人アドレスと割り当て量（mint の最小単位。decimals が 6 のトークンは 1.0 トークンあたり `1_000_000` 単位）

{% callout type="warning" %}
この例は Token-2022 mint を受け付けません。オリジナル SPL Token プログラム mint を使ってください。
{% /callout %}

## MPL-Distro SDK のインストール

トランザクションを準備して送信するアプリケーションに、MPL-Distro クライアントとその Umi ピア依存をインストールします。

```shell {% title="Terminal" %}
npm install @metaplex-foundation/mpl-distro@^0.4 \
  @metaplex-foundation/umi@^1.1 \
  @metaplex-foundation/umi-bundle-defaults \
  @metaplex-foundation/mpl-toolbox@^0.10
```

Core アセットサイナーへクレームする場合のみ [`@metaplex-foundation/mpl-core`](/ja/smart-contracts/mpl-distro/wallet-distribution#コアアセットサイナーへのクレーム) をインストールします。

## ウォレット配布の作成

受取人リストを Merkle ルートとしてコミットし、返された証明をオフチェーンに保存して配布を作成します。

{% code-tabs-imported from="mpl-distro/create_distribution" frameworks="umi" filename="createDistribution" /%}

`seed` 署名者は mint に対して配布アドレスを一意にするので、同じトークンに複数の配布を持てます。結果の [PDA](/ja/solana/understanding-pdas) は `["distribution", mint, seed]` を使うため、アドレスを再導出する場合は seed 公開鍵を保持する必要があります。

{% callout title="クレーム中は割り当てデータが不変" type="warning" %}
権限者は `startTime <= now <= endTime` の間、Merkle ルート、ツリー高、開始時刻、claimant 数を変更できません。クレームを開く前に割り当てファイル全体を検証してバックアップしてください。
{% /callout %}

## ウォレット配布への資金投入

すべての割り当ての合計以上を、プログラム所有の associated token account へ入金して配布に資金を入れます。現在の配布権限者が `deposit` に署名する必要があります。

{% code-tabs-imported from="mpl-distro/fund_distribution" frameworks="umi" filename="fundDistribution" /%}

このチュートリアルはトークンのみ入金します。任意のクレームレシート家賃補助金は [資金投入と回収](/ja/smart-contracts/mpl-distro/funding-and-recovery) で扱います。

## ウォレット割り当てのクレーム

コミット済みリストから生成した同じ受取人、amount、nonce、証明を送信して割り当てをクレームします。

{% code-tabs-imported from="mpl-distro/claim_distribution" frameworks="umi" filename="claimDistribution" /%}

プログラムは必要に応じて受取人の正規 associated token account を作成し、ボールトからトークンを転送し、クレームレシートを作成します。同じ割り当ての 2 回目のトランザクションは `AlreadyClaimed` で失敗します。

## MPL-Distro アカウントの検証

確認後に配布と決定的クレームレシートを取得してクレームを検証します。

{% code-tabs-imported from="mpl-distro/verify_claim" frameworks="umi" filename="verifyClaim" /%}

## よくある MPL-Distro エラー

MPL-Distro エラーは、一致しない証明、期間、権限、ボールト残高を示します。

| エラー | 原因 | 対処 |
|---|---|---|
| `InvalidClaimProof` | アドレス、amount、nonce、または証明がコミット済みリーフと異なる | 同じ保存済み割り当てレコードからすべての値を読み込む |
| `DistributionNotStarted` | クラスタタイムスタンプが `startTime` より前 | 設定された Unix タイムスタンプまで待つ |
| `DistributionEnded` | クラスタタイムスタンプが `endTime` より後 | 権限者が新しい配布を作成する必要がある |
| `AlreadyClaimed` | クレームレシート PDA がすでに存在する | 割り当てを完了として扱う |
| `InsufficientFunds` | 記録された配布残高がクレーム量より少ない | アクティブ期間の前・中・後に追加入金するか、以前の出金を確認する |
| `RecipientMustSign` | recipient ゲートのクレームで受取人署名者が欠けている | 受取人を署名者として送信する |
| `InvalidDistributor` | permissioned distributor が一致しない | 設定された distributor 署名者を使う |

## 検証済み構成

はじめにのフローは、現行の MPL-Distro クライアントテストと生成済み命令ビルダーに基づきます。

| コンポーネント | バージョン |
|---|---|
| `@metaplex-foundation/mpl-distro` | 0.4.x |
| `@metaplex-foundation/umi` | 1.1.x 以降 |
| `@metaplex-foundation/mpl-toolbox` | 0.10.x |
| Token program | オリジナル SPL Token プログラム |

## 注意事項

はじめにのフローは小さなウォレット配布を示します。[本番デリバリー](/ja/smart-contracts/mpl-distro/production-delivery) が証明保存、クレームページ、未クレームトークンの回収を扱います。

- Unix タイムスタンプは秒であり、JavaScript のミリ秒ではありません。
- トークン最小単位の数量とタイムスタンプには `bigint` を使います。
- `prepareDistribution` は 1,000 割り当てでメモリ最適化実装に切り替わります。
- 非常に大きな割り当て構築は制御された Node.js プロセスで実行し、mainnet に資金を入れる前に証明配信をテストしてください。
- Permissionless の支払者は別ウォレットのクレームを送信できますが、トークンはその受取人にだけ届きます。

## FAQ

### MPL-Distro はトークン mint を作成しますか？

いいえ。配布を作成する前に [SPL トークン](/ja/tokens/create-a-token) mint を作成して資金を入れてください。

### Merkle 証明はどこに保存すべきですか？

プログラムが保存するのはルートだけなので、各アドレス、amount、nonce、証明を耐久性のあるデータベースまたはクレームファイルに保存してください。[本番デリバリー](/ja/smart-contracts/mpl-distro/production-delivery) を参照してください。

### 1 つのウォレットが複数の割り当てを受け取れますか？

はい。それ以外は同一のウォレットと amount の割り当てごとに異なる nonce を割り当てます。
