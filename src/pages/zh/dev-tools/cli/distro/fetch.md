---
title: 获取
metaTitle: 获取 MPL-Distro 分发 | Metaplex CLI
description: 使用 mplx distro fetch 获取链上 MPL-Distro 详情。
keywords:
  - mplx distro fetch
  - inspect token distribution
  - MPL-Distro CLI
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
  - 传入 distro create 打印的分发公钥
  - 查看状态、mint、Merkle 根和领取窗口
howToTools:
  - Metaplex CLI (mplx)
---

{% callout title="你将完成的操作" %}
从终端读取 [MPL-Distro](/zh/smart-contracts/mpl-distro) 账户：
- 确认 mint、Merkle 根、领取窗口和访问模式
- 查看分发尚未开始、处于活动状态还是已结束
{% /callout %}

## 摘要

`mplx distro fetch` 命令加载分发账户并打印其配置。

- **必需参数**：分发公钥
- **可选标志**：用于机器可读输出的 `--json`
- **状态**：根据本地时钟与 `startTime` / `endTime` 得到 `Not Started`、`Active` 或 `Ended`

**跳转至：** [快速参考](#快速参考) · [用法](#用法) · [输出](#输出) · [注意事项](#注意事项)

## 快速参考

| 项目 | 值 |
|------|-------|
| **命令** | `mplx distro fetch <DISTRIBUTION>` |
| **必需参数** | 作为 base58 公钥的分发 PDA |
| **可选标志** | `--json` |

## 用法

只传入分发地址。

```bash {% title="获取分发" %}
mplx distro fetch <DISTRIBUTION>
```

```bash {% title="JSON 输出" %}
mplx distro fetch <DISTRIBUTION> --json
```

## 输出

人类可读输出列出身份、数量、窗口和根。

```text {% title="预期字段" %}
Distribution: <DISTRIBUTION>

Distribution Details:
  Name: Community Airdrop
  Authority: <WALLET>
  Mint: <TOKEN_MINT>
  Total Claimants: <n>
  Tree Height: <n>
  Distribution Type: Wallet | Legacy NFT
  Allowed Distributor: Permissionless | Recipient | Permissioned
  Total Amount: 1 tokens (1000000 basis)
  Claim Amount: 0 tokens (0 basis)
  Claim Count: <n>
  Subsidize Receipts: true | false
  Start Time: <ISO-8601>
  End Time: <ISO-8601>
  Status: Not Started | Active | Ended
  Merkle Root: <base58>
```

`Name` 是链上存储的 UTF-8 字符串（去掉尾部空字符）。数量在可以获取 mint 时使用 mint decimals，否则打印为 `<n> basis`。当链上设置了该模式时，`Allowed Distributor` 会打印 `Permissioned`，fetch 还会打印 `Permissioned Distributor`。CLI 无法创建 `Permissioned` 分发，因此这些字段仅出现在 SDK 创建的账户上。

## 注意事项

fetch 是只读命令。它不会更改链上状态。

- 状态使用本地时钟，不是 Solana 集群时间。
- 如果无法获取 mint 账户，`Total Amount` 和 `Claim Amount` 回退为原始 basis 单位。
- 传入 [`distro create`](/zh/dev-tools/cli/distro/create) 打印的 PDA。格式错误的地址会失败并报 `InvalidPublicKeyError`。
