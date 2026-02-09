---
title: Get Asset Proofs
metaTitle: Get Asset Proofs | DAS API
description: Returns the merkle tree proof information for multiple compressed assets
tableOfContents: false
---

Returns the merkle tree proof information for multiple compressed assets. This method is used to verify the authenticity of compressed NFTs by retrieving their merkle proofs.

## Parameters

| Name            | Required | Description                                |
| --------------- | :------: | ------------------------------------------ |
| `ids`           |    ✅    | An array of asset ids to get proofs for.   |

## Playground

{% apiRenderer method="getAssetProofs" /%}
