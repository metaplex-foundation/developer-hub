---
title: Loading Items in the Candy Machine
metaTitle: Loading Items | Core Candy Machine
description: How to load Core NFT Assets into a Core Candy Machine.
---

After [preparing the Candy Machine Assets](/core-candy-machine/guides/preparing-assets), the next step is to insert them into the Candy Machine. This is extremely important because **minting will not be permitted until all items have been inserted**.

**Note**: Solana transactions have size limits, this restrict the number of items that can be inserted per transaction based on the length of asset names and URIs. Shorter names and URIs allow more items to fit into a single transaction.

## Loading Items in the Candy Machine 

You can use the `addConfigLines()` function to load items into the Candy Machine. You need to specify the configLines to insert and the index where they should be added. 

Here's an example of how to do it:

{% dialect-switcher title="Loading Items in the Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { publicKey } from "@metaplex-foundation/umi";
import { fetchCandyMachine, addConfigLines } from "@metaplex-foundation/mpl-core-candy-machine";

const candyMachineId = "11111111111111111111111111111111"
const candyMachine = await fetchCandyMachine( umi, publicKey(candyMachineId))

await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: 0,
  configLines: [
    { name: 'My NFT #1', uri: 'https://example.com/nft1.json' },
    { name: 'My NFT #2', uri: 'https://example.com/nft2.json' },
  ],
}).sendAndConfirm(umi)
```

To simply append items to the end of the currently loaded items, you may using the `candyMachine.itemsLoaded` property as the index like so.

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
{% /dialect %}
{% /dialect-switcher %}

### that uses Config Line Settings

By setting up the [Config Line Settings](/core-candy-machine/create#with-config-line-settings), you only need to insert the part that comes after the prefixes that we set up on creation. Using this setup, significantly reduce the Name Length and URI Length helping you fit a lot more items per transaction.

**Note**: name and URI of each inserted item are respectively constraint by the **Name Length** and **URI Length** attributes of the Config Line Settings.

The way to do it is the same, it's just much shorter to do, here's an example of it

{% dialect-switcher title="Loading Items in the Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

```ts
await create(umi, {
  // ...
  configLineSettings: some({
    prefixName: 'My Asset #',
    nameLength: 4,
    prefixUri: 'https://example.com/nft',
    uriLength: 9,
    isSequential: false,
  }),
}).sendAndConfirm(umi)

await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: 0,
  configLines: [
    { name: '1', uri: '1.json' },
    { name: '2', uri: '2.json' },
    { name: '3', uri: '3.json' },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Overriding Existing Items in the Candy Machine 

Since the `addConfigLines()` function requires an index, it can be used not only for inserting new items but also for updating items that have already been inserted.

Here's a showcase of this behaviour:

{% dialect-switcher title="Overriding Existing Items in the Candy Machine " %}
{% dialect title="JavaScript" id="js" %}

```ts
await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: 0,
  configLines: [
    { name: 'My Asset #1', uri: 'https://example.com/nft1.json' },
    { name: 'My Asset #2', uri: 'https://example.com/nft2.json' },
    { name: 'My Asset #3', uri: 'https://example.com/nft3.json' },
  ],
}).sendAndConfirm(umi)

await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: 1,
  configLines: [{ name: 'My Asset #X', uri: 'https://example.com/nftX.json' }],
}).sendAndConfirm(umi)

candyMachine = await fetchCandyMachine(candyMachine.publicKey)
candyMachine.items[0].name // "My Asset #1"
candyMachine.items[1].name // "My Asset #X"
candyMachine.items[2].name // "My Asset #3"
```

{% /dialect %}
{% /dialect-switcher %}
