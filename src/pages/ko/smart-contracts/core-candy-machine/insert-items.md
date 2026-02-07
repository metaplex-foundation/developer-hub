---
title: 아이템 삽입하기
metaTitle: 아이템 삽입하기 | Core Candy Machine
description: Core NFT 자산을 Core Candy Machine에 로드하는 방법입니다.
---

이제 모든 아이템의 이름과 URI를 준비했으므로 Core Candy Machine 계정에 삽입하기만 하면 됩니다.

이는 프로세스의 중요한 부분이며, Config Line Settings를 사용할 때 **모든 아이템이 삽입될 때까지 민팅이 허용되지 않습니다**.

삽입된 각 아이템의 이름과 URI는 Config Line Settings의 **Name Length**와 **URI Length** 속성에 의해 각각 제약된다는 점에 유의하세요.

또한 트랜잭션이 특정 크기로 제한되므로 동일한 트랜잭션 내에서 수천 개의 아이템을 삽입할 수 없습니다. 트랜잭션당 삽입할 수 있는 아이템 수는 Config Line Settings에 정의된 **Name Length**와 **URI Length** 속성에 따라 달라집니다. 이름과 URI가 짧을수록 트랜잭션에 더 많이 담을 수 있습니다.

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

이름 및/또는 URI 접두사를 사용할 때는 접두사 다음에 오는 부분만 삽입하면 됩니다.

접두사를 사용하면 Name Length와 URI Length를 상당히 줄일 수 있으므로 트랜잭션당 훨씬 더 많은 아이템을 담을 수 있어야 합니다.

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

아이템을 삽입할 때 이러한 아이템이 삽입되어야 하는 위치를 제공할 수 있습니다. 이를 통해 원하는 순서대로 아이템을 삽입할 수 있을 뿐만 아니라 이미 삽입된 아이템을 업데이트할 수도 있습니다.

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

## 결론

이와 같이, 자산을 민팅할 준비가 된 로드된 Core Candy Machine을 갖게 되었습니다! 그러나 민팅 프로세스에 대한 요구사항을 생성하지 않았습니다. 민팅 가격을 어떻게 구성할 수 있을까요? 구매자가 특정 토큰이나 특정 컬렉션의 자산 보유자인지 어떻게 보장할 수 있을까요? 민팅의 시작 날짜를 어떻게 설정할 수 있을까요? 종료 조건은 어떨까요?
