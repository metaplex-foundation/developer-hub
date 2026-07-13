---
title: Get Assets
metaTitle: Get Assets | DAS API
description: Returns the information of multiple compressed/standard assets
tableOfContents: false
---

Returns the information of multiple compressed/standard assets including their metadata and owners.

## Parameters

| Name  | Required | Description            |
| ----- | :------: | ---------------------- |
| `ids` |    ✅    | An array of asset ids. |
| `options` |          | Display options object. See [Display Options](/dev-tools/das-api/display-options) for details. |

## Agent Fields (`MplCoreAsset`)

Each item in the response array uses the same asset shape as [`getAsset`](/dev-tools/das-api/methods/get-asset#agent-fields-mplcoreasset). `MplCoreAsset` rows may include `is_agent`, `asset_signer`, and `agent_token`.

See [Read Agent Data](/agents/read-agent-data#read-agent-data-via-das-api) for field definitions and examples.

## Playground

{% apiRenderer method="getAssets" /%}
