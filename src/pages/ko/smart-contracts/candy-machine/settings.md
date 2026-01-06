---
title: Candy Machine 설정
metaTitle: 설정 | Candy Machine
description: Candy Machine 설정에 대해 자세히 설명합니다.
---

이 페이지에서는 Candy Machine에서 사용할 수 있는 모든 설정을 자세히 살펴보겠습니다. 가드로 알려진 민팅 프로세스에 영향을 주는 설정보다는 Candy Machine 자체와 생성되는 NFT에 영향을 주는 설정에 집중하겠습니다. 후자는 전용 페이지에서 다루겠습니다. {% .lead %}

## 권한

Solana에서 계정을 생성할 때 가장 중요한 정보 중 하나는 계정을 관리할 수 있는 지갑으로, 이를 **권한**이라고 합니다. 따라서 새로운 Candy Machine을 생성할 때는 나중에 업데이트, 아이템 삽입, 삭제 등을 할 수 있는 권한의 주소를 제공해야 합니다.

민팅 프로세스를 위한 추가 권한인 **민트 권한**이 있습니다. Candy Machine이 Candy Guard 없이 생성되면 이 권한이 Candy Machine에서 민팅할 수 있는 유일한 지갑입니다. 다른 누구도 민팅할 수 없습니다. 그러나 실제로는 이 민트 권한이 **가드**로 알려진 사전 구성된 규칙 세트를 기반으로 민팅 프로세스를 제어하는 Candy Guard의 주소로 설정됩니다.

중요한 점은 SDK를 사용할 때 Candy Machine이 기본적으로 관련된 Candy Guard와 함께 항상 생성되므로 이 민트 권한에 대해 걱정할 필요가 없다는 것입니다.

{% dialect-switcher title="권한 설정" %}
{% dialect title="JavaScript" id="js" %}

새로운 Candy Machine을 생성할 때 권한은 기본적으로 Umi identity로 설정됩니다. `authority` 속성에 유효한 서명자를 제공하여 이 권한을 명시적으로 설정할 수 있습니다.

```tsx
import { generateSigner } from '@metaplex-foundation/umi'

const myCustomAuthority = generateSigner(umi)
const candyMachineSettings = {
  authority: myCustomAuthority,
}
```

{% /dialect %}
{% /dialect-switcher %}

## 모든 NFT가 공유하는 설정

Candy Machine 설정의 큰 부분은 해당 Candy Machine에서 민팅될 NFT를 정의하는 데 사용됩니다. 이는 많은 NFT 속성이 모든 민팅된 NFT에 대해 동일하기 때문입니다. 따라서 Candy Machine에 아이템을 로드할 때마다 이러한 속성을 반복해야 하는 대신 Candy Machine 설정에서 한 번 설정합니다.

민팅된 NFT를 서로 구별할 수 있는 유일한 속성은 NFT의 **이름**과 JSON 메타데이터를 가리키는 **URI**라는 점에 주목하세요. 자세한 내용은 [아이템 삽입](/ko/smart-contracts/candy-machine/insert-items)을 참조하세요.

다음은 모든 민팅된 NFT 간에 공유되는 속성 목록입니다.

- **판매자 수수료 베이시스 포인트**: 민팅된 NFT에 설정되어야 하는 2차 판매 로열티를 베이시스 포인트로 표시. 예를 들어 `250`은 `2.50%` 로열티를 의미합니다.
- **심볼**: 민팅된 NFT에 사용할 심볼 — 예: "MYPROJECT". 이는 최대 10자까지의 텍스트가 될 수 있으며 빈 텍스트를 제공하여 선택 사항으로 만들 수 있습니다.
- **최대 에디션 공급량**: 민팅된 NFT에서 인쇄할 수 있는 최대 에디션 수. 대부분의 사용 사례에서는 민팅된 NFT가 여러 번 인쇄되는 것을 방지하기 위해 이를 `0`으로 설정하려고 할 것입니다. 이를 `null`로 설정할 수 없다는 점에 주목하세요. 즉, Candy Machine에서는 무제한 에디션이 지원되지 않습니다.
- **변경 가능**: 민팅된 NFT가 변경 가능해야 하는지 여부. 특별한 이유가 없다면 이를 `true`로 설정하는 것을 권장합니다. 나중에 NFT를 불변으로 만들 수는 있지만 불변 NFT를 다시 변경 가능하게 만들 수는 없습니다.
- **창작자**: 민팅된 NFT에 설정되어야 하는 창작자 목록. 여기에는 주소와 로열티의 백분율 지분이 포함됩니다 — 즉, `5`는 `5%`입니다. Candy Machine 주소는 항상 모든 민팅된 NFT의 첫 번째 창작자로 설정되고 자동으로 검증됩니다. 이를 통해 누구나 NFT가 신뢰할 수 있는 Candy Machine에서 민팅되었음을 확인할 수 있습니다. 제공된 다른 모든 창작자는 그 이후에 설정되며 해당 창작자가 수동으로 검증해야 합니다.
- **토큰 표준**: 민팅된 NFT에 사용할 [토큰 표준](/ko/smart-contracts/token-metadata/token-standard). 지금까지 두 가지 토큰 표준만 지원됩니다: "[NonFungible](/ko/smart-contracts/token-metadata/token-standard#the-non-fungible-standard)" 및 "[ProgrammableNonFungible](/ko/smart-contracts/token-metadata/token-standard#the-programmable-non-fungible-standard)". 이는 _계정 버전_이 2 이상인 Candy Machine에서만 사용할 수 있습니다.
- **규칙 세트**: Candy Machine이 "ProgrammableNonFungible" 토큰 표준을 사용하는 경우, 모든 민팅된 프로그래머블 NFT에 할당될 명시적 규칙 세트를 제공할 수 있습니다. 규칙 세트가 제공되지 않으면 컬렉션 NFT의 규칙 세트를 기본으로 사용합니다(있는 경우). 그렇지 않으면 프로그래머블 NFT는 규칙 세트 없이 민팅됩니다. 이는 _계정 버전_이 2 이상인 Candy Machine에서만 사용할 수 있습니다.

{% dialect-switcher title="공유 NFT 설정" %}
{% dialect title="JavaScript" id="js" %}

위에 나열된 속성 중 `sellerFeeBasisPoints`, `creators`, `tokenStandard` 속성만 필수입니다. 다른 속성들은 다음과 같은 기본값을 가집니다:

- `symbol`은 빈 문자열로 기본 설정됩니다 — 즉, 민팅된 NFT는 심볼을 사용하지 않습니다.
- `maxEditionSupply`는 0으로 기본 설정됩니다 — 즉, 민팅된 NFT는 인쇄할 수 없습니다.
- `isMutable`은 `true`로 기본 설정됩니다.

다음과 같이 이러한 속성을 명시적으로 제공할 수 있습니다.

```tsx
import { percentAmount, generateSigner, some } from '@metaplex-foundation/umi'
import { TokenStandard } from '@metaplex-foundation/mpl-token-metadata'

const creatorA = generateSigner(umi).publicKey
const creatorB = generateSigner(umi).publicKey
const candyMachineSettings = {
  tokenStandard: TokenStandard.NonFungible,
  sellerFeeBasisPoints: percentAmount(33.3, 2),
  symbol: 'MYPROJECT',
  maxEditionSupply: 0,
  isMutable: true,
  creators: [
    { address: creatorA, percentageShare: 50, verified: false },
    { address: creatorB, percentageShare: 50, verified: false },
  ],
}
```

{% /dialect %}
{% /dialect-switcher %}

## Metaplex 인증 컬렉션

각 Candy Machine은 [Metaplex 인증 컬렉션(MCC)](/ko/smart-contracts/token-metadata/collections)으로 알려진 특별한 NFT와 연결되어야 합니다. 이 **컬렉션 NFT**는 민팅된 NFT를 함께 그룹화하고 해당 정보가 온체인에서 검증될 수 있도록 합니다.

다른 사람이 자신의 Candy Machine에서 귀하의 컬렉션 NFT를 사용할 수 없도록 하기 위해 **컬렉션의 업데이트 권한**이 Candy Machine의 컬렉션을 변경하는 모든 트랜잭션에 서명해야 합니다. 결과적으로 Candy Machine은 모든 민팅된 NFT의 컬렉션을 자동으로 안전하게 검증할 수 있습니다.

{% dialect-switcher title="컬렉션 NFT 설정" %}
{% dialect title="JavaScript" id="js" %}

새로운 Candy Machine을 생성하거나 컬렉션 NFT를 업데이트할 때 다음 속성을 제공해야 합니다:

- `collectionMint`: 컬렉션 NFT의 민트 계정 주소.
- `collectionUpdateAuthority`: 서명자로서의 컬렉션 NFT의 업데이트 권한.

다음은 예시입니다.

```tsx
import { generateSigner, percentAmount } from '@metaplex-foundation/umi'
import { createNft } from '@metaplex-foundation/mpl-token-metadata'

// 컬렉션 NFT 생성.
const collectionUpdateAuthority = generateSigner(umi)
const collectionMint = generateSigner(umi)
await createNft(umi, {
  mint: collectionMint,
  authority: collectionUpdateAuthority,
  name: 'My Collection NFT',
  uri: 'https://example.com/path/to/some/json/metadata.json',
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  isCollection: true,
    collectionDetails: {
    __kind: 'V1',
    size: 0,
  },
}).sendAndConfirm(umi)

// 설정에 컬렉션 주소와 권한 전달.
const candyMachineSettings = {
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
}
```

{% /dialect %}
{% /dialect-switcher %}

## 아이템 설정

Candy Machine 설정에는 내부에 로드되어 있거나 로드될 아이템에 관한 정보도 포함되어 있습니다. **사용 가능한 아이템** 속성이 이 범주에 속하며 Candy Machine에서 민팅될 NFT의 최대 수를 저장합니다.

{% dialect-switcher title="아이템 수 설정" %}
{% dialect title="JavaScript" id="js" %}

새로운 Candy Machine을 생성할 때 `itemsAvailable` 속성은 필수이며 큰 정수의 경우 숫자 또는 네이티브 `bigint`일 수 있습니다.

```tsx
const candyMachineSettings = {
  itemsAvailable: 500,
}
```

{% /dialect %}
{% /dialect-switcher %}

**사용 가능한 아이템** 속성 외에도 아이템이 Candy Machine에 로드되는 방법을 정의하는 두 가지 다른 속성이 있습니다. 이러한 속성 중 정확히 하나를 선택하고 다른 하나는 비워두어야 합니다. 이러한 속성은:

- **구성 라인 설정**.
- **숨겨진 설정**.

Candy Machine이 이 두 모드 중 하나를 사용하여 생성되면 다른 모드를 사용하도록 업데이트할 수 없다는 점에 주목하세요. 또한 **구성 라인 설정**이 사용되면 더 이상 **사용 가능한 아이템** 속성을 업데이트할 수 없습니다.

두 가지 모두에 대해 좀 더 자세히 살펴보겠습니다.

{% callout type="note" title="무작위성" %}

자산의 "무작위" 민팅 프로세스가 완전히 예측할 수 없는 것은 아니며 충분한 리소스와 악의적인 의도로 영향을 받을 수 있으므로 공개 메커니즘을 위해 [숨겨진 설정](#hidden-settings)을 활용하는 것이 바람직할 수 있습니다.

{% /callout %}

### 구성 라인 설정

**구성 라인 설정** 속성을 사용하면 Candy Machine 내부에 있거나 삽입될 아이템을 설명할 수 있습니다. 아이템의 **이름**과 **URI**에 대한 정확한 길이를 제공하고 해당 길이를 줄이기 위해 일부 공유 접두사를 제공하여 Candy Machine의 크기를 최소로 유지할 수 있습니다. **구성 라인 설정** 속성은 다음 속성을 포함하는 객체입니다:

- **이름 접두사**: 모든 삽입된 아이템이 공유하는 이름 접두사. 이 접두사는 최대 32자를 가질 수 있습니다.
- **이름 길이**: 이름 접두사를 제외한 각 삽입된 아이템의 이름에 대한 최대 길이.
- **URI 접두사**: 모든 삽입된 아이템이 공유하는 URI 접두사. 이 접두사는 최대 200자를 가질 수 있습니다.
- **URI 길이**: URI 접두사를 제외한 각 삽입된 아이템의 URI에 대한 최대 길이.
- **순차적**: NFT를 순차적으로 — `true` — 또는 무작위 순서로 — `false` — 민팅할지 여부를 나타냅니다. 구매자가 다음에 어떤 NFT가 민팅될지 예측하는 것을 방지하기 위해 이를 `false`로 설정하는 것을 권장합니다. SDK는 새로운 Candy Machine을 생성할 때 순차적을 `false`로 설정한 구성 라인 설정을 기본으로 사용합니다.

이러한 **이름**과 **URI** 속성을 더 잘 이해하기 위해 예시를 살펴보겠습니다. 다음과 같은 특성을 가진 Candy Machine을 생성하려고 한다고 가정해보겠습니다:

- `1000`개의 아이템을 포함합니다.
- 각 아이템의 이름은 "My NFT Project #X"이며, 여기서 X는 1부터 시작하는 아이템의 인덱스입니다.
- 각 아이템의 JSON 메타데이터는 Arweave에 업로드되었으므로 URI는 "https://arweave.net/"로 시작하고 최대 43자 길이의 고유 식별자로 끝납니다.

이 예시에서 접두사 없이는 다음과 같이 됩니다:

- 이름 길이 = 20. "My NFT Project #"에 16자, 가장 큰 숫자인 "1000"에 4자.
- URI 길이 = 63. "https://arweave.net/"에 20자, 고유 식별자에 43자.

1000개의 아이템을 삽입할 때 아이템을 저장하는 데만 총 83,000자가 필요합니다. 그러나 접두사를 사용하면 Candy Machine을 생성하는 데 필요한 공간과 따라서 블록체인에서 생성하는 비용을 크게 줄일 수 있습니다.

- 이름 접두사 = "My NFT Project #"
- 이름 길이 = 4
- URI 접두사 = "https://arweave.net/"
- URI 길이 = 43

1000개의 아이템으로 이제 아이템을 저장하는 데 47,000자만 필요합니다.

하지만 그게 전부가 아닙니다! 이름 또는 URI 접두사 내에서 **두 개의 특수 변수**를 사용하여 크기를 더욱 줄일 수 있습니다. 이러한 변수는:

- `$ID$`: 0부터 시작하는 아이템의 인덱스로 교체됩니다.
- `$ID+1$`: 1부터 시작하는 아이템의 인덱스로 교체됩니다.

위의 예시에서 이름 접두사에 `$ID+1$` 변수를 활용하여 모든 아이템에 삽입할 필요가 없도록 할 수 있습니다. 다음과 같은 구성 라인 설정이 됩니다:

- 이름 접두사 = "My NFT Project #$ID+1$"
- 이름 길이 = 0
- URI 접두사 = "https://arweave.net/"
- URI 길이 = 43

맞습니다, **이름 길이가 이제 0**이고 필요한 문자를 43,000자로 줄였습니다.

{% dialect-switcher title="구성 라인 설정" %}
{% dialect title="JavaScript" id="js" %}

Umi를 사용할 때 `some` 및 `none` 도우미 함수를 사용하여 라이브러리에 `configLineSettings` 및 `hiddenSettings` 속성을 통해 구성 라인 설정 또는 숨겨진 설정을 사용할지 여부를 알릴 수 있습니다. 이러한 설정 중 하나만 사용해야 하므로 하나는 구성되고 다른 하나는 `none()`으로 설정되어야 합니다.

다음은 Umi 라이브러리를 사용하여 위의 예시를 설정하는 방법을 보여주는 코드 스니펫입니다.

```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  hiddenSettings: none(),
  configLineSettings: some({
    prefixName: 'My NFT Project #$ID+1$',
    nameLength: 0,
    prefixUri: 'https://arweave.net/',
    uriLength: 43,
    isSequential: false,
  }),
}
```

{% /dialect %}
{% /dialect-switcher %}

### 숨겨진 설정

아이템을 준비하는 다른 방법은 **숨겨진 설정**을 사용하는 것입니다. 이는 구성 라인 설정과는 완전히 다른 접근 방식으로, 숨겨진 설정을 사용하면 민팅된 모든 NFT가 동일한 이름과 동일한 URI를 공유하므로 Candy Machine에 아이템을 삽입할 필요가 없습니다. 왜 누군가 그렇게 하고 싶어 할까요? 그 이유는 민팅 후 모든 NFT를 공개하는 **숨기고 공개하는 NFT 드롭**을 만들기 위해서입니다. 그렇다면 어떻게 작동할까요?

- 먼저 창작자는 숨겨진 설정을 사용하여 모든 민팅된 NFT의 이름과 URI를 구성합니다. URI는 일반적으로 공개가 곧 일어날 것임을 명확히 하는 "티저" JSON 메타데이터를 가리킵니다.
- 그다음 구매자는 동일한 URI와 따라서 동일한 "티저" JSON 메타데이터로 이러한 모든 NFT를 민팅합니다.
- 마지막으로 모든 NFT가 민팅되면 창작자는 모든 민팅된 NFT의 URI를 해당 NFT에 특정한 실제 URI를 가리키도록 업데이트합니다.

마지막 단계의 문제는 창작자가 어떤 구매자가 어떤 NFT를 받는지 조작할 수 있다는 것입니다. 이를 방지하고 구매자가 NFT와 JSON 메타데이터 간의 매핑이 변조되지 않았음을 확인할 수 있도록 하기 위해 숨겨진 설정에는 NFT 인덱스를 실제 JSON 메타데이터와 매핑하는 파일의 32자 해시로 채워져야 하는 **해시** 속성이 있습니다. 이렇게 하면 공개 후 창작자가 해당 파일을 공개할 수 있고 구매자는 해당 해시가 숨겨진 설정에 제공된 해시와 일치하는지 확인할 수 있습니다.

따라서 숨겨진 설정 속성에 다음 속성들이 있게 됩니다:

- **이름**: 모든 민팅된 NFT의 "숨겨진" 이름. 최대 32자를 가질 수 있습니다.
- **URI**: 모든 민팅된 NFT의 "숨겨진" URI. 최대 200자를 가질 수 있습니다.
- **해시**: NFT 인덱스를 실제 JSON 메타데이터와 매핑하는 파일의 32자 해시로 구매자가 변조되지 않았음을 확인할 수 있도록 합니다.

구성 라인 설정의 접두사와 마찬가지로 숨겨진 설정의 **이름**과 **URI**에도 특수 변수를 사용할 수 있다는 점에 주목하세요. 다시 말해, 이러한 변수는:

- `$ID$`: 0부터 시작하는 민팅된 NFT의 인덱스로 교체됩니다.
- `$ID+1$`: 1부터 시작하는 민팅된 NFT의 인덱스로 교체됩니다.

또한 Candy Machine에 아이템을 삽입하지 않으므로 숨겨진 설정을 사용하면 매우 큰 드롭을 만들 수 있다는 점에도 주목하세요. 유일한 주의사항은 민팅 후 각 NFT의 이름과 URI를 업데이트하는 오프체인 프로세스가 필요하다는 것입니다.

{% dialect-switcher title="숨겨진 설정" %}
{% dialect title="JavaScript" id="js" %}

해시를 계산하려면 다음 함수를 사용할 수 있습니다:

```ts
import crypto from 'crypto'

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

console.log(hash)
```

Umi를 사용할 때 `some` 및 `none` 도우미 함수를 사용하여 라이브러리에 `configLineSettings` 및 `hiddenSettings` 속성을 통해 구성 라인 설정 또는 숨겨진 설정을 사용할지 여부를 알릴 수 있습니다. 이러한 설정 중 하나만 사용해야 하므로 하나는 구성되고 다른 하나는 `none()`으로 설정되어야 합니다.

다음은 Umi 라이브러리를 사용하여 위의 예시를 설정하는 방법을 보여주는 코드 스니펫입니다.

```tsx
import { some, none } from '@metaplex-foundation/umi'

const candyMachineSettings = {
  configLineSettings: none(),
  hiddenSettings: some({
    name: 'My NFT Project #$ID+1$',
    uri: 'https://example.com/path/to/teaser.json',
    hash: hashOfTheFileThatMapsUris,
  }),
}
```

{% /dialect %}
{% /dialect-switcher %}

## 가드와 그룹

소개에서 언급했듯이 이 페이지는 주요 Candy Machine 설정에 중점을 두지만 가드를 사용하여 Candy Machine에서 구성할 수 있는 것이 훨씬 더 많습니다.

이는 설명할 많은 사용 가능한 기본 가드가 있는 광범위한 주제이므로 이 문서의 전체 섹션을 할애했습니다. 시작하기 가장 좋은 곳은 [Candy Guards](/ko/smart-contracts/candy-machine/guards) 페이지입니다.

## 결론

이제 주요 Candy Machine 설정에 대해 알았으므로 [다음 페이지](/ko/smart-contracts/candy-machine/manage)에서 자체 Candy Machine을 생성하고 업데이트하는 방법을 살펴보겠습니다.