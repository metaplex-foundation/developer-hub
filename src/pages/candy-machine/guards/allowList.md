---
description: "Uses a wallet address list to determine who is allowed to mint."
---

# Allow List

## Overview

The **Allow List** guard validates the minting wallet against a predefined list of wallets. If the minting wallet is not part of this list, minting will fail.

Providing a big list of wallets in the settings of this guard would require a lot of storage on the blockchain and would likely need more than one transaction to insert them all. Therefore, the Allow List guard uses [**Merkle Trees**](https://en.m.wikipedia.org/wiki/Merkle_tree) to verify that the minting wallet is part of the preconfigured list of wallets.

This works by creating a binary tree of hashes where all leaves hash themselves two by two until we reach the final hash known as the **Merkle Root**. This means that if any leaf were to change, the final Merkle Root would be corrupted.

TODO: Update image
![CandyMachinesV3-GuardsAllowListMerkleTree1.png](/assets/candy-machine-v3/CandyMachinesV3-GuardsAllowListMerkleTree1.png#radius)

To verify that a leaf is part of the tree, we simply need a list of all the intermediary hashes that allow us to go up the tree and re-compute the Merkle Root. We call this list of intermediary hashes a **Merkle Proof**. If the computed Merkle Root matches the stored Merkle Root, we can be sure that the leaf is part of the tree and therefore part of the original list.

TODO: Update image
![CandyMachinesV3-GuardsAllowListMerkleTree2.png](/assets/candy-machine-v3/CandyMachinesV3-GuardsAllowListMerkleTree2.png#radius)

Therefore, the Allow List guard’s settings require a Merkle Root which acts as a source of truth for the preconfigured list of allowed wallets. For a wallet to prove it is on the allowed list, it must provide a valid Merkle Proof that allows the program to re-compute the Merkle Root and ensure it matches the guard’s settings.

Note that our SDKs provide helpers to make it easy to create Merkle Root and Merkle Proofs for a given list of wallets.

TODO: Update image
![CandyMachinesV3-GuardsAllowList.png](/assets/candy-machine-v3/CandyMachinesV3-GuardsAllowList.png#radius)

## Guard Settings

The Allow List guard contains the following settings:

- **Merkle Root**: The Root of the Merkle Tree representing the allow list.

{% dialect-switcher title="Set up a Candy Machine using the Address Gate guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

To help us manage Merkle Trees, the Umi library provides two helper methods called `getMerkleRoot` and `getMerkleProof` that you may use like so.

```ts
import {
  getMerkleProof,
  getMerkleRoot,
} from "@metaplex-foundation/mpl-candy-machine";

const allowList = [
  "Ur1CbWSGsXCdedknRbJsEk7urwAvu1uddmQv51nAnXB",
  "GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS",
  "AT8nPwujHAD14cLojTcB1qdBzA1VXnT6LVGuUd6Y73Cy",
];

const merkleRoot = getMerkleRoot(allowList);
const validMerkleProof = getMerkleProof(
  allowList,
  "Ur1CbWSGsXCdedknRbJsEk7urwAvu1uddmQv51nAnXB"
);
const invalidMerkleProof = getMerkleProof(allowList, "invalid-address");
```

Once we have computed the Merkle Root of our allow list, we can use it to set up the Allow List guard on our Candy Machine.

```ts
import { getMerkleRoot } from "@metaplex-foundation/mpl-candy-machine";

const allowList = [
  "Ur1CbWSGsXCdedknRbJsEk7urwAvu1uddmQv51nAnXB",
  "GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS",
  "AT8nPwujHAD14cLojTcB1qdBzA1VXnT6LVGuUd6Y73Cy",
];

create(umi, {
  // ...
  guards: {
    allowList: some({ merkleRoot: getMerkleRoot(allowList) }),
  },
});
```

API References: [create](https://mpl-candy-machine-js-docs.vercel.app/functions/create.html), [AllowList](https://mpl-candy-machine-js-docs.vercel.app/types/AllowList.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

Sugar does not contain a function to create manage the merkle root. When using a allowlist with sugar you would have to compute it beforehand e.g. with the previously described JavaScript function or [sol-tools](//TODO: Add tony's page) and than add the merkle root hash to your config like this:

```json
"allowList" : {
    "merkleRoot": "<HASH>"
}
```

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Mint Settings

The Allow List guard contains the following Mint Settings:

- **Merkle Root**: The Root of the Merkle Tree representing the allow list.

Note that, before being able to mint, **we must validate the minting wallet by providing a Merkle Proof**. See [Validate a Merkle Proof](#validate-a-merkle-proof) below for more details.

Also note that, if you’re planning on constructing instructions without the help of our SDKs, you will need to add the Allow List Proof PDA to the remaining accounts of the mint instruction. See the [Candy Guard’s program documentation](https://github.com/metaplex-foundation/mpl-candy-machine/tree/main/programs/candy-guard#allowlist) for more details.

{% dialect-switcher title="Set up a Candy Machine using the Address Gate guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

You may pass the Mint Settings of the Allow List guard using the `mintArgs` argument like so.

```ts
import { getMerkleRoot } from "@metaplex-foundation/mpl-candy-machine";

const allowList = [
  "Ur1CbWSGsXCdedknRbJsEk7urwAvu1uddmQv51nAnXB",
  "GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS",
  "AT8nPwujHAD14cLojTcB1qdBzA1VXnT6LVGuUd6Y73Cy",
];

mintV2(umi, {
  // ...
  mintArgs: {
    allowList: some({ merkleRoot: getMerkleRoot(allowList) }),
  },
});
```

API References: [mintV2](https://mpl-candy-machine-js-docs.vercel.app/functions/mintV2.html), [AllowListMintArgs](https://mpl-candy-machine-js-docs.vercel.app/types/AllowListMintArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_As soon as a guard is assigned you cannot use sugar to mint - therefore there are no specific mint settings._

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}

## Route Instruction

The Allow List route instruction supports the following features.

### Validate a Merkle Proof

_Path: `proof`_

Instead of passing the Merkle Proof directly to the mint instruction, the minting wallet must perform a [Pre-Validation](/programs/candy-machine/minting#minting-with-pre-validation) by using the route instruction of the Allow List guard.

This route instruction will compute the Merkle Root from the provided Merkle Proof and, if valid, will create a new PDA account acting as proof that the minting wallet is part of the allowed list. Therefore, when minting, the Allow List guard only needs to check for the existence of this PDA account to authorize or deny minting to the wallet.

So why can’t we just verify the Merkle Proof directly within the mint instruction? That’s simply because, for big allow lists, Merkle Proofs can end up being pretty lengthy. After a certain size, it becomes impossible to include it within the mint transaction that already contains a decent amount of instructions. By separating the validation process from the minting process, we make it possible for allow lists to be as big as we need them to be.

This path of the route instruction accepts the following arguments:

- **Path** = `proof`: Selects the path to execute in the route instruction.
- **Merkle Root**: The Root of the Merkle Tree representing the allow list.
- **Merkle Proof**: The list of intermediary hashes that should be used to compute the Merkle Root and verify that it matches the Merkle Root stored on the guard’s settings.
- **Minter** (optional): The minter account as a signer if it is not the same as the payer. When provided, this account must be part of the allow list for the proof to be valid.

{% dialect-switcher title="Set up a Candy Machine using the Address Gate guard" %}
{% dialect title="JavaScript" id="js" %}
{% totem %}

You may pass the "Proof" Route Settings of the Allow List guard using the `routeArgs` argument like so.

```ts
import {
  getMerkleProof,
  getMerkleRoot,
} from "@metaplex-foundation/mpl-candy-machine";
import { publicKey } from "@metaplex-foundation/umi";

const allowList = [
  "Ur1CbWSGsXCdedknRbJsEk7urwAvu1uddmQv51nAnXB",
  "GjwcWFQYzemBtpUoN5fMAP2FZviTtMRWCmrppGuTthJS",
  "AT8nPwujHAD14cLojTcB1qdBzA1VXnT6LVGuUd6Y73Cy",
];

await route(umi, {
  // ...
  guard: "allowList",
  routeArgs: {
    path: "proof",
    merkleRoot: getMerkleRoot(allowList),
    merkleProof: getMerkleProof(allowList, publicKey(umi.identity)),
  },
}).sendAndConfirm(umi);
```

The `umi.identity` wallet is now allowed to mint from the Candy Machine.

API References: [route](https://mpl-candy-machine-js-docs.vercel.app/functions/route.html), [AllowListRouteArgs](https://mpl-candy-machine-js-docs.vercel.app/types/AllowListRouteArgs.html)

{% /totem %}
{% /dialect %}
{% dialect title="Sugar" id="sugar" %}
{% totem %}

_Sugar can not be used to call the "Proof" Route._ 

{% /totem %}
{% /dialect %}
{% /dialect-switcher %}