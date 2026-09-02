---
title: 概述
metaTitle: MPL-Distro CLI 概述 | Metaplex CLI
description: 使用 Metaplex CLI（mplx distro）创建、注资、查看并回收 MPL-Distro 代币分发。
keywords:
  - MPL-Distro CLI
  - mplx distro
  - Solana token airdrop CLI
  - Merkle distribution
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
faqs:
  - q: mplx distro 做什么？
    a: mplx distro 命令组用于创建 MPL-Distro 账户、存入和提取 SPL 代币，并获取链上分发详情。它不生成 Merkle 证明，也不提交领取。
  - q: 哪个 CLI 版本适用于当前的 MPL-Distro 程序？
    a: 链上程序需要 @metaplex-foundation/mpl-distro 0.4.x 客户端。已发布的 @metaplex-foundation/cli 0.4.3 仍依赖 0.3.x，distro create 会以 BorshIoError 失败。请使用依赖 mpl-distro 0.4.0 或更高版本的 CLI 构建。
  - q: CLI 会提交接收方领取吗？
    a: 不会。用 prepareDistribution 生成证明，然后通过 JavaScript SDK 或领取应用提交 distribute 或 distributeToLegacyNft。
  - q: 权限方何时可以提取代币？
    a: 在开始时间戳之前或结束时间戳之后。领取窗口处于活动状态时，提取会被拒绝。
---

{% callout title="本文涵盖内容" %}
[MPL-Distro](/zh/smart-contracts/mpl-distro) 权限方操作的完整 CLI 参考：
- **创建**：通过标志、JSON 或向导初始化钱包或旧版 NFT 分发
- **注资与回收**：存入代币，并在领取窗口外提取剩余
- **查看**：获取链上配置、状态和 Merkle 根
{% /callout %}

## 摘要

`mplx distro` 命令从终端创建、注资、查看并回收 [MPL-Distro](/zh/smart-contracts/mpl-distro) 分发。

- **工具**：Metaplex CLI（`mplx`）的 `distro` 命令组
- **客户端**：针对当前程序需要 `@metaplex-foundation/mpl-distro` **0.4.x**
- **链上工作**：创建分发 PDA、存入代币、提取剩余、获取账户数据
- **链下工作**：Merkle 根、证明和领取仍在 [JavaScript SDK](/zh/smart-contracts/mpl-distro/sdk/javascript)

{% callout title="已发布的 CLI 0.4.3" type="warning" %}
本文档中的 Distro 命令需要 `@metaplex-foundation/mpl-distro` **0.4.x**。已发布的 `@metaplex-foundation/cli` **0.4.3** 仍依赖 0.3.x，因此 `mplx distro create` 会以 `BorshIoError` 失败。请使用依赖 `@metaplex-foundation/mpl-distro@^0.4.0` 的 CLI 构建（或发布后的更新 CLI 版本）。
{% /callout %}

**跳转至：** [前置条件](#前置条件) · [一般流程](#一般流程) · [命令参考](#命令参考) · [编码 Merkle 根](#编码-merkle-根) · [常见错误](#常见错误) · [常见问题](#常见问题) · [术语表](#术语表)

## 前置条件

MPL-Distro CLI 命令需要有资金的 identity、已有的原始 SPL Token mint，以及 32 字节 Merkle 根。

- 针对 `@metaplex-foundation/mpl-distro` 0.4.x 构建并位于 `PATH` 中的 Metaplex CLI
- 通过 `mplx config` 配置的 Solana 密钥对（分发权限方）
- 用于租金和交易费的 SOL
- 已有的 [SPL 代币](/zh/solana/spl-tokens-and-token-programs) mint（不是 Token-2022）以及用于存款的已注资 associated token account
- 通过 `mplx config rpcs add` 或 `-r` 提供的 RPC 端点

检查命令组：

```bash {% title="检查 CLI" %}
mplx distro --help
```

## 一般流程

权限方设置使用 CLI。接收方通过存储证明的应用领取。

1. **分配** — 用 [JavaScript SDK](/zh/smart-contracts/mpl-distro/sdk/javascript) 的 `prepareDistribution` 构建接收方列表并生成 Merkle 根。持久化每个地址、amount、nonce 和证明。
2. **创建** — `mplx distro create` 将根、领取窗口、mint 和访问模式写入链上。
3. **存入** — `mplx distro deposit` 将代币移入分发金库。随时可以存款。
4. **领取** — 接收方（或中继）使用已存储证明提交 `distribute` / `distributeToLegacyNft`。CLI 没有领取命令。
5. **回收** — 在 `endTime` 之后（或 `startTime` 之前），`mplx distro withdraw` 返还未领取代币。

证明存储和领取页面见 [生产交付](/zh/smart-contracts/mpl-distro/production-delivery)。

```bash {% title="创建、注资、查看、回收" %}
mplx distro create \
  --name "Community Airdrop" \
  --mint <TOKEN_MINT> \
  --totalClaimants 2 \
  --startTime "2026-09-01T00:00:00Z" \
  --endTime "2026-09-08T00:00:00Z" \
  --merkleRoot <BASE58_32_BYTE_ROOT>

mplx distro deposit <DISTRIBUTION> --amount 1.0
mplx distro fetch <DISTRIBUTION>
mplx distro withdraw <DISTRIBUTION> --amount 0.5
```

{% callout title="保存分发地址" type="note" %}
`distro create` 将分发 PDA 打印为 base58 公钥。将该地址原样传给 `deposit`、`fetch` 和 `withdraw`。
{% /callout %}

## 命令参考

`mplx distro` 提供四个命令。它们都不生成证明或提交领取。

| 命令 | 说明 |
|---------|-------------|
| [`distro create`](/zh/dev-tools/cli/distro/create) | 创建钱包或旧版 NFT 分发 |
| [`distro deposit`](/zh/dev-tools/cli/distro/deposit) | 将 SPL 代币存入分发金库 |
| [`distro fetch`](/zh/dev-tools/cli/distro/fetch) | 获取链上分发详情 |
| [`distro withdraw`](/zh/dev-tools/cli/distro/withdraw) | 在窗口非活动时提取未领取代币 |

CLI 不支持 `AllowedDistributor.Permissioned`、`updateDistribution`、`withdrawSubsidy` 或领取指令。

## 编码 Merkle 根

`--merkleRoot` 是 32 字节分配根的 base58 编码，不是十六进制字符串。

用 `prepareDistribution` 生成，然后编码 `root` 字节：

```ts {% title="编码 Distro Merkle 根" %}
import { prepareDistribution } from '@metaplex-foundation/mpl-distro'
import { publicKey } from '@metaplex-foundation/umi'
import { base58 } from '@metaplex-foundation/umi/serializers'

const { root, proofs, treeHeight } = prepareDistribution([
  { address: publicKey('RecipientWallet111111111111111111111111111'), amount: 100_000n },
  { address: publicKey('RecipientWallet222222222222222222222222222'), amount: 250_000n },
])

const merkleRoot = base58.deserialize(root)[0]
console.log(merkleRoot)
```

将 `--totalClaimants` 设为同一列表中的分配数量。CLI 将 `computeTreeHeight(totalClaimants)` 存到链上；`prepareDistribution` 的证明不得长于该高度。

## 常见错误

这些是 `mplx distro` 最常见的失败。

| 错误 | 原因 | 解决方法 |
|-------|-------|-----|
| `BorshIoError` / Failed to serialize or deserialize account data | CLI 仍使用 mpl-distro 0.3.x（已发布的 0.4.3） | 使用依赖 `@metaplex-foundation/mpl-distro@^0.4.0` 的 CLI 构建 |
| `InvalidPublicKeyError` | 分发参数不是 base58 公钥 | 传入 `distro create` 打印的 PDA |
| Missing required flag | 创建时未提供标志、JSON 或 `--wizard` | 传入 `--name`、`--mint`、`--totalClaimants`、`--startTime`、`--endTime` 和 `--merkleRoot`，或使用 `--distroConfig` / `--wizard` |
| Insufficient balance | identity ATA 代币不足 | 先铸造或转入代币，然后重试存款 |
| Distribution not found | PDA 或集群错误 | 在同一 RPC 上用 `distro fetch` 确认地址 |

## 注意事项

CLI 是围绕 SDK 构建的 Merkle 分配的权限方工具。

- mint 必须由原始 SPL Token 程序拥有。Token-2022 mint 会被拒绝。
- `--amount` 使用 mint 的 decimals。`--basisAmount` 使用代币最小单位。
- 存款不受时间限制。当 `startTime <= clusterTime <= endTime` 时提取会被拒绝。
- `--allowedDistributor` 只接受 `permissionless` 或 `recipient`。
- CLI 生成随机 seed 签名者且不打印 seed。请从 create 输出保存分发 PDA。

## 常见问题

### mplx distro 做什么？

`mplx distro` 命令组用于创建 MPL-Distro 账户、存入和提取 SPL 代币，并获取链上分发详情。它不生成 Merkle 证明，也不提交领取。

### 哪个 CLI 版本适用于当前的 MPL-Distro 程序？

链上程序需要 `@metaplex-foundation/mpl-distro` 0.4.x 客户端。已发布的 `@metaplex-foundation/cli` 0.4.3 仍依赖 0.3.x，`distro create` 会以 `BorshIoError` 失败。请使用依赖 mpl-distro 0.4.0 或更高版本的 CLI 构建。

### CLI 会提交接收方领取吗？

不会。用 `prepareDistribution` 生成证明，然后通过 [JavaScript SDK](/zh/smart-contracts/mpl-distro/sdk/javascript) 或 [领取页面](/zh/smart-contracts/mpl-distro/production-delivery) 提交 `distribute` 或 `distributeToLegacyNft`。

### 权限方何时可以提取代币？

在开始时间戳之前或结束时间戳之后。领取窗口处于活动状态时，提取会被拒绝。

## 术语表

| 术语 | 定义 |
|------|------------|
| Distribution PDA | 由 `["distribution", mint, seed]` 派生的链上账户。CLI 在内部生成 seed。 |
| Merkle root | 分配树的 32 字节哈希，以 base58 传给 create。 |
| Basis amount | 代币最小单位（每 1.0 代币为 `10 ^ decimals`）。 |
| Claim window | 从 `startTime` 到 `endTime` 的闭区间。此期间领取成功、提取失败。 |
| Allowed distributor | 谁可以提交有效证明：CLI 中为 `permissionless` 或 `recipient`。 |
