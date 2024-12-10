---
title: Getting Started
metaTitle: Getting Started | DAS API
description: Installation and setup of the Metaplex DAS API client.
---

The `@metaplex-foundation/digital-asset-standard-api` package can be use to interact with Metaplex DAS API:

The DAS API client is a Umi plugin so you will have to install Umi in conjunction with the DAS API client.

You can install umi and the plugin from the location below.

```js
npm install @metaplex-foundation/umi
npm install @metaplex-foundation/umi-bundle-defaults
npm install @metaplex-foundation/digital-asset-standard-api
```

Once installed you can register the library with your Umi instance.

```js
import { dasApi } from "@metaplex-foundation/digital-asset-standard-api"
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';

const umi = createUmi("exampleDasProvider.com").use(dasApi());
```

The plugin can be used with any RPC that supports the Metaplex DAS API specification – RPCs that support the specification can be found on the [RPC Providers page](/rpc-providers).

Note You might need to contact your RPC provider to "enable" the DAS API on your endpoint.

{% callout title="Metaplex Core DAS API" type="note" %}
If you intend to use DAS on [Metaplex Core](/core) Assets you want to install the additional `@metaplex-foundation/mpl-core-das` package:
{% /callout %}

## DAS for MPL Core

The [DAS Extension](/das-api/core-extension) for [MPL Core](/core) helps directly returns you the correct types to further use with the MPL SDKs. It also automatically derives the plugins in assets inherited from the collection and provides [functions for DAS-to-Core type conversions](/das-api/core-extension/convert-das-asset-to-core).

To use it first install the additional package:

```js
npm install @metaplex-foundation/mpl-core-das
```

Then import that package

```js
import { das } from '@metaplex-foundation/mpl-core-das';
```

After this you can either use the Core specific functions like mentioned above. 