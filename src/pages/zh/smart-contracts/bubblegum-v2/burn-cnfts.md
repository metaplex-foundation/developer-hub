---
title: 销毁压缩NFT
metaTitle: 销毁压缩NFT - Bubblegum V2
description: 了解如何在Bubblegum V2上销毁压缩NFT。
created: '01-15-2025'
updated: '02-24-2026'
keywords:
  - burn compressed NFT
  - burn cNFT
  - delete NFT
  - Bubblegum burn
  - burnV2
  - permanent burn delegate
about:
  - Compressed NFTs
  - NFT lifecycle
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
faqs:
  - q: 可以撤销销毁操作吗？
    a: 不可以。销毁会将cNFT从默克尔树中永久删除。叶子被替换为空哈希，无法恢复。
  - q: 谁可以销毁压缩NFT？
    a: 当前叶子所有者、叶子委托人（如果已设置），或永久销毁委托人（如果集合启用了PermanentBurnDelegate插件）。
  - q: 销毁时需要传递集合吗？
    a: 是的，如果cNFT是集合的一部分。请传递带有集合公钥的coreCollection参数。
---

## Summary

**Burning a compressed NFT** permanently removes it from the Bubblegum Tree using the **burnV2** instruction. This page covers burning by owner, leaf delegate, and permanent burn delegate.

- Burn a cNFT using the burnV2 instruction
- Authorize burns via the leaf owner, leaf delegate, or permanent burn delegate
- Pass the coreCollection parameter when the cNFT belongs to a collection

**burnV2**指令可用于销毁压缩NFT，因此将其从Bubblegum树中永久移除。要授权此操作，当前所有者或委托权限（如果有）必须签署交易。该指令接受以下参数：

- **叶子所有者**、**叶子委托人**或**永久销毁委托人**：压缩NFT的当前所有者、其委托权限（如果有）或集合的永久销毁委托人。如果资产是集合的一部分，必须传递`coreCollection`参数。其中一个必须签署交易。

请注意，由于此指令替换Bubblegum树上的叶子，必须提供额外的参数来验证压缩NFT的完整性才能销毁它。由于这些参数对于所有改变叶子的指令都是通用的，它们在[以下FAQ](/zh/smart-contracts/bubblegum-v2/faq#replace-leaf-instruction-arguments)中有记录。幸运的是，我们可以使用辅助方法，该方法将使用Metaplex DAS API自动为我们获取这些参数。

{% callout title="交易大小" type="note" %}
如果遇到交易大小错误，请考虑在`getAssetWithProof`中使用`{ truncateCanopy: true }`。详见[FAQ](/zh/smart-contracts/bubblegum-v2/faq#replace-leaf-instruction-arguments)。
{% /callout %}

{% callout title="集合" type="note" %}
如果cNFT是集合的一部分，必须传递`coreCollection`参数。
{% /callout %}

{% dialect-switcher title="销毁压缩NFT" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

```ts
import { getAssetWithProof, burnV2 } from '@metaplex-foundation/mpl-bubblegum';

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await burnV2(umi, {
  ...assetWithProof,
  leafOwner: currentLeafOwner,
}).sendAndConfirm(umi)
```

{% totem-accordion title="使用委托人" %}

```ts
import { getAssetWithProof, burnV2 } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await burnV2(umi, {
  ...assetWithProof,
  leafDelegate: currentLeafDelegate,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% totem-accordion title="使用永久销毁委托人" %}

```ts
import { getAssetWithProof, burnV2 } from '@metaplex-foundation/mpl-bubblegum'

const assetWithProof = await getAssetWithProof(umi, assetId, {truncateCanopy: true});
await burnV2(umi, {
  ...assetWithProof,
  authority: permanentBurnDelegate, // 永久销毁委托人的签名者
  coreCollection: collection.publicKey,
}).sendAndConfirm(umi)
```

{% /totem-accordion %}

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Notes

- Burning is **irreversible** — the cNFT is permanently removed from the merkle tree.
- If the cNFT belongs to a collection, you must pass the `coreCollection` parameter.
- The permanent burn delegate can burn any cNFT in the collection without the owner's signature, if the `PermanentBurnDelegate` plugin is enabled on the collection.

## FAQ

#

## Glossary

| Term | Definition |
|------|------------|
| **burnV2** | The Bubblegum V2 instruction that permanently removes a cNFT from the merkle tree |
| **Permanent Burn Delegate** | A collection-level authority that can burn any cNFT in the collection without owner consent |
| **Leaf Delegate** | An account authorized by the cNFT owner to perform actions (transfer, burn, freeze) on their behalf |
| **getAssetWithProof** | A helper function that fetches all required parameters (proof, hashes, nonce, index) from the DAS API |
