---
title: Core Candy Machineの引き出し
metaTitle: Core Candy Machineの引き出し | Core Candy Machine
description: Solana上のオンチェーンストレージレントを回収するために、Core Candy Machineを引き出して永久に削除する方法。
keywords:
  - core candy machine
  - withdraw candy machine
  - delete candy machine
  - deleteCandyMachine
  - reclaim rent
  - Solana rent
  - candy machine cleanup
  - mpl-core-candy-machine
  - on-chain storage
about:
  - Withdrawing and deleting a Core Candy Machine
  - Reclaiming Solana rent from Candy Machine accounts
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
---

## Summary

`deleteCandyMachine`命令は、Solanaブロックチェーンから[Core Candy Machine](/ja/smart-contracts/core-candy-machine)を永久に削除し、保存されたすべてのレント免除SOLをAuthorityウォレットに返します。 {% .lead %}

- Candy Machineアカウントデータを削除し、レントデポジット全額をAuthorityに回収します
- この操作は不可逆です -- 引き出し後にCandy Machineを復旧または回復することはできません
- この命令を実行できるのはCandy MachineのAuthorityのみです

## Core Candy Machineアカウントの引き出し

`deleteCandyMachine`関数は、オンチェーンのCandy Machineアカウントを閉じ、保存されたすべてのデータ（config line、設定、アイテムエントリ）を消去し、レント免除SOL残高をAuthorityウォレットに転送します。

{% callout %}
この操作は元に戻せないため、ミントプロセスが100%完了している場合にのみCore Candy Machineを引き出してください。Core Candy Machineは復旧または回復できません。
{% /callout %}

{% dialect-switcher title="Core Candy Machineの引き出し" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { deleteCandyMachine } from '@metaplex-foundation/mpl-core-candy-machine'
import { publicKey } from '@metaplex-foundation/umi'

const candyMachineId = '11111111111111111111111111111111'

await deleteCandyMachine(umi, {
  candyMachine: publicKey(candyMachineId),
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Notes

- この操作は不可逆です。引き出し後、Candy Machineアカウントとそのすべてのデータはブロックチェーンから永久に削除されます。
- 引き出しにより、Candy Machine作成時に割り当てられたレント免除SOLデポジット全額が回収されます。config lineが多い大規模なコレクションほど、より多くのSOLが返還されます。
- すべてのミント活動が完了し、Candy Machineをいかなる目的にも必要としなくなった後にのみ引き出してください。
- 呼び出し元はCandy MachineのAuthorityでなければなりません。他のウォレットは削除命令を実行できません。
- Candy GuardがCandy Machineに関連付けられている場合、別途対処する必要があります -- Candy Machineを削除しても、Candy Guardアカウントは自動的に閉じられません。

