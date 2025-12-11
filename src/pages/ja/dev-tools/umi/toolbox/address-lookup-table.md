---
title: アドレスルックアップテーブル
metaTitle: アドレスルックアップテーブル | Toolbox
description: Umiでアドレスルックアップテーブルを使用する方法。
---

SPLアドレスルックアップテーブルプログラムは、カスタムルックアップテーブル（**LUTs**または**ALTs**とも呼ばれます）を作成してからトランザクションで使用することにより、トランザクションのサイズを削減するために使用できます。このプログラムでは、LUTを作成および拡張できます。このプログラムについては、[Solanaの公式ドキュメント](https://docs.solana.com/developing/lookup-tables)で詳しく学ぶことができます。

## 空のLUTを作成

この命令により、空のアドレスルックアップテーブル（LUT）アカウントを作成できます。

```ts
import { createEmptyLut } from '@metaplex-foundation/mpl-toolbox'

const recentSlot = await umi.rpc.getSlot({ commitment: 'finalized' })

await createEmptyLut(umi, {
  recentSlot,
  authority,
}).sendAndConfirm(umi)
```

## LUTを拡張

この命令により、既存のLUTアカウントに新しいアドレスを追加できます。

```ts
import { findAddressLookupTablePda, extendLut } from '@metaplex-foundation/mpl-toolbox'

// LUTの作成に使用された権限とスロット。
const lutAddress = findAddressLookupTablePda(umi, { authority, recentSlot })

await extendLut(umi, {
  authority,
  address: lutAddress, // LUTのアドレス。
  addresses: [addressA, addressB], // LUTに追加するアドレス。
}).sendAndConfirm(umi)
```

## アドレス付きでLUTを作成

このヘルパーメソッドは、空のLUTの作成と指定されたアドレスでの拡張を単一のトランザクションに組み合わせて、初期アドレスを持つLUTを作成するプロセスを簡素化します。

```ts
import { createLut } from '@metaplex-foundation/mpl-toolbox'

const recentSlot = await umi.rpc.getSlot({ commitment: 'finalized' })

await createLut(umi, {
  authority,
  recentSlot,
  addresses: [addressA, addressB],
}).sendAndConfirm(umi)
```

## トランザクションビルダー用のLUTを作成

このヘルパーメソッドは、特定のトランザクションビルダー用にLUTを作成するように設計されています。

```ts
import { createLutForTransactionBuilder } from '@metaplex-foundation/mpl-toolbox'

// 1. 指定されたトランザクションビルダーのLUTビルダーとLUTアカウントを取得。
const recentSlot = await umi.rpc.getSlot({ commitment: 'finalized' })

const [createLutBuilders, lutAccounts] = createLutForTransactionBuilder(
  umi,
  baseBuilder,
  recentSlot
)

// 2. LUTを作成。
for (const createLutBuilder of createLutBuilders) {
  await createLutBuilder.sendAndConfirm(umi)
}

// 3. ベーストランザクションビルダーでLUTを使用。
await baseBuilder.setAddressLookupTables(lutAccounts).sendAndConfirm(umi)
```

## LUTをフリーズ

この命令により、LUTをフリーズして不変にすることができます。

```ts
import { findAddressLookupTablePda, freezeLut } from '@metaplex-foundation/mpl-toolbox'

// LUTの作成に使用された権限とスロット。
const lutAddress = findAddressLookupTablePda(umi, { authority, recentSlot })

await freezeLut(umi, {
  authority,
  address: lutAddress,
}).sendAndConfirm(umi)
```

## LUTを非アクティブ化

この命令は、LUTを閉じることができるようになる前に「非アクティブ化」期間にします。

**注意**: LUTの非アクティブ化により、新しいトランザクションでは使用できなくなりますが、データは維持されます。

```ts
import { findAddressLookupTablePda, deactivateLut } from '@metaplex-foundation/mpl-toolbox'

// LUTの作成に使用された権限とスロット。
const lutAddress = findAddressLookupTablePda(umi, { authority, recentSlot })

await deactivateLut(umi, {
  authority,
  address: lutAddress,
}).sendAndConfirm(umi)
```

## LUTを閉じる

この命令は、一定期間非アクティブ化された後、LUTアカウントを永続的に閉じます。

```ts
import { findAddressLookupTablePda, closeLut } from '@metaplex-foundation/mpl-toolbox'

// LUTの作成に使用された権限とスロット。
const lutAddress = findAddressLookupTablePda(umi, { authority, recentSlot })

await closeLut(umi, {
  authority,
  address: lutAddress,
}).sendAndConfirm(umi)
```