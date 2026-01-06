---
title: Inserting Items
metaTitle: Inserting Items | Core Candy Machine
description: How to load Core NFT Assets into a Core Candy Machine.
---

Now that we have a name and URI for all of our items, all we need to do is insert them into our Core Candy Machine account.

This is an important part of the process and, when using Config Line Settings, **minting will not be permitted until all items have been inserted**.

Note that the name and URI of each inserted item are respectively constraint by the **Name Length** and **URI Length** attributes of the Config Line Settings.

Additionally, because transactions are limited to a certain size, we cannot insert thousands of items within the same transaction. The number of items we can insert per transaction will depend on the **Name Length** and **URI Length** attributes defined in the Config Line Settings. The shorter our names and URIs are, the more we'll be able to fit into a transaction.

{% callout title="CLI Alternative" type="note" %}
You can also insert items using the MPLX CLI, which handles batch processing automatically:
```bash
mplx cm insert
```
The CLI provides smart loading detection, progress tracking, and optimal batch sizing. See the [CLI insert command documentation](/dev-tools/cli/cm/insert) for more details.
{% /callout %}

{% dialect-switcher title="Add config lines" %}
{% dialect title="JavaScript" id="js" %}

When using the Umi library, you may use the `addConfigLines` function to insert items into a Core Candy Machine. It requires the config lines to add as well as the index in which you want to insert them.

```ts
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

API References: [addConfigLines](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/addConfigLines.html)

{% /dialect %}
{% /dialect-switcher %}

## Inserting Items Using Prefixes

When using name and/or URI prefixes, you only need to insert the part that comes after them.

Note that, since using prefixes can significantly reduce the Name Length and URI Length, it should help you fit a lot more items per transaction.

{% dialect-switcher title="Add config lines from a given index" %}
{% dialect title="JavaScript" id="js" %}

When adding config lines to a Core Candy Machine that uses prefixes, you may only provide the part of the name and URI that comes after the prefix when using the `addConfigLines` function.

For instance, say you had a Core Candy Machine with the following config line settings.

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
```

Then, you can insert config lines like so.

```ts
await addConfigLines(umi, {
  candyMachine: candyMachine.publicKey,
  index: candyMachine.itemsLoaded,
  configLines: [
    { name: '1', uri: '1.json' },
    { name: '2', uri: '2.json' },
    { name: '3', uri: '3.json' },
  ],
}).sendAndConfirm(umi)
```

API References: [addConfigLines](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/addConfigLines.html)

{% /dialect %}
{% /dialect-switcher %}

## Overriding Existing Items

When inserting items, you may provide the position in which these items should be inserted. This enables you to insert items in any order you want but also allows you to update items that have already been inserted.

{% dialect-switcher title="Override config lines" %}
{% dialect title="JavaScript" id="js" %}

The following examples show how you can insert three items and, later on, update the second item inserted.

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

API References: [addConfigLines](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/addConfigLines.html)

{% /dialect %}
{% /dialect-switcher %}

## Conclusion

And just like that, we have a loaded Core Candy Machine ready to mint Assets! However, we've not created any requirements for our minting process. How can we configure the price of the mint? How can we ensure that buyers are holders of a specific token or an Asset from a specific collection? How can we set the start date of our mint? What about the end conditions?
