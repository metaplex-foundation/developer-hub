---
title: 快速开始
metaTitle: Genesis - 快速开始
description: 学习使用Genesis在Solana上发行代币的基础知识。
---

本指南介绍使用Genesis发行代币的核心概念和工作流程。您将学习如何初始化Genesis账户、了解桶系统以及最终确定您的发行配置。

## 前提条件

在开始之前，请确保您具备：
- 安装了Node.js 16+
- 拥有用于支付交易费用的SOL的Solana钱包
- 已安装和配置Genesis SDK（参见[JavaScript SDK](/zh/smart-contracts/genesis/sdk/javascript)）

## Genesis发行流程

每个Genesis代币发行都遵循相同的基本流程：

```
1. 初始化Genesis账户
   └── 创建您的代币和主协调账户

2. 添加桶
   └── 配置代币如何分配（您的发行类型）

3. 最终确定
   └── 锁定配置并激活发行

4. 活动期
   └── 用户根据您的桶配置参与

5. 转换
   └── 执行结束行为（例如将资金发送到流出桶）
```

## 步骤1：初始化Genesis账户

Genesis账户是您代币发行的基础。初始化会创建：
- 带有元数据的新SPL代币
- 协调所有分配桶的主账户
- 托管中持有的总代币供应量

```typescript
import {
  findGenesisAccountV2Pda,
  initializeV2,
} from '@metaplex-foundation/genesis';
import { generateSigner, publicKey } from '@metaplex-foundation/umi';

// 为您的代币生成新的铸币密钥对
const baseMint = generateSigner(umi);

// wSOL是标准报价代币
const WSOL_MINT = publicKey('So11111111111111111111111111111111111111112');

// 派生Genesis账户PDA
const [genesisAccount] = findGenesisAccountV2Pda(umi, {
  baseMint: baseMint.publicKey,
  genesisIndex: 0,  // 对于您的第一个活动使用0
});

// 初始化Genesis账户
await initializeV2(umi, {
  baseMint,
  quoteMint: WSOL_MINT,
  fundingMode: 0,
  totalSupplyBaseToken: 1_000_000_000_000_000n,  // 100万代币（9位小数）
  name: 'My Token',
  symbol: 'MTK',
  uri: 'https://example.com/metadata.json',
}).sendAndConfirm(umi);

console.log('Genesis账户已创建:', genesisAccount);
console.log('代币铸币:', baseMint.publicKey);
```

### 理解代币供应量

指定`totalSupplyBaseToken`时，请考虑小数位。SPL代币通常使用9位小数：

```typescript
const ONE_TOKEN = 1_000_000_000n;           // 1个代币
const ONE_MILLION = 1_000_000_000_000_000n; // 100万代币
const ONE_BILLION = 1_000_000_000_000_000_000n; // 10亿代币
```

{% callout type="note" %}
`totalSupplyBaseToken`应等于所有桶分配的总和。在初始化之前规划您跨桶的代币分配。
{% /callout %}

## 步骤2：添加桶

桶是定义发行期间代币如何流动的模块化组件。有两个类别：

### 流入桶
从用户收集报价代币（SOL）：

| 桶类型 | 用例 |
|-------------|----------|
| **发行池** | 带比例分配的存款窗口 |
| **预售** | 固定价格代币销售 |

### 流出桶
通过结束行为接收代币或报价代币：

| 桶类型 | 用例 |
|-------------|----------|
| **解锁桶** | 接收资金供团队/财库领取 |

### 选择您的发行类型

{% callout type="note" %}
**[发行池](/zh/smart-contracts/genesis/launch-pool)** - 用户在窗口期间存款，并根据其在总存款中的份额比例获得代币。
{% /callout %}

{% callout type="note" %}
**[预售](/zh/smart-contracts/genesis/presale)** - 固定价格代币销售，用户存入SOL并以预定汇率获得代币。
{% /callout %}

## 步骤3：最终确定

配置所有桶后，最终确定Genesis账户以锁定配置：

```typescript
import { finalizeV2 } from '@metaplex-foundation/genesis';

await finalizeV2(umi, {
  baseMint: baseMint.publicKey,
}).sendAndConfirm(umi);

console.log('Genesis账户已最终确定！');
```

### 最终确定的作用

最终确定后：
- 不能再添加更多桶
- 桶配置被锁定
- 发行根据您的时间条件变为活动状态
- 用户可以开始参与

{% callout type="warning" %}
**最终确定是不可逆的。** 在最终确定之前，请仔细检查所有桶配置、时间条件和代币分配。
{% /callout %}

## 后续步骤

选择您的发行类型并遵循详细指南：

1. **[发行池](/zh/smart-contracts/genesis/launch-pool)** - 带存款窗口的代币分配
2. **[预售](/zh/smart-contracts/genesis/presale)** - 固定价格代币销售
3. **[统一价格拍卖](/zh/smart-contracts/genesis/uniform-price-auction)** - 具有统一清算价格的基于时间的拍卖

每个指南都包含完整的设置代码、用户操作和配置。
