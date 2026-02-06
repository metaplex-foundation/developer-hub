---
title: 압축된 NFT 동결 및 해동
metaTitle: 압축된 NFT 동결 및 해동 | Bubblegum V2
description: Bubblegum에서 압축된 NFT를 동결하고 해동하는 방법을 알아보세요.
---

Bubblegum V2를 사용하면 압축된 NFT를 동결하고 해동할 수 있습니다. 이는 스테이킹과 같은 다양한 사용 사례에 유용합니다. {% .lead %}

## 압축된 NFT 동결

이전에 리프 위임자에게 위임된 압축된 NFT를 동결하려면 `freezeV2` 명령어를 사용할 수 있습니다. 아직 위임되지 않은 경우 아래의 `delegateAndFreezeV2`를 참조하세요. `freezeV2` 명령어는 다음과 같이 사용할 수 있습니다:

{% dialect-switcher title="리프 위임자로 압축된 NFT 동결" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
import {
  getAssetWithProof,
  freezeV2,
} from '@metaplex-foundation/mpl-bubblegum';

const assetWithProof = await getAssetWithProof(umi, assetId);
await freezeV2(umi, {
  ...assetWithProof,
  leafOwner: umi.identity.publicKey,
  authority: leafDelegate, // 기본적으로 지불자로 설정됩니다
  leafDelegate: leafDelegate.publicKey,
  // cNFT가 컬렉션의 일부인 경우 컬렉션 주소를 전달합니다.
  //coreCollection: collectionSigner.publicKey,
}).sendAndConfirm(umi);
```

{% /totem %}
{% totem-accordion title="영구 동결 위임자로" %}

```js
import {
  getAssetWithProof,
  freezeV2,
} from '@metaplex-foundation/mpl-bubblegum';

const assetWithProof = await getAssetWithProof(umi, assetId);
await freezeV2(umi, {
  ...assetWithProof,
  leafOwner: umi.identity.publicKey,
  authority: permanentFreezeDelegate,
  leafDelegate: permanentFreezeDelegate.publicKey,
  coreCollection: collectionSigner.publicKey,
}).sendAndConfirm(umi);
```

{% /totem-accordion %}
{% /dialect %}
{% /dialect-switcher %}

## 압축된 NFT 위임 및 동결

압축된 NFT를 동결하려면 `delegateAndFreezeV2` 명령어를 사용할 수 있습니다. 이 명령어는 다음과 같이 사용할 수 있습니다:

{% dialect-switcher title="압축된 NFT 위임 및 동결" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
import {
  getAssetWithProof,
  delegateAndFreezeV2,
} from '@metaplex-foundation/mpl-bubblegum';

// newLeafDelegate는 나중에 cNFT를 해동할 수 있는 publicKey여야 합니다.

const assetWithProof = await getAssetWithProof(umi, assetId);
await delegateAndFreezeV2(umi, {
  ...assetWithProof,
  leafOwner: umi.identity.publicKey,
  newLeafDelegate,
}).sendAndConfirm(umi);

```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 압축된 NFT 해동

압축된 NFT를 해동하려면 `thawV2` 명령어를 사용할 수 있습니다. 이 명령어는 다음과 같이 사용할 수 있습니다:

{% dialect-switcher title="리프 위임자로 압축된 NFT 해동" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
import {
  getAssetWithProof,
  thawV2,
} from '@metaplex-foundation/mpl-bubblegum';

const assetWithProof = await getAssetWithProof(umi, assetId);
// delegateAuthority는 cNFT의 위임 권한으로 승인된 서명자여야 합니다.
await thawV2(umi, {
  ...assetWithProof,
  authority: delegateAuthority,
}).sendAndConfirm(umi);
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

cNFT가 영구 동결 위임자에게 위임된 경우 다음과 같이 해동할 수 있습니다:

{% dialect-switcher title="영구 동결 위임자로 압축된 NFT 해동" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
import {
  getAssetWithProof,
  thawV2,
} from '@metaplex-foundation/mpl-bubblegum';

const assetWithProof = await getAssetWithProof(umi, assetId);
await thawV2(umi, {
  ...assetWithProof,
  authority: permanentFreezeDelegate,
}).sendAndConfirm(umi);
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 해동 및 위임 권한 취소

해동과 위임 권한 취소를 동시에 하려면 `thawAndRevokeV2` 명령어를 사용할 수 있습니다. 이 명령어는 다음과 같이 사용할 수 있습니다:

{% dialect-switcher title="해동 및 위임 권한 취소" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
import {
  getAssetWithProof,
  thawAndRevokeV2,
} from '@metaplex-foundation/mpl-bubblegum';

// delegateAuthority는 cNFT의 위임 권한으로 승인된 서명자여야 합니다.
const assetWithProof = await getAssetWithProof(umi, assetId);
await thawAndRevokeV2(umi, {
  ...assetWithProof,
  authority: delegateAuthority,
}).sendAndConfirm(umi);
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## cNFT를 소울바운드로 만들기

cNFT를 소울바운드로 만들려면 cNFT가 [`permanentFreezeDelegate`](/ko/smart-contracts/core/plugins/permanent-freeze-delegate) 플러그인이 있는 [mpl-core 컬렉션](/ko/smart-contracts/core/collections)의 일부여야 합니다. `setNonTransferableV2` 명령어를 사용하여 cNFT를 양도 불가능하게 만들 수 있습니다.

{% dialect-switcher title="cNFT를 소울바운드로 만들기" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```js
import {
  getAssetWithProof,
  setNonTransferableV2,
} from '@metaplex-foundation/mpl-bubblegum';

const assetWithProof = await getAssetWithProof(umi, assetId);

await setNonTransferableV2(umi, {
    ...assetWithProof,
    authority, // 컬렉션의 영구 동결 위임자
    coreCollection: collection.publicKey,
}).sendAndConfirm(umi);
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
