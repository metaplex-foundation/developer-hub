---
title: Solana 交易基础
metaTitle: Solana 交易基础 | 交易的工作原理
description: 了解 Solana 交易的工作原理，包括交易结构、签名、发送和确认。这是构建可靠应用的必备知识。
# remember to update dates also in /components/products/guides/index.js
created: '02-04-2026'
updated: '09-21-2026'
---

全面了解 Solana 交易从结构到确认的工作原理。 {% .lead %}

## 您将学到什么

- Solana 交易的组成结构
- 如何签署和发送交易
- 交易确认与最终性
- 版本化交易与旧版交易的区别
- 常见交易错误及其含义

## 先决条件

- [已安装 Solana CLI](/solana/solana-cli-essentials)
- [了解 Solana 账户](/solana/understanding-solana-accounts)

## 交易结构

Solana 交易由多个组成部分构成：

```
┌─────────────────────────────────────────────────────────────┐
│                      Transaction                             │
├─────────────────────────────────────────────────────────────┤
│  Signatures: [sig1, sig2, ...]                              │
│                                                             │
│  Message:                                                   │
│    ├── Header                                               │
│    │     ├── num_required_signatures                        │
│    │     ├── num_readonly_signed_accounts                   │
│    │     └── num_readonly_unsigned_accounts                 │
│    │                                                        │
│    ├── Account Keys: [pubkey1, pubkey2, ...]               │
│    │                                                        │
│    ├── Recent Blockhash                                     │
│    │                                                        │
│    └── Instructions: [                                      │
│          { program_id_index, accounts, data },              │
│          { program_id_index, accounts, data },              │
│        ]                                                    │
└─────────────────────────────────────────────────────────────┘
```

### 关键组成部分

| 组成部分 | 说明 |
|-----------|-------------|
| **签名** | 所需签名者提供的 Ed25519 签名 |
| **近期区块哈希** | 近期区块哈希（有效期约为 60-90 秒） |
| **指令** | 要执行的操作 |
| **账户密钥** | 交易涉及的所有账户 |

## 指令

指令是交易中实际执行的操作。每条指令指定：

- **程序 ID** - 要执行哪个程序
- **账户** - 程序需要哪些账户
- **数据** - 程序参数的序列化数据

```
Instruction:
  ├── program_id: 11111111111111111111111111111111  (System Program)
  ├── accounts:
  │     ├── sender    (signer, writable)
  │     └── recipient (not signer, writable)
  └── data: [encoded transfer amount]
```

### 多条指令

一笔交易可以包含多条以原子方式执行的指令：

```javascript
import { transactionBuilder } from '@metaplex-foundation/umi'

// All instructions succeed or all fail (atomic)
const builder = transactionBuilder()
  .add(createAccountInstruction)
  .add(initializeMintInstruction)
  .add(mintTokensInstruction)

await builder.sendAndConfirm(umi)
```

这种原子性非常强大。如果任何一条指令失败，整笔交易都会回滚。

## 近期区块哈希

每笔交易都需要一个**近期区块哈希**，它可以：
- 证明交易是近期创建的
- 防止重放攻击
- 在约 60-90 秒（约 150 个 slot）后过期

```javascript
// UMI handles blockhash automatically when sending transactions.
// To fetch it manually:
const { blockhash, lastValidBlockHeight } = await umi.rpc.getLatestBlockhash()
```

{% callout title="区块哈希过期" type="warning" %}
如果交易在区块哈希过期前仍未确认，它将被丢弃。对于长时间运行的操作，请在发送前获取新的区块哈希。
{% /callout %}

## 签署交易

交易必须由所有标记为 `isSigner` 的账户签署：

```javascript
// UMI signs automatically with the identity signer when sending.
// For additional signers, pass them during the build:
const tx = await myBuilder
  .setBlockhash(await umi.rpc.getLatestBlockhash())
  .buildAndSign(umi)

// For partial signing (multi-sig workflows), you can sign
// and serialize the transaction, then pass it to another party:
import { base64 } from '@metaplex-foundation/umi/serializers'

const serialized = umi.transactions.serialize(tx)
const encoded = base64.deserialize(serialized)[0]
// ... send encoded string to another party for additional signing ...
```

## 发送交易

### 基本发送方式

```javascript
// Send and wait for confirmation (recommended)
const result = await myBuilder.sendAndConfirm(umi)

// Or just send without waiting
const signature = await myBuilder.send(umi)
```

### 使用选项发送

```javascript
const result = await myBuilder.sendAndConfirm(umi, {
  send: { skipPreflight: false },
  confirm: { commitment: 'confirmed' },
})
```

## 交易确认

Solana 使用多个**承诺级别**来表示交易最终性：

| 承诺级别 | 说明 | 使用场景 |
|------------|-------------|----------|
| `processed` | 交易已被 leader 接收 | 实时更新 |
| `confirmed` | 已获绝大多数验证者投票 | 大多数应用 |
| `finalized` | 已有 31 个以上区块在其之后，不可逆转 | 金融操作 |

### 检查确认状态

```javascript
// sendAndConfirm waits for confirmation automatically.
// To check a signature status manually:
const result = await umi.rpc.getSignatureStatuses([signature])
```

### 实际使用承诺级别

```javascript
// For most operations, 'confirmed' is the right default
const result = await myBuilder.sendAndConfirm(umi, {
  confirm: { commitment: 'confirmed' },
})

// For financial operations where you need full finality
const result = await myBuilder.sendAndConfirm(umi, {
  confirm: { commitment: 'finalized' },
})
```

## 版本化交易

Solana 支持三种交易格式：

### 旧版交易

旧版交易使用 Solana 最初的交易格式，不包含 Address Lookup Tables。

- 原始格式
- 最多只能包含 35 个账户
- 结构更简单

### V0 交易

V0 交易增加了 Address Lookup Table 支持，适用于需要更多账户的交易。

- 支持 **Address Lookup Tables**（ALT）
- 最多可引用 256 个账户
- 复杂 DeFi 操作需要此格式

### V1 交易

V1 交易提高了交易大小上限，并将计算配置存储在消息中。

- 支持最大 4,096 字节的交易
- 将计算预算配置存储在交易消息中
- 不支持 Address Lookup Tables

```javascript
// Umi uses V0 transactions by default. Opt in to V1 explicitly.
const result = await myBuilder
  .useV1()
  .sendAndConfirm(umi)

// To use legacy transactions instead
const result = await myBuilder
  .useLegacyVersion()
  .sendAndConfirm(umi)

// With Address Lookup Tables
import { createLut } from '@metaplex-foundation/mpl-toolbox'

const [lutBuilder, lut] = createLut(umi, {
  recentSlot: await umi.rpc.getSlot({ commitment: 'finalized' }),
  addresses: [addressA, addressB, addressC],
})
await lutBuilder.sendAndConfirm(umi)

// Address Lookup Tables require V0.
await myBuilder
  .useV0()
  .setAddressLookupTables([lut])
  .sendAndConfirm(umi)
```

{% callout title="选择交易版本" %}
- 当交易大于 1,232 字节且钱包支持交易版本 `1` 时，请使用 V1。
- 当交易需要 Address Lookup Table 时，请使用 V0。
- 仅在兼容性要求使用原始格式时，才使用旧版交易。

为了向后兼容，Umi 默认使用 V0。在更改应用级默认版本前，请参阅[从 V0 迁移到 V1 交易](/dev-tools/umi/guides/migrate-to-transaction-v1)。
{% /callout %}

## 交易大小限制

Solana 交易有严格的大小限制：

| 限制 | 值 |
|-------|-------|
| 旧版和 V0 交易大小 | 1,232 字节 |
| V1 交易大小 | 4,096 字节 |
| Address Lookup Tables | 仅限 V0 |
| 最大指令数 | 受大小限制 |

### 处理大小限制

如果交易过大：

1. **使用 V1** - 在不需要 Address Lookup Table 时，将大小上限提高到 4,096 字节
2. **在 V0 中使用 Address Lookup Tables** - 压缩账户引用
3. **拆分为多笔交易** - 按顺序执行
4. **优化指令数据** - 尽量减少序列化数据

## 模拟

在发送前模拟交易，以提前发现错误：

```javascript
// Build the transaction without sending
const tx = await myBuilder
  .setBlockhash(await umi.rpc.getLatestBlockhash())
  .buildAndSign(umi)

// Simulate it
const simulation = await umi.rpc.simulateTransaction(tx, {
  commitment: 'confirmed',
})
console.log('Simulation result:', simulation)
```

模拟有助于：
- 在支付费用前发现错误
- 估算计算单元
- 调试程序逻辑

## 常见交易错误

### “Blockhash not found”

**原因**：区块哈希在交易确认前已过期。

**解决方法**：
1. 使用新的区块哈希重试（UMI 每次发送时会自动获取新的区块哈希）
2. 网络拥堵时，使用 `'finalized'` 承诺级别获取区块哈希
3. 在应用中实现重试逻辑

### “Insufficient funds”

**原因**：账户没有足够的 SOL 支付交易费和租金。

**解决方法**：确保费用支付者有足够的余额：
```bash
solana balance
solana airdrop 1  # On devnet
```

### “Transaction simulation failed”

**原因**：程序逻辑错误。

**解决方法**：在区块浏览器中检查模拟日志（请参阅[使用 Solana 区块浏览器](/solana/using-solana-explorers)），或在发送前模拟交易以检查错误输出。

### “Account not found”

**原因**：交易中的某个账户不存在。

**解决方法**：先创建该账户或检查地址。

### “Invalid account owner”

**原因**：账户由与预期不同的程序所有。

**解决方法**：验证账户所有权是否与所调用的程序一致。

## 实践示例：完整流程

```javascript
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults'
import { transferSol } from '@metaplex-foundation/mpl-toolbox'
import { signerIdentity, generateSigner, sol, publicKey } from '@metaplex-foundation/umi'
import { base58 } from '@metaplex-foundation/umi/serializers'

// 1. Create UMI instance
const umi = createUmi('https://api.devnet.solana.com')

// 2. Set up signer (your wallet)
const signer = generateSigner(umi)
umi.use(signerIdentity(signer))

// 3. Build and send the transaction
const result = await transferSol(umi, {
  source: umi.identity,
  destination: publicKey('RecipientAddressHere...'),
  amount: sol(1),
}).sendAndConfirm(umi)

// 4. Get the transaction signature
const signature = base58.deserialize(result.signature)[0]
console.log('Transaction confirmed:', signature)
console.log(`Explorer: https://explorer.solana.com/tx/${signature}?cluster=devnet`)
```

## 后续步骤

- [计算单元和优先费](/solana/compute-units-and-priority-fees) - 优化交易落地
- [使用 devnet 和 testnet](/solana/working-with-devnet-and-testnet) - 测试交易
- [诊断交易错误](/solana/general/how-to-diagnose-solana-transaction-errors) - 调试失败的交易

## 常见问题

### 我有多长时间确认交易？

交易的区块哈希有效期约为 60-90 秒（约 150 个 slot）。如果在此之后仍未确认，交易将被丢弃。

### 我可以取消交易吗？

不可以。交易一旦提交便无法取消。但是，如果交易尚未确认，您可以使用相同的 nonce（通过 durable nonce）提交新交易，从而有效地“替换”原交易。

### “processed”和“confirmed”有什么区别？

“Processed”表示验证者已收到交易。“Confirmed”表示包含该交易的区块已获得绝大多数（66% 以上）验证者投票。对于重要操作，请始终使用“confirmed”或“finalized”。

### 为什么交易模拟成功后仍然失败？

状态可能在模拟和执行之间发生变化。另一笔交易可能修改了相关账户。这在 NFT 铸造等竞争激烈的场景中很常见。
