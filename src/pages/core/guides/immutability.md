---
title: Immutability in MPL Core
metaTitle: Core - Immutability
description: This Guide describes the different immutability layers of MPL Core
---

## What is Immutability?
In the general context of Digital Assets immutability is often used referring to the metadata of a Token or NFT. In the past this was asked for by communities to make sure that a bought Asset can not be changed in the future. With the additional functionality MPL Core offers it can make sense to add additional immutability features. This guide aims to provide information about those different options and how they can be used to tailor the immutability of a digital Asset to the needs of a project.

To understand some of the differentiations below it might be helpful to be familiar with the general MPL Core [plugin functionality](/core/plugins).

## Immutability Options in MPL Core
- **Immutable Metadata**: The [immutableMetadata](/core/plugins/immutableMetadata) allows to make the Name and URI of a Asset, or a whole collection, unchangeable.
- **Forbid adding new Plugins**: Core allows to disallow creators to add additional Plugins to an asset using the [addBlocker](/core/plugins/addBlocker) plugin. Without this Plugin the update authority could add Authority Managed plugins like the royalties plugin. 
- **Plugin Level Immutability**: Some Plugins can have a authority set that is different to the owner or the update authority. When removing this authority this specific plugin can not be changed anymore. This can for example be useful in cases where the creator wants to guarantee the asset owners that the royalties will not change in the future. Removing the authority can either be done on creation of the plugin, or when updating it.
- **Full Immutability**: When removing the update authority of an asset or a collection none of the authority based actions can be triggered anymore. This can for example be changing Metadata or adding authority based Plugins. When aiming for full immutability one has to make sure that also the plugin authorities are removed in addition to the [general authority](/core/update#making-a-core-asset-data-immutable).
