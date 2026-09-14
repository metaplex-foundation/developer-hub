---
title: 创建
metaTitle: 创建 MPL-Distro 分发 | Metaplex CLI
description: 使用 mplx distro create 创建钱包或旧版 NFT 的 MPL-Distro 分发。
keywords:
  - mplx distro create
  - MPL-Distro CLI
  - Merkle airdrop create
  - Metaplex CLI
about:
  - MPL-Distro
  - Metaplex CLI
  - token distribution
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
created: '08-27-2026'
updated: '08-27-2026'
howToSteps:
  - 用 prepareDistribution 生成 base58 Merkle 根
  - 使用名称、mint、领取人数、ISO 窗口和根运行 mplx distro create
  - 保存打印出的分发公钥
howToTools:
  - Metaplex CLI (mplx)
  - MPL-Distro JavaScript SDK 0.4.x
faqs:
  - q: distro create 会生成 Merkle 证明吗？
    a: 不会。传入你已用 prepareDistribution 构建的 32 字节根。证明必须链下存储。
  - q: merkleRoot 标志的格式是什么？
    a: 恰好 32 字节的 base58 编码。十六进制字符串会被拒绝。
  - q: CLI 可以创建 permissioned distributor 吗？
    a: 不可以。--allowedDistributor 只接受 permissionless 或 recipient。
---

{% callout title="你将完成的操作" %}
从终端创建 [MPL-Distro](/zh/smart-contracts/mpl-distro) 账户：
- 将 Merkle 根、领取窗口、mint 和访问模式提交到链上
- 选择钱包或旧版 NFT 分配类型
- 保存分发 PDA，供存入、获取和提取使用
{% /callout %}

## 摘要

`mplx distro create` 命令为已有的原始 SPL Token mint 初始化 [MPL-Distro](/zh/smart-contracts/mpl-distro) PDA。

- **必需**（除非 `--wizard` 或 `--distroConfig`）：`--name`、`--mint`、`--totalClaimants`、`--startTime`、`--endTime`、`--merkleRoot`
- **默认值**：`--distributionType wallet`、`--allowedDistributor permissionless`、`--subsidizeReceipts` 关闭
- **输出**：分发 PDA（base58 公钥）、mint、领取人数、类型、时间戳和交易签名

已发布的 `@metaplex-foundation/cli` 0.4.3 仍依赖 mpl-distro 0.3.x。请使用 0.4.x 客户端；见 [CLI 概述](/zh/dev-tools/cli/distro)。

**跳转至：** [基本用法](#基本用法) · [选项](#选项) · [JSON 配置文件](#json-配置文件) · [示例](#示例) · [输出](#输出) · [常见错误](#常见错误) · [常见问题](#常见问题)

## 基本用法

传入所有必需标志，或使用向导 / JSON 文件。

```bash {% title="创建钱包分发" %}
mplx distro create \
  --name "Community Airdrop" \
  --mint <TOKEN_MINT> \
  --totalClaimants 1000 \
  --startTime "2026-09-01T00:00:00Z" \
  --endTime "2026-09-30T23:59:59Z" \
  --merkleRoot <BASE58_32_BYTE_ROOT>
```

```bash {% title="向导模式" %}
mplx distro create --wizard
```

## 选项

create 接受标志、JSON 文件或交互式向导。`--wizard` 和 `--distroConfig` 不能与各个必需标志同时使用。

| 标志 | 简写 | 说明 | 必需 | 默认 |
|------|-------|-------------|----------|---------|
| `--name <string>` | `-n` | 显示名称，最多 32 字节 | Yes* | |
| `--mint <string>` | `-m` | 已有的原始 SPL Token mint | Yes* | |
| `--totalClaimants <integer>` | `-t` | 用于计算树高的分配数量 | Yes* | |
| `--startTime <ISO-8601>` | | 领取窗口开始（建议 UTC） | Yes* | |
| `--endTime <ISO-8601>` | | 领取窗口结束；必须晚于开始 | Yes* | |
| `--merkleRoot <string>` | | 32 字节 Merkle 根，base58 编码 | Yes* | |
| `--distributionType <wallet\|legacy-nft>` | | 分配身份模型 | No | `wallet` |
| `--allowedDistributor <permissionless\|recipient>` | | 谁可以提交有效证明 | No | `permissionless` |
| `--subsidizeReceipts` | | 使用 PDA 上的额外 SOL 支付领取收据租金 | No | `false` |
| `--distroConfig <path>` | | 包含相同字段的 JSON 文件 | No | |
| `--wizard` | | 交互式提示 | No | |

\*除非 `--wizard` 或 `--distroConfig` 提供该值，否则为必需。

`--merkleRoot` 是 32 字节的 base58（约 43–44 个字符）。按 [编码 Merkle 根](/zh/dev-tools/cli/distro#编码-merkle-根) 用 `prepareDistribution` 编码。

CLI 用 `computeTreeHeight(totalClaimants)` 计算 `treeHeight`，并生成随机 seed 签名者。它不打印 seed。`totalClaimants` 是元数据，并不限制成功证明的数量。

## JSON 配置文件

`--distroConfig` 读取与标志相同的字段。

```json {% title="distribution-config.json" %}
{
  "name": "Community Airdrop",
  "mint": "TokenMint111111111111111111111111111111111",
  "totalClaimants": 1000,
  "startTime": "2026-09-01T00:00:00Z",
  "endTime": "2026-09-30T23:59:59Z",
  "merkleRoot": "base58Encoded32ByteRoot",
  "distributionType": "wallet",
  "subsidizeReceipts": false,
  "allowedDistributor": "permissionless"
}
```

```bash {% title="从 JSON 创建" %}
mplx distro create --distroConfig ./distribution-config.json
```

标志是 `--distroConfig`，不是 `--config`。

## 示例

创建仅 NFT 所有者可提交的旧版 NFT 分发：

```bash {% title="旧版 NFT，仅 recipient" %}
mplx distro create \
  --name "Holder Rewards" \
  --mint <REWARD_MINT> \
  --totalClaimants 500 \
  --startTime "2026-09-01T12:00:00Z" \
  --endTime "2026-09-15T12:00:00Z" \
  --merkleRoot <BASE58_32_BYTE_ROOT> \
  --distributionType legacy-nft \
  --allowedDistributor recipient
```

## 输出

成功时，命令打印新的 PDA 和交易。

```text {% title="预期输出" %}
Distribution created: <DISTRIBUTION_ADDRESS>
Name: Community Airdrop
Mint: <TOKEN_MINT>
Total Claimants: 1000
Distribution Type: Wallet
Start Time: 2026-09-01T00:00:00.000Z
End Time: 2026-09-30T23:59:59.000Z

Transaction: <SIGNATURE>
```

`--json` 使用相同的 PDA 字符串：

```json {% title="JSON distribution 字段" %}
{
  "distribution": "<DISTRIBUTION_ADDRESS>"
}
```

将该地址传给 `deposit`、`fetch` 或 `withdraw`。

## 常见错误

这些失败发生在创建时。

| 错误 | 原因 | 解决方法 |
|-------|-------|-----|
| `BorshIoError` | CLI Distro 客户端为 0.3.x（已发布的 0.4.3） | 依赖 `@metaplex-foundation/mpl-distro@^0.4.0` |
| Missing required flag: `--merkleRoot` | 标志不完整且无 JSON/向导 | 传入其余必需标志 |
| Invalid mint owner | Token-2022 或非 mint 账户 | 使用原始 SPL Token mint |
| Name too long | 名称超过 32 字节 | 缩短 `--name` |
| Invalid distribution time range | `endTime` 不晚于 `startTime` | 使用更晚的结束时间 |

## 注意事项

create 不会存入代币，也不会存储证明。

- 创建后用 [`distro deposit`](/zh/dev-tools/cli/distro/deposit) 为金库注资。
- `--subsidizeReceipts` 本身不会转 SOL。额外 lamports 必须已在分发账户上；CLI 没有补贴存款命令。
- `Permissioned` distributor 模式仅限 SDK。见 [钱包分发](/zh/smart-contracts/mpl-distro/wallet-distribution)。

## 常见问题

**distro create 会生成 Merkle 证明吗？**
不会。传入你已用 `prepareDistribution` 构建的 32 字节根。证明必须链下存储。见 [生产交付](/zh/smart-contracts/mpl-distro/production-delivery)。

**merkleRoot 标志的格式是什么？**
恰好 32 字节的 base58 编码。十六进制字符串会被拒绝。

**CLI 可以创建 permissioned distributor 吗？**
不可以。`--allowedDistributor` 只接受 `permissionless` 或 `recipient`。
