---
title: 優先料金とコンピュート管理
metaTitle: 優先料金とコンピュート管理 | Toolbox
description: Umiで優先料金とコンピュートバジェットプログラムを使用する方法。
---

コンピュートバジェットプログラムにより、カスタムコンピュートユニット制限と価格を設定できます。このプログラムについては、[Solanaの公式ドキュメント](https://docs.solana.com/developing/programming-model/runtime#compute-budget)で詳しく読むことができます。

## コンピュートユニット制限の設定

この命令により、トランザクションにカスタムコンピュートユニット制限を設定できます。

```ts
import { transactionBuilder } from '@metaplex-foundation/umi'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'

await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 600_000 })) // コンピュートユニット制限を設定。
  .add(...) // ここに任意の命令。
  .sendAndConfirm(umi)
```

## コンピュートユニット価格 / 優先料金の設定

この命令により、トランザクションのコンピュートユニットごとにカスタム価格を設定できます。

```ts
import { transactionBuilder } from '@metaplex-foundation/umi'
import { setComputeUnitPrice } from '@metaplex-foundation/mpl-toolbox'

await transactionBuilder()
  .add(setComputeUnitPrice(umi, { microLamports: 1 })) // コンピュートユニットあたりの価格をマイクロラムポートで設定。
  .add(...) // ここに任意の命令。
  .sendAndConfirm(umi)
```

{% callout title="unitsとmicroLamportsの計算方法のガイド" type="note" %}
`microLamports`と`units`に適切な数値を選択できるよう、計算に使用できるさまざまなRPC呼び出しを説明する[小さなガイド](/ja/umi/guides/optimal-transactions-with-compute-units-and-priority-fees)が作成されました。
{% /callout %}