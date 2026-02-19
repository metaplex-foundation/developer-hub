---
title: アカウント作成
metaTitle: アカウント作成 | Toolbox
description: Umiでアカウントを作成する方法。
---

以下の命令はSystemプログラムとMPL System Extrasプログラムの一部です。Systemプログラムについては、[Solanaの公式ドキュメント](https://docs.solanalabs.com/runtime/programs#system-program)で詳しく学ぶことができます。

## アカウント作成

この命令により、Solana上に新しい未初期化アカウントを作成できます。アカウントのサイズと、それを所有するプログラムを指定できます。

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

## 賃料付きアカウント作成

この命令により、賃料免除を手動で取得する必要なく新しいアカウントを作成できます。プログラム内の`Rent` sysvarを活用して、提供された`space`属性に基づいて賃料免除を計算し、その後SPL SystemプログラムへのCPI（Cross-Program Invocation）呼び出しを実行して、計算された賃料でアカウントを作成します。

**利点**: この命令を使用することで、クライアントはRPCノードから賃料免除を取得するための追加のHTTPリクエストを行う必要がなくなり、プロセスが合理化されます。

**制限**: この命令はCPI呼び出しを伴うため、作成できるアカウントの最大サイズは10KBに制限されます。これは、SPL Systemプログラムを直接使用する場合の10MBと比較してです。

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
