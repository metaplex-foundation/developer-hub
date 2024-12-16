---
title: Updating a Candy Machine
metaTitle: Update a Core Candy Machine | Core Candy Machine
description: Learn how to update your Core Candy Machine and it's various settings.
---

## Updating the Data

Below is a breakdown of the arguments in the data structure that can be modified:

| Attribute                | Type                                |
|--------------------------|-------------------------------------|
| **itemsAvailable**       | number | bigint                     |
| **isMutable**            | boolean                             |
| **configLineSettings**   | [Link](/core-candy-machine/create#with-config-line-settings)    |
| **hiddenSettings**       | [Link](/core-candy-machine/create#with-hidden-settings)  |

Here is an example of how to update a Core Candy Machine:

{% dialect-switcher title="Updating a Core Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  updateCandyMachine
} from '@metaplex-foundation/mpl-core-candy-machine'

// Publickey of the candyMachine to update
const candyMachine = publicKey('11111111111111111111111111111111')

await updateCandyMachine(umi, {
  candyMachine,
  data: {
    itemsAvailable: 3333;
    isMutable: true;
    configLineSettings: none();
    hiddenSettings: none();
}
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Updating the Authority

To update the authority of the Candy Machine to a new address, use the `setCandyMachineAuthority()` function and pass the new address in the `newAuthority` field.

Here's an example of how to update the authority of a Candy Machine:

{% dialect-switcher title="Update Authority of Core Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { setMintAuthority } from '@metaplex-foundation/mpl-core-candy-machine'

const candyMachine = publicKey('11111111111111111111111111111111')
const newAuthority = publicKey('22222222222222222222222222222222')

await setMintAuthority(umi, {
  candyMachine,
  mintAuthority: newAuthority,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Updating the Mint Authority

To update the mint authority of the Candy Machine to a new address, use the `setMintAuthority()` function and pass the new address in the `mintAuthority` field.

**Note**: If the Candy Machine has any guards, the `mintAuthority` field will be assigned to that account. By changing the mintAuthority, you're `disabling` the Candy Guard mechanism.

Here's an example of how to update the mint authority of a Candy Machine:

{% dialect-switcher title="Update Mint Authority of Core Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { setMintAuthority } from '@metaplex-foundation/mpl-core-candy-machine'

const candyMachine = publicKey('11111111111111111111111111111111')
const newAuthority = publicKey('22222222222222222222222222222222')

await setMintAuthority(umi, {
  candyMachine,
  mintAuthority: newAuthority,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

## Updating the Guards

Updating the Guards, works similarly to the way we set them when we created the Candy Machine. To enable guards, provide their settings; to disable them, set them to none() or leave them out.

**Note**: The entire guards object is replaced during the update, so include all guards you want to keep, even if their settings remain unchanged. Consider fetching the current guard settings before updating to avoid overwriting unintended fields.

Here's a list of all the Candy Guards available and the individual attributes:  

{% totem %}

{% totem-accordion title="Candy Guards Attributes" %}

| Guard Name                 | Arguments                                                                |
|----------------------------|--------------------------------------------------------------------------|
| **addressGate**            | { `address`: PublicKey }                                                 |
| **allocation**             | { `id`: number, `limit`: number }                                        |
| **allowList**              | { `merkleRoot`: Uint8Array }                                             |
| **assetBurn**              | { `requiredCollection`: PublicKey }                                      |
| **assetBurnMulti**         | { `num`: number, `requiredCollection`: PublicKey }                       |
| **assetGate**              | { `requiredCollection`: PublicKey }                                      |
| **assetMintLimit**         | { `id`: number, `limit`: number, `requiredCollection`: PublicKey }       |
| **assetPayment**           | { `destination`: PublicKey, `requiredCollection`: PublicKey }            |
| **assetPaymentMulti**      | { `destination`: PublicKey, `num`: number, `requiredCollection`: PublicKey } |
| **botTax**                 | { `lamports`: SolAmount, `lastInstruction`: boolean }                    |
| **edition**                | { `editionStartOffset`: number }                                         |
| **endDate**                | { `date`: DateTimeInput }                                                |
| **freezeSolPayment**       | { `destination`: PublicKey, `lamports`: SolAmount }                      |
| **freezeTokenPayment**     | { `amount`: number | bigint, `mint`: PublicKey, `destination`: PublicKey } |
| **gatekeeper**             | { `expireOnUse`: boolean, `gatekeeperNetwork`: PublicKey }               |
| **mintLimit**              | { `id`: number, `limit`: number }                                        |
| **nftBurn**                | { `requiredCollection`: PublicKey }                                      |
| **nftGate**                | { `requiredCollection`: PublicKey }                                      |
| **nftMintLimit**           | { `id`: number, `limit`: number, `requiredCollection`: PublicKey }       |
| **nftPayment**             | { `destination`: PublicKey, `requiredCollection`: PublicKey }            |
| **programGate**            | { `additional`: PublicKey[] }                                            |
| **redeemedAmount**         | { `maximum`: number | bigint }                                           |
| **solFixedFee**            | { `destination`: PublicKey, `lamports`: SolAmount }                      |
| **solPayment**             | { `lamports`: SolAmount, `destination`: PublicKey }                      |
| **startDate**              | { `date`: DateTimeInput }                                                |
| **thirdPartySigner**       | { `signerKey`: PublicKey }                                               |
| **token2022Payment**       | { `amount`: number | bigint, `destinationAta`: PublicKey, `mint`: PublicKey } |
| **tokenBurn**              | { `amount`: number | bigint, `mint`: PublicKey }                         |
| **tokenGate**              | { `amount`: number | bigint, `mint`: PublicKey }                         |
| **tokenPayment**           | { `amount`: number | bigint, `destinationAta`: PublicKey, `mint`: PublicKey } |
| **vanityMint**             | { `regex`: string }                                                      |


{% /totem-accordion %}

{% /totem %}

Here is an example of updating the `guards` from an existing Candy Machine:

{% dialect-switcher title="Update the Guards of a Core Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { some, none, sol } from '@metaplex-foundation/umi'

const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority)

await updateCandyGuard(umi, {
  candyGuard: candyGuard.publicKey,
  guards: {
    ...candyGuard.guards,
    botTax: none(),
    solPayment: some({ lamports: sol(3), destination: treasury }),
  },
})
```

{% /dialect %}
{% /dialect-switcher %}

## Associating and Dissociating Guard accounts manually

The create function that we [used previously](/core-candy-machine/create) already takes care of creating and associating a brand new Candy Guard account for every Candy Machine account created. 

However, it is important to note that Core Candy Machines and Core Candy Guards can be created and associated in different steps by creating the two accounts separately and associate/dissociate them manually after using the `wrap()` and `unwrap()` function.

Here is an example of associating and dissociating the guards from an existing Candy Machine:

{% dialect-switcher title="Associate and dissociate guards from a Candy Machine" %}
{% dialect title="JavaScript" id="js" %}

```ts
import {
  some,
  percentAmount,
  sol,
  dateTime
} from '@metaplex-foundation/umi'
import {
  createCandyMachine,
  createCandyGuard,
  findCandyGuardPda,
  wrap,
  unwrap
} from '@metaplex-foundation/mpl-core-candy-machine'

// Create a Candy Machine without a Candy Guard.
const candyMachine = generateSigner(umi)

await createCandyMachine({
  candyMachine,
  collection: collectionMint.publicKey,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 1000,
  authority: umi.identity.publicKey,
}).sendAndConfirm(umi)

// Create a Candy Guard.
const base = generateSigner(umi)
const candyGuard = findCandyGuardPda(umi, { base: base.publicKey })

await createCandyGuard({
  base,
  guards: {
    botTax: { lamports: sol(0.01), lastInstruction: false },
    solPayment: { lamports: sol(1.5), destination: treasury },
    startDate: { date: dateTime('2022-10-17T16:00:00Z') },
  },
}).sendAndConfirm(umi)

// Associate the Candy Guard with the Candy Machine.
await wrap({
  candyMachine: candyMachine.publicKey,
  candyGuard,
}).sendAndConfirm(umi)

// Dissociate them.
await unwrap({
  candyMachine: candyMachine.publicKey,
  candyGuard,
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}
