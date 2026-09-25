---
title: 優先料金とコンピュート管理
metaTitle: 優先料金とコンピュート管理 | Toolbox
description: UmiのV1およびV0トランザクションにコンピュートユニット制限と優先料金を設定します。
keywords:
  - Umi priority fees
  - Umi compute units
  - TransactionV1Config
  - Compute Budget Program
about:
  - Umi
  - Solana Transaction Fees
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '09-04-2024'
updated: '09-21-2026'
---

## まとめ

V1トランザクションのコンピュートユニットと優先料金は、`setTransactionConfig()`で設定します。

- V1では`computeUnitLimit`と合計`priorityFee`を使用します。
- UmiのV1トランザクションビルダーはCompute Budgetプログラム命令を拒否します。
- V0では`setComputeUnitLimit`と`setComputeUnitPrice`を使用します。
- コンピュートユニットあたりのマイクロラムポートで表される優先料金の見積もりは、V1では合計ラムポートに変換する必要があります。

UmiのV1トランザクションではコンピュート制限と優先料金の合計をトランザクションメッセージに格納し、V0トランザクションではCompute Budgetプログラム命令を使用します。

## V1のコンピュートユニットと優先料金を設定する

V1トランザクションでは、`setTransactionConfig()`を使用してコンピュートユニット制限と優先料金の合計を設定します。

```ts {% title="V1 compute configuration" %}
import { lamports, transactionBuilder } from '@metaplex-foundation/umi'

await transactionBuilder()
  .add(myInstruction)
  .useV1()
  .setTransactionConfig({
    computeUnitLimit: 600_000,
    priorityFee: lamports(600),
  })
  .sendAndConfirm(umi)
```

`priorityFee`はコンピュートユニットあたりの価格ではなく、料金の合計です。価格が1,000マイクロラムポート、制限が600,000ユニットの場合、合計は`600,000 × 1,000 ÷ 1,000,000 = 600`ラムポートです。

{% callout type="warning" %}
V1トランザクションビルダーに`setComputeUnitLimit`命令や`setComputeUnitPrice`命令を追加しないでください。UmiはV1トランザクション内のCompute Budget命令を拒否します。
{% /callout %}

## V0のコンピュートユニットと優先料金を設定する

V0トランザクションでは、引き続き`@metaplex-foundation/mpl-toolbox`のCompute Budgetプログラム命令を使用します。

```ts {% title="V0 compute configuration" %}
import { transactionBuilder } from '@metaplex-foundation/umi'
import {
  setComputeUnitLimit,
  setComputeUnitPrice,
} from '@metaplex-foundation/mpl-toolbox'

await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 600_000 }))
  .add(setComputeUnitPrice(umi, { microLamports: 1_000 }))
  .add(myInstruction)
  .useV0()
  .sendAndConfirm(umi)
```

トランザクションで[Address Lookup Table](/dev-tools/umi/toolbox/address-lookup-table)が必要な場合、または接続されたウォレットがV1トランザクションをサポートしていない場合はV0を使用してください。

## 注意事項

- `useV1()`と`setTransactionConfig()`を使用するにはUmi 1.6.0以降が必要です。
- V1のコンピュートユニット制限は1,400,000を超えることができません。
- コンピュートユニットと料金の見積もりについては、[トランザクション実行の最適化](/dev-tools/umi/guides/optimal-transactions-with-compute-units-and-priority-fees)を参照してください。
- すべての互換性要件については、[V0からV1トランザクションへの移行](/dev-tools/umi/guides/migrate-to-transaction-v1)を参照してください。
