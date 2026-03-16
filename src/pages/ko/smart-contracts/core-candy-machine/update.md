---
title: Core Candy Machine 업데이트하기
metaTitle: Core Candy Machine 업데이트하기 | Core Candy Machine
description: Core Candy Machine 설정 업데이트, 권한 재할당, 가드 수정, Candy Guard 계정 수동 래핑 및 언래핑 방법을 알아보세요.
keywords:
  - core candy machine
  - update candy machine
  - candy machine settings
  - candy guard update
  - set mint authority
  - solana NFT
  - metaplex
  - mpl-core-candy-machine
  - wrap candy guard
  - unwrap candy guard
  - guard configuration
  - candy machine authority
about:
  - Core Candy Machine configuration updates
  - Candy Guard management on Solana
  - Metaplex mpl-core-candy-machine SDK
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
faqs:
  - q: 민팅이 시작된 후에 itemsAvailable 수를 변경할 수 있나요?
    a: 아니요. itemsAvailable을 포함한 일부 Core Candy Machine 설정은 첫 번째 아이템이 민팅되면 잠깁니다. 민팅이 시작되기 전에 이 필드를 업데이트하세요.
  - q: Candy Guard를 업데이트하면 기존 가드 설정이 모두 교체되나요?
    a: 네. updateCandyGuard 함수는 전체 guards 객체를 덮어씁니다. 설정이 변경되지 않았더라도 유지하려는 모든 가드를 포함해야 합니다. 먼저 현재 가드 계정을 가져와서 업데이트 호출에 값을 스프레드하세요.
  - q: Candy Machine 권한을 재할당할 때 컬렉션 권한도 업데이트해야 하나요?
    a: 네. Core Candy Machine 권한과 컬렉션 자산 업데이트 권한이 일치해야 합니다. setMintAuthority를 호출한 후 컬렉션 자산도 동일한 새 권한을 사용하도록 업데이트하세요.
  - q: Candy Guard의 래핑과 언래핑의 차이점은 무엇인가요?
    a: 래핑은 Candy Guard 계정을 Core Candy Machine과 연결하여 민팅 중에 가드 규칙이 시행되도록 합니다. 언래핑은 연결을 해제하여 가드 시행을 제거합니다. 대부분의 프로젝트는 가드를 항상 래핑된 상태로 유지합니다.
---

## 요약

`updateCandyMachine` 함수는 초기 생성 후 Core Candy Machine의 온체인 설정을 수정하고, `updateCandyGuard`를 통해 민팅 접근을 제어하는 [가드](/ko/smart-contracts/core-candy-machine/guards)를 변경할 수 있습니다.

- `itemsAvailable`, `isMutable`, [Config Line Settings](/ko/smart-contracts/core-candy-machine/create#config-line-settings), [Hidden Settings](/ko/smart-contracts/core-candy-machine/create#hidden-settings)와 같은 Candy Machine 데이터 필드 업데이트
- `setMintAuthority`를 사용하여 새 지갑으로 민팅 권한 재할당
- `updateCandyGuard`로 가드 규칙 수정 -- 업데이트할 때마다 전체 guards 객체가 교체됨
- `wrap`과 `unwrap`을 사용하여 Candy Guard 계정을 수동으로 연결 또는 분리
{.lead}

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

## 업데이트 함수 인수

`updateCandyMachine` 함수는 Candy Machine 공개키와 수정할 필드를 포함하는 `data` 객체를 받습니다.

{% dialect-switcher title="Core Candy Machine 업데이트 인수" %}
{% dialect title="JavaScript" id="js" %}

| 이름         | 타입      | 설명                                   |
| ------------ | --------- | -------------------------------------- |
| candyMachine | publicKey | 업데이트할 Candy Machine의 공개키       |
| data         | data      | 업데이트된 설정을 포함하는 객체          |

{% /dialect %}
{% /dialect-switcher %}

{% callout type="warning" %}
일부 설정은 민팅이 시작된 후에는 변경할 수 없습니다. 첫 번째 민팅이 발생하기 전에 항상 구성을 확정하세요.
{% /callout %}

### Candy Machine 데이터 객체

`data` 객체는 Core Candy Machine의 변경 가능한 설정을 정의합니다. 변경하려는 필드와 함께 이 객체를 `updateCandyMachine`에 전달하세요.

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

## 새 권한 할당하기

`setMintAuthority` 함수는 Core Candy Machine의 민팅 권한을 새 지갑 주소로 전송합니다. 현재 권한과 새 권한 모두 트랜잭션에 서명해야 합니다.

export declare type SetMintAuthorityInstructionAccounts = {
/**Candy Machine account. \*/
candyMachine: PublicKey | Pda;
/** Candy Machine authority _/
authority?: Signer;
/\*\* New candy machine authority_/
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

{% callout type="warning" %}
Core Candy Machine에 새 권한을 할당할 때 컬렉션 자산도 동일한 업데이트 권한으로 업데이트해야 합니다. Candy Machine 권한과 컬렉션 업데이트 권한이 일치해야 민팅이 성공합니다.
{% /callout %}

## Candy Guard 업데이트하기

`updateCandyGuard` 함수는 Candy Guard 계정의 전체 [가드](/ko/smart-contracts/core-candy-machine/guards) 구성을 교체합니다. 민팅 가격 변경, 시작 날짜 조정, 새 가드 활성화 또는 기존 가드 비활성화에 사용합니다.

설정을 제공하여 새 가드를 활성화하거나 빈 설정을 제공하여 현재 가드를 비활성화할 수 있습니다.

{% dialect-switcher title="가드 업데이트하기" %}
{% dialect title="JavaScript" id="js" %}

Core Candy Machine의 가드를 생성했던 것과 동일한 방식으로 업데이트할 수 있습니다. 즉, `updateCandyGuard` 함수의 `guards` 객체 내부에 설정을 제공하면 됩니다. `none()`으로 설정되거나 제공되지 않은 가드는 비활성화됩니다.

{% callout type="warning" %}
전체 `guards` 객체가 업데이트되므로 **기존의 모든 가드를 재정의합니다**. 설정이 변경되지 않더라도 활성화하려는 모든 가드에 대한 설정을 제공해야 합니다. 현재 가드로 폴백하기 위해 먼저 candy guard 계정을 가져오세요.
{% /callout %}

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

## Candy Guard 계정 래핑 및 언래핑하기

래핑은 Candy Guard를 Core Candy Machine과 연결하여 민팅 중에 가드 규칙이 시행되도록 합니다. 언래핑은 연결을 해제합니다. 대부분의 프로젝트는 두 계정을 함께 생성하지만, 필요에 따라 독립적으로 관리할 수 있습니다.

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

## 참고 사항

- `itemsAvailable`을 포함한 일부 Candy Machine 설정은 첫 번째 아이템이 민팅되면 잠깁니다. 민팅이 시작되기 전에 모든 데이터 필드를 확정하세요.
- `updateCandyGuard`를 호출하면 **전체** guards 객체가 교체됩니다. 변경 사항을 적용하기 전에 항상 현재 가드 상태를 가져와 기존 값을 스프레드하세요. 그렇지 않으면 의도치 않게 활성 가드가 비활성화됩니다.
- Core Candy Machine 권한과 컬렉션 자산 업데이트 권한이 일치해야 합니다. `setMintAuthority`로 권한을 재할당하는 경우 컬렉션 자산 권한도 함께 업데이트하세요.
- 래핑과 언래핑은 가드 생성과 별개입니다. Candy Guard는 Candy Machine과 래핑(연결)되기 전까지 민팅에 영향을 미치지 않습니다.

## FAQ

### 민팅이 시작된 후에 itemsAvailable 수를 변경할 수 있나요?

아니요. `itemsAvailable`을 포함한 일부 Core Candy Machine 설정은 첫 번째 아이템이 민팅되면 잠깁니다. 민팅이 시작되기 전에 이 필드를 업데이트하세요.

### Candy Guard를 업데이트하면 기존 가드 설정이 모두 교체되나요?

네. `updateCandyGuard` 함수는 전체 `guards` 객체를 덮어씁니다. 설정이 변경되지 않았더라도 유지하려는 모든 가드를 포함해야 합니다. 먼저 현재 가드 계정을 가져와서 업데이트 호출에 값을 스프레드하세요.

### Candy Machine 권한을 재할당할 때 컬렉션 권한도 업데이트해야 하나요?

네. Core Candy Machine 권한과 컬렉션 자산 업데이트 권한이 일치해야 합니다. `setMintAuthority`를 호출한 후 컬렉션 자산도 동일한 새 권한을 사용하도록 업데이트하세요.

### Candy Guard의 래핑과 언래핑의 차이점은 무엇인가요?

래핑은 Candy Guard 계정을 Core Candy Machine과 연결하여 민팅 중에 가드 규칙이 시행되도록 합니다. 언래핑은 연결을 해제하여 가드 시행을 제거합니다. 대부분의 프로젝트는 가드를 항상 래핑된 상태로 유지합니다.

