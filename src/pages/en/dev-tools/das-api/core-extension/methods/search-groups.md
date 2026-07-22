---
title: Search Core Groups
metaTitle: Search Core Groups | DAS API Core Extension
description: Search mpl-core GroupV1 accounts via DAS and return Core-typed GroupResult values.
created: '07-22-2026'
updated: '07-22-2026'
keywords:
  - das searchGroups
  - mpl-core-das searchGroups
  - GroupV1 search
about:
  - DAS API
  - MPL Core
  - Core Groups
---

## Summary

`das.searchGroups` searches DAS for `MplCoreGroup` interfaces and returns Core-typed groups.

- Filters to Core groups only
- Accepts the same search filters as Core asset search where applicable (for example authority)
- For a single group by address, prefer [`getGroup`](/dev-tools/das-api/core-extension/methods/get-group)
- For update-authority listing, use [`getGroupsByUpdateAuthority`](#by-update-authority)

## Code example

{% code-tabs-imported from="das-api/core-extension/search-groups" frameworks="umi" /%}

## By update authority {% #by-update-authority %}

`das.getGroupsByUpdateAuthority` lists Core groups for a given update authority and returns `GroupResult` values. Pair with [`getAssetsByGroup`](/dev-tools/das-api/core-extension/methods/get-assets-by-group) to list each group's members.

{% code-tabs-imported from="das-api/core-extension/get-groups-by-update-authority" frameworks="umi" /%}

## Notes

- Requires DAS client ≥ 2.1.0 with `MplCoreGroup` indexing.
- Membership vectors on results may be empty — use [`fetchGroupV1`](/smart-contracts/core/groups) for full on-chain membership.
