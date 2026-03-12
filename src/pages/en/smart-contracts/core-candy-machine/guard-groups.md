---
title: Guard Groups
metaTitle: Guard Groups | Core Candy Machine
description: Guard Groups allow a single Core Candy Machine to define multiple independent sets of guards, each with its own label and access-control rules, enabling sequential and parallel minting workflows.
keywords:
  - guard groups
  - Core Candy Machine
  - candy guard
  - minting workflow
  - default guards
  - parallel minting
  - group label
  - access control
  - NFT minting
  - Solana
  - Metaplex
  - guard configuration
  - multi-tier mint
about:
  - Guard Groups
  - Candy Machine configuration
  - Minting workflows
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
faqs:
  - q: What is the maximum label length for a guard group?
    a: Guard group labels must be 6 characters or fewer. The on-chain account structure enforces this limit, so any label exceeding 6 characters will cause the transaction to fail.
  - q: Can I mint using only the default guards when guard groups are configured?
    a: No. When guard groups are present, every mint transaction must specify a group label. It is not possible to mint from the default guards alone; the default guards only serve as inherited fallback settings for the groups.
  - q: Do guard groups share a single item pool or does each group have its own supply?
    a: All guard groups draw from the same Core Candy Machine item pool. There is no per-group supply limit unless you add a guard such as Allocation within each group to cap how many items that group can distribute.
  - q: How do parallel guard groups handle overlapping time windows?
    a: When two or more groups have overlapping start and end dates, buyers choose which group to mint from by specifying the group label in the mint instruction. The Candy Guard program evaluates only the guards in the selected group (merged with default guards), so both groups can operate simultaneously without conflict.
  - q: What happens if I update guard groups on an existing Candy Machine?
    a: The updateCandyGuard instruction replaces the entire guards and groups configuration at once. You must include every group in the update call, even groups whose settings have not changed, or they will be removed. Fetch the current Candy Guard account data before updating to avoid accidentally overwriting existing settings.
---

## Summary

Guard Groups let a single [Core Candy Machine](/smart-contracts/core-candy-machine/overview) define multiple independent sets of [guards](/smart-contracts/core-candy-machine/guards), each identified by a unique label, so that different access-control rules apply to different minting phases or audiences.

- Each group carries its own guard configuration and a label of up to 6 characters that buyers specify when [minting](/smart-contracts/core-candy-machine/mint).
- Default (global) guards are inherited by every group unless explicitly overridden at the group level.
- Groups can run sequentially (time-gated tiers) or in parallel (holder discount alongside a public sale).
- When groups exist, minting from the default guards alone is not possible; a group label is always required.

On one of [the previous pages](/smart-contracts/core-candy-machine/guards), we introduced guards and used them to define the access control of our Candy Machines. We've seen that using guards, we can for instance add payments of 1 SOL per mint and ensure the mint start after a certain date. But what if we also wanted to charge 2 SOL after a second date? What if we wanted to allow certain token holders to mint for free or at a discounted price? {% .lead %}

What if we could define multiple sets of guards that each have their own requirements? For that reason, we've created **Guard Groups**!

## How Guard Groups Work

Guard Groups extend the standard [guard](/smart-contracts/core-candy-machine/guards) system by letting you attach multiple named sets of guard configurations to a single Core Candy Machine. Each set is identified by a short label and evaluated independently at mint time.

Therefore, each Guard Group has the following attributes:

- **Label**: A unique text identifier. This cannot be longer than 6 characters.
- **Guards**: The settings for all activated guards within that group. This works just like setting up guards directly on the Core Candy Machine.

Let's take a quick example. Say we wanted to charge 1 SOL from 4 pm to 5 pm and then 2 SOL from 5 pm until the Core Candy Machine is exhausted. All of that whilst making sure we are protected against bots via the Bot Tax guard. Here's how we could set up our guards:

- Group 1:
  - **Label**: "early"
  - **Guards**:
    - Sol Payment: 1 SOL
    - Start Date: 4 pm (ignoring the actual date here for the sake of simplicity)
    - End Date: 5 pm
    - Bot Tax: 0.001 SOL
- Group 2:
  - **Label**: "late"
  - **Guards**:
    - Sol Payment: 2 SOL
    - Start Date: 5 pm
    - Bot Tax: 0.001 SOL

And just like that, we've created a customized 2-tier minting process!

Now, whenever someone tries to [mint](/smart-contracts/core-candy-machine/mint) from our Core Candy Machine, **they will have to explicitly tell us which group they are minting from**. Asking for the group label when minting is important because:

- It ensures buyers do not experience unexpected minting behaviour. Say we tried to mint for 1 SOL at the very end of the first group's end date but, by the time the transaction executes, we're now past that date. If we didn't ask for the group label, the transaction would succeed and we would be charged 2 SOL even though we expected to only be charged 1 SOL.
- It makes it possible to support parallel groups. We'll talk more about this later on this page.

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

Now let's see how we can create and update groups using our SDKs.

{% dialect-switcher title="Create a Candy Machine with guard groups" %}
{% dialect title="JavaScript" id="js" %}

To create Candy Machines with guard groups, simply provide the `groups` array to the `create` function. Each item of this array must contain a `label` and a `guards` object containing the settings of all guards we wish to activate in that group.

Here's how we'd implement the above example using the Umi library.

```ts
import { some, sol, dateTime } from '@metaplex-foundation/umi'

await create(umi, {
  // ...
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
        solPayment: some({ lamports: sol(2), destination: treasury }),
        startDate: some({ date: dateTime('2022-10-18T17:00:00Z') }),
        botTax: some({ lamports: sol(0.001), lastInstruction: true }),
      },
    },
  ],
}).sendAndConfirm(umi)
```

To update groups, simply provide that same `groups` attribute to the `updateCandyGuard` function.
Please note that the entire `guards` object and `groups` array will be updated meaning **it will override all existing data**!

Therefore, make sure to provide the settings for all your groups, even if their settings are not changing. You may want to fetch the latest candy guard account data beforehand to avoid overwriting any existing settings.

Here's an example, changing the SOL payment guard for the "late" group to 3 SOL instead of 2 SOL.

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

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [updateCandyGuard](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/updateCandyGuard.html), [DefaultGuardSetArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## Default Guards and Guard Group Inheritance

Default (global) guards act as a shared baseline that every guard group inherits automatically. When a group does not explicitly enable a guard, it falls back to the default setting; when a group does enable the same guard, the group-level setting takes precedence.

Here's a quick recap:

- If a guard is enabled on the default guards but not on the group's guards, the group uses the guard **as defined in the default guards**.
- If a guard is enabled on the default guards _and_ on the group's guards, the group uses the guard **as defined in the group's guards**.
- If a guard is not enabled on the default guards or the group's guards, the group does not use this guard.

To illustrate that, let's take our example from the previous section and move the **Bot Tax** guard to the default guards.

- Default Guards:
  - Bot Tax: 0.001 SOL
- Group 1:
  - **Label**: "early"
  - **Guards**:
    - Sol Payment: 1 SOL
    - Start Date: 4 pm
    - End Date: 5 pm
- Group 2:
  - **Label**: "late"
  - **Guards**:
    - Sol Payment: 2 SOL
    - Start Date: 5 pm

As you can see, default guards are useful to avoid repetition within your groups.

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Candy Machine" theme="blue" /%}
{% node label="Owner: Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node label="Guards (default guards)" theme="mint" z=1 /%}
{% node label="Bot Tax" /%}
{% node #group-1 theme="mint" z=1 %}
Group 1: "early" {% .font-semibold %}
{% /node %}
{% node label="Sol Payment" /%}
{% node label="Start Date" /%}
{% node label="End Date" /%}
{% node theme="mint" z=1 %}
Group 2: "late"
{% /node %}
{% node label="Sol Payment" /%}
{% node label="Start Date" /%}
{% /node %}

{% node parent="candy-machine-1" x=350 %}
{% node #mint-1 label="Mint" theme="pink" /%}
{% node label="Candy Guard Program" theme="pink" /%}
{% /node %}
{% node parent="mint-1" x=45 y=-20 label="Access Control" theme="transparent" /%}

{% node parent="mint-1" x=-22 y=100 %}
{% node #mint-2 label="Mint" theme="pink" /%}
{% node label="Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="mint-2" x=120 y=-20 label="Mint Logic" theme="transparent" /%}

{% node #nft parent="mint-2" x=62 y=100 label="NFT" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="group-1" to="mint-1" theme="pink" /%}

{% /diagram %}

{% callout type="warning" %}
Even when using default guards, a group label must be provided when minting. When guard groups are configured, it is **not possible to mint using the default guards only**.
{% /callout %}

{% dialect-switcher title="Create a Candy Machine with default guards and guard groups" %}
{% dialect title="JavaScript" id="js" %}

To use default guards in the Umi library, simply use the `guards` attribute in conjunction with the `groups` array when creating or updating a Candy Machine. For instance, here's how you'd create a Candy Machine using the guard settings described above.

```ts
import { some, sol, dateTime } from '@metaplex-foundation/umi'

await create(umi, {
  // ...
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

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [DefaultGuardSetArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## Parallel Guard Groups

Parallel guard groups allow two or more groups to be valid at the same time, letting buyers choose which group to mint from. Requiring a group label in the mint instruction eliminates ambiguity and makes concurrent groups possible.

Let's illustrate that with a new example. Say we have an Asset collection called "Innocent Bird" and we want to offer a discounted price of 1 SOL to anyone holding an "Innocent Bird" Asset and charge anyone else 2 SOL. We want both of these groups to be able to start minting at the same time — say 4 pm — and we also want to be protected against bots for both groups. Here's how we could configure our guards:

- Default Guards:
  - Start Date: 4 pm
  - Bot Tax: 0.001 SOL
- Group 1:
  - **Label**: "nft"
  - **Guards**:
    - Sol Payment: 1 SOL
    - NFT Gate: "Innocent Bird" Collection
- Group 2:
  - **Label**: "public"
  - **Guards**:
    - Sol Payment: 2 SOL

As you can see, with these guard settings, it is possible for both groups to mint at the same time. It is even possible for an NFT holder to pay the full 2 SOL should they decide to mint from the "public" group. However, it is in their best interest to select the "nft" group if they can.

{% dialect-switcher title="Create a Core Candy Machine with parallel groups" %}
{% dialect title="JavaScript" id="js" %}

Here's how you'd create a Core Candy Machine using the guard settings described above via the Umi library.

```ts
import { some, sol, dateTime } from '@metaplex-foundation/umi'

await create(umi, {
  // ...
  guards: {
    botTax: some({ lamports: sol(0.001), lastInstruction: true }),
    startDate: some({ date: dateTime('2022-10-18T16:00:00Z') }),
  },
  groups: [
    {
      label: 'early',
      guards: {
        solPayment: some({ amount: sol(1), destination: treasury }),
        nftGate: some({
          requiredCollection: innocentBirdCollectionNft.publicKey,
        }),
      },
    },
    {
      label: 'late',
      guards: {
        solPayment: some({ amount: sol(2), destination: treasury }),
      },
    },
  ],
}).sendAndConfirm(umi)
```

API References: [create](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/create.html), [DefaultGuardSetArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## Notes

- Guard group labels are limited to a maximum of **6 characters**. Exceeding this limit will cause the transaction to fail.
- When guard groups are configured, groups **override** any default guard they explicitly enable. Disabled guards in a group fall back to the default value.
- Buyers **must specify a group label** in every mint transaction when groups are present. There is no way to mint from the default guards alone.
- Updating guard groups via `updateCandyGuard` replaces the **entire** guards and groups configuration. Always include all groups in the update, even unchanged ones, to avoid data loss.
- All groups share the same Core Candy Machine item pool. Use per-group guards such as Allocation if you need to cap supply per group.
- For guards that require a [route instruction](/smart-contracts/core-candy-machine/guard-route) (such as Allow List verification), the route call must also include the group label so the correct guard configuration is evaluated.

## Conclusion

Guard groups bring a whole new dimension to our Core Candy Machines by allowing us to define sequential and/or parallel minting workflows tailored to our needs.

On [the next page](/smart-contracts/core-candy-machine/guard-route), we'll see yet another exciting feature about guards: Guard instructions!

## FAQ

### What is the maximum label length for a guard group?

Guard group labels must be 6 characters or fewer. The on-chain account structure enforces this limit, so any label exceeding 6 characters will cause the transaction to fail.

### Can I mint using only the default guards when guard groups are configured?

No. When guard groups are present, every [mint](/smart-contracts/core-candy-machine/mint) transaction must specify a group label. It is not possible to mint from the default guards alone; the default guards only serve as inherited fallback settings for the groups.

### Do guard groups share a single item pool or does each group have its own supply?

All guard groups draw from the same Core Candy Machine item pool. There is no per-group supply limit unless you add a guard such as Allocation within each group to cap how many items that group can distribute.

### How do parallel guard groups handle overlapping time windows?

When two or more groups have overlapping start and end dates, buyers choose which group to mint from by specifying the group label in the mint instruction. The Candy Guard program evaluates only the [guards](/smart-contracts/core-candy-machine/guards) in the selected group (merged with default guards), so both groups can operate simultaneously without conflict.

### What happens if I update guard groups on an existing Candy Machine?

The `updateCandyGuard` instruction replaces the entire guards and groups configuration at once. You must include every group in the update call, even groups whose settings have not changed, or they will be removed. Fetch the current Candy Guard account data before updating to avoid accidentally overwriting existing settings.

## Glossary

| Term | Definition |
|------|------------|
| Guard Group | A named set of guard configurations attached to a Core Candy Machine, identified by a unique label. |
| Label | A string identifier (maximum 6 characters) that uniquely identifies a guard group and must be specified in the mint instruction. |
| Default Guards | The global guard settings on a Core Candy Machine that every guard group inherits unless explicitly overridden. |
| Resolved Guards | The final set of guard settings applied at mint time, produced by merging a group's guards with the default guards. |
| Parallel Guard Groups | Two or more guard groups whose time windows overlap, allowing buyers to choose which group to mint from at the same time. |
| Candy Guard | The on-chain account that stores all guard and group configurations for a Core Candy Machine and acts as its mint authority. |
| Bot Tax | A guard that charges a small SOL penalty to wallets that fail other guard checks, used to deter bot activity. |
| Route Instruction | A special instruction on the Candy Guard program that executes guard-specific logic outside of the mint flow, such as Allow List verification. |

