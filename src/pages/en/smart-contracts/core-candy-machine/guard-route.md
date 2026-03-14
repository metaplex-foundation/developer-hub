---
title: Route Instruction for Core Candy Machine Guards
metaTitle: Route Instruction for Core Candy Machine Guards | Core Candy Machine
description: The Route instruction allows individual guards on a Core Candy Machine to expose their own custom on-chain logic, such as pre-validation steps that run before minting.
keywords:
  - route instruction
  - core candy machine
  - candy guard
  - guard instructions
  - allow list
  - merkle proof
  - merkle tree
  - pre-validation
  - minting guards
  - Solana NFT
  - Metaplex
  - guard groups
  - custom guard logic
  - PDA verification
about:
  - Route instruction
  - Guard instructions
  - Pre-validation
proficiencyLevel: Intermediate
programmingLanguage:
  - JavaScript
  - TypeScript
created: '03-10-2026'
updated: '03-10-2026'
faqs:
  - q: Which guards support the Route instruction?
    a: Not all guards support the Route instruction. Only guards that require pre-validation or custom on-chain logic expose a route handler. The Allow List guard is the most common example, using route to verify Merkle Proofs before minting. Check each guard's dedicated documentation page for route support details.
  - q: What happens if I call the Route instruction on a guard that does not support it?
    a: The transaction will fail. The Core Candy Guard program rejects route calls directed at guards that have not implemented a route handler. Always verify that a guard supports the route instruction before calling it.
  - q: Why does the Allow List guard use a separate Route instruction instead of verifying during minting?
    a: Large allow lists produce Merkle Proofs that can exceed the transaction size limit when combined with the mint instruction's own data. By separating proof verification into a dedicated route transaction, the Allow List guard can support arbitrarily large lists without hitting Solana's transaction size constraints.
  - q: Do I need to specify a group label when calling the Route instruction?
    a: Only when your Core Candy Machine uses guard groups. If the same guard type appears in multiple groups, the program needs the group label to identify which guard instance should handle the route call. Without groups, the group parameter is not required.
  - q: What is the Path attribute in route settings?
    a: The Path attribute distinguishes between multiple features offered by a single guard's route instruction. For example, a guard supporting Frozen NFTs might use path "init" to initialize an escrow account and path "thaw" to unfreeze a minted NFT. Each guard defines its own set of valid paths.
---

## Summary

The Route instruction is a special instruction in the Core Candy Guard program that delegates execution to a specific [guard](/smart-contracts/core-candy-machine/guards), enabling guards to run custom on-chain logic outside of the standard [minting](/smart-contracts/core-candy-machine/mint) flow.

- Routes a request to a selected guard so it can execute its own program logic independently of the mint transaction.
- Enables pre-validation workflows such as Merkle Proof verification for the [Allow List guard](/smart-contracts/core-candy-machine/guards/allow-list).
- Supports a **Path** attribute to distinguish between multiple features within a single guard's route handler.
- Requires a **group label** when the Core Candy Machine uses [guard groups](/smart-contracts/core-candy-machine/guard-groups).

As we've seen on the previous pages, guards are a powerful way to customize the minting process of your Candy Machines. But did you know guards can even provide their own custom instructions? {% .lead %}

## The Route Instruction

The Route instruction is a dedicated entry point in the Core Candy Guard program that forwards a request to a specific guard, allowing that guard to execute custom on-chain logic independently of the mint transaction.

This instruction allows us to **select a specific guard** from our Core Candy Machine and **run a custom instruction** that is specific to this guard. We call it the "Route" instruction because it will route our request to the selected guard.

This feature makes guards even more powerful as they can ship with their own program logic. It enables guards to:

- Decouple the verification process from the minting process for heavy operations.
- Provide custom features that would otherwise require the deployment of a custom program.

To call a route instruction, we must specify which guard we want to route that instruction to as well as **provide the route settings it expects**.

{% callout type="warning" %}
If you execute the Route instruction by selecting a guard that does not support it, the transaction will fail. Check the [guard's documentation page](/smart-contracts/core-candy-machine/guards) to confirm route support before calling it.
{% /callout %}

Since there can only be one "route" instruction per registered guard on a Candy Guard program, it is common to provide a **Path** attribute in the route settings to distinguish between multiple features offered by the same guard.

For instance, a guard adding support for Frozen NFTs — that can only be thawed once minting is over — could use their route instruction to initialize the treasury escrow account as well as allow anyone to thaw a minted NFT under the right conditions. We could distinguish these two features by using a **Path** attribute equal to "init" for the former and "thaw" for the latter.

You will find a detailed explanation of the route instruction of each guard that supports it and their underlying paths [on their respective pages](/smart-contracts/core-candy-machine/guards).

### Allow List Guard Route Example

The [Allow List guard](/smart-contracts/core-candy-machine/guards/allow-list) is the most common guard that uses the Route instruction, verifying that a minting wallet belongs to a preconfigured list of allowed wallets before permitting the mint.

It does that using [Merkle Trees](https://en.m.wikipedia.org/wiki/Merkle_tree) which means we need to create a hash of the entire list of allowed wallets and store that hash — known as the **Merkle Root** — on the guard settings. For a wallet to prove it is on the allowed list, it must provide a list of hashes — known as the **Merkle Proof** — that allows the program to compute the Merkle Root and ensure it matches the guard's settings.

Therefore, the Allow List guard **uses its route instruction to verify the Merkle Proof of a given wallet** and, if successful, creates a small PDA account on the blockchain that acts as verification proof for the mint instruction.

{% diagram %}

{% node %}
{% node #candy-machine-1 label="Candy Machine" theme="blue" /%}
{% node label="Owner: Candy Machine Core Program" theme="dimmed" /%}
{% /node %}

{% node parent="candy-machine-1" y=80 x=20 %}
{% node #candy-guard-1 label="Candy Guard" theme="blue" /%}
{% node label="Owner: Candy Guard Program" theme="dimmed" /%}
{% node label="Guards" theme="mint" z=1 /%}
{% node #allow-list-guard label="Allow List" /%}
{% node label="..." /%}
{% /node %}

{% node parent="candy-machine-1" x=550 %}
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

{% node parent="mint-2" x=-250 %}
{% node #route label="Route" theme="pink" /%}
{% node label="Candy Machine Core Program" theme="pink" /%}
{% /node %}
{% node parent="route" x=70 y=-20 label="Verify Merkle Proof" theme="transparent" /%}

{% node #allow-list-pda parent="route" x=23 y=100 label="Allow List PDA" /%}

{% edge from="candy-guard-1" to="candy-machine-1" fromPosition="left" toPosition="left" arrow=false /%}
{% edge from="mint-1" to="mint-2" theme="pink" path="straight" /%}
{% edge from="mint-2" to="nft" theme="pink" path="straight" /%}
{% edge from="candy-machine-1" to="mint-1" theme="pink" /%}
{% edge from="allow-list-guard" to="route" theme="pink" /%}
{% edge from="route" to="allow-list-pda" theme="pink" path="straight" /%}
{% edge from="allow-list-pda" to="mint-1" theme="pink" /%}

{% /diagram %}

So why can't we just verify the Merkle Proof directly within the mint instruction? That's simply because, for big allow lists, Merkle Proofs can end up being pretty lengthy. After a certain size, it becomes impossible to include it within the mint transaction that already contains a decent amount of instructions. By separating the validation process from the minting process, we make it possible for allow lists to be as big as we need them to be.

{% dialect-switcher title="Call the route instruction of a guard" %}
{% dialect title="JavaScript" id="js" %}

You may use the `route` function to call the route instruction of a guard using the Umi library. You will need to pass the guard's name via the `guard` attribute and its route settings via the `routeArgs` attribute.

Here is an example using the Allow List guard which validates the wallet's Merkle Proof before minting.

```ts
import {
  create,
  route,
  getMerkleProof,
  getMerkleRoot,
} from '@metaplex-foundation/mpl-core-candy-machine'

// Prepare the allow list.
// Let's assume the first wallet on the list is the Metaplex identity.
const allowList = [
  'GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS',
  '2vjCrmEFiN9CLLhiqy8u1JPh48av8Zpzp3kNkdTtirYG',
  'AT8nPwujHAD14cLojTcB1qdBzA1VXnT6LVGuUd6Y73Cy',
]
const merkleRoot = getMerkleRoot(allowList)

// Create a Candy Machine with an Allow List guard.
await create(umi, {
  // ...
  guards: {
    allowList: some({ merkleRoot }),
  },
}).sendAndConfirm(umi)

// If we try to mint now, it will fail because
// we did not verify our Merkle Proof.

// Verify the Merkle Proof using the route instruction.
await route(umi, {
  candyMachine: candyMachine.publicKey,
  guard: 'allowList',
  routeArgs: {
    path: 'proof',
    merkleRoot,
    merkleProof: getMerkleProof(
      allowList,
      'GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS'
    ),
  },
}).sendAndConfirm(umi)

// If we try to mint now, it will succeed.
```

API References: [route](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/route.html), [DefaultGuardSetRouteArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetRouteArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## Route Instruction with Guard Groups

The Route instruction requires a group label when the Core Candy Machine uses [guard groups](/smart-contracts/core-candy-machine/guard-groups), because the same guard type may appear in multiple groups and the program must know which instance to target.

For instance, say we had an **Allow List** of handpicked VIP wallets in one group and another **Allow List** for the winners of a raffle in another group. Then saying we want to verify the Merkle Proof for the Allow List guard is not enough, we also need to know for which group we should perform that verification.

{% dialect-switcher title="Filter by group when calling the route instruction" %}
{% dialect title="JavaScript" id="js" %}

When using groups, the `route` function of the Umi library accepts an additional `group` attribute of type `Option<string>` which must be set to the label of the group we want to select.

```ts
import {
  create,
  route,
  getMerkleProof,
  getMerkleRoot,
} from "@metaplex-foundation/mpl-core-candy-machine";
import { base58PublicKey, some } from "@metaplex-foundation/umi";

// Prepare the allow lists.
const allowListA = [...];
const allowListB = [...];

// Create a Candy Machine with two Allow List guards.
await create(umi, {
  // ...
  groups: [
    {
      label: "listA",
      guards: {
        allowList: some({ merkleRoot: getMerkleRoot(allowListA) }),
      },
    },
    {
      label: "listB",
      guards: {
        allowList: some({ merkleRoot: getMerkleRoot(allowListB) }),
      },
    },
  ],
}).sendAndConfirm(umi);

// Verify the Merkle Proof by specifying which group to select.
await route(umi, {
  candyMachine: candyMachine.publicKey,
  guard: 'allowList',
  group: some('listA'), // <- We are verifying using "allowListA".
  routeArgs: {
    path: 'proof',
    merkleRoot: getMerkleRoot(allowListA),
    merkleProof: getMerkleProof(
      allowListA,
      base58PublicKey(umi.identity),
    ),
  },
}).sendAndConfirm(umi);
```

API References: [route](https://mpl-core-candy-machine.typedoc.metaplex.com/functions/route.html), [DefaultGuardSetRouteArgs](https://mpl-core-candy-machine.typedoc.metaplex.com/types/DefaultGuardSetRouteArgs.html)

{% /dialect %}
{% /dialect-switcher %}

## Notes

- Not all [guards](/smart-contracts/core-candy-machine/guards) support the Route instruction. Only guards that require pre-validation or expose additional on-chain features implement a route handler.
- Calling the Route instruction on a guard that does not support it will cause the transaction to fail.
- When using [guard groups](/smart-contracts/core-candy-machine/guard-groups), the `group` label is required so the program can identify which guard instance should handle the route call.
- Each guard can only have one route instruction, but the **Path** attribute allows a single route handler to expose multiple distinct features.
- The Route instruction is separate from the [mint](/smart-contracts/core-candy-machine/mint) transaction. Any on-chain state it creates (such as the Allow List PDA) persists and is checked during minting.

## FAQ

### Which guards support the Route instruction?

Not all guards support the Route instruction. Only guards that require pre-validation or custom on-chain logic expose a route handler. The [Allow List guard](/smart-contracts/core-candy-machine/guards/allow-list) is the most common example, using route to verify Merkle Proofs before [minting](/smart-contracts/core-candy-machine/mint). Check each guard's [dedicated documentation page](/smart-contracts/core-candy-machine/guards) for route support details.

### What happens if I call the Route instruction on a guard that does not support it?

The transaction will fail. The Core Candy Guard program rejects route calls directed at [guards](/smart-contracts/core-candy-machine/guards) that have not implemented a route handler. Always verify that a guard supports the route instruction before calling it.

### Why does the Allow List guard use a separate Route instruction instead of verifying during minting?

Large allow lists produce Merkle Proofs that can exceed the transaction size limit when combined with the [mint](/smart-contracts/core-candy-machine/mint) instruction's own data. By separating proof verification into a dedicated route transaction, the [Allow List guard](/smart-contracts/core-candy-machine/guards/allow-list) can support arbitrarily large lists without hitting Solana's transaction size constraints.

### Do I need to specify a group label when calling the Route instruction?

Only when your Core Candy Machine uses [guard groups](/smart-contracts/core-candy-machine/guard-groups). If the same guard type appears in multiple groups, the program needs the group label to identify which guard instance should handle the route call. Without groups, the group parameter is not required.

### What is the Path attribute in route settings?

The Path attribute distinguishes between multiple features offered by a single guard's route instruction. For example, a guard supporting Frozen NFTs might use path "init" to initialize an escrow account and path "thaw" to unfreeze a minted NFT. Each guard defines its own set of valid paths.

## Glossary

| Term | Definition |
|------|------------|
| Route Instruction | A special instruction in the Core Candy Guard program that delegates execution to a specific guard, enabling that guard to run custom on-chain logic outside of the mint transaction. |
| Merkle Tree | A hash-based data structure where each leaf node is a hash of data and each non-leaf node is a hash of its children, used to efficiently verify membership in a large dataset. |
| Merkle Proof | An ordered list of hashes that allows verification that a specific element belongs to a Merkle Tree without revealing the entire tree. |
| Merkle Root | The single top-level hash of a Merkle Tree that represents the entire dataset; stored in the Allow List guard settings for on-chain comparison. |
| Path | An attribute in the route settings that distinguishes between multiple features exposed by a single guard's route handler (e.g., "init" vs. "thaw"). |
| Allow List PDA | A program-derived account created by the Allow List guard's route instruction to record that a wallet has successfully verified its Merkle Proof, serving as proof for the subsequent mint transaction. |
| Guard Groups | Named sets of guards on a Core Candy Machine that allow different minting conditions for different audiences, requiring a group label when calling the route instruction. |

