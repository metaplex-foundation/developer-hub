---
title: Core Candy Machineの引き出し
metaTitle: Core Candy Machineの引き出し | Core Candy Machine
description: Core Candy Machineを引き出し、そこからレントを回収する方法。
---

Core Candy Machineの引き出しは、Candy Machineのすべてのオンチェーンストレージレント費用を返還し、その後データを削除してCandy Machineを使用不可能にします。

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
