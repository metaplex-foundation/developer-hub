---
title: 프로그래밍 가능한 NFT
metaTitle: 프로그래밍 가능한 NFT | Candy Machine
description: candy machine에서 프로그래밍 가능한 NFT를 민팅하는 방법을 설명합니다.
---

Token Metadata의 버전 `1.7`에서 [프로그래밍 가능한 NFT라고 불리는 새로운 에셋 클래스](/ko/smart-contracts/token-metadata/pnfts)가 도입되어 다른 기능들 중에서도 창작자가 2차 판매에 대한 로열티를 강제할 수 있게 되었습니다.

Candy Machine Core의 버전 `1.0`과 Candy Guard의 버전 `1.0`부터 **candy machine에서 프로그래밍 가능한 NFT를 민팅**할 수 있게 되었고 기존 candy machine의 토큰 표준을 업데이트하는 것도 가능해졌습니다.

## 새로운 candy machine의 경우

`initializeV2`라는 새로운 명령어가 Candy Machine Core 프로그램에 추가되었습니다. 이 명령어는 `initialize` 명령어와 유사하지만 candy machine에 사용할 토큰 표준을 지정할 수 있습니다. 이 명령어는 토큰 표준을 저장하지 않는 `V1` Candy Machine과 구별하기 위해 새로 생성된 Candy Machine을 `V2`로 표시합니다. 이러한 새로운 필드들은 Candy Machine 직렬화 로직에서 중단 변경을 피하기 위해 Candy Machine 계정 데이터의 기존 패딩을 사용합니다.

`initializeV2` 명령어는 일반 NFT를 민팅하는 Candy Machine을 생성하는 데에도 사용할 수 있으므로 `initialize` 명령어는 이제 더 이상 사용되지 않습니다. NFT를 민팅할 때 Candy Machine Core에 위임하므로 여기서는 Candy Guard 프로그램에 대한 변경이 필요하지 않음을 참고하세요.

또한 선택하는 토큰 표준에 따라 일부 선택적 계정이 필요할 수 있음을 참고하세요. 예를 들어, 모든 민팅된 프로그래밍 가능한 NFT에 특정 규칙 집합을 할당하기 위해 `ruleSet` 계정을 제공할 수 있습니다. `ruleSet` 계정이 제공되지 않으면 컬렉션 NFT의 규칙 집합이 있는 경우 이를 사용합니다. 그렇지 않으면 민팅된 프로그래밍 가능한 NFT에는 할당된 규칙 집합이 없습니다. 반면에 일반 NFT를 민팅할 때는 `ruleSet` 계정이 무시됩니다.

추가적으로, `collectionDelegateRecord` 계정은 이제 Token Metadata의 새로운 [Metadata Delegate Record](https://docs.rs/mpl-token-metadata/latest/mpl_token_metadata/accounts/struct.MetadataDelegateRecord.html)를 참조해야 합니다.

자세한 내용은 이 문서의 "[Candy Machine 생성](/ko/smart-contracts/candy-machine/manage#create-candy-machines)" 섹션을 읽어보실 수 있지만, 프로그래밍 가능한 NFT를 민팅하는 새로운 Candy Machine을 생성하기 위해 SDK를 사용하는 방법에 대한 몇 가지 예시가 있습니다.

{% dialect-switcher title="새로운 PNFT Candy Machine 생성" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'
import { create } from '@metaplex-foundation/mpl-candy-machine'
import { generateSigner } from '@metaplex-foundation/umi'

await create(umi, {
  // ...
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

API 참조: [create](https://mpl-candy-machine.typedoc.metaplex.com/functions/create.html)

{% /dialect %}
{% /dialect-switcher %}

## 기존 candy machine의 경우

새로운 `setTokenStandard` 명령어를 통해 기존 Candy Machine의 토큰 표준을 업데이트하는 것이 가능합니다. Candy Machine `V1`에서 이 명령어를 호출하면 Candy Machine을 `V2`로 업그레이드하고 토큰 표준을 계정 데이터에 저장합니다.

자세한 내용은 이 문서의 "[토큰 표준 업데이트](/ko/smart-contracts/candy-machine/manage#update-token-standard)" 섹션을 읽어보실 수 있지만, 기존 Candy Machine의 토큰 표준을 프로그래밍 가능한 NFT로 업데이트하기 위해 SDK를 사용하는 방법에 대한 몇 가지 예시가 있습니다.

{% dialect-switcher title="Candy Machine의 토큰 표준 변경" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'
import { setTokenStandard } from '@metaplex-foundation/mpl-candy-machine'

await setTokenStandard(umi, {
  candyMachine: candyMachine.publicKey,
  collectionMint: candyMachine.collectionMint,
  collectionUpdateAuthority,
  tokenStandard: TokenStandard.ProgrammableNonFungible,
}).sendAndConfirm(umi)
```

API 참조: [setTokenStandard](https://mpl-candy-machine.typedoc.metaplex.com/functions/setTokenStandard.html)

{% /dialect %}
{% /dialect-switcher %}

추가로, 프로그래밍 가능한 NFT와 호환되는 컬렉션 설정을 지원하기 위해 새로운 `setCollectionV2` 명령어가 추가되었습니다. 이 명령어는 일반 NFT와도 작동하며 `setCollection` 명령어를 대체합니다.

여기서도 이 문서의 "[컬렉션 업데이트](/ko/smart-contracts/candy-machine/manage#update-collection)" 섹션에서 더 자세히 읽어볼 수 있습니다.

{% dialect-switcher title="Candy Machine의 컬렉션 업데이트" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { setCollectionV2 } from '@metaplex-foundation/mpl-candy-machine'

await setCollectionV2(umi, {
  candyMachine: candyMachine.publicKey,
  collectionMint: candyMachine.collectionMint,
  collectionUpdateAuthority: collectionUpdateAuthority.publicKey,
  newCollectionMint: newCollectionMint.publicKey,
  newCollectionUpdateAuthority,
}).sendAndConfirm(umi)
```

API 참조: [setCollectionV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/setCollectionV2.html)

{% /dialect %}
{% /dialect-switcher %}

## 새로운 민팅 명령어

Candy Machine Core와 Candy Guard 프로그램 모두의 `mint` 명령어가 프로그래밍 가능한 NFT 민팅을 지원하도록 업데이트되었습니다. 이 새로운 명령어는 `mintV2`라고 불리며 `mint` 명령어와 유사하지만 추가 계정들이 전달되어야 합니다. 여기서도 새로운 `mintV2` 명령어는 일반 NFT를 민팅하는 데 사용할 수 있으므로 기존 `mint` 명령어들을 대체합니다.

전체 "[민팅](/ko/smart-contracts/candy-machine/mint)" 페이지가 새로운 `mintV2` 명령어를 사용하도록 업데이트되었지만 프로그래밍 가능한 NFT와 함께 사용하는 방법에 대한 간단한 예시가 있습니다.

{% dialect-switcher title="Candy Machine에서 민팅" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { mintV2 } from '@metaplex-foundation/mpl-candy-machine'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'
import { transactionBuilder, generateSigner } from '@metaplex-foundation/umi'

const nftMint = generateSigner(umi)
await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 800_000 }))
  .add(
    mintV2(umi, {
      candyMachine: candyMachine.publicKey,
      nftMint,
      collectionMint: collectionNft.publicKey,
      collectionUpdateAuthority: collectionNft.metadata.updateAuthority,
    })
  )
  .sendAndConfirm(umi)
```

API 참조: [mintV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintV2.html)

{% /dialect %}
{% /dialect-switcher %}

Candy Guard 프로그램에서 제공하는 일부 가드도 프로그래밍 가능한 NFT를 지원하도록 업데이트되었음을 참고하세요. 업데이트가 일반 NFT를 민팅할 때 중단 변경을 도입하지는 않지만, 토큰 표준에 따라 민팅할 때 더 많은 나머지 계정을 기대할 수 있습니다.

이러한 변경 사항의 영향을 받는 가드들은:

- `nftBurn`과 `nftPayment` 가드는 이제 소각/전송되는 NFT가 프로그래밍 가능한 NFT일 수 있습니다.
- `FreezeSolPayment`와 `FreezeTokenPayment` 가드. 프로그래밍 가능한 NFT는 정의상 항상 동결되어 있으므로, Utility delegate를 통해 민팅될 때 잠금(Locked)되고 해동 조건이 충족되면 잠금 해제(Unlocked)됩니다.

## 추가 자료

프로그래밍 가능한 NFT와 Candy Machine에 대한 다음 리소스들이 유용할 수 있습니다:

- [프로그래밍 가능한 NFT 가이드](/ko/smart-contracts/token-metadata/pnfts)
- [Candy Machine Core Program](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-machine-core)
- [Candy Guard Program](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard)