---
title: 创建 Genesis 账户
metaTitle: 创建 Genesis 账户 | Metaplex CLI
description: 使用 Metaplex CLI 创建新的 Genesis 账户和代币铸造。
keywords:
  - genesis create
  - create token launch
  - mplx genesis create
  - token mint CLI
  - Solana token creation
about:
  - Genesis account creation
  - token mint setup
  - Metaplex CLI
proficiencyLevel: Intermediate
programmingLanguage:
  - Bash
howToSteps:
  - Run mplx genesis create with name, symbol, totalSupply, and decimals
  - Optionally provide a metadata URI and custom quote mint
  - Save the Genesis Account address from the output for subsequent commands
howToTools:
  - Metaplex CLI (mplx)
  - Solana CLI
faqs:
  - q: What does mplx genesis create do?
    a: 它在 Solana 上创建一个新的 Genesis 账户 PDA 和代币铸造。这是任何 Genesis 代币发行的第一步。
  - q: How do I calculate totalSupply in base units?
    a: 将所需的代币数量乘以 10 的小数位数次幂。对于 100 万个 9 位小数的代币，totalSupply = 1000000 * 10^9 = 1000000000000000。
---

{% callout title="您将完成的操作" %}
创建 Genesis 账户和代币铸造——任何代币发行的第一步：
- 初始化管理整个发行的 Genesis PDA
- 创建新的代币铸造（或链接现有的）
- 配置代币名称、符号、小数位数和供应量
{% /callout %}

## 概要

`mplx genesis create` 命令创建新的 Genesis 账户和代币铸造。这是任何代币发行的第一步。

- **创建内容**：一个 Genesis 账户 PDA 和一个代币铸造
- **必需参数**：`--name`、`--symbol`、`--totalSupply`
- **默认小数位数**：9（1 个代币 = 1,000,000,000 基本单位）

## 不在范围内

Bucket 配置、存入/领取流程、代币元数据托管、流动性池设置。

**跳转到：** [基本用法](#basic-usage) · [选项](#options) · [示例](#examples) · [输出](#output) · [常见错误](#common-errors) · [常见问题](#faq)

*由 Metaplex Foundation 维护 · 最后验证于 2026 年 2 月 · 需要 Metaplex CLI (mplx)*

## 基本用法

```bash {% title="创建 Genesis 账户" %}
mplx genesis create --name "My Token" --symbol "MTK" --totalSupply 1000000000000000 --decimals 9
```

## 选项

| 参数 | 缩写 | 描述 | 必需 |
|------|-------|-------------|----------|
| `--name <string>` | `-n` | 代币名称 | 是 |
| `--symbol <string>` | `-s` | 代币符号 | 是 |
| `--totalSupply <string>` | | 基本单位的总供应量 | 是 |
| `--uri <string>` | `-u` | 代币元数据 JSON 的 URI | 否 |
| `--decimals <integer>` | `-d` | 小数位数（默认：9） | 否 |
| `--quoteMint <string>` | | 报价代币铸造地址（默认：Wrapped SOL） | 否 |
| `--fundingMode <new-mint\|transfer>` | | 创建新铸造或使用现有铸造（默认：`new-mint`） | 否 |
| `--baseMint <string>` | | 基础代币铸造地址（当 `fundingMode` 为 `transfer` 时必需） | 条件必需 |
| `--genesisIndex <integer>` | | 同一铸造多次发行的 Genesis 索引（默认：0） | 否 |

## 示例

1. 创建一个 9 位小数、100 万总供应量的代币：
```bash {% title="基本创建" %}
mplx genesis create \
  --name "My Token" \
  --symbol "MTK" \
  --totalSupply 1000000000000000 \
  --decimals 9
```

2. 创建带有元数据 URI 的代币：
```bash {% title="带元数据 URI" %}
mplx genesis create \
  --name "My Token" \
  --symbol "MTK" \
  --totalSupply 1000000000000000 \
  --decimals 9 \
  --uri "https://example.com/metadata.json"
```

3. 使用现有代币铸造：
```bash {% title="现有铸造" %}
mplx genesis create \
  --name "Existing Token" \
  --symbol "EXT" \
  --totalSupply 1000000000000000 \
  --fundingMode transfer \
  --baseMint <EXISTING_MINT_ADDRESS>
```

## 输出

```text {% title="预期输出" %}
--------------------------------
  Genesis Account: <genesis_address>
  Signature: <transaction_signature>
  Explorer: <explorer_url>
--------------------------------
```

保存 `Genesis Account` 地址——您将在后续每个命令中使用它。

## 常见错误

| 错误 | 原因 | 修复方法 |
|-------|-------|-----|
| Missing required flag | 未提供 `--name`、`--symbol` 或 `--totalSupply` | 添加所有三个必需参数 |
| Invalid totalSupply | 非数字或零值 | 提供以基本单位表示的正整数 |
| baseMint required | 使用 `--fundingMode transfer` 但未提供 `--baseMint` | 使用 transfer 模式时添加 `--baseMint <address>` |
| Insufficient SOL | SOL 不足以支付交易费用 | 为钱包充值 SOL 以支付费用 |

## 注意事项

- `totalSupply` 以基本单位表示。使用 9 位小数时，`1000000000000000` = 1,000,000 个代币
- 默认报价代币为 Wrapped SOL。使用 `--quoteMint` 指定其他 SPL 代币
- 使用 `--fundingMode transfer` 时，必须同时提供 `--baseMint` 和现有代币铸造地址
- 如需为同一代币铸造创建多个 Genesis 发行，请使用 `--genesisIndex`

## 常见问题

**mplx genesis create 做了什么？**
它在 Solana 上创建一个新的 Genesis 账户 PDA 和代币铸造。这是任何 Genesis 代币发行的第一步——所有后续命令都引用此步骤中的 Genesis 地址。

**如何计算基本单位的 totalSupply？**
将所需的代币数量乘以 10 的小数位数次幂。对于 100 万个 9 位小数的代币：`1,000,000 × 10^9 = 1,000,000,000,000,000`。

**可以使用现有代币铸造而不创建新的吗？**
可以。设置 `--fundingMode transfer` 并使用 `--baseMint` 提供现有铸造地址。现有铸造的权限必须可以转移给 Genesis 账户。

**genesisIndex 是什么？**
它允许为同一代币铸造创建多个 Genesis 发行。每次发行需要一个唯一的索引。默认值为 0。

## 术语表

| 术语 | 定义 |
|------|------------|
| **Genesis Account** | 管理代币发行的 PDA，由此命令创建 |
| **Base Units** | 最小面额——使用 9 位小数时，1 个代币 = 1,000,000,000 基本单位 |
| **Quote Mint** | 存款期间接受的支付代币（默认：Wrapped SOL） |
| **Genesis Index** | 允许为同一代币铸造创建多次发行的数字索引 |
