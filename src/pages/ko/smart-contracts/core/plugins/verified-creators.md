---
title: Verified Creator Plugin
metaTitle: Verified Creator Plugin | Core
description: Asset/Collection에서 작업한 크리에이터 목록 데이터를 저장하는 플러그인입니다.
---

`Verified Creator` Plugin은 사람들이 Asset 또는 Collection에 검증된 크리에이터를 추가할 수 있게 하는 `Authority Managed` 플러그인입니다. Metaplex Token Metadata에서 사용한 검증된 Creator Array와 유사하게 작동하지만, MPL Core에서는 Verified Creator가 로열티 분배에 사용되지 않는다는 점이 다릅니다.

이 플러그인의 가능한 사용 사례는 크리에이터가 에셋 생성 과정에 참여했음을 공개적으로 검증하는 것입니다. 예를 들어 디자이너, 개발자, 창립자가 크리에이터십의 증명으로 서명할 수 있습니다.

`업데이트 권한`은 다음을 할 수 있습니다:
- 플러그인을 추가
- 크리에이터 배열에 검증되지 않은 크리에이터를 추가
- 검증되지 않은 크리에이터를 제거할 수 있습니다. 검증된 크리에이터를 제거하려면 먼저 스스로 검증을 해제해야 합니다
- 스스로를 검증할 수 있습니다

크리에이터를 검증하려면 업데이트 권한에 의해 크리에이터 배열에 추가된 공개 키로 `updatePlugin` 명령에 서명해야 합니다.

## Works With

|                     |     |
| ------------------- | --- |
| MPL Core Asset      | ✅  |
| MPL Core Collection | ✅  |

## Arguments

`verifiedCreator` Plugin은 `VerifiedCreatorsSignature` Array에서 다음 인수가 필요합니다:

| Arg     | Value     |
| ------- | ------    |
| address | publicKey |
| message | string    |

Asset은 Collection에서 Creators 배열을 상속받습니다.

## Asset에 autograph Plugin 추가 코드 예시

{% dialect-switcher title="MPL Core Asset에 verified Creators Plugin 추가" %}
{% dialect title="JavaScript" id="js" %}

이 코드 스니펫은 umi identity가 에셋의 업데이트 권한이라고 가정합니다.

```ts
import {
  addPlugin,
} from '@metaplex-foundation/mpl-core'

await addPlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: [
      {
        address: umi.identity.publicKey,
        verified: true,
      },
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Asset에 다른 Creator 추가 코드 예시

{% dialect-switcher title="MPL Core Asset에 다른 Creator 추가" %}
{% dialect title="JavaScript" id="js" %}

이 코드 스니펫은 umi identity가 검증되지 않은 Creator를 추가하기 위한 에셋의 업데이트 권한이라고 가정합니다.

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'


const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

const publicKeyToAdd = publicKey("abc...")

// 추가하려는 새 autograph
const newCreator = {
  address: publicKeyToAdd,
  verified: false,
}

// 기존 signatures 배열에 새 autograph 추가
const updatedCreators = [...asset.verifiedCreators.signatures, newCreator]

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: updatedCreators,
  },
  authority: umi.identity,
}).sendAndConfirm(umi)
```

검증되지 않은 Creator를 추가한 후 `updatePlugin` 함수를 다시 사용하여 스스로를 검증할 수 있습니다.
이 코드 스니펫은 umi identity가 Creator라고 가정합니다.

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'


const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

const publicKeyToVerify = publicKey("abc...")

// 검증하려는 크리에이터
const updatedCreators = asset.verifiedCreators.signatures.map(creator => {
  if (creator.address === publicKeyToVerify) {
    return { ...creator, verified: true };
  }
  return creator;
});


await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: updatedCreators,
  },
  authority: umi.identity,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Asset에서 Creator 제거 코드 예시

{% dialect-switcher title="MPL Core Asset에서 Creator 제거" %}
{% dialect title="JavaScript" id="js" %}

업데이트 권한만이 크리에이터를 제거할 수 있습니다. 크리에이터를 제거하려면 `verified:false`이거나 업데이트 권한 자체여야 합니다. 따라서 업데이트는 두 단계로 수행됩니다. 업데이트 권한과 크리에이터로 동시에 서명할 수 있다면 두 명령을 결합하여 하나의 트랜잭션에서 수행할 수 있습니다.

1. `verified:false` 설정
이 코드 스니펫은 `umi.identity`가 제거하려는 크리에이터라고 가정합니다

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

// 제거하려는 크리에이터의 공개키
const publicKeyToRemove = publicKey("abc...")

const modifiedCreators = signatures.map(signature =>
  signature.address === creator.publicKey
    ? { ...signature, verified: false }
    : signature
);

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: modifiedCreators,
  },
  authority: umi.identity, // 크리에이터여야 합니다
}).sendAndConfirm(umi)
```

2. 크리에이터 제거
이 코드 스니펫은 `umi.identity`가 업데이트 권한이라고 가정합니다

```ts
import { publicKey } from '@metaplex-foundation/umi'
import { updatePlugin, fetchAsset } from '@metaplex-foundation/mpl-core'

const asset = await fetchAsset(umi, assetAddress.publicKey, {
  skipDerivePlugins: false,
})

// 제거하려는 크리에이터의 공개키
const publicKeyToRemove = publicKey("abc...")


const creatorsToKeep = asset.verifiedCreators.signatures.filter(
  (creator) => creator.address !== publicKeyToRemove
);

await updatePlugin(umi, {
  asset: asset.publicKey,
  plugin: {
    type: 'VerifiedCreators',
    signatures: creatorsToKeep,
  },
  authority: umi.identity, // 업데이트 권한이어야 합니다
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Collection에 verified Creators Plugin 추가 코드 예시

{% dialect-switcher title="Collection에 verified Creators Plugin 추가" %}
{% dialect title="JavaScript" id="js" %}
이 코드 스니펫은 `umi.identity`가 업데이트 권한이라고 가정합니다

```ts
import { addCollectionPlugin } from '@metaplex-foundation/mpl-core'

await addCollectionPlugin(umi, {
  collection: collection.publicKey,
  plugin: {
    type: 'VerifiedCreators',
        signatures: [
      {
        address: umi.identity.publicKey,
        verified: true,
      },
  },
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}