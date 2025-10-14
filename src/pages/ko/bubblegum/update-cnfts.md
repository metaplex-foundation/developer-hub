---
title: 압축 NFT 업데이트
metaTitle: 압축 NFT 업데이트 | Bubblegum
description: Bubblegum에서 압축 NFT를 업데이트하는 방법을 알아봅니다.
---

**업데이트** 명령을 사용하여 압축 NFT의 메타데이터를 수정할 수 있습니다. Merkle 루트는 데이터의 전파된 해시를 반영하도록 업데이트되며, [Metaplex DAS API](https://github.com/metaplex-foundation/digital-asset-standard-api)를 준수하는 RPC 제공자는 cNFT의 인덱스를 업데이트합니다.

메타데이터는 압축 NFT가 컬렉션의 검증된 항목인지 여부에 따라 두 권한 중 하나가 업데이트할 수 있습니다.

## 업데이트 권한

cNFT에는 두 가지 가능한 업데이트 권한이 있습니다: 트리 소유자 또는 cNFT가 컬렉션에 속하는 경우 컬렉션 권한입니다.

### 컬렉션 권한

cNFT가 컬렉션에 속하는 경우 해당 cNFT의 업데이트 권한은 컬렉션의 권한이 됩니다. cNFT를 업데이트할 때 업데이트 함수에 `collectionMint` 인수를 전달해야 합니다.

권한은 현재 umi identity에서 추론됩니다. 권한이 현재 umi identity와 다른 경우 `authority` 인수를 서명자 유형으로 전달하거나 나중에 서명하기 위해 'noopSigner'를 생성해야 합니다.

```js
await updateMetadata(umi, {
  ...
  collectionMint: publicKey("11111111111111111111111111111111"),
}).sendAndConfirm(umi)
```

### 트리 권한

cNFT가 컬렉션에 속하지 않는 경우 cNFT의 업데이트 권한은 cNFT가 속한 트리의 권한이 됩니다. 이 경우 업데이트 함수에서 `collectionMint` 인수를 **생략**합니다.

권한은 현재 umi identity에서 추론됩니다. 권한이 현재 umi identity와 다른 경우 `authority` 인수를 서명자 유형으로 전달하거나 나중에 서명하기 위해 'noopSigner'를 생성해야 합니다.

## cNFT 업데이트

{% dialect-switcher title="압축 NFT 업데이트" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  updateMetadata,
  UpdateArgsArgs,
} from '@metaplex-foundation/mpl-bubblegum'

// 헬퍼를 사용하여 자산 및 증명을 가져옵니다.
const assetWithProof = await getAssetWithProof(umi, assetId, {
  truncateCanopy: true,
})

// 그런 다음 이를 사용하여 NFT의 메타데이터를 업데이트할 수 있습니다.
const updateArgs: UpdateArgsArgs = {
  name: some('New name'),
  uri: some('https://updated-example.com/my-nft.json'),
}
await updateMetadata(umi, {
  ...assetWithProof,
  leafOwner,
  currentMetadata: assetWithProof.metadata,
  updateArgs,
  // 선택적 매개변수. 권한이 현재 umi identity와 다른 서명자 유형인 경우
  // 해당 서명자를 여기에 할당합니다.
  authority: <Signer>
  // 선택적 매개변수. cNFT가 컬렉션에 속하는 경우 여기에 전달합니다.
  collectionMint: publicKey("22222222222222222222222222222222"),
}).sendAndConfirm(umi)
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}
