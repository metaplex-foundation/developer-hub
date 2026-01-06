---
title: 创建账户
metaTitle: 创建账户 | Toolbox
description: 如何使用 Umi 创建账户。
---

以下指令是 System Program 和 MPL System Extras Program 的一部分。您可以在 [Solana 官方文档](https://docs.solanalabs.com/runtime/programs#system-program)中了解有关 System Program 的更多信息。

## 创建账户

此指令允许您在 Solana 上创建一个新的未初始化账户。您可以指定账户的大小和将拥有它的程序。

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createAccount } from '@metaplex-foundation/mpl-toolbox'

const newAccount = generateSigner(umi)
const space = 42

await createAccount(umi, {
  newAccount,
  payer: umi.payer
  lamports: await umi.rpc.getRent(space),
  space,
  programId: umi.programs.get('myProgramName').publicKey,
}).sendAndConfirm(umi)
```

## 创建带租金的账户

此指令允许您创建新账户而无需手动获取租金豁免。它利用程序内的 `Rent` 系统变量根据提供的 `space` 属性计算租金豁免，然后执行 CPI（跨程序调用）调用 SPL System 程序以使用计算的租金创建账户。

**优势**：使用此指令，客户端避免了从 RPC 节点获取租金豁免的额外 HTTP 请求，简化了流程。

**限制**：由于此指令涉及 CPI 调用，可以创建的最大账户大小限制为 10KB，而直接使用 SPL System 程序时为 10MB。

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createAccountWithRent } from '@metaplex-foundation/mpl-toolbox'

const newAccount = generateSigner(umi)
const space = 42

await createAccountWithRent(umi, {
  newAccount,
  payer: umi.payer,
  space,
  programId: umi.programs.get('myProgramName').publicKey,
}).sendAndConfirm(umi)
```
