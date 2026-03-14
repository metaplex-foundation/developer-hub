---
title: Core Candy Machine 생성하기
metaTitle: Core Candy Machine 생성하기 | Core Candy Machine
description: Config Line Settings, Hidden Settings, 가드를 포함한 구성 가능한 설정으로 Solana에서 Core Candy Machine을 생성하는 단계별 튜토리얼입니다. mpl-core-candy-machine SDK를 사용합니다.
keywords:
  - core candy machine
  - create candy machine
  - mpl-core-candy-machine
  - candy machine settings
  - config line settings
  - hidden settings
  - candy machine guards
  - solana NFT minting
  - metaplex core
  - NFT collection launch
  - candy machine reveal
  - solana NFT distribution
about:
  - Creating and configuring a Core Candy Machine for NFT distribution
  - Core Candy Machine item settings including Config Line and Hidden Settings
  - Applying guards to a Core Candy Machine during creation
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
howToSteps:
  - Candy Machine을 위한 자산과 Core Collection을 준비
  - Candy Machine 서명자, 컬렉션, itemsAvailable과 함께 create 지시를 호출
  - 선택적으로 자산 데이터 저장을 위한 Config Line Settings 또는 Hidden Settings 구성
  - 선택적으로 민팅 접근 및 결제를 제어하기 위한 가드 연결
howToTools:
  - '@metaplex-foundation/mpl-core-candy-machine'
  - '@metaplex-foundation/umi'
faqs:
  - q: Config Line Settings와 Hidden Settings의 차이점은 무엇인가요?
    a: Config Line Settings는 접두사 압축으로 개별 자산 이름과 URI를 온체인에 저장하여 임대 비용을 절감합니다. Hidden Settings는 모든 구매자에게 동일한 플레이스홀더 자산을 민팅하여 나중에 공개 메커니즘을 가능하게 합니다. Candy Machine당 하나만 사용할 수 있습니다 — 상호 배타적입니다.
  - q: Core Candy Machine을 생성하는 데 비용이 얼마나 드나요?
    a: 임대 비용은 아이템 수와 저장 모드에 따라 달라집니다. 접두사가 있는 Config Line Settings를 사용하면 반복되는 이름과 URI 접두사가 한 번만 저장되므로 임대료가 크게 줄어듭니다. Hidden Settings는 컬렉션 크기에 관계없이 단일 이름, URI, 해시만 저장되므로 가장 저렴한 옵션입니다.
  - q: Core Candy Machine 생성 후에 가드를 추가할 수 있나요?
    a: 네. Candy Guard 계정을 생성하고 기존 Core Candy Machine의 민팅 권한으로 설정할 수 있습니다. 편의를 위해 생성 시 가드를 직접 전달할 수도 있습니다.
  - q: Candy Machine 생성 전에 기존 Core Collection이 필요한가요?
    a: 네. Core Candy Machine은 생성 시 Core Collection 주소가 필요합니다. 컬렉션 업데이트 권한이 트랜잭션에 서명해야 Candy Machine이 민팅된 자산을 컬렉션에 검증하기 위한 위임자로 승인될 수 있습니다.
  - q: Config Line Settings에서 isSequential을 false로 설정하면 어떻게 되나요?
    a: Candy Machine은 순차적이 아닌 의사 무작위 순서로 자산을 민팅합니다. 이 무작위성은 암호학적으로 안전하지 않으며 충분한 자원으로 영향을 받을 수 있으므로 예측 불가능성이 중요할 때는 Hidden Settings가 더 적합할 수 있습니다.
---

## 요약

`create` 지시는 Solana에 새로운 [Core](/ko/smart-contracts/core) Candy Machine 계정을 초기화하고, Core Collection에 연결하며, 자산이 어떻게 저장되고 배포되는지를 정의합니다. {% .lead %}

- **핵심 지시**: `@metaplex-foundation/mpl-core-candy-machine`의 `create`가 새 Candy Machine 계정을 배포
- **저장 모드**: 접두사 압축된 개별 자산 데이터를 위한 [Config Line Settings](#config-line-settings)와 단일 공개 플레이스홀더를 위한 [Hidden Settings](#hidden-settings) 중 선택
- **가드 지원**: 생성 시 [가드](/ko/smart-contracts/core-candy-machine/guards)를 연결하여 민팅 접근, 결제, 스케줄링을 제어
- **전제 조건**: Candy Machine을 생성하기 전에 [Core Collection](/ko/smart-contracts/core/collections#creating-a-collection)이 존재해야 함

**바로가기:** [전제 조건](#전제-조건) · [Candy Machine 생성](#candy-machine-생성하기) · [생성 인수](#생성-인수) · [Config Line Settings](#config-line-settings) · [Hidden Settings](#hidden-settings) · [가드와 함께 생성](#가드가-있는-core-candy-machine-생성하기) · [참고 사항](#참고-사항) · [FAQ](#faq)


## 전제 조건

- [자산 준비](/ko/smart-contracts/core-candy-machine/preparing-assets)
- [Core 컬렉션 생성](/ko/smart-contracts/core/collections#creating-a-collection)

Core Candy Machine 자산을 컬렉션(신규 또는 기존)으로 생성하려면 Core Candy Machine 생성 시 Core 컬렉션을 제공해야 합니다.

## Candy Machine 생성하기

`create` 함수는 새 Core Candy Machine 계정을 배포하고, [Core](/ko/smart-contracts/core) Collection에 할당하며, 민팅 가능한 총 아이템 수를 설정합니다.

{% callout title="CLI 대안" type="note" %}
인터랙티브 위자드를 사용하여 MPLX CLI로 Core Candy Machine을 생성할 수도 있습니다:
```bash
mplx cm create --wizard
```
단계별 안내, 자산 검증, 자동 배포를 제공합니다. 자세한 지침은 [CLI Candy Machine 문서](/ko/dev-tools/cli/cm)를 참조하세요.
{% /callout %}

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

### 생성 인수

`create` 함수는 배포 시 Core Candy Machine을 구성하기 위해 다음 인수를 받습니다.

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

### authorityPda 필드

`authorityPda`는 민팅된 자산을 컬렉션에 검증하는 데 사용되는 PDA입니다. 이 필드는 선택사항이며 생략되면 기본 시드에서 자동으로 계산됩니다.

{% dialect-switcher title="Authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
authorityPda: string
```

{% /dialect %}
{% /dialect-switcher %}

### authority 필드

`authority`는 설정 업데이트 및 [가드](/ko/smart-contracts/core-candy-machine/guards) 관리를 포함하여 Core Candy Machine에 대한 관리 제어 권한을 가질 지갑 또는 공개키입니다.

{% dialect-switcher title="authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
authority: string
```

{% /dialect %}
{% /dialect-switcher %}

### payer 필드

`payer`는 트랜잭션과 임대 비용을 지불하는 지갑입니다. 생략되면 현재 서명자가 기본값입니다.

{% dialect-switcher title="authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
payer: publicKey
```

{% /dialect %}
{% /dialect-switcher %}

### collection 필드

`collection`은 Candy Machine이 자산을 민팅할 [Core Collection](/ko/smart-contracts/core/collections#creating-a-collection)의 공개키입니다.

{% dialect-switcher title="authority" %}
{% dialect title="JavaScript" id="js" %}

```ts
collection: publicKey
```

{% /dialect %}
{% /dialect-switcher %}

### collectionUpdateAuthority 필드

`collectionUpdateAuthority`는 컬렉션의 업데이트 권한입니다. Candy Machine이 생성된 자산을 컬렉션에 검증하기 위해 위임자를 승인할 수 있도록 서명자여야 합니다.

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

### itemsAvailable 필드

`itemsAvailable` 필드는 Core Candy Machine에서 민팅할 수 있는 총 자산 수를 지정합니다. 이 값은 생성 시 설정되며 Candy Machine 계정의 크기를 결정합니다.

{% dialect-switcher title="itemsAvailable" %}
{% dialect title="JavaScript" id="js" %}

```ts
itemsAvailable: number
```

{% /dialect %}
{% /dialect-switcher %}

### isMutable 필드

`isMutable` 필드는 민팅된 자산이 생성 후 업데이트될 수 있는지 여부를 결정하는 부울값입니다. `false`로 설정하면 자산 메타데이터가 민팅 시 영구적으로 잠깁니다.

{% dialect-switcher title="isMutable" %}
{% dialect title="JavaScript" id="js" %}

```ts
isMutable: boolean
```

{% /dialect %}
{% /dialect-switcher %}

### Config Line Settings

Config Line Settings는 접두사 압축을 사용하여 개별 자산 이름과 URI를 온체인에 저장하며, 모든 자산에 대해 전체 문자열을 저장하는 것보다 Candy Machine의 임대 비용을 크게 줄입니다.

{% callout type="note" title="무작위성" %}

Config Line Settings와 [Hidden Settings](#hidden-settings)는 상호 배타적입니다. 한 번에 하나만 사용할 수 있습니다.

자산의 "무작위" 민팅 프로세스는 완전히 예측할 수 없는 것은 아니며 충분한 자원과 악의적인 의도에 의해 영향을 받을 수 있으므로 공개 메커니즘에 Hidden Settings를 활용하는 것이 권장될 수 있습니다.

{% /callout %}

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

#### prefixName 필드

`prefixName`은 자산의 이름 접두사를 저장하고 민팅 시 이름 끝에 민팅된 인덱스를 추가합니다.

자산의 이름 구조가 `Example Asset #1`이라면 접두사는 `Example Asset #`이 됩니다. 민팅 시 Core Candy Machine이 문자열 끝에 인덱스를 첨부합니다.

#### nameLength 필드

`nameLength`는 이름 접두사를 제외한 삽입된 각 아이템의 이름 최대 길이입니다.

예를 들어...
- `1000`개의 아이템을 포함하는 candy machine
- 각 아이템의 이름은 `Example Asset #X`이며 X는 1부터 시작하는 아이템의 인덱스

...의 경우 저장해야 할 19개의 문자가 필요합니다. "My NFT Project #"에 15개 문자와 가장 큰 숫자인 "1000"에 4개 문자입니다. `prefixName`을 사용할 때 `nameLength`는 대신 4로 줄일 수 있습니다.

#### prefixUri 필드

`prefixUri`는 가변 식별 ID를 제외한 메타데이터의 기본 URI입니다.

자산의 메타데이터 URI가 `https://example.com/metadata/0.json`이라면 기본 메타데이터 URI는 `https://example.com/metadata/`가 됩니다.

#### uriLength 필드

`uriLength`는 `prefixUri`를 제외한 URI의 최대 길이입니다.

예를 들어...
- 20개 문자의 기본 URI `https://arweave.net/`
- 최대 43개 문자 길이의 고유 통합자

... 접두사 없이는 저장하는 데 63개의 필수 문자가 필요합니다. `prefixUri`를 사용할 때 `uriLength`는 `https://arweave.net/`의 20개 문자만큼 줄여서 고유 식별자의 43개 문자로 줄일 수 있습니다.

#### isSequential 필드

`isSequential` 필드는 자산이 순차적 순서로 민팅되는지 의사 무작위로 민팅되는지를 나타냅니다. `false`로 설정하면 Candy Machine이 의사 무작위 순서로 민팅합니다. [Hidden Settings](#hidden-settings)는 이 필드에 관계없이 항상 순차적으로 민팅합니다.

#### Config Line Settings 예제

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

Hidden Settings는 Core Candy Machine이 모든 구매자에게 동일한 플레이스홀더 자산을 민팅할 수 있게 하여, 최종 메타데이터가 나중에 할당되는 인기 있는 "공개" 메커니즘을 가능하게 합니다. Edition Guard와 결합하면 [Core](/ko/smart-contracts/core) Edition 인쇄도 지원합니다.

{% callout type="note" %}
[Config Line Settings](#config-line-settings)와 Hidden Settings는 상호 배타적입니다. Candy Machine 생성 시 둘 중 하나를 선택해야 합니다.
{% /callout %}

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

#### Hidden Settings name 필드

`name`은 Hidden Settings가 활성화된 상태에서 민팅된 모든 자산에 나타나는 이름입니다. Config Line Settings의 접두사처럼 Hidden Settings의 이름과 URI에 특수 변수를 사용할 수 있습니다. 이러한 변수들은:

- `$ID$`: 0부터 시작하는 민팅된 자산의 인덱스로 대체됩니다.
- `$ID+1$`: 1부터 시작하는 민팅된 자산의 인덱스로 대체됩니다.

이를 사용하여 원하는 자산을 공개된 데이터와 일치시킬 수 있어야 합니다.

#### Hidden Settings uri 필드

`uri`는 Hidden Settings가 활성화된 상태에서 민팅된 모든 자산에 나타나는 메타데이터 URI입니다. 일반적으로 공유 플레이스홀더 JSON 파일을 가리킵니다.

#### Hidden Settings hash 필드

`hash`는 공개 데이터의 암호화 해시/체크섬을 저장하여, 최종 공개된 메타데이터가 원래 커밋된 순서와 일치하는지 누구나 검증할 수 있게 합니다. 이를 통해 민팅 후 희귀 자산을 특정 보유자에게 재배치하는 등의 변조를 방지합니다.

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

#### Hidden Settings 생성 예제

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

`create` 함수는 생성 시 [가드](/ko/smart-contracts/core-candy-machine/guards) 규칙을 직접 연결하는 `guards` 필드를 받아, 누가 민팅할 수 있는지, 언제, 어떤 비용으로 민팅하는지를 제어합니다.

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

## 참고 사항

- **Config Line Settings와 Hidden Settings는 상호 배타적입니다.** 둘 중 하나를 선택해야 합니다. 둘 다 `create` 지시에 전달하면 오류가 발생합니다.
- **임대 비용은 아이템 수와 저장 모드에 따라 달라집니다.** 짧은 접두사가 있는 Config Line Settings는 전체 이름과 URI를 저장하는 것보다 저렴합니다. Hidden Settings는 단일 이름, URI, 해시만 저장되므로 가장 저렴한 옵션입니다.
- **컬렉션 업데이트 권한이 서명자여야 합니다.** Candy Machine이 컬렉션에서 검증된 위임자로 승인되려면 컬렉션 업데이트 권한이 생성 트랜잭션에 서명해야 합니다.
- **의사 무작위 민팅 순서는 암호학적으로 안전하지 않습니다.** Config Line Settings에서 `isSequential`이 `false`로 설정되면 민팅 순서가 셔플되지만 충분한 자원으로 예측하거나 영향을 받을 수 있습니다. 예측 불가능성이 중요할 때는 공개 메커니즘과 함께 Hidden Settings를 사용하세요.
- **이 페이지는 레거시 Candy Machine V3가 아닌 Core Candy Machine을 다룹니다.** Core Candy Machine은 [Core](/ko/smart-contracts/core) 자산을 민팅합니다. Metaplex Token Metadata NFT를 민팅하려면 [Candy Machine V3](/ko/smart-contracts/candy-machine)를 참조하세요.

## FAQ

### Config Line Settings와 Hidden Settings의 차이점은 무엇인가요?

[Config Line Settings](#config-line-settings)는 접두사 압축을 사용하여 개별 자산 이름과 URI를 온체인에 저장하여 임대료를 절감합니다. [Hidden Settings](#hidden-settings)는 모든 구매자에게 동일한 플레이스홀더 자산을 민팅하여 나중에 공개 메커니즘을 가능하게 합니다. Candy Machine당 하나만 사용할 수 있습니다 — 상호 배타적입니다.

### Core Candy Machine을 생성하는 데 비용이 얼마나 드나요?

임대 비용은 아이템 수와 선택한 저장 모드에 따라 달라집니다. 짧은 접두사가 있는 Config Line Settings는 반복되는 접두사가 한 번만 저장되므로 임대료를 크게 줄입니다. Hidden Settings는 Candy Machine이 보유한 아이템 수에 관계없이 단일 이름, URI, SHA-256 해시만 저장되므로 가장 저렴합니다.

### Core Candy Machine 생성 후에 가드를 추가할 수 있나요?

네. 별도의 Candy Guard 계정을 생성하고 기존 Core Candy Machine의 민팅 권한으로 설정할 수 있습니다. 또는 편의를 위해 `create` 지시에 [가드](/ko/smart-contracts/core-candy-machine/guards)를 직접 전달할 수 있습니다.

### Candy Machine 생성 전에 기존 Core Collection이 필요한가요?

네. `create` 지시에는 [Core Collection](/ko/smart-contracts/core/collections#creating-a-collection) 주소가 필요합니다. 컬렉션 업데이트 권한이 트랜잭션에 서명해야 Candy Machine이 민팅된 자산을 컬렉션에 추가하는 검증된 위임자로 등록될 수 있습니다.

### Config Line Settings에서 isSequential을 false로 설정하면 어떻게 되나요?

Candy Machine은 인덱스 순서가 아닌 의사 무작위 순서로 자산을 민팅합니다. 이 무작위성은 암호학적으로 안전하지 않으며 충분한 자원으로 영향을 받을 수 있습니다. 예측 불가능성이 중요할 때는 공개 메커니즘과 함께 [Hidden Settings](#hidden-settings)를 사용하세요.
