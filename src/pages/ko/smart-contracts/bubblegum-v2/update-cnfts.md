---
title: 압축된 NFT 업데이트
metaTitle: 압축된 NFT 업데이트 | Bubblegum V2
description: Bubblegum에서 압축된 NFT를 업데이트하는 방법을 알아보세요.
---

**updateMetadataV2** 명령어는 압축된 NFT의 메타데이터를 수정하는 데 사용할 수 있습니다. 머클 루트가 업데이트되어 데이터의 전파된 해시를 반영하고, [Metaplex DAS API](https://github.com/metaplex-foundation/digital-asset-standard-api)를 준수하는 RPC 제공업체는 cNFT의 인덱스를 업데이트합니다.

메타데이터는 압축된 NFT가 컬렉션의 확인된 항목인지 여부에 따라 두 권한 중 하나에 의해 업데이트될 수 있습니다.

## 업데이트 권한

cNFT는 두 가지 가능한 업데이트 권한을 가집니다: 트리 소유자, 또는 (컬렉션에 속한 경우) 컬렉션 권한.

### 컬렉션 권한

cNFT가 컬렉션에 속한 경우 해당 cNFT의 업데이트 권한은 컬렉션의 권한이 됩니다. cNFT를 업데이트할 때 업데이트 함수에 `coreCollection` 인수를 전달해야 합니다.

권한은 현재 umi 신원에서 추론됩니다. 권한이 현재 umi 신원과 다른 경우 `authority` 인수를 서명자 타입으로 전달하거나 나중에 서명하기 위해 `noopSigner`를 생성해야 합니다.

```js
await updateMetadataV2(umi, {
  ...
  authority: collectionAuthority,
  coreCollection: publicKey("11111111111111111111111111111111"),
}).sendAndConfirm(umi)
```

### 트리 권한

cNFT가 컬렉션에 속하지 않는 경우 cNFT의 업데이트 권한은 cNFT가 속한 트리의 권한이 됩니다. 이 경우 업데이트 함수에서 `coreCollection` 인수를 **생략**합니다.

권한은 현재 umi 신원에서 추론됩니다. 권한이 현재 umi 신원과 다른 경우 `authority` 인수를 서명자 타입으로 전달하거나 나중에 서명하기 위해 `noopSigner`를 생성해야 합니다.

## cNFT 업데이트

{% dialect-switcher title="압축된 NFT 업데이트" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  updateMetadataV2,
  UpdateArgsArgs,
} from '@metaplex-foundation/mpl-bubblegum'
import { some } from '@metaplex-foundation/umi'

// 도우미를 사용하여 자산과 증명을 가져옵니다.
const assetWithProof = await getAssetWithProof(umi, assetId, {
  truncateCanopy: true,
})

// 그런 다음 NFT의 메타데이터를 업데이트하는 데 사용할 수 있습니다.
const updateArgs: UpdateArgsArgs = {
  name: some('새 이름'),
  uri: some('https://updated-example.com/my-nft.json'),
}
await updateMetadataV2(umi, {
  ...assetWithProof,
  leafOwner,
  currentMetadata: assetWithProof.metadata,
  updateArgs,
  // 선택적 매개변수. 권한이 현재 umi 신원과 다른 서명자 타입인 경우
  // 여기에 해당 서명자를 할당합니다.
  authority: <Signer>,
  // 선택적 매개변수. cNFT가 컬렉션에 속한 경우 여기에 전달합니다.
  coreCollection: publicKey("22222222222222222222222222222222"),
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
