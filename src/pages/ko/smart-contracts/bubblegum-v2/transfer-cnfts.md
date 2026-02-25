---
title: 압축된 NFT 전송
metaTitle: 압축된 NFT 전송 - Bubblegum v2
description: Bubblegum에서 압축된 NFT를 전송하는 방법을 알아보세요.
created: '01-15-2025'
updated: '02-24-2026'
keywords:
  - transfer compressed NFT
  - transfer cNFT
  - NFT transfer
  - Bubblegum transfer
  - transferV2
  - permanent transfer delegate
about:
  - Compressed NFTs
  - NFT transfers
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 동결된 cNFT를 전송할 수 있나요?
    a: 아니요. 동결된 cNFT는 전송할 수 없습니다. 적절한 위임 권한을 사용하여 먼저 cNFT를 해동해야 합니다.
  - q: 전송 후 위임자는 어떻게 되나요?
    a: 리프 위임자는 전송 성공 후 자동으로 새 소유자로 재설정됩니다. 새 소유자는 필요한 경우 다시 위임해야 합니다.
  - q: cNFT가 전송 가능한지 확인하려면 어떻게 해야 하나요?
    a: canTransfer 헬퍼 함수를 사용하세요. cNFT가 동결되지 않았고 전송 불가(소울바운드)로 표시되지 않은 경우 true를 반환합니다.
---

## Summary

**Transferring a compressed NFT** moves ownership from one wallet to another using the **transferV2** instruction. This page covers transfers by owner, delegate, permanent transfer delegate, and transferability checks.

- Transfer a cNFT to a new owner using transferV2
- Authorize transfers via leaf owner, leaf delegate, or permanent transfer delegate
- Check if a cNFT can be transferred using the canTransfer helper
- Pass the coreCollection parameter when the cNFT belongs to a collection

**transferV2** 명령어는 압축된 NFT를 한 소유자에서 다른 소유자로 전송하는 데 사용할 수 있습니다. 전송을 승인하려면 현재 소유자나 위임 권한(있는 경우) 중 하나가 트랜잭션에 서명해야 합니다. 위임된 권한은 리프 위임자나 컬렉션의 `permanentTransferDelegate`일 수 있습니다.

이 명령어는 압축된 NFT를 업데이트하므로 Bubblegum 트리의 리프를 교체합니다. 이는 압축된 NFT의 무결성을 확인하기 위해 추가 매개변수를 제공해야 함을 의미합니다. 이러한 매개변수는 리프를 변경하는 모든 명령어에 공통이므로 [다음 FAQ](/ko/smart-contracts/bubblegum-v2/faq#replace-leaf-instruction-arguments)에 문서화되어 있습니다. 다행히 Metaplex DAS API를 사용하여 이러한 매개변수를 자동으로 가져오는 도우미 메서드를 사용할 수 있습니다.

{% callout title="트랜잭션 크기" type="note" %}
트랜잭션 크기 오류가 발생하면 `getAssetWithProof`와 함께 `{ truncateCanopy: true }`를 사용하는 것을 고려하세요. 자세한 내용은 [FAQ](/ko/smart-contracts/bubblegum-v2/faq#replace-leaf-instruction-arguments)를 참조하세요.
{% /callout %}

## Bubblegum V2 압축된 NFT 전송

명령어는 다음 매개변수를 받아들입니다:

- **리프 소유자**: 압축된 NFT의 현재 소유자. 기본적으로 트랜잭션의 지불자로 설정됩니다.
- **리프 위임자**: 압축된 NFT의 현재 소유자와 위임 권한(있는 경우). 이 중 하나가 트랜잭션에 서명해야 합니다.
- **권한**: 트랜잭션에 서명하는 선택적 권한. 리프 소유자나 `permanentTransferDelegate`일 수 있으며 기본적으로 트랜잭션의 `지불자`로 설정됩니다.
- **새 리프 소유자**: 압축된 NFT의 새 소유자 주소
- **머클 트리**: Bubblegum 트리의 주소
- **루트**: Bubblegum 트리의 현재 루트
- **데이터 해시**: 압축된 NFT의 메타데이터 해시
- **크리에이터 해시**: 압축된 NFT의 크리에이터 해시
- **넌스**: 압축된 NFT의 넌스
- **인덱스**: 압축된 NFT의 인덱스
- **컬렉션**: 압축된 NFT의 코어 컬렉션(cNFT가 컬렉션의 일부인 경우)

JavaScript를 사용할 때 먼저 `getAssetWithProof` 함수를 사용하여 매개변수를 가져온 다음 `transferV2` 명령어에 전달하는 것을 제안합니다.

{% dialect-switcher title="압축된 NFT 전송" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, transferV2 } from '@metaplex-foundation/mpl-bubblegum';
const assetWithProof = await getAssetWithProof(umi, assetId, {
  truncateCanopy: true,
})

// 그러면 leafOwnerA가 이를 사용하여 NFT를 leafOwnerB로 전송할 수 있습니다.
const leafOwnerB = generateSigner(umi)
await transferV2(umi, {
  // 자산과 증명의 매개변수를 전달합니다.
  ...assetWithProof,
  authority: leafOwnerA,
  newLeafOwner: leafOwnerB.publicKey,
  // cNFT가 컬렉션의 일부인 경우 코어 컬렉션을 전달합니다.
  //coreCollection: coreCollection.publicKey, 
}).sendAndConfirm(umi)
```

{% totem-accordion title="위임자 사용" %}

```ts
import { getAssetWithProof, transferV2 } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {
  truncateCanopy: true,
})
await transferV2(umi, {
  // 자산과 증명의 매개변수를 전달합니다.
  ...assetWithProof,
  authority: delegateAuthority, // <- 위임된 권한이 트랜잭션에 서명합니다.
  newLeafOwner: leafOwnerB.publicKey,
  // cNFT가 컬렉션의 일부인 경우 코어 컬렉션을 전달합니다.
  //coreCollection: coreCollection.publicKey, 
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="영구 전송 위임자 사용" %}

```ts
import { getAssetWithProof, transferV2 } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {
  truncateCanopy: true,
})
await transferV2(umi, {
  ...assetWithProof,
  authority: permanentTransferDelegate, // <- 위임된 권한이 트랜잭션에 서명합니다.
  newLeafOwner: leafOwnerB.publicKey,
  coreCollection: coreCollection.publicKey, 
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

### 압축된 NFT에 대한 전송 가능성 확인

`canTransfer` 함수는 압축된 NFT를 전송할 수 있는지 확인하는 데 사용할 수 있습니다. NFT를 전송할 수 있으면 `true`를 반환하고 그렇지 않으면 `false`를 반환합니다. 동결된 cNFT와 `NonTransferable` cNFT는 전송할 수 없습니다.

```ts
import { canTransfer } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {
  truncateCanopy: true,
})

const canBeTransferred = canTransfer(assetWithProof)
console.log("canBeTransferred", canBeTransferred ? "Yes" : "No")
```

## Notes

- After a transfer, the leaf delegate is automatically reset to the new owner.
- Frozen cNFTs and soulbound (non-transferable) cNFTs cannot be transferred. Use `canTransfer` to check.
- The permanent transfer delegate can transfer without the owner's signature if the `PermanentTransferDelegate` plugin is enabled on the collection.

## FAQ

#

## Glossary

| Term | Definition |
|------|------------|
| **transferV2** | The Bubblegum V2 instruction that transfers a cNFT from one owner to another |
| **Permanent Transfer Delegate** | A collection-level authority that can transfer any cNFT without owner consent |
| **canTransfer** | A helper function that checks whether a cNFT can be transferred (not frozen or soulbound) |
| **Leaf Owner** | The current owner of the compressed NFT |
| **New Leaf Owner** | The wallet address that will receive ownership of the cNFT after transfer |
