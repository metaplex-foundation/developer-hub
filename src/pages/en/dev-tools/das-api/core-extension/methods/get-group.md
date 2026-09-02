---
title: Get Core Group
metaTitle: Get Core Group | DAS API Core Extension
description: Fetch a single mpl-core GroupV1 account via DAS as a Core-typed GroupResult.
created: '07-22-2026'
updated: '07-22-2026'
keywords:
  - das getGroup
  - mpl-core-das getGroup
  - GroupV1
about:
  - DAS API
  - MPL Core
  - Core Groups
---

## Summary

`das.getGroup` fetches one [mpl-core GroupV1](/smart-contracts/core/groups) by public key and returns a `GroupResult`.

- Typed for use with MPL Core SDKs
- Membership vectors may be empty depending on the indexer
- Prefer [`fetchGroupV1`](/smart-contracts/core/groups) when you need authoritative on-chain `collections` / `groups` / `assets` / `parentGroups`

## Code example

{% code-tabs-imported from="das-api/core-extension/get-group" frameworks="umi" /%}

## Notes

- Interface must be `MplCoreGroup` or the helper throws.
- To list members of the group, use [`getAssetsByGroup`](/dev-tools/das-api/core-extension/methods/get-assets-by-group).
