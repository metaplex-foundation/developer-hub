---
title: Oracle外部プラグインで米国市場時間のトレード体験を構築
metaTitle: Oracle外部プラグインで米国市場時間のトレード体験 | Core Guides
description: コレクションの取引・販売を米国市場の開場時間に限定する方法を解説します。
---

このガイドでは、Oracleプラグインを用いて「米国市場の開場時間にのみ取引可能」なNFTコレクションを構築します。

## はじめに

### 外部プラグイン

外部プラグインは、挙動を外部要因で制御するプラグインです。Coreプログラムはアダプターを提供し、開発者はアダプターが参照する外部データソースを指定します。

各外部アダプターは、ライフサイクルイベント（create/transfer/update/burnなど）にチェックを割り当てられます。
- Listen: イベント発生の通知（データ追跡や処理のトリガ）
- Reject: イベントを拒否
- Approve: イベントを承認

詳細は[外部プラグインの概要](/ja/smart-contracts/core/external-plugins/overview)を参照してください。

### Oracleプラグイン

Oracleプラグインは、外部のオンチェーンアカウント（Oracle）に保存されたデータを参照し、資産のライフサイクルイベントを動的に拒否/許可できます。Oracleアカウントの内容を更新することで、後から挙動を切り替え可能です。詳細は[Oracleプラグイン](/ja/smart-contracts/core/external-plugins/oracle)を参照してください。

## 設計の考え方

米国市場の開場時間のみ取引可能にするには、時刻に応じてオンチェーンのOracleデータを更新する仕組みが必要です。以下の構成を採用します。

### プログラム概要

2つの主命令と2つのヘルパーを用意します。

主命令:
- Initialize Oracle: Oracleアカウントを作成。NFT側のOracleプラグインが参照する先になります。
- Crank Oracle: Oracleの状態（開場/休場）を更新。

ヘルパー:
- isUsMarketOpen: 米国市場が開いているか判定
- isWithin15mOfMarketOpenOrClose: 開場/引け前後15分以内か判定

インセンティブ設計として、開場/引けから15分以内にクランクした実行者へ0.001 SOLを報酬として支払う仕様（Vaultから支出）を例示します。

## 実装（Anchor）

ここではAnchorを用います（ネイティブでも可）。lib.rsにヘルパー/状態/アカウント/命令をまとめる簡易構成で示します。

### 定数とヘルパー

```rust
// 定数とヘルパー（英語版コードと同一）
```

### 状態とアカウント

```rust
// Oracleアカウントの構造体・Space実装、Accounts構造体（英語版コードと同一）
```

### 命令

Initialize Oracle命令/Crank Oracle命令の例は以下の通りです。

```rust
// create_oracle / crank_oracle（英語版コードと同一）
```

Crank時は、現在の状態と判定結果が一致していない場合のみ更新します。また、開場/引け前後15分かつVault残高が十分なら報酬を支払います。

## NFTの作成とOracleの紐づけ

最後に、コレクションを作り、Oracleプラグインで作成したOracleアカウントを参照させます。これにより、コレクション配下の全アセットが同じルールに従います。

```ts
// Umi初期化・署名者設定（英語版と同一）

const collection = generateSigner(umi)
const oracleAccount = publicKey("...")

await createCollection(umi, {
  collection,
  name: 'My Collection',
  uri: 'https://example.com/my-collection.json',
  plugins: [
    {
      type: 'Oracle',
      resultsOffset: { type: 'Anchor' },
      baseAddress: oracleAccount,
      authority: { type: 'UpdateAuthority' },
      lifecycleChecks: { transfer: [CheckResult.CAN_REJECT] },
      baseAddressConfig: undefined,
    },
  ],
}).sendAndConfirm(umi)
```

## まとめ

Oracleプラグインを使えば、市場時間など外部要因に基づく柔軟なトレード制御が可能です。CoreやMetaplexについては[Developer Hub](/ja/smart-contracts/core/getting-started)も参照ください。

