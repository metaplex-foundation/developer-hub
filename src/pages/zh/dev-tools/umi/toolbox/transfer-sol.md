---
title: 转移 SOL
metaTitle: 转移 SOL | Toolbox
description: 如何使用 Umi 转移 SOL。
---

以下指令是 System Program 和 MPL System Extras Program 的一部分。您可以在 [Solana 官方文档](https://docs.solanalabs.com/runtime/programs#system-program)中了解有关 System Program 的更多信息。

## 转移 SOL

此指令允许您将 SOL 从一个账户转移到另一个账户。您需要以 **lamports**（SOL 的 1/1,000,000）为单位指定要转移的 SOL 数量

```ts
import { sol, publicKey } from '@metaplex-foundation/umi'
import { transferSol } from '@metaplex-foundation/mpl-toolbox'

const destination = publicKey(`11111111111111111111111`)

await transferSol(umi, {
  source: umi.identity,
  destination,
  amount: sol(1.3),
}).sendAndConfirm(umi)
```

## 转移所有 SOL

此指令与 SPL System 程序的 **转移 SOL** 指令类似，不同之处在于它将源账户的所有 SOL 转移到目标账户。

当您想要清空账户的所有 lamports 同时仍使用该账户支付交易费用时，这特别有用。没有此指令，您需要手动获取账户余额，然后减去估计的交易费用——这个过程可能具有挑战性，特别是在处理优先费时。

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { transferAllSol } from '@metaplex-foundation/mpl-toolbox'

const destination = publicKey(`11111111111111111111111`)

await transferAllSol(umi, {
  source: umi.identity,
  destination,
}).sendAndConfirm(umi)
```
