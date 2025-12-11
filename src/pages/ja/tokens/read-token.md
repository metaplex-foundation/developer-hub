---
title: トークンデータを読み取る
metaTitle: トークンデータを読み取る | トークン
description: Solanaブロックチェーンからファンジブルトークンデータを取得する方法を学びます
created: '11-28-2025'
updated: '11-28-2025'
---

Solanaブロックチェーンからファンジブルトークン情報を取得します。 {% .lead %}

## トークンメタデータを取得する

ミントアドレスを使用してトークンのメタデータを取得します。これにより、名前、シンボル、小数点以下桁数、供給量を含むオンチェーントークン情報が取得されます。

{% code-tabs-imported from="token-metadata/fungibles/read" frameworks="umi,das,curl" /%}

## パラメータ

| パラメータ | 説明 |
|-----------|-------------|
| `mintAddress` | 取得するトークンミントアドレス |

## トークン残高を取得する

Associated Token AccountまたはDAS APIを使用して、特定のウォレットのトークン残高を取得します。

{% code-tabs-imported from="token-metadata/fungibles/read-balance" frameworks="umi,das,curl" /%}

## 所有者別の全トークンを取得する

DAS APIを使用して、ウォレットアドレスが所有するすべてのファンジブルトークンを取得します。

{% code-tabs-imported from="token-metadata/fungibles/read-all" frameworks="das,curl" /%}

## アプローチの比較

| 機能 | 直接RPC | DAS API |
|---------|-----------|---------|
| 速度 | バルククエリでは遅い | バルククエリに最適化 |
| データの鮮度 | リアルタイム | ほぼリアルタイム（インデックス化） |
| 検索機能 | 限定的 | 高度なフィルタリング |
| ユースケース | 単一トークンの検索 | ポートフォリオビュー、検索 |

## ヒント

- **ポートフォリオビューにはDASを使用** - ユーザーが所有するすべてのトークンを表示する場合、DAS APIは複数のRPCコールよりも大幅に高速です
- **DASではshowFungibleを設定** - `showFungible: true`を設定してください。そうしないと、一部のRPCはNFTデータのみを返します

## 関連ガイド

- [トークンを作成する](/tokens/create-a-token)
- [DAS API概要](/das-api)
- [所有者別のファンジブルアセットを取得](/das-api/guides/get-fungible-assets)
