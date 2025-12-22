---
title: 发行代币
metaTitle: 发行代币 | 代币
description: 使用Solana上的Genesis Launch Pools发行代币的端到端指南。
---

使用[Genesis](/smart-contracts/genesis) Launch Pools发行代币。用户在您设定的期间内存入SOL，并按其在总存款中的份额比例获得代币。 {% .lead %}

## 概述

Launch Pool代币发行有三个阶段：

1. **设置**（运行一次） - 创建代币，配置发行并激活
2. **存款期间**（用户参与） - 用户在您设定的期间内存入SOL
3. **发行后**（您 + 用户） - 执行转换，用户领取代币，撤销权限

本指南将向您展示如何创建**4个独立的脚本**，在不同阶段运行：

| 脚本 | 何时运行 | 目的 |
|--------|-------------|---------|
| `launch.ts` | 一次，开始时 | 创建代币并激活发行 |
| `transition.ts` | 存款结束后 | 将收集的SOL移至解锁桶 |
| `claim.ts` | 转换后 | 用户运行以领取代币 |
| `revoke.ts` | 发行完成时 | 永久移除铸币/冻结权限 |

## 前提条件

创建新项目并安装依赖：

```bash
mkdir my-token-launch
cd my-token-launch
npm init -y
npm install @metaplex-foundation/genesis @metaplex-foundation/umi @metaplex-foundation/umi-bundle-defaults @metaplex-foundation/mpl-toolbox
```

## 完整发行脚本

以下是带有解释性注释的完整可运行脚本。运行此脚本**一次**以设置发行。

{% callout type="warning" title="需要密钥对" %}
您需要在机器上有Solana密钥对文件来签署交易。这通常是位于`~/.config/solana/id.json`的Solana CLI钱包。更新脚本中的`walletFile`路径以指向您的密钥对文件。确保此钱包有SOL用于交易费用。
{% /callout %}

创建名为`launch.ts`的文件：

```typescript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import {
  mplGenesis,
  initializeV2,
  findGenesisAccountV2Pda,
  findLaunchPoolBucketV2Pda,
  findUnlockedBucketV2Pda,
  addLaunchPoolBucketV2,
  addUnlockedBucketV2,
  finalizeV2,
  NOT_TRIGGERED_TIMESTAMP,
} from '@metaplex-foundation/genesis';
import { generateSigner, publicKey, keypairIdentity } from '@metaplex-foundation/umi';

async function main() {
  // ============================================
  // 设置：配置连接和钱包
  // ============================================

  const umi = createUmi('https://api.devnet.solana.com')
    .use(mplGenesis());

  // 从机器上的文件加载钱包密钥对
  // 这通常是位于~/.config/solana/id.json的Solana CLI钱包
  // 或者，使用您有权访问的任何密钥对文件
  const walletFile = '/path/to/your/keypair.json'; // <-- 更新此路径
  const secretKey = JSON.parse(require('fs').readFileSync(walletFile, 'utf-8'));
  const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(secretKey));
  umi.use(keypairIdentity(keypair));

  // ============================================
  // 配置：自定义这些值
  // ============================================

  // 代币详情
  const TOKEN_NAME = 'My Token';
  const TOKEN_SYMBOL = 'MTK';
  const TOKEN_URI = 'https://example.com/metadata.json'; // 元数据JSON URL
  const TOTAL_SUPPLY = 1_000_000_000_000n; // 1万亿代币（根据需要调整）

  // 时间（从现在起的秒数）
  const DEPOSIT_DURATION = 24 * 60 * 60; // 24小时
  const CLAIM_DURATION = 7 * 24 * 60 * 60; // 7天

  // 计算时间戳
  const now = BigInt(Math.floor(Date.now() / 1000));
  const depositStart = now;
  const depositEnd = now + BigInt(DEPOSIT_DURATION);
  const claimStart = depositEnd + 1n;
  const claimEnd = claimStart + BigInt(CLAIM_DURATION);

  // ============================================
  // 步骤1：创建代币
  // ============================================
  console.log('步骤1：创建代币...');

  const baseMint = generateSigner(umi);

  const [genesisAccount] = findGenesisAccountV2Pda(umi, {
    baseMint: baseMint.publicKey,
    genesisIndex: 0,
  });

  await initializeV2(umi, {
    baseMint,
    fundingMode: 0,
    totalSupplyBaseToken: TOTAL_SUPPLY,
    name: TOKEN_NAME,
    uri: TOKEN_URI,
    symbol: TOKEN_SYMBOL,
  }).sendAndConfirm(umi);

  console.log('✓ 代币创建完成！');
  console.log('  代币铸币:', baseMint.publicKey);
  console.log('  Genesis账户:', genesisAccount);

  // ... 继续其他步骤
}

main().catch(console.error);
```

运行脚本：

```bash
npx ts-node launch.ts
```

**保存显示的地址！** 后续步骤需要它们。

## 接下来会发生什么

运行发行脚本后，您的发行就上线了。以下是每个阶段会发生的事情：

### 存款期间

用户通过前端或直接使用SDK存入SOL。每次存款：
- 收取2%的费用
- 通过存款PDA跟踪
- 可以部分或全部提取（收取2%费用）

### 存款结束后

存款期结束后，您需要运行**转换**以将收集的SOL移至解锁桶。

### 用户领取代币

转换后，用户可以领取他们的代币。每个用户按其在总存款中的份额比例获得代币：

```
userTokens = (userDeposit / totalDeposits) * totalTokenSupply
```

### 最终化：撤销权限

发行完成后，撤销铸币和冻结权限。这向持有者表明不会铸造更多代币。

{% callout type="warning" %}
**这是不可逆的。** 一旦撤销，您将无法铸造更多代币或冻结账户。只有在确定发行完成后才执行此操作。
{% /callout %}

## 后续步骤

- [Genesis概述](/smart-contracts/genesis) - 了解更多关于Genesis概念
- [Launch Pool](/smart-contracts/genesis/launch-pool) - Launch Pool的详细文档
- [聚合API](/smart-contracts/genesis/aggregation) - 使用API查询发行数据
