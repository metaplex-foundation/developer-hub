---
title: Candy Machine 관리
metaTitle: 생성, 업데이트, 가져오기 및 삭제 | Candy Machine
description: Candy Machine을 관리하는 방법을 설명합니다.
---

[이전 페이지](/ko/smart-contracts/candy-machine/settings)에서 Candy Machine의 다양한 설정을 살펴보았습니다. 이제 이러한 설정을 사용하여 Candy Machine을 생성하고 업데이트하는 방법을 살펴보겠습니다. 또한 기존 Candy Machine을 가져오는 방법과 목적을 달성했을 때 삭제하는 방법에 대해서도 이야기하겠습니다. {% .lead %}

기본적으로 Candy Machine의 생성, 읽기, 업데이트 및 삭제 단계를 거쳐보겠습니다. 시작해보죠!

## Candy Machine 생성

이전 페이지에서 논의한 설정을 사용하여 새로운 Candy Machine 계정을 생성할 수 있습니다.

우리의 SDK는 이를 한 단계 더 발전시켜 모든 새로운 Candy Machine 계정을 민팅 프로세스에 영향을 주는 모든 활성화된 가드를 추적하는 새로운 Candy Guard 계정과 연결합니다. 이 페이지에서는 Candy Machine 계정에 집중하지만 Candy Guard 계정과 이를 통해 할 수 있는 작업에 대해서는 [전용 페이지](/ko/smart-contracts/candy-machine/guards)에서 다루겠습니다.

Candy Machine은 [컬렉션 NFT와 연결되어야 하고](/ko/smart-contracts/candy-machine/settings#metaplex-certified-collections) 해당 업데이트 권한이 이 작업을 승인해야 한다는 점을 기억하세요. 아직 Candy Machine용 컬렉션 NFT가 없다면 우리의 SDK가 도움을 줄 수 있습니다.

{% callout type="note" title="무작위성" %}

자산의 "무작위" 민팅 프로세스가 완전히 예측할 수 없는 것은 아니며 충분한 리소스와 악의적인 의도로 영향을 받을 수 있으므로 공개 메커니즘을 위해 [숨겨진 설정](/ko/smart-contracts/candy-machine/settings#hidden-settings)을 활용하는 것이 바람직할 수 있습니다.

{% /callout %}

{% dialect-switcher title="Candy Machine 생성" %}
{% dialect title="JavaScript" id="js" %}

다음은 Umi 라이브러리를 통해 새로운 컬렉션 NFT를 사용하여 Candy Machine을 생성하는 방법입니다.

```ts
import {
  createNft,
  TokenStandard,
} from '@metaplex-foundation/mpl-token-metadata'
import { create } from '@metaplex-foundation/mpl-candy-machine'
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'

// 컬렉션 NFT 생성.
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: umi.identity,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
    collectionDetails: {
    __kind: 'V1',
    size: 0,
  },
}).sendAndConfirm(umi)

// Candy Machine 생성.
const candyMachine = generateSigner(umi)
await create(umi, {
  candyMachine,
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority: umi.identity,
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  itemsAvailable: 5000,
  creators: [
    {
      address: umi.identity.publicKey,
      verified: true,
      percentageShare: 100,
    },
  ],
  configLineSettings: some({
    prefixName: '',
    nameLength: 32,
    prefixUri: '',
    uriLength: 200,
    isSequential: false,
  }),
}).sendAndConfirm(umi)
```

위에서 언급했듯이 이 작업은 생성된 Candy Machine과 새로운 Candy Guard 계정을 생성하고 연결하는 것도 처리합니다. 이는 Candy Guard가 없는 Candy Machine은 그다지 유용하지 않고 대부분의 경우 이를 수행하고 싶어하기 때문입니다. 여전히 이 동작을 비활성화하고 싶다면 대신 `createCandyMachineV2` 메서드를 사용할 수 있습니다.

```tsx
import { createCandyMachineV2 } from '@metaplex-foundation/mpl-candy-machine'

await createCandyMachineV2(umi, {
  // ...
}).sendAndConfirm(umi)
```

이 예시에서는 필수 매개변수에만 집중했지만 이 `create` 함수로 할 수 있는 작업을 보려면 다음 API 참조를 확인하는 것이 좋습니다.

API 참조: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html), [createCandyMachineV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/createCandyMachineV2.html).

{% /dialect %}
{% /dialect-switcher %}

## Candy Machine 계정

이제 Candy Machine 계정을 생성했으므로 그 안에 어떤 데이터가 저장되는지 살펴보겠습니다.

먼저 계정이 생성될 때 제공된 모든 설정을 저장하고 변경 사항을 추적합니다. 이러한 설정에 대한 자세한 내용은 [이전 페이지](/ko/smart-contracts/candy-machine/settings)를 참조하세요.

또한 다음 속성들을 저장합니다:

- **Items Redeemed**. Candy Machine에서 민팅된 NFT의 수를 추적합니다. 이 숫자가 0에서 1로 변하는 순간 대부분의 설정은 더 이상 업데이트할 수 없습니다.
- **Account Version**. 이 열거형은 Candy Machine의 계정 버전을 추적하는 데 사용됩니다. 사용 가능한 기능과 계정을 해석하는 방법을 결정하는 데 사용됩니다. 이는 Candy Machine 프로그램(Candy Machine Core 및 Candy Guard 프로그램 포함)의 세 번째이자 최신 반복을 의미하는 "Candy Machine V3"과 혼동하지 않도록 주의하세요.
- **Feature Flags**. 더 많은 기능이 도입됨에 따라 프로그램의 이전 및 이후 호환성을 도와줍니다.

마지막으로 Candy Machine에 삽입된 모든 아이템과 민팅 여부를 저장합니다. 이는 [**숨겨진 설정**](/ko/smart-contracts/candy-machine/settings#hidden-settings)은 아이템을 삽입할 수 없으므로 [**구성 라인 설정**](/ko/smart-contracts/candy-machine/settings#config-line-settings)을 사용하는 Candy Machine에만 적용됩니다. 이 섹션에는 다음 정보가 포함됩니다:

- 로드된 아이템의 수.
- 삽입되었거나 삽입될 모든 아이템의 목록. 아이템이 아직 삽입되지 않았을 때 해당 위치의 아이템 이름과 URI는 비어 있습니다.
- 로드된 아이템을 추적하는 비트맵 — 예 또는 아니오의 목록. 이 비트맵이 모든 예로 가득 찼을 때 모든 아이템이 로드되었습니다.
- 무작위 순서로 민팅할 때 아직 민팅되지 _않은_ 모든 아이템의 목록. 이를 통해 프로그램이 이미 민팅된 인덱스를 선택하는 것을 걱정하지 않고 무작위로 인덱스를 가져와 다시 시작할 수 있습니다.

이 마지막 섹션은 의도적으로 프로그램에서 역직렬화되지 않지만 우리의 SDK가 사람에게 친숙한 형식으로 모든 데이터를 파싱해 줍니다.

Candy Machine 계정에 대한 더 자세한 정보는 [프로그램의 API 참조](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-machine-core#account)를 확인하세요.

{% dialect-switcher title="Candy Machine 계정 내부" %}
{% dialect title="JavaScript" id="js" %}

Umi 라이브러리에서 Candy Machine이 어떻게 모델링되는지 확인하는 가장 좋은 방법은 [`CandyMachine` 계정의 API 참조](https://mpl-candy-machine.typedoc.metaplex.com/types/CandyMachine.html)를 확인하는 것입니다. `create` 함수를 사용할 때 각 Candy Machine에 대해 자동으로 하나가 생성되므로 [`candyGuard` 계정의 API 참조](https://mpl-candy-machine.typedoc.metaplex.com/types/CandyGuard.html)도 확인하는 것이 좋습니다.

다음은 Candy Machine 속성 중 일부를 보여주는 작은 코드 예시입니다.

```tsx
import {
  fetchCandyMachine,
  fetchCandyGuard,
} from '@metaplex-foundation/mpl-candy-machine'

const candyMachine = await fetchCandyMachine(umi, candyMachineAddress)
const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority)

candyMachine.publicKey // Candy Machine 계정의 공개 키.
candyMachine.mintAuthority // 대부분의 경우 Candy Guard 주소인 Candy Machine의 민트 권한.
candyMachine.data.itemsAvailable // 사용 가능한 총 NFT 수.
candyMachine.itemsRedeemed // 민팅된 NFT 수.
candyMachine.items[0].index // 첫 번째 로드된 아이템의 인덱스.
candyMachine.items[0].name // 첫 번째 로드된 아이템의 이름 (접두사 포함).
candyMachine.items[0].uri // 첫 번째 로드된 아이템의 URI (접두사 포함).
candyMachine.items[0].minted // 첫 번째 아이템이 민팅되었는지 여부.
```

{% /dialect %}
{% /dialect-switcher %}

## Candy Machine 가져오기

기존 Candy Machine을 가져오려면 주소만 제공하면 우리의 SDK가 계정 데이터를 파싱해 줍니다.

{% dialect-switcher title="Candy Machine 가져오기" %}
{% dialect title="JavaScript" id="js" %}

다음은 주소를 사용하여 Candy Machine과 관련된 Candy Guard 계정(있는 경우)을 가져오는 방법입니다.

```ts
import { publicKey } from '@metaplex-foundation/umi'
import {
  fetchCandyMachine,
  fetchCandyGuard,
} from '@metaplex-foundation/mpl-candy-machine'

const candyMachine = await fetchCandyMachine(umi, publicKey('...'))
const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority)
```

API 참조: [fetchCandyMachine](https://mpl-candy-machine.typedoc.metaplex.com/functions/fetchCandyMachine.html), [fetchCandyGuard](https://mpl-candy-machine.typedoc.metaplex.com/functions/fetchCandyGuard.html).

{% /dialect %}
{% /dialect-switcher %}

## 권한 업데이트

Candy Machine이 생성되면 Candy Machine의 권한인 한 나중에 대부분의 설정을 업데이트할 수 있습니다. 다음 몇 섹션에서 이러한 설정을 업데이트하는 방법을 살펴보겠지만 먼저 Candy Machine의 **권한**과 **민트 권한**을 업데이트하는 방법을 살펴보겠습니다.

- 권한을 업데이트하려면 현재 권한을 서명자로 전달하고 새 권한의 주소를 전달해야 합니다.
- 민트 권한을 업데이트하려면 현재 권한과 새 민트 권한을 모두 서명자로 전달해야 합니다. 이는 민트 권한이 주로 Candy Guard를 Candy Machine과 연결하는 데 사용되기 때문입니다. 민트 권한을 서명자로 만들면 누구나 다른 사람의 Candy Guard를 사용하는 것을 방지할 수 있으며, 이는 원래 Candy Machine에 부작용을 일으킬 수 있습니다.

{% dialect-switcher title="Candy Machine의 권한 업데이트" %}
{% dialect title="JavaScript" id="js" %}

다음은 Umi 라이브러리를 사용하여 Candy Machine의 권한을 업데이트하는 방법입니다. 대부분의 경우 관련된 Candy Guard 계정의 권한도 업데이트하고 싶을 것입니다.

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import {
  setCandyMachineAuthority,
  setCandyGuardAuthority,
} from '@metaplex-foundation/mpl-candy-machine'

const newAuthority = generateSigner(umi)
await setCandyMachineAuthority(umi, {
  candyMachine: candyMachine.publicKey,
  authority: currentAuthority,
  newAuthority: newAuthority.publicKey,
})
  .add(
    setCandyGuardAuthority(umi, {
      candyGuard: candyMachine.mintAuthority,
      authority: currentAuthority,
      newAuthority: newAuthority.publicKey,
    })
  )
  .sendAndConfirm(umi)
```

관련된 Candy Guard 계정을 재정의하기 때문에 `mintAuthority`를 직접 업데이트하고 싶지는 않을 것이지만, 방법은 다음과 같습니다.

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { setMintAuthority } from '@metaplex-foundation/mpl-candy-machine'

const newMintAuthority = generateSigner(umi)
await setMintAuthority(umi, {
  candyMachine: candyMachine.publicKey,
  authority: currentAuthority,
  mintAuthority: newMintAuthority,
}).sendAndConfirm(umi)
```

API 참조: [setCandyMachineAuthority](https://mpl-candy-machine.typedoc.metaplex.com/functions/setCandyMachineAuthority.html), [setCandyGuardAuthority](https://mpl-candy-machine.typedoc.metaplex.com/functions/setCandyGuardAuthority.html), [setMintAuthority](https://mpl-candy-machine.typedoc.metaplex.com/functions/setMintAuthority.html).

{% /dialect %}
{% /dialect-switcher %}

## 공유 NFT 데이터 업데이트

Candy Machine의 모든 민팅된 NFT 간에 공유되는 속성도 업데이트할 수 있습니다. [이전 페이지](/ko/smart-contracts/candy-machine/settings#settings-shared-by-all-nf-ts)에서 언급했듯이 이러한 속성은: 판매자 수수료 베이시스 포인트, 심볼, 최대 에디션 공급량, 변경 가능 여부 및 창작자입니다.

첫 번째 NFT가 민팅되면 이러한 속성은 더 이상 업데이트할 수 없다는 점에 주목하세요.

{% dialect-switcher title="Candy Machine의 NFT 데이터 업데이트" %}
{% dialect title="JavaScript" id="js" %}

다음은 Candy Machine에서 일부 공유 NFT 데이터를 업데이트하는 예시입니다.

```tsx
import { percentAmount } from '@metaplex-foundation/umi'
import {
  updateCandyMachine,
  fetchCandyMachine,
} from '@metaplex-foundation/mpl-candy-machine'

const candyMachine = await fetchCandyMachine(umi, candyMachineAddress)
await updateCandyMachine(umi, {
  candyMachine: candyMachine.publicKey,
  data: {
    ...candyMachine.data,
    symbol: 'NEW',
    sellerFeeBasisPoints: percentAmount(5.5, 2),
    creators: [{ address: newCreator, verified: false, percentageShare: 100 }],
  },
}).sendAndConfirm(umi)
```

API 참조: [updateCandyMachine](https://mpl-candy-machine.typedoc.metaplex.com/functions/updateCandyMachine.html).

{% /dialect %}
{% /dialect-switcher %}

## 토큰 표준 업데이트

토큰 표준 및 규칙 세트 속성도 "토큰 표준 설정" 명령어를 사용하여 Candy Machine에서 업데이트할 수 있습니다. 이를 통해 일반 NFT에서 프로그래머블 NFT로 또는 그 반대로 전환할 수 있습니다. 프로그래머블 NFT로 전환할 때 민팅된 NFT가 준수해야 하는 규칙 세트를 선택적으로 지정하거나 업데이트할 수 있습니다.

Candy Machine이 이전 계정 버전을 사용하는 경우 이 명령어는 자동으로 프로그래머블 NFT와 일반 NFT를 모두 지원하는 최신 계정 버전으로 업그레이드합니다. 업그레이드되면 Candy Machine 또는 Candy Guard에서 민팅하기 위해 최신 명령어를 사용해야 합니다.

{% dialect-switcher title="Candy Machine의 토큰 표준 업데이트" %}
{% dialect title="JavaScript" id="js" %}

다음은 Umi를 사용하여 Candy Machine의 토큰 표준과 규칙 세트를 업데이트하는 예시입니다.

```ts
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'
import { setTokenStandard } from '@metaplex-foundation/mpl-candy-machine'

await setTokenStandard(umi, {
  candyMachine: candyMachine.publicKey,
  collectionMint: candyMachine.collectionMint,
  collectionUpdateAuthority,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
  ruleSet: newRuleSetAccount,
}).sendAndConfirm(umi)
```

Candy Machine이 계정 버전 `V1`을 사용하는 경우 레거시 컬렉션 위임 권한 레코드 계정을 사용하므로 `collectionAuthorityRecord` 계정을 명시적으로 설정해야 합니다.

```ts
import { findCollectionAuthorityRecordPda } from '@metaplex-foundation/mpl-token-metadata'
import { findCandyMachineAuthorityPda } from '@metaplex-foundation/mpl-candy-machine'

await setTokenStandard(umi, {
  // ...
  collectionAuthorityRecord: findCollectionAuthorityRecordPda(umi, {
    mint: candyMachine.collectionMint,
    collectionAuthority: findCandyMachineAuthorityPda(umi, {
      candyMachine: candyMachine.publicKey,
    }),
  }),
}).sendAndConfirm(umi)
```

API 참조: [setTokenStandard](https://mpl-candy-machine.typedoc.metaplex.com/functions/setTokenStandard.html).

{% /dialect %}
{% /dialect-switcher %}

## 컬렉션 업데이트

Candy Machine과 연결된 컬렉션 NFT를 변경하는 것도 가능합니다. 이 변경을 승인하기 위해 컬렉션 NFT의 민트 계정 주소와 해당 업데이트 권한을 서명자로 제공해야 합니다.

여기서도 첫 번째 NFT가 민팅되면 컬렉션을 변경할 수 없다는 점에 주목하세요.

{% dialect-switcher title="Candy Machine의 컬렉션 업데이트" %}
{% dialect title="JavaScript" id="js" %}

Umi 라이브러리를 사용하여 Candy Machine의 컬렉션 NFT를 업데이트하려면 다음과 같이 `setCollectionV2` 메서드를 사용할 수 있습니다.

```ts
await setCollectionV2(umi, {
  candyMachine: candyMachine.publicKey,
  collectionMint: candyMachine.collectionMint,
  collectionUpdateAuthority: collectionUpdateAuthority.publicKey,
  newCollectionMint: newCollectionMint.publicKey,
  newCollectionUpdateAuthority,
}).sendAndConfirm(umi)
```

Candy Machine이 계정 버전 `V1`을 사용하는 경우 레거시 컬렉션 위임 권한 레코드 계정을 사용하므로 `collectionDelegateRecord` 계정을 명시적으로 설정해야 합니다.

```ts
import { findCollectionAuthorityRecordPda } from '@metaplex-foundation/mpl-token-metadata'
import { findCandyMachineAuthorityPda } from '@metaplex-foundation/mpl-candy-machine'

await setCollectionV2(umi, {
  // ...
  collectionDelegateRecord: findCollectionAuthorityRecordPda(umi, {
    mint: candyMachine.collectionMint,
    collectionAuthority: findCandyMachineAuthorityPda(umi, {
      candyMachine: candyMachine.publicKey,
    }),
  }),
}).sendAndConfirm(umi)
```

API 참조: [setCollectionV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/setCollectionV2.html).

{% /dialect %}
{% /dialect-switcher %}

## 아이템 설정 업데이트

Candy Machine의 아이템 설정도 업데이트할 수 있지만 몇 가지 제한 사항이 있습니다.

- 아이템 설정은 **구성 라인 설정**과 **숨겨진 설정** 간에 모드를 교체하도록 업데이트할 수 없습니다. 그러나 모드를 교체하지 않는 경우 이러한 설정 내의 속성을 업데이트할 수 있습니다.
- **구성 라인 설정**을 사용할 때:
  - **사용 가능한 아이템** 속성은 업데이트할 수 없습니다.
  - **이름 길이** 및 **URI 길이** 속성은 프로그램이 업데이트 중에 Candy Machine 계정의 크기를 조정하지 않으므로 더 작은 값으로만 업데이트할 수 있습니다.
- 첫 번째 NFT가 민팅되면 이러한 설정은 더 이상 업데이트할 수 없습니다.

{% dialect-switcher title="Candy Machine의 아이템 설정 업데이트" %}
{% dialect title="JavaScript" id="js" %}

다음 예시는 Umi 라이브러리를 사용하여 Candy Machine의 구성 라인 설정을 업데이트하는 방법을 보여줍니다. 동일한 작업을 숨겨진 설정과 사용 가능한 아이템 속성(숨겨진 설정 사용 시)에 대해서도 수행할 수 있습니다.

```ts
import {
  updateCandyMachine,
  fetchCandyMachine,
} from '@metaplex-foundation/mpl-candy-machine'

const candyMachine = await fetchCandyMachine(umi, candyMachineAddress)
await updateCandyMachine(umi, {
  candyMachine: candyMachine.publicKey,
  data: {
    ...candyMachine.data,
    hiddenSettings: none(),
    configLineSettings: some({
      type: 'configLines',
      prefixName: 'My New NFT #$ID+1$',
      nameLength: 0,
      prefixUri: 'https://arweave.net/',
      uriLength: 43,
      isSequential: true,
    }),
  },
}).sendAndConfirm(umi)
```

API 참조: [updateCandyMachine](https://mpl-candy-machine.typedoc.metaplex.com/functions/updateCandyMachine.html).

{% /dialect %}
{% /dialect-switcher %}

## Candy Machine 삭제

Candy Machine이 완전히 민팅되면 목적을 달성했으므로 안전하게 폐기할 수 있습니다. 이를 통해 창작자는 Candy Machine 계정의 저장 비용과 선택적으로 Candy Guard 계정의 비용도 되돌려 받을 수 있습니다.

{% dialect-switcher title="Candy Machine 삭제" %}
{% dialect title="JavaScript" id="js" %}

다음과 같이 Umi 라이브러리를 사용하여 Candy Machine 계정 및/또는 관련된 Candy Guard 계정을 삭제할 수 있습니다.

```ts
import {
  deleteCandyMachine,
  deleteCandyGuard,
} from '@metaplex-foundation/mpl-candy-machine'

await deleteCandyMachine(umi, {
  candyMachine: candyMachine.publicKey,
}).sendAndConfirm(umi)

await deleteCandyGuard(umi, {
  candyGuard: candyMachine.mintAuthority,
}).sendAndConfirm(umi)
```

API 참조: [deleteCandyMachine](https://mpl-candy-machine.typedoc.metaplex.com/functions/deleteCandyMachine.html), [deleteCandyGuard](https://mpl-candy-machine.typedoc.metaplex.com/functions/deleteCandyGuard.html).

{% /dialect %}
{% /dialect-switcher %}

## 결론

이제 Candy Machine을 생성, 읽기, 업데이트 및 삭제할 수 있지만 아직 아이템으로 로드하는 방법을 모릅니다. [다음 페이지](/ko/smart-contracts/candy-machine/insert-items)에서 이를 다루어보겠습니다!
