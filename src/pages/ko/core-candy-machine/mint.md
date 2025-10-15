---
title: 민팅하기
metaTitle: 민팅하기 | Core Candy Machine
description: 사용자가 Core NFT 자산을 구매할 수 있도록 Core Candy Machine에서 민팅하는 방법입니다.
---

지금까지 Candy Machine을 생성하고 유지 관리하는 방법을 배웠습니다. 가드와 가드 그룹을 사용하여 복잡한 민팅 워크플로우를 구성하고 설정하는 방법을 살펴봤습니다. 이제 퍼즐의 마지막 조각인 민팅에 대해 이야기할 시간입니다! {% .lead %}

## 기본 민팅

[Candy Guards 페이지](/core-candy-machine/guards#why-another-program)에서 언급했듯이, Candy Machine에서 NFT를 민팅하는 데 책임지는 두 개의 프로그램이 있습니다: NFT 민팅을 담당하는 Candy Machine Core 프로그램과 그 위에 구성 가능한 접근 제어 레이어를 추가하여 커스텀 가드를 제공하기 위해 포크될 수 있는 Candy Guard 프로그램입니다.

따라서 Candy Machine에서 민팅하는 두 가지 방법이 있습니다:

- **Candy Guard 프로그램에서** 민팅한 다음 Candy Machine Core 프로그램에 민팅을 위임하는 방법. 대부분의 경우 훨씬 복잡한 민팅 워크플로우를 허용하므로 이 방법을 사용하고 싶을 것입니다. 계정에 구성된 가드를 기반으로 민팅 지시에 추가 잔여 계정과 지시 데이터를 전달해야 할 수 있습니다. 다행히 SDK에서는 몇 가지 추가 매개변수가 필요하고 나머지는 계산해주므로 이를 쉽게 만듭니다.

- **Core Candy Machine Core 프로그램에서 직접** 민팅하는 방법. 이 경우 구성된 민팅 권한만 민팅할 수 있으므로 트랜잭션에 서명해야 합니다.

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% node label="Features" /%}
{% node label="Authority" /%}
{% node #mint-authority-1 %}

Mint Authority = Candy Guard {% .font-semibold %}

{% /node %}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" y=160 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node label="Guards" theme="mint" z=1 /%}
{% node label="Sol Payment" /%}
{% node label="Token Payment" /%}
{% node label="Start Date" /%}
{% node label="End Date" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=350 %}
{% node #mint-1 label="Mint" theme="pink" /%}
{% node label="Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="Access Control" theme="transparent" /%}
{% node parent="mint-1" x=-120 y=-35 theme="transparent" %}
활성화된 가드를 준수하는 한 \
누구나 민팅할 수 있습니다.
{% /node %}

{% node parent="mint-1" x=-36 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Core Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}
{% node parent="mint-2" x=200 y=-18 theme="transparent" %}
Alice만 \
민팅할 수 있습니다.
{% /node %}

{% node #nft parent="mint-2" x=77 y=100 label="NFT" /%}

{% node parent="mint-2" x=280 %}
{% node #candy-machine-2 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% node label="Features" /%}
{% node label="Authority" /%}
{% node #mint-authority-2 %}

Mint Authority = Alice {% .font-semibold %}

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

모든 것이 잘 진행되면 Core Candy Machine에 구성된 매개변수에 따라 NFT가 생성됩니다. 예를 들어, 주어진 Core Candy Machine이 **Is Sequential**이 `false`로 설정된 **Config Line Settings**를 사용한다면 다음 아이템을 무작위로 얻게 됩니다.

Candy Guard 프로그램 버전 `1.0`부터 민팅 지시는 기존 `payer` 서명자와 다를 수 있는 추가 `minter` 서명자를 수락합니다. 이를 통해 NFT를 민팅하는 지갑이 더 이상 SOL 수수료(저장 수수료 및 SOL 민팅 지불 등)를 지불할 필요가 없는 민팅 워크플로우를 생성할 수 있습니다. `payer` 서명자가 이러한 수수료를 추상화하기 때문입니다. `minter` 서명자는 여전히 토큰 기반 수수료를 지불해야 하고 구성된 가드를 검증하는 데 사용된다는 점에 유의하세요.

{% dialect-switcher title="Core Candy Machine에서 민팅하기" %}
{% dialect title="JavaScript" id="js" %}

구성된 Candy Guard 계정을 통해 Core Candy Machine에서 민팅하려면 `mintV1` 함수를 사용하고 민팅된 NFT가 속할 컬렉션 NFT의 민팅 주소와 업데이트 권한을 제공할 수 있습니다. `minter` 서명자와 `payer` 서명자도 제공할 수 있지만 기본적으로 각각 Umi의 신원과 지불자가 됩니다.

```ts
import { mintV1 } from "@metaplex-foundation/mpl-core-candy-machine";
import { setComputeUnitLimit } from "@metaplex-foundation/mpl-toolbox";
import { generateSigner } from "@metaplex-foundation/umi";

const candyMachineId = publicKey("11111111111111111111111111111111");
const coreCollection = publicKey("22222222222222222222222222222222");
const asset = generateSigner(umi);

await mintV1(umi, {
  candyMachine: candyMachineId,
  asset,
  collection: coreCollection,
}).sendAndConfirm(umi);

```

Candy Guard 프로그램 대신 Core Candy Machine 프로그램에서 직접 민팅하려는 드문 경우에는 `mintAssetFromCandyMachine` 함수를 대신 사용할 수 있습니다. 이 함수는 Core Candy Machine의 민팅 권한을 서명자로 제공해야 하며 명시적인 `assetOwner` 속성을 받습니다.

```ts
import { mintFromCandyMachineV2 } from '@metaplex-foundation/mpl-core-candy-machine'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'
import { transactionBuilder, generateSigner } from '@metaplex-foundation/umi'

const candyMachineId = publicKey('11111111111111111111111111111111')
const coreCollection = publicKey('22222222222222222222222222222222')
const asset = generateSigner(umi)

await mintAssetFromCandyMachine(umi, {
  candyMachine: candyMachineId,
  mintAuthority: umi.identity,
  assetOwner: umi.identity.publicKey,
  asset,
  collection: coreCollection,
}).sendAndConfirm(umi);
```

API 참조: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [mintAssetFromCandyMachine](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintAssetFromCandyMachine.html)

{% /dialect %}
{% /dialect-switcher %}

## 가드와 함께 민팅하기

많은 가드를 사용하는 Core Candy Machine에서 민팅할 때 추가 가드별 정보를 제공해야 할 수 있습니다.

민팅 지시를 수동으로 구축한다면 그 정보는 지시 데이터와 잔여 계정의 혼합으로 제공될 것입니다. 그러나 SDK를 사용하면 민팅 시 추가 정보가 필요한 각 가드가 **민팅 설정**이라고 부르는 설정 집합을 정의합니다. 이러한 민팅 설정은 프로그램이 필요로 하는 것으로 파싱됩니다.

민팅 설정이 필요한 가드의 좋은 예는 **NFT Payment** 가드로, 다른 것들 중에서 민팅 비용을 지불하는 데 사용해야 하는 NFT의 민팅 주소가 필요합니다.

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node label="Guards" theme="mint" z=1 /%}
{% node #nft-payment-guard label="NFT Payment" /%}
{% node label="Token Payment" /%}
{% node label="Start Date" /%}
{% node #third-party-signer-guard label="Third Party Signer" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=700 %}
{% node #mint-1 label="Mint" theme="pink" /%}
{% node label="Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="Access Control" theme="transparent" /%}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Core Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% node parent="mint-2" x=-400 %}
{% node #mint-settings label="Mint Settings" /%}
{% node label="Using our SDKs" theme="dimmed" /%}
{% /node %}

{% node #mint-args label="Mint Arguments" parent="mint-settings" x=100 y=80 theme="slate" /%}
{% node #mint-accounts label="Mint Remaining Accounts" parent="mint-args" y=50 theme="slate" /%}

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

[사용 가능한 각 가드](/core-candy-machine/guards)는 자체 문서 페이지를 가지고 있으며 해당 가드가 민팅 시 민팅 설정을 제공해야 하는지 여부를 알려줍니다.

민팅 설정이 필요하지 않은 가드만 사용한다면 위의 "기본 민팅" 섹션에서 설명한 것과 동일한 방식으로 민팅할 수 있습니다. 그렇지 않으면 모든 가드의 민팅 설정을 포함하는 추가 객체 속성을 제공해야 합니다. SDK를 사용하여 실제로 어떻게 보이는지 살펴보겠습니다.

생성한 코어 캔디머신의 캔디 가드 수에 따라 트랜잭션이 성공하도록 컴퓨터 단위 수를 늘려야 할 수도 있습니다. SDK도 이에 도움이 될 수 있습니다.

{% dialect-switcher title="가드가 있는 Core Candy Machine에서 민팅하기" %}
{% dialect title="JavaScript" id="js" %}

Umi 라이브러리를 통해 민팅할 때 `mintArgs` 속성을 사용하여 필요한 **민팅 설정**을 제공할 수 있습니다.

다음은 추가 서명자가 필요한 **Third Party Signer** 가드와 지갑이 Core Candy Machine에서 몇 번 민팅했는지 추적하는 **Mint Limit** 가드를 사용하는 예입니다.

위에서 언급했듯이 `mintV1` 지시가 성공하도록 트랜잭션의 컴퓨트 단위 한도를 늘려야 할 수 있습니다. 현재 단위는 `300_000`으로 설정되어 있지만 적합하다고 생각되는 대로 이 숫자를 조정할 수 있습니다. 아래 코드 스니펫에 설명된 대로 `mpl-toolbox` Umi 라이브러리의 `setComputeUnitLimit` 헬퍼 함수를 사용하여 이를 수행할 수 있습니다.

```ts
import {
  some,
  generateSigner,
  transactionBuilder,
} from '@metaplex-foundation/umi'
import { create, mintV1 } from '@metaplex-foundation/mpl-core-candy-machine'
import { setComputeUnitLimit } from '@metaplex-foundation/mpl-toolbox'

// 가드가 있는 Core Candy Machine을 생성합니다.
const thirdPartySigner = generateSigner()
await create(umi, {
  // ...
  guards: {
    thirdPartySigner: some({ signer: thirdPartySigner.publicKey }),
    mintLimit: some({ id: 1, limit: 3 }),
  },
}).sendAndConfirm(umi)

// Core Candy Machine에서 민팅합니다.
const nftMint = generateSigner(umi)
await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 300_000 }))
  .add(
    mintV1(umi, {
      candyMachine: candyMachineId,
      asset,
      collection: coreCollection,
      mintArgs: {
        thirdPartySigner: some({ signer: thirdPartySigner }),
        mintLimit: some({ id: 1 }),
      },
    })
  )
  .sendAndConfirm(umi)
```

API 참조: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [DefaultGuardSetMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetMintArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 가드 그룹과 함께 민팅하기

가드 그룹을 사용하는 Core Candy Machine에서 민팅할 때 **라벨을 제공하여 민팅할 그룹을 명시적으로 선택해야 합니다**.

또한 [이전 섹션](#minting-with-guards)에서 설명한 대로 민팅 설정이 필요할 수도 있습니다. 그러나 **민팅 설정은 선택된 그룹의 "해결된 가드"에 적용됩니다**.

예를 들어, 다음 가드를 가진 Core Candy Machine을 상상해보세요:

- **기본 가드**:
  - Bot Tax
  - Third Party Signer
  - Start Date
- **그룹 1**
  - 라벨: "nft"
  - 가드:
    - NFT Payment
    - Start Date
- **그룹 2**
  - 라벨: "public"
  - 가드:
    - Sol Payment

"nft"라는 라벨의 그룹 1의 해결된 가드는:

- Bot Tax: **기본 가드**에서.
- Third Party Signer: **기본 가드**에서.
- NFT Payment: **그룹 1**에서.
- Start Date: 기본 가드를 재정의하므로 **그룹 1**에서.

따라서 제공된 민팅 설정은 이러한 해결된 가드와 관련되어야 합니다. 위 예에서 Third Party Signer 가드와 NFT Payment 가드에 대해 민팅 설정을 제공해야 합니다.

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node label="Guards (default guards)" theme="mint" z=1 /%}
{% node label="Bot Tax" /%}
{% node #third-party-signer-guard label="Third Party Signer" /%}
{% node label="Start Date" /%}
{% node #nft-group theme="mint" z=1 %}
Group 1: "nft" {% .font-semibold %}
{% /node %}
{% node #nft-payment-guard label="NFT Payment" /%}
{% node label="Start Date" /%}
{% node theme="mint" z=1 %}
Group 2: "public"
{% /node %}
{% node label="SOL Payment" /%}
{% /node %}

{% node parent="candy-machine-1" x=700 %}
{% node #mint-1 label="Mint" theme="pink" /%}
{% node label="Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="Access Control" theme="transparent" /%}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Core Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% node parent="mint-2" x=-400 y=60 %}
{% node #mint-settings label="Mint Settings" /%}
{% node label="Using our SDKs" theme="dimmed" /%}
{% /node %}

{% node #mint-args label="Mint Arguments" parent="mint-settings" x=100 y=80 theme="slate" /%}
{% node #mint-accounts label="Mint Remaining Accounts" parent="mint-args" y=50 theme="slate" /%}

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

{% dialect-switcher title="가드 그룹이 있는 Core Candy Machine에서 민팅하기" %}
{% dialect title="JavaScript" id="js" %}

가드 그룹을 사용하는 Core Candy Machine에서 민팅할 때 선택하려는 그룹의 라벨을 `group` 속성을 통해 제공해야 합니다.

또한 해당 그룹의 해결된 가드에 대한 민팅 설정을 `mintArgs` 속성을 통해 제공할 수 있습니다.

다음은 Umi 라이브러리를 사용하여 위에서 설명한 예제 Core Candy Machine에서 민팅하는 방법입니다.

```ts
// 가드가 있는 Core Candy Machine을 생성합니다.
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

// Core Candy Machine에서 민팅합니다.

const candyMachineId = publicKey('11111111111111111111111111111111')
const coreCollection = publicKey('22222222222222222222222222222222')
const asset = generateSigner(umi)

await transactionBuilder()
  .add(setComputeUnitLimit(umi, { units: 300_000 }))
  .add(
    mintV1(umi, {
      candyMachine: candyMachineId,
      asset,
      collection: coreCollection,
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

API 참조: [mintV1](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/mintV1.html), [DefaultGuardSetMintArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetMintArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## 사전 검증과 함께 민팅하기

일부 가드는 Core Candy Machine에서 민팅하기 전에 추가 검증 단계가 필요할 수 있다는 점에 유의해야 합니다. 이 사전 검증 단계는 보통 블록체인에 계정을 생성하거나 해당 검증의 증명 역할을 하는 토큰으로 지갑에 보상을 줍니다.

### route 지시 사용하기

가드가 사전 검증 단계를 요구할 수 있는 한 가지 방법은 "route" 지시를 통해 [자체 특별 지시](/core-candy-machine/guard-route)를 사용하는 것입니다.

좋은 예는 **Allow List** 가드입니다. 이 가드를 사용할 때 route 지시를 호출하고 유효한 Merkle Proof를 제공하여 지갑이 미리 정의된 지갑 목록에 속하는지 확인해야 합니다. 이 route 지시가 성공하면 해당 지갑에 대한 Allow List PDA를 생성하고 민팅 지시가 이를 읽어 Allow List 가드를 검증할 수 있습니다. [Allow List 가드에 대한 자세한 내용은 전용 페이지에서 확인할 수 있습니다](/core-candy-machine/guards/allow-list).

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node label="Guards" theme="mint" z=1 /%}
{% node #allow-list-guard label="Allow List" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=550 %}
{% node #mint-1 label="Mint" theme="pink" /%}
{% node label="Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="Access Control" theme="transparent" /%}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Core Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% node parent="mint-2" x=-250 %}
{% node #route label="Route" theme="pink" /%}
{% node label="Core Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="route" x=70 y=-20 label="Verify Merkle Proof" theme="transparent" /%}

{% node #allow-list-pda parent="route" x=23 y=100 label="Allow List PDA" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="allow-list-guard" to="route" theme="pink" /%}
{% edge from="route" to="allow-list-pda" theme="pink" path="straight" /%}
{% edge from="allow-list-pda" to="mint-1" theme="pink" /%}

{% /diagram %}

### 외부 서비스 사용하기

가드가 사전 검증 단계를 수행할 수 있는 또 다른 방법은 외부 솔루션에 의존하는 것입니다.

예를 들어, **Gatekeeper** 가드를 사용할 때 구성된 Gatekeeper Network에 따라 Captcha 완성과 같은 도전을 수행하여 Gateway Token을 요청해야 합니다. 그러면 Gatekeeper 가드가 그러한 Gateway Token의 존재를 확인하여 민팅을 검증하거나 거부합니다. [Gatekeeper 가드에 대한 자세한 내용은 전용 페이지에서 확인할 수 있습니다](/core-candy-machine/guards/gatekeeper).

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node label="Guards" theme="mint" z=1 /%}
{% node #gatekeeper-guard label="Gatekeeper" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=550 %}
{% node #mint-1 label="Mint" theme="pink" /%}
{% node label="Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="Access Control" theme="transparent" /%}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Core Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% node parent="mint-2" x=-250 y=-40 %}
{% node #network label="Gatekeeper Network" theme="slate" /%}
{% node theme="slate" %}
Captcha 등 \
Gatekeeper Network에서 \
Gateway Token을 요청합니다.
{% /node %}
{% /node %}

{% node #gateway-token parent="network" x=23 y=140 label="Gateway Token" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="gatekeeper-guard" to="network" theme="slate" /%}
{% edge from="network" to="gateway-token" theme="slate" path="straight" /%}
{% edge from="gateway-token" to="mint-1" theme="pink" /%}

{% /diagram %}

## 봇 세금과 함께 민팅하기

Core Candy Machine에 포함하고 싶을 가드 중 하나는 실패한 민팅에 구성 가능한 SOL 금액을 청구하여 봇으로부터 Core Candy Machine을 보호하는 Bot Tax 가드일 것입니다. 이 금액은 일반적으로 실제 사용자의 진짜 실수에 영향을 주지 않으면서 봇을 해치기 위해 적게 설정됩니다. 모든 봇 세금은 Core Candy Machine 계정으로 전송되므로 민팅이 끝나면 Core Candy Machine 계정을 삭제하여 이 자금에 액세스할 수 있습니다.

이 가드는 약간 특별하며 다른 모든 가드의 민팅 동작에 영향을 줍니다. Bot Tax가 활성화되고 다른 가드가 민팅 검증에 실패하면 **트랜잭션이 성공한 것처럼 가장합니다**. 이는 프로그램에서 오류가 반환되지 않지만 NFT도 민팅되지 않는다는 의미입니다. 이는 봇에서 Core Candy Machine 계정으로 자금이 전송되려면 트랜잭션이 성공해야 하기 때문입니다. [Bot Tax 가드에 대한 자세한 내용은 전용 페이지에서 확인할 수 있습니다](/core-candy-machine/guards/bot-tax).

## 결론

축하합니다! 이제 Core Candy Machine이 A부터 Z까지 어떻게 작동하는지 알게 되었습니다!

다음은 관심을 가질 만한 추가 읽기 자료입니다:

- [사용 가능한 모든 가드](/core-candy-machine/guards): 사용 가능한 모든 가드를 살펴보고 필요한 것들을 선별하세요.