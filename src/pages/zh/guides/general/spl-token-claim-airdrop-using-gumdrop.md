---
title: 创建可领取的 SPL 代币空投
metaTitle: 创建可领取的 SPL 代币空投 | Gumdrop 指南
description: 了解如何使用 Gumdrop 创建用户可以领取其分配的 SPL 代币空投。
created: '01-06-2025'
updated: '01-06-2025'
---

## 概述

Gumdrop 是一个 Solana 程序，可以创建可领取的空投。与直接向钱包发送代币的空投不同，Gumdrop 创建了一种领取机制，用户必须主动领取其分配。这种方法有几个好处：

- 通过仅将代币转移给领取者并让领取者承担交易成本来降低成本
- 允许通过各种方法验证用户身份
- 在分发方法（钱包、电子邮件、短信、Discord）方面提供灵活性
- 启用有时间限制的领取，并能够收回未领取的代币

本指南演示如何使用 Gumdrop 创建可领取的 SPL 代币空投。

## 工作原理

1. 创建 Gumdrop 时，会从您的分发列表生成一个 merkle 树
2. merkle 根作为 Gumdrop 程序的一部分存储在链上
3. 每个接收者都会从其在树中的位置获得一个唯一的 merkle 证明
4. 领取时，会根据链上根验证证明以确保：
   - 领取者在原始分发列表中
   - 他们正在领取正确数量的代币
   - 他们之前没有领取过

## 先决条件

- Node.js 14
- 已安装 Solana CLI 工具
- 基本熟悉 SPL 代币和 Solana 区块链
- 用于交易费用的资金钱包

## 所需工具

安装 Gumdrop CLI：

```bash
git clone https://github.com/metaplex-foundation/gumdrop
yarn install
```

## 创建 SPL 代币

首先，创建将要分发的 SPL 代币。您可以遵循[我们的指南](/zh/guides/javascript/how-to-create-a-solana-token)或使用 [sol-tools.io](https://sol-tools.io/token-tools/create-token) 等工具。

{% callout type="note" title="代币数量" %}
确保您铸造足够的代币来覆盖整个分发列表以及一些用于测试的缓冲。
{% /callout %}

## 分发方法

为了将证明分发给用户，Gumdrop 支持多种分发方法。基于钱包的分发推荐用于：
- 更好的可靠性
- 更简单的实现
- 不依赖外部服务
- 直接钱包验证

对于钱包分发，您需要
- 使用已有的 Discord 机器人之一向用户发送包含所需证明数据的领取 URL。
或：
1. 将领取数据存储在按钱包地址索引的数据库中
2. 创建一个前端，当用户连接钱包时获取领取数据
3. 使用领取数据执行链上领取交易

其他分发方法包括：
- 通过 AWS SES 发送电子邮件
- 通过 AWS SNS 发送短信
- 通过 Discord API 发送 Discord 消息

## 分发列表设置
创建 SPL 代币后，您需要创建一个分发列表。此列表定义了谁可以领取代币以及数量。此数据用于：
1. 为每个接收者生成唯一的领取证明
2. 创建一个 merkle 树，其中根存储在链上进行验证
3. 确保只有列出的接收者可以领取其确切分配

创建包含分发列表的 JSON 文件：

```json
[
    {
        "handle": "8SoWVrwJ6vPa3rcdNBkhznR54yJ6iQqPSmgcXVGnwtEu",
        "amount": 10000000
    },
    {
        "handle": "GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS",
        "amount": 5000000
    }
]
```

{% callout title="代币数量" %}
数量应在不带小数的情况下指定。例如，如果您想要空投 10 个具有 6 位小数的铸币代币，请指定 10000000（10 * 10^6）。
{% /callout %}

`handle` 可以是：
- 用于直接分发的钱包地址 **推荐**
- 用于 AWS SES 分发的电子邮件地址
- 用于 AWS SNS 分发的电话号码
- 用于 Discord 分发的 Discord 用户 ID

## 创建 Gumdrop

使用您之前下载并安装的 Gumdrop CLI 创建空投。命令可能如下所示：

```bash
ts-node gumdrop-cli.ts create \
  -e devnet \
  --keypair <KEYPAIR_PATH> \
  --distribution-list <PATH_TO_JSON> \
  --claim-integration transfer \
  --transfer-mint <TOKEN_MINT> \
  --distribution-method <METHOD>
```

{% callout type="note" title="Gumdrop 密钥对" %}
CLI 将创建一个包含密钥对的 `.log` 文件夹。保存它，因为您需要它来关闭 Gumdrop 账户并收回任何未领取的代币。
{% /callout %}

## 托管领取界面

用户需要一个前端界面来领取他们的代币。您可以：

1. 使用托管版本 `https://gumdrop.metaplex.com`

2. 托管您自己的界面 **推荐**。您可能希望使用 Gumdrop 前端作为起点并根据您的需要进行自定义。例如，它可以通过根据用户连接的钱包自动填写用户的领取数据来大大提高用户体验。

在启动之前：

1. 使用小型分发列表在 devnet 上测试
2. 验证领取 URL 和证明是否正常工作
3. 测试关闭过程

## 关闭 Gumdrop

空投期结束后，收回未领取的代币：

```bash
ts-node gumdrop-cli.ts close \
  -e devnet \
  --base <GUMDROP_KEYPAIR> \
  --keypair <AUTHORITY_KEYPAIR> \
  --claim-integration transfer \
  --transfer-mint <TOKEN_MINT>
```

## 结论

Gumdrop 提供了一种强大且灵活的方式，通过基于领取的机制分发 SPL 代币。这种方法相比传统空投具有几个优势：

- **成本效益**：交易成本由领取者而非分发者支付
- **受控分发**：只有经过验证的接收者才能领取其分配的代币
- **可恢复性**：空投期结束后可以收回未领取的代币
- **灵活性**：多种分发方法可通过用户首选渠道接触用户

实施您的 Gumdrop 时：
1. 选择基于钱包的分发以获得最可靠的体验
2. 在主网部署之前在 devnet 上彻底测试
3. 考虑构建自定义前端以获得更好的用户体验
4. 保存您的 Gumdrop 密钥对以确保稍后可以关闭它

通过遵循本指南，您可以创建一个安全高效的代币分发系统，让您掌控全局，同时为用户提供流畅的领取体验。

## 需要帮助？

- 加入我们的 [Discord](https://discord.gg/metaplex) 获取支持
- 查看 [Metaplex Gumdrop 文档](https://metaplex.com/docs/legacy-documentation/gumdrop)
- 查看[源代码](https://github.com/metaplex-foundation/gumdrop)
