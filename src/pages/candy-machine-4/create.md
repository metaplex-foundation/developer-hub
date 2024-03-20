---
title: Creating a CMV4
metaTitle: Creating a CMV4
description: Learn how to create your CMV4 and it's various settings.
---


## Creating a CMV4

{% dialect-switcher title="Create a Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

```ts
// Create the Candy Machine.
const candyMachine = generateSigner(umi)
await create(umi, {
  candyMachine,
  collectionMint: collectionMint.publicKey,
  collectionUpdateAuthority,
  sellerFeeBasisPoints: percentAmount(9.99, 2), // 9.99%
  itemsAvailable: 5000,
  creators: [
    {
      address: umi.identity.publicKey,
      verified: true,
      percentageShare: 100,
    },
  ],
  configLineSettings: some({
    prefixName: '',
    nameLength: 32,
    prefixUri: '',
    uriLength: 200,
    isSequential: false,
  }),
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Settings

### Authority

### Seller Fee Basis Points

### Symbol

### Is Mutable

### Creators

### Item Settings

### Config Line Settings

### Hidden Settings