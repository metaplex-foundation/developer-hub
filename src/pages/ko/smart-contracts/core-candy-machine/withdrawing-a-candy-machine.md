---
title: Core Candy Machine 철회하기
metaTitle: Core Candy Machine 철회하기 | Core Candy Machine
description: Solana에서 온체인 저장소 임대료를 회수하기 위해 Core Candy Machine을 철회하고 영구 삭제하는 방법입니다.
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

## 요약

`deleteCandyMachine` 지시사항은 Solana 블록체인에서 [Core Candy Machine](/ko/smart-contracts/core-candy-machine)을 영구적으로 제거하고 저장된 모든 임대 면제 SOL을 권한 지갑으로 반환합니다. {% .lead %}

- Candy Machine 계정 데이터를 삭제하고 전체 임대 보증금을 권한에게 회수합니다
- 이 작업은 되돌릴 수 없습니다 -- 철회 후 Candy Machine은 복원하거나 복구할 수 없습니다
- Candy Machine 권한만이 이 지시사항을 실행할 수 있습니다

## Core Candy Machine 계정 철회

`deleteCandyMachine` 함수는 온체인 Candy Machine 계정을 닫고, 저장된 모든 데이터(구성 라인, 설정, 아이템 항목)를 삭제하며, 임대 면제 SOL 잔액을 권한 지갑으로 전송합니다.

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

## 참고사항

- 이 작업은 되돌릴 수 없습니다. 일단 철회하면 Candy Machine 계정과 모든 데이터가 블록체인에서 영구적으로 삭제됩니다.
- 철회는 Candy Machine 생성 시 할당된 전체 임대 면제 SOL 보증금을 회수합니다. 더 많은 구성 라인을 가진 대규모 컬렉션일수록 더 많은 SOL이 반환됩니다.
- 모든 민팅 활동이 완료되고 Candy Machine이 더 이상 어떤 용도로도 필요하지 않을 때만 철회하세요.
- 호출자는 Candy Machine 권한이어야 합니다. 다른 지갑은 삭제 지시사항을 실행할 수 없습니다.
- Candy Guard가 Candy Machine에 연결되어 있는 경우 별도로 처리해야 합니다 -- Candy Machine을 삭제해도 Candy Guard 계정이 자동으로 닫히지 않습니다.

