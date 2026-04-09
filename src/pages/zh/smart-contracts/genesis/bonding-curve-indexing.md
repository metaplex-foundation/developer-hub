---
title: 联合曲线——索引与事件
metaTitle: Genesis 联合曲线索引与事件 | Metaplex
description: 如何索引 Genesis 联合曲线生命周期——GPA 发现、解码 BondingCurveSwapEvent、从事件追踪价格以及账户判别字节。
updated: '04-09-2026'
keywords:
  - bonding curve
  - indexing
  - swap events
  - BondingCurveSwapEvent
  - genesis
  - GPA
  - lifecycle events
  - price tracking
  - Solana
about:
  - Bonding Curve
  - Indexing
  - Swap Events
  - Genesis
proficiencyLevel: Advanced
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 如何从交易中解码 BondingCurveSwapEvent？
    a: 在 Genesis 程序（GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B）的内部指令中找到判别字节为 255 的条目，截去该首字节，然后将剩余字节传给 getBondingCurveSwapEventSerializer().deserialize()。事件包含 swapDirection、quoteTokenAmount、baseTokenAmount、fee、creatorFee 以及兑换后的储备状态（baseTokenBalance、quoteTokenDepositTotal、virtualSol、virtualTokens）。
  - q: isSoldOut 和 isGraduated 有什么区别？
    a: isSoldOut 是对 bucket 的 baseTokenBalance 进行的同步检查——所有代币售出的瞬间返回 true。isGraduated 是异步 RPC 调用，检查 Raydium CPMM 池是否已被创建并注入资金。在售罄与毕业之间存在一个窗口期，此时 isSoldOut 为 true 但 isGraduated 为 false。
---

索引完整的 Genesis 联合曲线生命周期——通过 GPA 发现曲线、解码每笔兑换事件，以及无需轮询即可追踪价格和状态变化。{% .lead %}

## 摘要

Genesis 程序在每次已确认的兑换上发出 `BondingCurveSwapEvent` 内部指令。索引器可将其与 GPA 查询和生命周期指令追踪相结合，无需在每次交易后获取账户即可重建完整的曲线状态。

- **GPA 发现** — 查找程序上所有 `BondingCurveBucketV2` 账户
- **兑换事件** — 内部指令上的判别字节 `255`；包含方向、金额、手续费和兑换后储备
- **从事件推导价格** — 无需额外 RPC 调用，直接从事件数据推导当前价格
- **生命周期追踪** — 从代币创建到 Raydium 毕业的八个不同事件

**Program ID：** `GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`

## 发现所有联合曲线（GPA）

使用 GPA builder 获取程序上每个 `BondingCurveBucketV2` 账户——适用于仪表盘、聚合器和索引器。完整账户字段参考请参阅[高级内部原理](/smart-contracts/genesis/bonding-curve-internals)。

```typescript {% title="discover-all-curves.ts" showLineNumbers=true %}
import { getBondingCurveBucketV2GpaBuilder } from '@metaplex-foundation/genesis';

const allCurves = await getBondingCurveBucketV2GpaBuilder(umi)
  .whereField('discriminator', /* BondingCurveBucketV2 discriminator */)
  .get();

for (const curve of allCurves) {
  console.log('Bucket PDA:         ', curve.publicKey.toString());
  console.log('Base token balance: ', curve.data.baseTokenBalance.toString());
}
```

## 解码兑换事件

每次已确认的兑换都会以判别字节 `255` 的内部指令形式发出 `BondingCurveSwapEvent`。从交易中解码可获取精确的兑换后储备状态、手续费明细和方向。

### BondingCurveSwapEvent 字段

| 字段 | 类型 | 描述 |
|-------|------|-------------|
| `swapDirection` | `SwapDirection` | `SwapDirection.Buy`（SOL 输入，代币输出）或 `SwapDirection.Sell`（代币输入，SOL 输出） |
| `quoteTokenAmount` | `bigint` | 兑换中的 SOL 金额（买入时为输入，卖出时为总输出），以 lamports 计 |
| `baseTokenAmount` | `bigint` | 兑换中的代币金额（买入时为输出，卖出时为输入） |
| `fee` | `bigint` | 收取的协议手续费，以 lamports 计 |
| `creatorFee` | `bigint` | 收取的创作者费，以 lamports 计（未配置创作者费时为 0） |
| `baseTokenBalance` | `bigint` | 兑换后的 `baseTokenBalance` |
| `quoteTokenDepositTotal` | `bigint` | 兑换后的 `quoteTokenDepositTotal` |
| `virtualSol` | `bigint` | 虚拟 SOL 储备（不可变——无需获取账户即可用于价格计算） |
| `virtualTokens` | `bigint` | 虚拟代币储备（不可变——同上） |
| `blockTime` | `bigint` | 包含该兑换的区块的 Unix 时间戳 |

### 从已确认交易中解码

```typescript {% title="decode-swap-event.ts" showLineNumbers=true %}
import { getBondingCurveSwapEventSerializer, SwapDirection } from '@metaplex-foundation/genesis';

const GENESIS_PROGRAM_ID = 'GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B';
const SWAP_EVENT_DISCRIMINATOR = 255;

async function decodeSwapEvent(signature: string) {
  const tx = await umi.rpc.getTransaction(signature, {
    commitment: 'confirmed',
  });

  if (!tx) throw new Error('Transaction not found');

  const serializer = getBondingCurveSwapEventSerializer();

  for (const innerIx of tx.meta?.innerInstructions ?? []) {
    for (const ix of innerIx.instructions) {
      const programId = tx.transaction.message.accountKeys[ix.programIdIndex];

      if (programId.toString() !== GENESIS_PROGRAM_ID) continue;

      const data = ix.data; // Uint8Array
      if (data[0] !== SWAP_EVENT_DISCRIMINATOR) continue;

      // Slice off the discriminator byte, then deserialize.
      const [event] = serializer.deserialize(data.slice(1));

      const isBuy = event.swapDirection === SwapDirection.Buy;
      console.log('Direction:            ', isBuy ? 'buy' : 'sell');
      console.log('Quote token amount:   ', event.quoteTokenAmount.toString(), 'lamports');
      console.log('Base token amount:    ', event.baseTokenAmount.toString());
      console.log('Protocol fee:         ', event.fee.toString(), 'lamports');
      console.log('Creator fee:          ', event.creatorFee.toString(), 'lamports');
      console.log('Base balance:         ', event.baseTokenBalance.toString());
      console.log('Quote deposit total:  ', event.quoteTokenDepositTotal.toString());

      return event;
    }
  }

  return null; // No swap event found in this transaction.
}
```

## 从事件追踪当前价格

从每个 `BondingCurveSwapEvent` 中包含的兑换后储备状态推导当前价格，而非在每次交易后重新获取账户：

```typescript {% title="price-from-event.ts" showLineNumbers=true %}
function getPriceFromEvent(event: BondingCurveSwapEvent, bucket: BondingCurveBucketV2) {
  // totalTokens = virtualTokens + post-swap baseTokenBalance (included in the event)
  const totalTokens = bucket.virtualTokens + event.baseTokenBalance;
  // totalSol = virtualSol + post-swap quoteTokenDepositTotal (included in the event)
  const totalSol = bucket.virtualSol + event.quoteTokenDepositTotal;
  // Price: tokens per SOL (lamports per base token unit as bigint)
  return totalSol > 0n ? totalTokens / totalSol : 0n;
}
```

{% callout type="note" %}
`virtualSol` 和 `virtualTokens` 包含在每个 `BondingCurveSwapEvent` 中——从事件计算价格无需单独获取账户。它们在曲线创建后不可更改。
{% /callout %}

## 生命周期事件

通过监听 Genesis 程序指令和内部指令事件来追踪联合曲线的完整生命周期。关于使用 SDK 执行兑换交易，请参阅[联合曲线兑换集成](/smart-contracts/genesis/bonding-curve-swaps)。

| 事件 | 描述 | 关键字段 |
|-------|-------------|------------|
| 代币已创建 | SPL 代币铸造，genesis 账户初始化 | `baseMint`、`genesisAccount` |
| 联合曲线已添加 | `BondingCurveBucketV2` 账户创建 | `bucketPda`、`baseTokenAllocation`、`virtualSol`、`virtualTokens` |
| 已最终确定 | 发行配置锁定，bucket 激活 | `genesisAccount` |
| 已上线 | `swapStartCondition` 满足，交易开放 | `bucketPda`、时间戳 |
| 兑换 | 买入或卖出执行 | `BondingCurveSwapEvent`（判别字节 `255`） |
| 已售罄 | `baseTokenBalance === 0` | `bucketPda`、`quoteTokenDepositTotal` |
| 毕业曲柄 | 流动性迁移指令已提交 | `bucketPda`、`raydiumCpmmPool` |
| 已毕业 | Raydium CPMM 池已注入资金，联合曲线已关闭 | `cpmmPoolPda`、累积 SOL |

## 账户判别字节与 PDA 推导

### 判别字节

| 账户 | 判别字节 | 描述 |
|---------|---------------|-------------|
| `GenesisAccountV2` | 每种账户类型唯一 | 主协调账户 |
| `BondingCurveBucketV2` | 每种账户类型唯一 | 联合曲线 AMM 状态 |
| `BondingCurveSwapEvent` | `255`（内部指令） | 程序发出的每次兑换事件 |

### PDA Seeds

| PDA | Seeds |
|-----|-------|
| `GenesisAccountV2` | `["genesis_account_v2", baseMint, genesisIndex (u8)]` |
| `BondingCurveBucketV2` | `["bonding_curve_bucket_v2", genesisAccount, bucketIndex (u8)]` |

在 TypeScript 中使用 Genesis SDK 的 `findGenesisAccountV2Pda` 和 `findBondingCurveBucketV2Pda` 推导 PDA。

## 注意事项

- `virtualSol` 和 `virtualTokens` 包含在每个 `BondingCurveSwapEvent` 中——从事件计算价格无需单独获取账户；它们在曲线创建后不可更改
- `BondingCurveSwapEvent` 的判别字节始终为 `255`——Genesis 程序上任何以该字节开头的内部指令都是兑换事件
- 在 `isSoldOut` 返回 `true` 与 `isGraduated` 返回 `true` 之间，曲线已售罄但 Raydium CPMM 池尚未注入资金；在 `isGraduated` 确认池已存在之前，请勿将用户引导至 Raydium
- `isGraduated` 每次调用都会发起一次 RPC 请求——请在索引器中缓存结果，而非每次渲染时调用

## FAQ

### 如何解码 BondingCurveSwapEvent？

在 Genesis 程序（`GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`）的内部指令中找到首个数据字节为 `255` 的条目。截去该字节并将剩余部分传给 `getBondingCurveSwapEventSerializer().deserialize(data.slice(1))`。返回的对象包含 `swapDirection`、`quoteTokenAmount`、`baseTokenAmount`、`fee`、`creatorFee` 以及兑换后的储备状态（`baseTokenBalance`、`quoteTokenDepositTotal`、`virtualSol`、`virtualTokens`、`blockTime`）。

### isSoldOut 和 isGraduated 有什么区别？

`isSoldOut` 是本地同步检查——`baseTokenBalance` 为 `0n` 时立即返回 `true`。`isGraduated` 是异步 RPC 调用，验证 Raydium CPMM 池是否已在链上创建并注入资金。在售罄与毕业之间存在一个窗口期，此时 `isSoldOut` 为 `true` 但 `isGraduated` 为 `false`。在 `isGraduated` 确认池已存在之前，请勿将用户重定向至 Raydium。
