---
title: Autograph 플러그인
metaTitle: Autograph 플러그인 | Core
description: Core NFT 애셋 또는 컬렉션에 서명과 메시지를 추가하는 방법을 알아보세요.
---

`autograph` 플러그인은 사람들이 애셋이나 컬렉션에 서명과 메시지를 추가할 수 있도록 하는 `소유자 관리` 플러그인입니다.

`업데이트 권한`은 민트 시 플러그인을 추가할 수 있습니다. 그 후에는 소유자만 추가할 수 있습니다. 모든 Autograph는 소유자 또는 autograph 위임자가 다시 제거할 수 있습니다. Autographer는 소유자나 autograph 위임자이기도 한 경우를 제외하고는 자신의 autograph를 제거할 수 없습니다.

autograph를 추가하려면 몇 가지 조건을 충족해야 합니다:

- autograph 플러그인이 이미 추가되어 있어야 합니다.
- 서명자는 자신의 주소만 추가할 수 있습니다.
- 기존 목록을 `updatePlugin` 함수를 사용하여 추가된 서명과 함께 전달해야 합니다.
- 해당 서명자의 기존 Autograph가 아직 없어야 합니다.

{% callout type="note" %}
autograph 플러그인이 소유자에 의해 추가되면 누구나 서명을 추가할 수 있습니다. 소유자가 언제든지 다시 제거할 수 있습니다.
{% /callout %}

## 호환성

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

애셋은 컬렉션으로부터 Autograph를 상속받습니다.

## 인수

`autograph` 플러그인은 `signatures` 배열에서 다음 인수를 필요로 합니다:

| Arg     | Value     |
| ------- | ------    |
| address | publicKey |
| message | string    |

## 애셋에 autograph 플러그인 추가하기 코드 예제

{% dialect-switcher title="소유자로서 MPL Core 애셋에 autograph 플러그인 추가하기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  addPlugin,
} from '@metaplex-foundation/mpl-core'

await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    signatures: [
      {
        address: umi.identity.publicKey,
        message: 'Your Message',
      },
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 애셋에 Autograph 추가하기 코드 예제

{% dialect-switcher title="MPL Core 애셋에 Autograph 추가하기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

// 추가하려는 새 autograph
const newAutograph = {
  address: umi.identity.publicKey,
  message: "your message"
}

// 기존 signatures 배열에 새 autograph 추가
const updatedAutographs = [...asset.autograph.signatures, newAutograph]

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    // 제거하지 않으려는 모든 autograph가 포함되어야 합니다
    signatures: updatedAutographs,
  },
  authority: umi.identity,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 애셋에서 Autograph 제거하기 코드 예제

{% dialect-switcher title="MPL Core 애셋에서 Autograph 제거하기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

// 제거하려는 autograph의 공개키
const publicKeyToRemove = publicKey("abc...")

const autographsToKeep = asset.autograph.signatures.filter(
  (autograph) => autograph.address !== publicKeyToRemove
);

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'Autograph',
    // 제거하지 않으려는 모든 Autograph가 포함되어야 합니다
    signatures: autographsToKeep,
  },
  authority: umi.identity, // 애셋의 소유자여야 합니다
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## 컬렉션에 autograph 플러그인 추가하기 코드 예제

{% dialect-switcher title="컬렉션에 autograph 플러그인 추가하기" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { addCollectionPlugin } from '@metaplex-foundation/mpl-core'

await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'Autograph',
        signatures: [
      {
        address: umi.identity.publicKey,
        message: 'Your Message',
      },
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}