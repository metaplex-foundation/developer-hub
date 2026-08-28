---
title: JavaScript SDK
metaTitle: MPL-Distro JavaScript SDK 参考
description: 安装并使用 MPL-Distro Umi 客户端、指令构建器、账户获取、Merkle 辅助函数和 PDA 工具。
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

`@metaplex-foundation/mpl-distro` 包提供 Umi 指令构建器、账户序列化器、[PDA](/zh/solana/understanding-pdas) 辅助函数，以及兼容的 Merkle 树工具。 {% .lead %}

## 摘要

MPL-Distro JavaScript SDK 是用于创建、注资、领取、更新和检查分发的受支持 TypeScript 接口。

- 构建指令前在 Umi 客户端上注册 `mplDistro()`。
- 用 `prepareDistribution` 生成根和证明。
- 对运营程序指令使用生成的构建器。
- 通过导出的辅助函数获取确定性分发和领取收据账户。

## 安装 MPL-Distro JavaScript SDK

与 Umi 和 Toolbox 对等依赖一起安装 MPL-Distro 0.4.x。

```shell {% title="Terminal" %}
npm install @metaplex-foundation/mpl-distro@^0.4 \
  @metaplex-foundation/mpl-core@^1.3 \
  @metaplex-foundation/umi@^1.1 \
  @metaplex-foundation/umi-bundle-defaults \
  @metaplex-foundation/mpl-toolbox@^0.10
```

`@metaplex-foundation/mpl-core` 是声明的对等依赖，并支持 [Core 资产签名者辅助流程](/zh/smart-contracts/core/execute-asset-signing)。

## 注册 MPL-Distro Umi 插件

在应用程序的 [Umi](/zh/dev-tools/umi) 实例上注册一次 `mplDistro()`。

{% code-tabs-imported from="mpl-distro/setup_umi" frameworks="umi" filename="setupUmi" /%}

插件将程序名 `mplDistro` 注册到 `D1STRoZTUiEa6r8TLg2aAbG4nSRT5cDBmgG7jDqCZvU8`。

## MPL-Distro 指令构建器

SDK 为每条运营程序指令公开一个交易构建器。

| 构建器 | 用途 | 主要参数 |
|---|---|---|
| `createDistribution` | 创建分发 PDA | 根、高度、时间窗口、claimant 数量、名称、类型、访问模式 |
| `updateDistribution` | 更改可选配置字段 | 分发加上要替换的字段 |
| `deposit` | 为分发代币金库注资 | 分发、mint、amount |
| `withdraw` | 非活动时回收代币 | 分发、mint、amount |
| `distribute` | 领取钱包分配 | 分发、mint、接收方、amount、证明、nonce |
| `distributeToLegacyNft` | 领取 NFT mint 分配 | 分发、奖励 mint、NFT mint、所有者、amount、证明、nonce |
| `withdrawSubsidy` | 回收未使用的收据补贴 | 分发、接收方、lamports amount |

每个构建器返回 Umi `TransactionBuilder`，可以用 `.sendAndConfirm(umi)` 组合或提交。

## MPL-Distro Merkle 辅助函数

SDK 从接收方记录生成与分配兼容的根和证明。

| 导出 | 用途 |
|---|---|
| `prepareDistribution(recipients)` | 返回 `root`、`proofs` 和 `treeHeight` |
| `hashDistroLeaf(recipient)` | 序列化一个地址、amount 和 nonce 以供哈希 |
| `computeTreeHeight(leavesCount)` | 返回给定叶子数的最小内部高度 |
| `distributeToAssetAndClaim` | 向 Core [资产签名者](/zh/smart-contracts/core/execute-asset-signing) 领取，并通过 Core Execute 转移代币 |
| `Recipient` | 包含 `address`、`amount` 和可选 `nonce` 的类型 |
| `LegacyNft` | 当地址为 NFT mint 时使用的 `Recipient` 别名 |

{% code-tabs-imported from="mpl-distro/prepare_distribution" frameworks="umi" filename="prepareDistribution" /%}

在与其分配相同的数组索引使用证明。将该证明与 amount 和 nonce 一起保存。

## MPL-Distro 账户获取

账户辅助函数反序列化分发状态和单个领取收据。

| 导出 | 结果 |
|---|---|
| `fetchDistribution(umi, address)` | 一个已解码分发 |
| `safeFetchDistribution(umi, address)` | 分发或 `null` |
| `fetchAllDistribution(umi, addresses)` | 多个已解码分发 |
| `fetchClaimReceipt(umi, address)` | 一个已解码收据 |
| `safeFetchClaimReceipt(umi, address)` | 收据或 `null` |
| `fetchAllClaimReceipt(umi, addresses)` | 多个已解码收据 |
| `getDistributionSize()` | 当前分发账户大小 |
| `getClaimReceiptSize()` | 领取收据账户大小 |

SDK 不提供按权限方或 mint 查询全部分发的索引器查询。应用程序需要已知 PDA 输入、已索引的交易数据，或外部账户索引。

## MPL-Distro 分发账户

分发账户存储一个 mint 和 Merkle 根的配置与合计账本。

| 字段 | 类型 | 含义 |
|---|---|---|
| `distributionType` | `DistributionType` | `Wallet` 或 `LegacyNft` |
| `subsidizeReceipts` | boolean | 领取是否需要收据租金报销 |
| `allowedDistributor` | `AllowedDistributor` | 提交授权模式 |
| `treeHeight` | number | 接受的最大证明长度 |
| `authority` | public key | 管理签名者 |
| `mint` | public key | 分发的 SPL 代币 mint |
| `merkleRoot` | 32 bytes | 分配承诺 |
| `startTime`, `endTime` | bigint | 包含性 Unix 领取窗口 |
| `totalClaimants` | bigint | 声明的分配数量元数据 |
| `totalAmount` | bigint | 存款减去提取；领取不会递减此字段 |
| `claimCount` | bigint | 记录的领取次数 |
| `claimAmount` | bigint | 已领取代币基本单位之和 |
| `seed` | public key | 分发 PDA 使用的 seed 签名者 |
| `name` | 32 bytes | 填充的 UTF-8 分发名称 |
| `permissionedDistributor` | public key | permissioned 模式的必需签名者 |

## MPL-Distro 枚举值

分发和授权枚举选择领取 identity 和签名者规则。

| 枚举 | 值 | 含义 |
|---|---:|---|
| `DistributionType.Wallet` | 0 | 分配 identity 是钱包或公钥 |
| `DistributionType.LegacyNft` | 1 | 分配 identity 是旧版 NFT mint |
| `AllowedDistributor.Permissionless` | 0 | 任意支付方可以提交 |
| `AllowedDistributor.Recipient` | 1 | 接收方或 NFT 所有者必须签名 |
| `AllowedDistributor.Permissioned` | 2 | 配置的 distributor 必须签名 |

## MPL-Distro PDA 辅助函数

PDA 辅助函数推导程序的确定性分发地址和收据地址。

{% code-tabs-imported from="mpl-distro/derive_distro_pdas" frameworks="umi" filename="deriveDistroPdas" /%}

| PDA | Seeds |
|---|---|
| Distribution | `["distribution", mint, seed]` |
| Claim receipt | `["claim_receipt", distribution, recipient, amount_le, nonce_le]` |

对于 `LegacyNft`，在推导收据时将 NFT mint 作为 `recipient` 传入。

## MPL-Distro 错误辅助函数

注册的 Umi 程序将自定义错误代码映射到生成的 JavaScript 错误类。

| 错误 | 典型原因 |
|---|---|
| `DistributionNotStarted` | 在开始时间戳之前提交领取 |
| `DistributionEnded` | 在结束时间戳之后提交领取 |
| `InvalidClaimProof` | 分配字段或证明与根不匹配 |
| `AlreadyClaimed` | 收据已存在 |
| `CannotWithdrawDuringActiveDistribution` | 在活动期间尝试回收代币 |
| `CannotWithdrawWhileActive` | 在活动期间尝试回收收据补贴 |
| `InsufficientFunds` | 记录的代币余额低于领取 |
| `InsufficientFundsToSubsidizeReceipts` | 分发 SOL 无法报销收据租金 |
| `RecipientMustSign` | Recipient 模式缺少接收方签名者 |
| `InvalidDistributionType` | 领取构建器与配置类型不匹配 |
| `InvalidDistributor` | Permissioned 领取使用了错误的签名者 |

解码模拟和确认失败时，使用 `getMplDistroErrorFromCode` 或注册程序的错误映射。

## MPL-Distro JavaScript 快速参考

JavaScript 客户端和已部署程序使用以下稳定标识符。

| 项目 | 值 |
|---|---|
| Package | `@metaplex-foundation/mpl-distro` |
| Tested package range | 0.4.x |
| Umi peer dependency | 1.1.1 或更高 |
| Program ID | `D1STRoZTUiEa6r8TLg2aAbG4nSRT5cDBmgG7jDqCZvU8` |
| Fee wallet | `9kFjQsxtpBsaw8s7aUyiY3wazYDNgFP4Lj5rsBVVF8tb` |
| Source | [metaplex-foundation/mpl-distro](https://github.com/metaplex-foundation/mpl-distro) |

## 注意事项

生成的客户端公开低级指令构建器，并不管理链下证明交付。

- `prepareDistribution` 对 1,000 个或更多叶子使用内存优化实现。
- 两个领取构建器中 `nonce` 默认为零。
- 可选账户默认值取决于 Umi 支付方，在赞助流程中应显式传入。
- SDK 包版本、Rust crate 版本和内部程序 crate 版本独立发布。
- 权限方的创建、存款、获取和提取也可以从 [Metaplex CLI](/zh/dev-tools/cli/distro) 运行。领取仍在 SDK 中。
