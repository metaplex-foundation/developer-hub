---
title: 민팅
metaTitle: 민팅 | Candy Machine
description: Candy Machine에서 민팅하는 방법과 민팅 전 요구사항을 처리하는 방법을 설명합니다.
---

지금까지 Candy Machine을 생성하고 유지하는 방법을 배웠습니다. 설정하는 방법과 가드 및 가드 그룹을 사용하여 복잡한 민팅 워크플로를 설정하는 방법을 보았습니다. 이제 퍼즐의 마지막 조각인 민팅에 대해 이야기할 때입니다! {% .lead %}

## 기본 민팅

[Candy Guards 페이지](/ko/candy-machine/guards#why-another-program)에서 언급했듯이 Candy Machine에서 NFT를 민팅하는 데 책임이 있는 두 가지 프로그램이 있습니다: NFT 민팅을 담당하는 Candy Machine Core 프로그램과 그 위에 구성 가능한 액세스 제어 계층을 추가하고 커스텀 가드를 제공하기 위해 포크될 수 있는 Candy Guard 프로그램입니다.

따라서 Candy Machine에서 민팅하는 두 가지 방법이 있습니다:

- **Candy Guard 프로그램에서** 민팅을 Candy Machine Core 프로그램에 위임합니다. 대부분의 경우 훨씬 더 복잡한 민팅 워크플로를 허용하므로 이렇게 하고 싶을 것입니다. 계정에 구성된 가드에 따라 민팅 명령어에 추가 나머지 계정과 명령어 데이터를 전달해야 할 수 있습니다. 다행히 우리의 SDK는 몇 가지 추가 매개변수를 요구하고 나머지를 계산해 주어 이를 쉽게 만듭니다.

- **Candy Machine Core 프로그램에서 직접**. 이 경우 구성된 민트 권한만 민팅할 수 있으므로 트랜잭션에 서명해야 합니다.

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Candy Machine" theme="blue" /%}
{% node label="소유자: Candy Machine Core Program" theme="dimmed" /%}
{% node label="기능" /%}
{% node label="권한" /%}
{% node #mint-authority-1 %}

민트 권한 = Candy Guard {% .font-semibold %}

{% /node %}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" y=160 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="소유자: Candy Guard Program" theme="dimmed" /%}
{% node label="가드" theme="mint" z=1 /%}
{% node label="Sol Payment" /%}
{% node label="Token Payment" /%}
{% node label="Start Date" /%}
{% node label="End Date" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=350 %}
{% node #mint-1 label="민팅" theme="pink" /%}
{% node label="Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="액세스 제어" theme="transparent" /%}
{% node parent="mint-1" x=-120 y=-35 theme="transparent" %}
활성화된 가드를 준수하는 한 \
누구나 민팅할 수 있습니다.
{% /node %}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="민팅" theme="pink" /%}
{% node label="Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="민팅 로직" theme="transparent" /%}
{% node parent="mint-2" x=200 y=-18 theme="transparent" %}
Alice만 \
민팅할 수 있습니다.
{% /node %}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% node parent="mint-2" x=280 %}
{% node #candy-machine-2 label="Candy Machine" theme="blue" /%}
{% node label="소유자: Candy Machine Core Program" theme="dimmed" /%}
{% node label="기능" /%}
{% node label="권한" /%}
{% node #mint-authority-2 %}

민트 권한 = Alice {% .font-semibold %}

{% /node %}
{% node label="..." /%}
{% /node %}

{% edge from="candy-guard-1" to="mint-authority-1" fromPosition="left" toPosition="left" arrow=false dashed=true /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="candy-guard-1" to="mint-1" theme="pink" /%}
{% edge from="candy-machine-2" to="mint-2" theme="pink" path="straight" /%}

{% /diagram %}

모든 것이 잘 진행되면 Candy Machine에 구성된 매개변수를 따라 NFT가 생성됩니다. 예를 들어, 주어진 Candy Machine이 **순차적**이 `false`로 설정된 **구성 라인 설정**을 사용하는 경우 다음 아이템을 무작위로 가져올 것입니다.

Candy Guard 프로그램의 버전 `1.0`부터 민팅 명령어는 기존 `payer` 서명자와 다를 수 있는 추가 `minter` 서명자를 받아들입니다. 이를 통해 NFT를 민팅하는 지갑이 더 이상 SOL 수수료(저장 수수료 및 SOL 민팅 결제 등)를 지불할 필요가 없는 민팅 워크플로를 만들 수 있습니다. `payer` 서명자가 해당 수수료를 추상화하기 때문입니다. `minter` 서명자는 여전히 토큰 기반 수수료를 지불해야 하며 구성된 가드를 검증하는 데 사용됩니다.

최신 민팅 명령어는 상당한 양의 컴퓨팅 유닛을 사용하는 최신 토큰 메타데이터 명령어에 의존한다는 점에 주목하세요. 따라서 트랜잭션이 성공하도록 하기 위해 트랜잭션의 컴퓨팅 유닛 한도를 늘려야 할 수 있습니다. 우리의 SDK도 이를 도울 수 있습니다.

{% dialect-switcher title="Candy Machine에서 민팅" %}
{% dialect title="JavaScript" id="js" %}

구성된 Candy Guard 계정을 통해 Candy Machine에서 민팅하려면 `mintV2` 함수를 사용하고 민팅된 NFT가 속할 컬렉션 NFT의 민트 주소와 업데이트 권한을 제공할 수 있습니다. `minter` 서명자와 `payer` 서명자도 제공할 수 있지만 각각 Umi의 identity와 payer로 기본 설정됩니다.

위에서 언급했듯이 `mintV2` 명령어가 성공하도록 하기 위해 트랜잭션의 컴퓨팅 유닛 한도를 늘려야 할 수 있습니다. 아래 코드 스니펫에서 설명한 대로 `mpl-toolbox` Umi 라이브러리의 `setComputeUnitLimit` 도우미 함수를 사용하여 이를 수행할 수 있습니다.

pNFT를 민팅하고 싶고(예: 로열티 강제를 위해) Candy Machine을 그에 맞게 설정한 경우 `tokenStandard` 필드를 추가해야 합니다. 기본적으로 `NonFungible`이 사용됩니다. 이전에 Candy Machine을 가져온 경우 `candyMachine.tokenStandard`를 사용할 수 있고, 그렇지 않으면 `@metaplex-foundation/mpl-token-metadata`에서 `tokenStandard: TokenStandard.ProgrammableNonFungible`을 사용하여 직접 할당해야 합니다.

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
      tokenStandard: candyMachine.tokenStandard,
    })
  )
  .sendAndConfirm(umi)
```

`mintV2` 명령어는 기본적으로 민트 및 토큰 계정을 생성하고 NFT 소유자를 `minter`로 설정합니다. 미리 이를 직접 생성하고 싶다면 서명자 대신 NFT 민트 주소를 공개 키로 제공하면 됩니다. 다음은 `mpl-toolbox` Umi 라이브러리의 `createMintWithAssociatedToken` 함수를 사용한 예시입니다:

```ts
import { mintV2 } from '@metaplex-foundation/mpl-candy-machine'
import {
  createMintWithAssociatedToken,
  setComputeUnitLimit,
} from '@metaplex-foundation/mpl-toolbox'
import { transactionBuilder, generateSigner } from '@metaplex-foundation/umi'

const nftMint = generateSigner(umi)
const nftOwner = generateSigner(umi).publicKey
await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 800_000 }))
  .add(createMintWithAssociatedToken(umi, { mint: nftMint, owner: nftOwner }))
  .add(
    mintV2(umi, {
      candyMachine: candyMachine.publicKey,
      nftMint: nftMint.publicKey,
      collectionMint: collectionNft.publicKey,
      collectionUpdateAuthority: collectionNft.metadata.updateAuthority,
    })
  )
  .sendAndConfirm(umi)
```

Candy Machine Core 프로그램에서 직접 민팅하고 싶은 드문 경우에는 대신 `mintFromCandyMachineV2` 함수를 사용할 수 있습니다. 이 함수는 Candy Machine의 민트 권한을 서명자로 제공해야 하며 명시적인 `nftOwner` 속성을 허용합니다.

```ts
import { mintFromCandyMachineV2 } from '@metaplex-foundation/mpl-candy-machine'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'
import { transactionBuilder, generateSigner } from '@metaplex-foundation/umi'

const nftMint = generateSigner(umi)
const nftOwner = generateSigner(umi).publicKey
await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 800_000 }))
  .add(
    mintFromCandyMachineV2(umi, {
      candyMachine: candyMachine.publicKey,
      mintAuthority: umi.identity,
      nftOwner,
      nftMint,
      collectionMint: collectionNft.publicKey,
      collectionUpdateAuthority: collectionNft.metadata.updateAuthority,
    })
  )
  .sendAndConfirm(umi)
```

API 참조: [mintV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintV2.html), [mintFromCandyMachineV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintFromCandyMachineV2.html)

{% /dialect %}
{% /dialect-switcher %}

## 가드와 함께 민팅

많은 가드를 사용하는 Candy Machine에서 민팅할 때 추가적인 가드별 정보를 제공해야 할 수 있습니다.

민팅 명령어를 수동으로 구축하는 경우 해당 정보는 명령어 데이터와 나머지 계정의 혼합으로 제공됩니다. 그러나 우리의 SDK를 사용하면 민팅 시 추가 정보가 필요한 각 가드는 **민팅 설정**이라고 부르는 설정 세트를 정의합니다. 이러한 민팅 설정은 프로그램이 필요로 하는 모든 것으로 파싱됩니다.

민팅 설정이 필요한 가드의 좋은 예는 **NFT Payment** 가드입니다. 이 가드는 민팅 비용으로 사용해야 하는 NFT의 민트 주소와 기타 정보를 필요로 합니다.

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Candy Machine" theme="blue" /%}
{% node label="소유자: Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="소유자: Candy Guard Program" theme="dimmed" /%}
{% node label="가드" theme="mint" z=1 /%}
{% node #nft-payment-guard label="NFT Payment" /%}
{% node label="Token Payment" /%}
{% node label="Start Date" /%}
{% node #third-party-signer-guard label="Third Party Signer" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=700 %}
{% node #mint-1 label="민팅" theme="pink" /%}
{% node label="Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="액세스 제어" theme="transparent" /%}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="민팅" theme="pink" /%}
{% node label="Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="민팅 로직" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% node parent="mint-2" x=-400 %}
{% node #mint-settings label="민팅 설정" /%}
{% node label="SDK 사용" theme="dimmed" /%}
{% /node %}

{% node #mint-args label="민팅 인수" parent="mint-settings" x=100 y=80 theme="slate" /%}
{% node #mint-accounts label="민팅 나머지 계정" parent="mint-args" y=50 theme="slate" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="nft-payment-guard" to="mint-settings" theme="slate" /%}
{% edge from="third-party-signer-guard" to="mint-settings" theme="slate" /%}
{% edge from="mint-settings" to="mint-args" theme="slate" fromPosition="bottom" /%}
{% edge from="mint-settings" to="mint-accounts" theme="slate" fromPosition="bottom" /%}
{% edge from="mint-args" to="mint-1" theme="pink" /%}
{% edge from="mint-accounts" to="mint-1" theme="pink" /%}

{% /diagram %}

[사용 가능한 각 가드](/ko/candy-machine/guards)에는 자체 문서 페이지가 있으며 해당 가드가 민팅할 때 민팅 설정을 제공해야 하는지 여부를 알려줍니다.

민팅 설정이 필요하지 않은 가드만 사용하는 경우 위의 "기본 민팅" 섹션에서 설명한 것과 같은 방식으로 민팅할 수 있습니다. 그렇지 않으면 필요한 모든 가드의 민팅 설정이 포함된 추가 객체 속성을 제공해야 합니다. SDK를 사용하여 실제로 어떻게 보이는지 살펴보겠습니다.

{% dialect-switcher title="가드와 함께 Candy Machine에서 민팅" %}
{% dialect title="JavaScript" id="js" %}

Umi 라이브러리를 통해 민팅할 때 `mintArgs` 속성을 사용하여 필요한 **민팅 설정**을 제공할 수 있습니다.

다음은 추가 서명자가 필요한 **Third Party Signer** 가드와 지갑이 Candy Machine에서 몇 번 민팅했는지 추적하는 **Mint Limit** 가드를 사용한 예시입니다.

```ts
import {
  some,
  generateSigner,
  transactionBuilder,
} from '@metaplex-foundation/umi'
import { create, mintV2 } from '@metaplex-foundation/mpl-candy-machine'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'

// 가드가 있는 Candy Machine 생성.
const thirdPartySigner = generateSigner()
await create(umi, {
  // ...
  guards: {
    thirdPartySigner: some({ signer: thirdPartySigner.publicKey }),
    mintLimit: some({ id: 1, limit: 3 }),
  },
}).sendAndConfirm(umi)

// Candy Machine에서 민팅.
const nftMint = generateSigner(umi)
await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 800_000 }))
  .add(
    mintV2(umi, {
      candyMachine: candyMachine.publicKey,
      nftMint,
      collectionMint: collectionNft.publicKey,
      collectionUpdateAuthority: collectionNft.metadata.updateAuthority,
      mintArgs: {
        thirdPartySigner: some({ signer: thirdPartySigner }),
        mintLimit: some({ id: 1 }),
      },
    })
  )
  .sendAndConfirm(umi)
```

API 참조: [mintV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintV2.html), [DefaultGuardSetMintArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetMintArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 가드 그룹과 함께 민팅

가드 그룹을 사용하는 Candy Machine에서 민팅할 때 **레이블을 제공하여 민팅하려는 그룹을 명시적으로 선택해야 합니다**.

또한 [이전 섹션](#minting-with-guards)에서 설명한 대로 민팅 설정도 필요할 수 있습니다. 그러나 **민팅 설정은 선택된 그룹의 "해결된 가드"에 적용됩니다**.

예를 들어 다음과 같은 가드가 있는 Candy Machine을 상상해보세요:

- **기본 가드**:
  - Bot Tax
  - Third Party Signer
  - Start Date
- **그룹 1**
  - 레이블: "nft"
  - 가드:
    - NFT Payment
    - Start Date
- **그룹 2**
  - 레이블: "public"
  - 가드:
    - Sol Payment

그룹 1("nft" 레이블)의 해결된 가드는:

- Bot Tax: **기본 가드**에서.
- Third Party Signer: **기본 가드**에서.
- NFT Payment: **그룹 1**에서.
- Start Date: **그룹 1**에서 (기본 가드를 재정의하므로).

따라서 제공된 민팅 설정은 이러한 해결된 가드와 관련되어야 합니다. 위의 예시에서 Third Party Signer 가드와 NFT Payment 가드에 대한 민팅 설정을 제공해야 합니다.

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Candy Machine" theme="blue" /%}
{% node label="소유자: Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="소유자: Candy Guard Program" theme="dimmed" /%}
{% node label="가드 (기본 가드)" theme="mint" z=1 /%}
{% node label="Bot Tax" /%}
{% node #third-party-signer-guard label="Third Party Signer" /%}
{% node label="Start Date" /%}
{% node #nft-group theme="mint" z=1 %}
그룹 1: "nft" {% .font-semibold %}
{% /node %}
{% node #nft-payment-guard label="NFT Payment" /%}
{% node label="Start Date" /%}
{% node theme="mint" z=1 %}
그룹 2: "public"
{% /node %}
{% node label="SOL Payment" /%}
{% /node %}

{% node parent="candy-machine-1" x=700 %}
{% node #mint-1 label="민팅" theme="pink" /%}
{% node label="Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="액세스 제어" theme="transparent" /%}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="민팅" theme="pink" /%}
{% node label="Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="민팅 로직" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% node parent="mint-2" x=-400 y=60 %}
{% node #mint-settings label="민팅 설정" /%}
{% node label="SDK 사용" theme="dimmed" /%}
{% /node %}

{% node #mint-args label="민팅 인수" parent="mint-settings" x=100 y=80 theme="slate" /%}
{% node #mint-accounts label="민팅 나머지 계정" parent="mint-args" y=50 theme="slate" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="nft-payment-guard" to="mint-settings" theme="slate" /%}
{% edge from="third-party-signer-guard" to="mint-settings" theme="slate" /%}
{% edge from="mint-settings" to="mint-args" theme="slate" fromPosition="bottom" /%}
{% edge from="mint-settings" to="mint-accounts" theme="slate" fromPosition="bottom" /%}
{% edge from="mint-args" to="mint-1" theme="pink" /%}
{% edge from="mint-accounts" to="mint-1" theme="pink" /%}
{% edge from="nft-group" to="mint-1" theme="pink" /%}

{% /diagram %}

{% seperator h="6" /%}

{% dialect-switcher title="가드 그룹과 함께 Candy Machine에서 민팅" %}
{% dialect title="JavaScript" id="js" %}

가드 그룹을 사용하는 Candy Machine에서 민팅할 때 선택하려는 그룹의 레이블을 `group` 속성을 통해 제공해야 합니다.

또한 해당 그룹의 해결된 가드에 대한 민팅 설정을 `mintArgs` 속성을 통해 제공할 수 있습니다.

다음은 위에서 설명한 예시 Candy Machine에서 Umi 라이브러리를 사용하여 민팅하는 방법입니다.

```ts
// 가드가 있는 Candy Machine 생성.
const thirdPartySigner = generateSigner()
await create(umi, {
  // ...
  guards: {
    botTax: some({ lamports: sol(0.001), lastInstruction: true }),
    thirdPartySigner: some({ signer: thirdPartySigner.publicKey }),
    startDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
  },
  groups: [
    {
      label: 'nft',
      guards: {
        nftPayment: some({ requiredCollection, destination: nftTreasury }),
        startDate: some({ date: dateTime('2022-10-18T16:00:00Z') }),
      },
    },
    {
      label: 'public',
      guards: {
        solPayment: some({ lamports: sol(1), destination: solTreasury }),
      },
    },
  ],
}).sendAndConfirm(umi)

// Candy Machine에서 민팅.
const nftMint = generateSigner(umi)
await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 800_000 }))
  .add(
    mintV2(umi, {
      candyMachine: candyMachine.publicKey,
      nftMint,
      collectionMint: collectionNft.publicKey,
      collectionUpdateAuthority: collectionNft.metadata.updateAuthority,
      group: some('nft'),
      mintArgs: {
        thirdPartySigner: some({ signer: thirdPartySigner }),
        nftPayment: some({
          mint: nftFromRequiredCollection.publicKey,
          destination: nftTreasury,
          tokenStandard: TokenStandard.NonFungible,
        }),
      },
    })
  )
  .sendAndConfirm(umi)
```

API 참조: [mintV2](https://mpl-candy-machine.typedoc.metaplex.com/functions/mintV2.html), [DefaultGuardSetMintArgs](https://mpl-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetMintArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 사전 검증과 함께 민팅

일부 가드는 Candy Machine에서 민팅하기 전에 추가 검증 단계가 필요할 수 있다는 점이 중요합니다. 이 사전 검증 단계는 일반적으로 블록체인에 계정을 생성하거나 검증의 증거 역할을 하는 토큰으로 지갑에 보상합니다.

### 라우트 명령어 사용

가드가 사전 검증 단계를 요구할 수 있는 한 가지 방법은 "route" 명령어를 통해 [자체 특수 명령어](/ko/candy-machine/guard-route)를 사용하는 것입니다.

좋은 예는 **Allow List** 가드입니다. 이 가드를 사용할 때 route 명령어를 호출하고 유효한 머클 증명을 제공하여 우리의 지갑이 사전 정의된 지갑 목록에 속한다는 것을 검증해야 합니다. 이 route 명령어가 성공하면 해당 지갑에 대한 Allow List PDA가 생성되며, 민팅 명령어가 이를 읽어 Allow List 가드를 검증할 수 있습니다. [Allow List 가드에 대한 자세한 내용은 전용 페이지를 참조하세요](/ko/candy-machine/guards/allow-list).

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Candy Machine" theme="blue" /%}
{% node label="소유자: Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="소유자: Candy Guard Program" theme="dimmed" /%}
{% node label="가드" theme="mint" z=1 /%}
{% node #allow-list-guard label="Allow List" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=550 %}
{% node #mint-1 label="민팅" theme="pink" /%}
{% node label="Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="액세스 제어" theme="transparent" /%}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="민팅" theme="pink" /%}
{% node label="Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="민팅 로직" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% node parent="mint-2" x=-250 %}
{% node #route label="라우트" theme="pink" /%}
{% node label="Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="route" x=70 y=-20 label="머클 증명 검증" theme="transparent" /%}

{% node #allow-list-pda parent="route" x=23 y=100 label="Allow List PDA" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="allow-list-guard" to="route" theme="pink" /%}
{% edge from="route" to="allow-list-pda" theme="pink" path="straight" /%}
{% edge from="allow-list-pda" to="mint-1" theme="pink" /%}

{% /diagram %}

### 외부 서비스 사용

가드가 해당 사전 검증 단계를 수행할 수 있는 또 다른 방법은 외부 솔루션에 의존하는 것입니다.

예를 들어 **Gatekeeper** 가드를 사용할 때 구성된 게이트키퍼 네트워크에 따라 Captcha 완료와 같은 도전을 수행하여 게이트웨이 토큰을 요청해야 합니다. 그러면 Gatekeeper 가드는 해당 게이트웨이 토큰의 존재를 확인하여 민팅을 검증하거나 거부합니다. [Gatekeeper 가드에 대한 자세한 내용은 전용 페이지를 참조하세요](/ko/candy-machine/guards/gatekeeper).

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Candy Machine" theme="blue" /%}
{% node label="소유자: Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="소유자: Candy Guard Program" theme="dimmed" /%}
{% node label="가드" theme="mint" z=1 /%}
{% node #gatekeeper-guard label="Gatekeeper" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=550 %}
{% node #mint-1 label="민팅" theme="pink" /%}
{% node label="Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="액세스 제어" theme="transparent" /%}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="민팅" theme="pink" /%}
{% node label="Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="민팅 로직" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% node parent="mint-2" x=-250 y=-40 %}
{% node #network label="게이트키퍼 네트워크" theme="slate" /%}
{% node theme="slate" %}
게이트키퍼 네트워크에서 \
게이트웨이 토큰 요청, \
예: Captcha.
{% /node %}
{% /node %}

{% node #gateway-token parent="network" x=23 y=140 label="게이트웨이 토큰" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="gatekeeper-guard" to="network" theme="slate" /%}
{% edge from="network" to="gateway-token" theme="slate" path="straight" /%}
{% edge from="gateway-token" to="mint-1" theme="pink" /%}

{% /diagram %}

## 봇 세금과 함께 민팅

Candy Machine에 포함하고 싶어할 가능성이 높은 가드 중 하나는 실패한 민팅에 구성 가능한 SOL 금액을 청구하여 봇으로부터 Candy Machine을 보호하는 Bot Tax 가드입니다. 이 금액은 일반적으로 실제 사용자의 진정한 실수에는 영향을 주지 않으면서 봇을 해치기 위해 작게 설정됩니다. 모든 봇 세금은 Candy Machine 계정으로 전송되므로 민팅이 끝나면 Candy Machine 계정을 삭제하여 이 자금에 액세스할 수 있습니다.

이 가드는 조금 특별하며 다른 모든 가드의 민팅 동작에 영향을 줍니다. Bot Tax가 활성화되고 다른 가드가 민팅 검증에 실패하면 **트랜잭션이 성공한 것처럼 가장합니다**. 즉, 프로그램에서 오류가 반환되지 않지만 NFT도 민팅되지 않습니다. 이는 자금이 봇에서 Candy Machine 계정으로 전송되려면 트랜잭션이 성공해야 하기 때문입니다. [Bot Tax 가드에 대한 자세한 내용은 전용 페이지를 참조하세요](/ko/candy-machine/guards/bot-tax).

## 결론

축하합니다! 이제 Candy Machine이 A부터 Z까지 어떻게 작동하는지 알게 되었습니다!

관심이 있을 수 있는 추가 읽기 자료는 다음과 같습니다:

- [사용 가능한 모든 가드](/ko/candy-machine/guards): 사용할 수 있는 모든 가드를 살펴보고 필요한 것을 선별하세요.
- [첫 번째 Candy Machine 만들기](/ko/candy-machine/guides/create-an-nft-collection-on-solana-with-candy-machine): 이 가이드는 자산을 업로드하고 "[Sugar](/ko/candy-machine/sugar)"라는 CLI 도구를 사용하여 처음부터 새로운 Candy Machine을 만드는 데 도움을 줍니다.