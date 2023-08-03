---
title: Creating Bubblegum Trees
metaTitle: Bubblegum - Creating Bubblegum Trees
description: Learn how to create and fetch new Merkle Trees that can hold compressed NFTs
---

_Coming soon..._

{% dialect-switcher title="Create a Bubblegum Tree" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { generateSigner } from '@metaplex-foundation/umi'
import { createTree } from '@metaplex-foundation/mpl-bubblegum'

const merkleTree = generateSigner(umi)
const builder = await createTree(umi, {
  merkleTree,
  maxDepth: 14,
  maxBufferSize: 64,
  // treeCreator <- Default to umi.identity
})
await builder.sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

TODO

{% dialect-switcher title="Fetch a Tree Config" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchTreeConfigFromSeeds } from '@metaplex-foundation/mpl-bubblegum'

const treeConfig = await fetchTreeConfigFromSeeds(umi, { merkleTree })
// treeConfig.treeCreator
// treeConfig.treeDelegate
// treeConfig.totalMintCapacity
// treeConfig.numMinted
// treeConfig.isPublic
// ...
```

{% /dialect %}
{% /dialect-switcher %}

TODO

{% dialect-switcher title="Fetch a Merkle Tree" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { fetchMerkleTree } from '@metaplex-foundation/mpl-bubblegum'

const merkleTreeAccount = await fetchMerkleTree(umi, merkleTree)
// merkleTreeAccount.treeHeader
// merkleTreeAccount.tree
// merkleTreeAccount.canopy
// ...
```

{% /dialect %}
{% /dialect-switcher %}
