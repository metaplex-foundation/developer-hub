---
title: Core Candy Machine 업데이트하기
metaTitle: Core Candy Machine 업데이트하기 | Core Candy Machine
description: Core Candy Machine과 다양한 설정을 업데이트하는 방법을 알아보세요.
---

{% dialect-switcher title="Core Candy Machine 업데이트하기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  updateCandyMachine
} from '@metaplex-foundation/mpl-core-candy-machine'

const candyMachine = generateSigner(umi)

await updateCandyMachine(umi, {
  candyMachine,
  data: {
    itemsAvailable: 3333;
    isMutable: true;
    configLineSettings: none();
    hiddenSettings: none();
}
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 인수

{% dialect-switcher title="Core Candy Machine 업데이트 인수" %}
{% dialect title="JavaScript" id="js" %}

updateCandyMachine 함수에 전달할 수 있는 사용 가능한 인수들입니다.

| 이름         | 타입      |
| ------------ | --------- |
| candyMachine | publicKey |
| data         | data      |

{% /dialect %}
{% /dialect-switcher %}

일부 설정은 민팅이 시작된 후에는 변경/업데이트할 수 없습니다.

### data

{% dialect-switcher title="Candy Machine 데이터 객체" %}
{% dialect title="JavaScript" id="js" %}

```ts
data =  {
    itemsAvailable: number | bigint;
    isMutable: boolean;
    configLineSettings: OptionOrNullable<ConfigLineSettingsArgs>;
    hiddenSettings: OptionOrNullable<HiddenSettingsArgs>;
}
```

- [ConfigLineSettingsArgs](/ko/smart-contracts/core-candy-machine/create#config-line-settings)
- [HiddenSettingsArgs](/ko/smart-contracts/core-candy-machine/create#hidden-settings)

{% /dialect %}
{% /dialect-switcher %}

## Candy Machine에 새 권한 할당하기

Candy Machine 권한을 새 주소로 전송하고 싶은 시나리오가 있을 수 있습니다. 이는 `setMintAuthority` 함수로 달성할 수 있습니다.

export declare type SetMintAuthorityInstructionAccounts = {
/** Candy Machine account. \*/
candyMachine: PublicKey | Pda;
/** Candy Machine authority _/
authority?: Signer;
/\*\* New candy machine authority _/
mintAuthority: Signer;
};

{% dialect-switcher title="Core Candy Machine에 새 권한 할당하기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { setMintAuthority } from '@metaplex-foundation/mpl-core-candy-machine'

const candyMachine = publicKey('11111111111111111111111111111111')
const newAuthority = publicKey('22222222222222222222222222222222')

await setMintAuthority(umi, {
  candyMachine,
  mintAuthority: newAuthority,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

Core Candy Machine에 새 권한을 할당할 때는 컬렉션 자산도 동일한 업데이트 권한으로 업데이트해야 합니다.

## 가드 업데이트하기

가드에서 뭔가 잘못 설정했나요? 민팅 가격에 대한 생각이 바뀌었나요? 민팅 시작을 조금 지연해야 하나요? 걱정하지 마세요. 가드는 생성할 때 사용한 것과 동일한 설정을 사용하여 쉽게 업데이트할 수 있습니다.

설정을 제공하여 새 가드를 활성화하거나 빈 설정을 제공하여 현재 가드를 비활성화할 수 있습니다.

{% dialect-switcher title="가드 업데이트하기" %}
{% dialect title="JavaScript" id="js" %}

Core Candy Machine의 가드를 생성했던 것과 동일한 방식으로 업데이트할 수 있습니다. 즉, `updateCandyGuard` 함수의 `guards` 객체 내부에 설정을 제공하면 됩니다. `none()`으로 설정되거나 제공되지 않은 가드는 비활성화됩니다.

전체 `guards` 객체가 업데이트되므로 **기존의 모든 가드를 재정의합니다**!

따라서 설정이 변경되지 않더라도 활성화하려는 모든 가드에 대한 설정을 제공해야 합니다. 현재 가드로 폴백하기 위해 먼저 candy guard 계정을 가져오고 싶을 수 있습니다.

```tsx
import { some, none, sol } from '@metaplex-foundation/umi'

const candyGuard = await fetchCandyGuard(umi, candyGuardId)
await updateCandyGuard(umi, {
  candyGuard: candyGuard.publicKey,
  guards: {
    ...candyGuard.guards,
    botTax: none(),
    solPayment: some({ lamports: sol(3), destination: treasury }),
  },
  groups: [
    // 비어있거나, 그룹을 사용하는 경우 여기에 데이터를 추가하세요
  ]
})
```

API 참조: [updateCandyGuard](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/updateCandyGuard.html), [CandyGuard](https://mpl-core-candy-machine.typedoc.metaplex.com/types/CandyGuard.html), [DefaultGuardSetArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## Candy Guard 계정 수동으로 래핑 및 언래핑하기

지금까지 대부분의 프로젝트에 가장 적합하므로 Core Candy Machine과 Core Candy Guard 계정을 함께 관리했습니다.

하지만 SDK를 사용하더라도 Core Candy Machine과 Core Candy Guard를 서로 다른 단계에서 생성하고 연결할 수 있다는 점을 유의해야 합니다.

먼저 두 계정을 별도로 생성하고 수동으로 연결/연결 해제해야 합니다.

{% dialect-switcher title="Candy Machine에서 가드 연결 및 연결 해제하기" %}
{% dialect title="JavaScript" id="js" %}

Umi 라이브러리의 `create` 함수는 이미 생성된 모든 Candy Machine 계정에 대해 새로운 Candy Guard 계정을 생성하고 연결하는 것을 처리합니다.

하지만 별도로 생성하여 수동으로 연결/연결 해제하려면 다음과 같이 하면 됩니다.

```ts
import {
  some,
  percentAmount,
  sol,
  dateTime
} from '@metaplex-foundation/umi'
import {
  createCandyMachine,
  createCandyGuard,
  findCandyGuardPda,
  wrap,
  unwrap
} from '@metaplex-foundation/mpl-core-candy-machine'

// Candy Guard 없이 Candy Machine을 생성합니다.
const candyMachine = generateSigner(umi)
await createCandyMachine({
  candyMachine,
  tokenStandard: TokenStandard.NonFungible,
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 100,
  sellerFeeBasisPoints: percentAmount(1.23),
  creators: [
    {
      address: umi.identity.publicKey,
      verified: false,
      percentageShare: 100
    },
  ],
  configLineSettings: some({
    prefixName: 'My NFT #',
    nameLength: 3,
    prefixUri: 'https://example.com/',
    uriLength: 20,
    isSequential: false,
  }),
}).sendAndConfirm(umi)

// Candy Guard를 생성합니다.
const base = generateSigner(umi)
const candyGuard = findCandyGuardPda(umi, { base: base.publicKey })
await createCandyGuard({
  base,
  guards: {
    botTax: { lamports: sol(0.01), lastInstruction: false },
    solPayment: { lamports: sol(1.5), destination: treasury },
    startDate: { date: dateTime('2022-10-17T16:00:00Z') },
  },
}).sendAndConfirm(umi)

// Candy Guard를 Candy Machine과 연결합니다.
await wrap({
  candyMachine: candyMachine.publicKey,
  candyGuard,
}).sendAndConfirm(umi)

// 연결을 해제합니다.
await unwrap({
  candyMachine: candyMachine.publicKey,
  candyGuard,
}).sendAndConfirm(umi)
```

API 참조: [createCandyMachine](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/createCandyMachine.html), [createCandyGuard](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/createCandyGuard.html), [wrap](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/wrap.html), [unwrap](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/unwrap.html)

{% /dialect %}
{% /dialect-switcher %}