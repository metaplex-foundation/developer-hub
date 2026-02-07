---
title: SOL転送
metaTitle: SOL転送 | Toolbox
description: UmiでSOLを転送する方法。
---

以下の命令は、SystemプログラムとMPL System Extrasプログラムの一部です。Systemプログラムについては、[Solanaの公式ドキュメント](https://docs.solanalabs.com/runtime/programs#system-program)で詳しく学ぶことができます。

## SOL転送

この命令により、あるアカウントから別のアカウントにSOLを転送できます。転送するSOLの量を**ラムポート**単位で指定する必要があります（1/1,000,000 SOL）。

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

## 全SOL転送

この命令は、SPL Systemプログラムの**SOL転送**命令と似ていますが、送信元アカウントから宛先アカウントにすべてのSOLを転送する点が異なります。

これは、アカウントからすべてのラムポートを排出したいが、そのアカウントを使用してトランザクションの支払いを行いたい場合に特に便利です。この命令がなければ、手動でアカウント残高を取得し、推定トランザクション料金を差し引く必要がありますが、これは特に優先料金を扱う場合に困難な処理になります。

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { transferAllSol } from '@metaplex-foundation/mpl-toolbox'

const destination = publicKey(`11111111111111111111111`)

await transferAllSol(umi, {
  source: umi.identity,
  destination,
}).sendAndConfirm(umi)
```
