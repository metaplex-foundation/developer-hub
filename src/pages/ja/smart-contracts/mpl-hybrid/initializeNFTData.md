---
title: NFTデータの初期化
metaTitle: エスクロー初期化 | MPL-Hybrid
description: MPL-Hybrid NFTデータの初期化
---

## MPL-Hybrid NFTデータアカウント構造

格納されるデータとそのデータがユーザーにとって果たす役割について説明します。

{% totem %}
{% totem-accordion title="オンチェーンMPL-Hybrid NFTデータ構造" %}

MPL-Hybrid NFTデータのオンチェーンアカウント構造 [リンク](https://github.com/metaplex-foundation/mpl-hybrid/blob/main/programs/mpl-hybrid/src/state/nft_data.rs)

| 名前           | タイプ   | サイズ | 説明                                      |     |
| -------------- | ------ | ---- | ---------------------------------------- | --- |
| authority      | Pubkey | 32   | エスクローのオーソリティ                      |     |
| token          | Pubkey | 32   | 配布されるトークン                        |     |
| fee_location   | Pubkey | 32   | トークン手数料を送信するアカウント                |     |
| name           | String | 4    | NFT名                                     |     |
| uri            | String | 8    | NFTメタデータのベースuri                |     |
| max            | u64    | 8    | uriに追加されるNFTの最大インデックス     |     |
| min            | u64    | 8    | uriに追加されるNFTの最小インデックス |     |
| amount         | u64    | 8    | スワップのトークンコスト                           |     |
| fee_amount     | u64    | 8    | NFT取得のためのトークン手数料              |     |
| sol_fee_amount | u64    | 8    | NFT取得のためのSOL手数料                |     |
| count          | u64    | 8    | スワップの総数                        |     |
| path           | u16    | 1    | オンチェーン/オフチェーンメタデータ更新パス       |     |
| bump           | u8     | 1    | エスクローバンプ                                  |     |

{% /totem-accordion %}
{% /totem %}
