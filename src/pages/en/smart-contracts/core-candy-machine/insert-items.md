---
title: Inserting Items into a Core Candy Machine
metaTitle: Inserting Items | Core Candy Machine
description: Learn how to insert config line items into a Core Candy Machine, including batch insertion, prefix optimization, and overriding previously loaded items.
keywords:
  - core candy machine
  - insert items
  - config lines
  - addConfigLines
  - candy machine loading
  - NFT minting setup
  - batch insert
  - prefix name
  - prefix URI
  - candy machine items
  - mpl-core-candy-machine
  - Metaplex
  - Solana NFT
about:
  - Core Candy Machine item insertion
  - Config line management for NFT minting
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
faqs:
  - q: How many items can I insert per transaction in a Core Candy Machine?
    a: The number of items per transaction depends on the Name Length and URI Length values in your Config Line Settings. Shorter names and URIs allow more items per transaction because Solana transactions have a size limit. Using prefixes significantly reduces these lengths and lets you fit more items per call.
  - q: Can I update or override items that have already been inserted?
    a: Yes. The addConfigLines function accepts an index parameter that controls where items are written. By specifying the index of a previously inserted item, you overwrite that slot with new data. This works for any item that has not yet been minted.
  - q: Do all items need to be inserted before minting can begin?
    a: Yes. When using Config Line Settings, the Core Candy Machine enforces that every slot (up to itemsAvailable) must contain a config line before any minting transaction is allowed.
  - q: What is the difference between inserting items with and without prefixes?
    a: Without prefixes, you store the full name and URI for each item. With prefixes, the Core Candy Machine stores the shared prefix once and you only insert the unique suffix for each item. This reduces on-chain storage, lowers rent costs, and lets you fit more items per transaction.
---

## Summary

The `addConfigLines` instruction loads name and URI data into a [Core Candy Machine](/smart-contracts/core-candy-machine) so that each slot is ready to mint as a unique Core NFT Asset.

- Use `addConfigLines` to insert one or more config lines at a specified index
- Optimize batch sizes with [Config Line Settings](/smart-contracts/core-candy-machine/create#config-line-settings) prefixes to fit more items per transaction
- Override previously inserted items by targeting their index position
- All items must be inserted before minting is permitted

## Loading Items into a Core Candy Machine

The `addConfigLines` instruction writes name and URI pairs into the on-chain account so the [Core Candy Machine](/smart-contracts/core-candy-machine) knows what metadata to assign at mint time. Each item must conform to the **Name Length** and **URI Length** constraints defined in the [Config Line Settings](/smart-contracts/core-candy-machine/create#config-line-settings) of your machine.

Because Solana transactions have a size limit, you cannot insert thousands of items in a single transaction. The number of items you can include per call depends on how long each name and URI string is. Shorter strings mean more items per transaction.

{% callout type="note" %}
When using Config Line Settings, **minting will not be permitted until all items have been inserted**. Verify that `itemsLoaded` equals `itemsAvailable` before proceeding to add [guards](/smart-contracts/core-candy-machine/guards) or open minting.
{% /callout %}

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

Prefix-based insertion stores only the unique suffix of each name and URI, because the shared prefix is already saved in the [Config Line Settings](/smart-contracts/core-candy-machine/create#config-line-settings). This dramatically reduces the per-item data size and lets you fit significantly more items into each transaction.

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

The `addConfigLines` instruction lets you overwrite previously inserted items by specifying the index of the slot you want to replace. This is useful for correcting metadata errors or swapping out items before minting begins.

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

## Next Steps After Inserting Items

Once all items are loaded (`itemsLoaded` equals `itemsAvailable`), the Core Candy Machine is ready for minting configuration. The next step is to set up [guards](/smart-contracts/core-candy-machine/guards) that control who can mint, when minting opens, what payment is required, and any other access conditions you need for your launch.

## Notes

- **Transaction size limit**: Solana transactions are capped at 1232 bytes. The number of config lines you can insert per transaction depends directly on the combined Name Length and URI Length values in your Config Line Settings.
- **Name Length and URI Length constraints**: Each inserted item's name (excluding the prefix) must not exceed the `nameLength` value, and each URI (excluding the prefix) must not exceed the `uriLength` value defined at creation time. Exceeding these limits causes the transaction to fail.
- **All items must be loaded before minting**: The Core Candy Machine program rejects mint instructions until every slot (from index 0 to `itemsAvailable - 1`) has been populated with a config line.
- **Prefixes reduce storage cost**: Using `prefixName` and `prefixUri` stores the shared string portion once on-chain rather than repeating it for every item, which lowers the rent cost of the Candy Machine account.
- **Overrides are pre-mint only**: You can overwrite any config line that has not yet been minted. Once an item has been minted, its on-chain data is finalized.

## FAQ

### How many items can I insert per transaction in a Core Candy Machine?

The number of items per transaction depends on the **Name Length** and **URI Length** values in your [Config Line Settings](/smart-contracts/core-candy-machine/create#config-line-settings). Shorter names and URIs allow more items per transaction because Solana transactions have a size limit of 1232 bytes. Using prefixes significantly reduces these lengths and lets you fit more items per call.

### Can I update or override items that have already been inserted?

Yes. The `addConfigLines` function accepts an `index` parameter that controls where items are written. By specifying the index of a previously inserted item, you overwrite that slot with new data. This works for any item that has not yet been minted.

### Do all items need to be inserted before minting can begin?

Yes. When using Config Line Settings, the Core Candy Machine enforces that every slot (up to `itemsAvailable`) must contain a config line before any minting transaction is allowed.

### What is the difference between inserting items with and without prefixes?

Without prefixes, you store the full name and URI for each item. With prefixes, the Core Candy Machine stores the shared prefix once and you only insert the unique suffix for each item. This reduces on-chain storage, lowers rent costs, and lets you fit more items per transaction.

