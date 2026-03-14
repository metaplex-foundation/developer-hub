---
title: Core Candy Machine에 아이템 삽입하기
metaTitle: 아이템 삽입하기 | Core Candy Machine
description: 일괄 삽입, 접두사 최적화, 이전에 로드된 아이템 덮어쓰기를 포함하여 Core Candy Machine에 config line 아이템을 삽입하는 방법을 알아보세요.
keywords:
  - core candy machine
  - insert items
  - config lines
  - addConfigLines
  - candy machine loading
  - NFT minting setup
  - batch insert
  - prefix name
  - prefix URI
  - candy machine items
  - mpl-core-candy-machine
  - Metaplex
  - Solana NFT
about:
  - Core Candy Machine item insertion
  - Config line management for NFT minting
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
faqs:
  - q: Core Candy Machine에서 트랜잭션당 몇 개의 아이템을 삽입할 수 있나요?
    a: 트랜잭션당 아이템 수는 Config Line Settings의 Name Length와 URI Length 값에 따라 달라집니다. Solana 트랜잭션에는 크기 제한이 있으므로 이름과 URI가 짧을수록 트랜잭션당 더 많은 아이템을 넣을 수 있습니다. 접두사를 사용하면 이러한 길이가 크게 줄어들어 호출당 더 많은 아이템을 넣을 수 있습니다.
  - q: 이미 삽입된 아이템을 업데이트하거나 덮어쓸 수 있나요?
    a: 네. addConfigLines 함수는 아이템이 기록되는 위치를 제어하는 index 매개변수를 받습니다. 이전에 삽입된 아이템의 인덱스를 지정하면 해당 슬롯을 새 데이터로 덮어씁니다. 이는 아직 민팅되지 않은 모든 아이템에 대해 작동합니다.
  - q: 민팅이 시작되기 전에 모든 아이템을 삽입해야 하나요?
    a: 네. Config Line Settings를 사용할 때 Core Candy Machine은 모든 슬롯(itemsAvailable까지)에 config line이 포함되어야 민팅 트랜잭션이 허용됩니다.
  - q: 접두사를 사용하는 것과 사용하지 않는 아이템 삽입의 차이점은 무엇인가요?
    a: 접두사 없이는 각 아이템의 전체 이름과 URI를 저장합니다. 접두사를 사용하면 Core Candy Machine이 공유 접두사를 한 번 저장하고 각 아이템에 대해 고유한 접미사만 삽입합니다. 이렇게 하면 온체인 저장소가 줄어들고 임대 비용이 낮아지며 트랜잭션당 더 많은 아이템을 넣을 수 있습니다.
---

## 요약

`addConfigLines` 지시는 각 슬롯이 고유한 Core NFT Asset으로 민팅될 준비가 되도록 이름과 URI 데이터를 [Core Candy Machine](/ko/smart-contracts/core-candy-machine)에 로드합니다.

- `addConfigLines`를 사용하여 지정된 인덱스에 하나 이상의 config line을 삽입
- [Config Line Settings](/ko/smart-contracts/core-candy-machine/create#config-line-settings) 접두사로 배치 크기를 최적화하여 트랜잭션당 더 많은 아이템 삽입
- 인덱스 위치를 지정하여 이전에 삽입된 아이템을 덮어쓰기
- 민팅이 허용되기 전에 모든 아이템이 삽입되어야 함

## Core Candy Machine에 아이템 로드하기

`addConfigLines` 지시는 이름과 URI 쌍을 온체인 계정에 기록하여 [Core Candy Machine](/ko/smart-contracts/core-candy-machine)이 민팅 시 할당할 메타데이터를 알 수 있게 합니다. 각 아이템은 머신의 [Config Line Settings](/ko/smart-contracts/core-candy-machine/create#config-line-settings)에 정의된 **Name Length**와 **URI Length** 제약 조건을 준수해야 합니다.

Solana 트랜잭션에는 크기 제한이 있으므로 단일 트랜잭션에서 수천 개의 아이템을 삽입할 수 없습니다. 호출당 포함할 수 있는 아이템 수는 각 이름과 URI 문자열의 길이에 따라 달라집니다. 문자열이 짧을수록 트랜잭션당 더 많은 아이템을 넣을 수 있습니다.

{% callout type="note" %}
Config Line Settings를 사용할 때 **모든 아이템이 삽입될 때까지 민팅이 허용되지 않습니다**. [가드](/ko/smart-contracts/core-candy-machine/guards)를 추가하거나 민팅을 열기 전에 `itemsLoaded`가 `itemsAvailable`과 같은지 확인하세요.
{% /callout %}

{% callout title="CLI 대안" type="note" %}
MPLX CLI를 사용하여 아이템을 삽입할 수도 있으며, 배치 처리가 자동으로 이루어집니다:
```bash
mplx cm insert
```
CLI는 스마트 로딩 감지, 진행 상황 추적, 최적 배치 크기 조정을 제공합니다. 자세한 내용은 [CLI insert 명령어 문서](/ko/dev-tools/cli/cm/insert)를 참조하세요.
{% /callout %}

{% dialect-switcher title="config line 추가하기" %}
{% dialect title="JavaScript" id="js" %}

Umi 라이브러리를 사용할 때 `addConfigLines` 함수를 사용하여 Core Candy Machine에 아이템을 삽입할 수 있습니다. 추가할 config line과 삽입하려는 인덱스가 필요합니다.

```ts
await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: 0,
  configLines: [
    { name: 'My NFT #1', uri: 'https://example.com/nft1.json' },
    { name: 'My NFT #2', uri: 'https://example.com/nft2.json' },
  ],
}).sendAndConfirm(umi)
```

현재 로드된 아이템의 끝에 아이템을 간단히 추가하려면 다음과 같이 인덱스로 `candyMachine.itemsLoaded` 속성을 사용할 수 있습니다.

```ts
await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: candyMachine.itemsLoaded,
  configLines: [
    { name: 'My NFT #3', uri: 'https://example.com/nft3.json' },
    { name: 'My NFT #4', uri: 'https://example.com/nft4.json' },
    { name: 'My NFT #5', uri: 'https://example.com/nft5.json' },
  ],
}).sendAndConfirm(umi)
```

API 참조: [addConfigLines](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/addConfigLines.html)

{% /dialect %}
{% /dialect-switcher %}

## 접두사를 사용하여 아이템 삽입하기

접두사 기반 삽입은 공유 접두사가 이미 [Config Line Settings](/ko/smart-contracts/core-candy-machine/create#config-line-settings)에 저장되어 있으므로 각 이름과 URI의 고유한 접미사만 저장합니다. 이를 통해 아이템당 데이터 크기가 크게 줄어들어 각 트랜잭션에 훨씬 더 많은 아이템을 넣을 수 있습니다.

{% dialect-switcher title="주어진 인덱스에서 config line 추가하기" %}
{% dialect title="JavaScript" id="js" %}

접두사를 사용하는 Core Candy Machine에 config line을 추가할 때는 `addConfigLines` 함수를 사용할 때 접두사 다음에 오는 이름과 URI의 부분만 제공하면 됩니다.

예를 들어, 다음과 같은 config line 설정을 가진 Core Candy Machine이 있다고 가정해보세요.

```ts
await create(umi, {
  // ...
  configLineSettings: some({
    prefixName: 'My Asset #',
    nameLength: 4,
    prefixUri: 'https://example.com/nft',
    uriLength: 9,
    isSequential: false,
  }),
}).sendAndConfirm(umi)
```

그러면 다음과 같이 config line을 삽입할 수 있습니다.

```ts
await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: candyMachine.itemsLoaded,
  configLines: [
    { name: '1', uri: '1.json' },
    { name: '2', uri: '2.json' },
    { name: '3', uri: '3.json' },
  ],
}).sendAndConfirm(umi)
```

API 참조: [addConfigLines](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/addConfigLines.html)

{% /dialect %}
{% /dialect-switcher %}

## 기존 아이템 덮어쓰기

`addConfigLines` 지시를 사용하면 교체하려는 슬롯의 인덱스를 지정하여 이전에 삽입된 아이템을 덮어쓸 수 있습니다. 이는 메타데이터 오류를 수정하거나 민팅 시작 전에 아이템을 교체하는 데 유용합니다.

{% dialect-switcher title="config line 덮어쓰기" %}
{% dialect title="JavaScript" id="js" %}

다음 예제는 3개의 아이템을 삽입하고 나중에 두 번째 삽입된 아이템을 업데이트하는 방법을 보여줍니다.

```ts
await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: 0,
  configLines: [
    { name: 'My Asset #1', uri: 'https://example.com/nft1.json' },
    { name: 'My Asset #2', uri: 'https://example.com/nft2.json' },
    { name: 'My Asset #3', uri: 'https://example.com/nft3.json' },
  ],
}).sendAndConfirm(umi)

await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: 1,
  configLines: [{ name: 'My Asset #X', uri: 'https://example.com/nftX.json' }],
}).sendAndConfirm(umi)

candyMachine = await fetchCandyMachine(candyMachine.publicKey)
candyMachine.items[0].name // "My Asset #1"
candyMachine.items[1].name // "My Asset #X"
candyMachine.items[2].name // "My Asset #3"
```

API 참조: [addConfigLines](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/addConfigLines.html)

{% /dialect %}
{% /dialect-switcher %}

## 아이템 삽입 후 다음 단계

모든 아이템이 로드되면(`itemsLoaded`가 `itemsAvailable`과 같으면), Core Candy Machine은 민팅 구성 준비가 완료됩니다. 다음 단계는 누가 민팅할 수 있는지, 민팅이 언제 열리는지, 어떤 결제가 필요한지, 런칭에 필요한 기타 접근 조건을 제어하는 [가드](/ko/smart-contracts/core-candy-machine/guards)를 설정하는 것입니다.

## 참고 사항

- **트랜잭션 크기 제한**: Solana 트랜잭션은 1232바이트로 제한됩니다. 트랜잭션당 삽입할 수 있는 config line 수는 Config Line Settings의 Name Length와 URI Length 값의 합에 직접적으로 달라집니다.
- **Name Length와 URI Length 제약**: 삽입된 각 아이템의 이름(접두사 제외)은 `nameLength` 값을 초과해서는 안 되며, 각 URI(접두사 제외)는 생성 시 정의된 `uriLength` 값을 초과해서는 안 됩니다. 이 제한을 초과하면 트랜잭션이 실패합니다.
- **민팅 전 모든 아이템 로드 필요**: Core Candy Machine 프로그램은 인덱스 0부터 `itemsAvailable - 1`까지 모든 슬롯이 config line으로 채워질 때까지 민팅 지시를 거부합니다.
- **접두사는 저장 비용을 줄입니다**: `prefixName`과 `prefixUri`를 사용하면 공유 문자열 부분이 모든 아이템에 대해 반복되는 대신 온체인에 한 번만 저장되어 Candy Machine 계정의 임대 비용이 줄어듭니다.
- **덮어쓰기는 민팅 전에만 가능**: 아직 민팅되지 않은 config line은 덮어쓸 수 있습니다. 아이템이 민팅되면 온체인 데이터가 확정됩니다.

## FAQ

### Core Candy Machine에서 트랜잭션당 몇 개의 아이템을 삽입할 수 있나요?

트랜잭션당 아이템 수는 [Config Line Settings](/ko/smart-contracts/core-candy-machine/create#config-line-settings)의 **Name Length**와 **URI Length** 값에 따라 달라집니다. Solana 트랜잭션은 1232바이트의 크기 제한이 있으므로 이름과 URI가 짧을수록 트랜잭션당 더 많은 아이템을 넣을 수 있습니다. 접두사를 사용하면 이러한 길이가 크게 줄어들어 호출당 더 많은 아이템을 넣을 수 있습니다.

### 이미 삽입된 아이템을 업데이트하거나 덮어쓸 수 있나요?

네. `addConfigLines` 함수는 아이템이 기록되는 위치를 제어하는 `index` 매개변수를 받습니다. 이전에 삽입된 아이템의 인덱스를 지정하면 해당 슬롯을 새 데이터로 덮어씁니다. 이는 아직 민팅되지 않은 모든 아이템에 대해 작동합니다.

### 민팅이 시작되기 전에 모든 아이템을 삽입해야 하나요?

네. Config Line Settings를 사용할 때 Core Candy Machine은 모든 슬롯(`itemsAvailable`까지)에 config line이 포함되어야 민팅 트랜잭션이 허용됩니다.

### 접두사를 사용하는 것과 사용하지 않는 아이템 삽입의 차이점은 무엇인가요?

접두사 없이는 각 아이템의 전체 이름과 URI를 저장합니다. 접두사를 사용하면 Core Candy Machine이 공유 접두사를 한 번 저장하고 각 아이템에 대해 고유한 접미사만 삽입합니다. 이렇게 하면 온체인 저장소가 줄어들고 임대 비용이 낮아지며 트랜잭션당 더 많은 아이템을 넣을 수 있습니다.

