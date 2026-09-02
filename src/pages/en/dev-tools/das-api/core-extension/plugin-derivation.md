---
title: Plugin Derivation
metaTitle: DAS API Core Extension - Plugin Derivation
description: Manually Derive or deactivate automatic derivation
---

The Core DAS Extension allows to automatically derive plugins and inherited plugins. If you want to completely deactivate it or derive manually instead the following code snippets might be helpful.

## Disable Plugin Derivation
If you want to disable this automatic derivation you can use `skipDerivePlugins` in all functions like this:

{% code-tabs-imported from="das-api/core-extension/skip-derive-plugins" frameworks="umi" /%}

## Manual Plugin derivation
You can also manually derive the plugins for the asset if you have already fetched the collection at a prior time using the mpl-core JavaScript SDK like:

{% code-tabs-imported from="das-api/core-extension/manual-plugin-derivation" frameworks="umi" /%}
