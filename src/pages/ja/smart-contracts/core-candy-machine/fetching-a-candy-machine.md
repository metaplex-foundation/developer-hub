---
title: Core Candy Machineの取得
metaTitle: Core Candy Machineの取得 | Core Candy Machine
description: mpl-core-candy-machine SDKを使用してSolanaブロックチェーンからCore Candy Machineアカウントのオンチェーンデータを取得する方法。
keywords:
  - core candy machine
  - fetch candy machine
  - fetchCandyMachine
  - Solana blockchain
  - on-chain data
  - candy machine account
  - mpl-core-candy-machine
  - UMI SDK
  - candy machine items
  - safeFetchCandyGuard
about:
  - Fetching Core Candy Machine account data
  - Reading on-chain Candy Machine state with UMI
proficiencyLevel: Beginner
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
---

## Summary

`fetchCandyMachine`関数は、設定、Authority、ロードされたアイテムを含む[Core Candy Machine](/ja/smart-contracts/core-candy-machine)の完全なオンチェーンアカウントデータを取得します。 {% .lead %}

- アイテム数、ミント済みアイテム数、ロードされたすべてのconfig lineエントリを含む完全なCandy Machineアカウント状態を返します
- Candy Machineの公開鍵と`mplCoreCandyMachine`プラグインが設定された[UMI](/ja/dev-tools/umi)インスタンスのみが必要です
- ガード設定は別のアカウントに保存されており、`safeFetchCandyGuard`を使用して独立して取得する必要があります

## Core Candy Machineアカウントデータの取得

`fetchCandyMachine`関数は、SolanaブロックチェーンからCandy Machineアカウント全体を読み取り、すべての設定フィールド、ロードされたアイテム、現在のミント進捗を含む型付きオブジェクトにデシリアライズします。

{% dialect-switcher title="Core Candy Machineの取得" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchCandyMachine, mplCandyMachine as mplCoreCandyMachine } from "@metaplex-foundation/mpl-core-candy-machine";
import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";

const mainnet = "https://api.mainnet-beta.solana.com"
const devnet = "https://api.devnet.solana.com"

const umi = createUmi(mainnet)
.use(mplCoreCandyMachine())

const candyMachineId = "11111111111111111111111111111111"

const candyMachine = await fetchCandyMachine( umi, publicKey(candyMachineId));

console.log({ candyMachine });
```

{% /dialect %}
{% /dialect-switcher %}

## Notes

- 返されるオブジェクトには、ロードされたconfig lineアイテムの完全なリスト、アイテム数、ミント済みアイテム数、すべてのCandy Machine設定が含まれます。
- ガード設定は別のCandy Guardアカウントに保存されています。指定されたCandy Machineのガード設定を取得するには`safeFetchCandyGuard`を使用してください。
- プレースホルダーの公開鍵（`11111111111111111111111111111111`）を実際のCandy Machineアドレスに置き換えてください。
- メインネット使用時は、レート制限を避けるため、公開の`api.mainnet-beta.solana.com`エンドポイントではなく専用のRPCプロバイダーの使用を検討してください。

