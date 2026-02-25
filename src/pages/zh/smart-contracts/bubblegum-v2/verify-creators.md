---
title: 验证创作者
metaTitle: 验证创作者 - Bubblegum V2
description: 了解如何在Bubblegum上验证和取消验证创作者。
created: '01-15-2025'
updated: '02-24-2026'
keywords:
  - verify creator
  - NFT creator
  - creator verification
  - unverify creator
  - verifyCreatorV2
about:
  - Compressed NFTs
  - Creator verification
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 可以验证不在创作者数组中的创作者吗？
    a: 不可以。创作者必须已经在cNFT的创作者数组中列出。先使用updateMetadataV2添加创作者，然后再验证他们。
  - q: 谁签署验证交易？
    a: 被验证的创作者必须签署交易。您不能代表他人验证创作者。
  - q: 创作者可以在铸造时验证自己吗？
    a: 可以。如果创作者签署了铸造交易，他们会自动在cNFT的创作者数组中得到验证。
---

## Summary

**Verifying creators** toggles the verified flag on a cNFT's creator entries. This page covers verifying and unverifying creators using the verifyCreatorV2 and unverifyCreatorV2 instructions.

- Verify a creator on an existing cNFT (the creator must sign)
- Unverify a creator from a cNFT
- Creators can also be verified at mint time by signing the mint transaction

如果压缩NFT的元数据中设置了创作者列表，这些创作者可以使用特殊指令在cNFT上验证和取消验证自己。{% .lead %}

这些指令将在cNFT的**创作者**数组的适当项目上切换**已验证**布尔值。该布尔值很重要，因为它允许钱包和市场等应用程序知道哪些创作者是真实的，哪些不是。

值得注意的是，创作者可以在[铸造压缩NFT](/zh/smart-contracts/bubblegum-v2/mint-cnfts)时通过签署铸造交易直接验证自己。也就是说，现在让我们看看创作者如何在现有的压缩NFT上验证或取消验证自己。

## 验证创作者

Bubblegum程序提供**verifyCreatorV2**指令，必须由我们试图验证的创作者签名。创作者必须已经是压缩NFT的**创作者**数组的一部分。如果创作者尚未在数组中，请先使用[`updateMetadataV2`](/zh/smart-contracts/bubblegum-v2/update-cnfts)指令将创作者添加到**创作者**数组。

此外，由于此指令将替换Bubblegum树上的叶子，因此必须提供更多参数来验证压缩NFT的完整性。由于这些参数对于所有改变叶子的指令都是通用的，它们在[以下FAQ](/zh/smart-contracts/bubblegum-v2/faq#replace-leaf-instruction-arguments)中有记录。幸运的是，我们可以使用辅助方法，该方法将使用Metaplex DAS API自动为我们获取这些参数。

{% dialect-switcher title="验证压缩NFT的创作者" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  verifyCreatorV2,
  MetadataArgsV2Args
} from '@metaplex-foundation/mpl-bubblegum';
import {
  unwrapOption,
  none,
} from '@metaplex-foundation/umi';

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
const collectionOption = unwrapOption(assetWithProof.metadata.collection);
const metadata: MetadataArgsV2Args = {
  name: assetWithProof.metadata.name,
  uri: assetWithProof.metadata.uri,
  sellerFeeBasisPoints: assetWithProof.metadata.sellerFeeBasisPoints,
  collection: collectionOption
    ? collectionOption.key
    : none(),
  creators: assetWithProof.metadata.creators,
};
await verifyCreatorV2(umi, {
  ...assetWithProof,
  metadata,
  creator: umi.identity, // 或与umi身份不同的签名者
}).sendAndConfirm(umi);
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## 取消验证创作者

与**verifyCreatorV2**指令类似，**unverifyCreatorV2**指令必须由创作者签名，将在压缩NFT上取消验证他们。

{% dialect-switcher title="取消验证压缩NFT的创作者" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import {
  getAssetWithProof,
  unverifyCreatorV2,
  MetadataArgsV2Args
} from '@metaplex-foundation/mpl-bubblegum'
import {
  unwrapOption,
  none,
} from '@metaplex-foundation/umi';

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
const metadata: MetadataArgsV2Args = {
  name: assetWithProof.metadata.name,
  uri: assetWithProof.metadata.uri,
  sellerFeeBasisPoints: assetWithProof.metadata.sellerFeeBasisPoints,
  collection: unwrapOption(assetWithProof.metadata.collection)
    ? unwrapOption(assetWithProof.metadata.collection)!.key
    : none(),
  creators: assetWithProof.metadata.creators,
};
await unverifyCreatorV2(umi, {
  ...assetWithProof,
  metadata,
  creator: umi.identity, // 或与umi身份不同的签名者
}).sendAndConfirm(umi);
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Notes

- Only creators already listed in the cNFT's creators array can be verified. Use `updateMetadataV2` to add creators first.
- The creator being verified must sign the transaction themselves.
- Creators can be verified at mint time by signing the mint transaction, avoiding the need for a separate verification step.

## FAQ

#

## Glossary

| Term | Definition |
|------|------------|
| **verifyCreatorV2** | Instruction that sets a creator's verified flag to true on a compressed NFT |
| **unverifyCreatorV2** | Instruction that sets a creator's verified flag to false on a compressed NFT |
| **Creators Array** | The list of creator addresses, verification statuses, and royalty share percentages stored in cNFT metadata |
| **Verified** | A boolean flag indicating whether a creator has confirmed their association with the cNFT |
