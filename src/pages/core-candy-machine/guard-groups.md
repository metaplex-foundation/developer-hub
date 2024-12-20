---
title: Guard Groups
metaTitle: Guard Groups | Core Candy Machine
description: Explains how to configure and use multiple groups of guards with a Core Candy Machine.
---

With Guard Groups, you can define multiple sets of guards, each with its own specific requirements. Thiscreate a fully customizable minting process tailored to your project's needs by introducing: 
- **[Phases](#with-phases)**: by setting up different time constraints to each group,
- **[Parallel Groups](#with-parallel-groups)**: by enabling more than one valid group at a given time.

## Create a Candy Guard Group

Guard groups work the same way as Candy Guards, but each group is wrapped in a **Label**: a unique text identifier that makes the group unique and can't be longer than 6 character. 

When minting, users must specify the label of the guard group they want to apply. This is important because multiple groups can be active simultaneously, and, if a user mints near the end of one phase but the transaction processes in the next phase, specifying the label ensures they mint under the intended terms.

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Core Candy Machine" theme="blue" /%}
{% node label="Owner: Core Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Core Candy Guard" theme="blue" /%}
{% node label="Owner: Core Candy Guard Program" theme="dimmed" /%}
{% node #group-1 theme="mint" z=1 %}
Group 1: "early" {% .font-semibold %}
{% /node %}
{% node label="Sol Payment" /%}
{% node label="Start Date" /%}
{% node label="End Date" /%}
{% node label="Bot Tax" /%}
{% node theme="mint" z=1 %}
Group 2: "late"
{% /node %}
{% node label="Sol Payment" /%}
{% node label="Start Date" /%}
{% node label="Bot Tax" /%}
{% /node %}

{% node parent="candy-machine-1" x=350 %}
{% node #mint-1 label="Mint" theme="pink" /%}
{% node label="Core Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=70 y=-20 label="Access Control" theme="transparent" /%}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Core Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}

{% node #nft parent="mint-2" x=78 y=100 label="NFT" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="group-1" to="mint-1" theme="pink" %}
Select which group \
to mint from
{% /edge %}

{% /diagram %}

### with phases

As mentioned earlier, Candy Guard Groups allow creating minting phases by assigning different time constraints to each group.

For example, to reward early birds, you could charge 1 SOL from 4 PM to 5 PM, then increase the price to 2 SOL from 5 PM until the Core Candy Machine is sold out. Here’s how you could configure the guards for this setup:

- **Group 1 - Label: `early`**: Sol Payment (1 SOL), Start Date (4pm), End Date (5pm)
- **Group 2 - Label: `late`**: Sol Payment (2 SOL), Start Date (5pm)

And here's the Code Example for it:

{% dialect-switcher title="Create a Candy Machine with guard groups" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { create } from '@metaplex-foundation/mpl-core-candy-machine'
import { some, sol, dateTime, generateSigner } from '@metaplex-foundation/umi'

const candyMachine = generateSigner();
const collection = publicKey('11111111111111111111111111111111')

await create(umi, {
  candyMachine,
  collection,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 1000,
  authority: umi.identity.publicKey,
  groups: [
    {
      label: 'early',
      guards: {
        solPayment: some({ lamports: sol(1), destination: treasury }),
        startDate: some({ date: dateTime('2022-10-18T16:00:00Z') }),
        endDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
      },
    },
    {
      label: 'late',
      guards: {
        solPayment: some({ lamports: sol(2), destination: treasury }),
        startDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
      },
    },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

### with default guards

In the `create` instruction, you can pass both guards and guard groups. The `guards` field acts as default guards applied to all groups unless a specific group overrides them by enabling its own version.

Here's a quick Recap:
- If a guard is enabled on the default guards but not on the group’s guards: group uses the default guard.
- If a guard is enabled on the default guards _and_ on the group’s guards: group uses group guard.
- If a guard is neither enabled on the default guards nor the group’s guards: group doesn't uses guard.

**Note**: even when using default guards, a group must always be provided when minting. That means that is not possible to mint using only the default guards.

Here’s how you could configure the guards to include a Bot Tax for both groups:
- **Default Guard**: Bot Tax
- **Group 1 - Label: `early`**: Sol Payment (1 SOL), Start Date (4pm), End Date (5pm)
- **Group 2 - Label: `late`**: Sol Payment (2 SOL), Start Date (5pm)

And here's the Code Example for it:

{% dialect-switcher title="Create a Candy Machine with default guards and guard groups" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { create } from '@metaplex-foundation/mpl-core-candy-machine'
import { some, sol, dateTime, generateSigner } from '@metaplex-foundation/umi'

const candyMachine = generateSigner();
const collection = publicKey('11111111111111111111111111111111')

await create(umi, {
  candyMachine,
  collection,
  collectionUpdateAuthority: umi.identity,
  itemsAvailable: 1000,
  authority: umi.identity.publicKey,
  guards: {
    botTax: some({ lamports: sol(0.001), lastInstruction: true }),
  },
  groups: [
    {
      label: 'early',
      guards: {
        solPayment: some({ lamports: sol(1), destination: treasury }),
        startDate: some({ date: dateTime('2022-10-18T16:00:00Z') }),
        endDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
      },
    },
    {
      label: 'late',
      guards: {
        solPayment: some({ lamports: sol(2), destination: treasury }),
        startDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
      },
    },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}

### with Parallel Groups

As mentioned earlier, Candy Guard Groups allows more than one valid group at a given time by allowing the buyer to select which group they would like to mint from.

For example, you could offer a discount to holders of a specific NFT collection while letting others mint at the regular price:
- **Default Guard**: Bot Tax, Start Date (4pm)
- **Group 1 - Label: `collection`**: Sol Payment (1 SOL), NFT Gate ("Collection Address")
- **Group 2 - Label: `public`**: Sol Payment (2 SOL)

By selecting the `collection` group, holders of the specified collection will receive a 50% discount on minting.

## Update a Candy Guard Group

Updating Guards Group work similarly to how you would [update individual Guards](/core-candy-machine/update#updating-the-guards).

**Note**: Using the `updateCandyGuard()` will update the entire `guards` object and `groups` array overrading all existing data, so be sure to fetch the latest candy guard data beforehand to avoid overwriting any existing settings.

Here's an example of changing the Sol Payment guards from the `public` group of the [Parallel Groups example](#with-parallel-groups):

{% dialect-switcher title="Update a Candy Guard Groups" %}
{% dialect title="JavaScript" id="js" %}

```ts
import { some, sol, dateTime } from '@metaplex-foundation/umi'

const candyGuard = await fetchCandyGuard(umi, candyMachine.mintAuthority)

await updateCandyGuard(umi, {
  candyGuard: candyGuard.publicKey,
  guards: candyGuard.guards,
  groups: [
    {
      label: 'early',
      guards: {
        solPayment: some({ lamports: sol(1), destination: treasury }),
        startDate: some({ date: dateTime('2022-10-18T16:00:00Z') }),
        endDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
        botTax: some({ lamports: sol(0.001), lastInstruction: true }),
      },
    },
    {
      label: 'late',
      guards: {
        solPayment: some({ lamports: sol(3), destination: treasury }),
        startDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
        botTax: some({ lamports: sol(0.001), lastInstruction: true }),
      },
    },
  ],
}).sendAndConfirm(umi)
```

{% /dialect %}
{% /dialect-switcher %}
