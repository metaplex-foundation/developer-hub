---
title: 管理
metaTitle: 管理 | Metaplex CLI
description: 使用 Metaplex CLI 对 Genesis 账户进行 finalize、查询、管理 unlocked bucket 和撤销权限。
keywords:
  - genesis finalize
  - genesis fetch
  - genesis revoke
  - unlocked bucket
  - mint authority
about:
  - Genesis account management
  - unlocked buckets
  - finalization
  - authority revocation
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
howToSteps:
  - Add unlocked buckets for team or treasury allocations using bucket add-unlocked
  - Finalize the Genesis configuration to lock it and activate the launch
  - Fetch Genesis account and bucket details to verify state
  - Claim tokens or forwarded SOL from unlocked buckets
  - Revoke mint and freeze authorities after the launch
howToTools:
  - Metaplex CLI (mplx)
  - Solana CLI
faqs:
  - q: finalize 做什么？
    a: Finalize 永久锁定 Genesis 配置。Finalize 后，不能再添加 bucket，发行将变为活跃状态。
  - q: 可以撤销 finalize 操作吗？
    a: 不可以。Finalize 是不可逆的。在运行 genesis finalize 之前请仔细检查所有 bucket 配置。
  - q: unlocked bucket 用于什么？
    a: Unlocked bucket 允许指定的接收者领取代币或通过 end behavior 转发的 SOL。通常用于团队或国库分配。
  - q: 撤销 mint 权限意味着什么？
    a: 撤销 mint 权限确保不能再铸造新的代币，永久固定总供应量。
---

{% callout title="本文涵盖内容" %}
Genesis 账户管理命令：
- 添加 unlocked（国库）bucket
- Finalize 配置
- 查询账户和 bucket 状态
- 从 unlocked bucket 领取
- 撤销 mint/freeze 权限
{% /callout %}

## 摘要

这些命令处理 Genesis 账户管理——添加 unlocked bucket、finalize 配置、查询状态、从 unlocked bucket 领取、获取 bucket 详情和撤销权限。

- **Unlocked bucket**：指定的接收者直接领取代币或转发的报价代币
- **Finalize**：激活发行的不可逆锁定
- **查询**：检查 Genesis 账户和单个 bucket 状态
- **撤销**：永久移除 mint 和/或 freeze 权限

## 超出范围

Launch Pool 配置、Presale 配置、存款/提取流程、前端集成、代币经济。

**跳转至：** [Unlocked Bucket](#add-unlocked-bucket) · [Finalize](#finalize) · [查询](#fetch) · [查询 Bucket](#fetch-bucket) · [领取 Unlocked](#claim-unlocked) · [撤销](#revoke) · [常见错误](#common-errors) · [常见问题](#faq)

*由 Metaplex Foundation 维护 · 最近验证于 2026 年 2 月 · 需要 Metaplex CLI (mplx)*

## 添加 Unlocked Bucket

`mplx genesis bucket add-unlocked` 命令添加一个 unlocked bucket。Unlocked bucket 允许指定的接收者领取代币或通过 end behavior 转发的 SOL。

```bash {% title="Add an unlocked bucket" %}
mplx genesis bucket add-unlocked <GENESIS_ADDRESS> \
  --recipient <RECIPIENT_WALLET_ADDRESS> \
  --claimStart 1704153601 \
  --allocation 0
```

### 选项

| 标志 | 简写 | 描述 | 必需 |
|------|-------|-------------|----------|
| `--recipient <string>` | | 可以从此 bucket 领取的钱包地址 | 是 |
| `--claimStart <string>` | | 领取开始的 Unix 时间戳 | 是 |
| `--claimEnd <string>` | | 领取关闭的 Unix 时间戳（默认为遥远的未来） | 否 |
| `--allocation <string>` | `-a` | 基本单位的基础代币分配额（默认：0） | 否 |
| `--bucketIndex <integer>` | `-b` | Bucket 索引 | 否 |

### 注意事项

- `--allocation 0` 表示此 bucket 不持有基础代币——它仅通过 end behavior 接收报价代币
- 通常用作 Launch Pool end behavior 的目标，以便团队/国库可以领取收集的 SOL

## Finalize

`mplx genesis finalize` 命令锁定 Genesis 配置。Finalize 后，不能再添加 bucket。

```bash {% title="Finalize Genesis" %}
mplx genesis finalize <GENESIS_ADDRESS>
```

无需额外标志。此操作不可逆——在运行此命令之前请仔细检查所有 bucket 配置。

## 查询

`mplx genesis fetch` 命令获取 Genesis 账户详情，包括 bucket 数量、总供应量、finalize 状态以及基础/报价 mint。

```bash {% title="Fetch Genesis account" %}
mplx genesis fetch <GENESIS_ADDRESS>
```

无需额外标志。

## 查询 Bucket

`mplx genesis bucket fetch` 命令获取特定 bucket 的详情。

```bash {% title="Fetch bucket details" %}
mplx genesis bucket fetch <GENESIS_ADDRESS> --bucketIndex 0 --type launch-pool
```

### 选项

| 标志 | 简写 | 描述 | 必需 |
|------|-------|-------------|----------|
| `--bucketIndex <integer>` | `-b` | 要查询的 bucket 索引（默认：0） | 否 |
| `--type <launch-pool\|presale\|unlocked>` | `-t` | Bucket 类型（默认：`launch-pool`） | 否 |

### 示例

1. 查询 Launch Pool bucket：
```bash {% title="Fetch launch pool" %}
mplx genesis bucket fetch <GENESIS_ADDRESS> --bucketIndex 0
```

2. 查询 Presale bucket：
```bash {% title="Fetch presale" %}
mplx genesis bucket fetch <GENESIS_ADDRESS> --bucketIndex 0 --type presale
```

3. 查询 unlocked bucket：
```bash {% title="Fetch unlocked" %}
mplx genesis bucket fetch <GENESIS_ADDRESS> --bucketIndex 1 --type unlocked
```

## 领取 Unlocked

`mplx genesis claim-unlocked` 命令从 unlocked bucket 领取代币或 SOL。通常由团队/国库钱包使用，领取通过 end behavior 转发的报价代币。

```bash {% title="Claim from unlocked bucket" %}
mplx genesis claim-unlocked <GENESIS_ADDRESS> --bucketIndex 1
```

### 选项

| 标志 | 简写 | 描述 | 必需 |
|------|-------|-------------|----------|
| `--bucketIndex <integer>` | `-b` | Unlocked bucket 的索引（默认：0） | 否 |
| `--recipient <string>` | | 领取代币的接收地址（默认：签名者） | 否 |

## 撤销

`mplx genesis revoke` 命令撤销代币的 mint 和/或 freeze 权限。至少需要指定一个标志。

```bash {% title="Revoke mint authority" %}
mplx genesis revoke <GENESIS_ADDRESS> --revokeMint
```

### 选项

| 标志 | 描述 |
|------|-------------|
| `--revokeMint` | 撤销 mint 权限（不能再铸造新代币） |
| `--revokeFreeze` | 撤销 freeze 权限（代币不能被冻结） |

### 示例

1. 仅撤销 mint 权限：
```bash {% title="Revoke mint" %}
mplx genesis revoke <GENESIS_ADDRESS> --revokeMint
```

2. 撤销两项权限：
```bash {% title="Revoke both" %}
mplx genesis revoke <GENESIS_ADDRESS> --revokeMint --revokeFreeze
```

### 注意事项

- 撤销 mint 权限确保不能再铸造新代币
- 这些操作不可逆

## 常见错误

| 错误 | 原因 | 修复方法 |
|-------|-------|-----|
| Genesis already finalized | 在 `finalize` 后尝试添加 bucket | Finalize 是不可逆的——请创建新的 Genesis 账户 |
| Genesis not finalized | 在 finalize 前尝试存入或领取 | 先运行 `genesis finalize` |
| Not the designated recipient | 使用错误的钱包从 unlocked bucket 领取 | 使用创建 bucket 时指定为 `--recipient` 的钱包 |
| No flags specified | 运行 `revoke` 但未指定 `--revokeMint` 或 `--revokeFreeze` | 至少指定一个：`--revokeMint` 和/或 `--revokeFreeze` |
| Authority already revoked | 撤销已被撤销的权限 | 无需操作——该权限已被永久移除 |
| Claim period not active | 在 `claimStart` 之前从 unlocked bucket 领取 | 等待领取开始时间戳之后 |
| Invalid bucket type | 在 `bucket fetch` 中使用了错误的 `--type` 标志 | 使用 `launch-pool`、`presale` 或 `unlocked` |

## 常见问题

**finalize 做什么？**
Finalize 永久锁定 Genesis 配置。Finalize 后，不能再添加 bucket，发行变为活跃状态。一旦配置的存款窗口开启，即可开始存入。

**可以撤销 finalize 操作吗？**
不可以。Finalize 是不可逆的。在运行 `genesis finalize` 之前请仔细检查所有 bucket 配置。

**unlocked bucket 用于什么？**
Unlocked bucket 允许指定的接收者领取代币或通过 end behavior 转发的 SOL。常见用途：团队分配、国库、营销预算或接收 Launch Pool end behavior 收集的 SOL。

**撤销 mint 权限意味着什么？**
撤销 mint 权限确保不能再铸造新的代币，永久固定总供应量。这对代币持有者来说是一个信任信号。

**也应该撤销 freeze 权限吗？**
撤销 freeze 权限意味着代币永远不会被冻结在用户钱包中。是否撤销取决于您的项目需求——大多数公平发行会撤销两项权限。

**可以在不修改任何内容的情况下检查发行状态吗？**
可以。随时使用 `genesis fetch` 和 `genesis bucket fetch` 检查 Genesis 账户和各个 bucket 的完整状态。

## 术语表

| 术语 | 定义 |
|------|------------|
| **Unlocked Bucket** | 用于团队/国库的 bucket 类型——指定的接收者可以直接领取代币或转发的报价代币 |
| **Finalize** | 锁定 Genesis 配置并激活发行的不可逆操作 |
| **Mint Authority** | 创建新代币的权利——撤销后永久固定供应量 |
| **Freeze Authority** | 冻结用户钱包中代币的权利——撤销后防止任何未来的冻结 |
| **Recipient** | 被指定从 unlocked bucket 领取的钱包地址 |
| **Bucket Index** | Genesis 账户中同一类型 bucket 的数字标识符 |
