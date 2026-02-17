---
title: Preparation
metaTitle: Preparation | MPL-Hybrid
description: How to prepare before creating a MPL-404 hybrid
---

## MPL-404 Planning

Before deploying the MPL-404 escrow and swap program, you should prepare a collection of NFTs and fungible tokens to be used. If you do not already have these prepared, we recommend utilizing [Metaplex Core](https://metaplex.com/docs/core) for the non-fungible tokens and the [Token Metadata program](https://metaplex.com/docs/token-metadata) to create the fungible tokens AFTER you have read the rest of this page..

To fund the escrow, you need to add NFTs, fungibles, or some mix of both. Practically it's easiest to fill the escrow with all the assets of one type while distributing all of the other. This will ensure the escrow stays balanced.

## off-chain Metadata URI Formatting

In order to take advantage of the metadata randomization feature of MPL-404, off-chain metadata URIs need to be consistently defined and increment. Consistent base URIs is not available from all the off-chain metadata solutions. Shadow Drive is one possible off-chain metadata solution with incrementing URIs. URIs should look like this:

- https://shdw-drive.genesysgo.net/.../0.json
- https://shdw-drive.genesysgo.net/.../1.json

...

- https://shdw-drive.genesysgo.net/.../999999.json

## Swap Randomization

Currently, the MPL-Hybrid program randomly picks a number between the min and max URI index provided and does not check to see if the URI is already used. As such, swapping suffers from the [Birthday Paradox](https://betterexplained.com/articles/understanding-the-birthday-paradox/). In order for projects to benefit from sufficient swap randomization, we recommend preparing and uploading a minimum of 250k asset metadata that can be randomly picked from. The more available potential assets the better.

## Thinking about Swap Fees and rarity

Swap fees play an important role beyond filling the project treasury. Swap fees need to be balanced with trait rarity to prevent rarity inflation. As a rule of thumb, the lower the fee the more rare the traits need to be. Overall, projects will want to have traits be significantly rarer than they would with a static collection.
