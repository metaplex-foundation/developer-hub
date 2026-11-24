---
title: Unlocked Bucket
metaTitle: Genesis Unlocked Bucket——资金库与非归属分配 | Metaplex
description: 使用 Genesis UnlockedBucketV2 接收募集的 SOL 并持有非归属的代币分配，并在领取窗口开放后通过 claimUnlockedV2 领取。
created: '10-29-2026'
updated: '11-24-2026'
keywords:
  - Genesis unlocked bucket
  - UnlockedBucketV2
  - claimUnlockedV2
  - addUnlockedBucketV2
  - launch treasury
  - raised SOL withdrawal
  - team token allocation
about:
  - Genesis unlocked buckets
  - Treasury allocations
  - Token claims
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
howToSteps:
  - 在最终化之前添加带有接收者、分配量和领取窗口的 UnlockedBucketV2
  - 将销售 bucket 的 SendQuoteTokenPercentage 结束行为指向 Unlocked bucket
  - 存款结束后运行 triggerBehaviorsV2，转移募集的 SOL
  - 领取窗口开放后调用 claimUnlockedV2
howToTools:
  - Node.js
  - Umi framework
  - Genesis SDK
faqs:
  - q: Genesis 中的 Unlocked bucket 是什么？
    a: UnlockedBucketV2 是一种流出型 bucket，在领取窗口开放后，会将其全部基础代币和报价代币余额支付给单个接收者。它没有存款，也没有归属。
  - q: 什么时候应该使用 Unlocked bucket 而不是领取计划 bucket？
    a: 对于接收者应一次性获得的资金（例如用于资金库的募集 SOL 或做市商分配），请使用 Unlocked bucket。对于必须随时间解锁的团队或投资人代币，请使用 ClaimScheduleBucketV2。
  - q: 接收者必须签署 claimUnlockedV2 吗？
    a: 不需要。任何支付者都可以发送 claimUnlockedV2，但代币始终转给 bucket 上存储的接收者。请显式传入接收者，因为 SDK 默认将接收者设为支付者。
  - q: Unlocked bucket 可以多次领取吗？
    a: 可以。每次领取都会清扫当前余额，因此在领取窗口开放期间，之后由 rollover 或重新分配行为计入的代币可以再次领取。
  - q: 从 Unlocked bucket 领取募集的 SOL 需要支付费用吗？
    a: 领取报价代币时会从中扣除 bucket 的领取费。当前费率列于 Genesis 概述页面的协议费用部分。
---

`UnlockedBucketV2` 是一种 [Genesis](/zh/smart-contracts/genesis) bucket，它会在领取窗口开放后，立即将其全部余额（包括基础代币和募集的报价代币）支付给单个接收者。 {% .lead %}

## 摘要 {% #summary %}

Unlocked bucket 持有可选的基础代币分配，通过结束行为接收报价代币（例如募集的 SOL），并允许任何人在领取窗口期间将这两种余额清扫给其接收者。

- 一个 bucket 只有一个接收者，没有归属曲线
- 通常作为销售收益、rollover 的 Raydium 代币以及失败销售重新分配的代币的目标
- `claimUnlockedV2` 无需许可且可重复调用，但始终支付给存储的接收者
- 当代币必须归属时，请改用[领取计划 bucket](/zh/smart-contracts/genesis/project-vesting)

**跳转至：** [使用场景](#when-to-use-an-unlocked-bucket) · [添加](#adding-an-unlocked-bucket) · [注资](#funding-an-unlocked-bucket) · [领取](#claiming-from-an-unlocked-bucket) · [错误](#common-unlocked-bucket-errors)

## 何时使用 Unlocked Bucket {% #when-to-use-an-unlocked-bucket %}

Unlocked bucket 适用于接收者应在某一时刻一次性全额获得、而非随时间获得的任何分配。

| 使用场景 | Bucket | 原因 |
|----------|--------|-----|
| 用于项目资金库的募集 SOL | `UnlockedBucketV2` | 接收 `SendQuoteTokenPercentage` 收益，并在一次领取中全部支付 |
| 做市商或交易所库存 | `UnlockedBucketV2` | 上市时就需要代币，没有 cliff |
| 未使用 Raydium 基础代币的目标 | `UnlockedBucketV2` | 在毕业后接收 `BaseTokenRollover` 转入 |
| 失败销售未售出代币的目标 | `UnlockedBucketV2` | 接收 `ReallocateBaseTokensOnFailure` 转入 |
| 团队、顾问或投资人代币 | [`ClaimScheduleBucketV2`](/zh/smart-contracts/genesis/project-vesting) | 需要 cliff 和线性解锁 |
| Launch Pool 中的存款人归属 | Launch Pool `claimSchedule` 扩展 | 对每个存款人自己的代币进行归属 |

## 添加 Unlocked Bucket {% #adding-an-unlocked-bucket %}

`addUnlockedBucketV2` 在 `finalizeV2` 之前创建 bucket，并设置接收者、基础代币分配量和领取窗口。

{% code-tabs-imported from="genesis/add_unlocked_treasury_bucket_v2" frameworks="umi" filename="addUnlockedBucket" /%}

| 参数 | 描述 |
|----------|-------------|
| `recipient` | 接收每次领取的钱包 |
| `baseTokenAllocation` | 从总供应量中预留的基础代币。对于只接收报价代币的 bucket，使用 `0n` |
| `claimStartCondition` | 领取何时开放。属于开始槽位：`TimeAbsolute`、`TimeRelative` 或 `Always` |
| `claimEndCondition` | 领取何时关闭。`TimeAbsolute`、`TimeRelative` 或 `Never` |
| `backendSigner` | 可选，每次领取都必须共同签名的签名者。Genesis authority 之后可以通过 `setBucketBackendSignerV2` 轮换或清除它 |
| `bucketIndex` | PDA 种子 `["unlocked_v2", genesisAccount, bucketIndex]`。默认为 `0` |

{% callout type="warning" %}
对于任何接收 `BaseTokenRollover` 或失败重新分配的 Unlocked bucket，请使用 `createNeverCondition()` 作为领取结束条件。在领取窗口关闭后才计入的代币将永远无法领取。
{% /callout %}

`updateUnlockedBucketV2` 可以在 `finalizeV2` 之前更改分配量和领取条件。Unlocked bucket 自身不执行结束行为；它们始终作为目标。

## 为 Unlocked Bucket 注资 {% #funding-an-unlocked-bucket %}

Unlocked bucket 以其基础代币分配量起步，其余所有资金都通过其他 bucket 的[结束行为](/zh/smart-contracts/genesis/end-behaviors)转入。

| 转入内容 | 源 bucket 行为 | 典型时间 |
|--------|------------------------|----------------|
| 募集的报价代币 | Launch Pool、Presale 或联合曲线上的 `SendQuoteTokenPercentage` | 存款结束后 |
| 未使用的 Raydium 基础代币 | Raydium CPMM bucket 上的 `BaseTokenRollover` | 毕业后 |
| 失败时未售出的基础代币 | 销售或 Raydium bucket 上的 `ReallocateBaseTokensOnFailure` | 销售失败后 |
| 未归属的代币 | 领取计划 bucket 上的 `ReallocateBaseTokensOnCancel` | 取消后 |

请将 Unlocked bucket 及其报价代币账户作为一对剩余账户传给 `triggerBehaviorsV2`。报价代币账户是由该 bucket 持有的报价代币铸币[关联代币账户](/zh/solana/understanding-solana-accounts#associated-token-accounts-atas)。

{% code-tabs-imported from="genesis/trigger_launch_pool_graduation_v2" frameworks="umi" filename="triggerBehaviorsV2" /%}

## 从 Unlocked Bucket 领取 {% #claiming-from-an-unlocked-bucket %}

`claimUnlockedV2` 将 bucket 的全部基础代币余额及其报价代币余额（扣除领取费）清扫给存储的接收者。

{% code-tabs-imported from="genesis/claim_unlocked_v2" frameworks="umi" filename="claimUnlockedV2" /%}

| 规则 | 详情 |
|------|--------|
| 签名者 | 任何手续费支付者；接收者无需签名 |
| 目标 | 始终是存储的 `recipient`；不一致时失败并返回 `RecipientMismatch` |
| SDK 默认值 | `recipient` 默认为支付者，因此由 crank 领取时请显式传入 |
| 窗口 | 领取开始条件必须已满足，且领取结束条件未满足 |
| 重复领取 | 只要有新的余额可清扫，就允许领取 |
| 后端签名者 | 如已配置，必须共同签名 |

{% callout type="note" %}
领取之前，请先对销售 bucket 运行 `triggerBehaviorsV2`。在此之前，募集的 SOL 仍在销售 bucket 中，领取只会支付基础代币。
{% /callout %}

### 在 Raydium 毕业时领取 {% #claiming-at-raydium-graduation %}

引用 `BucketTimes.Graduate` 的 `TimeRelative` 领取开始条件，只有在对 Unlocked bucket 运行 `triggerConditionsV2` 并将 Raydium bucket 作为剩余账户传入之后才会开放。请参阅[条件与触发](/zh/smart-contracts/genesis/conditions#opening-claims-at-raydium-graduation)。

### 销售失败后领取 {% #claiming-after-a-failed-sale %}

带有指向 Unlocked bucket 的 `TransmitFailure` 行为的销售，在失败时会立即开放领取，忽略领取开始条件。领取结束条件仍然适用。

## 常见 Unlocked Bucket 错误 {% #common-unlocked-bucket-errors %}

Unlocked bucket 错误用于指出在窗口之外的领取、错误的接收者，或已没有可清扫余额的 bucket。

| 错误 | 原因 | 解决方法 |
|-------|-------|------------|
| `RecipientMismatch` | `recipient` 与 bucket 上存储的接收者不同 | 获取 bucket 并传入 `bucket.recipient` |
| `UnlockedBucketAlreadyClaimed` | 基础代币和报价代币余额均为零 | 等待新的转入，或已无剩余 |
| `InvalidBackendSigner` | 已配置的后端签名者未共同签名 | 添加后端签名者，或使用 `setBucketBackendSignerV2` 轮换丢失的密钥 |
| `ClaimNotStarted` | 领取开始条件未满足 | 等待；对于 `TimeRelative` 开始条件，先运行 `triggerConditionsV2` |
| `UnlockedBucketClaimEnded` | 领取结束条件已过 | 对会收到延迟转入的 bucket 使用 `Never` 领取结束条件 |

## 注意事项 {% #notes %}

- 当报价代币铸币为 wrapped SOL 时，领取会关闭 bucket 的报价代币账户。在再次运行向该 bucket 发送报价代币的行为之前，请重新创建该 ATA。
- 来自任何销售的 `TransmitFailure` 都会开放该 bucket，因此只应从该 bucket 所等待毕业的那个销售上挂载它。
- 领取费用列于[协议费用](/zh/smart-contracts/genesis#protocol-fees)。
- 示例已在 devnet 上使用 `@metaplex-foundation/genesis@0.44.0`，针对已部署的 Genesis 程序版本 `genesis v0.41.0`（`GNS1S5J5AspKXgpjz6SvKL66kPaKWAhaGRhCqPRxii2B`）运行。来源：[metaplex-foundation/genesis](https://github.com/metaplex-foundation/genesis)。

## 常见问题 {% #faq %}

### Genesis 中的 Unlocked bucket 是什么？

`UnlockedBucketV2` 是一种流出型 bucket，在领取窗口开放后，会将其全部基础代币和报价代币余额支付给单个接收者。它没有存款，也没有归属。

### 什么时候应该使用 Unlocked bucket 而不是领取计划 bucket？

对于接收者应一次性获得的资金（例如用于资金库的募集 SOL 或做市商分配），请使用 Unlocked bucket。对于必须随时间解锁的团队或投资人代币，请使用 `ClaimScheduleBucketV2`。

### 接收者必须签署 claimUnlockedV2 吗？

不需要。任何支付者都可以发送 `claimUnlockedV2`，但代币始终转给 bucket 上存储的接收者。请显式传入接收者，因为 SDK 默认将接收者设为支付者。

### Unlocked bucket 可以多次领取吗？

可以。每次领取都会清扫当前余额，因此在领取窗口开放期间，之后由 rollover 或重新分配行为计入的代币可以再次领取。

### 从 Unlocked bucket 领取募集的 SOL 需要支付费用吗？

领取报价代币时会从中扣除 bucket 的领取费。当前费率列于 Genesis 概述页面的[协议费用](/zh/smart-contracts/genesis#protocol-fees)部分。

## 术语表 {% #glossary %}

| 术语 | 定义 |
|------|------------|
| **UnlockedBucketV2** | 一种 Genesis 流出型 bucket，在领取窗口期间将其全部余额支付给单个接收者 |
| **接收者（Recipient）** | 存储在 bucket 上、接收每次领取的钱包 |
| **领取窗口（Claim window）** | 领取开始条件与领取结束条件之间的时间段 |
| **清扫（Sweep）** | 转移 bucket 当前全部余额的领取 |
| **报价代币（Quote tokens）** | 存款人用于支付的代币，通常为 wrapped SOL |
