---
title: Core Groups
metaTitle: Core Groups Overview | Metaplex Core
description: An overview of mpl-core GroupV1 accounts — how they group collections, assets, and nested groups for taxonomy.
updated: '07-02-2026'
keywords:
  - mpl-core groups
  - GroupV1
  - taxonomy
  - group collections
about:
  - NFT collections
  - Collection management
proficiencyLevel: Intermediate
faqs:
  - q: What is the difference between a Collection and a Group?
    a: A Collection groups Core Assets under shared metadata and collection-level plugins. A Group is a taxonomy container that can reference collections, standalone assets, and other groups. Collections answer “which series does this NFT belong to?” Groups answer “which higher-level set does this collection or asset belong to?”
  - q: Can a collection belong to multiple groups?
    a: Yes. When a collection is added to a group, mpl-core writes the parent group address into the collection’s Groups plugin. A collection can list multiple parent groups, up to the on-chain vector limit.
  - q: Can groups be nested?
    a: Yes. A group can contain child groups and also list parent groups. Parent/child links are kept in sync on both accounts. A group may belong to up to 8 parent groups.
  - q: Do assets inside a grouped collection automatically belong to the group?
    a: No. Group membership is stored on direct members only. Putting a collection in a group adds the collection to `group.collections` and writes the Groups plugin on the collection. NFTs minted into that collection are not automatically added to `group.assets`.
  - q: Can a standalone asset be a direct member of a group?
    a: Yes. Use `addAssetsToGroup` to add an asset directly to `group.assets` without a collection. Collection-managed assets can also be added explicitly when the correct authority signs.
  - q: Who can modify group membership?
    a: The group update authority signs add/remove instructions. For collection-managed assets, the collection update authority (or an authorized delegate) can add or remove those assets on the group’s behalf.
---

## Summary

**Core Groups** (`GroupV1`) are taxonomy accounts that organize [Collections](/smart-contracts/core/collections), [Assets](/smart-contracts/core/what-is-an-asset), and other groups into higher-level sets — for example a brand umbrella that contains multiple collections, or a curated directory of standalone assets.

- Groups store their own name and URI, like collections
- A group can directly contain up to **256** collections, child groups, parent-group links, or assets per vector
- Collections and assets added to a group receive a **Groups plugin** listing their parent group addresses

**Jump to:** [Create a group](#creating-groups) · [Manage membership](#managing-group-membership) · [Fetch groups](#fetching-groups)

## Collections vs Groups

| | **Collection** | **Group** |
| --- | --- | --- |
| Purpose | Shared metadata and plugins for a series of NFTs | Taxonomy / directory over collections, assets, and groups |
| Owns user NFTs | Yes — assets reference the collection | No — assets remain in their collection (if any) |
| Typical question | “Which series is this NFT from?” | “Which brand, season, or directory includes this collection?” |
| On-chain membership | Asset `updateAuthority` points at the collection | Member listed in `group.collections`, `group.assets`, or `group.groups` |

Use a **Collection** when you need collection-wide royalties, freeze rules, or shared artwork for a mint series. Use a **Group** when you need to organize multiple collections or standalone assets under one label without changing how those assets are minted.

## GroupV1 account

A `GroupV1` account stores:

| Field | Description |
| --- | --- |
| `updateAuthority` | Authority that can update the group and change membership |
| `name` | Display name |
| `uri` | Off-chain JSON metadata URI |
| `collections` | Collections that are **direct** children of this group |
| `groups` | Child groups contained by this group |
| `parentGroups` | Parent groups that contain this group |
| `assets` | Assets that are **direct** members of this group |

On-chain limits (from mpl-core):

- **256** entries max per vector (`collections`, `groups`, `parentGroups`, `assets`)
- **8** parent groups max per group (`MAX_GROUP_NESTING_DEPTH`)

{% callout type="note" %}
Groups do not traverse collection membership automatically. Adding a collection to a group does not add that collection’s NFTs to `group.assets`. To work with NFTs in a grouped collection, operate on the collection and its assets separately.
{% /callout %}

## Groups plugin

When a collection or asset is added to a group, mpl-core ensures a **Groups** authority-managed plugin exists on that member. The plugin stores the parent group public keys.

The Groups plugin also blocks burning a **group member itself** (the collection account or a directly grouped asset) while it still belongs to at least one group. Burning an asset inside a grouped collection does not remove the collection from the group.

## Creating groups

Use `createGroup` / `createGroupV1` to deploy a new group account:

{% code-tabs-imported from="core/create-group" frameworks="umi" /%}

You can optionally pass `relationships` at creation time to link collections, child groups, parent groups, or assets in one transaction. Each relationship entry uses `RelationshipKind`: `Collection`, `ChildGroup`, `ParentGroup`, or `Asset`.

## Managing group membership

All membership changes are signed by the **group update authority** unless noted.

| Operation | SDK helper | What it updates |
| --- | --- | --- |
| Add collections | `addCollectionsToGroup` | Group `collections` + collection Groups plugin |
| Remove collections | `removeCollectionsFromGroup` | Both sides |
| Add assets | `addAssetsToGroup` | Group `assets` + asset Groups plugin |
| Remove assets | `removeAssetsFromGroup` | Both sides |
| Add child groups | `addGroupsToGroup` | Parent `groups` + child `parentGroups` |
| Remove child groups | `removeGroupsFromGroup` | Both sides |
| Update metadata / authority | `updateGroup` | Group name, URI, update authority |
| Close empty group | `closeGroup` | Closes the group account |

### Add a collection to a group

{% code-tabs-imported from="core/add-collection-to-group" frameworks="umi" /%}

### Add a standalone asset to a group

{% code-tabs-imported from="core/add-asset-to-group" frameworks="umi" /%}

### Nest groups

{% code-tabs-imported from="core/nest-groups" frameworks="umi" /%}

Parent and child vectors stay synchronized: the parent lists the child in `groups`, and the child lists the parent in `parentGroups`.

## Fetching groups

Use the mpl-core SDK to read on-chain state:

{% code-tabs-imported from="core/fetch-group" frameworks="umi" /%}

To list all groups for an update authority, use `getGroupV1GpaBuilder` (a GPA query — fine for groups, but prefer DAS for large asset scans):

{% code-tabs-imported from="core/fetch-groups-by-authority" frameworks="umi" /%}

## Quick reference

### Program ID

| Network | Address |
| --- | --- |
| Mainnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |
| Devnet | `CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d` |

### SDK helpers

| Task | Function |
| --- | --- |
| Create | `createGroup` |
| Fetch | `fetchGroupV1` |
| List by authority | `getGroupV1GpaBuilder` |
| Update | `updateGroup` |
| Add collection | `addCollectionsToGroup` |
| Add asset | `addAssetsToGroup` |
| Nest group | `addGroupsToGroup` |
| Close | `closeGroup` |
