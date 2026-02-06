---
title: 使用Oracle外部插件创建美国市场交易体验
metaTitle: 使用Oracle外部插件创建美国市场交易体验 | Core指南
description: 本指南展示了如何在美国市场营业时间内限制Core Collection的交易和销售。
updated: '01-31-2026'
keywords:
  - Oracle plugin
  - trading restrictions
  - market hours
  - transfer validation
about:
  - Oracle implementation
  - Trading restrictions
  - Time-based rules
proficiencyLevel: Advanced
programmingLanguage:
  - Rust
  - JavaScript
howToSteps:
  - 创建带有Initialize Oracle和Crank Oracle指令的Solana程序
  - 部署Oracle程序并初始化Oracle账户
  - 创建带有指向Oracle账户的Oracle插件的Collection
  - 设置cron作业根据市场时间更新Oracle状态
howToTools:
  - Anchor框架
  - mpl-core SDK
  - Solana CLI
  - Cron调度器
---
本开发者指南利用新的Oracle插件来**创建只能在美国市场营业时间内交易的NFT收藏品**。

## 介绍

### 外部插件

**外部插件**是其行为由*外部*源控制的插件。core程序将为这些插件提供适配器，但开发人员通过将此适配器指向外部数据源来决定行为。
每个外部适配器都能够为生命周期事件分配生命周期检查，影响正在发生的生命周期事件的行为。这意味着我们可以为create、transfer、update和burn等生命周期事件分配以下检查：

- **Listen**：当生命周期事件发生时提醒插件的"web3"webhook。这对于跟踪数据或执行操作特别有用。
- **Reject**：插件可以拒绝生命周期事件。
- **Approve**：插件可以批准生命周期事件。
如果您想了解更多关于外部插件的信息，请在[此处](/smart-contracts/core/external-plugins/overview)阅读更多内容。

### Oracle插件

**Oracle插件**利用外部插件的能力保存外部authority可以更新的数据，通过访问Core资产外部的**链上数据**账户，允许资产动态拒绝资产authority设置的生命周期事件。外部Oracle账户也可以随时更新以更改生命周期事件的授权行为，提供灵活和动态的体验。
如果您想了解更多关于Oracle插件的信息，请在[此处](/smart-contracts/core/external-plugins/oracle)阅读更多内容。

## 入门：理解想法背后的协议

要创建只能在美国市场营业时间内交易的NFT收藏品，我们需要一种可靠的方式根据一天中的时间更新链上数据。协议设计如下：

### 程序概述

程序将有两个主要指令（一个创建Oracle，另一个更新其值）和两个辅助函数以方便实现。
**主要指令**

- **Initialize Oracle指令**：此指令创建oracle账户，以便任何想要为其收藏品使用此时间门控功能的用户将NFT Oracle插件重定向到此链上账户地址。
- **Crank Oracle指令**：此指令更新oracle状态数据以确保它始终具有正确和最新的数据。
**辅助函数**
- **isUsMarketOpen**：检查美国市场是否开放。
- **isWithin15mOfMarketOpenOrClose**：检查当前时间是否在市场开盘或收盘后15分钟内。
详细的实现内容请参阅英文文档的完整指南。

### 创建NFT

首先设置您的环境以使用Umi。（Umi是用于构建和使用Solana程序JavaScript客户端的模块化框架。在[此处](/dev-tools/umi/getting-started)了解更多）

```ts
import { createSignerFromKeypair, signerIdentity } from '@metaplex-foundation/umi'
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
// 您将使用的钱包的SecretKey
import wallet from "../wallet.json";
const umi = createUmi("https://api.devnet.solana.com", "finalized")
let keyair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const myKeypairSigner = createSignerFromKeypair(umi, keyair);
umi.use(signerIdentity(myKeypairSigner));
```

接下来，使用`CreateCollection`指令创建包含Oracle插件的收藏品：

```ts
// 生成Collection PublicKey
const collection = generateSigner(umi)
console.log("Collection Address: \n", collection.publicKey.toString())
const oracleAccount = publicKey("...")
// 生成收藏品
const collectionTx = await createCollection(umi, {
    collection: collection,
    name: 'My Collection',
    uri: 'https://example.com/my-collection.json',
    plugins: [
        {
            type: "Oracle",
            resultsOffset: {
                type: 'Anchor',
            },
            baseAddress: oracleAccount,
            authority: {
                type: 'UpdateAuthority',
            },
            lifecycleChecks: {
                transfer: [CheckResult.CAN_REJECT],
            },
            baseAddressConfig: undefined,
        }
    ]
}).sendAndConfirm(umi)
// 从交易反序列化签名
let signature = base58.deserialize(collectinTx.signature)[0];
console.log(signature);
```

## 结论

恭喜！您现在已准备好使用Oracle插件创建只能在美国市场营业时间内交易的NFT收藏品。如果您想了解更多关于Core和Metaplex的信息，请查看[开发者中心](/smart-contracts/core/getting-started)。
