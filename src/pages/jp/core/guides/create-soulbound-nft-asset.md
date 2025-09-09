---
title: MPL Coreでソウルバウンド資産を作成
metaTitle: MPL Coreでソウルバウンド資産 | Core Guides
description: MPL Coreでソウルバウンド資産を作成するための選択肢と手順を解説します。
---

ソウルバウンドNFTは、特定のウォレットに恒久的に紐づけられ、他者へ譲渡できないNFTです。実績・資格・会員証など、特定のアイデンティティに結びつくべきものの表現に有用です。 {% .lead %}

## 概要

このガイドでは、MPL CoreとUmi Frameworkを使ってソウルバウンド資産を作る方法を紹介します。TypeScriptで実装したい開発者にも、仕組みを理解したい方にも役立つよう、基本概念から実装までをカバーします。資産をソウルバウンド化する複数のアプローチを比較し、コレクション内で最初のソウルバウンドNFTを作る手順を示します。

Solana/Eclipse上のMetaplex Auraネットワークを利用する場合は、[Aura App](https://aura-app.metaplex.com/)からエンドポイントとAPIキーを取得できます。

MPL CoreでソウルバウンドNFTを作る主な方法は2つあります。

### 1. Permanent Freeze Delegateプラグイン
- 資産を完全に非譲渡・非Burn化します
- 以下のいずれかに適用可能:
  - 個々のアセット
  - コレクション（よりレント効率的）
- コレクション適用なら、一括で解凍可能

### 2. Oracleプラグイン
- 非譲渡（ただしBurnは可能）にします
- 以下のいずれかに適用可能:
  - 個々のアセット
  - コレクション（よりレント効率的）
- コレクション適用なら、一括で解凍可能

## Permanent Freeze Delegateプラグインで作成

Permanent Freeze Delegateは、アセットを凍結して非譲渡にします。手順:

1. 作成時にプラグインを含める
2. 初期状態をfrozenにする
3. 権限をNoneにして不変化（永久凍結）

これにより、解凍不能な恒久的ソウルバウンド資産になります。以下のコードでは、その3点の指定位置を示します。

```js
  await create(umi, {
    asset: assetSigner,
    collection: collection,
    name: "My Frozen Asset",
    uri: "https://example.com/my-asset.json",
    plugins: [
      {
        type: 'PermanentFreezeDelegate', // プラグインを追加
        frozen: true, // 初期状態を凍結
        authority: { type: "None" }, // 権限をNoneに
      },
    ],
  })
```

### アセット単位での実装
個々のアセットにプラグインを付与します。細かな制御ができる反面、レントや将来の解凍（必要な場合）のコストが増えます。

{% totem %}
{% totem-accordion title="コード例" %}
```js
// 省略: Umi初期化、コレクション作成、エアドロップ等
// 中略（英語版のコードと同一）
```
{% /totem-accordion %}
{% /totem %}

### コレクション単位での実装
コレクションに適用すると、全アセットをソウルバウンド化できます。レント効率がよく、一括解凍も可能です。

{% totem %}
{% totem-accordion title="コード例" %}
```js
// 省略: Umi初期化、エアドロップ等
// 中略（英語版のコードと同一）
```
{% /totem-accordion %}
{% /totem %}

## Oracleプラグインで作成

Oracleプラグインは、外部のオンチェーンOracleアカウントの値によりライフサイクルイベント（例: transfer）を承認/拒否します。ソウルバウンド化では、譲渡を常時拒否するOracleを使うことで「譲渡不可／Burn可能」を実現します。

Metaplexが提供する[デフォルトOracle](/core/external-plugins/oracle#default-oracles-deployed-by-metaplex)を使えば、すぐに開始できます。

```js
const ORACLE_ACCOUNT = publicKey(
  "GxaWxaQVeaNeFHehFQEDeKR65MnT6Nup81AGwh2EEnuq"
);

await create(umi, {
  asset: assetSigner,
  collection: collection,
  name: "My Soulbound Asset",
  uri: "https://example.com/my-asset.json",
  plugins: [
    {
      type: "Oracle",
      resultsOffset: { type: "Anchor" },
      baseAddress: ORACLE_ACCOUNT,
      lifecycleChecks: { transfer: [CheckResult.CAN_REJECT] },
      baseAddressConfig: undefined,
    },
  ],
})
```

### アセット単位
個々のアセットに非譲渡の制約を付与（Burnは可能）。

{% totem %}
{% totem-accordion title="コード例" %}
```js
// 中略（英語版のコードと同一）
```
{% /totem-accordion %}
{% /totem %}

### コレクション単位
コレクション全体に適用（レント効率良）。

{% totem %}
{% totem-accordion title="コード例" %}
```js
// 中略（英語版のコードと同一）
```
{% /totem-accordion %}
{% /totem %}

