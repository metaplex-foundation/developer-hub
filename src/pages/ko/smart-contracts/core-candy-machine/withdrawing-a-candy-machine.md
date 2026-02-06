---
title: Core Candy Machine 철회하기
metaTitle: Core Candy Machine 철회하기 | Core Candy Machine
description: Core Candy Machine을 철회하고 임대료를 회수하는 방법입니다.
---

Core Candy Machine의 철회는 Candy Machine의 모든 온체인 저장소 임대 비용을 반환하며 동시에 데이터를 삭제하고 Candy Machine을 사용할 수 없게 만듭니다.

{% callout %}
이 작업은 되돌릴 수 없으므로 민팅 프로세스를 100% 완료했을 때만 Core Candy Machine을 철회하세요. Core Candy Machine은 복원하거나 복구할 수 없습니다.
{% /callout %}

{% dialect-switcher title="Core Candy Machine 철회하기" %}
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
