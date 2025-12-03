---
title: 아이템 삽입
metaTitle: 아이템 삽입 | Candy Machine
description: Candy Machine에 아이템을 로드하는 방법을 설명합니다.
---

지금까지 Candy Machine을 생성하고 구성하는 방법을 배웠지만 NFT로 민팅할 수 있는 아이템을 내부에 삽입하는 방법을 보지 못했습니다. 따라서 이 페이지에서 이를 다루어보겠습니다. {% .lead %}

**아이템 삽입은 [구성 라인 설정](/ko/candy-machine/settings#config-line-settings)을 사용하는 Candy Machine에만 적용됩니다**라는 점을 기억하는 것이 중요합니다. 이는 [숨겨진 설정](/ko/candy-machine/settings#hidden-settings)을 사용하는 Candy Machine에서 민팅된 NFT가 모두 동일한 "숨겨진" 이름과 URI를 공유하기 때문입니다.

## JSON 메타데이터 업로드

Candy Machine에 아이템을 삽입하려면 각 아이템에 대해 다음 두 매개변수가 필요합니다:

- **이름**: 이 아이템에서 민팅될 NFT의 이름. 구성 라인 설정에서 이름 접두사가 제공된 경우 해당 접두사 뒤에 오는 이름 부분만 제공해야 합니다.
- **URI**: 이 아이템에서 민팅될 NFT의 JSON 메타데이터를 가리키는 URI. 여기서도 구성 라인 설정에서 제공되었을 수 있는 URI 접두사는 제외됩니다.

아이템에 대한 URI가 없는 경우 먼저 JSON 메타데이터를 하나씩 업로드해야 합니다. 이는 AWS나 자체 서버와 같은 오프체인 솔루션이나 Arweave나 IPFS와 같은 온체인 솔루션을 사용할 수 있습니다.

테스트를 위한 예시 자산은 이 [Github 저장소](https://github.com/metaplex-foundation/example-candy-machine-assets)에서 찾을 수 있습니다.

다행히 우리의 SDK가 도움을 줄 수 있습니다. JSON 객체를 업로드하고 해당 URI를 검색할 수 있게 해줍니다.

또한 [Sugar](/ko/candy-machine/sugar)와 같은 도구는 병렬 업로드, 프로세스 캐싱 및 실패한 업로드 재시도를 통해 JSON 메타데이터 업로드를 아주 쉽게 만들어 줍니다.

{% dialect-switcher title="아이템 업로드" %}
{% dialect title="JavaScript" id="js" %}

Umi는 선택한 스토리지 제공업체에 JSON 데이터를 업로드하는 데 사용할 수 있는 `uploader` 인터페이스를 제공합니다. 예를 들어, 다음은 업로더 인터페이스의 NFT.Storage 구현을 선택하는 방법입니다.

```ts
import { nftStorage } from '@metaplex-foundation/umi-uploader-nft-storage'
umi.use(nftStorageUploader({ token: 'YOUR_API_TOKEN' }))
```

그런 다음 `uploader` 인터페이스의 `upload` 및 `uploadJson` 메서드를 사용하여 자산과 해당 JSON 메타데이터를 업로드할 수 있습니다.

```ts
import { createGenericFileFromBrowserFile } from '@metaplex-foundation/umi'

// 자산 업로드.
const file = await createGenericFileFromBrowserFile(event.target.files[0])
const [fileUri] = await umi.uploader.upload([file])

// JSON 메타데이터 업로드.
const uri = await umi.uploader.uploadJson({
  name: 'My NFT #1',
  description: 'My description',
  image: fileUri,
})
```

API 참조: [UploaderInterface](https://umi.typedoc.metaplex.com/interfaces/umi.UploaderInterface.html), [createGenericFileFromBrowserFile](https://umi.typedoc.metaplex.com/functions/umi.createGenericFileFromBrowserFile.html).

{% /dialect %}
{% /dialect-switcher %}

## 아이템 삽입

이제 모든 아이템의 이름과 URI가 있으므로 Candy Machine 계정에 삽입하기만 하면 됩니다.

이는 프로세스의 중요한 부분이며, 구성 라인 설정을 사용할 때 **모든 아이템이 삽입될 때까지 민팅이 허용되지 않습니다**.

삽입된 각 아이템의 이름과 URI는 각각 구성 라인 설정의 **이름 길이** 및 **URI 길이** 속성에 의해 제약을 받는다는 점에 주목하세요.

또한 트랜잭션이 특정 크기로 제한되기 때문에 동일한 트랜잭션 내에서 수천 개의 아이템을 삽입할 수 없습니다. 트랜잭션당 삽입할 수 있는 아이템의 수는 구성 라인 설정에서 정의된 **이름 길이** 및 **URI 길이** 속성에 따라 달라집니다. 이름과 URI가 짧을수록 트랜잭션에 더 많이 넣을 수 있습니다.

{% dialect-switcher title="구성 라인 추가" %}
{% dialect title="JavaScript" id="js" %}

Umi 라이브러리를 사용할 때 `addConfigLines` 함수를 사용하여 Candy Machine에 아이템을 삽입할 수 있습니다. 추가할 구성 라인과 삽입하려는 인덱스가 필요합니다.

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

현재 로드된 아이템의 끝에 아이템을 간단히 추가하려면 다음과 같이 `candyMachine.itemsLoaded` 속성을 인덱스로 사용할 수 있습니다.

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

API 참조: [addConfigLines](https://mpl-candy-machine.typedoc.metaplex.com/functions/addConfigLines.html)

{% /dialect %}
{% /dialect-switcher %}

## 접두사를 사용한 아이템 삽입

이름 및/또는 URI 접두사를 사용할 때는 해당 접두사 뒤에 오는 부분만 삽입하면 됩니다.

접두사를 사용하면 이름 길이와 URI 길이를 크게 줄일 수 있으므로 트랜잭션당 훨씬 더 많은 아이템을 넣는 데 도움이 됩니다.

{% dialect-switcher title="주어진 인덱스에서 구성 라인 추가" %}
{% dialect title="JavaScript" id="js" %}

접두사를 사용하는 Candy Machine에 구성 라인을 추가할 때 `addConfigLines` 함수를 사용할 때 접두사 뒤에 오는 이름과 URI 부분만 제공하면 됩니다.

예를 들어, 다음과 같은 구성 라인 설정이 있는 Candy Machine이 있다고 가정해보세요.

```ts
await create(umi, {
  // ...
  configLineSettings: some({
    prefixName: 'My NFT #',
    nameLength: 4,
    prefixUri: 'https://example.com/nft',
    uriLength: 9,
    isSequential: false,
  }),
}).sendAndConfirm(umi)
```

그러면 다음과 같이 구성 라인을 삽입할 수 있습니다.

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

API 참조: [addConfigLines](https://mpl-candy-machine.typedoc.metaplex.com/functions/addConfigLines.html)

{% /dialect %}
{% /dialect-switcher %}

## 기존 아이템 재정의

아이템을 삽입할 때 해당 아이템을 삽입할 위치를 제공할 수 있습니다. 이를 통해 원하는 순서로 아이템을 삽입할 수 있을 뿐만 아니라 이미 삽입된 아이템을 업데이트할 수도 있습니다.

{% dialect-switcher title="구성 라인 재정의" %}
{% dialect title="JavaScript" id="js" %}

다음 예시는 세 개의 아이템을 삽입하고 나중에 삽입된 두 번째 아이템을 업데이트하는 방법을 보여줍니다.

```ts
await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: 0,
  configLines: [
    { name: 'My NFT #1', uri: 'https://example.com/nft1.json' },
    { name: 'My NFT #2', uri: 'https://example.com/nft2.json' },
    { name: 'My NFT #3', uri: 'https://example.com/nft3.json' },
  ],
}).sendAndConfirm(umi)

await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: 1,
  configLines: [{ name: 'My NFT #X', uri: 'https://example.com/nftX.json' }],
}).sendAndConfirm(umi)

candyMachine = await fetchCandyMachine(candyMachine.publicKey)
candyMachine.items[0].name // "My NFT #1"
candyMachine.items[1].name // "My NFT #X"
candyMachine.items[2].name // "My NFT #3"
```

API 참조: [addConfigLines](https://mpl-candy-machine.typedoc.metaplex.com/functions/addConfigLines.html)

{% /dialect %}
{% /dialect-switcher %}

## 결론

바로 이렇게 NFT를 민팅할 준비가 된 로드된 Candy Machine이 완성되었습니다! 그러나 아직 민팅 프로세스에 대한 요구사항을 만들지 않았습니다. 민팅의 가격을 어떻게 구성할 수 있을까요? 구매자가 특정 토큰의 보유자이거나 특정 컬렉션의 NFT 보유자인지 어떻게 확인할 수 있을까요? 민팅의 시작 날짜를 어떻게 설정할까요? 종료 조건은 어떨까요?

[다음 페이지](/ko/candy-machine/guards)에서는 이 모든 것을 가능하게 하는 Candy Guard에 대해 이야기하겠습니다.