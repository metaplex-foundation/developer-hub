---
title: Core Candy Machine 생성하기
metaTitle: Core Candy Machine 생성하기 | Core Candy Machine
description: JavaScript와 Rust에서 Core Candy Machine과 다양한 설정을 생성하는 방법을 알아보세요.
---

## 전제 조건

- [자산 준비](/core-candy-machine/preparing-assets)
- [Core 컬렉션 생성](/core/collections#creating-a-collection)

Core Candy Machine 자산을 컬렉션(신규 또는 기존)으로 생성하려면 Core Candy Machine 생성 시 Core 컬렉션을 제공해야 합니다.

## Candy Machine 생성하기

{% dialect-switcher title="Core Candy Machine 생성하기" %}
{% dialect title="JavaScript" id="js" %}

```ts
// Create the Candy Machine.
import { create } from '@metaplex-foundation/mpl-core-candy-machine'
import { generateSigner } from '@metaplex-foundation/umi'

const candyMachine = generateSigner(umi)

const createIx = await create(umi, {
  candyMachine,
  collection: collectionMint.publicKey,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 1000,
  authority: umi.identity.publicKey,
})

await createIx.sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

### 인수

createCandyMachine 함수에 전달할 수 있는 사용 가능한 인수들입니다.

Core Candy Machine을 생성하는 데 사용되는 새로 생성된 키페어/서명자입니다.

{% dialect-switcher title="CandyMachine 생성 인수" %}
{% dialect title="JavaScript" id="js" %}

| 이름                      | 타입                          |
| ------------------------- | ----------------------------- |
| candyMachine              | signer                        |
| authorityPda (optional)   | publicKey                     |
| authority (optional)      | publicKey                     |
| payer (optional)          | signer                        |
| collection                | publicKey                     |
| collectionUpdateAuthority | signer                        |
| itemsAvailable            | number                        |
| isMutable                 | boolean                       |
| configLineSettings        | [링크](#config-line-settings) |
| hiddenSettings            | [링크](#hidden-settings)      |

{% /dialect %}
{% dialect title="Rust" id="rust" %}

| 이름                      | 타입                          |
| ------------------------- | ----------------------------- |
| candyMachine              | signer                        |
| authorityPda (optional)   | pubkey                        |
| authority (optional)      | pubkey                        |
| payer (optional)          | signer                        |
| collection                | pubkey                        |
| collectionUpdateAuthority | signer                        |
| itemsAvailable            | number                        |
| isMutable                 | boolean                       |
| configLineSettings        | [링크](#config-line-settings) |
| hiddenSettings            | [링크](#hidden-settings)      |

{% /dialect %}
{% /dialect-switcher %}

### authorityPda (선택사항)

{% dialect-switcher title="Authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
authorityPda: string
```

{% /dialect %}
{% /dialect-switcher %}

authorityPda 필드는 민팅된 자산을 컬렉션에 검증하는 데 사용되는 PDA입니다. 이는 선택사항이며 생략되면 기본 시드를 기반으로 자동으로 계산됩니다.

### authority (선택사항)

{% dialect-switcher title="authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
authority: string
```

{% /dialect %}
{% /dialect-switcher %}

### payer (선택사항)

트랜잭션과 임대 비용을 지불하는 지갑입니다. 기본값은 서명자입니다.

{% dialect-switcher title="authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
payer: publicKey
```

{% /dialect %}
{% /dialect-switcher %}

authority 필드는 Core Candy Machine의 권한을 가질 지갑/공개키입니다.

### Collection

Core Candy Machine이 자산을 생성할 컬렉션입니다.

{% dialect-switcher title="authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
collection: publicKey
```

{% /dialect %}
{% /dialect-switcher %}

### Collection Update Authority

컬렉션의 업데이트 권한입니다. Candy Machine이 생성된 자산을 컬렉션에 검증하기 위해 위임자를 승인할 수 있도록 서명자여야 합니다.

{% dialect-switcher title="authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
collectionUpdateAuthority: signer
```

{% /dialect %}
{% /dialect-switcher %}

<!-- ### Seller Fee Basis Points

{% dialect-switcher title="sellerFeeBasisPoints" %}
{% dialect title="JavaScript" id="js" %}

```ts
sellerFeeBasisPoints: number
```

{% /dialect %}
{% /dialect-switcher %}

`sellerFeeBasisPoints` 필드는 Candy Machine에서 생성된 각 자산에 기록될 로열티 베이시스 포인트입니다.
이는 소수점 2자리를 기반으로 한 숫자로 지정되므로 `500` 베이시스 포인트는 `5%`와 같습니다.

`umi` 라이브러리에서 가져올 수 있는 계산에 사용할 수 있는 `percentageAmount` 헬퍼도 있습니다.

{% dialect-switcher title="percentageAmount" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { percentAmount } from '@metaplex-foundation/umi'

sellerFeeBasisPoints: percentageAmount(5)
```

{% /dialect %}
{% /dialect-switcher %} -->

### itemsAvailable

Core Candy Machine에 로드되는 아이템의 수입니다.

{% dialect-switcher title="itemsAvailable" %}
{% dialect title="JavaScript" id="js" %}

```ts
itemsAvailable: number
```

{% /dialect %}
{% /dialect-switcher %}

### Is Mutable

생성 시 자산을 변경 가능하거나 불변으로 표시하는 부울값입니다.

{% dialect-switcher title="isMutable" %}
{% dialect title="JavaScript" id="js" %}

```ts
isMutable: boolean
```

{% /dialect %}
{% /dialect-switcher %}

### Config Line Settings

{% callout type="note" title="무작위성" %}

Config Line Settings와 Hidden Settings는 상호 배타적입니다. 한 번에 하나만 사용할 수 있습니다.

자산의 "무작위" 민팅 프로세스는 완전히 예측할 수 없는 것은 아니며 충분한 자원과 악의적인 의도에 의해 영향을 받을 수 있으므로 공개 메커니즘에 Hidden Settings를 활용하는 것이 권장될 수 있습니다.

{% /callout %}

Config Line Settings는 Core Candy Machine에 자산 데이터를 추가하는 고급 옵션을 제공하여 Core Candy Machine의 임대 비용을 상당히 저렴하게 만드는 선택적 필드입니다.

자산의 이름과 URI 접두사를 Core Candy Machine에 저장함으로써 저장해야 하는 데이터가 상당히 줄어듭니다. 모든 단일 자산에 대해 동일한 이름과 URI를 저장하지 않기 때문입니다.

예를 들어, 모든 자산이 `Example Asset #1`부터 `Example Asset #1000`까지의 동일한 명명 구조를 가진다면, 일반적으로 `Example Asset #` 문자열을 1000번 저장해야 하여 15,000바이트를 차지합니다.

이름의 접두사를 Core Candy Machine에 저장하고 Core Candy Machine이 생성된 인덱스 번호를 문자열에 추가하도록 하면 임대 비용에서 이 15,000바이트를 절약할 수 있습니다.

이는 URI 접두사에도 적용됩니다.

{% dialect-switcher title="ConfigLineSettings 객체" %}
{% dialect title="JavaScript" id="js" %}

```ts
ConfigLineSettings = {
    prefixName: string;
    nameLength: number;
    prefixUri: string;
    uriLength: number;
    isSequential: boolean;
}
```

{% /dialect %}
{% /dialect-switcher %}

#### prefixName

이는 NFT의 이름 접두사를 저장하고 민팅 시 이름 끝에 민팅된 인덱스를 추가합니다.

자산의 이름 구조가 `Example Asset #1`이라면 접두사는 `Example Asset #`이 됩니다. 민팅 시 Core Candy Machine이 문자열 끝에 인덱스를 첨부합니다.

#### nameLength

접두사를 제외한 삽입된 각 아이템의 이름 최대 길이입니다.

예를 들어...
- `1000`개의 아이템을 포함하는 candy machine
- 각 아이템의 이름은 `Example Asset #X`이며 X는 1부터 시작하는 아이템의 인덱스

...의 경우 저장해야 할 19개의 문자가 필요합니다. "My NFT Project #"에 15개 문자와 가장 큰 숫자인 "1000"에 4개 문자입니다. `prefixName`을 사용할 때 `nameLength`는 대신 4로 줄일 수 있습니다.

#### prefixUri

가변 식별 ID를 제외한 메타데이터의 기본 URI입니다.

자산의 메타데이터 URI가 `https://example.com/metadata/0.json`이라면 기본 메타데이터 URI는 `https://example.com/metadata/`가 됩니다.

#### uriLength

`prefixUri`를 제외한 URI의 최대 길이입니다.

예를 들어...
- 20개 문자의 기본 URI ` https://arweave.net/`
- 최대 43개 문자 길이의 고유 통합자

... 접두사 없이는 저장하는 데 63개의 필수 문자가 필요합니다. `prefixUri`를 사용할 때 `uriLength`는 `https://arweave.net/`의 20개 문자만큼 줄여서 고유 식별자의 43개 문자로 줄일 수 있습니다.

#### isSequential

순차적 인덱스 생성기를 사용할지 여부를 나타냅니다. false인 경우 Candy Machine은 무작위로 민팅합니다. HiddenSettings는 항상 순차적입니다.

#### configLineSettings

다음은 `configLineSettings`를 적용하여 Core Candy Machine을 생성하는 예제입니다:

{% dialect-switcher title="configLineSettings로 Core Candy Machine 생성하기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { create } from '@metaplex-foundation/mpl-core-candy-machine'

const candyMachine = generateSigner(umi)

const coreCollection = publicKey('11111111111111111111111111111111')

const createIx = await create(umi, {
  candyMachine,
  collection: coreCollection,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 5000,
  configLineSettings: some({
    prefixName: 'Example Asset #',
    nameLength: 15,
    prefixUri: 'https://example.com/metadata/',
    uriLength: 29,
    isSequential: false,
  }),
})

await createIx.sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

### Hidden Settings

Hidden Settings는 Core Candy Machine이 모든 구매자에게 정확히 동일한 자산을 민팅할 수 있게 합니다. 이것의 설계 원칙은 인기 있는 '공개' 메커니즘이 나중에 일어날 수 있도록 하는 것입니다. 또한 Edition Guard와 결합될 때 Core Edition을 인쇄할 수 있게 합니다.

{% dialect-switcher title="Hidden Settings" %}
{% dialect title="JavaScript" id="js" %}

```ts
hiddenSettings = {
  name: string,
  uri: string,
  hash: Uint8Array,
}
```

{% /dialect %}
{% /dialect-switcher %}

#### name

Hidden Settings가 활성화된 상태에서 민팅된 모든 자산에 나타나는 이름입니다. Config Line Settings의 접두사처럼 Hidden Settings의 이름과 URI에 특수 변수를 사용할 수 있습니다. 이러한 변수들을 상기시키면:

- `$ID$`: 0부터 시작하는 민팅된 자산의 인덱스로 대체됩니다.
- `$ID+1$`: 1부터 시작하는 민팅된 자산의 인덱스로 대체됩니다.

이를 사용하여 원하는 자산을 공개된 데이터와 일치시킬 수 있어야 합니다.

#### uri

Hidden Settings가 활성화된 상태에서 민팅된 모든 자산에 나타나는 URI입니다.

#### hash

해시의 목적은 Candy Machine에서 민팅된 인덱스와 일치하는 각 업데이트/공개된 NFT가 올바른 것임을 검증하는 데이터의 암호화 해시/체크섬을 저장하는 것입니다. 이를 통해 사용자는 검증을 확인할 수 있으며 공유된 데이터를 변경했는지, 실제로 `Hidden NFT #39`가 `Revealed NFT #39`인지, 원본 데이터가 특정 사람/보유자에게 레어를 이동시키기 위해 조작되지 않았는지 확인할 수 있습니다.

{% dialect-switcher title="공개 데이터 해싱" %}
{% dialect title="JavaScript" id="js" %}

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

{% /dialect %}
{% /dialect-switcher %}

#### Hidden Settings를 사용한 Core Candy Machine 예제

{% dialect-switcher title="Hidden Settings로 Candy Machine 생성하기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { create } from '@metaplex-foundation/mpl-core-candy-machine'
import crypto from "crypto";

const candyMachine = generateSigner(umi)

const revealData = [
  { name: 'Nft #1', uri: 'http://example.com/1.json' },
  { name: 'Nft #2', uri: 'http://example.com/2.json' },
  { name: 'Nft #3', uri: 'http://example.com/3.json' },
]

const string = JSON.stringify(revealData)
const hash = crypto.createHash('sha256').update(string).digest()

const createIx = await create(umi, {
  candyMachine,
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
  sellerFeeBasisPoints: percentAmount(10),
  itemsAvailable: 5000,
  hiddenSettings: {
    name: "Hidden Asset",
    uri: "https://example.com/hidden-asset.json",
    hash,
  }
})

await createIx.sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 가드가 있는 Core Candy Machine 생성하기

`가드`가 있는 `Core Candy Machine`을 생성하려면 생성 중에 `guards:` 필드를 제공하고 Candy Machine에 적용하려는 기본 가드를 제공할 수 있습니다.

지금까지 생성한 Core Candy Machine에는 가드가 활성화되지 않았습니다. 이제 사용 가능한 모든 가드를 알았으므로 일부 가드가 활성화된 새로운 Candy Machine을 설정하는 방법을 살펴보겠습니다.

구체적인 구현은 사용하는 SDK에 따라 달라지지만(아래 참조) 주요 아이디어는 필요한 설정을 제공하여 가드를 활성화하는 것입니다. 설정되지 않은 가드는 비활성화됩니다.

{% dialect-switcher title="가드가 있는 Core Candy Machine 생성하기" %}
{% dialect title="JavaScript" id="js" %}

<!-- Umi 라이브러리를 사용하여 가드를 활성화하려면 `create` 함수에 `guards` 속성을 제공하고 활성화하려는 모든 가드의 설정을 전달하기만 하면 됩니다. `none()`으로 설정되거나 제공되지 않은 가드는 비활성화됩니다. -->

```ts
import { some, sol, dateTime } from '@metaplex-foundation/umi'

const createIx = await create(umi, {
  // ...
  guards: {
    botTax: some({ lamports: sol(0.01), lastInstruction: true }),
    solPayment: some({ lamports: sol(1.5), destination: treasury }),
    startDate: some({ date: dateTime('2023-04-04T16:00:00Z') }),
    // All other guards are disabled...
  },
})

await createIx.sendAndConfirm(umi)
```

API 참조: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [DefaultGuardSetArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}