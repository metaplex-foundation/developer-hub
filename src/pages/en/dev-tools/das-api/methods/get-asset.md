---
title: Get Asset
metaTitle: Get Asset | DAS API
description: Returns the information of a compressed/standard asset
tableOfContents: false
---

Returns the information of a compressed/standard asset including metadata and owner.

## Parameters

| Name            | Required | Description                                |
| --------------- | :------: | ------------------------------------------ |
| `id`            |    ✅    | The id of the asset.                       |
| `options`       |          | Display options object. See [Display Options](/dev-tools/das-api/display-options) for details. |

## Agent Fields (MPL Core)

MPL Core asset responses may include agent-specific fields indexed from the [Agent Registry](/smart-contracts/mpl-agent). These fields are omitted for non-Core interfaces.

| Field | Type | Description |
|-------|------|-------------|
| `is_agent` | `boolean` | `true` when the asset has an `AgentIdentity` external plugin |
| `asset_signer` | `string` | Core Asset Signer PDA — the agent's onchain wallet |
| `agent_token` | `string` | Canonical token mint from the `AgentIdentityV2` PDA; omitted until [`setAgentTokenV1`](/dev-tools/cli/agents/set-agent-token) is called |

See [Read Agent Data](/agents/read-agent-data#read-agent-data-via-das-api) for examples and indexing behavior.

## Playground

{% apiRenderer method="getAsset" /%}
