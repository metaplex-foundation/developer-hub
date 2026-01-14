---
title: 初始化NFT数据
metaTitle: 初始化托管 | MPL-Hybrid
description: 初始化MPL-Hybrid NFT数据
---

## MPL-Hybrid NFT数据账户结构

解释存储了哪些数据以及该数据对用户的作用。

{% totem %}
{% totem-accordion title="链上MPL-Hybrid NFT数据结构" %}

MPL-Hybrid NFT数据的链上账户结构 [链接](https://github.com/metaplex-foundation/mpl-hybrid/blob/main/programs/mpl-hybrid/src/state/nft_data.rs)

| 名称           | 类型   | 大小 | 描述                                      |     |
| -------------- | ------ | ---- | ------------------------------------------------ | --- |
| authority      | Pubkey | 32   | 托管的权限                      |     |
| token          | Pubkey | 32   | 要分发的代币                        |     |
| fee_location   | Pubkey | 32   | 发送代币费用的账户                |     |
| name           | String | 4    | NFT名称                                     |     |
| uri            | String | 8    | NFT元数据的基础uri                |     |
| max            | u64    | 8    | 附加到uri的NFT的最大索引     |     |
| min            | u64    | 8    | 附加到uri的NFT的最小索引 |     |
| amount         | u64    | 8    | 交换的代币成本                           |     |
| fee_amount     | u64    | 8    | 捕获NFT的代币费用              |     |
| sol_fee_amount | u64    | 8    | 捕获NFT的sol费用                |     |
| count          | u64    | 8    | 交换总次数                        |     |
| path           | u16    | 1    | 链上/链下元数据更新路径       |     |
| bump           | u8     | 1    | 托管bump                                  |     |

{% /totem-accordion %}
{% /totem %}
