---
title: Overview
metaTitle: Overview | Bubblegum V2
description: Provides a high-level overview of Bubblegum V2 and compressed NFTs.
---

Bubblegum V2 is the latest iteration of the Metaplex Protocol program for creating and interacting with compressed NFTs (cNFTs) on Solana. Built for large-scale operations, Bubblegum V2 preserves all the benefits of the original Bubblegum while introducing powerful new features. Compressed NFTs make it possible to scale the creation of NFTs to new orders of magnitude by rethinking the way we store data onchain. {% .lead %}

{% callout %}
Please note that certain Bubblegum V2 instructions will require protocol fees. Please review the [Protocol Fees](/protocol-fees) page for up-to-date information.
{% /callout %}

{% quick-links %}

{% quick-link title="Getting Started" icon="InboxArrowDown" href="/bubblegum-v2/sdk" description="Find the language or library of your choice and get started with compressed NFTs." /%}

{% quick-link title="API reference" icon="CodeBracketSquare" href="https://mpl-bubblegum.typedoc.metaplex.com/" target="_blank" description="Looking for something specific? Have a peak at our API References and find your answer." /%}

{% /quick-links %}

## What's New in Bubblegum V2

Bubblegum V2 builds on the foundation of the original Bubblegum program while introducing several powerful new features:

- **Freeze and Thaw Functionality**: Two types of freeze/thaw are available: 1) cNFT owners can delegate freeze authority to a leaf delegate for asset-level control, providing flexibility for various use cases such as preventing transfers during specific events or implementing vesting mechanics.  2) If the `PermanentFreezeDelegate` plugin is enabled on collection creation, project creators can freeze and thaw cNFTs via the permanent freeze delegate for collection-wide control
- **MPL-Core Collections Integration**: Bubblegum V2 NFTs can now be added to MPL-Core collections instead of being limited to token metadata collections, allowing for greater flexibility and integration with the broader Metaplex ecosystem.
- **Royalty Enforcement**: Since Bubblegum V2 is using [MPL-Core](https://docs.metaplex.com/core/overview) Collections, it is possible to enforce royalties on cNFTs e.g. using a `ProgramDenyList`.
- **Soulbound NFTs**: cNFTs can now be made soulbound (non-transferrable), permanently binding them to their owner's wallet. This is perfect for credentials, proof of attendance, identity verification, and more. It requires the `PermanentFreezeDelegate` plugin to be enabled when creating the collection.
- **Allow Permanent Transfer**: The permanent transfer delegate can now transfer the cNFT to a new owner without interaction of the leaf owner if the `PermanentTransferDelegate` plugin is enabled on the collection.
- **Burning by Authority**: If the Collection has the `PermanentBurnDelegate` plugin enabled, the delegate could burn the NFT without the leaf owner's signature.
- **Attributes**: Attribute Data on collection level can be added using the MPL-Core `attributes` plugin.

To allow the above features to work, Bubblegum V2 introduces a new leaf schema (`LeafSchemaV2`). To learn more what leaves are used in Bubblegum V2, check out the following sections.

## LeafSchemaV2

Bubblegum V2 introduces a new leaf schema (LeafSchemaV2) which supports the additional features while maintaining backward compatibility. This new schema allows for:

- Integration with MPL-Core collections instead of traditional token metadata
- Supporting freezing/thawing functionality
- Enabling soulbound capabilities
Projects can choose to use the original leaf Schema by using Legacy Bubblegum or the new v2 schema with Bubblegum V2 depending on their requirements.

To use the new `LeafSchemaV2`, a V2 Merkle Tree has to be used that needs to be created using the [`createTreeV2` instruction](/bubblegum-v2/create-trees). V1 Merkle Trees do not support the new leaf schema and V2 Merkle Trees are not compatible with V1 leaves.

## Merkle Trees, leaves and proofs

Compressed NFTs only exist in the context of a **Merkle Tree**. We explain [in a dedicated advanced guide](/bubblegum-v2/concurrent-merkle-trees) what Merkle Trees are but, for the sake of this overview, you can think of a Merkle Tree as a collection of hashes that we call **Leaves**. Each Leaf is obtained by [hashing the data of the compressed NFT](/bubblegum-v2/hashed-nft-data).

For each Leaf in the Merkle Tree, one can provide a list of hashes — called a **Proof** — that enables anyone to verify that the given Leaf is part of that tree. Whenever a compressed NFT is updated or transferred, its associated Leaf will change and so will its Proof.

{% diagram %}

{% node #root label="Root Node" theme="slate" /%}
{% node #root-hash label="Hash" parent="root" x="56" y="40" theme="transparent" /%}
{% node #node-1 label="Node 1" parent="root" y="100" x="-200" theme="blue" /%}
{% node #node-1-hash label="Hash" parent="node-1" x="42" y="40" theme="transparent" /%}
{% node #node-2 label="Node 2" parent="root" y="100" x="200" theme="mint" /%}

{% node #node-3 label="Node 3" parent="node-1" y="100" x="-100" theme="mint" /%}
{% node #node-4 label="Node 4" parent="node-1" y="100" x="100" theme="blue" /%}
{% node #node-4-hash label="Hash" parent="node-4" x="42" y="40" theme="transparent" /%}
{% node #node-5 label="Node 5" parent="node-2" y="100" x="-100" /%}
{% node #node-6 label="Node 6" parent="node-2" y="100" x="100" /%}

{% node #leaf-1 label="Leaf 1" parent="node-3" y="100" x="-45" /%}
{% node #leaf-2 label="Leaf 2" parent="node-3" y="100" x="55" /%}
{% node #leaf-3 label="Leaf 3" parent="node-4" y="100" x="-45" theme="blue" /%}
{% node #leaf-4 label="Leaf 4" parent="node-4" y="100" x="55" theme="mint" /%}
{% node #leaf-5 label="Leaf 5" parent="node-5" y="100" x="-45" /%}
{% node #leaf-6 label="Leaf 6" parent="node-5" y="100" x="55" /%}
{% node #leaf-7 label="Leaf 7" parent="node-6" y="100" x="-45" /%}
{% node #leaf-8 label="Leaf 8" parent="node-6" y="100" x="55" /%}
{% node #nft label="NFT Data" parent="leaf-3" y="100" x="-12" theme="blue" /%}

{% node #proof-1 label="Leaf 4" parent="nft" x="200" theme="mint" /%}
{% node #proof-2 label="Node 3" parent="proof-1" x="90" theme="mint" /%}
{% node #proof-3 label="Node 2" parent="proof-2" x="97" theme="mint" /%}
{% node #proof-legend label="Proof" parent="proof-1" x="-6" y="-20" theme="transparent" /%}

{% edge from="node-1" to="root" fromPosition="top" toPosition="bottom" theme="blue" animated=true /%}
{% edge from="node-2" to="root" fromPosition="top" toPosition="bottom" theme="mint" animated=true /%}

{% edge from="node-3" to="node-1" fromPosition="top" toPosition="bottom" theme="mint" animated=true /%}
{% edge from="node-4" to="node-1" fromPosition="top" toPosition="bottom" theme="blue" animated=true /%}
{% edge from="node-6" to="node-2" fromPosition="top" toPosition="bottom" /%}
{% edge from="node-5" to="node-2" fromPosition="top" toPosition="bottom" /%}

{% edge from="leaf-1" to="node-3" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-2" to="node-3" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-4" to="node-4" fromPosition="top" toPosition="bottom" theme="mint" animated=true /%}
{% edge from="leaf-3" to="node-4" fromPosition="top" toPosition="bottom" theme="blue" animated=true /%}
{% edge from="leaf-5" to="node-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-6" to="node-5" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-7" to="node-6" fromPosition="top" toPosition="bottom" /%}
{% edge from="leaf-8" to="node-6" fromPosition="top" toPosition="bottom" /%}
{% edge from="nft" to="leaf-3" fromPosition="top" toPosition="bottom" theme="blue" animated=true label="Hash" /%}

{% /diagram %}

As such, Merkle Trees act as an onchain structure that allows anyone to verify a given compressed NFT exist. They do this without storing any NFT data which makes them so scalable.

Which brings us to an important question: where is the NFT data stored?

## Metaplex DAS API

When we mint a new compressed NFT, its data is hashed and added as a new Leaf in a Merkle Tree. But there's more. Additionally, the entire NFT data is stored in the transaction that created the compressed NFT. Similarly, when a compressed NFT is updated, its updated data is, once again, saved on the transaction as a changelog. So, while there aren't any accounts keeping track of that data, one can look at all previous transactions in the ledger and find that information.

{% diagram %}

{% node #tx-1 label="Transaction 1" /%}
{% node #tx-2 label="Transaction 2" parent="tx-1" y="50" /%}
{% node #tx-3 label="Transaction 3" parent="tx-2" y="50" /%}
{% node #tx-4 label="Transaction 4" parent="tx-3" y="50" /%}
{% node #tx-5 label="Transaction 5" parent="tx-4" y="50" /%}
{% node #tx-rest label="..." parent="tx-5" y="50" /%}

{% node #nft-1 label="Initial NFT Data" parent="tx-2" x="300" theme="blue" /%}
{% node #nft-2 label="NFT Data Changelog" parent="tx-3" x="300" theme="blue" /%}
{% node #nft-3 label="NFT Data Changelog" parent="tx-5" x="300" theme="blue" /%}

{% edge from="nft-1" to="tx-2" label="Stored in" /%}
{% edge from="nft-2" to="tx-3" label="Stored in" /%}
{% edge from="nft-3" to="tx-5" label="Stored in" /%}

{% /diagram %}

Crawling through millions of transactions every time just to fetch the data of one NFT is admittedly not the best user experience. Therefore, compressed NFTs rely on some RPCs to index that information in real time to abstract this away from the end-user. We call the resulting RPC API, which enables fetching compressed NFTs, **the Metaplex DAS API**.

Note that not all RPCs support the DAS API. As such, you may be interested in the ["Metaplex DAS API RPCs"](/rpc-providers) page to select an appropriate RPC when using compressed NFTs in your application.

We talk about this in more detail in our advanced ["Storing and indexing NFT data"](/bubblegum-v2/stored-nft-data) guide.

## Features

Even though NFT data does not live inside accounts, it is still possible to execute a variety of operations on compressed NFTs. This is possible by requesting the current NFT data and ensuring its hashed Leaf is valid on the Merkle Tree. As such, the following operations can be performed on compressed NFTs:

- [Mint a cNFT](/bubblegum-v2/mint-cnfts) with or without an associated collection.
- [Transfer a cNFT](/bubblegum-v2/transfer-cnfts).
- [Update the data or collection of a cNFT](/bubblegum-v2/update-cnfts).
- [Burn a cNFT](/bubblegum-v2/burn-cnfts).
- [Delegate a cNFT](/bubblegum-v2/delegate-cnfts).
- [Verify and unverify a cNFT collection](/bubblegum-v2/verify-collections).
- [Verify and unverify the creators of a cNFT](/bubblegum-v2/verify-creators).
- [Freeze and thaw a cNFT](/bubblegum-v2/freeze-cnfts).
- [Make a cNFT soulbound](/bubblegum-v2/freeze-cnfts#create-a-soulbound-c-nft).


## Next steps

Now that we know how compressed NFTs work at a high level and what's new in Bubblegum V2, we recommend checking out our [Getting Started](/bubblegum-v2/sdk) page which enumerates the various languages/frameworks that one can use to interact with compressed NFTs. Afterwards, the various [feature pages](/bubblegum-v2/create-trees) can be used to learn more about the specific operations that can be performed on cNFTs. Finally, [advanced guides](/bubblegum-v2/concurrent-merkle-trees) are also available to deepen your knowledge of cNFTs and Merkle Trees.
